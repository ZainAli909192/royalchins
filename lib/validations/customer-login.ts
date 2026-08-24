import { z } from "zod";
export const customerLoginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});
export type CustomerLoginFormValues = z.infer<typeof customerLoginSchema>;
