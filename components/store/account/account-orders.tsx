"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
  Truck,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Delivered"
  | "Cancelled";

type PaymentStatus =
  | "Paid"
  | "Pending"
  | "Failed"
  | "Refunded";

type OrderItem = {
  id: string;
  name: string;
  image: string;
  quantity: number;
};

type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  items: OrderItem[];
  refundStatus?: "Requested" | "Approved" | "Completed" | "Failed" | "Declined";
};

export function AccountOrders() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loaded, setLoaded] =
    useState(false);

  const [
    cancellingOrder,
    setCancellingOrder,
  ] = useState<Order | null>(
    null
  );

  const [
    isCancelling,
    setIsCancelling,
  ] = useState(false);

  const [
    cancelError,
    setCancelError,
  ] = useState("");

  useEffect(() => {
    fetch(
      "/api/store/account/orders"
    )
      .then(async (response) => ({
        response,
        data:
          await response.json(),
      }))
      .then(
        ({
          response,
          data,
        }) => {
          if (!response.ok) {
            return;
          }

          setOrders(
            data.map(
              (order: {
                orderNumber: string;
                createdAt: string;
                orderStatus: OrderStatus;
                paymentStatus: PaymentStatus;
                total:
                  | string
                  | number;
                items: {
                  id: string;
                  productName: string;
                  quantity: number;
                  product: {
                    images: {
                      url: string;
                    }[];
                  } | null;
                }[];
                refund?: { status: Order["refundStatus"] } | null;
              }) => ({
                id:
                  order.orderNumber,

                date: new Date(
                  order.createdAt
                ).toLocaleDateString(
                  "en-AE",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                ),

                status:
                  order.orderStatus,

                paymentStatus:
                  order.paymentStatus,

                total: Number(
                  order.total
                ),

                items:
                  order.items.map(
                    (item) => ({
                      id: item.id,
                      name:
                        item.productName,
                      image:
                        item.product
                          ?.images[0]
                          ?.url ??
                        "/placeholder.png",
                      quantity:
                        item.quantity,
                    })
                  ),

                refundStatus: order.refund?.status,
              })
            )
          );
        }
      )
      .finally(() =>
        setLoaded(true)
      );
  }, []);

  const handleCancelOrder =
    async () => {
      if (
        !cancellingOrder ||
        isCancelling
      ) {
        return;
      }

      setCancelError("");
      setIsCancelling(true);

      try {
        const response =
          await fetch(
            `/api/store/account/orders/${encodeURIComponent(
              cancellingOrder.id
            )}/cancel`,
            {
              method: "PATCH",
            }
          );

        const data =
          await response
            .json()
            .catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message ??
              "Unable to cancel this order."
          );
        }

        setOrders(
          (current) =>
            current.map(
              (order) =>
                order.id ===
                cancellingOrder.id
                  ? {
                      ...order,
                      status:
                        "Cancelled",
                    }
                  : order
            )
        );

        setCancellingOrder(
          null
        );
      } catch (caught) {
        setCancelError(
          caught instanceof Error
            ? caught.message
            : "Unable to cancel this order."
        );
      } finally {
        setIsCancelling(
          false
        );
      }
    };

  if (!loaded) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-16 text-center text-sm font-semibold text-muted-foreground">
        Loading your orders…
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            My Account
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                My Orders
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                View your
                purchases, payment
                status and delivery
                progress.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              <ShoppingBag className="h-3.5 w-3.5" />

              {orders.length} Orders
            </div>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(
              (order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={() => {
                    setCancelError(
                      ""
                    );

                    setCancellingOrder(
                      order
                    );
                  }}
                />
              )
            )}
          </div>
        ) : (
          <EmptyOrders />
        )}
      </div>

      {cancellingOrder && (
        <CancelOrderModal
          order={
            cancellingOrder
          }
          isCancelling={
            isCancelling
          }
          error={cancelError}
          onClose={() => {
            if (
              isCancelling
            ) {
              return;
            }

            setCancelError(
              ""
            );

            setCancellingOrder(
              null
            );
          }}
          onConfirm={
            handleCancelOrder
          }
        />
      )}
    </>
  );
}

