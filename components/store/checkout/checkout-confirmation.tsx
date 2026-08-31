"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  CheckCircle2,
  CreditCard,
  Home,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type ConfirmationItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  price: number;
  quantity: number;
  shortMeta?: string;
};

const fallbackOrder = {
  number: "RC-2026-00124",
  status: "Confirmed",
  paymentStatus: "Payment pending",
  paymentMethod: "Credit / Debit Card",
  subtotal: 2125,
  deliveryFee: 35,
  total: 2160,
};

const fallbackCustomer = {
  name: "Ahmed Daniyal",
  phone: "+971 50 780 1110",
  email: "ahmed@example.com",
};

const fallbackDeliveryAddress = {
  label: "Home",
  unit: "Apartment 1204",
  building: "Marina Residence",
  street: "Al Marsa Street",
  area: "Dubai Marina",
  emirate: "Dubai",
};

const fallbackItems: ConfirmationItem[] = [
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

export function CheckoutConfirmation() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(fallbackOrder);
  const [customer, setCustomer] = useState(fallbackCustomer);
  const [deliveryAddress, setDeliveryAddress] = useState(fallbackDeliveryAddress);
  const [items, setItems] = useState<ConfirmationItem[]>(fallbackItems);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const number = searchParams.get("order");
    if (!number) { setLoaded(true); return; }
    fetch(`/api/store/checkout/orders/${encodeURIComponent(number)}`)
      .then(async (response) => ({ response, data: await response.json() }))
      .then(({ response, data }) => {
        if (!response.ok) return;
        setOrder({ number: data.orderNumber, status: data.orderStatus, paymentStatus: data.paymentStatus === "Pending" ? "Payment pending" : data.paymentStatus, paymentMethod: data.paymentMethod, subtotal: Number(data.subtotal), deliveryFee: Number(data.deliveryFee), total: Number(data.total) });
        setCustomer({ name: data.customerName, phone: data.phone, email: data.email });
        if (data.shippingAddress) setDeliveryAddress({ label: data.shippingAddress.label, unit: data.shippingAddress.unit ?? "", building: data.shippingAddress.building, street: data.shippingAddress.street, area: data.shippingAddress.area, emirate: data.shippingAddress.emirate });
        setItems(data.items.map((item: { id: string; productName: string; quantity: number; unitPrice: string | number; product: { slug: string; type: "Animal" | "Accessory"; images: { url: string }[] } | null }) => ({ id: item.id, slug: item.product?.slug ?? "", name: item.productName, image: item.product?.images[0]?.url ?? "/placeholder.png", type: item.product?.type ?? "Accessory", price: Number(item.unitPrice), quantity: item.quantity })));
      })
      .finally(() => setLoaded(true));
  }, [searchParams]);

  if (!loaded) return <div className="mx-auto max-w-[1100px] px-4 py-16 text-center text-sm font-semibold text-muted-foreground">Loading your confirmed order…</div>;
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
        <div className="relative overflow-hidden bg-primary px-5 py-8 text-center sm:px-8 sm:py-10">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-[-40px] top-[-40px] h-36 w-36 rounded-full border border-white/50" />
            <div className="absolute right-[-30px] top-10 h-28 w-28 rounded-full border border-white/40" />
            <div className="absolute bottom-[-45px] left-1/2 h-40 w-40 -translate-x-1/2 rounded-full border border-white/30" />
          </div>

          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-lg sm:h-20 sm:w-20">
              <Check
                className="h-8 w-8 sm:h-10 sm:w-10"
                strokeWidth={3}
              />
            </span>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
              Order received
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Order Confirmed!
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
              Thank you for choosing Royal Chins. Your order has been received
              and confirmed successfully.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              <ReceiptText className="h-4 w-4" />
              Order #{order.number}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatusCard
              icon={CheckCircle2}
              label="Order Status"
              value={order.status}
            />

            <StatusCard
              icon={CreditCard}
              label="Payment"
              value={order.paymentStatus}
            />

            <StatusCard
              icon={ShoppingBag}
              label="Order Total"
              value={`AED ${order.total.toLocaleString()}`}
              highlight
            />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
            <div className="space-y-5">
              <section className="rounded-2xl border border-border bg-background p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-foreground sm:text-lg">
                      Order Items
                    </h2>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {items.length} products in this order
                    </p>
                  </div>

                  <PackageCheck className="h-5 w-5 text-primary" />
                </div>

                <div className="mt-4 divide-y divide-border">
                  {items.map((item) => (
                    <ConfirmationItemRow
                      key={item.id}
                      item={item}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-background p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />

                  <h2 className="text-base font-bold text-foreground sm:text-lg">
                    Delivery Information
                  </h2>
                </div>

                <div className="mt-4 rounded-2xl bg-surface-subtle p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Home className="h-4 w-4" />
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-foreground">
                          {deliveryAddress.label}
                        </p>

                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          Delivery Address
                        </span>
                      </div>

                      <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />

                        <p>
                          {deliveryAddress.unit}, {deliveryAddress.building}
                          <br />
                          {deliveryAddress.street}, {deliveryAddress.area}
                          <br />
                          {deliveryAddress.emirate}, UAE
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <p className="text-sm font-bold text-foreground">
                    What happens next?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Royal Chins will contact you regarding delivery and make
                    sure your order is prepared safely before dispatch.
                  </p>
                </div>
              </section>
            </div>

            <div className="space-y-5">
              <section className="rounded-2xl border border-border bg-background p-4 sm:p-5">
                <h2 className="text-base font-bold text-foreground sm:text-lg">
                  Order Summary
                </h2>

                <div className="mt-4 space-y-3">
                  <SummaryRow
                    label="Subtotal"
                    value={`AED ${order.subtotal.toLocaleString()}`}
                  />

                  <SummaryRow
                    label="Delivery"
                    value={`AED ${order.deliveryFee.toLocaleString()}`}
                  />

                  <SummaryRow
                    label="Payment Method"
                    value={order.paymentMethod}
                    small
                  />
                </div>

                <div className="my-4 border-t border-border" />

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Total Paid
                    </p>

                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Payment completed
                    </p>
                  </div>

                  <p className="text-2xl font-bold text-primary">
                    AED {order.total.toLocaleString()}
                  </p>
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-background p-4 sm:p-5">
                <h2 className="text-base font-bold text-foreground sm:text-lg">
                  Contact Information
                </h2>

                <div className="mt-4 space-y-3">
                  <ContactRow
                    icon={Phone}
                    label="Mobile"
                    value={customer.phone}
                  />

                  <ContactRow
                    icon={Mail}
                    label="Email"
                    value={customer.email}
                  />
                </div>
              </section>

              <section className="rounded-2xl bg-surface-subtle p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Confirmation sent
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Your order confirmation and payment details have been sent
                      to your registered contact details.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-center">
            <Button
              asChild
              variant="primary"
              className="h-12 rounded-xl px-6 text-sm font-bold"
            >
              <Link href={`/account/orders/${order.number}`}>
                My Order
              </Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              className="h-12 rounded-xl px-6 text-sm font-bold"
            >
              <Link href="/">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ConfirmationItemRow({
  item,
}: {
  item: ConfirmationItem;
}) {
  return (
    <div className="flex gap-3 py-4 first:pt-0 last:pb-0">
      <Link
        href={`/products/${item.slug}`}
        className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-surface-subtle sm:h-[82px] sm:w-[82px]"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          unoptimized
          sizes="82px"
          className="object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}`}
              className="line-clamp-1 text-sm font-bold text-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>

            <p className="mt-1 text-[11px] font-semibold text-primary">
              {item.type}
            </p>

            {item.shortMeta && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {item.shortMeta}
              </p>
            )}
          </div>

          <p className="shrink-0 text-sm font-bold text-foreground">
            AED {(item.price * item.quantity).toLocaleString()}
          </p>
        </div>

        <p className="mt-2 text-[11px] text-muted-foreground">
          Quantity:{" "}
          <span className="font-semibold text-foreground">
            {item.quantity}
          </span>
        </p>
      </div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-subtle p-4">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          highlight
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-muted-foreground">
          {label}
        </p>

        <p
          className={`mt-0.5 truncate text-sm font-bold ${
            highlight
              ? "text-primary"
              : "text-foreground"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  small = false,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span
        className={`max-w-[180px] text-right font-semibold text-foreground ${
          small
            ? "text-xs"
            : "text-sm"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-subtle p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-bold text-foreground sm:text-sm">
          {value}
        </p>
      </div>
    </div>
  );
}
