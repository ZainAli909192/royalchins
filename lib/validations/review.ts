import { z } from "zod";
export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(2, "Please enter your review."),
});
export type ReviewFormValues = z.infer<typeof reviewSchema>;
