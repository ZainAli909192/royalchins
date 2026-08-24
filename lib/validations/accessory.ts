import { z } from "zod";
export const accessorySchema = z.object({
  name: z.string().trim().min(1, "Accessory name is required."),
  price: z.coerce.number().nonnegative("Price cannot be negative."),
  quantity: z.coerce.number().int().nonnegative("Quantity cannot be negative."),
  description: z.string().trim().optional(),
  isActive: z.boolean().default(true),
});
export type AccessoryFormValues = z.infer<typeof accessorySchema>;
