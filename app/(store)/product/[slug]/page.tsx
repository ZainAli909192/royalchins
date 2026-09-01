import Link from "next/link";
import { notFound } from "next/navigation";
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

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailsPage({
  params,
}: ProductPageProps) {
  const { slug } =
    await params;

  const product =
    await findStoreProductBySlug(
      slug
    );

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

  const stockLabel =
    product.quantity <= 0
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
                images[0] ??
                "/logo.png"
              }
              type={product.type}
              price={price}
              stock={
                product.quantity
              }
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
        className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-[0.95fr_1.5fr_1fr_1fr]"
        stagger={0.1}
      >
        <RevealItem
          direction="scale"
          scaleFrom={0.9}
        >
          <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <PawPrint className="h-5 w-5" />
              </span>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  About
                </p>

                <h2 className="mt-0.5 text-base font-bold text-foreground sm:text-lg">
                  {isAnimal
                    ? "About this companion"
                    : "About this product"}
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-muted-foreground sm:leading-7">
              {
                product.shortDescription
              }
            </p>

            <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm font-semibold text-primary">
              <Heart className="h-4 w-4" />
              Selected with care
            </div>
          </div>
        </RevealItem>

        <RevealItem
          direction="up"
          distance={30}
        >
          {isAnimal ? (
            <AnimalDetails
              category={
                product.category
                  .name
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
                product.category
                  .name
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

        <RevealItem
          direction="scale"
          scaleFrom={0.9}
        >
          <InfoCard
            icon={Heart}
            eyebrow="Our promise"
            title="Care & health"
            lines={[
              "Regularly health checked",
              "High quality food & nutrition",
              "Clean & comfortable environment",
              "Care guide provided",
            ]}
          />
        </RevealItem>

        <RevealItem
          direction="right"
          distance={35}
        >
          <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </span>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Delivered with care
                </p>

                <h2 className="mt-0.5 text-base font-bold text-foreground sm:text-lg">
                  Delivery information
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-muted-foreground sm:leading-7">
              UAE-wide delivery is
              available with safe and
              comfortable transport.
            </p>

            <div className="mt-5 rounded-xl bg-surface-subtle p-3.5 text-sm font-bold text-foreground">
              UAE-wide delivery
            </div>
          </div>
        </RevealItem>
      </RevealGroup>

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
    <div className="h-full rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </p>

          <h2 className="mt-0.5 text-base font-bold text-foreground sm:text-lg">
            {title}
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm text-muted-foreground">
        {lines.map((line) => (
          <div
            className="flex gap-2.5"
            key={line}
          >
            <span className="mt-1 h-2 w-2 rounded-full bg-primary" />

            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
