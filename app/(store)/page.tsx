"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { CategoryCards } from "@/components/store/browse/category-cards";
import {
  type ProductFilter,
  type StoreCategory,
} from "@/components/store/browse/product-type-filter";

import { ProductCard } from "@/components/store/browse/product-card";
import { BrowseHeader } from "@/components/store/browse/browse-header";
import { FeaturedProducts } from "@/components/store/browse/featured-products";
import { AdminPageLoader } from "@/components/admin/shared/admin-page-loader";
import FinalCTA from "@/components/store/layout/finalcta";
import CompanionStorySection from "@/components/store/layout/companion-story-section";

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
  isSold: boolean;
};

export default function BrowsePage() {
  const [products, setProducts] =
    useState<StoreProduct[]>([]);

  const [productsLoaded, setProductsLoaded] =
    useState(false);

  const [categories, setCategories] =
    useState<StoreCategory[]>([]);

  const [showAllCategories, setShowAllCategories] =
    useState(false);

  const [
    filter,
    setFilter,
  ] =
    useState<ProductFilter>(
      "all"
    );

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
              isSold: boolean;
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

              isSold:
                product.isSold,
            })
          )
        )
      )
      .catch(() =>
        setProducts([])
      )
      .finally(() =>
        setProductsLoaded(true)
      );
  }, []);

  useEffect(() => {
    fetch("/api/store/categories")
      .then((response) => response.ok ? response.json() : [])
      .then((items: StoreCategory[]) => setCategories(items))
      .catch(() => setCategories([]));
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
  };

  const visibleCategories = useMemo(
    () => showAllCategories
      ? categories
      : [
          ...categories.filter((category) => category.type === "Animal").slice(0, 3),
          ...categories.filter((category) => category.type === "Accessory").slice(0, 3),
        ],
    [categories, showAllCategories]
  );

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
        <section aria-labelledby="shop-by-category-heading" className="hidden md:block">
          <div className="mb-5">
            <h2 id="shop-by-category-heading" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Shop by Category</h2>
            <p className="mt-1 text-sm text-muted-foreground">Explore pets and accessories selected for your home.</p>
          </div>
          {categories.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
              {visibleCategories.map((category) => (
                <button key={category.id} type="button" onClick={() => handleFilterChange(category.slug)} className="group flex w-24 shrink-0 flex-col items-center gap-2 rounded-2xl p-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-28">
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt="" className="h-20 w-20 rounded-full object-cover ring-1 ring-border transition-transform duration-200 group-hover:scale-105 sm:h-24 sm:w-24" />
                  ) : (
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-subtle text-primary ring-1 ring-border sm:h-24 sm:w-24">{category.type === "Animal" ? <span className="text-2xl">🐾</span> : <span className="text-2xl">📦</span>}</span>
                  )}
                  <span className="line-clamp-2 text-sm font-semibold text-foreground">{category.name}</span>
                </button>
              ))}
              {!showAllCategories && categories.length > visibleCategories.length && (
                <button type="button" onClick={() => setShowAllCategories(true)} className="group flex w-24 shrink-0 flex-col items-center gap-2 rounded-2xl p-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-28">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full border border-primary bg-primary/10 text-2xl font-semibold text-primary transition-transform duration-200 group-hover:scale-105 sm:h-24 sm:w-24">+</span>
                  <span className="text-sm font-semibold text-foreground">Show all</span>
                </button>
              )}
            </div>
          ) : (
            <AdminPageLoader label="Loading categories" />
          )}
        </section>
      </Reveal>

      {filter === "all" && <Reveal
        direction="right"
        distance={50}
        delay={0.08}
      >
        {productsLoaded ? (
          <FeaturedProducts
            heading="Featured Accessories"
            description="Hand-picked essentials for your pets."
            products={products.filter(
              (product) =>
                product.type === "Accessory"
            )}
          />
        ) : (
          <AdminPageLoader label="Loading featured products" />
        )}
      </Reveal>}

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
                Our Companion Pets
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {productsLoaded ? (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-foreground">
                      {filteredProducts.length}
                    </span>{" "}
                    companion pets
                  </>
                ) : (
                  "Loading companion pets..."
                )}
              </p>
            </div>
          </Reveal>

        </div>

        {!productsLoaded ? (
          <AdminPageLoader label="Loading companion pets" />
        ) : filteredProducts.length >
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
                    isSold={
                      product.isSold
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
                No companion pet found.
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
        <CompanionStorySection />


        {/* <FinalCTA /> */}
      </Reveal>
    </div>
  );
}
