import { z } from "zod";
export const adminResetPasswordSchema = z.object({
  password: z.string().min(8, "Password must contain at least 8 characters."),
  passwordConfirmation: z.string().min(1, "Please confirm your password."),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match.",
  path: ["passwordConfirmation"],
});
export type AdminResetPasswordFormValues = z.infer<typeof adminResetPasswordSchema>;
