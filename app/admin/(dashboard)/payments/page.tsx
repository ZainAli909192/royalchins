"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CircleCheckBig,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Eye,
  Search,
  TriangleAlert,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { getPayments } from "@/lib/api/payments";

type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded";

type PaymentMethod =
  | "Card"
  | "Tamara"
  | "Tabby";

type Payment = {
  id: string | number;
  paymentNumber: string;
  orderId: string | number;
  orderNumber: string;
  customerId: string | number;
  customerName: string;
  customerEmail: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionReference: string;
  createdAt: string;
  paidAt?: string;
};

const seedPayments: Payment[] = [
  {
    id: 501,
    paymentNumber: "PAY-0501",
    orderId: 1,
    orderNumber: "RC-1028",
    customerId: 101,
    customerName: "Ahmed Daniyal",
    customerEmail: "ahmed@example.com",
    amount: 2850,
    method: "Card",
    status: "Paid",
    transactionReference: "TXN-RC-1028-001",
    createdAt: "24 Aug 2026 03:40 PM",
    paidAt: "24 Aug 2026 03:41 PM",
  },
  {
    id: 502,
    paymentNumber: "PAY-0502",
    orderId: 2,
    orderNumber: "RC-1027",
    customerId: 102,
    customerName: "Sara Khan",
    customerEmail: "sara@example.com",
    amount: 1450,
    method: "Tamara",
    status: "Paid",
    transactionReference: "TAM-RC-1027-002",
    createdAt: "24 Aug 2026 02:15 PM",
    paidAt: "24 Aug 2026 02:16 PM",
  },
  {
    id: 503,
    paymentNumber: "PAY-0503",
    orderId: 3,
    orderNumber: "RC-1026",
    customerId: 103,
    customerName: "Omar Ali",
    customerEmail: "omar@example.com",
    amount: 920,
    method: "Tabby",
    status: "Pending",
    transactionReference: "TAB-RC-1026-003",
    createdAt: "24 Aug 2026 01:30 PM",
  },
  {
    id: 504,
    paymentNumber: "PAY-0504",
    orderId: 4,
    orderNumber: "RC-1025",
    customerId: 104,
    customerName: "Mariam Noor",
    customerEmail: "mariam@example.com",
    amount: 3680,
    method: "Card",
    status: "Paid",
    transactionReference: "TXN-RC-1025-004",
    createdAt: "23 Aug 2026 07:10 PM",
    paidAt: "23 Aug 2026 07:11 PM",
  },
  {
    id: 505,
    paymentNumber: "PAY-0505",
    orderId: 5,
    orderNumber: "RC-1024",
    customerId: 105,
    customerName: "Khalid Hassan",
    customerEmail: "khalid@example.com",
    amount: 850,
    method: "Card",
    status: "Failed",
    transactionReference: "TXN-RC-1024-005",
    createdAt: "23 Aug 2026 05:45 PM",
  },
  {
    id: 506,
    paymentNumber: "PAY-0506",
    orderId: 6,
    orderNumber: "RC-1023",
    customerId: 106,
    customerName: "Fatima Zahra",
    customerEmail: "fatima@example.com",
    amount: 1725,
    method: "Tabby",
    status: "Paid",
    transactionReference: "TAB-RC-1023-006",
    createdAt: "23 Aug 2026 03:20 PM",
    paidAt: "23 Aug 2026 03:22 PM",
  },
  {
    id: 507,
    paymentNumber: "PAY-0507",
    orderId: 7,
    orderNumber: "RC-1022",
    customerId: 107,
    customerName: "Ali Rehman",
    customerEmail: "ali@example.com",
    amount: 2100,
    method: "Tamara",
    status: "Refunded",
    transactionReference: "TAM-RC-1022-007",
    createdAt: "22 Aug 2026 06:00 PM",
    paidAt: "22 Aug 2026 06:01 PM",
  },
];

const pageSize = 6;

