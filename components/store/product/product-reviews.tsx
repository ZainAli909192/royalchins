"use client";

import {
  BadgeCheck,
  Star,
  ThumbsUp,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";

type Review = {
  id: number;
  name: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  helpful: number;
  verified?: boolean;
};

const initialReviews: Review[] = [
  {
    id: 1,
    name: "Amina R.",
    rating: 5,
    title: "A beautiful, gentle companion",
    body: "Royal Chins were patient and helpful throughout. He arrived healthy, settled in quickly, and has such a lovely temperament.",
    date: "2 weeks ago",
    helpful: 18,
    verified: true,
  },
  {
    id: 2,
    name: "Omar K.",
    rating: 5,
    title: "Carefully handled from start to finish",
    body: "The care guidance and delivery communication were excellent. You can tell the animals are genuinely looked after.",
    date: "1 month ago",
    helpful: 12,
    verified: true,
  },
  {
    id: 3,
    name: "Sarah M.",
    rating: 4,
    title: "Very happy with the experience",
    body: "Friendly team, clear updates, and a smooth handover. Our family is very happy with our new little companion.",
    date: "2 months ago",
    helpful: 7,
    verified: true,
  },
];

const ratingDistribution = [
  { rating: 5, count: 108 },
  { rating: 4, count: 12 },
  { rating: 3, count: 3 },
  { rating: 2, count: 1 },
  { rating: 1, count: 0 },
];

type ProductReviewsProps = {
  productName: string;
};

export function ProductReviews({ productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sort, setSort] = useState("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");

  const visibleReviews = useMemo(() => {
    const filtered = ratingFilter
      ? reviews.filter((review) => review.rating === ratingFilter)
      : reviews;

    return sort === "helpful"
      ? [...filtered].sort((a, b) => b.helpful - a.helpful)
      : filtered;
  }, [ratingFilter, reviews, sort]);

  const submitReview = () => {
    if (!title.trim() || !reviewText.trim()) return;

    setReviews((current) => [
      {
        id: Date.now(),
        name: "You",
        rating: selectedRating,
        title: title.trim(),
        body: reviewText.trim(),
        date: "Just now",
        helpful: 0,
      },
      ...current,
    ]);
    setTitle("");
    setReviewText("");
    setSelectedRating(5);
    setRatingFilter(null);
    setSort("recent");
    setIsModalOpen(false);
  };

  return (
    <section aria-labelledby="reviews-heading" className="mt-8 border-t border-border pt-8 sm:mt-10 sm:pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Community feedback
          </p>
          <h2 id="reviews-heading" className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Customer reviews
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Verified experiences from Royal Chins families.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="h-11 rounded-xl px-5"
        >
          Write a review
        </Button>
      </div>

      <div className="mt-6 grid gap-5 rounded-2xl border border-border bg-surface-subtle p-5 sm:p-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="border-b border-border pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
          <div className="flex items-end gap-3">
            <p className="text-5xl font-bold tracking-tight text-foreground">4.9</p>
            <p className="pb-1 text-sm text-muted-foreground">out of 5</p>
          </div>
          <StarRow rating={5} className="mt-2" />
          <p className="mt-3 text-sm text-muted-foreground">Based on 124 verified reviews</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-foreground ring-1 ring-border">
            <BadgeCheck aria-hidden="true" className="h-4 w-4 text-primary" />
            Verified purchase reviews
          </div>
        </div>

        <div className="space-y-2.5">
          {ratingDistribution.map(({ rating, count }) => (
            <button
              key={rating}
              type="button"
              onClick={() => setRatingFilter((current) => current === rating ? null : rating)}
              aria-pressed={ratingFilter === rating}
              className="flex min-h-9 w-full items-center gap-3 rounded-lg px-2 text-left transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="flex w-10 shrink-0 items-center gap-1 text-sm font-semibold text-foreground">
                {rating}
                <Star aria-hidden="true" className="h-3.5 w-3.5 fill-primary text-primary" />
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                <span
                  className="block h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none"
                  style={{ width: `${(count / 124) * 100}%` }}
                />
              </span>
              <span className="w-7 text-right text-sm tabular-nums text-muted-foreground">{count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-foreground">
          {ratingFilter ? `${ratingFilter}-star reviews` : "All reviews"}
          <span className="ml-1 text-muted-foreground">({visibleReviews.length})</span>
        </p>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 font-semibold text-foreground transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
          >
            <option value="recent">Most recent</option>
            <option value="helpful">Most helpful</option>
          </select>
        </label>
      </div>

      <div className="divide-y divide-border">
        {visibleReviews.map((review) => (
          <article key={review.id} className="py-6 sm:py-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p className="font-bold text-foreground">{review.name}</p>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      <BadgeCheck aria-hidden="true" className="h-4 w-4" />
                      Verified purchase
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <StarRow rating={review.rating} className="mt-2" size="sm" />
              </div>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 self-start rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ThumbsUp aria-hidden="true" className="h-4 w-4" />
                Helpful ({review.helpful})
              </button>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">{review.title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {review.body}
            </p>
          </article>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Review ${productName}`}
        description="Tell other families about your experience."
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="h-11 rounded-xl">
              Cancel
            </Button>
            <Button onClick={submitReview} disabled={!title.trim() || !reviewText.trim()} className="h-11 rounded-xl">
              Submit review
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          <fieldset>
            <legend className="text-sm font-semibold text-foreground">Your rating</legend>
            <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Your rating">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setSelectedRating(rating)}
                  role="radio"
                  aria-checked={selectedRating === rating}
                  aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
                  className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Star
                    aria-hidden="true"
                    className={`h-6 w-6 ${rating <= selectedRating ? "fill-primary text-primary" : "text-border-strong"}`}
                  />
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block text-sm font-semibold text-foreground">
            Review title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Summarize your experience"
              className="mt-2 h-11 w-full rounded-lg border border-input-border bg-input-background px-3 text-sm font-normal text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <Textarea
            label="Your review"
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            placeholder="What did you like about your experience?"
            helperText="Please avoid including personal or delivery information."
            className="min-h-28"
          />
        </div>
      </Modal>
    </section>
  );
}

function StarRow({
  rating,
  className = "",
  size = "md",
}: {
  rating: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          className={`${iconSize} ${star <= rating ? "fill-primary text-primary" : "text-border-strong"}`}
        />
      ))}
    </div>
  );
}
