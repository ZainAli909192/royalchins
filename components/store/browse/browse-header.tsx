"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const heroImages = [
    "/home_animals/ctadesktop.png",

      "/home_animals/5.png",

  "/home_animals/1.png",

  "/home_animals/3.png",
  "/home_animals/4.png",


];

export function BrowseHeader() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage(
        (current) =>
          (current + 1) %
          heroImages.length
      );
    }, 3000);

    return () =>
      window.clearInterval(interval);
  }, []);

  return (
    <section
      aria-label="Royal Chins"
      className="-mx-4 -mt-6 overflow-hidden bg-white sm:mx-0 sm:mt-0 sm:rounded-3xl"
    >
      <div className="grid min-h-[520px] lg:grid-cols-2">
        {/* Rotating animal images */}
        <div className="relative h-[360px] overflow-hidden bg-[#f7f7f7] sm:h-[440px] lg:h-auto lg:min-h-[520px]">
          {heroImages.map(
            (src, index) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={`object-cover object-center transition-all duration-700 ease-in-out ${
                  activeImage === index
                    ? "scale-100 opacity-100"
                    : "scale-[1.02] opacity-0"
                }`}
              />
            )
          )}

          {/* Soft blend into content on desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-r from-transparent to-white lg:block"
          />

          {/* Mobile bottom blend */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white lg:hidden"
          />
        </div>

        {/* Content */}
        <div className="flex items-center bg-white px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16 xl:px-16">
          <div className="w-full max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6F3CC3] sm:text-xs">
              Royal Chins
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-[1.08] tracking-tight text-black sm:text-4xl lg:text-[42px] xl:text-5xl">
              Meet Your New
              <br className="hidden sm:block" />{" "}
              Little Companion
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-black/60 sm:text-base">
              Discover carefully selected
              companions and everything they
              need, all in one place.
            </p>

         

            {/* Slider indicators */}
            <div className="mt-8 flex items-center gap-2">
              {heroImages.map(
                (_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Show hero image ${
                      index + 1
                    }`}
                    onClick={() =>
                      setActiveImage(
                        index
                      )
                    }
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeImage ===
                      index
                        ? "w-8 bg-[#6F3CC3]"
                        : "w-3 bg-black/15 hover:bg-black/30"
                    }`}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
