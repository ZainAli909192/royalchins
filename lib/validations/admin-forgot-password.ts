import { z } from "zod";
export const adminForgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email address is required.").email("Please enter a valid email address."),
});
export type AdminForgotPasswordFormValues = z.infer<typeof adminForgotPasswordSchema>;
