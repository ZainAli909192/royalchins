"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  CircleCheckBig,
  Clock3,
  MoreHorizontal,
  PackageCheck,
  Search,
  ShoppingBag,
  XCircle,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { CancelOrderDialog } from "@/components/admin/orders/cancel-order-dialog";

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

type PaymentMethod =
  | "Card"
  | "Tamara"
  | "Tabby";

type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  itemCount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  placedAt: string;
};

const orders: Order[] = [
  {
    id: 1,
    orderNumber: "RC-1028",
    customerName: "Ahmed Daniyal",
    email: "ahmed@example.com",
    phone: "+971 50 123 4567",
    itemCount: 3,
    total: 2850,
    paymentStatus: "Paid",
    paymentMethod: "Card",
    orderStatus: "Processing",
    placedAt: "24 Aug 2026 03:40 PM",
  },
  {
    id: 2,
    orderNumber: "RC-1027",
    customerName: "Sara Khan",
    email: "sara@example.com",
    phone: "+971 52 222 4110",
    itemCount: 1,
    total: 1450,
    paymentStatus: "Paid",
    paymentMethod: "Tamara",
    orderStatus: "Confirmed",
    placedAt: "24 Aug 2026 02:15 PM",
  },
  {
    id: 3,
    orderNumber: "RC-1026",
    customerName: "Omar Ali",
    email: "omar@example.com",
    phone: "+971 55 981 1122",
    itemCount: 2,
    total: 920,
    paymentStatus: "Pending",
    paymentMethod: "Tabby",
    orderStatus: "Pending",
    placedAt: "24 Aug 2026 01:30 PM",
  },
  {
    id: 4,
    orderNumber: "RC-1025",
    customerName: "Mariam Noor",
    email: "mariam@example.com",
    phone: "+971 54 884 3210",
    itemCount: 4,
    total: 3680,
    paymentStatus: "Paid",
    paymentMethod: "Card",
    orderStatus: "Delivered",
    placedAt: "23 Aug 2026 07:10 PM",
  },
  {
    id: 5,
    orderNumber: "RC-1024",
    customerName: "Khalid Hassan",
    email: "khalid@example.com",
    phone: "+971 50 774 9011",
    itemCount: 1,
    total: 850,
    paymentStatus: "Failed",
    paymentMethod: "Card",
    orderStatus: "Cancelled",
    placedAt: "23 Aug 2026 05:45 PM",
  },
  {
    id: 6,
    orderNumber: "RC-1023",
    customerName: "Fatima Zahra",
    email: "fatima@example.com",
    phone: "+971 56 118 2214",
    itemCount: 2,
    total: 1725,
    paymentStatus: "Paid",
    paymentMethod: "Tabby",
    orderStatus: "Processing",
    placedAt: "23 Aug 2026 03:20 PM",
  },
  {
    id: 7,
    orderNumber: "RC-1022",
    customerName: "Ali Rehman",
    email: "ali@example.com",
    phone: "+971 52 445 2121",
    itemCount: 2,
    total: 2100,
    paymentStatus: "Paid",
    paymentMethod: "Tamara",
    orderStatus: "Delivered",
    placedAt: "22 Aug 2026 06:00 PM",
  },
  {
    id: 8,
    orderNumber: "RC-1021",
    customerName: "Noura Ahmed",
    email: "noura@example.com",
    phone: "+971 55 411 1902",
    itemCount: 1,
    total: 625,
    paymentStatus: "Pending",
    paymentMethod: "Tabby",
    orderStatus: "Pending",
    placedAt: "22 Aug 2026 12:50 PM",
  },
];

const pageSize = 6;

