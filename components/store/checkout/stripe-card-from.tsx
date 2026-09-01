"use client";

import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type StripeCardFormProps = { clientSecret: string; total: number; onPaymentSucceeded: (paymentIntentId: string) => Promise<void> };

const elementOptions = { style: { base: { color: "#19131f", fontFamily: "var(--font-geist-sans), Arial, sans-serif", fontSize: "15px", "::placeholder": { color: "#8b8491" } }, invalid: { color: "#dc2626" } } };

export function StripeCardForm({ clientSecret, total, onPaymentSucceeded }: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  async function handlePayment() {
    if (!stripe || !elements || isProcessing) return;
    setError(""); setIsProcessing(true);
    try {
      const card = elements.getElement(CardNumberElement);
      if (!card) throw new Error("Enter your card number to continue.");
      if (!cardholderName.trim()) throw new Error("Enter the name shown on your card.");
      const method = await stripe.createPaymentMethod({ type: "card", card, billing_details: { name: cardholderName.trim() } });
      if (method.error || !method.paymentMethod) throw new Error(method.error?.message ?? "Your card details could not be verified.");
      const result = await stripe.confirmCardPayment(clientSecret, { payment_method: method.paymentMethod.id });
      if (result.error || !result.paymentIntent) throw new Error(result.error?.message ?? "Your payment could not be completed.");
      if (result.paymentIntent.status !== "succeeded") throw new Error("Your payment needs additional verification. Please try again.");
      await onPaymentSucceeded(result.paymentIntent.id);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your payment could not be completed.");
      setIsProcessing(false);
    }
  }

  const formattedTotal = `AED ${total.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return <div className="space-y-5">
    <div className="space-y-4 rounded-2xl border border-border bg-background p-4 sm:p-5">
      <CardField label="Card number"><CardNumberElement options={{ ...elementOptions, placeholder: "1111 2222 3333 4444", disableLink: true }} /></CardField>
      <label className="block"><span className="mb-2 block text-sm font-semibold text-foreground">Name on card</span><input value={cardholderName} onChange={(event) => setCardholderName(event.target.value)} autoComplete="cc-name" placeholder="Name as shown on card" className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
      <div className="grid gap-4 sm:grid-cols-2"><CardField label="Expiry date"><CardExpiryElement options={{ ...elementOptions, placeholder: "MM / YY" }} /></CardField><CardField label="CVV"><CardCvcElement options={{ ...elementOptions, placeholder: "CVV" }} /></CardField></div>
    </div>
    {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-center text-sm font-semibold text-error">{error}</div>}
    <Button type="button" variant="primary" disabled={!stripe || !elements || isProcessing} onClick={handlePayment} className="h-12 w-full rounded-xl px-6 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"><span className="inline-flex items-center justify-center gap-2 whitespace-nowrap"><LockKeyhole className="h-4 w-4 shrink-0" /><span>{isProcessing ? "Processing payment..." : `Pay ${formattedTotal}`}</span></span></Button>
    <div className="flex items-start justify-center gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p className="max-w-md text-center text-[11px] leading-5 text-muted-foreground">Your card details are securely processed by Stripe. Royal Chins never stores your card number, expiry date, or CVV.</p></div>
  </div>;
}

function CardField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-foreground">{label}</span><span className="flex h-12 items-center rounded-xl border border-border bg-background px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">{children}</span></label>;
}
