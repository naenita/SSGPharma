import { NextRequest, NextResponse } from "next/server";
import { internalServerError, parseJsonBody } from "@/lib/api";
import { requireAdminApi } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validators/product";

export async function GET(): Promise<Response> {
  try {
    const denied = await requireAdminApi();
    if (denied) return denied;

    const products = await prisma.product.findMany({
      include: {
        category: true,
        molecules: {
          include: {
            molecule: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch {
    return internalServerError();
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const adminCheck = await requireAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const parsed = await parseJsonBody(req, createProductSchema);
    if (!parsed.success) {
      return parsed.response;
    }
    const validated = parsed.data;
    const { moleculeIds, ...productData } = validated;

    const product = await prisma.product.create({
      data: {
        ...productData,
        categoryId: productData.categoryId || null,
        mrpPaise: productData.mrpPaise || null,
        imageUrl1: productData.imageUrl1 || null,
        imageUrl2: productData.imageUrl2 || null,
        imageUrl3: productData.imageUrl3 || null,
      },
    });

    if (moleculeIds.length > 0) {
      await prisma.productMolecule.createMany({
        data: moleculeIds.map((moleculeId) => ({
          productId: product.id,
          moleculeId,
        })),
      });
    }

    const fullProduct = await prisma.product.findUniqueOrThrow({
      where: { id: product.id },
      include: {
        category: true,
        molecules: {
          include: {
            molecule: true,
          },
        },
      },
    });

    return NextResponse.json(fullProduct, { status: 201 });
  } catch {
    return internalServerError();
  }
}
