"use client";

import { Reveal } from "@/components/store/shared/reveal";

const partners = [
  {
    name: "Pet Corner",
    logo: "/partners/petcorner.png",
  },
  {
    name: "Noon",
    logo: "/partners/noon.png",
  },
];

export function PartnersSection() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Reveal
          direction="up"
          distance={25}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-primary sm:w-14" />

              <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary sm:text-sm">
                Our Partners
              </p>

              <span className="h-px w-10 bg-primary sm:w-14" />
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Trusted by{" "}
              <span className="text-primary">
                leading brands
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              We work with trusted partners to bring you the best products and
              services for your beloved companions.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:mt-12 grid-cols-2 sm:gap-6">
          {partners.map((partner, index) => (
            <Reveal
              key={partner.name}
              direction={index === 0 ? "left" : "right"}
              distance={30}
              delay={index * 0.08}
            >
              <div className="group flex min-h-[150px] items-center justify-center  duration-300 hover:-translate-y-1  hover:shadow-md sm:min-h-[180px] sm:p-7">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-[82px] w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:max-h-[96px] rounded "
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}