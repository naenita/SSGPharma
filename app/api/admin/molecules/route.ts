import { NextRequest, NextResponse } from "next/server";
import { internalServerError, parseJsonBody } from "@/lib/api";
import { requireAdminApi } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { createMoleculeSchema } from "@/lib/validators/molecule";

export async function GET(): Promise<Response> {
  try {
    const denied = await requireAdminApi();
    if (denied) return denied;

    const molecules = await prisma.molecule.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(molecules);
  } catch {
    return internalServerError();
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const adminCheck = await requireAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const parsed = await parseJsonBody(req, createMoleculeSchema);
    if (!parsed.success) {
      return parsed.response;
    }
    const validated = parsed.data;

    const molecule = await prisma.molecule.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        synonyms: validated.synonyms,
        imageUrl: validated.imageUrl || null,
        isPublished: validated.isPublished,
        overview: validated.overview,
        backgroundAndApproval: validated.backgroundAndApproval,
        uses: validated.uses,
        administration: validated.administration,
        sideEffects: validated.sideEffects,
        warnings: validated.warnings,
        precautions: validated.precautions,
        expertTips: validated.expertTips,
        faqs: validated.faqs,
        references: validated.references,
      },
    });

    return NextResponse.json(molecule, { status: 201 });
  } catch {
    return internalServerError();
  }
}
