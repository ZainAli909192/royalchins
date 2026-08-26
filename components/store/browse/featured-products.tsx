"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PackageOpen,
  PawPrint,
} from "lucide-react";
import { useState } from "react";

type FeaturedProduct = {
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  price: number;
  shortMeta?: string;
};

type FeaturedProductsProps = {
  products: FeaturedProduct[];
};

export function FeaturedProducts({
  products,
}: FeaturedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="featured-products-heading"
      className="overflow-hidden"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
         

          <h2
            id="featured-products-heading"
            className="mt-1 text-xl font-bold tracking-tight text-primary sm:text-2xl"
          >
            Featured Products
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Hand-picked companions and essentials.
          </p>
        </div>
      </div>

      <MarqueeRow products={products} />
    </section>
  );
}

type MarqueeRowProps = {
  products: FeaturedProduct[];
};

function MarqueeRow({
  products,
}: MarqueeRowProps) {
  return (
    <div
      className="group relative overflow-hidden pb-2"
      aria-label="Featured products slider"
    >
      <div className="flex w-max animate-featured-marquee-left group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
        {[0, 1].map((copyIndex) => (
          <div
            key={copyIndex}
            aria-hidden={copyIndex === 1 ? true : undefined}
            className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4"
          >
            {products.map((product) => (
              <FeaturedCard
                key={`${product.slug}-${copyIndex}`}
                product={product}
                duplicate={copyIndex === 1}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type FeaturedCardProps = {
  product: FeaturedProduct;
  duplicate?: boolean;
};

function FeaturedCard({
  product,
  duplicate = false,
}: FeaturedCardProps) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const productHref =
    product.type === "Animal"
      ? `/animals/${product.slug}`
      : `/accessories/${product.slug}`;

  const FallbackIcon =
    product.type === "Animal"
      ? PawPrint
      : PackageOpen;

  return (
    <Link
      href={productHref}
      tabIndex={duplicate ? -1 : undefined}
      className="group/card relative w-[170px] shrink-0 overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transform-none motion-reduce:transition-none sm:w-[250px]"
    >
      <div className="relative h-[110px] overflow-hidden bg-surface-subtle sm:h-[165px]">
        {!imageFailed ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 639px) 170px, 250px"
            onError={() =>
              setImageFailed(true)
            }
            className="object-cover transition-transform duration-300 group-hover/card:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
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
        <h3 className="line-clamp-1 text-sm font-bold text-foreground">
          {product.name}
        </h3>

        {product.shortMeta && (
          <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
            {product.shortMeta}
          </p>
        )}

        <p className="mt-2 text-sm font-bold text-muted-foreground">
          AED{" "}
          {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
