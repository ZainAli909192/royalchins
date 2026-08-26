"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
} from "lucide-react";

type ProductCardProps = {
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  category: string;
  price: number;
  stock: number;
  shortMeta?: string;
};

export function ProductCard({
  slug,
  name,
  image,
  type,
  category,
  price,
  stock,
  shortMeta,
}: ProductCardProps) {
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 2;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
      <Link
        href={`/products/${slug}`}
        className="block"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-subtle">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />

          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">
              {type}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-3 sm:p-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">
            {category}
          </p>

          <Link
            href={`/products/${slug}`}
            className="mt-1 block"
          >
            <h3 className="line-clamp-1 text-sm font-bold text-foreground sm:text-base">
              {name}
            </h3>
          </Link>

          {shortMeta && (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {shortMeta}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-base font-bold text-foreground sm:text-lg">
              AED {price.toLocaleString()}
            </p>

            <div className="mt-1">
              {isOutOfStock ? (
                <span className="text-xs font-semibold text-error">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-xs font-semibold text-warning">
                  Only {stock} left
                </span>
              ) : (
                <span className="text-xs font-semibold text-success">
                  In Stock
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            aria-label={`Add ${name} to cart`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary-hover active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart
              className="h-5 w-5"
              strokeWidth={2}
            />
          </button>
        </div>

        <Link
          href={`/products/${slug}`}
          className="mt-3 flex h-10 items-center justify-center rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}