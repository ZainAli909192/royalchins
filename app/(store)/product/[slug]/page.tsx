import Link from "next/link";
import {
  ChevronRight,
  Heart,
  PawPrint,
  Truck,
} from "lucide-react";

import { ProductGallery } from "@/components/store/product/product-gallery";
import { PurchasePanel } from "@/components/store/product/purchase-panel";
import { ProductReviews } from "@/components/store/product/product-reviews";
import { AnimalDetails } from "@/components/store/product/animal-details";
import { RelatedProducts } from "@/components/store/product/related-products";

const animal = {
  slug: "white-chinchilla",
  name: "White Chinchilla",
  category: "Chinchillas",
  gender: "Male",
  age: "8 Months",
  color: "White",
  weight: "450 - 550 g",
  temperament: "Gentle & Curious",
  availability: "In Stock",
  origin: "UAE Bred",
  price: 1400,
  stock: 2,
  description:
    "Beautiful white chinchilla with a gentle temperament. Raised with care, healthy, active and well socialized.",
  about:
    "White Chinchillas are playful, curious, and affectionate little companions. They enjoy exploring their surroundings and gentle interaction, making them a wonderful choice for families and individuals who can give them time and proper care.",
  images: [
    "/animals/1.png",
    "/animals/4.png",
    "/animals/1.png",
    "/animals/4.png",
  ],
};

const relatedCompanions = [
  {
    slug: "grey-chinchilla",
    name: "Grey Chinchilla",
    image: "/animals/4.png",
    type: "Animal" as const,
    price: 1350,
    shortMeta: "Male • 6 months",
  },
  {
    slug: "beige-chinchilla",
    name: "Beige Chinchilla",
    image: "/animals/1.png",
    type: "Animal" as const,
    price: 1250,
    shortMeta: "Female • 7 months",
  },
  {
    slug: "standard-chinchilla",
    name: "Standard Chinchilla",
    image: "/animals/4.png",
    type: "Animal" as const,
    price: 1300,
    shortMeta: "Male • 8 months",
  },
  {
    slug: "white-chinchilla-2",
    name: "White Chinchilla",
    image: "/animals/1.png",
    type: "Animal" as const,
    price: 1400,
    shortMeta: "Female • 6 months",
  },
];

const recommendedAccessories = [
  {
    slug: "premium-chinchilla-cage",
    name: "Chinchilla Cage",
    image: "/animals/3.png",
    type: "Accessory" as const,
    price: 450,
    shortMeta: "Premium habitat",
  },
  {
    slug: "hay-feeder",
    name: "Hay Feeder",
    image: "/animals/5.png",
    type: "Accessory" as const,
    price: 75,
    shortMeta: "Natural wood",
  },
  {
    slug: "chinchilla-food",
    name: "Chinchilla Food",
    image: "/animals/5.png",
    type: "Accessory" as const,
    price: 65,
    shortMeta: "Premium nutrition",
  },
  {
    slug: "wooden-hideout",
    name: "Wooden Hideout",
    image: "/animals/5.png",
    type: "Accessory" as const,
    price: 95,
    shortMeta: "Natural shelter",
  },
];

export default function AnimalDetailsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
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
          href="/?category=chinchillas"
          className="transition-colors hover:text-primary"
        >
          Chinchillas
        </Link>

        <ChevronRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />

        <span className="truncate font-semibold text-foreground">
          {animal.name}
        </span>
      </nav>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_1.05fr] lg:gap-6">
        <ProductGallery
          name={animal.name}
          images={animal.images}
        />

        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary sm:px-3 sm:py-1.5 sm:text-xs">
            <PawPrint className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Animal
          </span>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:mt-4 sm:text-3xl lg:text-4xl">
            {animal.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground sm:mt-3 sm:gap-x-4">
            <span>{animal.gender}</span>

            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

            <span>{animal.age}</span>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3 sm:mt-6">
            <p className="text-2xl font-bold text-primary sm:text-3xl">
              AED {animal.price.toLocaleString()}
            </p>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-warning sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-warning" />
              Only {animal.stock} left
            </div>
          </div>

          <PurchasePanel
            slug={animal.slug}
            stock={animal.stock}
          />

          <p className="mt-5 text-sm leading-6 text-muted-foreground sm:mt-6 sm:text-base sm:leading-7">
            {animal.description}
          </p>

        </div>
      </section>


      <section className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-[0.95fr_1.5fr_1fr_1fr]">
        <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PawPrint aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Meet your companion</p>
              <h2 className="mt-0.5 text-base font-bold text-foreground sm:text-lg">About this companion</h2>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-muted-foreground sm:leading-7">
            {animal.about}
          </p>

          <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm font-semibold text-primary">
            <Heart aria-hidden="true" className="h-4 w-4" />
            Gentle, social & family-ready
          </div>
        </div>

        <AnimalDetails
          category={animal.category}
          gender={animal.gender}
          age={animal.age}
          color={animal.color}
          weight={animal.weight}
          temperament={animal.temperament}
          availability={animal.availability}
          origin={animal.origin}
        />

        <div className="h-full rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Heart aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Our promise</p>
              <h2 className="mt-0.5 text-base font-bold text-foreground sm:text-lg">Care & health</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-muted-foreground">
            <CareLine text="Regularly health checked" />
            <CareLine text="High quality food & nutrition" />
            <CareLine text="Clean & comfortable environment" />
            <CareLine text="Care guide provided" />
          </div>
        </div>

        <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Truck aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Delivered with care</p>
              <h2 className="mt-0.5 text-base font-bold text-foreground sm:text-lg">Delivery information</h2>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-muted-foreground sm:leading-7">
            UAE-wide delivery is available with safe and comfortable transport
            for your companion.
          </p>

          <div className="mt-5 rounded-xl bg-surface-subtle p-3.5">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Truck aria-hidden="true" className="h-4 w-4 text-primary" />
              UAE-wide delivery
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Delivery details are confirmed during checkout.</p>
          </div>
        </div>
      </section>
      <ProductReviews productName={animal.name} />

      <div className="mt-7 sm:mt-8">
        <RelatedProducts
          title="Related Companions"
          products={relatedCompanions}
        />
      </div>

      <div className="mt-7 sm:mt-8">
        <RelatedProducts
          title="Recommended Accessories"
          products={recommendedAccessories}
        />
      </div>
    </div>
  );
}

function CareLine({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3 fill-none stroke-current" strokeWidth="2.2">
          <path d="m3 8 3 3 7-7" />
        </svg>
      </span>
      <span>{text}</span>
    </div>
  );
}
