"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { AdminPageLoader } from "@/components/admin/shared/admin-page-loader";
import { Button } from "@/components/ui/button";

type StripeCardFormProps = {
  total: number;
  onPaymentSucceeded: (paymentIntentId: string) => Promise<void>;
};

export function StripeCardForm({ total, onPaymentSucceeded }: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);
  const [error, setError] = useState("");

  async function handlePayment() {
    if (!stripe || !elements || isProcessing) return;
    setError("");
    setIsProcessing(true);

    try {
      const submitted = await elements.submit();
      if (submitted.error) throw new Error(submitted.error.message ?? "Please check your card details.");

      const result = await stripe.confirmPayment({ elements, redirect: "if_required" });
      if (result.error || !result.paymentIntent) {
        throw new Error(result.error?.message ?? "Your payment could not be completed.");
      }
      if (result.paymentIntent.status !== "succeeded") {
        throw new Error("Your payment needs additional verification. Please try again.");
      }

      await onPaymentSucceeded(result.paymentIntent.id);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your payment could not be completed.");
      setIsProcessing(false);
    }
  }

  const formattedTotal = `AED ${total.toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <div className="space-y-5">
      <div className="relative min-h-[340px] rounded-2xl border border-border bg-background p-4 sm:p-5">
        {!isElementReady && <AdminPageLoader label="Loading secure card form..." className="min-h-[300px] border-0 bg-background" />}
        <div className={isElementReady ? "transition-opacity duration-200" : "pointer-events-none absolute inset-0 p-4 opacity-0 sm:p-5"}>
          <PaymentElement
            onReady={() => setIsElementReady(true)}
            options={{
              layout: { type: "tabs", defaultCollapsed: false },
              paymentMethodOrder: ["card"],
              fields: {
                billingDetails: {
                  name: "always",
                  address: { country: "auto" },
                },
              },
              wallets: { applePay: "never", googlePay: "never", link: "never" },
            }}
          />
        </div>
      </div>

      {isElementReady && error && <div className="rounded-xl bg-error/10 px-4 py-3 text-center text-sm font-semibold text-error">{error}</div>}

      {isElementReady && <Button type="button" variant="primary" disabled={!stripe || !elements || isProcessing} onClick={handlePayment} className="h-12 w-full rounded-xl px-6 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50">
        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap"><LockKeyhole className="h-4 w-4 shrink-0" /><span>{isProcessing ? "Processing payment..." : `Pay ${formattedTotal}`}</span></span>
      </Button>}

      {isElementReady && <div className="flex items-start justify-center gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p className="max-w-md text-center text-[11px] leading-5 text-muted-foreground">Stripe securely collects the card number, name, expiry date, and CVV. Royal Chins never receives or stores complete card details.</p></div>}
    </div>
  );
}
