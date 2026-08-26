import Link from "next/link";

import {
  Boxes,
  ClipboardList,
  Package,
  PawPrint,
  RotateCcw,
  Star,
  Tags,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";

const stats = [
  {
    title: "Orders Today",
    value: "18",
    meta: "↑ 12.5% vs yesterday",
    tone: "success",
    icon: ClipboardList,
    href: "/admin/orders",
  },
  {
    title: "Low Stock",
    value: "6",
    meta: "Needs attention",
    tone: "warning",
    icon: Boxes,
    href: "/admin/inventory",
  },
  {
    title: "Pending Refunds",
    value: "3",
    meta: "Awaiting review",
    tone: "warning",
    icon: RotateCcw,
    href: "/admin/refunds",
  },
  {
    title: "Pending Reviews",
    value: "5",
    meta: "Awaiting moderation",
    tone: "warning",
    icon: Star,
    href: "/admin/reviews",
  },
];

const highlights = [
  {
    label: "Top Selling Animal",
    value: "White Chinchilla",
    meta: "12 Sold",
    icon: PawPrint,
  },
  {
    label: "Top Selling Accessory",
    value: "Premium Cage",
    meta: "9 Sold",
    icon: Package,
  },
  {
    label: "Top Accessory Category",
    value: "Housing & Cages",
    meta: "11 Orders",
    icon: Tags,
  },
];

const lowStockItems = [
  {
    id: 1,
    name: "White Chinchilla",
    type: "Animal",
    quantity: 2,
  },
  {
    id: 2,
    name: "Guinea Pig",
    type: "Animal",
    quantity: 1,
  },
  {
    id: 3,
    name: "Premium Cage",
    type: "Accessory",
    quantity: 2,
  },
  {
    id: 4,
    name: "Micro Squirrel",
    type: "Animal",
    quantity: 2,
  },
];

const recentOrders = [
  {
    id: 1028,
    orderNumber: "RC-1028",
    customer: "Ahmed Khan",
    item: "White Chinchilla × 2",
    total: "AED 2,800",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: 1027,
    orderNumber: "RC-1027",
    customer: "Sara Ali",
    item: "Guinea Pig × 1",
    total: "AED 650",
    payment: "Paid",
    status: "Processing",
  },
  {
    id: 1026,
    orderNumber: "RC-1026",
    customer: "Omar Hassan",
    item: "Micro Squirrel × 1",
    total: "AED 1,200",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: 1025,
    orderNumber: "RC-1025",
    customer: "Mariam Noor",
    item: "Premium Cage × 1",
    total: "AED 420",
    payment: "Paid",
    status: "Confirmed",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-7">
      <div className="lg:hidden">
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your Royal Chins store.
        </p>
      </div>

      <div className="hidden lg:block">
        <AdminPageHeader
          title="Dashboard"
          description="Overview of your Royal Chins store."
        />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h2 className="text-lg font-semibold text-primary">
            Today&apos;s Overview
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md sm:p-5"
              >
                <div className="flex items-start gap-3 lg:justify-between">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary transition-colors group-hover:bg-primary/10 lg:order-2 lg:h-12 lg:w-12">
                    <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                  </div>

                  <div className="min-w-0 lg:order-1">
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {item.title}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>

                <p
                  className={`mt-3 text-xs font-medium ${
                    item.tone === "success"
                      ? "text-success"
                      : "text-warning"
                  }`}
                >
                  {item.meta}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-primary lg:text-foreground">
            Sales Highlights
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Best-performing products and categories.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>

                    <p className="mt-1 truncate text-base font-bold text-foreground">
                      {item.value}
                    </p>

                    <span className="mt-3 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {item.meta}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Low Stock Products
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Products that have reached the configured low stock threshold.
            </p>
          </div>

          <Link
            href="/admin/inventory"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
          {lowStockItems.map((item) => (
            <Link
              key={item.id}
              href="/admin/inventory"
              className="rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.name}
                  </p>

                  <span className="mt-2 inline-flex rounded-full bg-surface-subtle px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {item.type}
                  </span>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--error-background)] text-error">
                  <Boxes className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">
                  Available Stock
                </span>

                <span className="text-sm font-bold text-error">
                  {item.quantity} left
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-lg font-semibold text-primary lg:text-foreground">
              Recent Orders
            </h2>

            <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
              Latest customer orders placed on Royal Chins.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="divide-y divide-border lg:hidden">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block p-4 transition-colors hover:bg-surface-subtle/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-primary">
                    #{order.orderNumber}
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {order.customer}
                  </p>
                </div>

                <StatusBadge
                  status={order.status}
                />
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {order.item}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-surface-subtle p-3">
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Total
                  </p>

                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {order.total}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] text-muted-foreground">
                    Payment
                  </p>

                  <span className="mt-1 inline-flex rounded-full bg-[var(--success-background)] px-2 py-0.5 text-xs font-medium text-success">
                    {order.payment}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[900px]">
            <thead className="bg-surface-subtle">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Order
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Customer
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Item
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Total
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
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-border"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      #{order.orderNumber}
                    </Link>
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-foreground">
                    {order.customer}
                  </td>

                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {order.item}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-foreground">
                    {order.total}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[var(--success-background)] px-3 py-1 text-xs font-medium text-success">
                      {order.payment}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      status={order.status}
                    />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  let className =
    "bg-surface-subtle text-muted-foreground";

  if (
    status === "Delivered"
  ) {
    className =
      "bg-[var(--success-background)] text-success";
  }

  if (
    status === "Processing"
  ) {
    className =
      "bg-primary/10 text-primary";
  }

  if (
    status === "Confirmed"
  ) {
    className =
      "bg-[var(--warning-background)] text-warning";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      {status}
    </span>
  );
}