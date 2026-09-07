"use client";

import Image from "next/image";

const paymentLogos = [
  {
    src: "/payments/visa.png",
    alt: "Visa",
  },
  {
    src: "/payments/mastercard.svg",
    alt: "Mastercard",
  },
  {
    src: "/payments/apple-pay.png",
    alt: "Apple Pay",
  },
  {
    src: "/payments/googlepay.png",
    alt: "Google Pay",
  },
  {
    src: "/payments/tabby-logo.svg",
    alt: "Tabby",
  },
  {
    src: "/payments/tamara.png",
    alt: "Tamara",
  },
];

export function PaymentLogoTicker() {
  const repeatedLogos = [
    ...paymentLogos,
    ...paymentLogos,
  ];

  return (
    <div className="fixed bottom-0 left-0 z-[100] w-full border-t border-border bg-white shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
      <div className="relative h-[72px] overflow-hidden">
        <div className="payment-logo-track flex h-full w-max items-center gap-5 px-5">
          {repeatedLogos.map(
            (logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="flex h-[48px] w-[96px] shrink-0 items-center justify-center rounded-xl border border-border bg-white px-3"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={96}
                  height={48}
                  className="h-[34px] w-[78px] object-contain"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}