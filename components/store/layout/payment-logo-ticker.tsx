"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  useEffect,
  useState,
} from "react";

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
  const [
    mounted,
    setMounted,
  ] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const repeatedLogos = [
    ...paymentLogos,
    ...paymentLogos,
  ];

  return createPortal(
    <div className="fixed inset-x-0 bottom-0 z-[9999] border-t border-border bg-white shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
      <div className="relative h-[64px] w-full overflow-hidden sm:h-[72px]">
        <div className="payment-logo-track flex h-full w-max items-center gap-4 px-4 sm:gap-5 sm:px-5">
          {repeatedLogos.map(
            (logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="flex h-[42px] w-[86px] shrink-0 items-center justify-center rounded-xl border border-border bg-white px-2 sm:h-[48px] sm:w-[96px] sm:px-3"
              > 
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={96}
                  height={48}
                  className="h-[30px] w-[70px] object-contain sm:h-[34px] sm:w-[78px]"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}