import Image from "next/image";
import {
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

export type CheckoutOrderItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  price: number;
  quantity: number;
  shortMeta?: string;
};

type OrderSummaryProps = {
  items: CheckoutOrderItem[];
  deliveryFee?: number | null;
  showProducts?: boolean;
};

export function OrderSummary({
  items,
  deliveryFee = null,
  showProducts = true,
}: OrderSummaryProps) {
  const subtotal = items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const total =
    subtotal + (deliveryFee ?? 0);

  const totalItems = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  return (
    <>
      <aside className="hidden h-fit rounded-3xl border border-border bg-background p-6 shadow-sm lg:sticky lg:top-24 lg:block">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Your Order
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">
              Order Summary
            </h2>
          </div>

          <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}
          </span>
        </div>

        {showProducts && (
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
              />
            ))}
          </div>
        )}

        <div className="my-5 border-t border-border" />

        <div className="space-y-3">
          <SummaryRow
            label="Subtotal"
            value={`AED ${subtotal.toLocaleString()}`}
          />

          <SummaryRow
            label="Delivery"
            value={
              deliveryFee === null
                ? "Calculated after address"
                : deliveryFee === 0
                  ? "Free"
                  : `AED ${deliveryFee.toLocaleString()}`
            }
            muted={
              deliveryFee === null
            }
          />
        </div>

        <div className="my-5 border-t border-border" />

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-foreground">
              Total
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Including delivery
            </p>
          </div>

          <p className="text-2xl font-bold tracking-tight text-primary">
            AED {total.toLocaleString()}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <TrustItem
            icon={Truck}
            title="UAE Delivery"
            description="Delivery details are confirmed before payment."
          />

          <TrustItem
            icon={ShieldCheck}
            title="Secure Checkout"
            description="Your checkout information is protected."
          />

          <TrustItem
            icon={PackageCheck}
            title="Careful Handling"
            description="Orders are prepared with care before delivery."
          />
        </div>
      </aside>

      <div className="rounded-2xl border border-border bg-background p-4 shadow-sm lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Order total
            </p>

            <p className="mt-0.5 text-xl font-bold tracking-tight text-primary">
              AED {total.toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}
            </span>

            {deliveryFee === null && (
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                + delivery
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function OrderItem({
  item,
}: {
  item: CheckoutOrderItem;
}) {
  return (
    <div className="flex gap-3">
      <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-xl bg-surface-subtle">
        <Image
          src={item.image}
          alt={item.name}
          fill
          unoptimized
          sizes="64px"
          className="object-cover"
        />

        {item.quantity > 1 && (
          <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[9px] font-bold text-secondary-foreground">
            {item.quantity}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-bold text-foreground">
          {item.name}
        </p>

        <p className="mt-0.5 text-[11px] font-medium text-primary">
          {item.type}
        </p>

        {item.shortMeta && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
            {item.shortMeta}
          </p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-foreground">
          AED{" "}
          {(
            item.price *
            item.quantity
          ).toLocaleString()}
        </p>

        {item.quantity > 1 && (
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Qty {item.quantity}
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span
        className={`text-right text-sm font-semibold ${
          muted
            ? "text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function TrustItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-surface-subtle p-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon
          className="h-4 w-4"
          strokeWidth={2}
        />
      </span>

      <div>
        <p className="text-xs font-bold text-foreground">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}