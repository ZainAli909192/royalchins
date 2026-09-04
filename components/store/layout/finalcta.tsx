import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

export default function FinalCTA() {
  return (
    <section aria-labelledby="final-cta-heading" className="w-full">
      <h2 id="final-cta-heading" className="sr-only">
        Healthy Chins, Happy Lives
      </h2>

      <div className="lg:hidden">
        <div className="overflow-hidden rounded-3xl border border-border bg-secondary shadow-md">
          <div className="relative h-60 w-full overflow-hidden bg-surface-subtle sm:h-72">
            <Image
              src="/home_animals/1.png"
              alt="Royal Chins - Healthy Chins, Happy Lives"
              fill
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>

          <div className="px-8 py-8 text-primary-foreground sm:px-9 sm:py-9">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/75">
              <Sparkles aria-hidden="true" className="h-4 w-4 text-primary" strokeWidth={2} />
              Royal Chins care
            </p>

            <p className="mt-4 max-w-xs font-serif text-[2.65rem] leading-[0.92] tracking-tight sm:max-w-sm sm:text-5xl">
              Give them a
              <span className="block text-primary italic">life they&apos;ll love.</span>
            </p>

            <p className="mt-5 max-w-sm text-base leading-7 text-primary-foreground/80">
              Premium companions and everyday essentials, chosen with heart.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:px-2">
        <div className="group mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-md transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none">
          <div className="relative aspect-[16/6] w-full overflow-hidden bg-secondary">
            <Image
              src="/finalctadesktop1.png"
              // src="/cta2.png"
              alt="Royal Chins - Healthy Chins, Happy Lives"
              fill
              sizes="(min-width: 1280px) 1152px, (min-width: 1024px) calc(100vw - 64px)"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 via-45% to-secondary/10" />

            <div className="absolute inset-y-0 left-0 z-10 flex w-[48%] min-w-[430px] items-center px-10 xl:px-14">
              <div className="max-w-md text-primary-foreground">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/75">
                  <Sparkles aria-hidden="true" className="h-4 w-4 text-primary" strokeWidth={2} />
                  Royal Chins care
                </p>

                <p className="mt-4 font-serif text-5xl leading-[0.94] tracking-tight xl:text-6xl">
                  Give them a
                  <span className="block text-primary italic">life they&apos;ll love.</span>
                </p>

                <p className="mt-5 max-w-sm text-base leading-7 text-primary-foreground/80">
                  Premium companions and everyday essentials, chosen with heart.
                </p>

                <Link
                  href="/?browse=all"
                  className="mt-7 inline-flex h-12 items-center gap-3 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-primary transition-[transform,background-color] duration-200 hover:translate-x-1 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-secondary motion-reduce:transform-none motion-reduce:transition-none"
                >
                  Explore the collection
                  <ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>

          <DesktopTrustBar />
        </div>
      </div>
    </section>
  );
}

function DesktopTrustBar() {
  const points = [
    { icon: Truck, label: "Fast UAE delivery" },
    { icon: ShieldCheck, label: "Premium quality" },
    { icon: Heart, label: "Care for every stage" },
  ];

  return (
    <div className="grid min-h-16 grid-cols-3 divide-x divide-border bg-background px-6">
      {points.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center justify-center gap-2.5 px-4 text-sm font-bold text-foreground">
          <Icon aria-hidden="true" className="h-5 w-5 text-primary" strokeWidth={1.9} />
          {label}
        </div>
      ))}
    </div>
  );
}
