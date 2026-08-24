import { z } from "zod";
export const adminChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(8, "New password must contain at least 8 characters."),
  confirmPassword: z.string().min(1, "Please confirm your new password."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});
export type AdminChangePasswordFormValues = z.infer<typeof adminChangePasswordSchema>;
