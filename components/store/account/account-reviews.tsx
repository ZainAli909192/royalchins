"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  MessageSquareText,
  PackageCheck,
  Send,
  Star,
  X,
  XCircle,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type Tab = "to-review" | "my-reviews";

type ReviewStatus = "Pending" | "Approved" | "Rejected";

type ReviewableProduct = {
  id: string;
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  orderId: string;
  deliveredDate: string;
  shortMeta?: string;
};

type CustomerReview = {
  id: string;
  productId: string;
  slug: string;
  productName: string;
  productImage: string;
  type: "Animal" | "Accessory";
  orderId: string;
  rating: number;
  title: string;
  review: string;
  status: ReviewStatus;
  submittedDate: string;
};

const initialReviewableProducts: ReviewableProduct[] = [
  {
    id: "grey-chinchilla",
    slug: "grey-chinchilla",
    name: "Grey Chinchilla",
    image: "/animals/4.png",
    type: "Animal",
    orderId: "RC-2026-00110",
    deliveredDate: "18 Aug 2026",
    shortMeta: "Gentle companion",
  },
  {
    id: "wooden-hideout",
    slug: "wooden-hideout",
    name: "Wooden Hideout",
    image: "/animals/5.png",
    type: "Accessory",
    orderId: "RC-2026-00110",
    deliveredDate: "18 Aug 2026",
    shortMeta: "Natural wood shelter",
  },
];

const initialReviews: CustomerReview[] = [
  {
    id: "review-001",
    productId: "american-guinea-pig",
    slug: "american-guinea-pig",
    productName: "American Guinea Pig",
    productImage: "/animals/2.png",
    type: "Animal",
    orderId: "RC-2026-00072",
    rating: 5,
    title: "Wonderful little companion",
    review:
      "Very happy with the experience. The companion arrived healthy and well cared for.",
    status: "Approved",
    submittedDate: "24 Jul 2026",
  },
  {
    id: "review-002",
    productId: "premium-cage",
    slug: "premium-chinchilla-cage",
    productName: "Premium Chinchilla Cage",
    productImage: "/animals/3.png",
    type: "Accessory",
    orderId: "RC-2026-00068",
    rating: 4,
    title: "Good quality cage",
    review:
      "The cage feels sturdy and has plenty of room. Overall very satisfied with the quality.",
    status: "Pending",
    submittedDate: "20 Jul 2026",
  },
  {
    id: "review-003",
    productId: "old-hideout",
    slug: "wooden-hideout",
    productName: "Wooden Hideout",
    productImage: "/animals/5.png",
    type: "Accessory",
    orderId: "RC-2026-00051",
    rating: 3,
    title: "Useful accessory",
    review:
      "The product itself was useful and matched the description.",
    status: "Rejected",
    submittedDate: "08 Jul 2026",
  },
];

