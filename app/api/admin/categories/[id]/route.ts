import { NextRequest, NextResponse } from "next/server";
import { internalServerError, parseJsonBody } from "@/lib/api";
import { requireAdminApi } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { updateCategorySchema } from "@/lib/validators/category";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _req: NextRequest,
  { params }: RouteContext
): Promise<Response> {
  try {
    const denied = await requireAdminApi();
    if (denied) return denied;

    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch {
    return internalServerError();
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
): Promise<Response> {
  const adminCheck = await requireAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const { id } = await params;
    const parsed = await parseJsonBody(req, updateCategorySchema);
    if (!parsed.success) {
      return parsed.response;
    }
    const validated = parsed.data;

    const category = await prisma.category.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(category);
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
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return internalServerError();
  }
}
