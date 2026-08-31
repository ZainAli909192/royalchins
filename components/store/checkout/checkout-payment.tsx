"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import type { CheckoutOrderItem } from "@/components/store/checkout/order-summary";

type PaymentMethod = "card" | "tamara" | "tabby";

const checkoutItems: CheckoutOrderItem[] = [
  {
    id: "white-chinchilla",
    slug: "white-chinchilla",
    name: "White Chinchilla",
    image: "/animals/1.png",
    type: "Animal",
    price: 1400,
    quantity: 1,
    shortMeta: "Male • 8 months",
  },
  {
    id: "premium-chinchilla-cage",
    slug: "premium-chinchilla-cage",
    name: "Premium Chinchilla Cage",
    image: "/animals/3.png",
    type: "Accessory",
    price: 650,
    quantity: 1,
    shortMeta: "Large premium habitat",
  },
  {
    id: "wooden-hideout",
    slug: "wooden-hideout",
    name: "Wooden Hideout",
    image: "/animals/5.png",
    type: "Accessory",
    price: 75,
    quantity: 1,
    shortMeta: "Natural wood shelter",
  },
];

const deliveryFee = 35;

export function CheckoutPayment() {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("card");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const subtotal = checkoutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const total = subtotal + deliveryFee;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsSubmitting(true);

    /*
      Replace this with your backend payment flow.

      Card:
      Create payment session -> redirect/open gateway.

      Tamara:
      Create Tamara checkout session -> redirect.

      Tabby:
      Create Tabby checkout session -> redirect.
    */

    router.push(
      `/checkout/confirmation?payment=${paymentMethod}`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"
    >
      <div className="min-w-0 space-y-4 sm:space-y-5">
        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Payment
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Choose how you want to pay
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Select your preferred payment method to complete your Royal Chins
              order.
            </p>
          </div>

          <div className="mt-7 space-y-3">
            <PaymentOption
              active={paymentMethod === "card"}
              title="Credit / Debit Card"
              description="Pay securely using your Visa or Mastercard."
              icon={CreditCard}
              onClick={() => setPaymentMethod("card")}
            >
              <div className="flex items-center gap-1.5">
                <PaymentBadge>VISA</PaymentBadge>
                <PaymentBadge>Mastercard</PaymentBadge>
              </div>
            </PaymentOption>

            <PaymentOption
              active={paymentMethod === "tamara"}
              title="Tamara"
              description="Split your payment with Tamara."
              icon={WalletCards}
              onClick={() => setPaymentMethod("tamara")}
            >
              <span className="rounded-md bg-foreground px-2.5 py-1 text-[10px] font-bold text-background">
                tamara
              </span>
            </PaymentOption>

            <PaymentOption
              active={paymentMethod === "tabby"}
              title="Tabby"
              description="Pay later or split your purchase with Tabby."
              icon={WalletCards}
              onClick={() => setPaymentMethod("tabby")}
            >
              <span className="rounded-md border border-border bg-background px-2.5 py-1 text-[10px] font-bold text-foreground">
                tabby
              </span>
            </PaymentOption>
          </div>
        </section>

        {paymentMethod === "card" && (
          <CardPaymentNotice />
        )}

        {paymentMethod === "tamara" && (
          <ExternalPaymentNotice
            name="Tamara"
            text="After you continue, you will be redirected to Tamara to complete your payment securely."
          />
        )}

        {paymentMethod === "tabby" && (
          <ExternalPaymentNotice
            name="Tabby"
            text="After you continue, you will be redirected to Tabby to complete your payment securely."
          />
        )}

       

        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-5">
         <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
  <Button
    asChild
    type="button"
    variant="secondary"
    className="h-12 rounded-xl px-5"
  >
    <Link
      href="/checkout/review"
      className="whitespace-nowrap"
    >
      <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
        <ArrowLeft
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
          strokeWidth={2}
        />

        <span>Reveiw</span>
      </span>
    </Link>
  </Button>

  <Button
    type="submit"
    variant="primary"
    disabled={isSubmitting}
    className="h-12 rounded-xl px-6 text-sm font-bold sm:min-w-[220px]"
  >
    <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
      <LockKeyhole
        aria-hidden="true"
        className="h-4 w-4 shrink-0"
        strokeWidth={2}
      />

      <span>
        {isSubmitting
          ? "Processing..."
          : getPaymentButtonText(paymentMethod, total)}
      </span>
    </span>
  </Button>
</div>

          <div className="mt-4 flex items-start justify-center gap-2 border-t border-border pt-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <p className="max-w-md text-center text-[11px] leading-5 text-muted-foreground">
              Your payment is processed securely. Royal Chins does not store
              your complete card details.
            </p>
          </div>
        </section>
      </div>

      
    </form>
  );
}

type PaymentOptionProps = {
  active: boolean;
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  children?: React.ReactNode;
};

function PaymentOption({
  active,
  title,
  description,
  icon: Icon,
  onClick,
  children,
}: PaymentOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative w-full rounded-2xl border-2 p-4 text-left transition-all sm:p-5 ${
        active
          ? "border-primary bg-primary/5"
          : "border-border bg-background hover:border-primary/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            active
              ? "bg-primary text-primary-foreground"
              : "bg-surface-subtle text-muted-foreground"
          }`}
        >
          <Icon
            className="h-5 w-5"
            strokeWidth={2}
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-sm font-bold text-foreground sm:text-base">
              {title}
            </p>

            {children}
          </div>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>

        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
            active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background"
          }`}
        >
          {active && (
            <Check
              className="h-3.5 w-3.5"
              strokeWidth={3}
            />
          )}
        </span>
      </div>
    </button>
  );
}

function PaymentBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-md border border-border bg-background px-2 py-1 text-[9px] font-bold text-muted-foreground">
      {children}
    </span>
  );
}

function CardPaymentNotice() {
  return (
    <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CreditCard
            className="h-4 w-4"
            strokeWidth={2}
          />
        </span>

        <div>
          <h2 className="text-sm font-bold text-foreground sm:text-base">
            Secure Card Payment
          </h2>

          <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            Your card details will be entered securely through the payment
            provider. We will connect the live payment gateway here during
            backend integration.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <SecurityPoint
          title="Encrypted"
          text="Secure payment connection"
        />

        <SecurityPoint
          title="Protected"
          text="Card data stays private"
        />

        <SecurityPoint
          title="Verified"
          text="Payment confirmation"
        />
      </div>
    </section>
  );
}

function ExternalPaymentNotice({
  name,
  text,
}: {
  name: string;
  text: string;
}) {
  return (
    <section className="rounded-2xl border border-primary/15 bg-primary/5 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <WalletCards
            className="h-4 w-4"
            strokeWidth={2}
          />
        </span>

        <div>
          <p className="text-sm font-bold text-foreground">
            Pay with {name}
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}

function SecurityPoint({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl bg-surface-subtle p-3">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />

        <p className="text-xs font-bold text-foreground">
          {title}
        </p>
      </div>

      <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

function getPaymentButtonText(
  method: PaymentMethod,
  total: number
) {
  const amount = `AED ${total.toLocaleString()}`;

  if (method === "tamara") {
    return `Continue with Tamara · ${amount}`;
  }

  if (method === "tabby") {
    return `Continue with Tabby · ${amount}`;
  }

  return `Pay ${amount}`;
}
