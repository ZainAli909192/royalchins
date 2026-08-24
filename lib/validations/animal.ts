import { z } from "zod";
export const animalSchema = z.object({
  name: z.string().trim().min(1, "Animal name is required."),
  categoryId: z.union([z.string(), z.number()]),
  price: z.coerce.number().nonnegative("Price cannot be negative."),
  quantity: z.coerce.number().int().nonnegative("Quantity cannot be negative."),
  description: z.string().trim().optional(),
  isActive: z.boolean().default(true),
});
export type AnimalFormValues = z.infer<typeof animalSchema>;
