"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageLoader } from "@/components/admin/shared/admin-page-loader";
import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getRefund, updateRefundStatus } from "@/lib/api/refunds";

type Refund = { id: string; amount: string | number; status: "Requested" | "Approved" | "Completed" | "Failed" | "Declined"; reason: string; customerNote: string; adminNote: string; declineReason: string | null; gatewayRefundId: string | null; requestedAt: string; order: { id: string; orderNumber: string; total: string | number; customerName: string; email: string; payment: { provider: string; method: string } | null } };

export default function RefundDetailPage() {
  const params = useParams<{ id: string }>(); const router = useRouter();
  const [refund, setRefund] = useState<Refund | null>(null); const [amount, setAmount] = useState(0); const [note, setNote] = useState(""); const [declineReason, setDeclineReason] = useState(""); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  const load = async () => { try { const data = await getRefund(params.id) as Refund; setRefund(data); setAmount(Number(data.amount)); setNote(data.adminNote ?? ""); setDeclineReason(data.declineReason ?? ""); } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to load refund."); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, [params.id]);
  const update = async (status: "Approved" | "Declined") => { if (!refund || saving) return; setSaving(true); setError(""); setMessage(""); try { const result = await updateRefundStatus(refund.id, { status, amount, adminNote: note, declineReason }) as Refund; setRefund(result); setMessage(status === "Approved" ? (result.status === "Completed" ? "Stripe refund completed." : "Refund approved and sent to Stripe.") : "Refund request declined."); } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to update refund."); } finally { setSaving(false); } };
  if (loading) return <AdminPageLoader label="Loading refund request" />;
  if (!refund) return <div className="space-y-5"><AdminPageHeader title="Refund" description="Refund request unavailable." /><FormAlert variant="error" message={error || "Refund not found."} /></div>;
  const canAct = refund.status === "Requested"; const maximum = Number(refund.order.total);
  return <div className="space-y-6"><AdminPageHeader title={`Refund RF-${refund.id.slice(-6).toUpperCase()}`} description={`Order ${refund.order.orderNumber} · ${refund.status}`} action={<Button variant="outline" onClick={() => router.push("/admin/refunds")}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>} />
    {message && <FormAlert variant="success" message={message} onClose={() => setMessage("")} />}{error && <FormAlert variant="error" message={error} onClose={() => setError("")} />}
    <div className="grid gap-6 lg:grid-cols-2"><section className="rounded-xl border border-border bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Customer request</h2><dl className="mt-5 space-y-4 text-sm"><Row label="Order" value={`#${refund.order.orderNumber}`} /><Row label="Customer" value={`${refund.order.customerName} · ${refund.order.email}`} /><Row label="Reason" value={refund.reason} /><Row label="Customer note" value={refund.customerNote || "—"} /><Row label="Payment" value={refund.order.payment ? `${refund.order.payment.provider} · ${refund.order.payment.method}` : "Payment unavailable"} /><Row label="Requested" value={new Date(refund.requestedAt).toLocaleString("en-AE")} /></dl></section>
      <section className="rounded-xl border border-border bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Refund decision</h2><p className="mt-2 text-sm text-muted-foreground">Maximum refundable amount: AED {maximum.toLocaleString()}</p><label className="mt-5 block text-sm font-semibold">Amount to refund (AED)<Input className="mt-2" type="number" min="0.01" max={maximum} step="0.01" disabled={!canAct || saving} value={amount} onChange={(event) => setAmount(Number(event.target.value))} /></label><label className="mt-4 block text-sm font-semibold">Admin note<Textarea className="mt-2" value={note} disabled={!canAct || saving} onChange={(event) => setNote(event.target.value)} /></label><label className="mt-4 block text-sm font-semibold">Decline reason<Textarea className="mt-2" value={declineReason} disabled={!canAct || saving} onChange={(event) => setDeclineReason(event.target.value)} /></label>{canAct && <div className="mt-6 flex flex-wrap gap-3"><Button variant="primary" disabled={saving || amount <= 0 || amount > maximum} onClick={() => void update("Approved")}><RotateCcw className="mr-2 h-4 w-4" />{saving ? "Processing..." : "Approve & refund via Stripe"}</Button><Button variant="outline" disabled={saving || !declineReason.trim()} onClick={() => void update("Declined")}><XCircle className="mr-2 h-4 w-4" />Decline</Button></div>}{refund.gatewayRefundId && <p className="mt-5 rounded-lg bg-success/10 p-3 text-sm font-semibold text-success"><CheckCircle2 className="mr-2 inline h-4 w-4" />Stripe refund: {refund.gatewayRefundId}</p>}</section></div>
  </div>;
}
function Row({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>; }
