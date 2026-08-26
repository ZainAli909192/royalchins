"use client";

import { useMemo, useState } from "react";

import { CategoryCards } from "@/components/store/browse/category-cards";

import {
  ProductTypeFilter,
  type ProductFilter,
} from "@/components/store/browse/product-type-filter";

import { ProductCard } from "@/components/store/browse/product-card";
import { BrowseHeader } from "@/components/store/browse/browse-header";
import { FeaturedProducts } from "@/components/store/browse/featured-products";
const products = [
  {
    slug: "white-chinchilla",
    name: "White Chinchilla",
    image:
      "https://images.unsplash.com/photo-1618232118117-98d49b20e2f5?auto=format&fit=crop&w=900&q=80",
    type: "Animal" as const,
    category: "Chinchillas",
    filterCategory: "chinchillas",
    price: 1400,
    stock: 2,
    shortMeta: "Male • 8 months",
  },

  {
    slug: "grey-chinchilla",
    name: " Chinchilla",
    image:
      "/animals/4.png",
    type: "Animal" as const,
    category: "Chinchillas",
    filterCategory: "chinchillas",
    price: 1350,
    stock: 4,
    shortMeta: "Female • 7 months",
  },

  {
    slug: "black-velvet-chinchilla",
    name: "Black Velvet Chinchilla",
    image:
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80",
    type: "Animal" as const,
    category: "Chinchillas",
    filterCategory: "chinchillas",
    price: 1650,
    stock: 1,
    shortMeta: "Male • 9 months",
  },

  {
    slug: "american-guinea-pig",
    name: "American Guinea Pig",
    image:
      "/animals/2.png",
    type: "Animal" as const,
    category: "Guinea Pigs",
    filterCategory: "guinea-pigs",
    price: 450,
    stock: 5,
    shortMeta: "Male • 5 months",
  },

  {
    slug: "abyssinian-guinea-pig",
    name: "Abyssinian Guinea Pig",
    image:
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80",
    type: "Animal" as const,
    category: "Guinea Pigs",
    filterCategory: "guinea-pigs",
    price: 550,
    stock: 2,
    shortMeta: "Female • 6 months",
  },

  {
    slug: "brown-micro-squirrel",
    name: " Micro Squirrel",
    image:
      "https://images.unsplash.com/photo-1507666405895-422eee7d517f?auto=format&fit=crop&w=900&q=80",
    type: "Animal" as const,
    category: "Micro Squirrels",
    filterCategory: "micro-squirrels",
    price: 850,
    stock: 3,
    shortMeta: "Male • 4 months",
  },

  {
    slug: "micro-squirrel",
    name: " Micro Squirrel",
    image:
      "https://images.unsplash.com/photo-1504006833117-8886a355efbf?auto=format&fit=crop&w=900&q=80",
    type: "Animal" as const,
    category: "Micro Squirrels",
    filterCategory: "micro-squirrels",
    price: 900,
    stock: 0,
    shortMeta: "Female • 5 months",
  },

  {
    slug: "premium-chinchilla-cage",
    name: "Premium Chinchilla Cage",
    image:
      "/animals/3.png",
    type: "Accessory" as const,
    category: "Housing & Cages",
    filterCategory: "accessories",
    price: 650,
    stock: 12,
    shortMeta: "Large premium habitat",
  },

  {
    slug: "wooden-hideout",
    name: "Wooden Hideout",
    image:
      "/animals/5.png",
    type: "Accessory" as const,
    category: "Housing & Cages",
    filterCategory: "accessories",
    price: 75,
    stock: 8,
    shortMeta: "Natural wood shelter",
  },

];

export default function BrowsePage() {
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
        filter === "accessories"
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
    }, [filter]);

  const handleFilterChange = (
    value: ProductFilter
  ) => {
    setFilter(value);
    setAnimalMenuOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <BrowseHeader />
    <FeaturedProducts
  products={products}
/>
      <CategoryCards />

      <section>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
        </div>

        {filteredProducts.length >
        0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={
                    product.slug
                  }
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
              )
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface-subtle px-5 py-12 text-center">
            <p className="font-semibold text-foreground">
              No products found.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Try another category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}