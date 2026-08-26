"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Animals",
    href: "/animals",
    image: "/images/categories/animals.png",
    description:
      "Explore our available companions",
  },
  {
    name: "Accessories",
    href: "/accessories",
    image: "/images/categories/accessories.png",
    description:
      "Food, habitats, essentials & more",
  },
];

export function CategoryCards() {
  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Explore
        </p>

        <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Browse Categories
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-subtle sm:aspect-[16/7]">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 sm:p-5 lg:p-6">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-secondary-foreground sm:text-xl lg:text-2xl">
                    {category.name}
                  </h3>

                  <p className="mt-1 hidden text-sm text-secondary-foreground/80 sm:block">
                    {category.description}
                  </p>
                </div>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-secondary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-11 sm:w-11">
                  <ArrowUpRight
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    strokeWidth={2.2}
                  />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}