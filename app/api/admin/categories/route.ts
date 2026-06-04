import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminApi, requireAdminMutation } from "@/lib/require-admin";
import { mutationErrorResponse, parseJsonBody } from "@/lib/api";
import { productDivisions } from "@/lib/divisions";
import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "@/lib/validators/category";

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

export async function GET() {
  const adminCheck = await requireAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      take: 200,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const adminCheck = await requireAdminMutation(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const parsed = await parseJsonBody(req, createCategorySchema);
    if (!parsed.success) return parsed.response;
    const validated = parsed.data;

    const category = await prisma.category.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        isActive: validated.isActive,
      },
    });

    revalidateCatalogPaths();

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return mutationErrorResponse(error, "Failed to create category");
  }
}
