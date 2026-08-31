"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Minus,
  PackageOpen,
  PawPrint,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { FeaturedProducts } from "@/components/store/browse/featured-products";
import { Button } from "@/components/ui/button";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/store/cart-storage";
import {
  saveCheckout,
} from "@/lib/store/checkout-storage";

type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  price: number;
  stock: number;
  quantity: number;
  shortMeta?: string;
};

const featuredItems: CartItem[] = [
  {
    id: "white-chinchilla",
    slug: "white-chinchilla",
    name: "White Chinchilla",
    image: "/animals/1.png",
    type: "Animal",
    price: 1400,
    stock: 2,
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
    stock: 12,
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
    stock: 8,
    quantity: 1,
    shortMeta: "Natural wood shelter",
  },
];

export default function CartPage() {
  const router = useRouter();

  const [items, setItems] =
    useState<CartItem[]>([]);

  const [cartLoaded, setCartLoaded] =
    useState(false);

  useEffect(() => {
    const storedCart = getCart();

    setItems(storedCart as CartItem[]);
    setCartLoaded(true);
  }, []);

  const subtotal = useMemo(
  () =>
    items.reduce(
      (total, item) =>
        total +
        Number(item.price ?? 0) *
          Number(item.quantity ?? 1),
      0
    ),
  [items]
);

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [items]
  );

  const updateQuantity = (
    id: string,
    direction:
      | "increase"
      | "decrease"
  ) => {
    const item = items.find(
      (cartItem) =>
        cartItem.id === id
    );

    if (!item) {
      return;
    }

    if (item.type === "Animal") {
      return;
    }

    const nextQuantity =
      direction === "increase"
        ? Math.min(
            item.quantity + 1,
            item.stock
          )
        : Math.max(
            item.quantity - 1,
            1
          );

    const updatedCart =
      updateCartQuantity(
        item.slug,
        nextQuantity
      );

    setItems(
      updatedCart as CartItem[]
    );
  };

  const removeItem = (
    id: string
  ) => {
    const item = items.find(
      (cartItem) =>
        cartItem.id === id
    );

    if (!item) {
      return;
    }

    const updatedCart =
      removeFromCart(item.slug);

    setItems(
      updatedCart as CartItem[]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    saveCheckout({
      source: "cart",
      items: items.map(
        ({
          id,
          slug,
          name,
          image,
          type,
          price,
          quantity,
          shortMeta,
        }) => ({
          id,
          slug,
          name,
          image,
          type,
          price,
          quantity,
          shortMeta,
        })
      ),
    });

    router.push(
      "/checkout/auth"
    );
  };

  if (!cartLoaded) {
    return (
      <CartLoading />
    );
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mb-6 sm:mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          Your Selection
        </p>

        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Shopping Cart
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>
          </div>

          <Link
            href="/"
            className="hidden text-sm font-semibold text-primary transition-opacity hover:opacity-80 sm:inline-flex"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
        <section className="space-y-3 sm:space-y-4">
          <div className="hidden items-center justify-between border-b border-border pb-3 sm:flex">
            <p className="text-sm font-bold text-foreground">
              Cart items
            </p>

            <p className="text-xs font-medium text-muted-foreground">
              Review your selection
              before checkout
            </p>
          </div>

          {items.map((item) => (
            <CartItemCard
              key={`${item.id}-${item.slug}`}
              item={item}
              onIncrease={() =>
                updateQuantity(
                  item.id,
                  "increase"
                )
              }
              onDecrease={() =>
                updateQuantity(
                  item.id,
                  "decrease"
                )
              }
              onRemove={() =>
                removeItem(item.id)
              }
            />
          ))}

          <Link
            href="/"
            className="flex h-12 items-center justify-center rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary sm:hidden"
          >
            Continue Shopping
          </Link>
        </section>

        <aside className="h-fit rounded-3xl border border-border bg-background p-5 shadow-md lg:sticky lg:top-24 lg:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                Checkout
              </p>

              <h2 className="mt-1 text-xl font-bold text-foreground">
                Order summary
              </h2>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag
                aria-hidden="true"
                className="h-5 w-5"
                strokeWidth={1.9}
              />
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <SummaryRow
              label={`Items (${totalItems})`}
              value={`AED ${subtotal.toLocaleString()}`}
            />

            <SummaryRow
              label="Delivery"
              value="Calculated at checkout"
              muted
            />
          </div>

          <div className="my-5 border-t border-border" />

          <div className="rounded-2xl bg-surface-subtle p-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Subtotal
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Excluding delivery
                  fees
                </p>
              </div>

              <p className="text-2xl font-bold text-primary">
                AED{" "}
                {subtotal.toLocaleString()}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={handleCheckout}
            className="mt-5 h-13 w-full rounded-xl text-sm font-bold shadow-primary transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 motion-reduce:transform-none"
          >
            <span className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap">
              <span>
                Proceed to checkout
              </span>

              <ArrowRight
                aria-hidden="true"
                className="h-5 w-5 shrink-0"
                strokeWidth={2}
              />
            </span>
          </Button>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-border bg-surface-subtle p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Truck
                aria-hidden="true"
                className="h-5 w-5"
                strokeWidth={2}
              />
            </span>

            <div>
              <p className="text-sm font-semibold text-foreground">
                UAE Delivery
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Delivery details and
                fees are confirmed
                during checkout.
              </p>
            </div>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] leading-5 text-muted-foreground">
            <ShieldCheck
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-primary"
            />

            Secure checkout. Animal
            quantities are limited to
            one per cart line.
          </p>
        </aside>
      </div>

      <div className="mt-10 border-t border-border pt-8 sm:mt-12 sm:pt-10">
        <FeaturedProducts
          products={featuredItems.map(
            ({
              slug,
              name,
              image,
              type,
              price,
              shortMeta,
            }) => ({
              slug,
              name,
              image,
              type,
              price,
              shortMeta,
            })
          )}
        />
      </div>
    </div>
  );
}

