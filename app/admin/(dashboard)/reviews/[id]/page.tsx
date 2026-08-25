"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Package,
  ShieldCheck,
  ShoppingBag,
  Star,
  User,
  X,
  XCircle,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  getAutoApproveReviews,
} from "@/lib/reviews/review-settings";

type ReviewStatus =
  | "Pending"
  | "Approved"
  | "Rejected";

type ProductType =
  | "Animal"
  | "Accessory";

type Review = {
  id: number;

  productId: number;
  productName: string;
  productType: ProductType;
  productImage: string;

  customerId: number;
  customerName: string;
  customerEmail: string;

  orderId: number;
  orderNumber: string;

  rating: number;
  title?: string;
  comment: string;

  status: ReviewStatus;

  submittedAt: string;

  moderatedAt?: string;
  moderatedBy?: string;

  rejectionReason?: string;
  rejectionNotes?: string;
};

const reviews: Review[] = [
  {
    id: 1,

    productId: 1,
    productName: "White Chinchilla",
    productType: "Animal",
    productImage:
      "/products/white-chinchilla.jpg",

    customerId: 101,
    customerName: "Ahmed Daniyal",
    customerEmail:
      "ahmed@example.com",

    orderId: 1,
    orderNumber: "RC-1028",

    rating: 5,

    title:
      "Beautiful and calm",

    comment:
      "Very calm and healthy chinchilla. The overall experience was excellent.",

    status: "Pending",

    submittedAt:
      "24 Aug 2026 04:15 PM",
  },

  {
    id: 2,

    productId: 5,
    productName:
      "Premium Chinchilla Cage",
    productType: "Accessory",
    productImage:
      "/products/chinchilla-cage.jpg",

    customerId: 102,
    customerName: "Sara Khan",
    customerEmail:
      "sara@example.com",

    orderId: 2,
    orderNumber: "RC-1027",

    rating: 4,

    title:
      "Good quality",

    comment:
      "The cage is spacious and feels very sturdy. Assembly was straightforward.",

    status: "Approved",

    submittedAt:
      "23 Aug 2026 03:10 PM",

    moderatedAt:
      "23 Aug 2026 03:30 PM",

    moderatedBy:
      "Admin",
  },

  {
    id: 3,

    productId: 6,
    productName:
      "Wooden Hideout",
    productType: "Accessory",
    productImage:
      "/products/wooden-hideout.jpg",

    customerId: 104,
    customerName:
      "Mariam Noor",
    customerEmail:
      "mariam@example.com",

    orderId: 4,
    orderNumber: "RC-1025",

    rating: 2,

    title:
      "Not useful",

    comment:
      "This review contains unrelated promotional content.",

    status: "Rejected",

    submittedAt:
      "21 Aug 2026 05:40 PM",

    moderatedAt:
      "21 Aug 2026 06:00 PM",

    moderatedBy:
      "Admin",

    rejectionReason:
      "Irrelevant content",

    rejectionNotes:
      "The content was unrelated to the purchased product.",
  },
];

