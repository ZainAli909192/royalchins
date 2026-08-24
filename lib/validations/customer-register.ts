import { z } from "zod";
export const customerRegisterSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  password: z.string().min(8, "Password must contain at least 8 characters."),
  passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match.",
  path: ["passwordConfirmation"],
});
export type CustomerRegisterFormValues = z.infer<typeof customerRegisterSchema>;
