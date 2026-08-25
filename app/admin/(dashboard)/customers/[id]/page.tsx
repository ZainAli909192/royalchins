"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Activity,
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Eye,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  RefreshCcw,
  Save,
  ShoppingBag,
  Star,
  User,
  UserCheck,
  UserX,
  WalletCards,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CustomerStatus = "Active" | "Inactive";

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

type ReviewStatus =
  | "Pending"
  | "Approved"
  | "Rejected";

type RefundStatus =
  | "Requested"
  | "Approved"
  | "Pending"
  | "Completed"
  | "Failed"
  | "Declined";

type CustomerOrder = {
  id: number;
  orderNumber: string;
  date: string;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
};

type Review = {
  id: number;
  product: string;
  rating: number;
  status: ReviewStatus;
  date: string;
};

type Refund = {
  id: number;
  refundNumber: string;
  orderId: number;
  orderNumber: string;
  amount: number;
  status: RefundStatus;
  date: string;
};

type Address = {
  id: number;
  label: string;
  emirate: string;
  area: string;
  address: string;
  building: string;
  isDefault: boolean;
};

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  lastLogin: string;
  status: CustomerStatus;

  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalSpent: number;
  totalReviews: number;

  addresses: Address[];

  orders: CustomerOrder[];
  reviews: Review[];
  refunds: Refund[];

  adminNotes: string;
};

const customers: Customer[] = [
  {
    id: 101,
    name: "Ahmed Daniyal",
    email: "ahmed@example.com",
    phone: "+971 50 123 4567",
    memberSince: "12 Jan 2026",
    lastLogin: "24 Aug 2026 02:45 PM",
    status: "Active",

    totalOrders: 6,
    deliveredOrders: 4,
    cancelledOrders: 1,
    totalSpent: 8450,
    totalReviews: 2,

    addresses: [
      {
        id: 1,
        label: "Home",
        emirate: "Dubai",
        area: "Jumeirah",
        address: "Villa 25, Street 14",
        building: "Villa 25",
        isDefault: true,
      },
      {
        id: 2,
        label: "Office",
        emirate: "Dubai",
        area: "Business Bay",
        address: "Office 1804, Tower B",
        building: "Business Tower",
        isDefault: false,
      },
    ],

    orders: [
      {
        id: 1,
        orderNumber: "RC-1028",
        date: "24 Aug 2026",
        total: 2850,
        paymentStatus: "Paid",
        orderStatus: "Processing",
      },
      {
        id: 10,
        orderNumber: "RC-0998",
        date: "10 Jul 2026",
        total: 1450,
        paymentStatus: "Paid",
        orderStatus: "Delivered",
      },
      {
        id: 11,
        orderNumber: "RC-0955",
        date: "14 Jun 2026",
        total: 2100,
        paymentStatus: "Paid",
        orderStatus: "Delivered",
      },
      {
        id: 12,
        orderNumber: "RC-0914",
        date: "20 May 2026",
        total: 850,
        paymentStatus: "Refunded",
        orderStatus: "Cancelled",
      },
    ],

    reviews: [
      {
        id: 1,
        product: "White Chinchilla",
        rating: 5,
        status: "Approved",
        date: "15 Jul 2026",
      },
      {
        id: 2,
        product: "Premium Chinchilla Cage",
        rating: 4,
        status: "Pending",
        date: "20 Aug 2026",
      },
    ],

    refunds: [
      {
        id: 1,
        refundNumber: "RF-0051",
        orderId: 12,
        orderNumber: "RC-0914",
        amount: 850,
        status: "Completed",
        date: "25 May 2026",
      },
    ],

    adminNotes:
      "Customer prefers evening delivery. Call before dispatch.",
  },
];

