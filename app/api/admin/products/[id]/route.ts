import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminApi, requireAdminMutation } from "@/lib/require-admin";
import { mutationErrorResponse, parseJsonBody } from "@/lib/api";
import { productDivisions } from "@/lib/divisions";
import { prisma } from "@/lib/prisma";
import { updateProductSchema } from "@/lib/validators/product";

type RouteContext = { params: Promise<{ id: string }> };

function revalidateProductPaths(slug?: string) {
  revalidateTag("products", "max");
  revalidatePath("/");
  revalidatePath("/products");
  for (const division of productDivisions) {
    revalidatePath(`/divisions/${division.slug}`);
  }
  if (slug) {
    revalidatePath(`/products/${slug}`);
  }
}

export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  const adminCheck = await requireAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;
  const { id } = await params;
  try {
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
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  const adminCheck = await requireAdminMutation(req);
  if (adminCheck instanceof NextResponse) return adminCheck;
  const { id } = await params;

  try {
    const parsed = await parseJsonBody(req, updateProductSchema);
    if (!parsed.success) return parsed.response;
    const validated = parsed.data;
    const {
      categoryId,
      moleculeIds,
      mrpPaise,
      priceSuffix,
      mrpSuffix,
      imageUrl1,
      imageUrl2,
      imageUrl3,
      ...productData
    } = validated;

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const product = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          ...productData,
          mrpPaise: mrpPaise ?? null,
          priceSuffix: priceSuffix ?? null,
          mrpSuffix: mrpSuffix ?? null,
          imageUrl1: imageUrl1 ?? null,
          imageUrl2: imageUrl2 ?? null,
          imageUrl3: imageUrl3 ?? null,
          ...(categoryId !== undefined
            ? {
                category: categoryId
                  ? {
                      connect: { id: categoryId },
                    }
                  : {
                      disconnect: true,
                    },
              }
            : {}),
        },
      });

      if (moleculeIds !== undefined) {
        await tx.productMolecule.deleteMany({
          where: { productId: id },
        });

        if (moleculeIds.length > 0) {
          await tx.productMolecule.createMany({
            data: moleculeIds.map((moleculeId) => ({
              productId: id,
              moleculeId,
            })),
          });
        }
      }

      return tx.product.findUniqueOrThrow({
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
    });

    revalidateProductPaths(existing.slug);
    revalidateProductPaths(product.slug);

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return mutationErrorResponse(error, "Failed to update product");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  const adminCheck = await requireAdminMutation(req);
  if (adminCheck instanceof NextResponse) return adminCheck;
  const { id } = await params;

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidateProductPaths(existing.slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return mutationErrorResponse(error, "Failed to delete product");
  }
}
