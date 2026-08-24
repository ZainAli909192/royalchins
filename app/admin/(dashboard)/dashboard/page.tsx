import Link from "next/link";
import {
  Boxes,
  ClipboardList,
  Package,
  PawPrint,
  ShoppingBag,
  Tags,
  Users,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";

const stats = [
  {
    title: "Orders Today",
    value: "18",
    change: "↑ 12.5%",
    comparison: "vs yesterday",
    icon: ClipboardList,
  },
  {
    title: "New Customers Today",
    value: "7",
    change: "↑ 16.7%",
    comparison: "vs yesterday",
    icon: Users,
  },
  {
    title: "Total Animals",
    value: "156",
    change: "↑ 4",
    comparison: "this week",
    icon: PawPrint,
  },
  {
    title: "Low Stock",
    value: "6",
    change: "Needs attention",
    comparison: "",
    icon: Boxes,
  },
];

const lowStockItems = [
  {
    name: "White Chinchilla",
    quantity: 2,
  },
  {
    name: "Guinea Pig",
    quantity: 1,
  },
  {
    name: "Micro Squirrel",
    quantity: 2,
  },
];

const recentOrders = [
  {
    id: "#RC-1028",
    customer: "Ahmed Khan",
    item: "Chinchilla × 2",
    total: "AED 2,800",
    status: "Delivered",
  },
  {
    id: "#RC-1027",
    customer: "Sara Ali",
    item: "Guinea Pig × 1",
    total: "AED 650",
    status: "Processing",
  },
  {
    id: "#RC-1026",
    customer: "Omar Hassan",
    item: "Micro Squirrel × 1",
    total: "AED 1,200",
    status: "Delivered",
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
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-start gap-3 lg:justify-between">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary lg:order-2 lg:h-12 lg:w-12">
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

                <div className="mt-3 text-xs">
                  <span
                    className={
                      item.title === "Low Stock"
                        ? "font-medium text-warning"
                        : "font-medium text-success"
                    }
                  >
                    {item.change}
                  </span>

                  {item.comparison && (
                    <span className="ml-1 text-muted-foreground">
                      {item.comparison}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-primary lg:text-foreground">
          Highlights
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-primary/10 bg-surface-subtle p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-primary">
                <PawPrint className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm font-semibold text-primary">
                  Top Selling Animal
                </p>

                <p className="mt-1 font-semibold text-foreground">
                  White Chinchilla
                </p>

                <span className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">
                  12 Sold
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-primary">
                <Tags className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm font-semibold text-primary">
                  Top Animal Category
                </p>

                <p className="mt-1 font-semibold text-foreground">
                  Chinchillas
                </p>

                <span className="mt-2 inline-block rounded-full bg-surface-subtle px-3 py-1 text-xs font-semibold text-primary">
                  14 Orders
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-surface-subtle p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-primary">
                <ShoppingBag className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm font-semibold text-primary">
                  Top Selling Accessory
                </p>

                <p className="mt-1 font-semibold text-foreground">
                  Premium Cage
                </p>

                <span className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">
                  9 Sold
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-primary">
                <Package className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm font-semibold text-primary">
                  Top Accessory Category
                </p>

                <p className="mt-1 font-semibold text-foreground">
                  Housing & Cages
                </p>

                <span className="mt-2 inline-block rounded-full bg-surface-subtle px-3 py-1 text-xs font-semibold text-primary">
                  11 Orders
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Low Stock Items
            </h2>
          </div>

          <Link
            href="/admin/inventory"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {lowStockItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-xl bg-surface-subtle px-4 py-3"
            >
              <span className="text-sm font-medium text-foreground">
                {item.name}
              </span>

              <span className="text-xs font-semibold text-error">
                {item.quantity} left
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5">
          <h2 className="text-lg font-semibold text-primary lg:text-foreground">
            Recent Orders
          </h2>

          <Link
            href="/admin/orders"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="divide-y divide-border lg:hidden">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id.replace("#", "")}`}
              className="grid grid-cols-[90px_1fr_auto] gap-3 px-4 py-4"
            >
              <span className="text-sm font-semibold text-primary">
                {order.id}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {order.customer}
                </p>

                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {order.item} · {order.total}
                </p>
              </div>

              <span className="h-fit rounded-full bg-surface-subtle px-2.5 py-1 text-[11px] font-medium text-primary">
                {order.status}
              </span>
            </Link>
          ))}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[760px]">
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
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-border"
                >
                  <td className="px-5 py-4 text-sm font-medium text-primary">
                    {order.id}
                  </td>

                  <td className="px-5 py-4 text-sm text-foreground">
                    {order.customer}
                  </td>

                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {order.item}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-foreground">
                    {order.total}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-surface-subtle px-3 py-1 text-xs font-medium text-primary">
                      {order.status}
                    </span>
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