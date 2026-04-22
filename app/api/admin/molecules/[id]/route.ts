import { NextRequest, NextResponse } from "next/server";
import { internalServerError, parseJsonBody } from "@/lib/api";
import { requireAdminApi } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { updateMoleculeSchema } from "@/lib/validators/molecule";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _req: NextRequest,
  { params }: RouteContext
): Promise<Response> {
  try {
    const denied = await requireAdminApi();
    if (denied) return denied;

    const { id } = await params;
    const molecule = await prisma.molecule.findUnique({
      where: { id },
    });

    if (!molecule) {
      return NextResponse.json(
        { error: "Molecule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(molecule);
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
    const parsed = await parseJsonBody(req, updateMoleculeSchema);
    if (!parsed.success) {
      return parsed.response;
    }
    const validated = parsed.data;

    const molecule = await prisma.molecule.update({
      where: { id },
      data: {
        ...validated,
        imageUrl: validated.imageUrl || null,
      },
    });

    return NextResponse.json(molecule);
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
    await prisma.molecule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return internalServerError();
  }
}
