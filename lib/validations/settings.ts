import { z } from "zod";
const brandSchema = z.object({ storeName: z.string().trim().min(1), logo: z.string(), primaryColor: z.string().trim().min(1), secondaryColor: z.string().trim().min(1), textColor: z.string().trim().min(1) });

export const settingsSchema = z.object({
  brand: brandSchema,
  adminBrand: brandSchema,
  contact: z.object({ email: z.string().trim().email("Please enter a valid email address."), phone: z.string().trim().min(1), whatsapp: z.string().trim(), instagram: z.string().trim() }),
  inventory: z.object({ lowStockThreshold: z.coerce.number().int().nonnegative(), hideOutOfStock: z.boolean() }),
  reviews: z.object({ autoApproveReviews: z.boolean() }),
});
export type SettingsFormValues = z.infer<typeof settingsSchema>;
