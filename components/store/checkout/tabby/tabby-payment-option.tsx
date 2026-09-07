"use client";

import Image from "next/image";
import { Check } from "lucide-react";

type TabbyPaymentOptionProps = {
  active: boolean;
  onClick: () => void;
};

export function TabbyPaymentOption({
  active,
  onClick,
}: TabbyPaymentOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative w-full rounded-2xl border-2 p-4 text-left transition-all sm:p-5 ${
        active
          ? "border-primary bg-primary/5"
          : "border-border bg-background hover:border-primary/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-sm font-bold text-foreground sm:text-base">
              Tabby
            </p>

            <PaymentLogo
              src="/payments/tabby-logo.svg"
              alt="Tabby"
            />
          </div>

          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Buy now pay later with Tabby
          </p>
        </div>

        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
            active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background"
          }`}
        >
          {active && (
            <Check
              className="h-3.5 w-3.5"
              strokeWidth={3}
            />
          )}
        </span>
      </div>
    </button>
  );
}

type PaymentLogoProps = {
  src: string;
  alt: string;
};

function PaymentLogo({
  src,
  alt,
}: PaymentLogoProps) {
  return (
    <span className="relative inline-flex h-8 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="56px"
        className="object-contain p-1.5"
      />
    </span>
  );
}