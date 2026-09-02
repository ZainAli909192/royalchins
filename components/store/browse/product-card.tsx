"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PackageOpen,
  PawPrint,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

type ProductCardProps = {
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  price: number;
  stock: number;
  isSold?: boolean;
  shortMeta?: string;
};

export function ProductCard({
  slug,
  name,
  image,
  type,
  price,
  stock,
  isSold = false,
  shortMeta,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const isPet = type === "Animal";
  const isOutOfStock = !isPet && stock === 0;
  const isUnavailable = isPet ? isSold : isOutOfStock;
  const isLowStock = stock > 0 && stock <= 2;

  const productHref = `/product/${slug}`;

  const FallbackIcon =
    type === "Animal"
      ? PawPrint
      : PackageOpen;

  const stockLabel = isPet && isSold
    ? "Sold"
    : isOutOfStock
    ? "Out of Stock"
    : isLowStock
      ? `Only ${stock} left`
      : `${stock} In Stock`;

  const stockTextColor = isUnavailable
    ? "text-error"
    : isLowStock
      ? "text-warning"
      : "text-success";

  const stockDotColor = isUnavailable
    ? "bg-error"
    : isLowStock
      ? "bg-warning"
      : "bg-success";

  return (
    <article className="group/card flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-within:border-primary/30 focus-within:shadow-md motion-reduce:transform-none motion-reduce:transition-none">
      
      {/* Product Image */}
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
              className="object-cover transition-transform duration-300 group-hover/card:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-surface-subtle text-primary"
              role="img"
              aria-label={`${name} image unavailable`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border sm:h-16 sm:w-16">
                <FallbackIcon
                  className="h-6 w-6 sm:h-8 sm:w-8"
                  strokeWidth={1.8}
                />
              </span>
            </div>
          )}

          {/* Product Type */}
          <span className="absolute left-2.5 top-2.5 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-bold text-foreground shadow-sm sm:left-3 sm:top-3 sm:text-[11px]">
            {isPet ? "Pet" : type}
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        
        {/* Name */}
        <Link
          href={productHref}
          className="block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <h3 className="line-clamp-1 text-sm font-bold leading-5 text-muted-foreground transition-colors duration-200 hover:text-primary sm:text-base">
            {name}
          </h3>
        </Link>

        {/* Short Meta */}
        {shortMeta && (
          <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-muted-foreground sm:text-sm sm:leading-5">
            {shortMeta}
          </p>
        )}

        {/* Price + Cart */}
        <div className="mt-auto pt-3 sm:pt-4">
          <div className="flex items-end justify-between gap-2">
            
            {/* Price + Stock */}
            <div className="min-w-0">
              <p className="whitespace-nowrap text-sm font-bold text-muted-foreground sm:text-base">
                AED {price.toLocaleString()}
              </p>

              {/* Stock */}
              <div
                className={`mt-1.5 flex items-center gap-1.5 ${stockTextColor}`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 shrink-0 rounded-full sm:h-2 sm:w-2 ${stockDotColor}`}
                />

                <span className="line-clamp-1 text-[10px] font-semibold sm:text-xs">
                  {stockLabel}
                </span>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </article>
  );
}
