import { NextRequest, NextResponse } from "next/server";
import { internalServerError, parseJsonBody } from "@/lib/api";
import { requireAdminApi } from "@/lib/require-admin";
import { ensureContactConfig } from "@/lib/contact-config";
import { prisma } from "@/lib/prisma";
import { createContactEmailSchema } from "@/lib/validators/contact";

export async function POST(req: NextRequest): Promise<Response> {
  const adminCheck = await requireAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const parsed = await parseJsonBody(req, createContactEmailSchema);
    if (!parsed.success) {
      return parsed.response;
    }
    const validated = parsed.data;

    const config = await ensureContactConfig();

    const email = await prisma.contactEmail.create({
      data: {
        configId: config.id,
        ...validated,
      },
    });

    return NextResponse.json(email, { status: 201 });
  } catch {
    return internalServerError();
  }
}
