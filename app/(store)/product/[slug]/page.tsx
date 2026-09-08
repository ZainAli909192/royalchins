import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  ChevronRight,
  Heart,
  PackageOpen,
  PawPrint,
  Truck,
} from "lucide-react";

import { AccessoryDetails } from "@/components/store/product/accessory-details";
import { AnimalDetails } from "@/components/store/product/animal-details";
import { ProductGallery } from "@/components/store/product/product-gallery";
import { PurchasePanel } from "@/components/store/product/purchase-panel";
import { RelatedProducts } from "@/components/store/product/related-products";

import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/store/shared/reveal";

import {
  findStoreProductBySlug,
  listRelatedStoreProducts,
} from "@/lib/products/product-store";
import { absoluteUrl, normalizeDescription, serializeJsonLd } from "@/lib/store/seo";
import CompanionStorySection from "@/components/store/layout/companion-story-section";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const getStoreProduct = cache(findStoreProductBySlug);

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStoreProduct(slug);

  if (!product) {
    return { title: "Product not found", robots: { index: false, follow: false } };
  }

  const isPet = product.type === "Animal";
  // Sold pets are permanently unavailable. Accessories can return to stock and
  // should remain discoverable while their Offer schema reports availability.
  const shouldIndex = !isPet || !product.isSold;
  const title = isPet
    ? `${product.name} – ${product.category.name} in UAE`
    : `${product.name} – ${product.category.name} accessory`;
  const description = normalizeDescription(product.shortDescription || product.description);
  const image = product.images[0]?.url ?? "/logo.png";
  const canonical = `/product/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: shouldIndex, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: [{ url: image, alt: product.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductPageProps) {
  const { slug } =
    await params;

  const product = await getStoreProduct(slug);

  if (!product) {
    notFound();
  }

  const related =
    await listRelatedStoreProducts(
      product.id,
      product.type,
      product.categoryId
    );

  const price = Number(
    product.salePrice ??
      product.regularPrice
  );

  const images =
    product.images.map(
      (image: { url: string }) => image.url
    );

  const reviewCount =
    product.reviews.length;

  const averageRating =
    reviewCount
      ? product.reviews.reduce(
          (sum: number, review: { rating: number }) =>
            sum + review.rating,
          0
        ) / reviewCount
      : 0;

  const isAnimal =
    product.type === "Animal";

  const isUnavailable = isAnimal
    ? product.isSold
    : product.quantity <= 0;

  const productImage = images[0] ?? "/logo.png";
  const productUrl = absoluteUrl(`/product/${product.slug}`);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: normalizeDescription(product.description, 500),
    image: images.length ? images.map(absoluteUrl) : [absoluteUrl("/logo.png")],
    sku: product.sku,
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "AED",
      price: price.toFixed(2),
      availability: `https://schema.org/${isUnavailable ? "OutOfStock" : "InStock"}`,
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Products", item: absoluteUrl("/product") },
      { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
    ],
  };

  const stockLabel = isAnimal
    ? product.isSold
      ? "Sold"
      : "Available"
    : product.quantity <= 0
      ? "Out of stock"
      : product.quantity <= 2
        ? `Only ${product.quantity} left`
        : "In stock";

  const relatedProducts =
    related.map((item: { slug: string; name: string; images: { url: string }[]; type: "Animal" | "Accessory"; salePrice: unknown; regularPrice: unknown; gender: string | null; age: string | null; shortDescription: string }) => ({
      slug:
        item.slug,

      name:
        item.name,

      image:
        item.images[0]
          ?.url ??
        "/logo.png",

      type:
        item.type,

      price: Number(
        item.salePrice ??
          item.regularPrice
      ),

      shortMeta:
        item.type ===
        "Animal"
          ? [
              item.gender,
              item.age,
            ]
              .filter(Boolean)
              .join(" • ")
          : item.shortDescription,
    }));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }} />
      <Reveal
        direction="left"
        distance={35}
      >
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs text-muted-foreground sm:mb-5 sm:gap-2 sm:text-sm"
        >
          <Link
            href="/"
            className="transition-colors hover:text-primary"
          >
            Home
          </Link>

          <ChevronRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />

          <Link
            href={`/product?category=${product.category.slug}`}
            className="transition-colors hover:text-primary"
          >
            {product.category.name}
          </Link>

          <ChevronRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />

          <span className="truncate font-semibold text-foreground">
            {product.name}
          </span>
        </nav>
      </Reveal>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_1.05fr] lg:gap-6">
        <Reveal
          direction="left"
          distance={50}
        >
          <ProductGallery
            name={product.name}
            images={images}
            videoUrl={product.videoUrl}
          />
        </Reveal>

        <Reveal
          direction="right"
          distance={50}
          delay={0.08}
        >
          <div className="flex flex-col">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary sm:px-3 sm:py-1.5 sm:text-xs">
              {isAnimal ? (
                <PawPrint className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <PackageOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}

              {isAnimal ? "Pet" : product.type}
            </span>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:mt-4 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground sm:mt-3 sm:gap-x-4">
              <span>
                {isAnimal
                  ? product.gender ||
                    "Companion"
                  : product.category
                      .name}
              </span>

              {isAnimal &&
                product.age && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

                    <span>
                      {
                        product.age
                      }
                    </span>
                  </>
                )}
            </div>

            <div className="mt-4 flex items-end justify-between gap-3 border-b border-border pb-5 sm:mt-6">
              <p className="text-2xl font-bold text-primary sm:text-3xl">
                AED{" "}
                {price.toLocaleString()}
              </p>

              {!isAnimal && <div
                className={`flex items-center gap-1.5 text-xs font-semibold sm:text-sm ${
                  product.quantity <= 0
                    ? "text-error"
                    : product.quantity <= 2
                      ? "text-warning"
                      : "text-success"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    product.quantity <= 0
                      ? "bg-error"
                      : product.quantity <= 2
                        ? "bg-warning"
                        : "bg-success"
                  }`}
                />

                {stockLabel}
              </div>}
            </div>

            <PurchasePanel
              id={product.id}
              slug={product.slug}
              name={product.name}
              image={
                productImage
              }
              type={product.type}
              price={price}
              stock={
                product.quantity
              }
              isSold={product.isSold}
              shortMeta={
                isAnimal
                  ? [
                      product.gender,
                      product.age,
                    ]
                      .filter(
                        Boolean
                      )
                      .join(" • ")
                  : product.shortDescription
              }
              averageRating={
                averageRating
              }
              reviewCount={
                reviewCount
              }
            />

            <p className="mt-5 text-sm leading-6 text-muted-foreground sm:mt-6 sm:text-base sm:leading-7">
              {product.description}
            </p>
          </div>
        </Reveal>
      </section>

   <RevealGroup
  className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-[1.45fr_1fr_1fr]"
  stagger={0.1}