export default function ReviewDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const reviewId =
    Number(params.id);

  const review = useMemo(
    () =>
      reviews.find(
        (item) =>
          item.id === reviewId
      ),
    [reviewId]
  );

  const [
    autoApprove,
    setAutoApprove,
  ] = useState(false);

  const [
    settingsLoaded,
    setSettingsLoaded,
  ] = useState(false);

  const [
    currentStatus,
    setCurrentStatus,
  ] =
    useState<ReviewStatus>(
      review?.status ??
        "Pending"
    );

  const [
    moderatedBy,
    setModeratedBy,
  ] = useState(
    review?.moderatedBy ?? ""
  );

  const [
    moderatedAt,
    setModeratedAt,
  ] = useState(
    review?.moderatedAt ?? ""
  );

  const [
    savedRejectionReason,
    setSavedRejectionReason,
  ] = useState(
    review?.rejectionReason ??
      ""
  );

  const [
    savedRejectionNotes,
    setSavedRejectionNotes,
  ] = useState(
    review?.rejectionNotes ??
      ""
  );

  const [
    rejectDialogOpen,
    setRejectDialogOpen,
  ] = useState(false);

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  const [
    rejectionNotes,
    setRejectionNotes,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {
    const enabled =
      getAutoApproveReviews();

    setAutoApprove(enabled);
    setSettingsLoaded(true);
  }, []);

  if (!review) {
    return (
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-foreground">
          Review not found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          The requested review could not be found.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() =>
            router.push(
              "/admin/reviews"
            )
          }
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Reviews
          </span>
        </Button>
      </div>
    );
  }

  const getStatusClass = (
    status: ReviewStatus
  ) => {
    if (
      status ===
      "Approved"
    ) {
      return "bg-[var(--success-background)] text-success";
    }

    if (
      status ===
      "Rejected"
    ) {
      return "bg-[var(--error-background)] text-error";
    }

    return "bg-[var(--warning-background)] text-warning";
  };

  const approveReview =
    async () => {
      setSuccessMessage("");
      setErrorMessage("");

      try {
        setLoading(true);

        console.log(
          "Approve review:",
          {
            reviewId,
            moderatedBy:
              "Admin",
          }
        );

        /*
         * BACKEND LATER:
         *
         * await approveReviewApi(
         *   reviewId
         * );
         */

        setCurrentStatus(
          "Approved"
        );

        setModeratedBy(
          "Admin"
        );

        setModeratedAt(
          "Just now"
        );

        setSavedRejectionReason(
          ""
        );

        setSavedRejectionNotes(
          ""
        );

        setSuccessMessage(
          "Review approved successfully."
        );
      } catch {
        setErrorMessage(
          "Unable to approve review."
        );
      } finally {
        setLoading(false);
      }
    };

  const openRejectDialog =
    () => {
      setRejectionReason("");
      setRejectionNotes("");
      setErrorMessage("");

      setRejectDialogOpen(
        true
      );
    };

  const closeRejectDialog =
    () => {
      if (loading) {
        return;
      }

      setRejectDialogOpen(
        false
      );

      setRejectionReason("");
      setRejectionNotes("");
      setErrorMessage("");
    };

  const rejectReview =
    async () => {
      if (!rejectionReason) {
        setErrorMessage(
          "Please select a rejection reason."
        );

        return;
      }

      setSuccessMessage("");
      setErrorMessage("");

      try {
        setLoading(true);

        console.log(
          "Reject review:",
          {
            reviewId,

            reason:
              rejectionReason,

            notes:
              rejectionNotes,

            moderatedBy:
              "Admin",
          }
        );

        /*
         * BACKEND LATER:
         *
         * await rejectReviewApi(
         *   reviewId,
         *   {
         *     reason:
         *       rejectionReason,
         *     notes:
         *       rejectionNotes,
         *   }
         * );
         */

        setCurrentStatus(
          "Rejected"
        );

        setModeratedBy(
          "Admin"
        );

        setModeratedAt(
          "Just now"
        );

        setSavedRejectionReason(
          rejectionReason
        );

        setSavedRejectionNotes(
          rejectionNotes.trim()
        );

        setRejectDialogOpen(
          false
        );

        setSuccessMessage(
          "Review rejected successfully."
        );
      } catch {
        setErrorMessage(
          "Unable to reject review."
        );
      } finally {
        setLoading(false);
      }
    };

  const renderStars = () => {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from(
            { length: 5 },
            (_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index <
                  review.rating
                    ? "fill-primary text-primary"
                    : "text-border-strong"
                }`}
              />
            )
          )}
        </div>

        <span className="text-sm font-semibold text-foreground">
          {review.rating}/5
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Review Details"
        description={`Review #${review.id}`}
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(
                "/admin/reviews"
              )
            }
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              <ArrowLeft className="h-4 w-4" />
              Back
            </span>
          </Button>
        }
      />

      {/* Alerts */}
      {successMessage && (
        <FormAlert
          variant="success"
          message={
            successMessage
          }
          onClose={() =>
            setSuccessMessage("")
          }
        />
      )}

      {errorMessage &&
        !rejectDialogOpen && (
          <FormAlert
            variant="error"
            message={
              errorMessage
            }
            onClose={() =>
              setErrorMessage("")
            }
          />
        )}

      {/* Review Overview */}
      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-subtle sm:h-24 sm:w-24">
              <Image
                src={
                  review.productImage
                }
                alt={
                  review.productName
                }
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                Product
              </p>

              <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
                {review.productName}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {review.productType}
              </p>

              <div className="mt-3">
                {renderStars()}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <span
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${getStatusClass(
                currentStatus
              )}`}
            >
              {currentStatus}
            </span>

            {settingsLoaded &&
              !autoApprove &&
              currentStatus ===
                "Pending" && (
                <div className="flex w-full gap-2 sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={
                      openRejectDialog
                    }
                    disabled={
                      loading
                    }
                    className="flex-1 border-error/40 text-error hover:border-error hover:bg-[var(--error-background)] hover:text-error sm:flex-none"
                  >
                    Reject
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={
                      approveReview
                    }
                    disabled={
                      loading
                    }
                    className="flex-1 border-success/40 text-success hover:border-success hover:bg-[var(--success-background)] hover:text-success sm:flex-none"
                  >
                    {loading
                      ? "Approving..."
                      : "Approve"}
                  </Button>
                </div>
              )}
          </div>
        </div>

        {/* Auto Approval Notice */}
        {settingsLoaded &&
          autoApprove && (
            <div className="mt-5 rounded-xl border border-success/20 bg-[var(--success-background)] p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />

                <div>
                  <p className="text-sm font-semibold text-success">
                    Auto Approval Enabled
                  </p>

                  <p className="mt-1 text-sm leading-6 text-success">
                    New verified customer reviews are approved automatically. Manual approval and rejection actions are hidden.
                  </p>
                </div>
              </div>
            </div>
          )}
      </section>

      {/* Related Records */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
        {/* Product */}
        <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3">
            <Package className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">
                Product
              </p>

              <p className="mt-1 font-semibold text-foreground">
                {review.productName}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {review.productType}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              title="View Product"
              onClick={() =>
                router.push(
                  `/admin/products/${review.productId}`
                )
              }
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Customer */}
        <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">
                Customer
              </p>

              <p className="mt-1 font-semibold text-foreground">
                {review.customerName}
              </p>

              <p className="mt-1 break-all text-xs text-muted-foreground">
                {review.customerEmail}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              title="View Customer"
              onClick={() =>
                router.push(
                  `/admin/customers/${review.customerId}`
                )
              }
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Order */}
        <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:col-span-2 sm:p-5 xl:col-span-1">
          <div className="flex items-start gap-3">
            <ShoppingBag className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">
                Verified Purchase
              </p>

              <p className="mt-1 font-semibold text-foreground">
                #{review.orderNumber}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />

                <p className="text-xs text-success">
                  Verified customer order
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              title="View Order"
              onClick={() =>
                router.push(
                  `/admin/orders/${review.orderId}`
                )
              }
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>

      {/* Customer Review */}
      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Customer Review
        </h2>

        <div className="mt-5 rounded-xl bg-surface-subtle p-4 sm:p-5">
          {review.title && (
            <h3 className="text-base font-semibold text-foreground">
              {review.title}
            </h3>
          )}

          <div className="mt-3">
            {renderStars()}
          </div>

          <p className="mt-4 text-sm leading-7 text-foreground">
            {review.comment}
          </p>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Submitted{" "}
              {review.submittedAt}
            </p>
          </div>
        </div>
      </section>

   

      {/* Rejected Info */}
      {currentStatus ===
        "Rejected" && (
        <section className="rounded-xl border border-error/20 bg-[var(--error-background)] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />

            <div>
              <h2 className="font-semibold text-error">
                Review Rejected
              </h2>

              <p className="mt-3 text-sm text-error">
                <span className="font-semibold">
                  Reason:
                </span>{" "}
                {savedRejectionReason ||
                  "Not specified"}
              </p>

              {savedRejectionNotes && (
                <p className="mt-2 text-sm leading-6 text-error">
                  {
                    savedRejectionNotes
                  }
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Review Controls */}
      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

          <div>
            <h2 className="font-semibold text-foreground">
              Review Controls
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {autoApprove
                ? "Auto approval is enabled. New verified reviews are published automatically without manual moderation."
                : "Manual moderation is enabled. New reviews remain pending until an administrator approves or rejects them."}
            </p>
          </div>
        </div>
      </section>

      {/* Reject Dialog */}
      {rejectDialogOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            onClick={
              closeRejectDialog
            }
            className="absolute inset-0 bg-black/50"
            aria-label="Close reject review dialog"
          />

          <div className="relative z-10 max-h-[calc(100dvh-32px)] w-full max-w-[520px] overflow-y-auto rounded-2xl border border-border bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--error-background)] text-error">
                  <XCircle className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Reject Review
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Select why this review should not appear publicly.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  closeRejectDialog
                }
                disabled={loading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-foreground disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-xl bg-surface-subtle p-4">
                <p className="text-sm font-semibold text-foreground">
                  {review.productName}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {review.customerName}
                </p>

                <div className="mt-3">
                  {renderStars()}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Rejection Reason
                  <span className="ml-1 text-error">
                    *
                  </span>
                </label>

                <select
                  value={
                    rejectionReason
                  }
                  onChange={(
                    event
                  ) => {
                    setRejectionReason(
                      event.target
                        .value
                    );

                    setErrorMessage(
                      ""
                    );
                  }}
                  disabled={loading}
                  className={`h-12 w-full rounded-lg border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                    errorMessage
                      ? "border-error"
                      : "border-border"
                  }`}
                >
                  <option value="">
                    Select reason
                  </option>

                  <option value="Spam">
                    Spam
                  </option>

                  <option value="Offensive content">
                    Offensive content
                  </option>

                  <option value="Irrelevant content">
                    Irrelevant content
                  </option>

                  <option value="Fake / suspicious review">
                    Fake / suspicious review
                  </option>

                  <option value="Contains personal information">
                    Contains personal information
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

                {errorMessage && (
                  <p className="mt-1.5 text-sm text-error">
                    {
                      errorMessage
                    }
                  </p>
                )}
              </div>

              <Textarea
                label="Notes"
                placeholder="Optional internal moderation notes..."
                rows={4}
                value={
                  rejectionNotes
                }
                onChange={(
                  event
                ) =>
                  setRejectionNotes(
                    event.target
                      .value
                  )
                }
                disabled={loading}
                helperText="These notes are only visible to administrators."
              />

              <div className="rounded-xl bg-[var(--error-background)] p-4">
                <p className="text-sm leading-6 text-error">
                  Rejected reviews will not appear publicly on the product page.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <Button
                type="button"
                variant="outline"
                onClick={
                  closeRejectDialog
                }
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="danger"
                onClick={
                  rejectReview
                }
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading
                  ? "Rejecting..."
                  : "Reject Review"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({
  label,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-xl bg-surface-subtle p-4">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}