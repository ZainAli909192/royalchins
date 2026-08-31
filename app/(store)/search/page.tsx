import Image from "next/image";
import Link from "next/link";
import {
  PackageOpen,
  PawPrint,
  Search,
} from "lucide-react";

import { listStoreProducts } from "@/lib/products/product-store";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    type?: "Animal" | "Accessory";
  }>;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  type: "Animal" | "Accessory";
  category: string;
  price: number;
  shortMeta?: string;
};

const legacyProducts: Product[] = [
  {
    id: "white-chinchilla",
    slug: "white-chinchilla",
    name: "White Chinchilla",
    image: "/animals/1.png",
    type: "Animal",
    category: "Chinchillas",
    price: 1400,
    shortMeta: "Male • 8 months",
  },
  {
    id: "grey-chinchilla",
    slug: "grey-chinchilla",
    name: "Grey Chinchilla",
    image: "/animals/4.png",
    type: "Animal",
    category: "Chinchillas",
    price: 1350,
    shortMeta: "Female • 7 months",
  },
  {
    id: "black-velvet-chinchilla",
    slug: "black-velvet-chinchilla",
    name: "Black Velvet Chinchilla",
    image: "/animals/2.png",
    type: "Animal",
    category: "Chinchillas",
    price: 1550,
    shortMeta: "Male • 9 months",
  },
  {
    id: "american-guinea-pig",
    slug: "american-guinea-pig",
    name: "American Guinea Pig",
    image: "/animals/6.png",
    type: "Animal",
    category: "Guinea Pigs",
    price: 450,
    shortMeta: "Friendly companion",
  },
  {
    id: "abyssinian-guinea-pig",
    slug: "abyssinian-guinea-pig",
    name: "Abyssinian Guinea Pig",
    image: "/animals/7.png",
    type: "Animal",
    category: "Guinea Pigs",
    price: 500,
    shortMeta: "Playful companion",
  },
  {
    id: "brown-micro-squirrel",
    slug: "brown-micro-squirrel",
    name: "Brown Micro Squirrel",
    image: "/animals/8.png",
    type: "Animal",
    category: "Micro Squirrels",
    price: 950,
    shortMeta: "Small active companion",
  },
  {
    id: "premium-chinchilla-cage",
    slug: "premium-chinchilla-cage",
    name: "Premium Chinchilla Cage",
    image: "/animals/3.png",
    type: "Accessory",
    category: "Cages",
    price: 650,
    shortMeta: "Large premium habitat",
  },
  {
    id: "wooden-hideout",
    slug: "wooden-hideout",
    name: "Wooden Hideout",
    image: "/animals/5.png",
    type: "Accessory",
    category: "Habitats",
    price: 75,
    shortMeta: "Natural wood shelter",
  },
];

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params =
    await searchParams;

  const query =
    params.q?.trim() ?? "";
  const type = params.type;

  const normalizedQuery =
    query.toLowerCase();

  const products: Product[] = (await listStoreProducts()).map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0]?.url ?? "/logo.png",
    type: product.type,
    category: product.category.name,
    price: Number(product.salePrice ?? product.regularPrice),
    shortMeta: product.type === "Animal"
      ? [product.gender, product.age].filter(Boolean).join(" • ")
      : product.shortDescription,
  }));

  const results =
    normalizedQuery || type
      ? products.filter(
          (product) => {
            if (type && product.type !== type) return false;
            const searchableText = [
              product.name,
              product.type,
              product.category,
              product.shortMeta ?? "",
            ]
              .join(" ")
              .toLowerCase();

            return searchableText.includes(
              normalizedQuery
            );
          }
        )
      : [];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          Search
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Search results
        </h1>

        {(query || type) && (
          <p className="mt-3 text-sm text-muted-foreground">
            Showing results for{" "}
            <span className="font-semibold text-foreground">
              {query ? `“${query}”` : type === "Animal" ? "Animals" : "Accessories"}
            </span>
          </p>
        )}
      </div>

      {!query && !type ? (
        <EmptySearch />
      ) : results.length === 0 ? (
        <NoResults
          query={query}
        />
      ) : (
        <>
          <div className="mt-7 flex items-center justify-between gap-4 border-b border-border pb-4">
            <p className="text-sm font-semibold text-foreground">
              {results.length}{" "}
              {results.length === 1
                ? "result"
                : "results"}{" "}
              found
            </p>

            <Link
              href="/"
              className="text-sm font-semibold text-primary transition-opacity hover:opacity-80"
            >
              Browse All
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {results.map(
              (product) => (
                <SearchProductCard
                  key={product.id}
                  product={product}
                />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SearchProductCard({
  product,
}: {
  product: Product;
}) {
  const TypeIcon =
    product.type === "Animal"
      ? PawPrint
      : PackageOpen;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-border bg-background transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-subtle">
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/95 px-2 py-1 text-[10px] font-bold text-primary shadow-sm backdrop-blur">
          <TypeIcon
            aria-hidden="true"
            className="h-3 w-3"
          />

          {product.type}
        </span>
      </div>

      <div className="p-3 sm:p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {product.category}
        </p>

        <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-foreground sm:text-base">
          {product.name}
        </h2>

        {product.shortMeta && (
          <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground sm:text-xs">
            {product.shortMeta}
          </p>
        )}

        <p className="mt-3 text-base font-bold text-primary sm:text-lg">
          AED{" "}
          {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function EmptySearch() {
  return (
    <div className="mt-8 flex min-h-[400px] items-center justify-center rounded-3xl border border-border bg-background p-6 text-center">
      <div className="max-w-md">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Search className="h-6 w-6" />
        </span>

        <h2 className="mt-5 text-xl font-bold text-foreground">
          Start searching
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Search for animals,
          accessories, categories,
          colors or product names.
        </p>
      </div>
    </div>
  );
}

function NoResults({
  query,
}: {
  query: string;
}) {
  return (
    <div className="mt-8 flex min-h-[400px] items-center justify-center rounded-3xl border border-border bg-background p-6 text-center">
      <div className="max-w-md">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Search className="h-6 w-6" />
        </span>

        <h2 className="mt-5 text-xl font-bold text-foreground">
          No results found
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We couldn&apos;t find
          anything matching{" "}
          <span className="font-semibold text-foreground">
            “{query}”
          </span>
          .
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  );
}