export function AccountReviews() {
  const [activeTab, setActiveTab] =
    useState<Tab>("to-review");

  const [reviewableProducts, setReviewableProducts] =
    useState<ReviewableProduct[]>([]);

  const [reviews, setReviews] =
    useState<CustomerReview[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState<ReviewableProduct | null>(null);

  const [submitted, setSubmitted] =
    useState(false);

  const loadReviews = () => fetch("/api/store/account/reviews").then(async response => ({ response, data: await response.json() })).then(({ response, data }) => {
    if (!response.ok) return;
    setReviews(data.reviews.map((review: { id: string; productId: string; rating: number; title?: string; comment: string; status: ReviewStatus; createdAt: string; order?: { orderNumber: string } | null; product: { slug: string; name: string; type: "Animal" | "Accessory"; images: { url: string }[] } }) => ({ id: review.id, productId: review.productId, slug: review.product.slug, productName: review.product.name, productImage: review.product.images[0]?.url ?? "/placeholder.png", type: review.product.type, orderId: review.order?.orderNumber ?? "", rating: review.rating, title: review.title ?? "Review", review: review.comment, status: review.status, submittedDate: new Date(review.createdAt).toLocaleDateString("en-AE", { day: "2-digit", month: "short", year: "numeric" }) })));
    setReviewableProducts(data.reviewable.filter((entry: { product: unknown }) => entry.product).map((entry: { orderNumber: string; deliveredAt: string; product: { id: string; slug: string; name: string; type: "Animal" | "Accessory"; shortDescription: string; images: { url: string }[] } }) => ({ id: entry.product.id, slug: entry.product.slug, name: entry.product.name, image: entry.product.images[0]?.url ?? "/placeholder.png", type: entry.product.type, orderId: entry.orderNumber, deliveredDate: new Date(entry.deliveredAt).toLocaleDateString("en-AE", { day: "2-digit", month: "short", year: "numeric" }), shortMeta: entry.product.shortDescription })));
  });
  useEffect(() => { loadReviews().catch(() => undefined); }, []);

  const pendingCount = useMemo(
    () =>
      reviews.filter(
        (review) => review.status === "Pending"
      ).length,
    [reviews]
  );

  async function handleReviewSubmitted(
    review: CustomerReview
  ) {
    const response = await fetch("/api/store/account/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: review.productId, orderNumber: review.orderId, rating: review.rating, title: review.title, comment: review.review }) });
    if (!response.ok) return;
    await loadReviews();

    setReviewableProducts((current) =>
      current.filter(
        (product) =>
          product.id !== review.productId
      )
    );

    setSelectedProduct(null);
    setSubmitted(true);
    setActiveTab("my-reviews");

    window.setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          My Account
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Reviews
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Share your experience with your
              Royal Chins companions and
              accessories.
            </p>
          </div>

          {pendingCount > 0 && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-warning/10 px-3 py-1.5 text-xs font-bold text-warning">
              <Clock3 className="h-3.5 w-3.5" />
              {pendingCount} Pending Approval
            </div>
          )}
        </div>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-surface-subtle p-1.5 sm:max-w-[420px]">
        <TabButton
          active={activeTab === "to-review"}
          onClick={() =>
            setActiveTab("to-review")
          }
          label="To Review"
          count={reviewableProducts.length}
        />

        <TabButton
          active={activeTab === "my-reviews"}
          onClick={() =>
            setActiveTab("my-reviews")
          }
          label="My Reviews"
          count={reviews.length}
        />
      </div>

      {submitted && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-success/20 bg-success/5 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />

          <div>
            <p className="text-sm font-bold text-foreground">
              Review submitted
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Your review is now pending
              approval. It will appear publicly
              after it has been approved.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6">
        {activeTab === "to-review" ? (
          <ToReviewSection
            products={reviewableProducts}
            onReview={setSelectedProduct}
          />
        ) : (
          <MyReviewsSection
            reviews={reviews}
          />
        )}
      </div>

      {selectedProduct && (
        <ReviewModal
          product={selectedProduct}
          onClose={() =>
            setSelectedProduct(null)
          }
          onSubmit={handleReviewSubmitted}
        />
      )}
    </div>
  );
}

function ToReviewSection({
  products,
  onReview,
}: {
  products: ReviewableProduct[];
  onReview: (
    product: ReviewableProduct
  ) => void;
}) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="You're all caught up"
        description="There are no delivered products waiting for your review."
      />
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground">
          Ready to Review
        </h2>

        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Only products from delivered orders
          can be reviewed.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <ReviewableProductCard
            key={product.id}
            product={product}
            onReview={() =>
              onReview(product)
            }
          />
        ))}
      </div>
    </section>
  );
}

