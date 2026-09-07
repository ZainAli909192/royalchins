"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowLeft } from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { AdminPageLoader } from "@/components/admin/shared/admin-page-loader";
import { CardPaymentOption } from "@/components/store/checkout/card-payment-option";
import { StripePaymentMethodSelector } from "@/components/store/checkout/stripe-express-checkout";
import { TabbyPaymentOption } from "@/components/store/checkout/tabby/tabby-payment-option";
import { TabbyPaymentPanel } from "@/components/store/checkout/tabby/tabby-payment-panel";
import { TamaraPaymentOption } from "@/components/store/checkout/tamara/tamara-payment-option";
import { TamaraPaymentPanel } from "@/components/store/checkout/tamara/tamara-payment-panel";
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
  | "tamara"
  | null;

export function CheckoutPayment() {
  const router = useRouter();

  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  ] =
    useState<SelectedPaymentMethod>(
      null
    );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    checkoutItems,
    setCheckoutItems,
  ] = useState<
    CheckoutOrderItem[]
  >([]);

  const [
    addressId,
    setAddressId,
  ] = useState<string | null>(
    null
  );

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
    const checkout =
      getCheckout();

    if (
      !checkout?.items.length ||
      !checkout.addressId
    ) {
      router.replace(
        "/checkout/delivery"
      );

      return;
    }

    setCheckoutItems(
      checkout.items
    );

    setAddressId(
      checkout.addressId
    );

    setDeliveryFee(
      checkout.deliveryFee ??
        0
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
    subtotal + deliveryFee;

  async function prepareStripePayment() {
    if (
      !addressId ||
      checkoutItems.length ===
        0 ||
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
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  addressId,

                  paymentMethod:
                    "Card",

                  items:
                    checkoutItems.map(
                      (
                        item
                      ) => ({
                        productId:
                          item.id,

                        quantity:
                          item.quantity,
                      })
                    ),
                }
              ),
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

      if (
        !order.clientSecret
      ) {
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
          Number(
            order.amount
          ),
      });
    } catch (caught) {
      setError(
        caught instanceof
          Error
          ? caught.message
          : "Unable to prepare your payment."
      );
    } finally {
      setIsSubmitting(
        false
      );
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

  function selectTamaraPayment() {
    setSelectedPaymentMethod(
      "tamara"
    );

    setError("");
  }

  async function payWithTabby() {
    if (
      !addressId ||
      !checkoutItems.length ||
      isSubmitting
    ) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response =
        await fetch(
          "/api/store/tabby/checkout",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                addressId,

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

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (
        !response.ok ||
        !data.checkoutUrl
      ) {
        throw new Error(
          data.message ??
            "Unable to start Tabby payment."
        );
      }

      window.location.assign(
        data.checkoutUrl
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to connect to Tabby."
      );

      setIsSubmitting(false);
    }
  }

  async function payWithTamara() {
    if (
      !addressId ||
      !checkoutItems.length ||
      isSubmitting
    ) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response =
        await fetch(
          "/api/store/tamara/checkout",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                addressId,

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

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (
        !response.ok ||
        !data.checkoutUrl
      ) {
        throw new Error(
          data.message ??
            "Unable to start Tamara payment."
        );
      }

      window.location.assign(
        data.checkoutUrl
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to connect to Tamara."
      );

      setIsSubmitting(false);
    }
  }

  async function handlePaymentSucceeded(
    paymentIntentId: string
  ) {
    if (!stripePayment)
      return;

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
            JSON.stringify(
              {
                paymentIntentId,
              }
            ),
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
              Choose how you
              want to pay
            </h1>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <CardPaymentOption
                active={
                  selectedPaymentMethod ===
                  "stripe"
                }
                onClick={() => {
                  void selectStripePayment();
                }}
              />

              <TabbyPaymentOption
                active={
                  selectedPaymentMethod ===
                  "tabby"
                }
                onClick={
                  selectTabbyPayment
                }
              />

              <TamaraPaymentOption
                selected={
                  selectedPaymentMethod ===
                  "tamara"
                }
                onClick={
                  selectTamaraPayment
                }
              />
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
                Select a
                payment method
                to continue.
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
              Stripe checkout
              is not
              configured.
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

                      variables:
                        {
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
              <TabbyPaymentPanel
                total={total}
                loading={
                  isSubmitting
                }
                error={error}
                onPay={() => {
                  void payWithTabby();
                }}
              />
            </Reveal>
          )}

        {selectedPaymentMethod ===
          "tamara" && (
            <Reveal
              direction="scale"
              scaleFrom={0.96}
              duration={0.4}
            >
              <TamaraPaymentPanel
                total={total}
                loading={
                  isSubmitting
                }
                error={error}
                onPay={() => {
                  void payWithTamara();
                }}
              />
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