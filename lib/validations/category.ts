import { z } from "zod";
export const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required."),
  slug: z.string().trim().optional(),
  isActive: z.boolean().default(true),
});
export type CategoryFormValues = z.infer<typeof categorySchema>;
