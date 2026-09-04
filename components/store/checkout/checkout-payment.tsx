"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  ArrowLeft,
  Check,
  CreditCard,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AdminPageLoader } from "@/components/admin/shared/admin-page-loader";
import { StripePaymentMethodSelector } from "@/components/store/checkout/stripe-express-checkout";
import type { CheckoutOrderItem } from "@/components/store/checkout/order-summary";
import { Reveal } from "@/components/store/shared/reveal";
import { Button } from "@/components/ui/button";
import { clearCart } from "@/lib/store/cart-storage";
import {
  clearCheckout,
  getCheckout,
} from "@/lib/store/checkout-storage";

const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

type SelectedPaymentMethod =
  | "stripe"
  | "tabby"
  | null;

export function CheckoutPayment() {
  const router = useRouter();

  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  ] = useState<SelectedPaymentMethod>(null);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    checkoutItems,
    setCheckoutItems,
  ] = useState<CheckoutOrderItem[]>([]);

  const [
    addressId,
    setAddressId,
  ] = useState<string | null>(null);

  const [
    deliveryFee,
    setDeliveryFee,
  ] = useState(0);

  const [
    error,
    setError,
  ] = useState("");

  const [
    stripePayment,
    setStripePayment,
  ] = useState<{
    orderNumber: string;
    clientSecret: string;
    amount: number;
  } | null>(null);

  useEffect(() => {
    const checkout = getCheckout();

    if (
      !checkout?.items.length ||
      !checkout.addressId
    ) {
      router.replace("/checkout/delivery");
      return;
    }

    setCheckoutItems(checkout.items);
    setAddressId(checkout.addressId);
    setDeliveryFee(
      checkout.deliveryFee ?? 0
    );
  }, [router]);

  const subtotal =
    checkoutItems.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  const total =
    subtotal +
    deliveryFee;

  async function prepareStripePayment() {
    if (
      !addressId ||
      checkoutItems.length === 0 ||
      stripePayment ||
      isSubmitting
    ) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response =
        await fetch(
          "/api/store/checkout/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              addressId,

              paymentMethod:
                "Card",

              items:
                checkoutItems.map(
                  (item) => ({
                    productId:
                      item.id,

                    quantity:
                      item.quantity,
                  })
                ),
            }),
          }
        );

      const order =
        await response.json();

      if (!response.ok) {
        throw new Error(
          order.message ??
            "Unable to prepare your payment."
        );
      }

      if (!order.clientSecret) {
        throw new Error(
          "Stripe could not prepare your secure payment form."
        );
      }

      setStripePayment({
        orderNumber:
          order.orderNumber,

        clientSecret:
          order.clientSecret,

        amount:
          Number(order.amount),
      });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to prepare your payment."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function selectStripePayment() {
    setSelectedPaymentMethod(
      "stripe"
    );

    setError("");

    await prepareStripePayment();
  }

  function selectTabbyPayment() {
    setSelectedPaymentMethod(
      "tabby"
    );

    setError("");
  }

  async function handlePaymentSucceeded(
    paymentIntentId: string
  ) {
    if (!stripePayment) return;

    const response =
      await fetch(
        `/api/store/checkout/orders/${encodeURIComponent(
          stripePayment.orderNumber
        )}/payment`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              paymentIntentId,
            }),
        }
      );

    const data =
      await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message ??
          "We could not confirm your payment."
      );
    }

    clearCheckout();
    clearCart();

    router.push(
      `/checkout/confirmation?order=${encodeURIComponent(
        stripePayment.orderNumber
      )}`
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-5">
        <Reveal
          direction="up"
          distance={25}
        >
          <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Payment methods
            </p>

            <h1 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Choose how you want to pay
            </h1>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <PaymentOption
                active={
                  selectedPaymentMethod ===
                  "stripe"
                }
                title="Credit / Debit Card"
                description="Card, Apple Pay and Google Pay"
                icon={CreditCard}
                onClick={() => {
                  void selectStripePayment();
                }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <PaymentLogo
                    src="/payments/visa.png"
                    alt="Visa"
                  />

                  <PaymentLogo
                    src="/payments/mastercard.svg"
                    alt="Mastercard"
                  />

                  <PaymentLogo
                    src="/payments/apple-pay.png"
                    alt="Apple Pay"
                  />

                  <PaymentLogo
                    src="/payments/googlepay.png"
                    alt="Google Pay"
                  />
                </div>
              </PaymentOption>

              <PaymentOption
                active={
                  selectedPaymentMethod ===
                  "tabby"
                }
                title="Tabby"
                description="Buy now pay later with Tabby"
                onClick={
                  selectTabbyPayment
                }
              >
                <PaymentLogo
                  src="/payments/tabby-logo.svg"
                  alt="Tabby"
                />
              </PaymentOption>
            </div>
          </section>
        </Reveal>

        {selectedPaymentMethod ===
          null && (
          <Reveal
            direction="fade"
            duration={0.4}
          >
            <section className="rounded-2xl border border-border bg-surface-subtle p-5 text-center">
              <p className="text-sm font-semibold text-foreground">
                Select a payment
                method to continue.
              </p>
            </section>
          </Reveal>
        )}

        {selectedPaymentMethod ===
          "stripe" &&
          !stripePayment &&
          isSubmitting && (
            <Reveal direction="fade">
              <section className="rounded-2xl border border-border bg-background shadow-sm sm:rounded-3xl">
                <AdminPageLoader
                  label="Loading secure payment..."
                  className="min-h-[320px] border-0 bg-background"
                />
              </section>
            </Reveal>
          )}

        {selectedPaymentMethod ===
          "stripe" &&
          !stripePayment &&
          !isSubmitting &&
          error && (
            <Reveal
              direction="up"
              distance={20}
            >
              <section className="rounded-2xl border border-error/20 bg-error/5 p-4">
                <p className="text-center text-sm font-semibold text-error">
                  {error}
                </p>

                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      void prepareStripePayment();
                    }}
                  >
                    Try again
                  </Button>
                </div>
              </section>
            </Reveal>
          )}

        {selectedPaymentMethod ===
          "stripe" &&
          stripePayment &&
          !stripePromise && (
            <section className="rounded-2xl border border-error/30 bg-error/5 p-5 text-sm text-error">
              Stripe checkout is
              not configured.
            </section>
          )}

        {selectedPaymentMethod ===
          "stripe" &&
          stripePayment &&
          stripePromise && (
            <Reveal
              direction="up"
              distance={30}
            >
              <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-5">
                <Elements
                  stripe={
                    stripePromise
                  }
                  options={{
                    clientSecret:
                      stripePayment.clientSecret,

                    appearance: {
                      theme:
                        "stripe",

                      variables: {
                        colorPrimary:
                          "#6F3CC3",

                        colorBackground:
                          "#FFFFFF",

                        colorText:
                          "#000000",

                        borderRadius:
                          "12px",
                      },
                    },
                  }}
                >
                  <StripePaymentMethodSelector
                    total={
                      stripePayment.amount
                    }
                    onPaymentSucceeded={
                      handlePaymentSucceeded
                    }
                  />
                </Elements>
              </section>
            </Reveal>
          )}

        {selectedPaymentMethod ===
          "tabby" && (
            <Reveal
              direction="scale"
              scaleFrom={0.96}
              duration={0.4}
            >
              <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center sm:rounded-3xl">
                <div className="flex justify-center">
                  <PaymentLogo
                    src="/payments/tabby-logo.svg"
                    alt="Tabby"
                    large
                  />
                </div>

                <h2 className="mt-4 text-lg font-bold text-foreground">
                  Tabby selected
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Tabby payment will be connected in the next step.
                </p>
              </section>
            </Reveal>
          )}

        <Reveal
          direction="up"
          distance={20}
        >
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
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                />

                <span>
                  Review
                </span>
              </span>
            </Link>
          </Button>
        </Reveal>
      </div>
    </div>
  );
}

type PaymentOptionProps = {
  active: boolean;
  title: string;
  description: string;
  icon?: React.ElementType;
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
        {Icon && (
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
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-sm font-bold text-foreground sm:text-base">
              {title}
            </p>

            {children}
          </div>

          <p className="mt-2 text-xs leading-5 text-muted-foreground">
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

type PaymentLogoProps = {
  src: string;
  alt: string;
  large?: boolean;
};

function PaymentLogo({
  src,
  alt,
  large = false,
}: PaymentLogoProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white ${
        large
          ? "h-10 w-[72px]"
          : "h-8 w-14"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={
          large
            ? "72px"
            : "56px"
        }
        className="object-contain p-1.5"
      />
    </span>
  );
}