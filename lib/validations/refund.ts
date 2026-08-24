import { z } from "zod";
export const refundSchema = z.object({
  reason: z.string().trim().min(2, "Refund reason is required."),
  amount: z.coerce.number().positive("Amount must be greater than zero."),
});
export type RefundFormValues = z.infer<typeof refundSchema>;
