import { z } from "zod";
export const checkoutSchema = z.object({
  deliveryAddressId: z.union([z.string(), z.number()]),
  paymentMethod: z.enum(["card", "tamara", "tabby"]),
});
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
