import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

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
};

const orders: Order[] = [
  {
    id: "RC-2026-00124",
    date: "31 Aug 2026",
    status: "Confirmed",
    paymentStatus: "Paid",
    total: 2160,
    items: [
      {
        id: "white-chinchilla",
        name: "White Chinchilla",
        image: "/animals/1.png",
        quantity: 1,
      },
      {
        id: "premium-chinchilla-cage",
        name: "Premium Chinchilla Cage",
        image: "/animals/3.png",
        quantity: 1,
      },
      {
        id: "wooden-hideout",
        name: "Wooden Hideout",
        image: "/animals/5.png",
        quantity: 1,
      },
    ],
  },
  {
    id: "RC-2026-00110",
    date: "18 Aug 2026",
    status: "Delivered",
    paymentStatus: "Paid",
    total: 1475,
    items: [
      {
        id: "grey-chinchilla",
        name: "Grey Chinchilla",
        image: "/animals/4.png",
        quantity: 1,
      },
      {
        id: "wooden-hideout",
        name: "Wooden Hideout",
        image: "/animals/5.png",
        quantity: 1,
      },
    ],
  },
  {
    id: "RC-2026-00089",
    date: "02 Aug 2026",
    status: "Processing",
    paymentStatus: "Paid",
    total: 650,
    items: [
      {
        id: "premium-chinchilla-cage",
        name: "Premium Chinchilla Cage",
        image: "/animals/3.png",
        quantity: 1,
      },
    ],
  },
];

export function AccountOrders() {
  return (
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
              View your purchases, payment status and delivery progress.
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
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}
        </div>
      ) : (
        <EmptyOrders />
      )}
    </div>
  );
}

function OrderCard({
  order,
}: {
  order: Order;
}) {
  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

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
              AED {order.total.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />

          <PaymentBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-foreground">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </p>

              <span className="h-1 w-1 rounded-full bg-muted-foreground" />

              <p className="text-xs text-muted-foreground">
                {order.items.length}{" "}
                {order.items.length === 1 ? "Product" : "Products"}
              </p>
            </div>

            <div className="mt-4 flex items-center">
              {order.items.slice(0, 4).map((item, index) => (
                <div
                  key={item.id}
                  className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 border-background bg-surface-subtle sm:h-[72px] sm:w-[72px] ${
                    index > 0 ? "-ml-3" : ""
                  }`}
                  title={item.name}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="72px"
                    className="object-cover"
                  />
                </div>
              ))}

              {order.items.length > 4 && (
                <div className="-ml-3 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-background bg-primary text-xs font-bold text-primary-foreground sm:h-[72px] sm:w-[72px]">
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            <div className="mt-3 space-y-1">
              {order.items.slice(0, 2).map((item) => (
                <p
                  key={item.id}
                  className="truncate text-xs text-muted-foreground"
                >
                  {item.name}
                  {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                </p>
              ))}

              {order.items.length > 2 && (
                <p className="text-xs font-semibold text-primary">
                  + {order.items.length - 2} more
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4 lg:w-[230px] lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div className="flex items-center justify-between md:hidden">
              <span className="text-xs text-muted-foreground">
                Order Total
              </span>

              <span className="text-lg font-bold text-primary">
                AED {order.total.toLocaleString()}
              </span>
            </div>

            <Button
              asChild
              variant="primary"
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold lg:mt-0"
            >
              <Link href={`/account/orders/${order.id}`}>
                View Order
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            {order.status === "Delivered" && (
              <Button
                asChild
                variant="secondary"
                className="mt-2 h-11 w-full rounded-xl text-sm font-bold"
              >
                <Link href={`/account/reviews?order=${order.id}`}>
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
      icon: Clock3,
      className:
        "bg-error/10 text-error",
    },
  }[status];

  const Icon = config.icon;

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
    Paid: "bg-success/10 text-success",
    Pending: "bg-warning/10 text-warning",
    Failed: "bg-error/10 text-error",
    Refunded: "bg-surface-subtle text-muted-foreground",
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
        When you purchase a companion or accessory, your orders will appear
        here.
      </p>

      <Button
        asChild
        variant="primary"
        className="mt-6 h-11 rounded-xl px-6"
      >
        <Link href="/">Start Shopping</Link>
      </Button>
    </div>
  );
}