import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";
import { getProductDivision } from "@/lib/divisions";
import { prisma } from "@/lib/prisma";

export const PRODUCT_PAGE_SIZE = 20;

export const productListSelect = {
  id: true,
  slug: true,
  name: true,
  salts: true,
  manufacturer: true,
  description: true,
  imageUrl1: true,
  imageUrl2: true,
  imageUrl3: true,
  isActive: true,
  pricePaise: true,
  priceSuffix: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.ProductSelect;

export const compactProductSelect = {
  id: true,
  slug: true,
  name: true,
  manufacturer: true,
  dosage: true,
  description: true,
  pricePaise: true,
  priceSuffix: true,
  category: {
    select: {
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.ProductSelect;

function clampPage(page: number | null | undefined) {
  return Math.max(1, Math.floor(page || 1));
}

function buildProductWhere(divisionSlug?: string, query?: string): Prisma.ProductWhereInput {
  const normalizedQuery = query?.trim() ?? "";
  const division = divisionSlug ? getProductDivision(divisionSlug) : undefined;

  return {
    ...(division
      ? {
          category: {
            is: {
              OR: [{ slug: division.slug }, { name: division.catalogCategory }],
            },
          },
        }
      : {}),
    ...(normalizedQuery
      ? {
          OR: [
            { name: { contains: normalizedQuery } },
            { salts: { contains: normalizedQuery } },
            { manufacturer: { contains: normalizedQuery } },
            { category: { is: { name: { contains: normalizedQuery } } } },
          ],
        }
      : {}),
  };
}

export const getCachedHomepageProducts = unstable_cache(
  async () => {
    const [products, productCount] = await Promise.all([
      prisma.product.findMany({
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
        take: 80,
        select: compactProductSelect,
      }),
      prisma.product.count(),
    ]);

    return { products, productCount };
  },
  ["homepage-products"],
  { revalidate: 3600, tags: ["products"] },
);

export const getCachedProductsPageData = unstable_cache(
  async ({ divisionSlug, query, page }: { divisionSlug?: string; query?: string; page?: number }) => {
    const normalizedQuery = query?.trim() ?? "";
    const currentPage = clampPage(page);
    const division = divisionSlug ? getProductDivision(divisionSlug) : undefined;
    const where = buildProductWhere(division?.slug, normalizedQuery);

    const [items, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
        skip: (currentPage - 1) * PRODUCT_PAGE_SIZE,
        take: PRODUCT_PAGE_SIZE,
        select: productListSelect,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PRODUCT_PAGE_SIZE));

    return {
      division,
      items,
      query: normalizedQuery,
      page: Math.min(currentPage, totalPages),
      totalCount,
      totalPages,
    };
  },
  ["products-page-data"],
  { revalidate: 3600, tags: ["products"] },
);

export const getCachedDivisionProducts = unstable_cache(
  async ({ slug, page }: { slug: string; page?: number }) => {
    const division = getProductDivision(slug);
    if (!division) return null;

    const currentPage = clampPage(page);
    const where: Prisma.ProductWhereInput = {
      category: {
        is: {
          OR: [{ slug: division.slug }, { name: division.catalogCategory }],
        },
      },
    };

    const [items, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
        skip: (currentPage - 1) * PRODUCT_PAGE_SIZE,
        take: PRODUCT_PAGE_SIZE,
        select: productListSelect,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PRODUCT_PAGE_SIZE));

    return {
      division,
      items,
      page: Math.min(currentPage, totalPages),
      totalCount,
      totalPages,
    };
  },
  ["division-products"],
  { revalidate: 3600, tags: ["products"] },
);
