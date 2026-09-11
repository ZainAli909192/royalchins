"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const brands = [
  {
    name: "Science Selective",
    src: "/brands/selective.png",
  },
  {
    name: "Vetafarm",
    src: "/brands/vetafarm.png",
  },
  {
    name: "MidWest",
    src: "/brands/midwest.png",
  },
  {
    name: "Exotic Nutrition",
    src: "/brands/exotic.png",
  },
  {
    name: "Pawise",
    src: "/brands/pawis.png",
  },
  {
    name: "Oxbow",
    src: "/brands/oxbow.png",
  },
  {
    name: "Mazuri",
    src: "/brands/mazuri.png",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function BrandsSection() {
  return (
    <section className="overflow-hidden bg-background py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-primary sm:w-14" />

            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary sm:text-sm">
              Trusted Brands
            </p>

            <span className="h-px w-10 bg-primary sm:w-14" />
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Brands we{" "}
            <span className="text-primary">
              work with
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            We work with trusted animal care and nutrition brands to bring
            carefully selected products for your companions.
          </p>
        </motion.div>

        {/* Brand Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
        >
          {brands.map((brand) => (
            <motion.div
              key={brand.name}
              variants={itemVariants}
              whileHover={{
                y: -5,
                scale: 1.02,
              }}
              transition={{
                duration: 0.25,
              }}
              className="group"
            >
              <div className="flex min-h-[120px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm transition-shadow duration-300 group-hover:shadow-md sm:min-h-[140px] sm:p-5">
                <div className="relative h-[70px] w-full sm:h-[82px]">
                  <Image
                    src={brand.src}
                    alt={brand.name}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}