import Link from "next/link";
import {
  ChevronRight,
  Heart,
  PackageCheck,
  PawPrint,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { ProductGallery } from "@/components/store/product/product-gallery";
import { PurchasePanel } from "@/components/store/product/purchase-panel";
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
    

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.95fr_0.55fr] lg:gap-6">
        <ProductGallery
          name={animal.name}
          images={animal.images}
        />

        <div className="flex flex-col">
         

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

          <p className="mt-4 text-sm leading-6 text-muted-foreground sm:mt-6 sm:text-base sm:leading-7">
            {animal.description}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:grid-cols-4 sm:gap-3">
            <TrustItem
              icon={ShieldCheck}
              label="Health Checked"
            />

            <TrustItem
              icon={Heart}
              label="Premium Care"
            />

            <TrustItem
              icon={PackageCheck}
              label="Quality Raised"
            />

            <TrustItem
              icon={Truck}
              label="UAE Delivery"
            />
          </div>

          <div className="mt-5 lg:hidden">
            <PurchasePanel
              name={animal.name}
              slug={animal.slug}
              price={animal.price}
              stock={animal.stock}
            />
          </div>
        </div>

        <div className="hidden lg:block">
          <PurchasePanel
            name={animal.name}
            slug={animal.slug}
            price={animal.price}
            stock={animal.stock}
          />
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-[0.85fr_1.3fr_0.85fr_0.85fr]">
        <div className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground sm:text-lg">
            <PawPrint className="h-5 w-5 text-primary" />
            About this companion
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:mt-4 sm:leading-7">
            {animal.about}
          </p>
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

        <div className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground sm:text-lg">
            <Heart className="h-5 w-5 text-primary" />
            Care & Health
          </h2>

          <div className="mt-3 space-y-2.5 text-sm text-muted-foreground sm:mt-4 sm:space-y-3">
            <CareLine text="Regularly health checked" />
            <CareLine text="High quality food & nutrition" />
            <CareLine text="Clean & comfortable environment" />
            <CareLine text="Care guide provided" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground sm:text-lg">
            <Truck className="h-5 w-5 text-primary" />
            Delivery Information
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:mt-4 sm:leading-7">
            UAE-wide delivery is available with safe and comfortable transport
            for your companion.
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
            <Truck className="h-4 w-4" />
            UAE Wide Delivery
          </div>
        </div>
      </section>

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

function TrustItem({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex min-h-[86px] flex-col items-center justify-center rounded-xl bg-surface-subtle px-2 py-3 text-center sm:min-h-0 sm:px-3 sm:py-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-10 sm:w-10">
        <Icon
          className="h-4 w-4 sm:h-5 sm:w-5"
          strokeWidth={2}
        />
      </span>

      <span className="mt-2 text-[11px] font-semibold leading-4 text-foreground sm:text-xs">
        {label}
      </span>
    </div>
  );
}

function CareLine({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      <span>{text}</span>
    </div>
  );
}