import { NextRequest, NextResponse } from "next/server";
import { internalServerError, parseJsonBody } from "@/lib/api";
import { requireAdminApi } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { updateProductSchema } from "@/lib/validators/product";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _req: NextRequest,
  { params }: RouteContext
): Promise<Response> {
  try {
    const denied = await requireAdminApi();
    if (denied) return denied;

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        molecules: {
          include: {
            molecule: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
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
    const parsed = await parseJsonBody(req, updateProductSchema);
    if (!parsed.success) {
      return parsed.response;
    }
    const validated = parsed.data;
    const { moleculeIds, ...productData } = validated;

    await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        categoryId: productData.categoryId || null,
        mrpPaise: productData.mrpPaise || null,
        imageUrl1: productData.imageUrl1 || null,
        imageUrl2: productData.imageUrl2 || null,
        imageUrl3: productData.imageUrl3 || null,
      },
    });

    if (moleculeIds) {
      await prisma.productMolecule.deleteMany({
        where: { productId: id },
      });

      if (moleculeIds.length > 0) {
        await prisma.productMolecule.createMany({
          data: moleculeIds.map((moleculeId) => ({
            productId: id,
            moleculeId,
          })),
        });
      }
    }

    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
      include: {
        category: true,
        molecules: {
          include: {
            molecule: true,
          },
        },
      },
    });

    return NextResponse.json(product);
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
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return internalServerError();
  }
}