function OrderCard({
  order,
  onCancel,
}: {
  order: Order;
  onCancel: () => void;
}) {
  const totalItems =
    order.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const canCancel =
    order.status ===
      "Pending" ||
    order.status ===
      "Confirmed";

  const canRequestRefund =
    order.status ===
      "Cancelled" &&
    order.paymentStatus === "Paid" &&
    !order.refundStatus;

  const isRefunded =
    order.status ===
      "Cancelled" &&
    order.paymentStatus ===
      "Refunded";

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm sm:rounded-3xl">
      <div className="flex flex-col gap-4 border-b border-border bg-surface-subtle p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
              Order
            </p>

            <p className="mt-0.5 text-sm font-bold text-foreground">
              #{order.id}
            </p>
          </div>

          <div className="hidden h-8 w-px bg-border sm:block" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
              Order Date
            </p>

            <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />

              {order.date}
            </div>
          </div>

          <div className="hidden h-8 w-px bg-border md:block" />

          <div className="hidden md:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
              Total
            </p>

            <p className="mt-0.5 text-sm font-bold text-primary">
              AED{" "}
              {order.total.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge
            status={order.status}
          />

          <PaymentBadge
            status={
              order.paymentStatus
            }
          />
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-foreground">
                {totalItems}{" "}
                {totalItems === 1
                  ? "Item"
                  : "Items"}
              </p>

              <span className="h-1 w-1 rounded-full bg-muted-foreground" />

              <p className="text-xs text-muted-foreground">
                {order.items.length}{" "}
                {order.items
                  .length === 1
                  ? "Product"
                  : "Products"}
              </p>
            </div>

            <div className="mt-4 flex items-center">
              {order.items
                .slice(0, 4)
                .map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.id
                      }
                      className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 border-background bg-surface-subtle sm:h-[72px] sm:w-[72px] ${
                        index > 0
                          ? "-ml-3"
                          : ""
                      }`}
                      title={
                        item.name
                      }
                    >
                      <Image
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                        fill
                        unoptimized
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>
                  )
                )}

              {order.items
                .length >
                4 && (
                <div className="-ml-3 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-background bg-primary text-xs font-bold text-primary-foreground sm:h-[72px] sm:w-[72px]">
                  +
                  {order.items
                    .length - 4}
                </div>
              )}
            </div>

            <div className="mt-3 space-y-1">
              {order.items
                .slice(0, 2)
                .map(
                  (item) => (
                    <p
                      key={
                        item.id
                      }
                      className="truncate text-xs text-muted-foreground"
                    >
                      {
                        item.name
                      }

                      {item.quantity >
                      1
                        ? ` × ${item.quantity}`
                        : ""}
                    </p>
                  )
                )}

              {order.items
                .length >
                2 && (
                <p className="text-xs font-semibold text-primary">
                  +{" "}
                  {order.items
                    .length -
                    2}{" "}
                  more
                </p>
              )}
            </div>

            {order.status ===
              "Cancelled" && (
              <div className="mt-4 rounded-xl border border-error/15 bg-error/5 px-3.5 py-3">
                <div className="flex items-start gap-2.5">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" />

                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Order
                      cancelled
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                      {order.paymentStatus ===
                      "Paid"
                        ? "Your payment was already collected. You can submit a refund request for this order."
                        : order.paymentStatus ===
                            "Refunded"
                          ? "The payment for this order has been refunded."
                          : "No refund request is required because this order does not have a completed payment."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4 lg:w-[230px] lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div className="flex items-center justify-between md:hidden">
              <span className="text-xs text-muted-foreground">
                Order Total
              </span>

              <span className="text-lg font-bold text-primary">
                AED{" "}
                {order.total.toLocaleString()}
              </span>
            </div>

            <Button
              asChild
              variant="primary"
              className="mt-4 h-11 w-full rounded-xl text-sm font-bold lg:mt-0"
            >
              <Link
                href={`/account/orders/${order.id}`}
                className="whitespace-nowrap"
              >
                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                  <span>
                    View Order
                  </span>

                  <ArrowRight className="h-4 w-4 shrink-0" />
                </span>
              </Link>
            </Button>

            {canCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={
                  onCancel
                }
                className="mt-2 h-11 w-full rounded-xl text-sm font-bold"
              >
                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                  <XCircle className="h-4 w-4 shrink-0" />

                  <span>
                    Cancel Order
                  </span>
                </span>
              </Button>
            )}

            {canRequestRefund && (
              <Button
                asChild
                variant="secondary"
                className="mt-2 h-11 w-full rounded-xl text-sm font-bold"
              >
                <Link
                  href={`/account/orders/${order.id}/refund`}
                  className="whitespace-nowrap"
                >
                  <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    <RotateCcw className="h-4 w-4 shrink-0" />

                    <span>
                      Request
                      Refund
                    </span>
                  </span>
                </Link>
              </Button>
            )}

            {order.refundStatus && (
              <div className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-primary/10 px-4 text-sm font-bold text-primary">
                Refund {order.refundStatus}
              </div>
            )}

            {isRefunded && (
              <div className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-success/10 px-4 text-sm font-bold text-success">
                <CheckCircle2 className="h-4 w-4 shrink-0" />

                Refunded
              </div>
            )}

            {order.status ===
              "Delivered" && (
              <Button
                asChild
                variant="secondary"
                className="mt-2 h-11 w-full rounded-xl text-sm font-bold"
              >
                <Link
                  href={`/account/reviews?order=${order.id}`}
                  className="whitespace-nowrap"
                >
                  Write a Review
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function CancelOrderModal({
  order,
  isCancelling,
  error,
  onClose,
  onConfirm,
}: {
  order: Order;
  isCancelling: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const paymentCollected =
    order.paymentStatus ===
    "Paid";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={
        onClose
      }
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-order-title"
        onMouseDown={(
          event
        ) =>
          event.stopPropagation()
        }
        className="relative w-full max-w-md rounded-3xl border border-border bg-background p-5 shadow-xl sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={
            isCancelling
          }
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-error">
          <XCircle className="h-5 w-5" />
        </span>

        <h2
          id="cancel-order-title"
          className="mt-5 text-xl font-bold text-foreground"
        >
          Cancel this order?
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You are cancelling{" "}
          <span className="font-semibold text-foreground">
            #{order.id}
          </span>
          . Once cancelled,
          Royal Chins will stop
          processing this order.
        </p>

        {paymentCollected && (
          <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 p-3.5">
            <div className="flex items-start gap-2.5">
              <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <p className="text-xs leading-5 text-muted-foreground">
                This order has
                already been paid.
                Cancelling the
                order will{" "}
                <span className="font-bold text-foreground">
                  not
                  automatically
                  refund the
                  payment
                </span>
                . After
                cancellation,
                you can submit a
                refund request
                for Admin review.
              </p>
            </div>
          </div>
        )}

        {!paymentCollected && (
          <div className="mt-4 rounded-xl bg-surface-subtle p-3.5">
            <p className="text-xs leading-5 text-muted-foreground">
              No completed
              payment is attached
              to this order, so a
              refund request will
              not be required.
            </p>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-error/10 px-4 py-3 text-sm font-semibold text-error">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            disabled={
              isCancelling
            }
            onClick={onClose}
            className="h-11 rounded-xl px-5"
          >
            Keep Order
          </Button>

          <Button
            type="button"
            variant="danger"
            disabled={
              isCancelling
            }
            onClick={
              onConfirm
            }
            className="h-11 rounded-xl px-5"
          >
            <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              <XCircle className="h-4 w-4 shrink-0" />

              <span>
                {isCancelling
                  ? "Cancelling..."
                  : "Cancel Order"}
              </span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const config = {
    Pending: {
      icon: Clock3,
      className:
        "bg-warning/10 text-warning",
    },

    Confirmed: {
      icon: CheckCircle2,
      className:
        "bg-primary/10 text-primary",
    },

    Processing: {
      icon: PackageCheck,
      className:
        "bg-primary/10 text-primary",
    },

    Delivered: {
      icon: Truck,
      className:
        "bg-success/10 text-success",
    },

    Cancelled: {
      icon: XCircle,
      className:
        "bg-error/10 text-error",
    },
  }[status];

  const Icon =
    config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold sm:text-xs ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {status}
    </span>
  );
}

function PaymentBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const className = {
    Paid:
      "bg-success/10 text-success",

    Pending:
      "bg-warning/10 text-warning",

    Failed:
      "bg-error/10 text-error",

    Refunded:
      "bg-surface-subtle text-muted-foreground",
  }[status];

  return (
    <span
      className={`rounded-full px-2.5 py-1.5 text-[10px] font-bold sm:text-xs ${className}`}
    >
      {status}
    </span>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-3xl border border-border bg-background px-5 py-14 text-center shadow-sm sm:py-20">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ShoppingBag className="h-7 w-7" />
      </span>

      <h2 className="mt-5 text-xl font-bold text-foreground">
        No orders yet
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        When you purchase a
        companion or accessory,
        your orders will appear
        here.
      </p>

      <Button
        asChild
        variant="primary"
        className="mt-6 h-11 rounded-xl px-6"
      >
        <Link href="/">
          Start Shopping
        </Link>
      </Button>
    </div>
  );
}
