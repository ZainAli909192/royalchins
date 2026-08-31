"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { CategoryCards } from "@/components/store/browse/category-cards";

import {
  ProductTypeFilter,
  type ProductFilter,
} from "@/components/store/browse/product-type-filter";

import { ProductCard } from "@/components/store/browse/product-card";
import { BrowseHeader } from "@/components/store/browse/browse-header";
import { FeaturedProducts } from "@/components/store/browse/featured-products";
import FinalCTA from "@/components/store/layout/finalcta";

import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/store/shared/reveal";

type StoreProduct = {
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  category: string;
  filterCategory: string;
  price: number;
  stock: number;
  shortMeta?: string;
  isFeatured: boolean;
};

export default function BrowsePage() {
  const [products, setProducts] =
    useState<StoreProduct[]>([]);

  const [
    filter,
    setFilter,
  ] =
    useState<ProductFilter>(
      "all"
    );

  const [
    animalMenuOpen,
    setAnimalMenuOpen,
  ] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Unable to load products."
          );
        }

        return response.json();
      })
      .then((items) =>
        setProducts(
          items.map(
            (product: {
              slug: string;
              name: string;
              type:
                | "Animal"
                | "Accessory";
              category: {
                name: string;
                slug: string;
              };
              regularPrice:
                | string
                | number;
              salePrice:
                | string
                | number
                | null;
              quantity: number;
              isFeatured: boolean;
              images: {
                url: string;
              }[];
            }) => ({
              slug:
                product.slug,

              name:
                product.name,

              image:
                product.images[0]
                  ?.url ??
                "/logo.png",

              type:
                product.type,

              category:
                product.category
                  .name,

              filterCategory:
                product.category
                  .slug,

              price: Number(
                product.salePrice ??
                  product.regularPrice
              ),

              stock:
                product.quantity,

              shortMeta:
                product.type ===
                "Animal"
                  ? [
                      product.name,
                      product
                        .category
                        .name,
                    ]
                      .filter(
                        Boolean
                      )
                      .join(
                        " • "
                      )
                  : product
                      .category
                      .name,

              isFeatured:
                product.isFeatured,
            })
          )
        )
      )
      .catch(() =>
        setProducts([])
      );
  }, []);

  const filteredProducts =
    useMemo(() => {
      if (filter === "all") {
        return products;
      }

      if (
        filter === "animals"
      ) {
        return products.filter(
          (product) =>
            product.type ===
            "Animal"
        );
      }

      if (
        filter ===
        "accessories"
      ) {
        return products.filter(
          (product) =>
            product.type ===
            "Accessory"
        );
      }

      return products.filter(
        (product) =>
          product.filterCategory ===
          filter
      );
    }, [filter, products]);

  const handleFilterChange = (
    value: ProductFilter
  ) => {
    setFilter(value);
    setAnimalMenuOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal
        direction="left"
        distance={50}
      >
        <BrowseHeader />
      </Reveal>

      <Reveal
        direction="right"
        distance={50}
        delay={0.08}
      >
        <FeaturedProducts
          products={products.filter(
            (product) =>
              product.isFeatured !==
              false
          )}
        />
      </Reveal>

      <Reveal
        direction="scale"
        scaleFrom={0.92}
      >
        <CategoryCards />
      </Reveal>

      <section>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Reveal
            direction="left"
            distance={45}
          >
            <div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Products
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {
                    filteredProducts.length
                  }
                </span>{" "}
                products
              </p>
            </div>
          </Reveal>

          <Reveal
            direction="right"
            distance={45}
            delay={0.05}
          >
            <ProductTypeFilter
              value={filter}
              onChange={
                handleFilterChange
              }
              animalMenuOpen={
                animalMenuOpen
              }
              onAnimalMenuToggle={() =>
                setAnimalMenuOpen(
                  (current) =>
                    !current
                )
              }
            />
          </Reveal>
        </div>

        {filteredProducts.length >
        0 ? (
          <RevealGroup
            key={filter}
            stagger={0.07}
            delay={0.05}
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
          >
            {filteredProducts.map(
              (product) => (
                <RevealItem
                  key={
                    product.slug
                  }
                  direction="scale"
                  scaleFrom={0}
                  duration={0.55}
                  className="h-full"
                >
                  <ProductCard
                    slug={
                      product.slug
                    }
                    name={
                      product.name
                    }
                    image={
                      product.image
                    }
                    type={
                      product.type
                    }
                    price={
                      product.price
                    }
                    stock={
                      product.stock
                    }
                  />
                </RevealItem>
              )
            )}
          </RevealGroup>
        ) : (
          <Reveal
            key={`empty-${filter}`}
            direction="scale"
            scaleFrom={0.9}
          >
            <div className="rounded-2xl border border-border bg-surface-subtle px-5 py-12 text-center">
              <p className="font-semibold text-foreground">
                No products found.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Try another category.
              </p>
            </div>
          </Reveal>
        )}
      </section>

      <Reveal
        direction="up"
        distance={50}
        duration={0.75}
      >
        <FinalCTA />
      </Reveal>
    </div>
  );
}