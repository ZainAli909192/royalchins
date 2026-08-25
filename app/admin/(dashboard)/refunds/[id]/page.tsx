"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Eye,
  Mail,
  ReceiptText,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  TriangleAlert,
  User,
  XCircle,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type RefundStatus =
  | "Requested"
  | "Approved"
  | "Pending"
  | "Completed"
  | "Failed"
  | "Declined";

type PaymentMethod =
  | "Card"
  | "Tamara"
  | "Tabby";

type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded";

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

type Refund = {
  id: number;
  refundNumber: string;
  status: RefundStatus;

  orderId: number;
  orderNumber: string;

  paymentId: number;
  paymentNumber: string;
  paymentStatus: PaymentStatus;

  customerId: number;
  customerName: string;
  customerEmail: string;

  currency: string;
  originalPaymentAmount: number;
  refundAmount: number;
  alreadyRefundedAmount: number;

  paymentMethod: PaymentMethod;

  reason: string;
  customerNote: string;
  adminNote: string;

  requestedAt: string;
  requestedBy: string;

  approvedAt?: string;
  approvedBy?: string;

  processedAt?: string;
  processedBy?: string;

  completedAt?: string;

  gatewayRefundReference?: string;

  failureReason?: string;

  timeline: TimelineItem[];
};

const refunds: Refund[] = [
  {
    id: 51,
    refundNumber: "RF-0051",
    status: "Completed",

    orderId: 7,
    orderNumber: "RC-1022",

    paymentId: 507,
    paymentNumber: "PAY-0507",
    paymentStatus: "Refunded",

    customerId: 107,
    customerName: "Ali Rehman",
    customerEmail: "ali@example.com",

    currency: "AED",
    originalPaymentAmount: 2100,
    refundAmount: 2100,
    alreadyRefundedAmount: 2100,

    paymentMethod: "Tamara",

    reason: "Customer request",

    customerNote:
      "Customer requested cancellation before delivery.",

    adminNote:
      "Refund approved after confirming order cancellation.",

    requestedAt:
      "23 Aug 2026 11:00 AM",

    requestedBy: "Admin",

    approvedAt:
      "23 Aug 2026 11:20 AM",

    approvedBy: "Admin",

    processedAt:
      "23 Aug 2026 11:30 AM",

    processedBy: "Admin",

    completedAt:
      "23 Aug 2026 02:30 PM",

    gatewayRefundReference:
      "TAM-RF-889922",

    timeline: [
      {
        id: 1,
        title: "Refund Requested",
        description:
          "Refund request was created.",
        date: "23 Aug 2026 11:00 AM",
        status: "warning",
      },
      {
        id: 2,
        title: "Refund Approved",
        description:
          "Refund request was approved.",
        date: "23 Aug 2026 11:20 AM",
        status: "info",
      },
      {
        id: 3,
        title: "Refund Processing",
        description:
          "Refund was sent to Tamara.",
        date: "23 Aug 2026 11:30 AM",
        status: "info",
      },
      {
        id: 4,
        title: "Refund Completed",
        description:
          "Provider confirmed successful refund.",
        date: "23 Aug 2026 02:30 PM",
        status: "success",
      },
    ],
  },

  {
    id: 52,
    refundNumber: "RF-0052",
    status: "Requested",

    orderId: 9,
    orderNumber: "RC-1019",

    paymentId: 509,
    paymentNumber: "PAY-0509",
    paymentStatus: "Paid",

    customerId: 109,
    customerName: "Noor Khalid",
    customerEmail: "noor@example.com",

    currency: "AED",
    originalPaymentAmount: 850,
    refundAmount: 850,
    alreadyRefundedAmount: 0,

    paymentMethod: "Card",

    reason: "Duplicate order",

    customerNote:
      "Customer accidentally placed the same order twice.",

    adminNote: "",

    requestedAt:
      "24 Aug 2026 11:45 AM",

    requestedBy: "Admin",

    timeline: [
      {
        id: 1,
        title: "Refund Requested",
        description:
          "Refund request was created and is awaiting review.",
        date: "24 Aug 2026 11:45 AM",
        status: "warning",
      },
    ],
  },

  {
    id: 55,
    refundNumber: "RF-0055",
    status: "Failed",

    orderId: 16,
    orderNumber: "RC-1012",

    paymentId: 516,
    paymentNumber: "PAY-0516",
    paymentStatus: "Paid",

    customerId: 116,
    customerName: "Sara Omar",
    customerEmail: "sara.omar@example.com",

    currency: "AED",
    originalPaymentAmount: 650,
    refundAmount: 650,
    alreadyRefundedAmount: 0,

    paymentMethod: "Tamara",

    reason: "Damaged item",

    customerNote:
      "Accessory arrived damaged.",

    adminNote:
      "Confirmed damage from customer images.",

    requestedAt:
      "22 Aug 2026 05:15 PM",

    requestedBy: "Admin",

    approvedAt:
      "22 Aug 2026 05:30 PM",

    approvedBy: "Admin",

    processedAt:
      "22 Aug 2026 05:35 PM",

    processedBy: "Admin",

    failureReason:
      "Provider rejected the refund request. Please retry.",

    timeline: [
      {
        id: 1,
        title: "Refund Requested",
        description:
          "Refund request was created.",
        date: "22 Aug 2026 05:15 PM",
        status: "warning",
      },
      {
        id: 2,
        title: "Refund Approved",
        description:
          "Refund request was approved.",
        date: "22 Aug 2026 05:30 PM",
        status: "info",
      },
      {
        id: 3,
        title: "Refund Failed",
        description:
          "Provider failed to process the refund.",
        date: "22 Aug 2026 05:36 PM",
        status: "error",
      },
    ],
  },
];

