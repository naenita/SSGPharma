import { NextRequest, NextResponse } from "next/server";
import { internalServerError, parseJsonBody } from "@/lib/api";
import { requireAdminApi } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { createContactPhoneSchema } from "@/lib/validators/contact";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
): Promise<Response> {
  const adminCheck = await requireAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const { id } = await params;
    const parsed = await parseJsonBody(req, createContactPhoneSchema);
    if (!parsed.success) {
      return parsed.response;
    }
    const validated = parsed.data;

    const phone = await prisma.contactPhone.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(phone);
  } catch {
    return internalServerError();
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
): Promise<Response> {
  const adminCheck = await requireAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const { id } = await params;
    await prisma.contactPhone.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return internalServerError();
  }
}