function ReviewableProductCard({
  product,
  onReview,
}: {
  product: ReviewableProduct;
  onReview: () => void;
}) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-5">
      <div className="flex gap-4">
        <Link
          href={`/products/${product.slug}`}
          className="relative h-[90px] w-[90px] shrink-0 overflow-hidden rounded-2xl bg-surface-subtle"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            sizes="90px"
            className="object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold text-primary">
            {product.type}
          </span>

          <Link
            href={`/products/${product.slug}`}
          >
            <h3 className="mt-2 line-clamp-1 text-sm font-bold text-foreground transition-colors hover:text-primary sm:text-base">
              {product.name}
            </h3>
          </Link>

          {product.shortMeta && (
            <p className="mt-1 text-xs text-muted-foreground">
              {product.shortMeta}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-surface-subtle p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground">
              Order
            </p>

            <Link
              href={`/account/orders/${product.orderId}`}
              className="mt-0.5 block text-xs font-bold text-foreground hover:text-primary"
            >
              #{product.orderId}
            </Link>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-semibold text-muted-foreground">
              Delivered
            </p>

            <p className="mt-0.5 text-xs font-bold text-foreground">
              {product.deliveredDate}
            </p>
          </div>
        </div>
      </div>

     <Button
  type="button"
  variant="primary"
  onClick={onReview}
  className="mt-4 h-11 w-full rounded-xl text-sm font-bold"
>
  <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
    <Star
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
    />

    <span>Write Review</span>
  </span>
</Button>
    </article>
  );
}

function MyReviewsSection({
  reviews,
}: {
  reviews: CustomerReview[];
}) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="No reviews yet"
        description="Reviews you submit will appear here."
      />
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground">
          My Reviews
        </h2>

        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Track the approval status of reviews
          you've submitted.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
          />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({
  review,
}: {
  review: CustomerReview;
}) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-5">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
          <Link
            href={`/products/${review.slug}`}
            className="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-2xl bg-surface-subtle sm:h-[96px] sm:w-[96px]"
          >
            <Image
              src={review.productImage}
              alt={review.productName}
              fill
              unoptimized
              sizes="96px"
              className="object-cover"
            />
          </Link>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold text-primary">
                {review.type}
              </span>

              <ReviewStatusBadge
                status={review.status}
              />
            </div>

            <Link
              href={`/products/${review.slug}`}
            >
              <h3 className="mt-2 text-sm font-bold text-foreground transition-colors hover:text-primary sm:text-base">
                {review.productName}
              </h3>
            </Link>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Order #{review.orderId}
            </p>
          </div>
        </div>

        <div className="sm:text-right">
          <StarRating
            value={review.rating}
            readonly
          />

          <p className="mt-2 text-[11px] text-muted-foreground">
            Submitted {review.submittedDate}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <h4 className="text-sm font-bold text-foreground">
          {review.title}
        </h4>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {review.review}
        </p>
      </div>

      {review.status === "Pending" && (
        <StatusMessage
          icon={Clock3}
          title="Pending approval"
          text="Your review is being reviewed before it becomes visible publicly."
          className="border-warning/20 bg-warning/5"
          iconClassName="text-warning"
        />
      )}

      {review.status === "Rejected" && (
        <StatusMessage
          icon={XCircle}
          title="Review not approved"
          text="This review was not approved for public display."
          className="border-error/20 bg-error/5"
          iconClassName="text-error"
        />
      )}

      {review.status === "Approved" && (
        <StatusMessage
          icon={CheckCircle2}
          title="Review approved"
          text="Your review is now visible on the product page."
          className="border-success/20 bg-success/5"
          iconClassName="text-success"
        />
      )}

      <div className="mt-4 flex justify-end">
        <Link
          href={`/products/${review.slug}`}
          className="text-xs font-bold text-primary hover:underline"
        >
          View Product
        </Link>
      </div>
    </article>
  );
}

