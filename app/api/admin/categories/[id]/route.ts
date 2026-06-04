import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminApi, requireAdminMutation } from "@/lib/require-admin";
import { mutationErrorResponse, parseJsonBody } from "@/lib/api";
import { productDivisions } from "@/lib/divisions";
import { prisma } from "@/lib/prisma";
import { updateCategorySchema } from "@/lib/validators/category";

type RouteContext = { params: Promise<{ id: string }> };

function revalidateCatalogPaths(productSlugs: string[] = []) {
  revalidateTag("products", "max");
  revalidatePath("/products");
  for (const division of productDivisions) {
    revalidatePath(`/divisions/${division.slug}`);
  }
  for (const slug of new Set(productSlugs)) {
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
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
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
    const parsed = await parseJsonBody(req, updateCategorySchema);
    if (!parsed.success) return parsed.response;
    const validated = parsed.data;
    const existing = await prisma.category.findUnique({
      where: { id },
      select: {
        products: {
          select: {
            slug: true,
          },
        },
      },
    });

    const category = await prisma.category.update({
      where: { id },
      data: validated,
    });

    revalidateCatalogPaths(existing?.products.map((product) => product.slug) ?? []);

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return mutationErrorResponse(error, "Failed to update category");
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
    const existing = await prisma.category.findUnique({
      where: { id },
      select: {
        products: {
          select: {
            slug: true,
          },
        },
      },
    });

    await prisma.category.delete({
      where: { id },
    });

    revalidateCatalogPaths(existing?.products.map((product) => product.slug) ?? []);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return mutationErrorResponse(error, "Failed to delete category");
  }
}