export default function CustomerDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const customerId = Number(params.id);

  const customer = useMemo(
    () =>
      customers.find(
        (item) => item.id === customerId
      ),
    [customerId]
  );

  const [accountStatus, setAccountStatus] =
    useState<CustomerStatus>(
      customer?.status ?? "Active"
    );

  const [adminNotes, setAdminNotes] =
    useState(
      customer?.adminNotes ?? ""
    );

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  if (!customer) {
    return (
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-foreground">
          Customer not found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          The requested customer could not be found.
        </p>

        <Button
          variant="outline"
          className="mt-5"
          onClick={() =>
            router.push(
              "/admin/customers"
            )
          }
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </span>
        </Button>
      </div>
    );
  }

  const defaultAddress =
    customer.addresses.find(
      (address) =>
        address.isDefault
    );

  const latestOrder =
    customer.orders[0] ?? null;

  const averageOrderValue =
    customer.totalOrders > 0
      ? customer.totalSpent /
        customer.totalOrders
      : 0;

  const totalRefunded =
    customer.refunds
      .filter(
        (refund) =>
          refund.status ===
          "Completed"
      )
      .reduce(
        (total, refund) =>
          total + refund.amount,
        0
      );

  const approvedReviews =
    customer.reviews.filter(
      (review) =>
        review.status ===
        "Approved"
    ).length;

  const pendingReviews =
    customer.reviews.filter(
      (review) =>
        review.status ===
        "Pending"
    ).length;

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

  const getReviewStatusClass = (
    status: ReviewStatus
  ) => {
    if (status === "Approved") {
      return "bg-[var(--success-background)] text-success";
    }

    if (status === "Pending") {
      return "bg-[var(--warning-background)] text-warning";
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

  const saveAdminNotes = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      console.log(
        "Save customer notes:",
        {
          customerId,
          adminNotes,
        }
      );

      setSuccessMessage(
        "Customer notes saved successfully."
      );
    } catch {
      setErrorMessage(
        "Unable to save customer notes."
      );
    }
  };

  const updateAccountStatus =
    async () => {
      setSuccessMessage("");
      setErrorMessage("");

      try {
        const nextStatus =
          accountStatus === "Active"
            ? "Inactive"
            : "Active";

        console.log(
          "Update customer status:",
          {
            customerId,
            status: nextStatus,
          }
        );

        setAccountStatus(
          nextStatus
        );

        setSuccessMessage(
          `Customer account ${
            nextStatus ===
            "Active"
              ? "activated"
              : "deactivated"
          } successfully.`
        );
      } catch {
        setErrorMessage(
          "Unable to update customer status."
        );
      }
    };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customer Details"
        description={`Customer #${customer.id}`}
        action={
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                "/admin/customers"
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
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-primary sm:h-16 sm:w-16">
              <User className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  {customer.name}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    accountStatus ===
                    "Active"
                      ? "bg-[var(--success-background)] text-success"
                      : "bg-surface-subtle text-muted-foreground"
                  }`}
                >
                  {accountStatus}
                </span>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Customer #{customer.id}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Member since{" "}
                {customer.memberSince}
              </p>
            </div>
          </div>

          <Button
            variant={
              accountStatus ===
              "Active"
                ? "danger"
                : "primary"
            }
            onClick={
              updateAccountStatus
            }
            className="w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              {accountStatus ===
              "Active" ? (
                <UserX className="h-4 w-4" />
              ) : (
                <UserCheck className="h-4 w-4" />
              )}

              {accountStatus ===
              "Active"
                ? "Deactivate Account"
                : "Activate Account"}
            </span>
          </Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-start gap-3 rounded-xl bg-surface-subtle p-4">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Email
              </p>

              <p className="mt-1 break-all text-sm font-medium text-foreground">
                {customer.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-surface-subtle p-4">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div>
              <p className="text-xs text-muted-foreground">
                Phone
              </p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {customer.phone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-surface-subtle p-4">
            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div>
              <p className="text-xs text-muted-foreground">
                Member Since
              </p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {customer.memberSince}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-surface-subtle p-4">
            <Activity className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div>
              <p className="text-xs text-muted-foreground">
                Last Login
              </p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {customer.lastLogin}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-6">
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <ShoppingBag className="h-5 w-5 text-primary" />

          <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
            Total Orders
          </p>

          <p className="mt-1 text-xl font-bold sm:text-2xl">
            {customer.totalOrders}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <PackageCheck className="h-5 w-5 text-success" />

          <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
            Delivered
          </p>

          <p className="mt-1 text-xl font-bold text-success sm:text-2xl">
            {customer.deliveredOrders}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <RefreshCcw className="h-5 w-5 text-error" />

          <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
            Cancelled
          </p>

          <p className="mt-1 text-xl font-bold text-error sm:text-2xl">
            {customer.cancelledOrders}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <WalletCards className="h-5 w-5 text-primary" />

          <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
            Total Spent
          </p>

          <p className="mt-1 text-base font-bold sm:text-xl">
            AED{" "}
            {customer.totalSpent.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <CircleDollarSign className="h-5 w-5 text-primary" />

          <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
            Avg. Order
          </p>

          <p className="mt-1 text-base font-bold sm:text-xl">
            AED{" "}
            {Math.round(
              averageOrderValue
            ).toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <Star className="h-5 w-5 text-primary" />

          <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
            Reviews
          </p>

          <p className="mt-1 text-xl font-bold sm:text-2xl">
            {customer.totalReviews}
          </p>
        </div>
      </section>

      {latestOrder && (
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Latest Order
              </p>

              <h2 className="mt-1 text-lg font-semibold text-foreground">
                #{latestOrder.orderNumber}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {latestOrder.date}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="sm:text-right">
                <p className="text-xs text-muted-foreground">
                  Order Total
                </p>

                <p className="mt-1 text-lg font-bold">
                  AED{" "}
                  {latestOrder.total.toLocaleString()}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusClass(
                  latestOrder.orderStatus
                )}`}
              >
                {latestOrder.orderStatus}
              </span>

              <Button
                variant="outline"
                onClick={() =>
                  router.push(
                    `/admin/orders/${latestOrder.id}`
                  )
                }
              >
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Order
                </span>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold text-foreground">
            Delivery Addresses
          </h2>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {customer.addresses.map(
            (address) => (
              <article
                key={address.id}
                className={`rounded-xl border p-4 ${
                  address.isDefault
                    ? "border-primary bg-surface-subtle"
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-foreground">
                    {address.label}
                  </p>

                  {address.isDefault && (
                    <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium text-primary-foreground">
                      Default
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {address.address}
                  <br />
                  {address.building}
                  <br />
                  {address.area},{" "}
                  {address.emirate}
                </p>
              </article>
            )
          )}
        </div>

        {!defaultAddress && (
          <p className="mt-4 text-sm text-muted-foreground">
            No default delivery address selected.
          </p>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-foreground">
            Order History
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Previous and current orders from this customer.
          </p>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[850px]">
            <thead className="bg-surface-subtle">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Order
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Date
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Amount
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Payment
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {customer.orders.map(
                (order) => (
                  <tr
                    key={order.id}
                    className="border-t border-border"
                  >
                    <td className="px-5 py-4 text-sm font-semibold">
                      #{order.orderNumber}
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {order.date}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold">
                      AED{" "}
                      {order.total.toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusClass(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
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

                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          title="View Order"
                          onClick={() =>
                            router.push(
                              `/admin/orders/${order.id}`
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

        <div className="space-y-3 p-4 md:hidden">
          {customer.orders.map(
            (order) => (
              <article
                key={order.id}
                className="rounded-xl bg-surface-subtle p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      #{order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.date}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getOrderStatusClass(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Amount
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      AED{" "}
                      {order.total.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Payment
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusClass(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/admin/orders/${order.id}`
                    )
                  }
                  className="mt-4 w-full"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Order
                  </span>
                </Button>
              </article>
            )
          )}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Refund Summary
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Refund activity linked to this customer.
            </p>
          </div>

          <div className="flex gap-5">
            <div>
              <p className="text-xs text-muted-foreground">
                Refunds
              </p>

              <p className="mt-1 text-lg font-bold">
                {customer.refunds.length}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Refunded
              </p>

              <p className="mt-1 text-lg font-bold">
                AED{" "}
                {totalRefunded.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {customer.refunds.length > 0 ? (
          <div className="mt-5 space-y-3">
            {customer.refunds.map(
              (refund) => (
                <div
                  key={refund.id}
                  className="flex flex-col gap-3 rounded-xl bg-surface-subtle p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {refund.refundNumber}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Order #
                      {refund.orderNumber} ·{" "}
                      {refund.date}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <p className="font-semibold">
                      AED{" "}
                      {refund.amount.toLocaleString()}
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getRefundStatusClass(
                        refund.status
                      )}`}
                    >
                      {refund.status}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            No refunds for this customer.
          </p>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-lg font-semibold">
              Reviews
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Reviews submitted by this customer.
            </p>
          </div>

          <div className="flex gap-3 text-sm">
            <span className="text-success">
              {approvedReviews} Approved
            </span>

            <span className="text-warning">
              {pendingReviews} Pending
            </span>
          </div>
        </div>

        {customer.reviews.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No reviews from this customer.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {customer.reviews.map(
              (review) => (
                <div
                  key={review.id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {review.product}
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-primary" />

                        <span className="text-sm font-medium">
                          {review.rating}/5
                        </span>
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getReviewStatusClass(
                      review.status
                    )}`}
                  >
                    {review.status}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Admin Notes
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Internal notes are only visible to administrators.
          </p>
        </div>

        <div className="mt-5">
          <Textarea
            label="Notes"
            placeholder="Add internal notes about this customer..."
            rows={5}
            value={adminNotes}
            onChange={(event) =>
              setAdminNotes(
                event.target.value
              )
            }
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            variant="primary"
            onClick={saveAdminNotes}
            className="w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Save Notes
            </span>
          </Button>
        </div>
      </section>
    </div>
  );
}