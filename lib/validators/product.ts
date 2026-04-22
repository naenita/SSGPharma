import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  categoryId: z.string().optional().nullable(),
  manufacturer: z.string().optional(),
  isActive: z.boolean().default(true),
  pricePaise: z.number().int().min(0, "Price must be non-negative"),
  mrpPaise: z.number().int().min(0).optional().nullable(),
  dosage: z.string().optional(),
  packSize: z.string().optional(),
  salts: z.string().optional(),
  description: z.string().optional(),
  keyBenefits: z.string().optional(),
  goodToKnow: z.string().optional(),
  dietType: z.string().optional(),
  productForm: z.string().optional(),
  allergiesInformation: z.string().optional(),
  directionForUse: z.string().optional(),
  safetyInformation: z.string().optional(),
  schema: z.string().optional(),
  specialBenefitSchemes: z.string().optional(),
  faqs: z.string().optional(),
  imageUrl1: z.string().url().optional().nullable(),
  imageUrl2: z.string().url().optional().nullable(),
  imageUrl3: z.string().url().optional().nullable(),
  moleculeIds: z.array(z.string()).optional().default([]),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
