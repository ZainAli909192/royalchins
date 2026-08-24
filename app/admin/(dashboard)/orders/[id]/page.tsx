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
  Banknote,
  Check,
  CircleCheckBig,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { CancelOrderDialog } from "@/components/admin/orders/cancel-order-dialog";
import { FormAlert } from "@/components/forms/form-alert";
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

type PaymentMethod =
  | "Card"
  | "Tamara"
  | "Tabby";

type DeliveryStatus =
  | "Not Scheduled"
  | "Scheduled"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered"
  | "Delivery Failed"
  | "Rescheduled"
  | "Cancelled";

type OrderItem = {
  id: number;
  name: string;
  type: "Animal" | "Accessory";
  sku: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  placedAt: string;

  orderStatus: OrderStatus;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionReference: string;
  paidAt: string;

  deliveryStatus: DeliveryStatus;
  deliveryFee: number;
  deliveryAddress: {
    emirate: string;
    area: string;
    address: string;
    building: string;
    phone: string;
  };

  items: OrderItem[];

  subtotal: number;
  total: number;

  customerNotes: string;
  adminNotes: string;
};

const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: "RC-1028",
    customerName: "Ahmed Daniyal",
    email: "ahmed@example.com",
    phone: "+971 50 123 4567",
    placedAt:
      "24 Aug 2026 03:40 PM",

    orderStatus: "Processing",

    paymentMethod: "Card",
    paymentStatus: "Paid",
    transactionReference:
      "PAY-RC-1028-001",
    paidAt:
      "24 Aug 2026 03:41 PM",

    deliveryStatus: "Preparing",
    deliveryFee: 50,

    deliveryAddress: {
      emirate: "Dubai",
      area: "Jumeirah",
      address:
        "Villa 25, Street 14",
      building:
        "Villa 25",
      phone:
        "+971 50 123 4567",
    },

    items: [
      {
        id: 1,
        name: "White Chinchilla",
        type: "Animal",
        sku: "RC-ANI-000001",
        quantity: 1,
        unitPrice: 1450,
      },
      {
        id: 2,
        name: "Premium Chinchilla Cage",
        type: "Accessory",
        sku: "RC-ACC-000005",
        quantity: 1,
        unitPrice: 650,
      },
      {
        id: 3,
        name: "Premium Animal Bedding",
        type: "Accessory",
        sku: "RC-ACC-000007",
        quantity: 1,
        unitPrice: 700,
      },
    ],

    subtotal: 2800,
    total: 2850,

    customerNotes:
      "Please call before delivery.",

    adminNotes:
      "Customer confirmed delivery details.",
  },
];

