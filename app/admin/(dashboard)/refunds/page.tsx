"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  RefreshCcw,
  RotateCcw,
  Search,
  TriangleAlert,
  X,
  XCircle,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Textarea } from "@/components/ui/textarea";
import { AdminPageLoader } from "@/components/admin/shared/admin-page-loader";
import { getRefunds, updateRefundStatus } from "@/lib/api/refunds";

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

type Refund = {
  id: string | number;

  refundNumber: string;

  orderId: string | number;
  orderNumber: string;

  paymentId: string | number;
  paymentNumber: string;

  customerId: string | number;
  customerName: string;
  customerEmail: string;

  amount: number;
  currency: string;

  paymentMethod: PaymentMethod;

  status: RefundStatus;

  reason: string;

  requestedAt: string;

  approvedAt?: string;
  approvedBy?: string;

  declinedAt?: string;
  declinedBy?: string;
  declineReason?: string;
  declineNotes?: string;
};

const initialRefunds: Refund[] = [
  {
    id: 51,

    refundNumber: "RF-0051",

    orderId: 7,
    orderNumber: "RC-1022",

    paymentId: 507,
    paymentNumber: "PAY-0507",

    customerId: 107,
    customerName: "Ali Rehman",
    customerEmail: "ali@example.com",

    amount: 2100,
    currency: "AED",

    paymentMethod: "Tamara",

    status: "Completed",

    reason: "Customer request",

    requestedAt: "23 Aug 2026 11:00 AM",

    approvedAt: "23 Aug 2026 11:20 AM",
    approvedBy: "Admin",
  },

  {
    id: 52,

    refundNumber: "RF-0052",

    orderId: 9,
    orderNumber: "RC-1019",

    paymentId: 509,
    paymentNumber: "PAY-0509",

    customerId: 109,
    customerName: "Noor Khalid",
    customerEmail: "noor@example.com",

    amount: 850,
    currency: "AED",

    paymentMethod: "Card",

    status: "Requested",

    reason: "Duplicate order",

    requestedAt: "24 Aug 2026 11:45 AM",
  },

  {
    id: 53,

    refundNumber: "RF-0053",

    orderId: 12,
    orderNumber: "RC-1016",

    paymentId: 512,
    paymentNumber: "PAY-0512",

    customerId: 111,
    customerName: "Maha Ahmed",
    customerEmail: "maha@example.com",

    amount: 475,
    currency: "AED",

    paymentMethod: "Tabby",

    status: "Approved",

    reason: "Unable to deliver",

    requestedAt: "24 Aug 2026 10:10 AM",

    approvedAt: "24 Aug 2026 10:25 AM",
    approvedBy: "Admin",
  },

  {
    id: 54,

    refundNumber: "RF-0054",

    orderId: 14,
    orderNumber: "RC-1014",

    paymentId: 514,
    paymentNumber: "PAY-0514",

    customerId: 114,
    customerName: "Hassan Ali",
    customerEmail: "hassan@example.com",

    amount: 1200,
    currency: "AED",

    paymentMethod: "Card",

    status: "Pending",

    reason: "Customer request",

    requestedAt: "23 Aug 2026 04:30 PM",
  },

  {
    id: 55,

    refundNumber: "RF-0055",

    orderId: 16,
    orderNumber: "RC-1012",

    paymentId: 516,
    paymentNumber: "PAY-0516",

    customerId: 116,
    customerName: "Sara Omar",
    customerEmail: "sara.omar@example.com",

    amount: 650,
    currency: "AED",

    paymentMethod: "Tamara",

    status: "Failed",

    reason: "Damaged item",

    requestedAt: "22 Aug 2026 05:15 PM",
  },

  {
    id: 56,

    refundNumber: "RF-0056",

    orderId: 18,
    orderNumber: "RC-1010",

    paymentId: 518,
    paymentNumber: "PAY-0518",

    customerId: 118,
    customerName: "Noura Saleh",
    customerEmail: "noura.saleh@example.com",

    amount: 300,
    currency: "AED",

    paymentMethod: "Card",

    status: "Declined",

    reason: "Other",

    requestedAt: "21 Aug 2026 01:20 PM",

    declinedAt: "21 Aug 2026 01:40 PM",
    declinedBy: "Admin",

    declineReason: "Refund not eligible",
    declineNotes:
      "Request did not meet the refund policy.",
  },
];

