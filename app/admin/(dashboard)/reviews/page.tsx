"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  CheckCircle2,
  Search,
  Star,
  XCircle,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  getAutoApproveReviews,
  saveAutoApproveReviews,
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
};

const initialReviews: Review[] = [
  {
    id: 1,

    productId: 1,
    productName: "White Chinchilla",
    productType: "Animal",
    productImage: "/products/white-chinchilla.jpg",

    customerId: 101,
    customerName: "Ahmed Daniyal",
    customerEmail: "ahmed@example.com",

    orderId: 1,
    orderNumber: "RC-1028",

    rating: 5,
    title: "Beautiful and calm",
    comment:
      "Very calm and healthy chinchilla. The overall experience was excellent.",

    status: "Pending",

    submittedAt: "24 Aug 2026 04:15 PM",
  },

  {
    id: 2,

    productId: 5,
    productName: "Premium Chinchilla Cage",
    productType: "Accessory",
    productImage: "/products/chinchilla-cage.jpg",

    customerId: 102,
    customerName: "Sara Khan",
    customerEmail: "sara@example.com",

    orderId: 2,
    orderNumber: "RC-1027",

    rating: 4,
    title: "Good quality",
    comment:
      "The cage is spacious and feels very sturdy. Assembly was straightforward.",

    status: "Approved",

    submittedAt: "23 Aug 2026 03:10 PM",

    moderatedAt: "23 Aug 2026 03:30 PM",
    moderatedBy: "Admin",
  },

  {
    id: 3,

    productId: 3,
    productName: "American Guinea Pig",
    productType: "Animal",
    productImage: "/products/american-guinea-pig.jpg",

    customerId: 103,
    customerName: "Omar Ali",
    customerEmail: "omar@example.com",

    orderId: 3,
    orderNumber: "RC-1026",

    rating: 5,
    title: "Very friendly",
    comment:
      "Healthy, friendly and exactly as described.",

    status: "Approved",

    submittedAt: "22 Aug 2026 01:20 PM",

    moderatedAt: "22 Aug 2026 02:05 PM",
    moderatedBy: "Admin",
  },

  {
    id: 4,

    productId: 6,
    productName: "Wooden Hideout",
    productType: "Accessory",
    productImage: "/products/wooden-hideout.jpg",

    customerId: 104,
    customerName: "Mariam Noor",
    customerEmail: "mariam@example.com",

    orderId: 4,
    orderNumber: "RC-1025",

    rating: 2,
    title: "Not useful",
    comment:
      "This review contains unrelated promotional content.",

    status: "Rejected",

    submittedAt: "21 Aug 2026 05:40 PM",

    moderatedAt: "21 Aug 2026 06:00 PM",
    moderatedBy: "Admin",

    rejectionReason: "Irrelevant content",
  },

  {
    id: 5,

    productId: 2,
    productName: "Grey Chinchilla",
    productType: "Animal",
    productImage: "/products/grey-chinchilla.jpg",

    customerId: 106,
    customerName: "Fatima Zahra",
    customerEmail: "fatima@example.com",

    orderId: 6,
    orderNumber: "RC-1023",

    rating: 5,
    title: "Perfect",
    comment:
      "The animal arrived healthy and well cared for. Very happy with the purchase.",

    status: "Pending",

    submittedAt: "24 Aug 2026 12:25 PM",
  },

  {
    id: 6,

    productId: 7,
    productName: "Premium Animal Bedding",
    productType: "Accessory",
    productImage: "/products/premium-bedding.jpg",

    customerId: 107,
    customerName: "Ali Rehman",
    customerEmail: "ali@example.com",

    orderId: 7,
    orderNumber: "RC-1022",

    rating: 4,
    title: "Good bedding",
    comment:
      "Soft, clean and suitable for the enclosure.",

    status: "Approved",

    submittedAt: "20 Aug 2026 07:45 PM",

    moderatedAt: "20 Aug 2026 08:10 PM",
    moderatedBy: "Admin",
  },
];

const pageSize = 6;

