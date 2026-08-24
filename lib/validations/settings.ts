import { z } from "zod";
export const settingsSchema = z.object({
  contactEmail: z.string().trim().email("Please enter a valid email address.").optional().or(z.literal("")),
  whatsapp: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  lowStockThreshold: z.coerce.number().int().nonnegative(),
});
export type SettingsFormValues = z.infer<typeof settingsSchema>;
