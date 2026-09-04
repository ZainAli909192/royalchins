"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const companionImages = [
  "/home_animals/ctadesktop.png",
  "/home_animals/1.png",
  "/home_animals/3.png",
   "/home_animals/4.png",
      "/home_animals/5.png",

];

export default function CompanionStorySection() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage(
        (current) =>
          (current + 1) % companionImages.length
      );
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-3xl bg-white">
      <div className="grid min-h-[500px] lg:grid-cols-2">
        {/* Content */}
        <div className="flex items-center bg-white px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16 xl:px-16">
          <div className="w-full max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6F3CC3] sm:text-xs">
              Royal Chins
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-[1.08] tracking-tight text-black sm:text-4xl lg:text-[42px] xl:text-5xl">
              More Than a Pet,
              <br className="hidden sm:block" />{" "}
              A Little Companion
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-black/60 sm:text-base">
              Every little companion has its own
              personality, charm and story. At Royal
              Chins, we help you discover animals
              that can become a special part of your
              everyday life.
            </p>
          </div>
        </div>

        {/* Rotating Images */}
        <div className="relative h-[360px] overflow-hidden bg-[#f7f7f7] sm:h-[440px] lg:h-auto lg:min-h-[500px]">
          {companionImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt="Royal Chins companion"
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={`object-cover object-center transition-all duration-700 ease-in-out ${
                activeImage === index
                  ? "scale-100 opacity-100"
                  : "scale-[1.02] opacity-0"
              }`}
            />
          ))}

          {/* Desktop blend */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-24 bg-gradient-to-l from-transparent to-white lg:block"
          />

          {/* Mobile top blend */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-t from-transparent to-white lg:hidden"
          />
        </div>
      </div>
    </section>
  );
}