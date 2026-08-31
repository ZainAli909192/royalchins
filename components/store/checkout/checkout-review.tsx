"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Home,
  Mail,
  MapPin,
  PackageOpen,
  PawPrint,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import {
  type ElementType,
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  type CheckoutOrderItem,
  OrderSummary,
} from "@/components/store/checkout/order-summary";
import {
  getCheckout,
} from "@/lib/store/checkout-storage";

const deliveryAddress = {
  label: "Home",
  fullName: "Ahmed Daniyal",
  phone: "+971 50 780 1110",
  email: "ahmed@example.com",
  unit: "Apartment 1204",
  building: "Marina Residence",
  street: "Al Marsa Street",
  area: "Dubai Marina",
  emirate: "Dubai",
  landmark: "",
  notes: "Please call before arrival.",
};

const deliveryFee = 35;

export function CheckoutReview() {
  const router = useRouter();

  const [
    checkoutItems,
    setCheckoutItems,
  ] = useState<
    CheckoutOrderItem[]
  >([]);

  const [
    checkoutLoaded,
    setCheckoutLoaded,
  ] = useState(false);

  useEffect(() => {
    const checkout =
      getCheckout();

    if (
      !checkout ||
      checkout.items.length === 0
    ) {
      setCheckoutLoaded(true);
      return;
    }

    setCheckoutItems(
      checkout.items.map(
        (item) => ({
          id: item.id,
          slug: item.slug,
          name: item.name,
          image: item.image,
          type: item.type,
          price: item.price,
          quantity:
            item.quantity,
          shortMeta:
            item.shortMeta,
        })
      )
    );

    setCheckoutLoaded(true);
  }, []);

  if (!checkoutLoaded) {
    return <ReviewLoading />;
  }

  if (
    checkoutItems.length === 0
  ) {
    return (
      <EmptyCheckout
        onBrowse={() =>
          router.push("/")
        }
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-4 sm:space-y-5">
        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Review Order
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Check everything
                before payment
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Review your
                selected products
                and delivery
                information before
                continuing to
                payment.
              </p>
            </div>

            <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              <CheckCircle2
                aria-hidden="true"
                className="h-4 w-4"
              />

              Ready to Pay
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-6">
          <SectionHeader
            title="Your Items"
            description={`${checkoutItems.length} ${
              checkoutItems.length ===
              1
                ? "product"
                : "products"
            } in this order`}
            actionLabel="Edit Items"
            actionHref="/cart"
          />

          <div className="mt-5 divide-y divide-border">
            {checkoutItems.map(
              (item) => (
                <ReviewProduct
                  key={item.id}
                  item={item}
                />
              )
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-6">
          <SectionHeader
            title="Delivery Address"
            description="Your order will be delivered here"
            actionLabel="Edit Delivery"
            actionHref="/checkout/delivery"
          />

          <div className="mt-5 rounded-2xl bg-surface-subtle p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Home
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-foreground">
                    {
                      deliveryAddress.label
                    }
                  </p>

                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    Selected
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-foreground">
                  {
                    deliveryAddress.fullName
                  }
                </p>

                <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                  <MapPin
                    aria-hidden="true"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                  />

                  <p>
                    {
                      deliveryAddress.unit
                    }
                    ,{" "}
                    {
                      deliveryAddress.building
                    }
                    <br />

                    {
                      deliveryAddress.street
                    }
                    ,{" "}
                    {
                      deliveryAddress.area
                    }
                    <br />

                    {
                      deliveryAddress.emirate
                    }
                    , UAE
                  </p>
                </div>

                {deliveryAddress.landmark && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Landmark:{" "}
                    {
                      deliveryAddress.landmark
                    }
                  </p>
                )}
              </div>
            </div>
          </div>

          {deliveryAddress.notes && (
            <div className="mt-3 rounded-xl border border-border px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Delivery Note
              </p>

              <p className="mt-1 text-sm text-foreground">
                {
                  deliveryAddress.notes
                }
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-6">
          <SectionHeader
            title="Contact Information"
            description="We'll use these details for your order"
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ContactCard
              icon={Phone}
              label="Mobile Number"
              value={
                deliveryAddress.phone
              }
            />

            <ContactCard
              icon={Mail}
              label="Email Address"
              value={
                deliveryAddress.email
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-primary/15 bg-primary/5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Truck
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2}
              />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-foreground">
                  UAE Delivery
                </p>

                <p className="text-sm font-bold text-primary">
                  AED{" "}
                  {deliveryFee.toLocaleString()}
                </p>
              </div>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your order will be
                carefully prepared
                for delivery to{" "}
                {
                  deliveryAddress.emirate
                }
                .
              </p>
            </div>
          </div>
        </section>

        <div className="lg:hidden">
          <OrderSummary
            items={
              checkoutItems
            }
            deliveryFee={
              deliveryFee
            }
          />
        </div>

        <div className="flex flex-col-reverse gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:p-5">
          <Button
            asChild
            variant="secondary"
            className="h-12 rounded-xl px-5"
          >
            <Link
              href="/checkout/delivery"
              className="whitespace-nowrap"
            >
              <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <ArrowLeft
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0"
                  strokeWidth={2}
                />

                <span>
                  Back to Delivery
                </span>
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="primary"
            className="h-12 rounded-xl px-6 text-sm font-bold"
          >
            <Link
              href="/checkout/payment"
              className="whitespace-nowrap"
            >
              <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <span>
                  Continue to
                  Payment
                </span>

                <ArrowRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  strokeWidth={2}
                />
              </span>
            </Link>
          </Button>
        </div>

        <div className="flex items-start gap-3 px-1">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
          />

          <p className="text-xs leading-5 text-muted-foreground">
            You can still go
            back and update your
            order or delivery
            information before
            making payment.
          </p>
        </div>
      </div>

      <div className="hidden lg:block">
        <OrderSummary
          items={
            checkoutItems
          }
          deliveryFee={
            deliveryFee
          }
        />
      </div>
    </div>
  );
}

function ReviewProduct({
  item,
}: {
  item: CheckoutOrderItem;
}) {
  const TypeIcon =
    item.type === "Animal"
      ? PawPrint
      : PackageOpen;

  return (
    <div className="flex gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4">
      <Link
        href={`/products/${item.slug}`}
        className="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-xl bg-surface-subtle sm:h-[100px] sm:w-[100px]"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 82px, 100px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold text-primary sm:text-[10px]">
              <TypeIcon
                aria-hidden="true"
                className="h-3 w-3"
              />

              {
                item.type
              }
            </span>

            <Link
              href={`/products/${item.slug}`}
              className="mt-1.5 block"
            >
              <h3 className="line-clamp-2 text-sm font-bold leading-5 text-foreground transition-colors hover:text-primary sm:text-base">
                {
                  item.name
                }
              </h3>
            </Link>

            {item.shortMeta && (
              <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                {
                  item.shortMeta
                }
              </p>
            )}
          </div>

          <p className="shrink-0 text-sm font-bold text-foreground sm:text-base">
            AED{" "}
            {(
              item.price *
              item.quantity
            ).toLocaleString()}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Quantity:{" "}
            <span className="font-bold text-foreground">
              {
                item.quantity
              }
            </span>
          </p>

          {item.quantity >
            1 && (
            <p className="text-[11px] text-muted-foreground">
              AED{" "}
              {item.price.toLocaleString()}{" "}
              each
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-bold text-foreground sm:text-lg">
          {title}
        </h2>

        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          {description}
        </p>
      </div>

      {actionLabel &&
        actionHref && (
          <Link
            href={
              actionHref
            }
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/10 sm:text-sm"
          >
            {
              actionLabel
            }
          </Link>
        )}
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-surface-subtle p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon
          aria-hidden="true"
          className="h-4 w-4"
          strokeWidth={2}
        />
      </span>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-bold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

function ReviewLoading() {
  return (
    <div className="grid animate-pulse gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-5">
        <div className="h-[150px] rounded-3xl bg-surface-subtle" />

        <div className="h-[300px] rounded-3xl bg-surface-subtle" />

        <div className="h-[250px] rounded-3xl bg-surface-subtle" />
      </div>

      <div className="hidden h-[400px] rounded-3xl bg-surface-subtle lg:block" />
    </div>
  );
}

function EmptyCheckout({
  onBrowse,
}: {
  onBrowse: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-background p-7 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag
            aria-hidden="true"
            className="h-6 w-6"
          />
        </span>

        <h1 className="mt-5 text-xl font-bold text-foreground sm:text-2xl">
          No active checkout
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Your checkout does not
          contain any products.
          Choose an animal or
          accessory to continue.
        </p>

        <Button
          type="button"
          variant="primary"
          onClick={onBrowse}
          className="mt-6 h-12 rounded-xl px-6 font-bold"
        >
          Browse Products
        </Button>
      </div>
    </div>
  );
}