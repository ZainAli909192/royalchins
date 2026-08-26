import Image from "next/image";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section
      aria-label="Royal Chins - Healthy Chins, Happy Lives"
      className="w-full"
    >
      <div className="lg:hidden">
        <Link
          href="/browse"
          aria-label="Shop Royal Chins products"
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <div className="relative h-[405px] w-full overflow-hidden sm:h-[520px]">
            <Image
              src="/finalctamob.png"
              alt="Royal Chins - Healthy Chins, Happy Lives"
              fill
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        </Link>
      </div>

      <div className="hidden lg:block">
        <Link
          href="/browse"
          aria-label="Shop Royal Chins products"
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <div className="relative h-[300px] w-full overflow-hidden rounded-3xl xl:h-[330px] 2xl:h-[350px]">
            <Image
              src="/finalctadesktop.png"
              alt="Royal Chins - Healthy Chins, Happy Lives"
              fill
              sizes="(min-width: 1024px) 1440px"
              className="object-cover object-center transition-transform duration-500 hover:scale-[1.005] motion-reduce:transition-none"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}