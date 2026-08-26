import Image from "next/image";

export function BrowseHeader() {
  return (
    <section
      aria-label="Royal Chins"
      className="-mx-4 -mt-6 w-[calc(100%+2rem)] sm:mx-0 sm:mt-0 sm:w-full"
    >
      <div className="relative w-full overflow-hidden lg:hidden">
        <Image
          src="/heroposter.png"
          alt="Royal Chins - Happy Pets, Happier Homes"
          width={1080}
          height={1600}
          priority
          sizes="100vw"
          className="block h-auto w-full object-cover"
        />
      </div>

      <div className="relative hidden w-full overflow-hidden rounded-3xl lg:block">
        <div className="relative aspect-[16/4.5] w-full">
          <Image
            src="/desktop_hero_poster.png"
            alt="Royal Chins - Happy Pets, Happier Homes"
            fill
            priority
            sizes="(min-width: 1024px) 100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}