export default function PaymentsPage() {
  const router = useRouter();

  const [payments, setPayments] = useState<Payment[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getPayments().then((data: unknown) => {
      const records = Array.isArray(data) ? data : [];
      setPayments(records.map((record: any) => ({
        id: record.id,
        paymentNumber: `PAY-${record.id.slice(-6).toUpperCase()}`,
        orderId: record.orderId,
        orderNumber: record.order.orderNumber,
        customerId: record.order.customerId ?? "",
        customerName: record.order.customer?.name ?? record.order.customerName,
        customerEmail: record.order.customer?.email ?? record.order.email,
        amount: Number(record.amount),
        method: record.order.paymentMethod,
        status: record.status,
        transactionReference: record.providerPaymentIntentId ?? "Stripe payment pending",
        createdAt: new Date(record.createdAt).toLocaleString("en-AE"),
        paidAt: record.paidAt ? new Date(record.paidAt).toLocaleString("en-AE") : undefined,
      })));
    }).catch(() => setPayments([]));
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        payment.paymentNumber
          .toLowerCase()
          .includes(searchValue) ||
        payment.orderNumber
          .toLowerCase()
          .includes(searchValue) ||
        payment.customerName
          .toLowerCase()
          .includes(searchValue) ||
        payment.customerEmail
          .toLowerCase()
          .includes(searchValue) ||
        payment.transactionReference
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === "all" ||
        payment.status.toLowerCase() ===
          status;

      const matchesMethod =
        method === "all" ||
        payment.method.toLowerCase() ===
          method;

      let matchesDate = true;

      if (dateFilter === "today") {
        matchesDate =
          payment.createdAt.startsWith(
            "24 Aug 2026"
          );
      }

      if (dateFilter === "yesterday") {
        matchesDate =
          payment.createdAt.startsWith(
            "23 Aug 2026"
          );
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod &&
        matchesDate
      );
    });
  }, [
    search,
    status,
    method,
    dateFilter,
  ]);

  const totalPages = Math.ceil(
    filteredPayments.length / pageSize
  );

  const paginatedPayments =
    filteredPayments.slice(
      (currentPage - 1) * pageSize,
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

  const totalPayments = payments.length;

  const paidPayments =
    payments.filter(
      (payment) =>
        payment.status === "Paid"
    ).length;

  const pendingPayments =
    payments.filter(
      (payment) =>
        payment.status === "Pending"
    ).length;

  const failedPayments =
    payments.filter(
      (payment) =>
        payment.status === "Failed"
    ).length;

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setMethod("all");
    setDateFilter("all");
  };

  const getStatusClass = (
    paymentStatus: PaymentStatus
  ) => {
    if (paymentStatus === "Paid") {
      return "bg-[var(--success-background)] text-success";
    }

    if (paymentStatus === "Pending") {
      return "bg-[var(--warning-background)] text-warning";
    }

    if (paymentStatus === "Refunded") {
      return "bg-surface-subtle text-primary";
    }

    return "bg-[var(--error-background)] text-error";
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Payments"
        description="View and manage customer payment transactions."
      />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-subtle text-primary">
              <CircleDollarSign className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Payments
              </p>

              <p className="mt-1 text-2xl font-bold">
                {totalPayments}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--success-background)] text-success">
              <CircleCheckBig className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Paid
              </p>

              <p className="mt-1 text-2xl font-bold text-success">
                {paidPayments}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--warning-background)] text-warning">
              <Clock3 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Pending
              </p>

              <p className="mt-1 text-2xl font-bold text-warning">
                {pendingPayments}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--error-background)] text-error">
              <TriangleAlert className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Failed
              </p>

              <p className="mt-1 text-2xl font-bold text-error">
                {failedPayments}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-3 shadow-sm sm:p-5">
        <div className="grid gap-3 xl:grid-cols-[1fr_170px_160px_170px_auto]">
          <Input
            type="search"
            placeholder="Search payment, order or customer..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            leftIcon={
              <Search className="h-5 w-5" />
            }
            className="h-11 sm:h-12"
          />

          <div className="grid grid-cols-2 gap-2 xl:contents">
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

              <option value="paid">
                Paid
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="failed">
                Failed
              </option>

              <option value="refunded">
                Refunded
              </option>
            </select>

            <select
              value={method}
              onChange={(event) =>
                setMethod(
                  event.target.value
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

            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="h-11 w-full sm:h-12 xl:w-auto"
            >
              Reset
            </Button>
          </div>
        </div>
      </section>

      {filteredPayments.length === 0 ? (
        <AdminEmptyState
          type="search"
          title="No payments found"
          description="Try changing your search or filters."
        />
      ) : (
        <>
          <section className="hidden overflow-hidden rounded-xl border border-border bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Payment
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
                      Created At
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedPayments.map(
                    (payment) => (
                      <tr
                        key={payment.id}
                        className="border-t border-border"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold">
                            {payment.paymentNumber}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {
                              payment.transactionReference
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/admin/orders/${payment.orderId}`
                              )
                            }
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            #{payment.orderNumber}
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/admin/customers/${payment.customerId}`
                              )
                            }
                            className="text-left"
                          >
                            <p className="text-sm font-medium text-foreground hover:text-primary">
                              {
                                payment.customerName
                              }
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {
                                payment.customerEmail
                              }
                            </p>
                          </button>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold">
                          AED{" "}
                          {payment.amount.toLocaleString()}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-primary" />

                            <span className="text-sm">
                              {payment.method}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {payment.createdAt}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              onClick={() =>
                                router.push(
                                  `/admin/payments/${payment.id}`
                                )
                              }
                            >
                              <span className="flex items-center gap-2 whitespace-nowrap">
                                <Eye className="h-4 w-4" />
                                View Payment
                              </span>
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
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={
                filteredPayments.length
              }
              pageSize={pageSize}
              onPageChange={
                setCurrentPage
              }
            />
          </section>

          <div className="space-y-3 md:hidden">
            {paginatedPayments.map(
              (payment) => (
                <article
                  key={payment.id}
                  className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">
                          {payment.paymentNumber}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/admin/orders/${payment.orderId}`
                            )
                          }
                          className="mt-1 text-sm font-medium text-primary"
                        >
                          #{payment.orderNumber}
                        </button>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/admin/customers/${payment.customerId}`
                        )
                      }
                      className="mt-4 w-full rounded-lg bg-surface-subtle p-3 text-left"
                    >
                      <p className="text-xs text-muted-foreground">
                        Customer
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {payment.customerName}
                      </p>

                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        {payment.customerEmail}
                      </p>
                    </button>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-surface-subtle p-3">
                        <p className="text-xs text-muted-foreground">
                          Amount
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          AED{" "}
                          {payment.amount.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-lg bg-surface-subtle p-3">
                        <p className="text-xs text-muted-foreground">
                          Method
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          {payment.method}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground">
                      {payment.createdAt}
                    </p>
                  </div>

                  <div className="border-t border-border bg-surface-subtle/40 p-3">
                    <Button
                      variant="primary"
                      onClick={() =>
                        router.push(
                          `/admin/payments/${payment.id}`
                        )
                      }
                      className="w-full"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Payment
                      </span>
                    </Button>
                  </div>
                </article>
              )
            )}

            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={
                  filteredPayments.length
                }
                pageSize={pageSize}
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
