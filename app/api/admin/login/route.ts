import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { parseJsonBody, internalServerError } from "@/lib/api";
import { getAdminPasswordFallback, getAdminPasswordHash, getAdminSessionSecret } from "@/lib/admin-env";
import { adminPasswordMatches } from "@/lib/auth-password";
import { setAdminSessionCookie } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/validators/auth";

const loginAttempts = new Map<string, { count: number; reset: number }>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = loginAttempts.get(ip);
  if (!current || current.reset <= now) {
    loginAttempts.set(ip, { count: 1, reset: now + 15 * 60 * 1000 });
    return false;
  }
  if (current.count >= 10) {
    return true;
  }
  current.count += 1;
  loginAttempts.set(ip, current);
  return false;
}

function clearRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: Request): Promise<Response> {
  const secret = getAdminSessionSecret();
  if (secret.length < 32) {
    return NextResponse.json(
      { error: "Server misconfigured: ADMIN_SESSION_SECRET must be at least 32 characters in .env" },
      { status: 500 },
    );
  }

  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
    }

    const parsed = await parseJsonBody(request, adminLoginSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { password } = parsed.data;
    const dbAdmin = await prisma.adminUser.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      select: { passwordHash: true },
    });
    const envHash = getAdminPasswordHash();
    const envFallback = getAdminPasswordFallback();
    const passwordMatches = dbAdmin
      ? await bcrypt.compare(password, dbAdmin.passwordHash)
      : envHash
        ? await bcrypt.compare(password, envHash)
        : envFallback
          ? await adminPasswordMatches(password, envFallback)
          : false;

    if (!passwordMatches) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    await setAdminSessionCookie();
    clearRateLimit(ip);

    return NextResponse.json({ ok: true });
  } catch {
    return internalServerError();
  }
}