>
  {/* Animal / Accessory Details */}
  <RevealItem
    direction="up"
    distance={30}
  >
    {isAnimal ? (
      <AnimalDetails
        category={
          product.category.name
        }
        gender={
          product.gender ||
          "Not specified"
        }
        age={
          product.age ||
          "Not specified"
        }
        color={
          product.color ||
          "Not specified"
        }
        weight="Not specified"
        temperament="Not specified"
        availability={
          stockLabel
        }
        origin="UAE Bred"
      />
    ) : (
      <AccessoryDetails
        category={
          product.category.name
        }
        suitableFor={
          product.compatibility ||
          "Not specified"
        }
        size={
          product.size ||
          undefined
        }
        brand={
          product.brand ||
          undefined
        }
        material={
          product.color
            ? `${product.color} finish`
            : undefined
        }
      />
    )}
  </RevealItem>

  {/* Care & Health */}
  <RevealItem
    direction="scale"
    scaleFrom={0.9}
  >
    <InfoCard
      icon={Heart}
      eyebrow="Our promise"
      title="Care & health"
      lines={[
        "What we provide with our pets from Royal Chins ✨",
        "Pet will be trained to use a litter box",
        "Pedigree certificate confirming breed purity",
        "Passport registered under the new owner’s name, including all certified vaccinations according to veterinary protocol",
        "Microchip identification",
        "Full veterinary examination confirming the bunny is free from internal parasites",
      ]}
    />
  </RevealItem>

  {/* Delivery */}
 <RevealItem
  direction="right"
  distance={35}
>
  <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
    {/* Header */}
    <div className="flex items-center gap-3 border-b border-border bg-primary/[0.035] px-5 py-5 sm:px-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Truck className="h-5 w-5" />
      </span>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          Delivered with care
        </p>

        <h2 className="mt-1 text-lg font-bold tracking-tight text-foreground sm:text-xl">
          Delivery information
        </h2>
      </div>
    </div>

    {/* Content */}
    <div className="p-5 sm:p-6">
      <p className="text-sm leading-7 text-muted-foreground sm:text-base">
        UAE-wide delivery is available with safe and comfortable transport.
      </p>

      {/* Highlight */}
      <div className="mt-5 rounded-2xl bg-primary/[0.06] p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
            <Truck className="h-4 w-4" />
          </span>

          <div>
            <p className="text-sm font-bold text-foreground">
              UAE-wide delivery
            </p>

            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              Safe transport across the UAE
            </p>
          </div>
        </div>
      </div>

      {/* Small reassurance */}
      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
        <span className="h-2 w-2 rounded-full bg-primary" />

        <span>
          Comfortable transport for your companion
        </span>
      </div>
    </div>

    {/* Accent */}
    <div className="h-1 w-full bg-primary" />
  </div>
</RevealItem>
</RevealGroup>

{/* About */}
<Reveal
  direction="up"
  distance={30}
  className="mt-7 sm:mt-8"
>
  <section className="border-t border-border pt-6 sm:pt-8">
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <PawPrint className="h-5 w-5" />
      </span>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          About
        </p>

        <h2 className="mt-1 text-lg font-bold text-foreground sm:text-xl">
          {isAnimal
            ? "About this companion"
            : "About this product"}
        </h2>

        <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
          {product.shortDescription}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <Heart className="h-4 w-4 shrink-0" />

          <span>
            Selected with care
          </span>
        </div>
      </div>
    </div>
  </section>
</Reveal>

      <Reveal
        direction="up"
        distance={40}
        className="mt-7 sm:mt-8"
      >
        <RelatedProducts
          title="You may also like"
          products={
            relatedProducts
          }
        />
      </Reveal>
      <div className="mx-auto max-w-[1440px] px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14">
              <CompanionStorySection />
            </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  eyebrow,
  title,
  lines,
}: {
  icon: typeof Heart;
  eyebrow: string;
  title: string;
  lines: string[];
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      {/* Header */}
      <div className="border-b border-border bg-primary/[0.035] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              {eyebrow}
            </p>

            <h2 className="mt-1 text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {title}
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5">
        <div className="space-y-2.5">
          {lines.map((line, index) => (
            <div
              key={line}
              className={[
                "group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors",
                index === 0
                  ? "bg-primary/[0.06]"
                  : "hover:bg-surface-subtle",
              ].join(" ")}
            >
              {/* Number / Marker */}
              <span
                className={[
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary",
                ].join(" ")}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Text */}
              <p
                className={[
                  "min-w-0 text-sm leading-6",
                  index === 0
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-1 w-full bg-primary" />
    </div>
  );
}
