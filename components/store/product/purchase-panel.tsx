"use client";

import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type PurchasePanelProps = {
  name?: string;
  slug: string;
  price?: number;
  stock: number;
  averageRating?: number;
  reviewCount?: number;
};

export function PurchasePanel({
  slug,
  stock,
  averageRating = 4.9,
  reviewCount = 124,
}: PurchasePanelProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    console.log("Add to cart", { slug, quantity });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    const params = new URLSearchParams({
      product: slug,
      quantity: String(quantity),
    });

    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="mt-5 border-t border-border pt-5 sm:mt-6 sm:pt-6">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Star
            aria-hidden="true"
            className="h-5 w-5 fill-primary text-primary"
            strokeWidth={1.8}
          />
          <span className="font-bold text-foreground">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">average rating</span>
          <span className="text-muted-foreground/50">•</span>
          <span className="text-muted-foreground">{reviewCount} reviews</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">Quantity</span>
          <div className="flex h-11 items-center overflow-hidden rounded-xl border border-border bg-background">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              aria-label="Decrease quantity"
              className="flex h-full w-11 items-center justify-center text-foreground transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </button>
            <span className="min-w-9 text-center text-sm font-bold tabular-nums text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.min(stock, current + 1))}
              disabled={quantity >= stock || isOutOfStock}
              aria-label="Increase quantity"
              className="flex h-full w-11 items-center justify-center text-foreground transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="secondary"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="flex h-13 w-full items-center justify-center rounded-xl border border-transparent text-sm font-bold shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 motion-reduce:transform-none"
        >
          <span className="flex items-center gap-2.5">
            <ShoppingCart aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
            Add to Cart
          </span>
        </Button>

        <Button
          type="button"
          variant="primary"
          disabled={isOutOfStock}
          onClick={handleBuyNow}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-primary transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 motion-reduce:transform-none"
        >
          <span className="flex items-center gap-2.5">
            Buy Now
            <ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
          </span>
        </Button>
      </div>
    </div>
  );
}
