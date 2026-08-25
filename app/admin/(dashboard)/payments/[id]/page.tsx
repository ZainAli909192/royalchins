"use client";

import { useMemo } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  CircleCheckBig,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Eye,
  Mail,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  TriangleAlert,
  User,
  WalletCards,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";

type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded";

type PaymentMethod =
  | "Card"
  | "Tamara"
  | "Tabby";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Delivered"
  | "Cancelled";

type RefundStatus =
  | "Requested"
  | "Approved"
  | "Pending"
  | "Completed"
  | "Failed"
  | "Declined";

type PaymentAttempt = {
  id: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  attemptedAt: string;
  transactionReference: string;
  responseCode?: string;
  failureReason?: string;
};

type TimelineItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  status:
    | "success"
    | "warning"
    | "error"
    | "info";
};

type Payment = {
  id: number;
  paymentNumber: string;

  orderId: number;
  orderNumber: string;
  orderStatus: OrderStatus;

  customerId: number;
  customerName: string;
  customerEmail: string;

  amount: number;
  currency: string;

  method: PaymentMethod;
  status: PaymentStatus;

  provider: string;
  transactionReference: string;
  gatewayReference?: string;
  authorizationCode?: string;
  responseCode?: string;

  createdAt: string;
  authorizedAt?: string;
  paidAt?: string;
  failedAt?: string;

  settlementStatus:
    | "Not Applicable"
    | "Pending"
    | "Settled";

  settledAt?: string;

  cardBrand?: string;
  cardLast4?: string;

  failureReason?: string;

  refundedAmount: number;

  paymentAttempts: PaymentAttempt[];

  timeline: TimelineItem[];

  refund?: {
    id: number;
    refundNumber: string;
    amount: number;
    status: RefundStatus;
    requestedAt: string;
    completedAt?: string;
    initiatedBy: string;
  };
};

