import { NextResponse } from "next/server";
import { internalServerError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";

export async function GET(): Promise<Response> {
  try {
    const denied = await requireAdminApi();
    if (denied) return denied;

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(inquiries);
  } catch {
    return internalServerError();
  }
}
