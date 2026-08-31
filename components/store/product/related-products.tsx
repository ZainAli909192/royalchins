"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PackageOpen,
  PawPrint,
} from "lucide-react";
import { useState } from "react";

type RelatedProduct = {
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  price: number;
  shortMeta?: string;
};

type RelatedProductsProps = {
  title: string;
  products: RelatedProduct[];
};

export function RelatedProducts({
  title,
  products,
}: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-4 sm:mb-5">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <RelatedProductCard
            key={product.slug}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

function RelatedProductCard({
  product,
}: {
  product: RelatedProduct;
}) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const productHref =
    `/product/${product.slug}`;

  const FallbackIcon =
    product.type === "Animal"
      ? PawPrint
      : PackageOpen;

  return (
    <Link
      href={productHref}
      className="group overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative h-[120px] overflow-hidden bg-surface-subtle sm:h-[165px]">
        {!imageFailed ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() =>
              setImageFailed(true)
            }
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
          {product.type}
        </span>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="line-clamp-1 text-sm font-bold text-foreground sm:text-base">
          {product.name}
        </h3>

        {product.shortMeta && (
          <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground sm:text-xs">
            {product.shortMeta}
          </p>
        )}

        <p className="mt-2 text-sm font-bold text-foreground sm:text-base">
          AED{" "}
          {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