function ReviewModal({
  product,
  onClose,
  onSubmit,
}: {
  product: ReviewableProduct;
  onClose: () => void;
  onSubmit: (
    review: CustomerReview
  ) => void;
}) {
  const [rating, setRating] =
    useState(0);

  const [title, setTitle] =
    useState("");

  const [review, setReview] =
    useState("");

  const [error, setError] =
    useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (rating === 0) {
      setError(
        "Please select a star rating."
      );
      return;
    }

   

    if (review.trim().length < 10) {
      setError(
        "Please write a little more about your experience."
      );
      return;
    }

    onSubmit({
      id: `review-${Date.now()}`,
      productId: product.id,
      slug: product.slug,
      productName: product.name,
      productImage: product.image,
      type: product.type,
      orderId: product.orderId,
      rating,
      title: title.trim(),
      review: review.trim(),
      status: "Pending",
      submittedDate: "31 Aug 2026",
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close review form"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-background shadow-2xl sm:max-w-[600px] sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              Write Review
            </p>

            <h2 className="mt-1 text-lg font-bold text-foreground">
              Share your experience
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-subtle text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-surface-subtle p-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-background">
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized
                sizes="64px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-bold text-primary">
                {product.type}
              </span>

              <p className="mt-1 truncate text-sm font-bold text-foreground">
                {product.name}
              </p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Order #{product.orderId}
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <label className="text-sm font-bold text-foreground">
              How was your experience?
            </label>

            <p className="mt-1 text-xs text-muted-foreground">
              Select your rating
            </p>

            <div className="mt-4 flex justify-center">
              <StarRating
                value={rating}
                onChange={setRating}
              />
            </div>

            {rating > 0 && (
              <p className="mt-2 text-xs font-semibold text-primary">
                {getRatingLabel(rating)}
              </p>
            )}
          </div>

         

          <div className="mt-4">
            <label
              htmlFor="review-text"
              className="text-sm font-bold text-foreground"
            >
              Your review
              <span className="ml-1 text-error">
                *
              </span>
            </label>

            <textarea
              id="review-text"
              value={review}
              onChange={(event) => {
                setReview(event.target.value);
                setError("");
              }}
              placeholder="Tell us about your experience..."
              maxLength={1000}
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />

            <div className="mt-1 flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">
                Minimum 10 characters
              </p>

              <p className="text-[10px] text-muted-foreground">
                {review.length}/1000
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-xs font-semibold text-error">
              {error}
            </div>
          )}

          <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-3">
            <div className="flex items-start gap-2">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <p className="text-[11px] leading-5 text-muted-foreground">
                Reviews are checked before
                appearing publicly. After
                submission, your review will be
                marked as Pending.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="h-11 rounded-xl px-5"
            >
              Cancel
            </Button>

          <Button
  type="submit"
  variant="primary"
  className="h-11 rounded-xl px-6 font-bold"
>
  <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
    <Send
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
    />

    <span>Submit Review</span>
  </span>
</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map(
        (_, index) => {
          const star = index + 1;
          const active = star <= value;

          if (readonly) {
            return (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  active
                    ? "fill-primary text-primary"
                    : "text-border"
                }`}
              />
            );
          }

          return (
            <button
              key={star}
              type="button"
              onClick={() =>
                onChange?.(star)
              }
              aria-label={`${star} star${
                star > 1 ? "s" : ""
              }`}
              className="rounded-md p-1 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  active
                    ? "fill-primary text-primary"
                    : "text-border"
                }`}
              />
            </button>
          );
        }
      )}
    </div>
  );
}

function ReviewStatusBadge({
  status,
}: {
  status: ReviewStatus;
}) {
  const config = {
    Pending: {
      className:
        "bg-warning/10 text-warning",
      icon: Clock3,
    },
    Approved: {
      className:
        "bg-success/10 text-success",
      icon: CheckCircle2,
    },
    Rejected: {
      className:
        "bg-error/10 text-error",
      icon: XCircle,
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

function StatusMessage({
  icon: Icon,
  title,
  text,
  className,
  iconClassName,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  className: string;
  iconClassName: string;
}) {
  return (
    <div
      className={`mt-4 rounded-xl border p-3 ${className}`}
    >
      <div className="flex items-start gap-2">
        <Icon
          className={`mt-0.5 h-4 w-4 shrink-0 ${iconClassName}`}
        />

        <div>
          <p className="text-xs font-bold text-foreground">
            {title}
          </p>

          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold transition-all sm:text-sm ${
        active
          ? "bg-background text-primary shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}

      <span
        className={`flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] ${
          active
            ? "bg-primary text-primary-foreground"
            : "bg-background text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-background px-5 py-14 text-center shadow-sm sm:py-20">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-7 w-7" />
      </span>

      <h2 className="mt-5 text-xl font-bold text-foreground">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function getRatingLabel(
  rating: number
) {
  const labels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return labels[rating] ?? "";
}
