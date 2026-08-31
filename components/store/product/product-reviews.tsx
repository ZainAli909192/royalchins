import { Star } from "lucide-react";

type ProductReviewsProps = {
  averageRating: number;
};

export function ProductReviews({
  averageRating,
}: ProductReviewsProps) {
  const safeRating = Math.min(
    5,
    Math.max(0, averageRating)
  );

  return (
    <div
      className="flex items-center gap-2"
      aria-label={`${safeRating.toFixed(1)} out of 5 stars`}
    >
      <div
        className="flex items-center gap-0.5"
        aria-hidden="true"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${
              star <= Math.round(safeRating)
                ? "fill-primary text-primary"
                : "text-border"
            }`}
          />
        ))}
      </div>

      <span className="text-sm font-bold tabular-nums text-foreground">
        {safeRating.toFixed(1)}
      </span>

      <span className="text-xs text-muted-foreground">
        Average Rating
      </span>
    </div>
  );
}