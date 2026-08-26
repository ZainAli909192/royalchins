"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  PackageOpen,
  PawPrint,
  ShoppingCart,
} from "lucide-react";
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
  const router = useRouter();

  const [imageFailed, setImageFailed] =
    useState(false);

  const isOutOfStock = stock === 0;

  const isLowStock =
    stock > 0 && stock <= 2;

  const productHref =
    type === "Animal"
      ? `/animals/${slug}`
      : `/accessories/${slug}`;

  const ProductFallbackIcon =
    type === "Animal"
      ? PawPrint
      : PackageOpen;

  const TypeIcon = type === "Animal" ? PawPrint : PackageOpen;

  const stockLabel = isOutOfStock
    ? "Out of stock"
    : isLowStock
      ? `Only ${stock} left`
      : "In stock";

  const stockColor = isOutOfStock
    ? "text-error"
    : isLowStock
      ? "text-warning"
      : "text-success";

  const stockDot = isOutOfStock
    ? "bg-error"
    : isLowStock
      ? "bg-warning"
      : "bg-success";

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg focus-within:border-primary/40 focus-within:shadow-lg motion-reduce:transform-none motion-reduce:transition-none">
      <Link
        href={productHref}
        className="relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <div className="relative aspect-[5/4] overflow-hidden bg-surface-subtle sm:aspect-[4/3]">
          {!imageFailed ? (
            <Image
              src={image}
              alt={`Photo of ${name}`}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImageFailed(true)}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-surface-subtle text-primary"
              role="img"
              aria-label={`${name} image unavailable`}
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border sm:h-20 sm:w-20">
                <ProductFallbackIcon className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.6} />
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/20 via-transparent to-transparent" />

          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-background/70 bg-background/95 px-2.5 py-1.5 text-[11px] font-bold text-foreground shadow-sm backdrop-blur-sm sm:left-4 sm:top-4 sm:text-xs">
            <TypeIcon aria-hidden="true" className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            {type}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <Link
          href={productHref}
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-foreground transition-colors duration-200 hover:text-primary sm:text-lg sm:leading-6">
            {name}
          </h3>
        </Link>

        {shortMeta && (
          <p className="mt-1 line-clamp-1 text-xs leading-5 text-muted-foreground sm:text-sm">
            {shortMeta}
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="border-t border-border pt-3 sm:pt-4">
            <div className="lg:flex lg:items-center lg:justify-between lg:gap-3">
              <div className="min-w-0">
                <p className="text-base font-bold tabular-nums tracking-tight text-foreground sm:text-xl">
                  <span className="mr-1 text-[0.65em] font-semibold text-muted-foreground">AED</span>
                  {price.toLocaleString()}
                </p>

                <div className={`mt-1.5 flex items-center gap-1.5 text-[11px] font-bold sm:text-xs ${stockColor}`}>
                  <span aria-hidden="true" className={`h-2 w-2 rounded-full ${stockDot}`} />
                  {stockLabel}
                </div>
              </div>

              <div className="mt-3 flex shrink-0 items-center justify-end gap-2 sm:mt-4 lg:mt-0">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => router.push(productHref)}
                  aria-label={`View ${name}`}
                  title="View details"
                  className="h-11 w-11 rounded-xl !bg-transparent shadow-none hover:!border-primary-hover hover:!bg-transparent hover:!text-primary-hover active:!bg-transparent"
                >
                  <Eye className="h-5 w-5" strokeWidth={2} />
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="icon"
                  disabled={isOutOfStock}
                  aria-label={`Add ${name} to cart`}
                  title={isOutOfStock ? "Out of stock" : "Add to cart"}
                  className="h-11 w-11 rounded-xl"
                >
                  <ShoppingCart className="h-5 w-5" strokeWidth={2} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