const payments: Payment[] = [
  {
    id: 501,
    paymentNumber: "PAY-0501",

    orderId: 1,
    orderNumber: "RC-1028",
    orderStatus: "Processing",

    customerId: 101,
    customerName: "Ahmed Daniyal",
    customerEmail: "ahmed@example.com",

    amount: 2850,
    currency: "AED",

    method: "Card",
    status: "Paid",

    provider: "Payment Gateway",
    transactionReference:
      "TXN-RC-1028-001",
    gatewayReference:
      "GW-987654321",
    authorizationCode: "AUTH-8821",
    responseCode: "00",

    createdAt:
      "24 Aug 2026 03:40 PM",
    authorizedAt:
      "24 Aug 2026 03:40 PM",
    paidAt:
      "24 Aug 2026 03:41 PM",

    settlementStatus: "Settled",
    settledAt:
      "25 Aug 2026 09:10 AM",

    cardLast4: "5492",

    refundedAmount: 0,

    paymentAttempts: [
      {
        id: 1,
        method: "Card",
        status: "Paid",
        amount: 2850,
        attemptedAt:
          "24 Aug 2026 03:40 PM",
        transactionReference:
          "TXN-RC-1028-001",
        responseCode: "00",
      },
    ],

    timeline: [
      {
        id: 1,
        title: "Payment Created",
        description:
          "Payment transaction was created.",
        date: "24 Aug 2026 03:40 PM",
        status: "info",
      },
      {
        id: 2,
        title: "Authorized",
        description:
          "Payment was authorized by the provider.",
        date: "24 Aug 2026 03:40 PM",
        status: "success",
      },
      {
        id: 3,
        title: "Paid",
        description:
          "Payment was completed successfully.",
        date: "24 Aug 2026 03:41 PM",
        status: "success",
      },
      {
        id: 4,
        title: "Settled",
        description:
          "Payment was settled to the merchant account.",
        date: "25 Aug 2026 09:10 AM",
        status: "success",
      },
    ],
  },

  {
    id: 505,
    paymentNumber: "PAY-0505",

    orderId: 5,
    orderNumber: "RC-1024",
    orderStatus: "Cancelled",

    customerId: 105,
    customerName: "Khalid Hassan",
    customerEmail: "khalid@example.com",

    amount: 850,
    currency: "AED",

    method: "Card",
    status: "Failed",

    provider: "Payment Gateway",
    transactionReference:
      "TXN-RC-1024-005",
    gatewayReference:
      "GW-554433221",
    responseCode: "05",

    createdAt:
      "23 Aug 2026 05:45 PM",
    failedAt:
      "23 Aug 2026 05:46 PM",

    settlementStatus:
      "Not Applicable",

    cardBrand: "Mastercard",
    cardLast4: "1221",

    failureReason:
      "Payment authorization was declined by the issuing bank.",

    refundedAmount: 0,

    paymentAttempts: [
      {
        id: 1,
        method: "Card",
        status: "Failed",
        amount: 850,
        attemptedAt:
          "23 Aug 2026 05:45 PM",
        transactionReference:
          "TXN-RC-1024-005",
        responseCode: "05",
        failureReason:
          "Declined by issuing bank.",
      },
    ],

    timeline: [
      {
        id: 1,
        title: "Payment Created",
        description:
          "Payment transaction was created.",
        date: "23 Aug 2026 05:45 PM",
        status: "info",
      },
      {
        id: 2,
        title: "Payment Failed",
        description:
          "Authorization was declined by the issuing bank.",
        date: "23 Aug 2026 05:46 PM",
        status: "error",
      },
    ],
  },

  {
    id: 507,
    paymentNumber: "PAY-0507",

    orderId: 7,
    orderNumber: "RC-1022",
    orderStatus: "Delivered",

    customerId: 107,
    customerName: "Ali Rehman",
    customerEmail: "ali@example.com",

    amount: 2100,
    currency: "AED",

    method: "Tamara",
    status: "Refunded",

    provider: "Tamara",
    transactionReference:
      "TAM-RC-1022-007",
    gatewayReference:
      "TAM-778812",
    responseCode: "SUCCESS",

    createdAt:
      "22 Aug 2026 06:00 PM",
    authorizedAt:
      "22 Aug 2026 06:00 PM",
    paidAt:
      "22 Aug 2026 06:01 PM",

    settlementStatus: "Settled",
    settledAt:
      "23 Aug 2026 09:00 AM",

    refundedAmount: 2100,

    paymentAttempts: [
      {
        id: 1,
        method: "Tamara",
        status: "Paid",
        amount: 2100,
        attemptedAt:
          "22 Aug 2026 06:00 PM",
        transactionReference:
          "TAM-RC-1022-007",
        responseCode: "SUCCESS",
      },
    ],

    timeline: [
      {
        id: 1,
        title: "Payment Created",
        description:
          "Tamara payment transaction was created.",
        date: "22 Aug 2026 06:00 PM",
        status: "info",
      },
      {
        id: 2,
        title: "Paid",
        description:
          "Customer payment was completed successfully.",
        date: "22 Aug 2026 06:01 PM",
        status: "success",
      },
      {
        id: 3,
        title: "Refund Requested",
        description:
          "Refund request was created by administrator.",
        date: "23 Aug 2026 11:00 AM",
        status: "warning",
      },
      {
        id: 4,
        title: "Refund Completed",
        description:
          "Refund was completed successfully.",
        date: "23 Aug 2026 02:30 PM",
        status: "success",
      },
    ],

    refund: {
      id: 51,
      refundNumber: "RF-0051",
      amount: 2100,
      status: "Completed",
      requestedAt:
        "23 Aug 2026 11:00 AM",
      completedAt:
        "23 Aug 2026 02:30 PM",
      initiatedBy: "Admin",
    },
  },
];

