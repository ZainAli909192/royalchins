import { z } from "zod";
export const customerForgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email address is required.").email("Please enter a valid email address."),
});
export type CustomerForgotPasswordFormValues = z.infer<typeof customerForgotPasswordSchema>;
