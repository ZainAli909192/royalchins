"use client";

import { ExpressCheckoutElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminPageLoader } from "@/components/admin/shared/admin-page-loader";
import { StripeCardForm } from "@/components/store/checkout/stripe-card-from";

type WalletMethod = "applePay" | "googlePay";
type SelectedPaymentMethod = "card" | WalletMethod;
type WalletAvailability = Record<WalletMethod, boolean>;

type StripePaymentMethodSelectorProps = {
  total: number;
  onPaymentSucceeded: (paymentIntentId: string) => Promise<void>;
};

/** Uses a single existing Elements instance and PaymentIntent for every method. */
export function StripePaymentMethodSelector({ total, onPaymentSucceeded }: StripePaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<SelectedPaymentMethod>("card");
  const [walletAvailability, setWalletAvailability] = useState<WalletAvailability | null>(null);

  useEffect(() => {
    if (selectedMethod !== "card" && walletAvailability?.[selectedMethod] === false) {
      setSelectedMethod("card");
    }
  }, [selectedMethod, walletAvailability]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Payment method</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">Choose how you want to pay</h2>
      </div>

      {/* <div role="tablist" aria-label="Payment method" className="grid gap-2 sm:grid-cols-3">
        <PaymentMethodTab active={selectedMethod === "card"} icon={CreditCard} label="Credit / Debit Card" onClick={() => setSelectedMethod("card")} />
        <PaymentMethodTab active={selectedMethod === "applePay"} available={Boolean(walletAvailability?.applePay)} label="Apple Pay" onClick={() => { if (walletAvailability?.applePay) setSelectedMethod("applePay"); }} />
        <PaymentMethodTab active={selectedMethod === "googlePay"} available={Boolean(walletAvailability?.googlePay)} label="Google Pay" onClick={() => { if (walletAvailability?.googlePay) setSelectedMethod("googlePay"); }} />
      </div> */}

      {selectedMethod === "card" ? (
        <>
          <WalletAvailabilityProbe onAvailability={setWalletAvailability} />
          <div className="border-t border-border pt-5">
            <h3 className="text-base font-bold text-foreground">Enter card details</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your payment is securely processed by Stripe.</p>
            <div className="mt-5">
              <StripeCardForm total={total} onPaymentSucceeded={onPaymentSucceeded} />
            </div>
          </div>
        </>
      ) : (
        <StripeWalletCheckout
          key={selectedMethod}
          method={selectedMethod}
          onPaymentSucceeded={onPaymentSucceeded}
          onUnavailable={() => setSelectedMethod("card")}
        />
      )}
    </div>
  );
}

type PaymentMethodTabProps = {
  active: boolean;
  available?: boolean;
  icon?: typeof CreditCard;
  label: string;
  onClick: () => void;
};

function PaymentMethodTab({ active, available = true, icon: Icon, label, onClick }: PaymentMethodTabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-disabled={!available}
      onClick={onClick}
      className={`min-h-16 rounded-2xl border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:min-h-20 sm:px-4 ${active ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/50"}`}
    >
      <span className="flex items-center gap-2.5">
        {Icon ? <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-surface-subtle text-foreground"}`}><Icon className="h-4 w-4" aria-hidden="true" /></span> : null}
        <span className="min-w-0">
          <span className="block text-sm font-bold text-foreground">{label}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">Secure checkout</span>
        </span>
      </span>
    </button>
  );
}

function WalletAvailabilityProbe({ onAvailability }: { onAvailability: (availability: WalletAvailability) => void }) {
  return (
    <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
      <ExpressCheckoutElement
        options={{
          paymentMethods: { applePay: "auto", amazonPay: "never", googlePay: "auto", klarna: "never", link: "never", paypal: "never" },
          layout: { maxColumns: 1, maxRows: 1, overflow: "never" },
        }}
        onReady={({ availablePaymentMethods }) => onAvailability({ applePay: Boolean(availablePaymentMethods?.applePay), googlePay: Boolean(availablePaymentMethods?.googlePay) })}
        onConfirm={() => undefined}
        onLoadError={() => onAvailability({ applePay: false, googlePay: false })}
      />
    </div>
  );
}

type StripeWalletCheckoutProps = {
  method: WalletMethod;
  onPaymentSucceeded: (paymentIntentId: string) => Promise<void>;
  onUnavailable: () => void;
};

function StripeWalletCheckout({ method, onPaymentSucceeded, onUnavailable }: StripeWalletCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);
  const [error, setError] = useState("");
  const label = method === "applePay" ? "Apple Pay" : "Google Pay";

  async function handleConfirm() {
    if (!stripe || !elements || isProcessing) return;
    setError("");
    setIsProcessing(true);

    try {
      const submitted = await elements.submit();
      if (submitted.error) throw new Error(submitted.error.message ?? `${label} could not be completed.`);

      const result = await stripe.confirmPayment({ elements, redirect: "if_required" });
      if (result.error || !result.paymentIntent) throw new Error(result.error?.message ?? `${label} could not be completed.`);
      if (result.paymentIntent.status !== "succeeded") throw new Error("Your payment needs additional verification. Please try again.");

      await onPaymentSucceeded(result.paymentIntent.id);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : `${label} could not be completed.`);
      setIsProcessing(false);
    }
  }

  return (
    <div className="border-t border-border pt-5">
      <div className="flex items-start gap-3">
        <div>
          <h3 className="text-base font-bold text-foreground">Pay with {label}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Complete payment with the secure {label} sheet.</p>
        </div>
      </div>

      <div className="relative mt-5 min-h-[180px]">
        {!isElementReady && <AdminPageLoader label={`Loading ${label}...`} className="min-h-[180px] rounded-2xl" />}
        <div className={isElementReady ? "transition-opacity duration-200" : "pointer-events-none absolute inset-0 opacity-0"}>
        <ExpressCheckoutElement
          options={{
            paymentMethods: { applePay: method === "applePay" ? "auto" : "never", amazonPay: "never", googlePay: method === "googlePay" ? "auto" : "never", klarna: "never", link: "never", paypal: "never" },
            buttonTheme: method === "applePay" ? { applePay: "black" } : { googlePay: "black" },
            buttonType: method === "applePay" ? { applePay: "check-out" } : { googlePay: "checkout" },
            buttonHeight: 48,
            layout: { maxColumns: 1, maxRows: 1, overflow: "never" },
          }}
          onReady={({ availablePaymentMethods }) => {
            if (!availablePaymentMethods?.[method]) {
              onUnavailable();
              return;
            }
            setIsElementReady(true);
          }}
          onConfirm={() => { void handleConfirm(); }}
          onLoadError={({ error: loadError }) => {
            setError(loadError.message ?? `${label} is unavailable right now.`);
            onUnavailable();
          }}
        />
        </div>
      </div>

      {isProcessing && <p className="mt-3 text-center text-sm font-semibold text-primary" aria-live="polite">Confirming {label}...</p>}
      {error && <p className="mt-3 rounded-xl bg-error/10 px-4 py-3 text-center text-sm font-semibold text-error" role="alert">{error}</p>}

      <div className="mt-5 flex items-start justify-center gap-2 border-t border-border pt-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="max-w-md text-center text-[11px] leading-5 text-muted-foreground">{label} securely processes your payment. Royal Chins never receives or stores complete card details.</p>
      </div>
    </div>
  );
}
