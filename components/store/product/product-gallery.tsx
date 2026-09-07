"use client";

import Image from "next/image";
import { ChevronDown, ChevronUp, ImageOff, Video } from "lucide-react";
import { useState } from "react";

type ProductGalleryProps = {
  name: string;
  images: string[];
  videoUrl?: string | null;
};

type GalleryMedia = { kind: "image" | "video"; url: string };

export function ProductGallery({ name, images, videoUrl }: ProductGalleryProps) {
  const media: GalleryMedia[] = [
    ...images.map((url) => ({ kind: "image" as const, url })),
    ...(videoUrl ? [{ kind: "video" as const, url: videoUrl }] : []),
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const visibleMedia = media.slice(0, 6);
  const activeMedia = media[activeIndex] ?? media[0];

  const handleImageError = (index: number) => {
    setFailedImages((current) => current.includes(index) ? current : [...current, index]);
  };
  const goPrevious = () => setActiveIndex((current) => current === 0 ? media.length - 1 : current - 1);
  const goNext = () => setActiveIndex((current) => current === media.length - 1 ? 0 : current + 1);

  if (!media.length || !activeMedia) {
    return <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-border bg-surface-subtle text-muted-foreground"><div className="text-center"><ImageOff className="mx-auto h-8 w-8" /><p className="mt-2 text-sm font-semibold">No media available</p></div></div>;
  }

  const thumbnail = (item: GalleryMedia, index: number, mobile = false) => {
    const active = activeIndex === index;
    const failed = failedImages.includes(index);
    const dimension = mobile ? "h-16 w-16" : "h-[72px] w-[72px]";

    return (
      <button
        key={`${item.kind}-${item.url}-${index}-${mobile ? "mobile" : "desktop"}`}
        type="button"
        onClick={() => setActiveIndex(index)}
        aria-label={`View ${name} ${item.kind === "video" ? "video" : `image ${index + 1}`}`}
        aria-current={active ? "true" : undefined}
        className={`relative ${dimension} shrink-0 overflow-hidden rounded-xl border bg-surface-subtle transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${active ? "border-primary ring-2 ring-primary/15" : "border-border hover:border-primary/40"}`}
      >
        {item.kind === "video" ? <><video src={item.url} muted preload="metadata" playsInline className="h-full w-full object-cover" /><span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white"><Video className="h-5 w-5" aria-hidden="true" /></span></> : !failed ? <Image src={item.url} alt={`${name} thumbnail ${index + 1}`} fill unoptimized sizes={mobile ? "64px" : "72px"} onError={() => handleImageError(index)} className="object-cover" /> : <span className="flex h-full w-full items-center justify-center text-muted-foreground"><ImageOff className="h-5 w-5" /></span>}
      </button>
    );
  };

  return (
    <div className="grid gap-3 lg:grid-cols-[78px_minmax(0,1fr)]">
      <div className="hidden lg:flex lg:flex-col lg:items-center">
        <button type="button" onClick={goPrevious} aria-label="Previous media" className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"><ChevronUp className="h-4 w-4" /></button>
        <div className="space-y-2">{visibleMedia.map((item, index) => thumbnail(item, index))}</div>
        <button type="button" onClick={goNext} aria-label="Next media" className="mt-2 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"><ChevronDown className="h-4 w-4" /></button>
      </div>
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-surface-subtle shadow-sm">
          {activeMedia.kind === "video" ? <video src={activeMedia.url} controls playsInline preload="metadata" className="h-full w-full bg-black object-contain" aria-label={`${name} product video`} /> : !failedImages.includes(activeIndex) ? <Image src={activeMedia.url} alt={`${name} image ${activeIndex + 1}`} fill priority unoptimized sizes="(max-width: 1024px) 100vw, 50vw" onError={() => handleImageError(activeIndex)} className="object-cover" /> : <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground" role="img" aria-label={`${name} image unavailable`}><ImageOff className="h-10 w-10" /><p className="mt-3 text-sm font-semibold">Image unavailable</p></div>}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">{visibleMedia.map((item, index) => thumbnail(item, index, true))}</div>
        <div className="mt-3 flex justify-center gap-1.5 lg:hidden">{media.map((item, index) => <button key={`${item.kind}-dot-${index}`} type="button" onClick={() => setActiveIndex(index)} aria-label={`Go to ${item.kind === "video" ? "video" : `image ${index + 1}`}`} className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${activeIndex === index ? "w-5 bg-primary" : "w-1.5 bg-border"}`} />)}</div>
      </div>
    </div>
  );
}