export default function PaymentDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const paymentId =
    Number(params.id);

  const payment = useMemo(
    () =>
      payments.find(
        (item) =>
          item.id === paymentId
      ),
    [paymentId]
  );

  if (!payment) {
    return (
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold">
          Payment not found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          The requested payment could not be found.
        </p>

        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/admin/payments"
            )
          }
          className="mt-5"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Payments
          </span>
        </Button>
      </div>
    );
  }

  const refundableAmount =
    Math.max(
      0,
      payment.amount -
        payment.refundedAmount
    );

  const getPaymentStatusClass = (
    status: PaymentStatus
  ) => {
    if (status === "Paid") {
      return "bg-[var(--success-background)] text-success";
    }

    if (status === "Pending") {
      return "bg-[var(--warning-background)] text-warning";
    }

    if (status === "Refunded") {
      return "bg-surface-subtle text-primary";
    }

    return "bg-[var(--error-background)] text-error";
  };

  const getOrderStatusClass = (
    status: OrderStatus
  ) => {
    if (status === "Pending") {
      return "bg-[var(--warning-background)] text-warning";
    }

    if (status === "Confirmed") {
      return "bg-surface-subtle text-primary";
    }

    if (status === "Processing") {
      return "bg-[var(--info-background)] text-[var(--info)]";
    }

    if (status === "Delivered") {
      return "bg-[var(--success-background)] text-success";
    }

    return "bg-[var(--error-background)] text-error";
  };

  const getRefundStatusClass = (
    status: RefundStatus
  ) => {
    if (status === "Completed") {
      return "bg-[var(--success-background)] text-success";
    }

    if (
      status === "Failed" ||
      status === "Declined"
    ) {
      return "bg-[var(--error-background)] text-error";
    }

    if (
      status === "Requested" ||
      status === "Pending"
    ) {
      return "bg-[var(--warning-background)] text-warning";
    }

    return "bg-surface-subtle text-primary";
  };

  const getTimelineClass = (
    status: TimelineItem["status"]
  ) => {
    if (status === "success") {
      return "bg-[var(--success-background)] text-success";
    }

    if (status === "error") {
      return "bg-[var(--error-background)] text-error";
    }

    if (status === "warning") {
      return "bg-[var(--warning-background)] text-warning";
    }

    return "bg-surface-subtle text-primary";
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Payment ${payment.paymentNumber}`}
        description={`Transaction ${payment.transactionReference}`}
        action={
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                "/admin/payments"
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

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary">
              <CreditCard className="h-7 w-7" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Payment
              </p>

              <h2 className="mt-1 text-xl font-bold">
                {payment.paymentNumber}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {payment.createdAt}
              </p>
            </div>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-1.5 text-sm font-medium ${getPaymentStatusClass(
              payment.status
            )}`}
          >
            {payment.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <SummaryCard
            icon={
              <CircleDollarSign className="h-5 w-5" />
            }
            label="Original Amount"
            value={`${payment.currency} ${payment.amount.toLocaleString()}`}
          />

          <SummaryCard
            icon={
              <RefreshCcw className="h-5 w-5" />
            }
            label="Refunded"
            value={`${payment.currency} ${payment.refundedAmount.toLocaleString()}`}
          />

          <SummaryCard
            icon={
              <WalletCards className="h-5 w-5" />
            }
            label="Refundable"
            value={`${payment.currency} ${refundableAmount.toLocaleString()}`}
          />

          <SummaryCard
            icon={
              <CreditCard className="h-5 w-5" />
            }
            label="Method"
            value={payment.method}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold">
            Transaction Details
          </h2>

          <div className="mt-5 divide-y divide-border">
            <DetailRow
              label="Payment ID"
              value={
                payment.paymentNumber
              }
            />

            <DetailRow
              label="Transaction Reference"
              value={
                payment.transactionReference
              }
            />

            <DetailRow
              label="Provider"
              value={payment.provider}
            />

            <DetailRow
              label="Gateway Reference"
              value={
                payment.gatewayReference ??
                "—"
              }
            />

            <DetailRow
              label="Authorization Code"
              value={
                payment.authorizationCode ??
                "—"
              }
            />

            <DetailRow
              label="Response Code"
              value={
                payment.responseCode ??
                "—"
              }
            />

            <DetailRow
              label="Settlement Status"
              value={
                payment.settlementStatus
              }
            />

            <DetailRow
              label="Settled At"
              value={
                payment.settledAt ??
                "—"
              }
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold">
            Payment Method
          </h2>

          <div className="mt-5 divide-y divide-border">
            <DetailRow
              label="Method"
              value={payment.method}
            />

            {payment.method ===
              "Card" && (
              <>
                

                <DetailRow
                  label="Card"
                  value={
                    payment.cardLast4
                      ? `•••• ${payment.cardLast4}`
                      : "—"
                  }
                />
              </>
            )}

            <DetailRow
              label="Currency"
              value={payment.currency}
            />


            <DetailRow
              label="Paid At"
              value={
                payment.paidAt ??
                "—"
              }
            />
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold">
          Related Information
        </h2>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-surface-subtle p-4">
            <div className="flex items-start gap-3">
              <ShoppingBag className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  Order
                </p>

                <p className="mt-1 font-semibold">
                  #{payment.orderNumber}
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getOrderStatusClass(
                    payment.orderStatus
                  )}`}
                >
                  {payment.orderStatus}
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                title="View Order"
                onClick={() =>
                  router.push(
                    `/admin/orders/${payment.orderId}`
                  )
                }
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-xl bg-surface-subtle p-4">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  Customer
                </p>

                <p className="mt-1 font-semibold">
                  {payment.customerName}
                </p>

                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 shrink-0" />

                  <span className="break-all">
                    {payment.customerEmail}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                title="View Customer"
                onClick={() =>
                  router.push(
                    `/admin/customers/${payment.customerId}`
                  )
                }
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold">
            Payment Attempts
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            All payment attempts linked to this transaction.
          </p>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[850px]">
            <thead className="bg-surface-subtle">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Attempt
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Method
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Amount
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Reference
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Attempted At
                </th>
              </tr>
            </thead>

            <tbody>
              {payment.paymentAttempts.map(
                (attempt, index) => (
                  <tr
                    key={attempt.id}
                    className="border-t border-border"
                  >
                    <td className="px-5 py-4 text-sm font-semibold">
                      #{index + 1}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {attempt.method}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold">
                      AED{" "}
                      {attempt.amount.toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusClass(
                          attempt.status
                        )}`}
                      >
                        {attempt.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {
                        attempt.transactionReference
                      }
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {
                        attempt.attemptedAt
                      }
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {payment.paymentAttempts.map(
            (attempt, index) => (
              <article
                key={attempt.id}
                className="rounded-xl bg-surface-subtle p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      Attempt #{index + 1}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {attempt.method}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentStatusClass(
                      attempt.status
                    )}`}
                  >
                    {attempt.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Amount
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      AED{" "}
                      {attempt.amount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Response Code
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {attempt.responseCode ??
                        "—"}
                    </p>
                  </div>
                </div>

                <p className="mt-3 break-all text-xs text-muted-foreground">
                  {
                    attempt.transactionReference
                  }
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  {attempt.attemptedAt}
                </p>

                {attempt.failureReason && (
                  <p className="mt-3 rounded-lg bg-[var(--error-background)] p-3 text-xs leading-5 text-error">
                    {
                      attempt.failureReason
                    }
                  </p>
                )}
              </article>
            )
          )}
        </div>
      </section>

     

      {payment.status ===
        "Failed" &&
        payment.failureReason && (
          <section className="rounded-xl border border-error/20 bg-[var(--error-background)] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 h-6 w-6 shrink-0 text-error" />

              <div>
                <h2 className="font-semibold text-error">
                  Payment Failed
                </h2>

                <p className="mt-2 text-sm leading-6 text-error">
                  {
                    payment.failureReason
                  }
                </p>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-error">
                  <span>
                    Response Code:{" "}
                    {payment.responseCode ??
                      "—"}
                  </span>

                  <span>
                    Failed At:{" "}
                    {payment.failedAt ??
                      "—"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

      {payment.refund && (
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <RefreshCcw className="mt-0.5 h-5 w-5 text-primary" />

              <div>
                <h2 className="text-lg font-semibold">
                  Refund
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {
                    payment.refund
                      .refundNumber
                  }
                </p>
              </div>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getRefundStatusClass(
                payment.refund.status
              )}`}
            >
              {payment.refund.status}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              label="Refund Amount"
              value={`AED ${payment.refund.amount.toLocaleString()}`}
            />

            <InfoCard
              label="Requested At"
              value={
                payment.refund
                  .requestedAt
              }
            />

            <InfoCard
              label="Completed At"
              value={
                payment.refund
                  .completedAt ?? "—"
              }
            />

            <InfoCard
              label="Initiated By"
              value={
                payment.refund
                  .initiatedBy
              }
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/admin/refunds/${payment.refund?.id}`
                )
              }
            >
              <span className="flex items-center gap-2">
                <ReceiptText className="h-4 w-4" />
                View Refund
              </span>
            </Button>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

          <div>
            <h2 className="font-semibold text-foreground">
              Payment Controls
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Payment status and gateway references are controlled by the payment provider. Administrators should not manually change successful or failed transaction data. Refunds are handled through the Refunds module.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="break-all text-sm font-medium text-foreground sm:text-right">
        {value}
      </span>
    </div>
  );
}

type SummaryCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function SummaryCard({
  icon,
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl bg-surface-subtle p-4">
      <div className="text-primary">
        {icon}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-base font-bold text-foreground sm:text-lg">
        {value}
      </p>
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