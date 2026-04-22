import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin-session";
import { internalServerError } from "@/lib/api";
import { requireAdminApi } from "@/lib/require-admin";

export async function POST(): Promise<Response> {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    await clearAdminSessionCookie();
    return NextResponse.json({ ok: true });
  } catch {
    return internalServerError();
  }
}
