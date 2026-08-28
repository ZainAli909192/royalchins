"use client";

import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  ImageOff,
} from "lucide-react";
import { useState } from "react";

type ProductGalleryProps = {
  name: string;
  images: string[];
};

export function ProductGallery({
  name,
  images,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [failedImages, setFailedImages] =
    useState<number[]>([]);

  const visibleImages = images.slice(0, 5);

  const activeImage =
    images[activeIndex] ?? images[0];

  const activeImageFailed =
    failedImages.includes(activeIndex);

  const handleImageError = (
    index: number
  ) => {
    setFailedImages((current) => {
      if (current.includes(index)) {
        return current;
      }

      return [...current, index];
    });
  };

  const goPrevious = () => {
    setActiveIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  };

  const goNext = () => {
    setActiveIndex((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  };

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-border bg-surface-subtle text-muted-foreground">
        <div className="text-center">
          <ImageOff className="mx-auto h-8 w-8" />

          <p className="mt-2 text-sm font-semibold">
            No images available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[78px_minmax(0,1fr)]">
      {/* =========================
          DESKTOP THUMBNAILS
      ========================== */}
      <div className="hidden lg:flex lg:flex-col lg:items-center">
        <button
          type="button"
          onClick={goPrevious}
          aria-label="Previous image"
          className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-primary"
        >
          <ChevronUp
            className="h-4 w-4"
            strokeWidth={2}
          />
        </button>

        <div className="space-y-2">
          {visibleImages.map(
            (image, index) => {
              const active =
                activeIndex === index;

              const failed =
                failedImages.includes(
                  index
                );

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setActiveIndex(index)
                  }
                  aria-label={`View ${name} image ${
                    index + 1
                  }`}
                  aria-current={
                    active
                      ? "true"
                      : undefined
                  }
                  className={`relative h-[72px] w-[72px] overflow-hidden rounded-xl border bg-surface-subtle transition-all ${
                    active
                      ? "border-primary ring-2 ring-primary/15"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {!failed ? (
                    <Image
                      src={image}
                      alt={`${name} thumbnail ${
                        index + 1
                      }`}
                      fill
                      unoptimized
                      sizes="72px"
                      onError={() =>
                        handleImageError(
                          index
                        )
                      }
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <ImageOff className="h-5 w-5" />
                    </div>
                  )}
                </button>
              );
            }
          )}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next image"
          className="mt-2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-primary"
        >
          <ChevronDown
            className="h-4 w-4"
            strokeWidth={2}
          />
        </button>
      </div>

      {/* =========================
          MAIN IMAGE
      ========================== */}
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-surface-subtle shadow-sm">
          {!activeImageFailed ? (
            <Image
              src={activeImage}
              alt={`${name} image ${
                activeIndex + 1
              }`}
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              onError={() =>
                handleImageError(
                  activeIndex
                )
              }
              className="object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center text-muted-foreground"
              role="img"
              aria-label={`${name} image unavailable`}
            >
              <ImageOff className="h-10 w-10" />

              <p className="mt-3 text-sm font-semibold">
                Image unavailable
              </p>
            </div>
          )}
        </div>

        {/* =========================
            MOBILE / TABLET THUMBS
        ========================== */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {visibleImages.map(
            (image, index) => {
              const active =
                activeIndex === index;

              const failed =
                failedImages.includes(
                  index
                );

              return (
                <button
                  key={`${image}-mobile-${index}`}
                  type="button"
                  onClick={() =>
                    setActiveIndex(index)
                  }
                  aria-label={`View ${name} image ${
                    index + 1
                  }`}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-surface-subtle ${
                    active
                      ? "border-primary ring-2 ring-primary/15"
                      : "border-border"
                  }`}
                >
                  {!failed ? (
                    <Image
                      src={image}
                      alt={`${name} thumbnail ${
                        index + 1
                      }`}
                      fill
                      unoptimized
                      sizes="64px"
                      onError={() =>
                        handleImageError(
                          index
                        )
                      }
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <ImageOff className="h-4 w-4" />
                    </div>
                  )}
                </button>
              );
            }
          )}
        </div>

        {/* Mobile dots */}
        <div className="mt-3 flex justify-center gap-1.5 lg:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() =>
                setActiveIndex(index)
              }
              aria-label={`Go to image ${
                index + 1
              }`}
              className={`h-1.5 rounded-full transition-all ${
                activeIndex === index
                  ? "w-5 bg-primary"
                  : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}