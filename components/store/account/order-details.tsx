"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  CreditCard,
  Home,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/store/shared/reveal";
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
  slug: string;
  name: string;
  image: string;
  type:
    | "Animal"
    | "Accessory";
  price: number;
  quantity: number;
  shortMeta?: string;
};

type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: OrderItem[];
};

const fallbackOrder: Order = {
  id: "RC-2026-00124",
  date: "31 Aug 2026",
  status: "Confirmed",
  paymentStatus: "Paid",
  paymentMethod:
    "Credit / Debit Card",
  subtotal: 2125,
  deliveryFee: 35,
  total: 2160,
  items: [
    {
      id: "white-chinchilla",
      slug:
        "white-chinchilla",
      name:
        "White Chinchilla",
      image:
        "/animals/1.png",
      type: "Animal",
      price: 1400,
      quantity: 1,
      shortMeta:
        "Male • 8 months",
    },
    {
      id:
        "premium-chinchilla-cage",
      slug:
        "premium-chinchilla-cage",
      name:
        "Premium Chinchilla Cage",
      image:
        "/animals/3.png",
      type:
        "Accessory",
      price: 650,
      quantity: 1,
      shortMeta:
        "Large premium habitat",
    },
    {
      id:
        "wooden-hideout",
      slug:
        "wooden-hideout",
      name:
        "Wooden Hideout",
      image:
        "/animals/5.png",
      type:
        "Accessory",
      price: 75,
      quantity: 1,
      shortMeta:
        "Natural wood shelter",
    },
  ],
};

const fallbackCustomer = {
  name: "Ahmed Daniyal",
  email:
    "ahmed@example.com",
  phone:
    "+971 50 780 1110",
};

const fallbackAddress = {
  label: "Home",
  unit:
    "Apartment 1204",
  building:
    "Marina Residence",
  street:
    "Al Marsa Street",
  area:
    "Dubai Marina",
  emirate: "Dubai",
  notes:
    "Please call before arrival.",
};

const timeline = [
  {
    key: "Pending",
    label:
      "Order Placed",
    description:
      "We received your order.",
  },
  {
    key: "Confirmed",
    label: "Confirmed",
    description:
      "Your order has been confirmed.",
  },
  {
    key: "Processing",
    label:
      "Preparing Order",
    description:
      "Your order is being prepared for delivery.",
  },
  {
    key: "Delivered",
    label: "Delivered",
    description:
      "Your order has been delivered.",
  },
] as const;

