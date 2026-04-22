import { z } from "zod";

export const medicineCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  salts: z.string().trim().min(1, "Salts / composition is required"),
  category: z.string().trim().nullish(),
  manufacturer: z.string().trim().nullish(),
  description: z.string().trim().nullish(),
  imageUrl: z.string().url().nullish(),
  pricePaise: z.number().int().positive(),
  inStock: z.boolean(),
});

export const medicineUpdateSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    salts: z.string().trim().min(1).optional(),
    category: z.string().trim().nullish(),
    manufacturer: z.string().trim().nullish(),
    description: z.string().trim().nullish(),
    imageUrl: z.string().url().nullish().optional(),
    pricePaise: z.number().int().positive().optional(),
    inStock: z.boolean().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "Nothing to update" });
