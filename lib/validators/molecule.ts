import { z } from "zod";

export const createMoleculeSchema = z.object({
  name: z.string().min(1, "Molecule name is required"),
  slug: z.string().min(1, "Slug is required"),
  synonyms: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  isPublished: z.boolean().default(true),
  overview: z.string().optional(),
  backgroundAndApproval: z.string().optional(),
  uses: z.string().optional(),
  administration: z.string().optional(),
  sideEffects: z.string().optional(),
  warnings: z.string().optional(),
  precautions: z.string().optional(),
  expertTips: z.string().optional(),
  faqs: z.string().optional(),
  references: z.string().optional(),
});

export const updateMoleculeSchema = createMoleculeSchema.partial();

export type CreateMoleculeInput = z.infer<typeof createMoleculeSchema>;
export type UpdateMoleculeInput = z.infer<typeof updateMoleculeSchema>;