type CartItemCardProps = {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemCardProps) {
  const isAnimal =
    item.type === "Animal";

    const safePrice =
  Number(item.price ?? 0);
  const productHref =
    `/products/${item.slug}`;

  const TypeIcon =
    item.type === "Animal"
      ? PawPrint
      : PackageOpen;

  return (
    <article className="group rounded-2xl border border-border bg-background p-3 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-primary/25 hover:shadow-md sm:p-4">
      <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-3 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-4">
        <Link
          href={productHref}
          className="relative block h-[100px] overflow-hidden rounded-2xl bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-[130px]"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100px, 140px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
          />
        </Link>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                <TypeIcon
                  aria-hidden="true"
                  className="h-3 w-3"
                  strokeWidth={2}
                />

                {item.type}
              </span>

              <Link
                href={productHref}
                className="mt-2 block"
              >
                <h2 className="line-clamp-2 text-sm font-bold leading-5 text-foreground transition-colors hover:text-primary sm:text-base">
                  {item.name}
                </h2>
              </Link>

              {item.shortMeta && (
                <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground sm:text-xs">
                  {item.shortMeta}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${item.name} from cart`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-error/15 hover:bg-error/10 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Trash2
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2}
              />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3 sm:mt-4">
            <div>
              <p className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                AED{" "}
            {(
  safePrice *
  item.quantity
).toLocaleString()}
              </p>

              {item.quantity > 1 && (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  AED{" "}
                  {safePrice.toLocaleString()}{" "}
                  each
                </p>
              )}
            </div>

            {isAnimal ? (
              <div className="rounded-xl border border-border bg-surface-subtle px-3 py-2 text-xs font-semibold text-muted-foreground">
                Qty 1
              </div>
            ) : (
              <div className="flex h-10 items-center overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                <button
                  type="button"
                  onClick={onDecrease}
                  disabled={
                    item.quantity <= 1
                  }
                  aria-label={`Decrease ${item.name} quantity`}
                  className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Minus
                    aria-hidden="true"
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                </button>

                <span className="min-w-8 text-center text-sm font-bold tabular-nums text-foreground">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={onIncrease}
                  disabled={
                    item.quantity >=
                    item.stock
                  }
                  aria-label={`Increase ${item.name} quantity`}
                  className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Plus
                    aria-hidden="true"
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
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

function EmptyCart() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-[600px] items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border border-border bg-background p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag
            aria-hidden="true"
            className="h-7 w-7"
            strokeWidth={1.8}
          />
        </span>

        <h1 className="mt-5 text-2xl font-bold text-foreground">
          Your cart is empty
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Explore available
          companions and accessories
          and add something to your
          cart.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-primary transition-[transform,opacity] duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transform-none"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}

function CartLoading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="animate-pulse">
        <div className="h-3 w-28 rounded bg-surface-subtle" />

        <div className="mt-3 h-9 w-56 rounded-lg bg-surface-subtle" />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
          <div className="space-y-4">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-[155px] rounded-2xl bg-surface-subtle"
                />
              )
            )}
          </div>

          <div className="h-[360px] rounded-3xl bg-surface-subtle" />
        </div>
      </div>
    </div>
  );
}
