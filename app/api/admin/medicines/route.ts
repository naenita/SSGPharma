import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { internalServerError, parseJsonBody } from "@/lib/api";
import { medicineCreateSchema } from "@/lib/validators/medicine";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { slugify } from "@/lib/slug";

async function resolveCategoryId(category: string | null | undefined) {
  const trimmed = category?.trim();
  if (!trimmed) return null;

  const slug = slugify(trimmed) || "general";
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ slug }, { name: trimmed }],
    },
  });

  if (existing) return existing.id;

  const created = await prisma.category.create({
    data: {
      name: trimmed,
      slug,
      isActive: true,
    },
  });

  return created.id;
}

function mapProductToMedicine(product: {
  id: string;
  name: string;
  slug: string;
  salts: string | null;
  manufacturer: string | null;
  description: string | null;
  imageUrl1: string | null;
  pricePaise: number;
  isActive: boolean;
  category: { name: string } | null;
}) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    salts: product.salts ?? "",
    category: product.category?.name ?? null,
    manufacturer: product.manufacturer,
    description: product.description,
    imageUrl: product.imageUrl1,
    pricePaise: product.pricePaise,
    inStock: product.isActive,
  };
}

export async function POST(request: Request): Promise<Response> {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const parsed = await parseJsonBody(request, medicineCreateSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const data = parsed.data;
    let base = slugify(data.name);
    if (!base) base = "medicine";

    let slug = base;
    let suffix = 0;
    while (await prisma.product.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${base}-${suffix}`;
    }

    const categoryId = await resolveCategoryId(data.category);

    const created = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        salts: data.salts,
        categoryId,
        manufacturer: data.manufacturer?.trim() || null,
        description: data.description?.trim() || null,
        imageUrl1: data.imageUrl || null,
        pricePaise: data.pricePaise,
        isActive: data.inStock,
      },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/products");

    return NextResponse.json(mapProductToMedicine(created), { status: 201 });
  } catch {
    return internalServerError();
  }
}