export default function RefundDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const refundId =
    Number(params.id);

  const refund = useMemo(
    () =>
      refunds.find(
        (item) =>
          item.id === refundId
      ),
    [refundId]
  );

  const [currentStatus, setCurrentStatus] =
    useState<RefundStatus>(
      refund?.status ??
        "Requested"
    );

  const [adminNote, setAdminNote] =
    useState(
      refund?.adminNote ?? ""
    );

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  if (!refund) {
    return (
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold">
          Refund not found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          The requested refund could not be found.
        </p>

        <Button
          variant="outline"
          className="mt-5"
          onClick={() =>
            router.push(
              "/admin/refunds"
            )
          }
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Refunds
          </span>
        </Button>
      </div>
    );
  }

  const refundableRemaining =
    Math.max(
      0,
      refund.originalPaymentAmount -
        refund.alreadyRefundedAmount
    );

  const getStatusClass = (
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

  const saveAdminNote = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      console.log(
        "Save refund note:",
        {
          refundId,
          adminNote,
        }
      );

      setSuccessMessage(
        "Refund note saved successfully."
      );
    } catch {
      setErrorMessage(
        "Unable to save refund note."
      );
    }
  };

  const approveRefund = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      setLoading(true);

      console.log(
        "Approve refund:",
        refundId
      );

      setCurrentStatus(
        "Approved"
      );

      setSuccessMessage(
        "Refund approved successfully."
      );
    } catch {
      setErrorMessage(
        "Unable to approve refund."
      );
    } finally {
      setLoading(false);
    }
  };

  const declineRefund = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      setLoading(true);

      console.log(
        "Decline refund:",
        refundId
      );

      setCurrentStatus(
        "Declined"
      );

      setSuccessMessage(
        "Refund declined successfully."
      );
    } catch {
      setErrorMessage(
        "Unable to decline refund."
      );
    } finally {
      setLoading(false);
    }
  };

  const processRefund = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      setLoading(true);

      console.log(
        "Send refund to provider:",
        {
          refundId,
          paymentId:
            refund.paymentId,
        }
      );

      setCurrentStatus(
        "Pending"
      );

      setSuccessMessage(
        "Refund sent to the payment provider."
      );
    } catch {
      setErrorMessage(
        "Unable to process refund."
      );
    } finally {
      setLoading(false);
    }
  };

  const retryRefund = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      setLoading(true);

      console.log(
        "Retry refund:",
        refundId
      );

      setCurrentStatus(
        "Pending"
      );

      setSuccessMessage(
        "Refund retry sent to the payment provider."
      );
    } catch {
      setErrorMessage(
        "Unable to retry refund."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Refund ${refund.refundNumber}`}
        description={`Related to order #${refund.orderNumber}`}
        action={
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                "/admin/refunds"
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

      {successMessage && (
        <FormAlert
          variant="success"
          message={successMessage}
          onClose={() =>
            setSuccessMessage("")
          }
        />
      )}

      {errorMessage && (
        <FormAlert
          variant="error"
          message={errorMessage}
          onClose={() =>
            setErrorMessage("")
          }
        />
      )}

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary">
              <RotateCcw className="h-7 w-7" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Refund
              </p>

              <h2 className="mt-1 text-xl font-bold">
                {refund.refundNumber}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Requested{" "}
                {refund.requestedAt}
              </p>
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

            {currentStatus ===
              "Requested" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={loading}
                  onClick={
                    declineRefund
                  }
                >
                  <span className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Decline
                  </span>
                </Button>

                <Button
                  variant="primary"
                  disabled={loading}
                  onClick={
                    approveRefund
                  }
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </span>
                </Button>
              </div>
            )}

            {currentStatus ===
              "Approved" && (
              <Button
                variant="primary"
                disabled={loading}
                onClick={
                  processRefund
                }
              >
                <span className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  Process Refund
                </span>
              </Button>
            )}

            {currentStatus ===
              "Failed" && (
              <Button
                variant="primary"
                disabled={loading}
                onClick={
                  retryRefund
                }
              >
                <span className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  Retry Refund
                </span>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <SummaryCard
            icon={
              <CircleDollarSign className="h-5 w-5" />
            }
            label="Original Payment"
            value={`${refund.currency} ${refund.originalPaymentAmount.toLocaleString()}`}
          />

          <SummaryCard
            icon={
              <RotateCcw className="h-5 w-5" />
            }
            label="Refund Amount"
            value={`${refund.currency} ${refund.refundAmount.toLocaleString()}`}
          />

          <SummaryCard
            icon={
              <RefreshCcw className="h-5 w-5" />
            }
            label="Already Refunded"
            value={`${refund.currency} ${refund.alreadyRefundedAmount.toLocaleString()}`}
          />

          <SummaryCard
            icon={
              <CreditCard className="h-5 w-5" />
            }
            label="Refundable Remaining"
            value={`${refund.currency} ${refundableRemaining.toLocaleString()}`}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold">
            Related Order
          </h2>

          <div className="mt-5 rounded-xl bg-surface-subtle p-4">
            <div className="flex items-start gap-3">
              <ShoppingBag className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  Order
                </p>

                <p className="mt-1 font-semibold">
                  #{refund.orderNumber}
                </p>
              </div>

              <Button
                variant="outline"
                size="icon"
                title="View Order"
                onClick={() =>
                  router.push(
                    `/admin/orders/${refund.orderId}`
                  )
                }
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-surface-subtle p-4">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  Customer
                </p>

                <p className="mt-1 font-semibold">
                  {refund.customerName}
                </p>

                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 shrink-0" />

                  <span className="break-all">
                    {refund.customerEmail}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                title="View Customer"
                onClick={() =>
                  router.push(
                    `/admin/customers/${refund.customerId}`
                  )
                }
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold">
            Original Payment
          </h2>

          <div className="mt-5 rounded-xl bg-surface-subtle p-4">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  Payment
                </p>

                <p className="mt-1 font-semibold">
                  {refund.paymentNumber}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm">
                    {refund.paymentMethod}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentStatusClass(
                      refund.paymentStatus
                    )}`}
                  >
                    {refund.paymentStatus}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                title="View Payment"
                onClick={() =>
                  router.push(
                    `/admin/payments/${refund.paymentId}`
                  )
                }
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 divide-y divide-border">
            <DetailRow
              label="Payment Method"
              value={
                refund.paymentMethod
              }
            />

            <DetailRow
              label="Gateway Refund Reference"
              value={
                refund.gatewayRefundReference ??
                "—"
              }
            />
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold">
          Refund Reason
        </h2>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-surface-subtle p-4">
            <p className="text-xs text-muted-foreground">
              Reason
            </p>

            <p className="mt-2 font-semibold">
              {refund.reason}
            </p>
          </div>

          <div className="rounded-xl bg-surface-subtle p-4">
            <p className="text-xs text-muted-foreground">
              Customer Note
            </p>

            <p className="mt-2 text-sm leading-6">
              {refund.customerNote ||
                "No customer note."}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold">
          Approval & Processing
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            label="Requested By"
            value={refund.requestedBy}
          />

          <InfoCard
            label="Approved By"
            value={
              refund.approvedBy ?? "—"
            }
          />

          <InfoCard
            label="Processed By"
            value={
              refund.processedBy ?? "—"
            }
          />

          <InfoCard
            label="Completed At"
            value={
              refund.completedAt ?? "—"
            }
          />
        </div>
      </section>

      {currentStatus ===
        "Failed" &&
        refund.failureReason && (
          <section className="rounded-xl border border-error/20 bg-[var(--error-background)] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 h-6 w-6 shrink-0 text-error" />

              <div>
                <h2 className="font-semibold text-error">
                  Refund Failed
                </h2>

                <p className="mt-2 text-sm leading-6 text-error">
                  {refund.failureReason}
                </p>
              </div>
            </div>
          </section>
        )}

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold">
          Refund Timeline
        </h2>

        <div className="mt-6 space-y-5">
          {refund.timeline.map(
            (item, index) => (
              <div
                key={item.id}
                className="relative flex gap-4"
              >
                {index <
                  refund.timeline.length -
                    1 && (
                  <span className="absolute left-[17px] top-9 h-[calc(100%+4px)] w-px bg-border" />
                )}

                <div
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getTimelineClass(
                    item.status
                  )}`}
                >
                  {item.status ===
                  "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : item.status ===
                    "error" ? (
                    <TriangleAlert className="h-4 w-4" />
                  ) : item.status ===
                    "warning" ? (
                    <Clock3 className="h-4 w-4" />
                  ) : (
                    <RotateCcw className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0 pb-2">
                  <p className="font-semibold">
                    {item.title}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.date}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold">
          Admin Notes
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Internal information about this refund.
        </p>

        <div className="mt-5">
          <Textarea
            label="Notes"
            placeholder="Enter internal refund notes..."
            rows={5}
            value={adminNote}
            onChange={(event) =>
              setAdminNote(
                event.target.value
              )
            }
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            variant="primary"
            onClick={saveAdminNote}
            className="w-full sm:w-auto"
          >
            Save Notes
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

          <div>
            <h2 className="font-semibold">
              Refund Controls
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              A refund can be approved or declined while it is requested. Once sent to Card, Tamara or Tabby, the payment provider should determine whether it becomes completed or failed.
            </p>
          </div>
        </div>
      </section>
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

      <p className="mt-1 text-base font-bold sm:text-lg">
        {value}
      </p>
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
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="break-all text-sm font-medium sm:text-right">
        {value}
      </span>
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

      <p className="mt-1 break-words text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}