import { z } from "zod";
export const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required."),
  slug: z.string().trim().optional(),
  type: z.enum(["Animal", "Accessory"]),
  description: z.string().trim().optional(),
  isActive: z.boolean(),
});
export type CategoryFormValues = z.infer<typeof categorySchema>;
