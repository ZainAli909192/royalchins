import Link from "next/link";
import { Boxes, ClipboardList, Package, PawPrint, RotateCcw, Star, Tags } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type SalesProduct = { name: string; type: "Animal" | "Accessory"; category: string; quantity: number };

function topSeller(products: SalesProduct[], type: SalesProduct["type"]) {
  return products.filter((product) => product.type === type).sort((left, right) => right.quantity - left.quantity)[0];
}

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersToday, accessories, pendingRefunds, pendingReviews, paidOrders, recentOrders] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.product.findMany({ where: { type: "Accessory" }, select: { id: true, name: true, quantity: true, lowStockThreshold: true } }),
    prisma.refund.count({ where: { status: "Requested" } }),
    prisma.review.count({ where: { status: "Pending" } }),
    prisma.order.findMany({ where: { paymentStatus: "Paid", orderStatus: { not: "Cancelled" } }, select: { items: { select: { quantity: true, product: { select: { name: true, type: true, category: { select: { name: true } } } } } } } }),
    prisma.order.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { items: { select: { productName: true, quantity: true } }, payment: { select: { status: true } } } }),
  ]);

  const lowStockItems = accessories.filter((product) => product.quantity <= product.lowStockThreshold).sort((left, right) => left.quantity - right.quantity).slice(0, 4);
  const salesByProduct = new Map<string, SalesProduct>();
  const salesByCategory = new Map<string, number>();

  for (const order of paidOrders) for (const item of order.items) {
    if (!item.product) continue;
    const existing = salesByProduct.get(item.product.name);
    salesByProduct.set(item.product.name, { name: item.product.name, type: item.product.type, category: item.product.category.name, quantity: (existing?.quantity ?? 0) + item.quantity });
    if (item.product.type === "Accessory") salesByCategory.set(item.product.category.name, (salesByCategory.get(item.product.category.name) ?? 0) + item.quantity);
  }

  const soldProducts = [...salesByProduct.values()];
  const topPet = topSeller(soldProducts, "Animal");
  const topAccessory = topSeller(soldProducts, "Accessory");
  const topCategory = [...salesByCategory.entries()].sort((left, right) => right[1] - left[1])[0];
  const stats = [
    { title: "Orders Today", value: ordersToday, meta: "Orders placed since midnight", tone: "success", icon: ClipboardList, href: "/admin/orders" },
    { title: "Low Stock", value: lowStockItems.length, meta: "Accessories needing attention", tone: "warning", icon: Boxes, href: "/admin/inventory" },
    { title: "Pending Refunds", value: pendingRefunds, meta: "Awaiting review", tone: "warning", icon: RotateCcw, href: "/admin/refunds" },
    { title: "Pending Reviews", value: pendingReviews, meta: "Awaiting moderation", tone: "warning", icon: Star, href: "/admin/reviews" },
  ];
  const highlights = [
    { label: "Top Selling Pet", value: topPet?.name ?? "No sales yet", meta: topPet ? `${topPet.quantity} sold` : "Awaiting first sale", icon: PawPrint },
    { label: "Top Selling Accessory", value: topAccessory?.name ?? "No sales yet", meta: topAccessory ? `${topAccessory.quantity} sold` : "Awaiting first sale", icon: Package },
    { label: "Top Accessory Category", value: topCategory?.[0] ?? "No sales yet", meta: topCategory ? `${topCategory[1]} items ordered` : "Awaiting first sale", icon: Tags },
  ];

  return <div className="space-y-7">
    <div className="lg:hidden"><h1 className="text-[28px] font-bold tracking-tight text-foreground">Dashboard</h1><p className="mt-1 text-sm text-muted-foreground">Overview of your Royal Chins store.</p></div>
    <div className="hidden lg:block"><AdminPageHeader title="Dashboard" description="Overview of your Royal Chins store." /></div>

    <section><div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">{stats.map((item) => { const Icon = item.icon; return <Link key={item.title} href={item.href} className="group rounded-2xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md sm:p-5"><div className="flex items-start gap-3 lg:justify-between"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary lg:order-2 lg:h-12 lg:w-12"><Icon className="h-5 w-5 lg:h-6 lg:w-6" /></div><div className="min-w-0 lg:order-1"><p className="text-xs text-muted-foreground sm:text-sm">{item.title}</p><p className="mt-1 text-2xl font-bold text-foreground">{item.value}</p></div></div><p className={`mt-3 text-xs font-medium ${item.tone === "success" ? "text-success" : "text-warning"}`}>{item.meta}</p></Link>; })}</div></section>

    <section><div className="mb-4"><h2 className="text-lg font-semibold text-primary lg:text-foreground">Sales Highlights</h2><p className="mt-1 text-sm text-muted-foreground">Best-performing products and categories.</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{highlights.map((item) => { const Icon = item.icon; return <div key={item.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></div><div className="min-w-0"><p className="text-sm font-medium text-muted-foreground">{item.label}</p><p className="mt-1 truncate text-base font-bold text-foreground">{item.value}</p><span className="mt-3 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{item.meta}</span></div></div></div>; })}</div></section>

    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"><SectionHeader title="Low Stock Accessories" detail="Accessories that have reached their configured low-stock threshold." href="/admin/inventory" />{lowStockItems.length ? <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">{lowStockItems.map((item) => <Link key={item.id} href="/admin/inventory" className="rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-foreground">{item.name}</p><span className="mt-2 inline-flex rounded-full bg-surface-subtle px-2.5 py-1 text-[11px] font-medium text-muted-foreground">Accessory</span></div><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--error-background)] text-error"><Boxes className="h-5 w-5" /></div></div><div className="mt-4 flex items-center justify-between border-t border-border pt-3"><span className="text-xs text-muted-foreground">Available Stock</span><span className="text-sm font-bold text-error">{item.quantity} left</span></div></Link>)}</div> : <EmptyState text="All accessories are currently above their low-stock threshold." />}</section>

    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"><SectionHeader title="Recent Orders" detail="Latest customer orders placed on Royal Chins." href="/admin/orders" />{recentOrders.length ? <><div className="hidden overflow-x-auto lg:block"><table className="w-full min-w-[900px]"><thead className="bg-surface-subtle"><tr>{["Order", "Customer", "Item", "Total", "Payment", "Status", "Action"].map((heading) => <th key={heading} className={`px-5 py-3 text-xs font-semibold text-muted-foreground ${heading === "Action" ? "text-right" : "text-left"}`}>{heading}</th>)}</tr></thead><tbody>{recentOrders.map((order) => <tr key={order.id} className="border-t border-border"><td className="px-5 py-4"><Link href={`/admin/orders/${order.id}`} className="text-sm font-semibold text-primary hover:underline">#{order.orderNumber}</Link></td><td className="px-5 py-4 text-sm font-medium text-foreground">{order.customerName}</td><td className="px-5 py-4 text-sm text-muted-foreground">{order.items.map((item) => `${item.productName} × ${item.quantity}`).join(", ")}</td><td className="px-5 py-4 text-sm font-semibold text-foreground">AED {Number(order.total).toLocaleString()}</td><td className="px-5 py-4"><StatusBadge status={order.payment?.status ?? order.paymentStatus} /></td><td className="px-5 py-4"><StatusBadge status={order.orderStatus} /></td><td className="px-5 py-4 text-right"><Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-primary hover:underline">View</Link></td></tr>)}</tbody></table></div><div className="divide-y divide-border lg:hidden">{recentOrders.map((order) => <Link key={order.id} href={`/admin/orders/${order.id}`} className="block p-4 transition-colors hover:bg-surface-subtle/50"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-primary">#{order.orderNumber}</p><p className="mt-1 text-sm font-medium text-foreground">{order.customerName}</p></div><StatusBadge status={order.orderStatus} /></div><p className="mt-3 text-sm text-muted-foreground">{order.items.map((item) => `${item.productName} × ${item.quantity}`).join(", ")}</p><p className="mt-3 text-sm font-semibold text-foreground">AED {Number(order.total).toLocaleString()}</p></Link>)}</div></> : <EmptyState text="Orders will appear here as customers complete checkout." />}</section>
  </div>;
}

function SectionHeader({ title, detail, href }: { title: string; detail: string; href: string }) { return <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5"><div><h2 className="text-lg font-semibold text-foreground">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{detail}</p></div><Link href={href} className="shrink-0 text-sm font-medium text-primary hover:underline">View All</Link></div>; }
function EmptyState({ text }: { text: string }) { return <div className="p-8 text-center text-sm text-muted-foreground">{text}</div>; }
function StatusBadge({ status }: { status: string }) { const className = status === "Paid" || status === "Delivered" ? "bg-[var(--success-background)] text-success" : status === "Processing" ? "bg-primary/10 text-primary" : status === "Confirmed" || status === "Pending" ? "bg-[var(--warning-background)] text-warning" : "bg-surface-subtle text-muted-foreground"; return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${className}`}>{status}</span>; }
