import { NextRequest, NextResponse } from "next/server";
import { internalServerError, parseJsonBody } from "@/lib/api";
import { requireAdminApi } from "@/lib/require-admin";
import { productDivisions } from "@/lib/divisions";
import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "@/lib/validators/category";

export async function GET(): Promise<Response> {
  try {
    const denied = await requireAdminApi();
    if (denied) return denied;

    let categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
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

    if (categories.length === 0) {
      await prisma.category.createMany({
        data: productDivisions.map((division) => ({
          name: division.title,
          slug: division.slug,
          description: division.blurb,
          isActive: true,
        })),
      });

      categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
      });
    }

    return NextResponse.json(categories);
  } catch {
    return internalServerError();
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const adminCheck = await requireAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const parsed = await parseJsonBody(req, createCategorySchema);
    if (!parsed.success) {
      return parsed.response;
    }
    const validated = parsed.data;

    const category = await prisma.category.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        isActive: validated.isActive,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return internalServerError();
  }
}
