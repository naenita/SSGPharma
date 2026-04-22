import { z } from "zod";

export const createContactPhoneSchema = z.object({
  value: z.string().regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),
  purpose: z.enum(["sales", "support", "procurement", "emergency"]),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  priority: z.number().int().default(0),
});

export const createContactEmailSchema = z.object({
  value: z.string().email("Invalid email address"),
  type: z.enum(["general", "procurement", "support", "sales", "inquiry_recipient"]),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  priority: z.number().int().default(0),
});

export const updateContactConfigSchema = z.object({
  companyName: z.string().optional(),
  businessType: z.string().optional(),
  officeAddress: z.string().optional(),
  officeCity: z.string().optional(),
  officeState: z.string().optional(),
  officeZipCode: z.string().optional(),
  businessHoursStart: z.string().optional(),
  businessHoursEnd: z.string().optional(),
  businessDaysMonFri: z.boolean().optional(),
  businessDaysSat: z.boolean().optional(),
  businessDaysSun: z.boolean().optional(),
});

export type CreateContactPhoneInput = z.infer<typeof createContactPhoneSchema>;
export type CreateContactEmailInput = z.infer<typeof createContactEmailSchema>;
export type UpdateContactConfigInput = z.infer<typeof updateContactConfigSchema>;
