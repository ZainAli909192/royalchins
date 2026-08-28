"use client";

import Image from "next/image";
import Link from "next/link";
import { PackageOpen, PawPrint, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type ProductCardProps = {
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  price: number;
  stock: number;
  shortMeta?: string;
};

export function ProductCard({
  slug,
  name,
  image,
  type,
  price,
  stock,
  shortMeta,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 2;

  const productHref = `/products/${slug}`;

  const FallbackIcon =
    type === "Animal" ? PawPrint : PackageOpen;

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <Link
        href={productHref}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <div className="relative h-[120px] overflow-hidden bg-surface-subtle sm:h-[165px]">
          {!imageFailed ? (
            <Image
              src={image}
              alt={name}
              fill
              unoptimized
              sizes="(max-width: 639px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImageFailed(true)}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-primary">
              <FallbackIcon
                className="h-7 w-7"
                strokeWidth={1.8}
              />
            </div>
          )}

          <span className="absolute left-2 top-2 rounded-full bg-background/95 px-2 py-1 text-[10px] font-bold text-foreground shadow-sm">
            {type}
          </span>
        </div>
      </Link>

      <div className="p-3 sm:p-4">
        <Link
          href={productHref}
          className="block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <h3 className="line-clamp-1 text-sm font-bold text-foreground sm:text-base">
            {name}
          </h3>
        </Link>

        {shortMeta && (
          <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground sm:text-xs">
            {shortMeta}
          </p>
        )}

        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground sm:text-base">
              AED {price.toLocaleString()}
            </p>

            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isOutOfStock
                    ? "bg-error"
                    : isLowStock
                      ? "bg-warning"
                      : "bg-success"
                }`}
              />

              <span
                className={`text-[10px] font-semibold sm:text-[11px] ${
                  isOutOfStock
                    ? "text-error"
                    : isLowStock
                      ? "text-warning"
                      : "text-success"
                }`}
              >
                {isOutOfStock
                  ? "Out of stock"
                  : isLowStock
                    ? `Only ${stock} left`
                    : `${stock} in stock`}
              </span>
            </div>
          </div>

          {type === "Accessory" && (
            <Button
              type="button"
              variant="primary"
              size="icon"
              disabled={isOutOfStock}
              aria-label={`Add ${name} to cart`}
              className="h-9 w-9 shrink-0 rounded-xl sm:h-10 sm:w-10"
            >
              <ShoppingCart
                className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                strokeWidth={2}
              />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}