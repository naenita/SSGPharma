import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getAdminSessionSecret } from "@/lib/admin-env";

/** Separate from the old iron-session cookie so stale seals do not confuse the browser. */
export const ADMIN_COOKIE = "medipro_admin_v2";

function requireSecret() {
  const s = getAdminSessionSecret();
  if (s.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.");
  }
  return s;
}

/** Mint a signed token: base64url(payload).hmac — no external session library. */
export function createAdminSessionToken() {
  const secret = requireSecret();
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
  const nonce = randomBytes(12).toString("hex");
  const payload = Buffer.from(JSON.stringify({ exp, n: nonce, p: "admin" }), "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(token: string) {
  const secret = getAdminSessionSecret();
  if (secret.length < 32) return false;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (sig.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: number;
      p?: string;
    };
    return data.p === "admin" && typeof data.exp === "number" && data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  const raw = jar.get(ADMIN_COOKIE)?.value;
  if (!raw) return false;
  return verifyAdminSessionToken(raw);
}

export async function setAdminSessionCookie() {
  const jar = await cookies();
  const token = createAdminSessionToken();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSessionCookie() {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