export default function OrdersPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] =
    useState("all");
  const [paymentStatus, setPaymentStatus] =
    useState("all");
  const [dateFilter, setDateFilter] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [openMenuId, setOpenMenuId] =
    useState<number | null>(null);

  const [cancelOrder, setCancelOrder] =
    useState<Order | null>(null);

  const [successMessage, setSuccessMessage] =
    useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        order.orderNumber
          .toLowerCase()
          .includes(searchValue) ||
        order.customerName
          .toLowerCase()
          .includes(searchValue) ||
        order.email
          .toLowerCase()
          .includes(searchValue) ||
        order.phone
          .toLowerCase()
          .includes(searchValue);

      const matchesOrderStatus =
        orderStatus === "all" ||
        order.orderStatus.toLowerCase() ===
          orderStatus;

      const matchesPaymentStatus =
        paymentStatus === "all" ||
        order.paymentStatus.toLowerCase() ===
          paymentStatus;

      let matchesDate = true;

      if (dateFilter === "today") {
        matchesDate =
          order.placedAt.startsWith(
            "24 Aug 2026"
          );
      }

      if (dateFilter === "yesterday") {
        matchesDate =
          order.placedAt.startsWith(
            "23 Aug 2026"
          );
      }

      return (
        matchesSearch &&
        matchesOrderStatus &&
        matchesPaymentStatus &&
        matchesDate
      );
    });
  }, [
    search,
    orderStatus,
    paymentStatus,
    dateFilter,
  ]);

  const totalPages = Math.ceil(
    filteredOrders.length / pageSize
  );

  const paginatedOrders =
    filteredOrders.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    orderStatus,
    paymentStatus,
    dateFilter,
  ]);

  const ordersToday =
    orders.filter((order) =>
      order.placedAt.startsWith(
        "24 Aug 2026"
      )
    ).length;

  const pendingCount =
    orders.filter(
      (order) =>
        order.orderStatus === "Pending"
    ).length;

  const processingCount =
    orders.filter(
      (order) =>
        order.orderStatus === "Processing"
    ).length;

  const deliveredCount =
    orders.filter(
      (order) =>
        order.orderStatus === "Delivered"
    ).length;

  const handleCancelOrder = async (
  reason: string,
  notes: string
) => {
  if (!cancelOrder) return;

  console.log("Cancel order:", {
    id: cancelOrder.id,
    reason,
    notes,
  });

  setSuccessMessage(
    `Order #${cancelOrder.orderNumber} cancelled successfully.`
  );

  setCancelOrder(null);
  setOpenMenuId(null);
};

  const resetFilters = () => {
    setSearch("");
    setOrderStatus("all");
    setPaymentStatus("all");
    setDateFilter("all");
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

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Orders"
        description="Manage customer orders, payments and delivery progress."
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

{/* Orders Today */}
<section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary sm:h-12 sm:w-12">
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <div className="min-w-0">
            <p className="text-sm leading-tight text-muted-foreground">
            Orders Today
            </p>

            <p className="mt-1 text-2xl font-bold text-foreground">
            {ordersToday}
            </p>
        </div>
        </div>
    </div>

    {/* Pending */}
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--warning-background)] text-warning sm:h-12 sm:w-12">
            <Clock3 className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <div className="min-w-0">
            <p className="text-sm leading-tight text-muted-foreground">
            Pending
            </p>

            <p className="mt-1 text-2xl font-bold text-warning">
            {pendingCount}
            </p>
        </div>
        </div>
    </div>

    {/* Processing */}
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--info-background)] text-[var(--info)] sm:h-12 sm:w-12">
            <PackageCheck className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <div className="min-w-0">
            <p className="text-sm leading-tight text-muted-foreground">
            Processing
            </p>

            <p className="mt-1 text-2xl font-bold text-[var(--info)]">
            {processingCount}
            </p>
        </div>
        </div>
    </div>

    {/* Delivered */}
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success-background)] text-success sm:h-12 sm:w-12">
            <CircleCheckBig className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <div className="min-w-0">
            <p className="text-sm leading-tight text-muted-foreground">
            Delivered
            </p>

            <p className="mt-1 text-2xl font-bold text-success">
            {deliveredCount}
            </p>
        </div>
        </div>
    </div>
    </section>

    <section className="rounded-xl border border-border bg-white p-3 shadow-sm sm:p-5">
  <div className="grid gap-3 xl:grid-cols-[1fr_180px_180px_170px_auto]">
    <Input
      type="search"
      placeholder="Search orders..."
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
        value={orderStatus}
        onChange={(event) =>
          setOrderStatus(event.target.value)
        }
        className="h-11 min-w-0 rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12 sm:px-4"
      >
        <option value="all">
          All Status
        </option>

        <option value="pending">
          Pending
        </option>

        <option value="confirmed">
          Confirmed
        </option>

        <option value="processing">
          Processing
        </option>

        <option value="delivered">
          Delivered
        </option>

        <option value="cancelled">
          Cancelled
        </option>
      </select>

      <select
        value={paymentStatus}
        onChange={(event) =>
          setPaymentStatus(event.target.value)
        }
        className="h-11 min-w-0 rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12 sm:px-4"
      >
        <option value="all">
          All Payments
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

      <div className="relative">
        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <select
          value={dateFilter}
          onChange={(event) =>
            setDateFilter(event.target.value)
          }
          className="h-11 w-full rounded-lg border border-border bg-white pl-9 pr-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12 sm:pl-10 sm:pr-4"
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

      {filteredOrders.length === 0 ? (
        <AdminEmptyState
          type="search"
          title="No orders found"
          description="Try changing your search or filters."
        />
      ) : (
        <>
          <section className="hidden overflow-visible rounded-xl border border-border bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Order
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Items
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Total
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Payment
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Order Status
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Placed At
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedOrders.map(
                    (order) => (
                      <tr
                        key={order.id}
                        className="border-t border-border"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-foreground">
                            #{order.orderNumber}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-foreground">
                            {order.customerName}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {order.email}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-foreground">
                          {order.itemCount}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-foreground">
                          AED{" "}
                          {order.total.toLocaleString()}
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusClass(
                                order.paymentStatus
                              )}`}
                            >
                              {order.paymentStatus}
                            </span>

                            <p className="text-xs text-muted-foreground">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusClass(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {order.placedAt}
                        </td>

                        <td className="relative px-5 py-4">
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="icon"
                              title="Order Actions"
                              aria-label={`Actions for order ${order.orderNumber}`}
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === order.id
                                    ? null
                                    : order.id
                                )
                              }
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          {openMenuId ===
                            order.id && (
                            <div className="absolute right-5 top-[54px] z-30 w-[190px] overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-lg">
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/admin/orders/${order.id}`
                                  )
                                }
                                className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-surface-subtle"
                              >
                                View Order
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  console.log(
                                    "View customer:",
                                    order.id
                                  );
                                  setOpenMenuId(
                                    null
                                  );
                                }}
                                className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-surface-subtle"
                              >
                                View Customer
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  console.log(
                                    "View payment:",
                                    order.id
                                  );
                                  setOpenMenuId(
                                    null
                                  );
                                }}
                                className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-surface-subtle"
                              >
                                View Payment
                              </button>

                              {order.orderStatus !==
                                "Delivered" &&
                                order.orderStatus !==
                                  "Cancelled" && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCancelOrder(
                                        order
                                      );
                                      setOpenMenuId(
                                        null
                                      );
                                    }}
                                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-error hover:bg-[var(--error-background)]"
                                  >
                                    Cancel Order
                                  </button>
                                )}
                            </div>
                          )}
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
                filteredOrders.length
              }
              pageSize={pageSize}
              onPageChange={
                setCurrentPage
              }
            />
          </section>

          <div className="space-y-3 md:hidden">
            {paginatedOrders.map(
              (order) => (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          #{order.orderNumber}
                        </p>

                        <p className="mt-1 text-base font-semibold text-foreground">
                          {order.customerName}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {order.email}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getOrderStatusClass(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-surface-subtle p-3">
                        <p className="text-xs text-muted-foreground">
                          Order Total
                        </p>

                        <p className="mt-1 text-sm font-bold text-foreground">
                          AED{" "}
                          {order.total.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-lg bg-surface-subtle p-3">
                        <p className="text-xs text-muted-foreground">
                          Items
                        </p>

                        <p className="mt-1 text-sm font-bold text-foreground">
                          {order.itemCount}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Payment
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {order.paymentMethod}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentStatusClass(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground">
                      {order.placedAt}
                    </p>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-2 border-t border-border bg-surface-subtle/40 px-4 py-3">
                    <Button
                      variant="primary"
                      onClick={() =>
                        router.push(
                          `/admin/orders/${order.id}`
                        )
                      }
                      className="w-full"
                    >
                      View Order
                    </Button>

                    <div className="relative">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === order.id
                              ? null
                              : order.id
                          )
                        }
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>

                      {openMenuId ===
                        order.id && (
                        <div className="absolute bottom-[48px] right-0 z-30 w-[185px] overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              console.log(
                                "View customer:",
                                order.id
                              );
                              setOpenMenuId(
                                null
                              );
                            }}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-subtle"
                          >
                            View Customer
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              console.log(
                                "View payment:",
                                order.id
                              );
                              setOpenMenuId(
                                null
                              );
                            }}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-subtle"
                          >
                            View Payment
                          </button>

                          {order.orderStatus !==
                            "Delivered" &&
                            order.orderStatus !==
                              "Cancelled" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCancelOrder(
                                    order
                                  );
                                  setOpenMenuId(
                                    null
                                  );
                                }}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm text-error hover:bg-[var(--error-background)]"
                              >
                                Cancel Order
                              </button>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            )}

            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={
                  filteredOrders.length
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

    <CancelOrderDialog
  open={Boolean(cancelOrder)}
  orderNumber={
    cancelOrder?.orderNumber ?? ""
  }
  customerName={
    cancelOrder?.customerName ?? ""
  }
  onClose={() =>
    setCancelOrder(null)
  }
  onConfirm={
    handleCancelOrder
  }
/>
    </div>
  );
}