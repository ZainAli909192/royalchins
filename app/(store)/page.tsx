import { CategoryCards } from "@/components/store/browse/category-cards";
import { ProductCard } from "@/components/store/browse/product-card";

const products = [
  {
    slug: "white-chinchilla",
    name: "White Chinchilla",
    image: "/images/products/white-chinchilla.png",
    type: "Animal" as const,
    category: "Chinchillas",
    price: 1400,
    stock: 2,
    shortMeta: "Male • 8 months",
  },
  {
    slug: "guinea-pig-brown",
    name: "Brown Guinea Pig",
    image: "/images/products/guinea-pig-brown.png",
    type: "Animal" as const,
    category: "Guinea Pigs",
    price: 650,
    stock: 5,
    shortMeta: "Female • 6 months",
  },
  {
    slug: "micro-squirrel",
    name: "Micro Squirrel",
    image: "/images/products/micro-squirrel.png",
    type: "Animal" as const,
    category: "Micro Squirrels",
    price: 1200,
    stock: 0,
    shortMeta: "Male • 7 months",
  },
  {
    slug: "premium-cage",
    name: "Premium Cage",
    image: "/images/products/premium-cage.png",
    type: "Accessory" as const,
    category: "Housing & Cages",
    price: 420,
    stock: 6,
    shortMeta: "Large habitat",
  },
];

export default function BrowsePage() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section>
        <p className="text-sm font-semibold text-primary">
          Royal Chins
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Find Your Companion
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Browse available animals and accessories.
        </p>
      </section>

      <CategoryCards />

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Available Now
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Featured Products
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              {...product}
            />
          ))}
        </div>
      </section>
    </div>
  );
}