const pageSize = 6;

export default function RefundsPage() {
  const router = useRouter();

  const [refunds, setRefunds] =
    useState<Refund[]>([]);
  const [isLoadingRefunds, setIsLoadingRefunds] = useState(true);

  const loadRefunds = async () => {
    try {
      const records = await getRefunds() as Array<any>;
      setRefunds(records.map((record) => ({
        id: record.id,
        refundNumber: `RF-${record.id.slice(-6).toUpperCase()}`,
        orderId: record.orderId,
        orderNumber: record.order.orderNumber,
        paymentId: record.paymentId ?? "",
        paymentNumber: record.paymentId ? `PAY-${record.paymentId.slice(-6).toUpperCase()}` : "—",
        customerId: record.order.customerId ?? "",
        customerName: record.order.customer?.name ?? record.order.customerName,
        customerEmail: record.order.customer?.email ?? record.order.email,
        amount: Number(record.amount),
        currency: record.order.payment?.currency ?? "AED",
        paymentMethod: record.order.paymentMethod,
        status: record.status,
        reason: record.reason,
        requestedAt: new Date(record.requestedAt).toLocaleString("en-AE"),
        approvedAt: record.approvedAt ? new Date(record.approvedAt).toLocaleString("en-AE") : undefined,
        declinedAt: record.declinedAt ? new Date(record.declinedAt).toLocaleString("en-AE") : undefined,
        declineReason: record.declineReason ?? undefined,
      })));
    } catch { setRefunds([]); }
    finally { setIsLoadingRefunds(false); }
  };

  useEffect(() => { void loadRefunds(); }, []);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [method, setMethod] =
    useState("all");

  const [dateFilter, setDateFilter] =
    useState("all");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    approveRefund,
    setApproveRefund,
  ] = useState<Refund | null>(
    null
  );

  const [approvedAmount, setApprovedAmount] = useState(0);

  const [
    declineRefund,
    setDeclineRefund,
  ] = useState<Refund | null>(
    null
  );

  const [
    declineReason,
    setDeclineReason,
  ] = useState("");

  const [
    declineNotes,
    setDeclineNotes,
  ] = useState("");

  const [
    dialogError,
    setDialogError,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const filteredRefunds =
    useMemo(() => {
      return refunds.filter(
        (refund) => {
          const searchValue =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            refund.refundNumber
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            refund.orderNumber
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            refund.paymentNumber
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            refund.customerName
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            refund.customerEmail
              .toLowerCase()
              .includes(
                searchValue
              );

          const matchesStatus =
            status === "all" ||
            refund.status.toLowerCase() ===
              status;

          const matchesMethod =
            method === "all" ||
            refund.paymentMethod.toLowerCase() ===
              method;

          let matchesDate = true;

          if (
            dateFilter ===
            "today"
          ) {
            matchesDate =
              refund.requestedAt.startsWith(
                "24 Aug 2026"
              );
          }

          if (
            dateFilter ===
            "yesterday"
          ) {
            matchesDate =
              refund.requestedAt.startsWith(
                "23 Aug 2026"
              );
          }

          return (
            matchesSearch &&
            matchesStatus &&
            matchesMethod &&
            matchesDate
          );
        }
      );
    }, [
      refunds,
      search,
      status,
      method,
      dateFilter,
    ]);

  const totalPages =
    Math.ceil(
      filteredRefunds.length /
        pageSize
    );

  const paginatedRefunds =
    filteredRefunds.slice(
      (currentPage - 1) *
        pageSize,
      currentPage * pageSize
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    status,
    method,
    dateFilter,
  ]);

  const requestedCount =
    refunds.filter(
      (refund) =>
        refund.status ===
        "Requested"
    ).length;

  const pendingCount =
    refunds.filter(
      (refund) =>
        refund.status ===
        "Pending"
    ).length;

  const completedCount =
    refunds.filter(
      (refund) =>
        refund.status ===
        "Completed"
    ).length;

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setMethod("all");
    setDateFilter("all");
  };

  const getStatusClass = (
    refundStatus: RefundStatus
  ) => {
    if (
      refundStatus ===
      "Completed"
    ) {
      return "bg-[var(--success-background)] text-success";
    }

    if (
      refundStatus ===
        "Failed" ||
      refundStatus ===
        "Declined"
    ) {
      return "bg-[var(--error-background)] text-error";
    }

    if (
      refundStatus ===
        "Requested" ||
      refundStatus ===
        "Pending"
    ) {
      return "bg-[var(--warning-background)] text-warning";
    }

    return "bg-surface-subtle text-primary";
  };

  const openApproveDialog = (
    refund: Refund
  ) => {
    setDialogError("");
    setApprovedAmount(refund.amount);
    setApproveRefund(refund);
  };

  const closeApproveDialog =
    () => {
      if (loading) return;

      setApproveRefund(null);
      setDialogError("");
    };

  const openDeclineDialog = (
    refund: Refund
  ) => {
    setDialogError("");
    setDeclineReason("");
    setDeclineNotes("");
    setDeclineRefund(refund);
  };

  const closeDeclineDialog =
    () => {
      if (loading) return;

      setDeclineRefund(null);

      setDeclineReason("");
      setDeclineNotes("");
      setDialogError("");
    };

  const handleApprove =
    async () => {
      if (!approveRefund) {
        return;
      }

      setDialogError("");
      setSuccessMessage("");

      try {
        setLoading(true);

        const refundId =
          approveRefund.id;

        const updated = await updateRefundStatus(refundId, { status: "Approved", amount: approvedAmount }) as { status?: RefundStatus; amount?: number | string };

        setRefunds(
          (current) =>
            current.map(
              (refund) =>
                refund.id ===
                refundId
                  ? {
                      ...refund,
                      status: updated.status ?? "Approved",
                      amount: updated.amount === undefined ? approvedAmount : Number(updated.amount),
                      approvedAt:
                        "Just now",
                      approvedBy:
                        "Admin",
                    }
                  : refund
            )
        );

        setSuccessMessage(
          `Refund ${approveRefund.refundNumber} approved successfully.`
        );

        setApproveRefund(
          null
        );
      } catch {
        setDialogError(
          "Unable to approve refund. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  const handleDecline =
    async () => {
      if (!declineRefund) {
        return;
      }

      setDialogError("");
      setSuccessMessage("");

      if (!declineReason) {
        setDialogError(
          "Please select a decline reason."
        );

        return;
      }

      try {
        setLoading(true);

        const refundId =
          declineRefund.id;

        await updateRefundStatus(refundId, { status: "Declined", declineReason, adminNote: declineNotes });

        setRefunds(
          (current) =>
            current.map(
              (refund) =>
                refund.id ===
                refundId
                  ? {
                      ...refund,

                      status:
                        "Declined",

                      declinedAt:
                        "Just now",

                      declinedBy:
                        "Admin",

                      declineReason,

                      declineNotes:
                        declineNotes.trim(),
                    }
                  : refund
            )
        );

        setSuccessMessage(
          `Refund ${declineRefund.refundNumber} declined.`
        );

        setDeclineRefund(
          null
        );

        setDeclineReason("");
        setDeclineNotes("");
      } catch {
        setDialogError(
          "Unable to decline refund. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Refunds"
        description="Review and manage customer refund requests."
      />

      {successMessage && (
        <FormAlert
          variant="success"
          message={
            successMessage
          }
          onClose={() =>
            setSuccessMessage(
              ""
            )
          }
        />
      )}

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary">
              <RotateCcw className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Total Refunds
              </p>

              <p className="mt-1 text-2xl font-bold">
                {refunds.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--warning-background)] text-warning">
              <Clock3 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Requested
              </p>

              <p className="mt-1 text-2xl font-bold text-warning">
                {requestedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary">
              <RefreshCcw className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Pending
              </p>

              <p className="mt-1 text-2xl font-bold text-primary">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success-background)] text-success">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Completed
              </p>

              <p className="mt-1 text-2xl font-bold text-success">
                {completedCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-white p-3 shadow-sm sm:p-5">
        <div className="grid gap-3 xl:grid-cols-[1fr_170px_160px_170px_auto]">
          <Input
            type="search"
            placeholder="Search refunds..."
            value={search}
            onChange={(
              event
            ) =>
              setSearch(
                event.target
                  .value
              )
            }
            leftIcon={
              <Search className="h-5 w-5" />
            }
            className="h-11 sm:h-12"
          />

          <div className="grid grid-cols-2 gap-2 xl:contents">
            <select
              value={status}
              onChange={(
                event
              ) =>
                setStatus(
                  event.target
                    .value
                )
              }
              className="h-11 min-w-0 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12"
            >
              <option value="all">
                All Status
              </option>

              <option value="requested">
                Requested
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="failed">
                Failed
              </option>

              <option value="declined">
                Declined
              </option>
            </select>

            <select
              value={method}
              onChange={(
                event
              ) =>
                setMethod(
                  event.target
                    .value
                )
              }
              className="h-11 min-w-0 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12"
            >
              <option value="all">
                All Methods
              </option>

              <option value="card">
                Card
              </option>

              <option value="tamara">
                Tamara
              </option>

              <option value="tabby">
                Tabby
              </option>
            </select>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <select
                value={
                  dateFilter
                }
                onChange={(
                  event
                ) =>
                  setDateFilter(
                    event.target
                      .value
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

            <Button
              type="button"
              variant="outline"
              onClick={
                resetFilters
              }
              className="h-11 w-full sm:h-12 xl:w-auto"
            >
              Reset
            </Button>
          </div>
        </div>
      </section>

      {isLoadingRefunds ? (
        <AdminPageLoader label="Loading refund requests" />
      ) : filteredRefunds.length === 0 ? (
        <AdminEmptyState
          type="search"
          title="No refunds found"
          description="Try changing your search or filters."
        />
      ) : (
        <>
          {/* Desktop */}
          <section className="hidden overflow-hidden rounded-xl border border-border bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1220px]">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Refund
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Order
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Method
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Requested At
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedRefunds.map(
                    (refund) => (
                      <tr
                        key={
                          refund.id
                        }
                        className="border-t border-border"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-foreground">
                            {
                              refund.refundNumber
                            }
                          </p>

                          <p className="mt-1 max-w-[190px] truncate text-xs text-muted-foreground">
                            {
                              refund.reason
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/admin/orders/${refund.orderId}`
                              )
                            }
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            #
                            {
                              refund.orderNumber
                            }
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/admin/customers/${refund.customerId}`
                              )
                            }
                            className="text-left"
                          >
                            <p className="text-sm font-medium text-foreground hover:text-primary">
                              {
                                refund.customerName
                              }
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {
                                refund.customerEmail
                              }
                            </p>
                          </button>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold">
                          {
                            refund.currency
                          }{" "}
                          {refund.amount.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {
                            refund.paymentMethod
                          }
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              refund.status
                            )}`}
                          >
                            {
                              refund.status
                            }
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {
                            refund.requestedAt
                          }
                        </td>

                     <td className="px-5 py-4">
  <div className="flex items-center justify-end gap-2">
    <Button
      variant="outline"
      size="icon"
      title="Decline Refund"
      aria-label={`Decline ${refund.refundNumber}`}
      onClick={() =>
        openDeclineDialog(refund)
      }
      className="text-error hover:border-error hover:bg-[var(--error-background)] hover:text-error"
    >
      <XCircle className="h-4 w-4" /> 
    </Button>

    <Button
      variant="outline"
      size="icon"
      title="Approve Refund"
      aria-label={`Approve ${refund.refundNumber}`}
      onClick={() =>
        openApproveDialog(refund)
      }
      className="text-success hover:border-success hover:bg-[var(--success-background)] hover:text-success"
    >
      <CheckCircle2 className="h-4 w-4" />
    </Button>

    <Button
      variant="outline"
      size="icon"
      title="View Refund"
      aria-label={`View ${refund.refundNumber}`}
      onClick={() =>
        router.push(
          `/admin/refunds/${refund.id}`
        )
      }
    >
      <Eye className="h-4 w-4" />
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
                filteredRefunds.length
              }
              pageSize={pageSize}
              onPageChange={
                setCurrentPage
              }
            />
          </section>

          {/* Mobile */}
          <div className="space-y-3 md:hidden">
            {paginatedRefunds.map(
              (refund) => (
                <article
                  key={refund.id}
                  className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {
                            refund.refundNumber
                          }
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/admin/orders/${refund.orderId}`
                            )
                          }
                          className="mt-1 text-sm font-medium text-primary"
                        >
                          #
                          {
                            refund.orderNumber
                          }
                        </button>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          refund.status
                        )}`}
                      >
                        {refund.status}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/admin/customers/${refund.customerId}`
                        )
                      }
                      className="mt-4 w-full rounded-lg bg-surface-subtle p-3 text-left"
                    >
                      <p className="text-xs text-muted-foreground">
                        Customer
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {
                          refund.customerName
                        }
                      </p>

                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        {
                          refund.customerEmail
                        }
                      </p>
                    </button>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-surface-subtle p-3">
                        <p className="text-xs text-muted-foreground">
                          Amount
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          {
                            refund.currency
                          }{" "}
                          {refund.amount.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-lg bg-surface-subtle p-3">
                        <p className="text-xs text-muted-foreground">
                          Method
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          {
                            refund.paymentMethod
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">
                        Reason
                      </p>

                      <p className="mt-1 text-sm text-foreground">
                        {refund.reason}
                      </p>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground">
                      Requested{" "}
                      {refund.requestedAt}
                    </p>
                  </div>

                  <div className="border-t border-border bg-surface-subtle/40 p-3">
                    {refund.status ===
                    "Requested" ? (
                      <div className="space-y-2">
                        <Button
                          variant="primary"
                          onClick={() =>
                            router.push(
                              `/admin/refunds/${refund.id}`
                            )
                          }
                          className="w-full"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Refund
                          </span>
                        </Button>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            onClick={() =>
                              openDeclineDialog(
                                refund
                              )
                            }
                            className="w-full"
                          >
                            <span className="flex items-center justify-center gap-2 text-error">
                              <XCircle className="h-4 w-4" />
                              Decline
                            </span>
                          </Button>

                          <Button
                            variant="primary"
                            onClick={() =>
                              openApproveDialog(
                                refund
                              )
                            }
                            className="w-full"
                          >
                            <span className="flex items-center justify-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Approve
                            </span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() =>
                          router.push(
                            `/admin/refunds/${refund.id}`
                          )
                        }
                        className="w-full"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Refund
                        </span>
                      </Button>
                    )}
                  </div>
                </article>
              )
            )}

            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <Pagination
                currentPage={
                  currentPage
                }
                totalPages={
                  totalPages
                }
                totalItems={
                  filteredRefunds.length
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

      {/* ================================
          APPROVE REFUND MODAL
      ================================= */}

      {approveRefund && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            onClick={
              closeApproveDialog
            }
            className="absolute inset-0 bg-black/50"
            aria-label="Close approve refund"
          />

          <div className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success-background)] text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Approve Refund
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Review the refund before approving it.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  closeApproveDialog
                }
                disabled={loading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-subtle hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="rounded-xl bg-surface-subtle p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Refund
                    </p>

                    <p className="mt-1 font-semibold">
                      {
                        approveRefund.refundNumber
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Order
                    </p>

                    <p className="mt-1 font-semibold">
                      #
                      {
                        approveRefund.orderNumber
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Customer
                    </p>

                    <p className="mt-1 font-semibold">
                      {
                        approveRefund.customerName
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Refund Amount
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      {approveRefund.currency}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Amount to approve</label>
                <Input type="number" min="0.01" max={approveRefund.amount} step="0.01" value={approvedAmount} onChange={(event) => setApprovedAmount(Number(event.target.value))} className="mt-2" />
                <p className="mt-1 text-xs text-muted-foreground">Maximum refundable amount: {approveRefund.currency} {approveRefund.amount.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Reason
                </p>

                <p className="mt-1 text-sm font-medium">
                  {
                    approveRefund.reason
                  }
                </p>
              </div>

              <div className="rounded-xl bg-[var(--warning-background)] p-4">
                <p className="text-sm leading-6 text-warning">
                  Approving confirms that this refund is eligible. It does not send money yet. The approved refund must still be processed through the payment provider.
                </p>
              </div>

              {dialogError && (
                <div className="rounded-xl bg-[var(--error-background)] p-4 text-sm text-error">
                  {dialogError}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <Button
                type="button"
                variant="outline"
                onClick={
                  closeApproveDialog
                }
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={
                  handleApprove
                }
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading
                  ? "Approving..."
                  : "Approve Refund"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================================
          DECLINE REFUND MODAL
      ================================= */}

      {declineRefund && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            onClick={
              closeDeclineDialog
            }
            className="absolute inset-0 bg-black/50"
            aria-label="Close decline refund"
          />

          <div className="relative z-10 max-h-[calc(100dvh-32px)] w-full max-w-[520px] overflow-y-auto rounded-2xl border border-border bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--error-background)] text-error">
                  <TriangleAlert className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Decline Refund
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    A decline reason is required.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  closeDeclineDialog
                }
                disabled={loading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-subtle"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-xl bg-surface-subtle p-4">
                <p className="font-semibold text-foreground">
                  {
                    declineRefund.refundNumber
                  }
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Order #
                  {
                    declineRefund.orderNumber
                  }
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {
                    declineRefund.customerName
                  }
                </p>

                <p className="mt-3 text-lg font-bold">
                  {
                    declineRefund.currency
                  }{" "}
                  {declineRefund.amount.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Decline Reason
                  <span className="ml-1 text-error">
                    *
                  </span>
                </label>

                <select
                  value={
                    declineReason
                  }
                  onChange={(
                    event
                  ) => {
                    setDeclineReason(
                      event.target
                        .value
                    );

                    setDialogError(
                      ""
                    );
                  }}
                  disabled={
                    loading
                  }
                  className={`h-12 w-full rounded-lg border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                    dialogError
                      ? "border-error"
                      : "border-border"
                  }`}
                >
                  <option value="">
                    Select reason
                  </option>

                  <option value="Refund not eligible">
                    Refund not eligible
                  </option>

                  <option value="Order already fulfilled">
                    Order already fulfilled
                  </option>

                  <option value="Request outside refund policy">
                    Request outside refund policy
                  </option>

                  <option value="Invalid claim">
                    Invalid claim
                  </option>

                  <option value="Duplicate refund request">
                    Duplicate refund request
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

                {dialogError && (
                  <p className="mt-1.5 text-sm text-error">
                    {
                      dialogError
                    }
                  </p>
                )}
              </div>

              <Textarea
                label="Notes"
                placeholder="Add optional internal notes..."
                rows={4}
                value={
                  declineNotes
                }
                onChange={(
                  event
                ) =>
                  setDeclineNotes(
                    event.target
                      .value
                  )
                }
                disabled={
                  loading
                }
                helperText="Internal notes for this refund decision."
              />

              <div className="rounded-xl bg-[var(--error-background)] p-4">
                <p className="text-sm leading-6 text-error">
                  Declining this request means the refund will not be sent to the payment provider.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <Button
                type="button"
                variant="outline"
                onClick={
                  closeDeclineDialog
                }
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Keep Requested
              </Button>

              <Button
                type="button"
                variant="danger"
                onClick={
                  handleDecline
                }
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading
                  ? "Declining..."
                  : "Decline Refund"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
