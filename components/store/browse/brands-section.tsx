"use client";

import Image from "next/image";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  motion,
  type Variants,
} from "framer-motion";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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

const carouselBrands = [
  ...brands,
  ...brands,
];

const smoothEase: [
  number,
  number,
  number,
  number,
] = [
  0.22,
  1,
  0.36,
  1,
];

const headingVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
};

export function BrandsSection() {
  const trackRef =
    useRef<HTMLDivElement>(null);

  const animationRef =
    useRef<number | null>(null);

  const lastTimeRef =
    useRef<number | null>(null);

  const [isHovered, setIsHovered] =
    useState(false);

  const [
    isClickedPaused,
    setIsClickedPaused,
  ] = useState(false);

  const [
    isTouching,
    setIsTouching,
  ] = useState(false);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const isPaused =
    isHovered ||
    isClickedPaused ||
    isTouching;

  const getCardStep =
    useCallback(() => {
      const track =
        trackRef.current;

      if (!track) return 0;

      const card =
        track.querySelector<HTMLElement>(
          "[data-brand-card]"
        );

      if (!card) return 0;

      const styles =
        window.getComputedStyle(
          track
        );

      const gap =
        parseFloat(
          styles.columnGap ||
            styles.gap ||
            "16"
        ) || 16;

      return (
        card.offsetWidth + gap
      );
    }, []);

  const updateActiveIndex =
    useCallback(() => {
      const track =
        trackRef.current;

      if (!track) return;

      const step =
        getCardStep();

      if (!step) return;

      const index =
        Math.round(
          track.scrollLeft /
            step
        ) % brands.length;

      setActiveIndex(index);
    }, [getCardStep]);

  useEffect(() => {
    const track =
      trackRef.current;

    if (!track) return;

    const animate = (
      time: number
    ) => {
      if (
        lastTimeRef.current ===
        null
      ) {
        lastTimeRef.current =
          time;
      }

      const delta =
        time -
        lastTimeRef.current;

      lastTimeRef.current =
        time;

      if (!isPaused) {
        /*
         * Continuous smooth movement.
         * Increase this slightly if
         * you want faster movement.
         */
        const speed = 0.035;

        track.scrollLeft +=
          delta * speed;

        const halfWidth =
          track.scrollWidth / 2;

        /*
         * Seamless infinite loop.
         */
        if (
          track.scrollLeft >=
          halfWidth
        ) {
          track.scrollLeft -=
            halfWidth;
        }

        updateActiveIndex();
      }

      animationRef.current =
        requestAnimationFrame(
          animate
        );
    };

    animationRef.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      if (
        animationRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      lastTimeRef.current =
        null;
    };
  }, [
    isPaused,
    updateActiveIndex,
  ]);

  const scrollOneCard = (
    direction:
      | "left"
      | "right"
  ) => {
    const track =
      trackRef.current;

    if (!track) return;

    const step =
      getCardStep();

    if (!step) return;

    setIsClickedPaused(true);

    track.scrollBy({
      left:
        direction ===
        "right"
          ? step
          : -step,
      behavior: "smooth",
    });

    window.setTimeout(
      updateActiveIndex,
      450
    );
  };

  const goToBrand = (
    index: number
  ) => {
    const track =
      trackRef.current;

    if (!track) return;

    const step =
      getCardStep();

    if (!step) return;

    setIsClickedPaused(true);
    setActiveIndex(index);

    track.scrollTo({
      left: step * index,
      behavior: "smooth",
    });
  };

  return (
    <section className="overflow-hidden bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          variants={
            headingVariants
          }
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
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
            We work with
            trusted animal care
            and nutrition brands
            to bring carefully
            selected products for
            your companions.
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative mt-9 sm:mt-11"
          onMouseEnter={() =>
            setIsHovered(true)
          }
          onMouseLeave={() =>
            setIsHovered(false)
          }
        >
          {/* Left Button */}
          <button
            type="button"
            aria-label="Previous brands"
            onClick={(event) => {
              event.stopPropagation();

              scrollOneCard(
                "left"
              );
            }}
            className="absolute left-0 top-1/2 z-30 flex h-9 w-9 -translate-x-1/3 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-lg sm:h-10 sm:w-10 lg:-translate-x-1/2"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Right Button */}
          <button
            type="button"
            aria-label="Next brands"
            onClick={(event) => {
              event.stopPropagation();

              scrollOneCard(
                "right"
              );
            }}
            className="absolute right-0 top-1/2 z-30 flex h-9 w-9 translate-x-1/3 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-lg sm:h-10 sm:w-10 lg:translate-x-1/2"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Left fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-7 bg-gradient-to-r from-background to-transparent sm:w-12"
          />

          {/* Right fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-7 bg-gradient-to-l from-background to-transparent sm:w-12"
          />

          {/* Track */}
          <div
            ref={trackRef}
            onClick={() =>
              setIsClickedPaused(
                (current) =>
                  !current
              )
            }
            onTouchStart={() =>
              setIsTouching(true)
            }
            onTouchEnd={() => {
              setIsTouching(false);
              setIsClickedPaused(
                true
              );
            }}
            onScroll={
              updateActiveIndex
            }
            className="flex gap-3 overflow-x-auto px-2 py-3 [scrollbar-width:none] sm:gap-4 sm:px-3 lg:gap-5 [&::-webkit-scrollbar]:hidden"
          >
            {carouselBrands.map(
              (
                brand,
                index
              ) => (
                <motion.div
                  key={`${brand.name}-${index}`}
                  data-brand-card
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.4,
                    ease:
                      smoothEase,
                  }}
                  whileHover={{
                    y: -4,
                  }}
                  className="
                    group
                    w-[140px]
                    shrink-0
                    sm:w-[185px]
                    md:w-[205px]
                    lg:w-[220px]
                    xl:w-[235px]
                  "
                >
                  <div
                    className="
                      flex
                      h-[92px]
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-2xl
                      border
                      border-border
                      bg-white
                      p-3
                      shadow-sm
                      transition-all
                      duration-300
                      group-hover:border-primary/20
                      group-hover:shadow-md
                      sm:h-[115px]
                      sm:p-4
                      md:h-[125px]
                      lg:h-[135px]
                      lg:p-5
                    "
                  >
                    <div className="relative h-[52px] w-full sm:h-[66px] md:h-[72px] lg:h-[78px]">
                      <Image
                        src={
                          brand.src
                        }
                        alt={
                          brand.name
                        }
                        fill
                        sizes="
                          (min-width: 1280px) 235px,
                          (min-width: 1024px) 220px,
                          (min-width: 768px) 205px,
                          (min-width: 640px) 185px,
                          140px
                        "
                        className="object-contain transition-transform duration-300 group-hover:scale-[1.05]"
                      />
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-5 flex items-center justify-center gap-2 sm:mt-6">
          {brands.map(
            (brand, index) => (
              <button
                key={
                  brand.name
                }
                type="button"
                aria-label={`Show ${brand.name}`}
                onClick={() =>
                  goToBrand(index)
                }
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeIndex ===
                  index
                    ? "w-7 bg-primary"
                    : "w-2 bg-primary/20 hover:bg-primary/40"
                }`}
              />
            )
          )}
        </div>

        {/* Resume control when clicked */}
        {isClickedPaused && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setIsClickedPaused(
                  false
                )
              }
              className="text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              Resume autoplay
            </button>
          </div>
        )}
      </div>
    </section>
  );
}