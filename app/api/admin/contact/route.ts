import { NextRequest, NextResponse } from "next/server";
import { internalServerError, parseJsonBody } from "@/lib/api";
import { requireAdminApi } from "@/lib/require-admin";
import { ensureContactConfig, getContactConfig } from "@/lib/contact-config";
import { prisma } from "@/lib/prisma";
import { updateContactConfigSchema } from "@/lib/validators/contact";

export async function GET(): Promise<Response> {
  try {
    const denied = await requireAdminApi();
    if (denied) return denied;

    const fullConfig = await getContactConfig({ includeInactive: true });
    return NextResponse.json(fullConfig);
  } catch {
    return internalServerError();
  }
}

export async function PATCH(req: NextRequest): Promise<Response> {
  const adminCheck = await requireAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const parsed = await parseJsonBody(req, updateContactConfigSchema);
    if (!parsed.success) {
      return parsed.response;
    }
    const validated = parsed.data;

    const config = await ensureContactConfig();

    const updated = await prisma.contactConfig.update({
      where: { id: config.id },
      data: validated,
      include: {
        phones: true,
        emails: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return internalServerError();
  }
}
