"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, ExternalLink, ReceiptText, ShieldCheck } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { getPayment } from "@/lib/api/payments";

type PaymentData = {
  id: string; provider: string; providerPaymentId: string | null; amount: string | number; currency: string;
  status: "Pending" | "Paid" | "Failed" | "Refunded"; cardBrand: string | null; cardLast4: string | null;
  receiptUrl: string | null; failureMessage: string | null; createdAt: string; paidAt: string | null;
  order: { id: string; orderNumber: string; orderStatus: string; customerName: string; email: string; customerId: string | null; customer: { id: string; name: string; email: string } | null };
};

export default function PaymentDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    getPayment(params.id).then((data) => setPayment(data as PaymentData)).catch((caught: unknown) => setError(caught instanceof Error ? caught.message : "Unable to load payment."));
  }, [params.id]);

  if (error) return <Message title="Payment unavailable" text={error} onBack={() => router.push("/admin/payments")} />;
  if (!payment) return <div className="p-6 text-sm text-muted-foreground">Loading payment…</div>;
  const amount = `AED ${Number(payment.amount).toLocaleString("en-AE", { minimumFractionDigits: 2 })}`;
  const customer = payment.order.customer;

  return <div className="space-y-6">
    <AdminPageHeader title={`Payment PAY-${payment.id.slice(-6).toUpperCase()}`} description={`${payment.provider} transaction ${payment.providerPaymentId ?? "pending"}`} action={<Button variant="outline" onClick={() => router.push("/admin/payments")}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>} />
    <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-subtle text-primary"><CreditCard className="h-6 w-6" /></span><div><p className="text-sm text-muted-foreground">{payment.provider} payment</p><h2 className="mt-1 text-2xl font-bold">{amount}</h2><p className="mt-1 text-sm text-muted-foreground">Created {new Date(payment.createdAt).toLocaleString("en-AE")}</p></div></div><Status status={payment.status} /></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Info label="Order" value={`#${payment.order.orderNumber}`} /><Info label="Payment method" value={payment.cardBrand && payment.cardLast4 ? `${payment.cardBrand} •••• ${payment.cardLast4}` : "Card details unavailable"} /><Info label="Paid at" value={payment.paidAt ? new Date(payment.paidAt).toLocaleString("en-AE") : "Awaiting payment"} /><Info label="Currency" value={payment.currency.toUpperCase()} /></div>
    </section>
    <div className="grid gap-6 lg:grid-cols-2"><section className="rounded-xl border border-border bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Transaction details</h2><div className="mt-4 divide-y divide-border"><Row label="Provider" value={payment.provider} /><Row label="Payment ID" value={payment.providerPaymentId ?? "Not created"} /><Row label="Status" value={payment.status} /><Row label="Failure reason" value={payment.failureMessage ?? "—"} /></div>{payment.receiptUrl && <a className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline" href={payment.receiptUrl} target="_blank" rel="noreferrer">Open Stripe receipt <ExternalLink className="h-4 w-4" /></a>}</section>
    <section className="rounded-xl border border-border bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Customer and order</h2><div className="mt-4 space-y-4"><button onClick={() => router.push(`/admin/orders/${payment.order.id}`)} className="w-full rounded-xl bg-surface-subtle p-4 text-left"><p className="text-xs text-muted-foreground">Order</p><p className="mt-1 font-semibold">#{payment.order.orderNumber}</p></button><button disabled={!customer} onClick={() => customer && router.push(`/admin/customers/${customer.id}`)} className="w-full rounded-xl bg-surface-subtle p-4 text-left disabled:cursor-default"><p className="text-xs text-muted-foreground">Customer</p><p className="mt-1 font-semibold">{customer?.name ?? payment.order.customerName}</p><p className="mt-1 text-sm text-muted-foreground">{customer?.email ?? payment.order.email}</p></button></div></section></div>
    <section className="rounded-xl border border-primary/15 bg-primary/5 p-5"><div className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" /><div><h2 className="font-semibold">Card data is protected</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">This screen stores and displays only the Stripe card brand and last four digits. Full card numbers, expiry dates, and CVV values are never sent to or stored by Royal Chins.</p></div></div></section>
  </div>;
}

function Status({ status }: { status: PaymentData["status"] }) { const colors = { Paid: "bg-[var(--success-background)] text-success", Pending: "bg-[var(--warning-background)] text-warning", Failed: "bg-[var(--error-background)] text-error", Refunded: "bg-surface-subtle text-primary" }; return <span className={`rounded-full px-3 py-1 text-sm font-semibold ${colors[status]}`}>{status}</span>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-surface-subtle p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 break-all font-semibold">{value}</p></div>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between"><span className="text-sm text-muted-foreground">{label}</span><span className="break-all text-sm font-medium sm:text-right">{value}</span></div>; }
function Message({ title, text, onBack }: { title: string; text: string; onBack: () => void }) { return <div className="rounded-xl border border-border bg-white p-6 shadow-sm"><ReceiptText className="h-6 w-6 text-primary" /><h1 className="mt-3 text-xl font-bold">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{text}</p><Button variant="outline" onClick={onBack} className="mt-5"><ArrowLeft className="mr-2 h-4 w-4" />Back to Payments</Button></div>; }