export default function ReviewsPage() {
  const router = useRouter();

  const [reviews, setReviews] =
    useState<Review[]>(initialReviews);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [rating, setRating] =
    useState("all");

  const [type, setType] =
    useState("all");

  const [dateFilter, setDateFilter] =
    useState("all");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


  const [
    autoApprove,
    setAutoApprove,
  ] = useState(false);

useEffect(() => {
  setAutoApprove(
    getAutoApproveReviews()
  );
}, []);
  const filteredReviews =
    useMemo(() => {
      return reviews.filter(
        (review) => {
          const searchValue =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            review.productName
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            review.customerName
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            review.customerEmail
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            review.orderNumber
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            review.comment
              .toLowerCase()
              .includes(
                searchValue
              );

          const matchesStatus =
            status === "all" ||
            review.status.toLowerCase() ===
              status;

          const matchesRating =
            rating === "all" ||
            review.rating ===
              Number(rating);

          const matchesType =
            type === "all" ||
            review.productType.toLowerCase() ===
              type;

          let matchesDate = true;

          if (
            dateFilter ===
            "today"
          ) {
            matchesDate =
              review.submittedAt.startsWith(
                "24 Aug 2026"
              );
          }

          if (
            dateFilter ===
            "yesterday"
          ) {
            matchesDate =
              review.submittedAt.startsWith(
                "23 Aug 2026"
              );
          }

          return (
            matchesSearch &&
            matchesStatus &&
            matchesRating &&
            matchesType &&
            matchesDate
          );
        }
      );
    }, [
      reviews,
      search,
      status,
      rating,
      type,
      dateFilter,
    ]);

  const totalPages =
    Math.ceil(
      filteredReviews.length /
        pageSize
    );

  const paginatedReviews =
    filteredReviews.slice(
      (currentPage - 1) *
        pageSize,
      currentPage * pageSize
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    status,
    rating,
    type,
    dateFilter,
  ]);

  const pendingCount =
    reviews.filter(
      (review) =>
        review.status ===
        "Pending"
    ).length;

  const approvedCount =
    reviews.filter(
      (review) =>
        review.status ===
        "Approved"
    ).length;

  const rejectedCount =
    reviews.filter(
      (review) =>
        review.status ===
        "Rejected"
    ).length;

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setRating("all");
    setType("all");
    setDateFilter("all");
  };

  const getStatusClass = (
    reviewStatus: ReviewStatus
  ) => {
    if (
      reviewStatus ===
      "Approved"
    ) {
      return "bg-[var(--success-background)] text-success";
    }

    if (
      reviewStatus ===
      "Rejected"
    ) {
      return "bg-[var(--error-background)] text-error";
    }

    return "bg-[var(--warning-background)] text-warning";
  };

  const approveReview = (
    review: Review
  ) => {
    setReviews(
      (current) =>
        current.map((item) =>
          item.id === review.id
            ? {
                ...item,

                status:
                  "Approved",

                moderatedAt:
                  "Just now",

                moderatedBy:
                  "Admin",

                rejectionReason:
                  undefined,
              }
            : item
        )
    );

    setSuccessMessage(
      `Review for ${review.productName} approved successfully.`
    );
  };

  const rejectReview = (
    review: Review
  ) => {
    router.push(
      `/admin/reviews/${review.id}`
    );
  };

  const handleAutoApproveChange = (
  enabled: boolean
) => {
  setAutoApprove(enabled);

  saveAutoApproveReviews(
    enabled
  );

  setSuccessMessage(
    enabled
      ? "Auto approval enabled. New verified reviews will be approved automatically."
      : "Auto approval disabled. New reviews will require admin approval."
  );
};

  const renderStars = (
    value: number
  ) => (
    <div className="flex items-center gap-0.5">
      {Array.from(
        { length: 5 },
        (_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < value
                ? "fill-primary text-primary"
                : "text-border-strong"
            }`}
          />
        )
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <AdminPageHeader
        title="Reviews"
        description={
          autoApprove
            ? "Verified customer reviews are currently being approved automatically."
            : "Moderate verified customer reviews before they appear publicly."
        }
      />

      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

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

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard
          label="Total Reviews"
          value={reviews.length}
          icon={
            <Star className="h-5 w-5" />
          }
        />

        <SummaryCard
          label="Pending"
          value={pendingCount}
          icon={
            <Star className="h-5 w-5" />
          }
          tone="warning"
        />

        <SummaryCard
          label="Approved"
          value={approvedCount}
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
          tone="success"
        />

        <SummaryCard
          label="Rejected"
          value={rejectedCount}
          icon={
            <XCircle className="h-5 w-5" />
          }
          tone="error"
        />
      </section>

      {/* =========================
          REVIEW MODERATION SETTING
      ========================= */}

      <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">
                Review Moderation
              </h2>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  autoApprove
                    ? "bg-[var(--success-background)] text-success"
                    : "bg-[var(--warning-background)] text-warning"
                }`}
              >
                {autoApprove
                  ? "Auto Approve On"
                  : "Manual Approval"}
              </span>
            </div>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {autoApprove
                ? "New verified customer reviews will be published automatically. Existing pending reviews are not changed."
                : "New verified customer reviews will remain pending until an admin approves or rejects them."}
            </p>
          </div>

          <label className="flex shrink-0 cursor-pointer items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              Auto Approve
            </span>

        <input
  type="checkbox"
  checked={autoApprove}
  onChange={(event) =>
    handleAutoApproveChange(
      event.target.checked
    )
  }
  className="peer sr-only"
/>

            <span
              className="
                relative
                h-6
                w-11
                rounded-full
                bg-muted
                transition-colors
                peer-checked:bg-primary
                peer-focus-visible:ring-2
                peer-focus-visible:ring-primary/20
              "
            >
              <span
                className="
                  absolute
                  left-1
                  top-1
                  h-4
                  w-4
                  rounded-full
                  bg-white
                  shadow-sm
                  transition-transform
                  peer-checked:translate-x-5
                "
              />
            </span>
          </label>
        </div>
      </section>

      {/* =========================
          FILTERS
      ========================= */}

      <section className="rounded-xl border border-border bg-white p-3 shadow-sm sm:p-5">
        <div className="grid gap-3 xl:grid-cols-[1fr_150px_140px_150px_170px_auto]">
          <Input
            type="search"
            placeholder="Search reviews..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            leftIcon={
              <Search className="h-5 w-5" />
            }
            className="h-11 sm:h-12"
          />

          <div className="grid grid-cols-2 gap-2 xl:contents">
            {/* Status */}
            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
              className="h-11 min-w-0 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12"
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>

            {/* Rating */}
            <select
              value={rating}
              onChange={(event) =>
                setRating(
                  event.target.value
                )
              }
              className="h-11 min-w-0 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12"
            >
              <option value="all">
                All Ratings
              </option>

              <option value="5">
                5 Stars
              </option>

              <option value="4">
                4 Stars
              </option>

              <option value="3">
                3 Stars
              </option>

              <option value="2">
                2 Stars
              </option>

              <option value="1">
                1 Star
              </option>
            </select>

            {/* Product Type */}
            <select
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value
                )
              }
              className="h-11 min-w-0 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12"
            >
              <option value="all">
                All Products
              </option>

              <option value="animal">
                Animals
              </option>

              <option value="accessory">
                Accessories
              </option>
            </select>

            {/* Date */}
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <select
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-border bg-white pl-9 pr-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12"
              >
                <option value="all">
                  All Dates
                </option>

                <option value="today">
                  Today
                </option>

                <option value="yesterday">
                  Yesterday
                </option>
              </select>
            </div>

            {/* Reset */}
            <Button
              type="button"
              variant="outline"
              onClick={
                resetFilters
              }
              className="col-span-2 h-11 w-full sm:h-12 xl:col-span-1 xl:w-auto"
            >
              Reset
            </Button>
          </div>
        </div>
      </section>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {filteredReviews.length ===
      0 ? (
        <AdminEmptyState
          type="search"
          title="No reviews found"
          description="Try changing your search or filters."
        />
      ) : (
        <>
          {/* =========================
              DESKTOP TABLE
          ========================= */}

          <section className="hidden overflow-hidden rounded-xl border border-border bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px]">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Product
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Rating
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Review
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Submitted
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedReviews.map(
                    (review) => (
                      <tr
                        key={
                          review.id
                        }
                        className="border-t border-border"
                      >
                        {/* Product */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-subtle">
                              <Image
                                src={
                                  review.productImage
                                }
                                alt={
                                  review.productName
                                }
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>

                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/admin/products/${review.productId}`
                                  )
                                }
                                className="text-left text-sm font-semibold text-foreground hover:text-primary"
                              >
                                {
                                  review.productName
                                }
                              </button>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {
                                  review.productType
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/admin/customers/${review.customerId}`
                              )
                            }
                            className="text-left"
                          >
                            <p className="text-sm font-medium text-foreground hover:text-primary">
                              {
                                review.customerName
                              }
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {
                                review.customerEmail
                              }
                            </p>
                          </button>
                        </td>

                        {/* Rating */}
                        <td className="px-5 py-4">
                          {renderStars(
                            review.rating
                          )}

                          <p className="mt-1 text-xs font-medium">
                            {
                              review.rating
                            }
                            /5
                          </p>
                        </td>

                        {/* Review */}
                        <td className="max-w-[320px] px-5 py-4">
                          {review.title && (
                            <p className="text-sm font-semibold text-foreground">
                              {
                                review.title
                              }
                            </p>
                          )}

                          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                            {
                              review.comment
                            }
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/admin/orders/${review.orderId}`
                              )
                            }
                            className="mt-2 text-xs font-medium text-primary hover:underline"
                          >
                            Verified purchase · #
                            {
                              review.orderNumber
                            }
                          </button>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              review.status
                            )}`}
                          >
                            {
                              review.status
                            }
                          </span>
                        </td>

                        {/* Submitted */}
                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {
                            review.submittedAt
                          }
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/*
                              IMPORTANT:

                              Approve / Reject only show when:

                              1. Auto Approve is OFF
                              2. Review is Pending
                            */}

                            {!autoApprove &&
                              review.status ===
                                "Pending" && (
                                <>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      rejectReview(
                                        review
                                      )
                                    }
                                    className="h-9 border-error/40 px-4 text-error hover:border-error hover:bg-[var(--error-background)] hover:text-error"
                                  >
                                    Reject
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      approveReview(
                                        review
                                      )
                                    }
                                    className="h-9 border-success/40 px-4 text-success hover:border-success hover:bg-[var(--success-background)] hover:text-success"
                                  >
                                    Approve
                                  </Button>
                                </>
                              )}

                            {/* View always visible */}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/admin/reviews/${review.id}`
                                )
                              }
                              className="h-9 border-primary/40 px-4 text-primary hover:border-primary hover:bg-primary/5 hover:text-primary"
                            >
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={
                currentPage
              }
              totalPages={
                totalPages
              }
              totalItems={
                filteredReviews.length
              }
              pageSize={pageSize}
              onPageChange={
                setCurrentPage
              }
            />
          </section>

          {/* =========================
              MOBILE REVIEWS
          ========================= */}

          <div className="space-y-3 md:hidden">
            {paginatedReviews.map(
              (review) => (
                <article
                  key={review.id}
                  className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                >
                  {/* Main Content */}
                  <div className="p-4">
                    {/* Product Header */}
                    <div className="flex items-start gap-3">
                      {/* Image */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-subtle">
                        <Image
                          src={
                            review.productImage
                          }
                          alt={
                            review.productName
                          }
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/admin/products/${review.productId}`
                                )
                              }
                              className="block max-w-[170px] truncate text-left text-sm font-semibold text-foreground hover:text-primary"
                            >
                              {
                                review.productName
                              }
                            </button>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {
                                review.productType
                              }
                            </p>
                          </div>

                          {/* Status */}
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                              review.status
                            )}`}
                          >
                            {
                              review.status
                            }
                          </span>
                        </div>

                        {/* Rating */}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {renderStars(
                            review.rating
                          )}

                          <span className="text-xs font-medium text-muted-foreground">
                            {
                              review.rating
                            }
                            /5
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer */}
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/admin/customers/${review.customerId}`
                        )
                      }
                      className="mt-4 w-full rounded-xl bg-surface-subtle p-3 text-left transition-colors hover:bg-primary/5"
                    >
                      <p className="text-xs text-muted-foreground">
                        Customer
                      </p>

                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {
                          review.customerName
                        }
                      </p>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {
                          review.customerEmail
                        }
                      </p>
                    </button>

                    {/* Verified Purchase */}
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/admin/orders/${review.orderId}`
                        )
                      }
                      className="mt-3 flex w-full items-center justify-between rounded-xl border border-border p-3 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Verified Purchase
                        </p>

                        <p className="mt-1 text-sm font-semibold text-primary">
                          #
                          {
                            review.orderNumber
                          }
                        </p>
                      </div>

                      <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                    </button>

                    {/* Review */}
                    <div className="mt-4">
                      {review.title && (
                        <p className="text-sm font-semibold text-foreground">
                          {
                            review.title
                          }
                        </p>
                      )}

                      <p className="mt-1 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {
                          review.comment
                        }
                      </p>
                    </div>

                    {/* Submitted */}
                    <div className="mt-4 border-t border-border pt-3">
                      <p className="text-xs text-muted-foreground">
                        Submitted{" "}
                        {
                          review.submittedAt
                        }
                      </p>
                    </div>
                  </div>

                  {/* =====================
                      MOBILE ACTIONS
                  ===================== */}

                  <div className="border-t border-border bg-surface-subtle/40 p-3">
                    {/*
                      MANUAL APPROVAL:

                      Auto Approve OFF
                      +
                      Pending Review

                      Show:
                      Reject | Approve
                      View Review
                    */}

                    {!autoApprove &&
                    review.status ===
                      "Pending" ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              rejectReview(
                                review
                              )
                            }
                            className="w-full border-error/40 text-error hover:border-error hover:bg-[var(--error-background)] hover:text-error"
                          >
                            Reject
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              approveReview(
                                review
                              )
                            }
                            className="w-full border-success/40 text-success hover:border-success hover:bg-[var(--success-background)] hover:text-success"
                          >
                            Approve
                          </Button>
                        </div>

                        <Button
                          type="button"
                          variant="primary"
                          onClick={() =>
                            router.push(
                              `/admin/reviews/${review.id}`
                            )
                          }
                          className="w-full"
                        >
                          View Review
                        </Button>
                      </div>
                    ) : (
                      /*
                       * AUTO APPROVE ON
                       *
                       * OR
                       *
                       * Review already Approved / Rejected
                       *
                       * Only View Review is shown.
                       */

                      <Button
                        type="button"
                        variant="primary"
                        onClick={() =>
                          router.push(
                            `/admin/reviews/${review.id}`
                          )
                        }
                        className="w-full"
                      >
                        View Review
                      </Button>
                    )}
                  </div>
                </article>
              )
            )}

            {/* Mobile Pagination */}
            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <Pagination
                currentPage={
                  currentPage
                }
                totalPages={
                  totalPages
                }
                totalItems={
                  filteredReviews.length
                }
                pageSize={
                  pageSize
                }
                onPageChange={
                  setCurrentPage
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ====================================
   SUMMARY CARD
==================================== */

type SummaryCardProps = {
  label: string;
  value: number;

  icon:
    React.ReactNode;

  tone?:
    | "default"
    | "success"
    | "warning"
    | "error";
};

function SummaryCard({
  label,
  value,
  icon,
  tone = "default",
}: SummaryCardProps) {
  const toneClass =
    tone === "success"
      ? "bg-[var(--success-background)] text-success"
      : tone === "warning"
        ? "bg-[var(--warning-background)] text-warning"
        : tone === "error"
          ? "bg-[var(--error-background)] text-error"
          : "bg-surface-subtle text-primary";

  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClass}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}