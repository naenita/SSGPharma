import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { internalServerError, parseJsonBody } from "@/lib/api";
import { medicineUpdateSchema } from "@/lib/validators/medicine";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { slugify } from "@/lib/slug";

type Ctx = { params: Promise<{ id: string }> };

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

export async function PATCH(request: Request, ctx: Ctx): Promise<Response> {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await ctx.params;
    const parsed = await parseJsonBody(request, medicineUpdateSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = parsed.data;
    let slug = existing.slug;
    if (data.name && data.name !== existing.name) {
      let base = slugify(data.name);
      if (!base) base = "medicine";
      slug = base;
      let suffix = 0;
      while (true) {
        const clash = await prisma.product.findUnique({ where: { slug } });
        if (!clash || clash.id === id) break;
        suffix += 1;
        slug = `${base}-${suffix}`;
      }
    }

    const categoryId = data.category !== undefined ? await resolveCategoryId(data.category) : undefined;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(slug !== existing.slug && { slug }),
        ...(data.salts !== undefined && { salts: data.salts }),
        ...(data.category !== undefined && { categoryId }),
        ...(data.manufacturer !== undefined && { manufacturer: data.manufacturer?.trim() || null }),
        ...(data.description !== undefined && { description: data.description?.trim() || null }),
        ...(data.imageUrl !== undefined && { imageUrl1: data.imageUrl || null }),
        ...(data.pricePaise !== undefined && { pricePaise: data.pricePaise }),
        ...(data.inStock !== undefined && { isActive: data.inStock }),
      },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/products");

    return NextResponse.json(mapProductToMedicine(updated));
  } catch {
    return internalServerError();
  }
}

export async function DELETE(_request: Request, ctx: Ctx): Promise<Response> {
  const denied = await requireAdminApi();
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    await prisma.product.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  revalidatePath("/products");

  return NextResponse.json({ ok: true });
}