export function OrderDetails() {
  const params =
    useParams<{
      orderId: string;
    }>();

  const [
    orderData,
    setOrderData,
  ] =
    useState<Order>(
      fallbackOrder
    );

  const [
    customerData,
    setCustomerData,
  ] =
    useState(
      fallbackCustomer
    );

  const [
    addressData,
    setAddressData,
  ] =
    useState(
      fallbackAddress
    );

  useEffect(() => {
    fetch(
      `/api/store/checkout/orders/${encodeURIComponent(
        params.orderId
      )}`
    )
      .then(
        async (
          response
        ) => ({
          response,
          data:
            await response.json(),
        })
      )
      .then(
        ({
          response,
          data,
        }) => {
          if (
            !response.ok
          ) {
            return;
          }

          setOrderData({
            id:
              data.orderNumber,

            date:
              new Date(
                data.createdAt
              ).toLocaleDateString(
                "en-AE",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              ),

            status:
              data.orderStatus,

            paymentStatus:
              data.paymentStatus,

            paymentMethod:
              data.paymentMethod,

            subtotal:
              Number(
                data.subtotal
              ),

            deliveryFee:
              Number(
                data.deliveryFee
              ),

            total:
              Number(
                data.total
              ),

            items:
              data.items.map(
                (item: {
                  id: string;
                  productName: string;
                  quantity: number;
                  unitPrice:
                    | string
                    | number;
                  product: {
                    slug: string;
                    type:
                      | "Animal"
                      | "Accessory";
                    images: {
                      url: string;
                    }[];
                  } | null;
                }) => ({
                  id:
                    item.id,

                  slug:
                    item.product
                      ?.slug ??
                    "",

                  name:
                    item.productName,

                  image:
                    item.product
                      ?.images[0]
                      ?.url ??
                    "/placeholder.png",

                  type:
                    item.product
                      ?.type ??
                    "Accessory",

                  price:
                    Number(
                      item.unitPrice
                    ),

                  quantity:
                    item.quantity,
                })
              ),
          });

          setCustomerData({
            name:
              data.customerName,
            email:
              data.email,
            phone:
              data.phone,
          });

          if (
            data.shippingAddress
          ) {
            setAddressData({
              label:
                data.shippingAddress
                  .label,

              unit:
                data.shippingAddress
                  .unit ?? "",

              building:
                data.shippingAddress
                  .building,

              street:
                data.shippingAddress
                  .street,

              area:
                data.shippingAddress
                  .area,

              emirate:
                data.shippingAddress
                  .emirate,

              notes:
                data.shippingAddress
                  .notes ?? "",
            });
          }
        }
      )
      .catch(
        () => undefined
      );
  }, [params.orderId]);

  const order =
    orderData;

  const customer =
    customerData;

  const address =
    addressData;

  const statusIndex = {
    Pending: 0,
    Confirmed: 1,
    Processing: 2,
    Delivered: 3,
    Cancelled: -1,
  }[order.status];

  return (
    <div className="mx-auto max-w-[1150px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal
        direction="left"
        distance={25}
      >
        <Link
          href="/account/orders"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />

          <span>
            Back to Orders
          </span>
        </Link>
      </Reveal>

      <Reveal
        direction="up"
        distance={35}
      >
        <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm sm:rounded-3xl">
          <Reveal
            direction="scale"
            scaleFrom={0.97}
          >
            <div className="border-b border-border bg-surface-subtle p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    Order Details
                  </p>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    #{order.id}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />

                      {
                        order.date
                      }
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <ShoppingBag className="h-3.5 w-3.5 text-primary" />

                      {
                        order.items
                          .length
                      }{" "}
                      Products
                    </span>
                  </div>
                </div>

                <RevealGroup
                  stagger={0.06}
                  className="flex flex-wrap gap-2"
                >
                  <RevealItem
                    direction="scale"
                    scaleFrom={
                      0.9
                    }
                  >
                    <OrderStatusBadge
                      status={
                        order.status
                      }
                    />
                  </RevealItem>

                  <RevealItem
                    direction="scale"
                    scaleFrom={
                      0.9
                    }
                  >
                    <PaymentStatusBadge
                      status={
                        order.paymentStatus
                      }
                    />
                  </RevealItem>
                </RevealGroup>
              </div>
            </div>
          </Reveal>

          <div className="p-4 sm:p-6 lg:p-8">
            {order.status ===
            "Cancelled" ? (
              <Reveal
                direction="scale"
                scaleFrom={0.95}
              >
                <CancelledState />
              </Reveal>
            ) : (
              <Reveal
                direction="up"
                distance={30}
              >
                <OrderTimeline
                  statusIndex={
                    statusIndex
                  }
                />
              </Reveal>
            )}

            <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-5">
                <Reveal
                  direction="left"
                  distance={35}
                >
                  <section className="rounded-2xl border border-border bg-background p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-base font-bold text-foreground sm:text-lg">
                          Order Items
                        </h2>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Products
                          included in
                          this order
                        </p>
                      </div>

                      <PackageCheck className="h-5 w-5 text-primary" />
                    </div>

                    <RevealGroup
                      stagger={0.06}
                      className="mt-4 divide-y divide-border"
                    >
                      {order.items.map(
                        (
                          item
                        ) => (
                          <RevealItem
                            key={
                              item.id
                            }
                            direction="up"
                            distance={
                              18
                            }
                          >
                            <OrderItemRow
                              item={
                                item
                              }
                              delivered={
                                order.status ===
                                "Delivered"
                              }
                              orderId={
                                order.id
                              }
                            />
                          </RevealItem>
                        )
                      )}
                    </RevealGroup>
                  </section>
                </Reveal>

                <Reveal
                  direction="left"
                  distance={35}
                  delay={0.05}
                >
                  <section className="rounded-2xl border border-border bg-background p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />

                      <h2 className="text-base font-bold text-foreground sm:text-lg">
                        Delivery
                        Information
                      </h2>
                    </div>

                    <Reveal
                      direction="scale"
                      scaleFrom={0.96}
                    >
                      <div className="mt-4 rounded-2xl bg-surface-subtle p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <Home className="h-4 w-4" />
                          </span>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-bold text-foreground">
                                {
                                  address.label
                                }
                              </p>

                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                Delivery
                                Address
                              </span>
                            </div>

                            <p className="mt-2 text-sm font-semibold text-foreground">
                              {
                                customer.name
                              }
                            </p>

                            <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />

                              <p>
                                {
                                  address.unit
                                }
                                ,{" "}
                                {
                                  address.building
                                }
                                <br />

                                {
                                  address.street
                                }
                                ,{" "}
                                {
                                  address.area
                                }
                                <br />

                                {
                                  address.emirate
                                }
                                , UAE
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Reveal>

                    {address.notes && (
                      <Reveal
                        direction="up"
                        distance={15}
                      >
                        <div className="mt-3 rounded-xl border border-border px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            Delivery
                            Note
                          </p>

                          <p className="mt-1 text-sm text-foreground">
                            {
                              address.notes
                            }
                          </p>
                        </div>
                      </Reveal>
                    )}

                    <RevealGroup
                      stagger={0.07}
                      className="mt-4 grid gap-3 sm:grid-cols-2"
                    >
                      <RevealItem
                        direction="scale"
                        scaleFrom={
                          0.94
                        }
                      >
                        <ContactRow
                          icon={
                            Phone
                          }
                          label="Mobile"
                          value={
                            customer.phone
                          }
                        />
                      </RevealItem>

                      <RevealItem
                        direction="scale"
                        scaleFrom={
                          0.94
                        }
                      >
                        <ContactRow
                          icon={
                            Mail
                          }
                          label="Email"
                          value={
                            customer.email
                          }
                        />
                      </RevealItem>
                    </RevealGroup>
                  </section>
                </Reveal>
              </div>

              <aside className="space-y-5">
                <Reveal
                  direction="right"
                  distance={35}
                >
                  <section className="rounded-2xl border border-border bg-background p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <ReceiptText className="h-5 w-5 text-primary" />

                      <h2 className="text-base font-bold text-foreground">
                        Order
                        Summary
                      </h2>
                    </div>

                    <div className="mt-5 space-y-3">
                      <SummaryRow
                        label="Subtotal"
                        value={`AED ${order.subtotal.toLocaleString()}`}
                      />

                      <SummaryRow
                        label="Delivery"
                        value={`AED ${order.deliveryFee.toLocaleString()}`}
                      />
                    </div>

                    <div className="my-4 border-t border-border" />

                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          Order
                          Total
                        </p>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Including
                          delivery
                        </p>
                      </div>

                      <p className="text-xl font-bold text-primary">
                        AED{" "}
                        {order.total.toLocaleString()}
                      </p>
                    </div>
                  </section>
                </Reveal>

                <Reveal
                  direction="right"
                  distance={35}
                  delay={0.05}
                >
                  <section className="rounded-2xl border border-border bg-background p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />

                      <h2 className="text-base font-bold text-foreground">
                        Payment
                        Details
                      </h2>
                    </div>

                    <div className="mt-4 space-y-3">
                      <InfoRow
                        label="Payment Status"
                        value={
                          order.paymentStatus
                        }
                      />

                      <InfoRow
                        label="Payment Method"
                        value={
                          order.paymentMethod
                        }
                      />

                      <InfoRow
                        label="Amount"
                        value={`AED ${order.total.toLocaleString()}`}
                      />
                    </div>
                  </section>
                </Reveal>

                {order.status ===
                  "Delivered" && (
                  <Reveal
                    direction="scale"
                    scaleFrom={0.94}
                  >
                    <section className="rounded-2xl border border-primary/15 bg-primary/5 p-4 sm:p-5">
                      <CheckCircle2 className="h-6 w-6 text-primary" />

                      <h3 className="mt-3 text-base font-bold text-foreground">
                        How was your
                        order?
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Share your
                        experience
                        and help other
                        customers.
                      </p>

                      <Button
                        asChild
                        variant="primary"
                        className="mt-4 h-11 w-full rounded-xl text-sm font-bold"
                      >
                        <Link
                          href={`/account/reviews?order=${order.id}`}
                          className="whitespace-nowrap"
                        >
                          <span className="inline-flex items-center justify-center whitespace-nowrap">
                            Write a Review
                          </span>
                        </Link>
                      </Button>
                    </section>
                  </Reveal>
                )}
              </aside>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

function OrderTimeline({
  statusIndex,
}: {
  statusIndex: number;
}) {
  return (
    <section className="rounded-2xl border border-border bg-background p-4 sm:p-5">
      <h2 className="text-base font-bold text-foreground sm:text-lg">
        Order Progress
      </h2>

      <p className="mt-1 text-xs text-muted-foreground">
        Follow the current
        status of your order.
      </p>

      <div className="mt-6">
        <RevealGroup
          stagger={0.07}
          className="hidden sm:grid sm:grid-cols-4"
        >
          {timeline.map(
            (
              step,
              index
            ) => {
              const completed =
                index <=
                statusIndex;

              const active =
                index ===
                statusIndex;

              return (
                <RevealItem
                  key={
                    step.key
                  }
                  direction="scale"
                  scaleFrom={
                    0.9
                  }
                >
                  <div className="relative text-center">
                    {index <
                      timeline.length -
                        1 && (
                      <div className="absolute left-1/2 top-5 h-0.5 w-full bg-border">
                        <div
                          className={`h-full ${
                            index <
                            statusIndex
                              ? "w-full bg-primary"
                              : "w-0"
                          }`}
                        />
                      </div>
                    )}

                    <div
                      className={`relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        completed
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      {completed ? (
                        <Check
                          className="h-4 w-4"
                          strokeWidth={
                            3
                          }
                        />
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                    </div>

                    <p
                      className={`mt-3 text-xs font-bold ${
                        active
                          ? "text-primary"
                          : completed
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {
                        step.label
                      }
                    </p>

                    <p className="mx-auto mt-1 max-w-[150px] text-[10px] leading-4 text-muted-foreground">
                      {
                        step.description
                      }
                    </p>
                  </div>
                </RevealItem>
              );
            }
          )}
        </RevealGroup>

        <RevealGroup
          stagger={0.07}
          className="space-y-0 sm:hidden"
        >
          {timeline.map(
            (
              step,
              index
            ) => {
              const completed =
                index <=
                statusIndex;

              const active =
                index ===
                statusIndex;

              return (
                <RevealItem
                  key={
                    step.key
                  }
                  direction="up"
                  distance={
                    16
                  }
                >
                  <div className="relative flex gap-3 pb-6 last:pb-0">
                    {index <
                      timeline.length -
                        1 && (
                      <div
                        className={`absolute left-[17px] top-9 h-[calc(100%-20px)] w-0.5 ${
                          index <
                          statusIndex
                            ? "bg-primary"
                            : "bg-border"
                        }`}
                      />
                    )}

                    <span
                      className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                        completed
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      {completed ? (
                        <Check
                          className="h-4 w-4"
                          strokeWidth={
                            3
                          }
                        />
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                    </span>

                    <div className="pt-0.5">
                      <p
                        className={`text-sm font-bold ${
                          active
                            ? "text-primary"
                            : completed
                              ? "text-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {
                          step.label
                        }
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {
                          step.description
                        }
                      </p>
                    </div>
                  </div>
                </RevealItem>
              );
            }
          )}
        </RevealGroup>
      </div>
    </section>
  );
}

function OrderItemRow({
  item,
  delivered,
  orderId,
}: {
  item: OrderItem;
  delivered: boolean;
  orderId: string;
}) {
  return (
    <div className="flex gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4">
      <Link
        href={`/products/${item.slug}`}
        className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-surface-subtle sm:h-[90px] sm:w-[90px]"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          unoptimized
          sizes="90px"
          className="object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold text-primary">
              {item.type}
            </span>

            <Link
              href={`/products/${item.slug}`}
            >
              <h3 className="mt-2 line-clamp-1 text-sm font-bold text-foreground transition-colors hover:text-primary">
                {item.name}
              </h3>
            </Link>

            {item.shortMeta && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                {
                  item.shortMeta
                }
              </p>
            )}
          </div>

          <p className="shrink-0 text-sm font-bold text-foreground">
            AED{" "}
            {(
              item.price *
              item.quantity
            ).toLocaleString()}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Quantity:{" "}
            <span className="font-bold text-foreground">
              {
                item.quantity
              }
            </span>
          </p>

          {delivered && (
            <Link
              href={`/account/reviews?order=${orderId}&product=${item.slug}`}
              className="text-xs font-bold text-primary hover:underline"
            >
              Review Item
            </Link>
          )}
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
    Pending:
      "bg-warning/10 text-warning",
    Confirmed:
      "bg-primary/10 text-primary",
    Processing:
      "bg-primary/10 text-primary",
    Delivered:
      "bg-success/10 text-success",
    Cancelled:
      "bg-error/10 text-error",
  }[status];

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${config}`}
    >
      {status}
    </span>
  );
}

function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const config = {
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
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${config}`}
    >
      Payment: {status}
    </span>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon:
    React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-subtle p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-bold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="text-sm font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-muted-foreground">
        {label}
      </span>

      <span className="max-w-[170px] text-right text-xs font-bold text-foreground">
        {value}
      </span>
    </div>
  );
}

function CancelledState() {
  return (
    <section className="rounded-2xl border border-error/20 bg-error/5 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
          <XCircle className="h-5 w-5" />
        </span>

        <div>
          <h2 className="text-sm font-bold text-foreground">
            Order Cancelled
          </h2>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            This order was
            cancelled and will
            no longer proceed to
            delivery.
          </p>
        </div>
      </div>
    </section>
  );
}