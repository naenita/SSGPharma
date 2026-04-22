import { z } from "zod";

export const adminLoginSchema = z.object({
  password: z.string().trim().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().trim().min(1, "Current password is required"),
  newPassword: z.string().trim().min(8, "Password must be at least 8 characters"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
