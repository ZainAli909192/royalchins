import { z } from "zod";
export const deliverySchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  phone: z.string().trim().min(7, "Phone number is required."),
  emirate: z.string().trim().min(1, "Emirate is required."),
  area: z.string().trim().min(1, "Area is required."),
  addressLine1: z.string().trim().min(1, "Address is required."),
  addressLine2: z.string().trim().optional(),
});
export type DeliveryFormValues = z.infer<typeof deliverySchema>;