const orderSteps: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Delivered",
];

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const orderId = Number(params.id);

  const order = useMemo(
    () =>
      mockOrders.find(
        (item) =>
          item.id === orderId
      ),
    [orderId]
  );

  const [currentOrderStatus, setCurrentOrderStatus] =
    useState<OrderStatus>(
      order?.orderStatus ??
        "Pending"
    );

  const [
    currentDeliveryStatus,
    setCurrentDeliveryStatus,
  ] = useState<DeliveryStatus>(
    order?.deliveryStatus ??
      "Not Scheduled"
  );

  const [
    cancelDialogOpen,
    setCancelDialogOpen,
  ] = useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  if (!order) {
    return (
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-foreground">
          Order not found
        </h1>

        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/admin/orders"
            )
          }
          className="mt-5"
        >
          Back to Orders
        </Button>
      </div>
    );
  }

  const getOrderStatusClass = (
    status: OrderStatus
  ) => {
    if (status === "Pending") {
      return "bg-[var(--warning-background)] text-warning";
    }

    if (status === "Confirmed") {
      return "bg-surface-subtle text-primary";
    }

    if (
      status === "Processing"
    ) {
      return "bg-[var(--info-background)] text-[var(--info)]";
    }

    if (
      status === "Delivered"
    ) {
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

  const getDeliveryStatusClass = (
    status: DeliveryStatus
  ) => {
    if (
      status === "Delivered"
    ) {
      return "bg-[var(--success-background)] text-success";
    }

    if (
      status ===
        "Delivery Failed" ||
      status === "Cancelled"
    ) {
      return "bg-[var(--error-background)] text-error";
    }

    if (
      status ===
      "Out for Delivery"
    ) {
      return "bg-[var(--info-background)] text-[var(--info)]";
    }

    if (
      status === "Scheduled" ||
      status === "Preparing" ||
      status === "Rescheduled"
    ) {
      return "bg-surface-subtle text-primary";
    }

    return "bg-[var(--warning-background)] text-warning";
  };

  const saveOrderStatus = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      console.log(
        "Update order status:",
        {
          orderId,
          status:
            currentOrderStatus,
        }
      );

      setSuccessMessage(
        "Order status updated successfully."
      );
    } catch {
      setErrorMessage(
        "Unable to update order status."
      );
    }
  };

  const saveDeliveryStatus =
    async () => {
      setErrorMessage("");
      setSuccessMessage("");

      try {
        console.log(
          "Update delivery status:",
          {
            orderId,
            status:
              currentDeliveryStatus,
          }
        );

        setSuccessMessage(
          "Delivery status updated successfully."
        );
      } catch {
        setErrorMessage(
          "Unable to update delivery status."
        );
      }
    };

  const handleCancelOrder =
    async (
      reason: string,
      notes: string
    ) => {
      setErrorMessage("");
      setSuccessMessage("");

      try {
        console.log(
          "Cancel order:",
          {
            orderId,
            reason,
            notes,
          }
        );

        setCurrentOrderStatus(
          "Cancelled"
        );

        setCancelDialogOpen(
          false
        );

        setSuccessMessage(
          `Order #${order.orderNumber} cancelled successfully.`
        );
      } catch {
        setErrorMessage(
          "Unable to cancel order."
        );
      }
    };

  const currentStepIndex =
    orderSteps.indexOf(
      currentOrderStatus
    );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Order #${order.orderNumber}`}
        description={`Placed on ${order.placedAt}`}
        action={
          <div className="flex flex-wrap items-center justify-end gap-2">
            {currentOrderStatus !==
              "Delivered" &&
              currentOrderStatus !==
                "Cancelled" && (
                <Button
                  variant="danger"
                  onClick={() =>
                    setCancelDialogOpen(
                      true
                    )
                  }
                >
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <XCircle className="h-4 w-4" />
                    Cancel Order
                  </span>
                </Button>
              )}

            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/admin/orders"
                )
              }
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                <ArrowLeft className="h-4 w-4" />
                Back
              </span>
            </Button>
          </div>
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

      {currentOrderStatus ===
        "Cancelled" && (
        <section className="rounded-xl border border-error/20 bg-[var(--error-background)] p-5">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-error" />

            <div>
              <h2 className="font-semibold text-error">
                Order Cancelled
              </h2>

              <p className="mt-1 text-sm text-error">
                This order has been cancelled. Payment refunds are handled separately.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Current Order Status
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${getOrderStatusClass(
                currentOrderStatus
              )}`}
            >
              {currentOrderStatus}
            </span>
          </div>

          {currentOrderStatus !==
            "Cancelled" && (
            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              <select
                value={
                  currentOrderStatus
                }
                onChange={(event) =>
                  setCurrentOrderStatus(
                    event.target
                      .value as OrderStatus
                  )
                }
                disabled={
                  currentOrderStatus ===
                  "Delivered"
                }
                className="h-11 min-w-[190px] rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Processing">
                  Processing
                </option>

                <option value="Delivered">
                  Delivered
                </option>
              </select>

              <Button
                variant="primary"
                onClick={
                  saveOrderStatus
                }
                disabled={
                  currentOrderStatus ===
                  "Delivered"
                }
              >
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Status
                </span>
              </Button>
            </div>
          )}
        </div>

        {currentOrderStatus !==
          "Cancelled" && (
          <div className="mt-6 grid grid-cols-4 gap-2">
            {orderSteps.map(
              (step, index) => {
                const completed =
                  index <=
                  currentStepIndex;

                return (
                  <div
                    key={step}
                    className="text-center"
                  >
                    <div
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${
                        completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-subtle text-muted-foreground"
                      }`}
                    >
                      {completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-semibold">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-2 text-[10px] sm:text-xs ${
                        completed
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Customer Details
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex gap-3">
              <User className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Customer
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {order.customerName}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-foreground">
                  {order.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Phone
                </p>

                <p className="mt-1 text-sm text-foreground">
                  {order.phone}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              Payment Details
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusClass(
                order.paymentStatus
              )}`}
            >
              {order.paymentStatus}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-surface-subtle p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />

                <p className="text-xs text-muted-foreground">
                  Payment Method
                </p>
              </div>

              <p className="mt-2 text-sm font-semibold text-foreground">
                {order.paymentMethod}
              </p>
            </div>

            <div className="rounded-lg bg-surface-subtle p-4">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-primary" />

                <p className="text-xs text-muted-foreground">
                  Paid At
                </p>
              </div>

              <p className="mt-2 text-sm font-semibold text-foreground">
                {order.paidAt}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              Transaction Reference
            </p>

            <p className="mt-1 break-all text-sm font-medium text-foreground">
              {
                order.transactionReference
              }
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Delivery
            </h2>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getDeliveryStatusClass(
                currentDeliveryStatus
              )}`}
            >
              {
                currentDeliveryStatus
              }
            </span>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <select
              value={
                currentDeliveryStatus
              }
              onChange={(event) =>
                setCurrentDeliveryStatus(
                  event.target
                    .value as DeliveryStatus
                )
              }
              className="h-11 min-w-[210px] rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="Not Scheduled">
                Not Scheduled
              </option>

              <option value="Scheduled">
                Scheduled
              </option>

              <option value="Preparing">
                Preparing
              </option>

              <option value="Out for Delivery">
                Out for Delivery
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Delivery Failed">
                Delivery Failed
              </option>

              <option value="Rescheduled">
                Rescheduled
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

            <Button
              variant="primary"
              onClick={
                saveDeliveryStatus
              }
            >
              Save Delivery
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3 rounded-xl bg-surface-subtle p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-semibold text-foreground">
                Delivery Address
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {
                  order
                    .deliveryAddress
                    .address
                }
                <br />

                {
                  order
                    .deliveryAddress
                    .area
                }
                ,{" "}
                {
                  order
                    .deliveryAddress
                    .emirate
                }
                <br />

                {
                  order
                    .deliveryAddress
                    .building
                }
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-xl bg-surface-subtle p-4">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-semibold text-foreground">
                Delivery Details
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Delivery Fee
              </p>

              <p className="mt-1 font-semibold text-foreground">
                AED{" "}
                {order.deliveryFee.toLocaleString()}
              </p>

              <p className="mt-3 text-sm text-muted-foreground">
                Contact
              </p>

              <p className="mt-1 text-sm text-foreground">
                {
                  order
                    .deliveryAddress
                    .phone
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-foreground">
            Order Items
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {order.items.length} products in this order
          </p>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px]">
            <thead className="bg-surface-subtle">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Product
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Type
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Quantity
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Unit Price
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {order.items.map(
                (item) => (
                  <tr
                    key={item.id}
                    className="border-t border-border"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-foreground">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.sku}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-surface-subtle px-3 py-1 text-xs font-medium text-primary">
                        {item.type}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {item.quantity}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      AED{" "}
                      {item.unitPrice.toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-semibold">
                      AED{" "}
                      {(
                        item.unitPrice *
                        item.quantity
                      ).toLocaleString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {order.items.map(
            (item) => (
              <article
                key={item.id}
                className="rounded-xl bg-surface-subtle p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary">
                    <Package className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.sku}
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-primary">
                        {item.type}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Quantity
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {item.quantity}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          AED{" "}
                          {(
                            item.unitPrice *
                            item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          )}
        </div>

        <div className="border-t border-border p-5 sm:p-6">
          <div className="ml-auto max-w-[360px] space-y-3">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span className="font-medium">
                AED{" "}
                {order.subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted-foreground">
                Delivery Fee
              </span>

              <span className="font-medium">
                AED{" "}
                {order.deliveryFee.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-t border-border pt-3">
              <span className="font-semibold text-foreground">
                Order Total
              </span>

              <span className="text-lg font-bold text-foreground">
                AED{" "}
                {order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold">
            Customer Notes
          </h2>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {order.customerNotes ||
              "No customer notes."}
          </p>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold">
            Admin Notes
          </h2>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {order.adminNotes ||
              "No admin notes."}
          </p>
        </section>
      </div>

      <CancelOrderDialog
        open={
          cancelDialogOpen
        }
        orderNumber={
          order.orderNumber
        }
        customerName={
          order.customerName
        }
        onClose={() =>
          setCancelDialogOpen(
            false
          )
        }
        onConfirm={
          handleCancelOrder
        }
      />
    </div>
  );
}