import { z } from "zod";
export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().optional(),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;
