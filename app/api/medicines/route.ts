import { NextResponse } from "next/server";
import { internalServerError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

/** Public catalog — no auth. Used by the storefront. */
export async function GET(): Promise<Response> {
  try {
    const items = await prisma.product.findMany({
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        salts: true,
        manufacturer: true,
        description: true,
        imageUrl1: true,
        pricePaise: true,
        isActive: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    return NextResponse.json(items);
  } catch {
    return internalServerError();
  }
}
