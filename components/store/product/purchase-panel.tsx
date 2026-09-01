"use client";

import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ProductReviews } from "@/components/store/product/product-reviews";
import { addToCart } from "@/lib/store/cart-storage";
import { saveCheckout } from "@/lib/store/checkout-storage";

type PurchasePanelProps = {
  id: string;
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  price: number;
  stock: number;
  shortMeta?: string;
  averageRating?: number;
  reviewCount?: number;
};

export function PurchasePanel({
  id,
  slug,
  name,
  image,
  type,
  price,
  stock,
  shortMeta,
  averageRating = 0,
  reviewCount = 0,
}: PurchasePanelProps) {
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isPet = type === "Animal";
  const isOutOfStock = !isPet && stock <= 0;

  const handleDecreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const handleIncreaseQuantity = () => {
    setQuantity((current) =>
      Math.min(stock, current + 1)
    );
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      id,
      slug,
      name,
      image,
      type,
      price,
      quantity: isPet ? 1 : quantity,
      shortMeta,
    });

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    saveCheckout({
      source: "buy-now",
      items: [
        {
          id,
          slug,
          name,
          image,
          type,
          price,
          quantity: isPet ? 1 : quantity,
          shortMeta,
        },
      ],
    });

    router.push("/checkout/auth");
  };

  return (
    <div className="mt-5 border-t border-border pt-5 sm:mt-6 sm:pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          {reviewCount > 0 ? (
            <div className="flex items-center gap-2">
              <ProductReviews averageRating={averageRating} />
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">No reviews yet</span>
          )}
        </div>

        {!isPet && (
        <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-foreground">
          Quantity
        </span>

        <div className="flex h-11 items-center overflow-hidden rounded-xl border border-border bg-background">
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            disabled={
              quantity <= 1 ||
              isOutOfStock
            }
            aria-label="Decrease quantity"
            className="flex h-full w-11 items-center justify-center text-foreground transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus
              aria-hidden="true"
              className="h-4 w-4"
              strokeWidth={2}
            />
          </button>

          <span className="min-w-9 text-center text-sm font-bold tabular-nums text-foreground">
            {isOutOfStock ? 0 : quantity}
          </span>

          <button
            type="button"
            onClick={handleIncreaseQuantity}
            disabled={
              quantity >= stock ||
              isOutOfStock
            }
            aria-label="Increase quantity"
            className="flex h-full w-11 items-center justify-center text-foreground transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus
              aria-hidden="true"
              className="h-4 w-4"
              strokeWidth={2}
            />
          </button>
        </div>
        </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="secondary"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="h-13 w-full rounded-xl border border-transparent text-sm font-bold shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 motion-reduce:transform-none"
        >
          <span className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap">
            <ShoppingCart
              aria-hidden="true"
              className="h-5 w-5 shrink-0"
              strokeWidth={2}
            />

            <span>
              {added
                ? "Added to Cart"
                : "Add to Cart"}
            </span>
          </span>
        </Button>

        <Button
          type="button"
          variant="primary"
          disabled={isOutOfStock}
          onClick={handleBuyNow}
          className="h-13 w-full rounded-xl text-sm font-bold shadow-primary transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 motion-reduce:transform-none"
        >
          <span className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap">
            <span>
              {isOutOfStock
                ? "Out of Stock"
                : "Buy Now"}
            </span>

            {!isOutOfStock && (
              <ArrowRight
                aria-hidden="true"
                className="h-5 w-5 shrink-0"
                strokeWidth={2.2}
              />
            )}
          </span>
        </Button>
      </div>
    </div>
  );
}
