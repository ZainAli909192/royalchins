"use client";

import Image from "next/image";
import { Check } from "lucide-react";

type TamaraPaymentOptionProps = {
  selected: boolean;
  onClick: () => void;
};

export function TamaraPaymentOption({
  selected,
  onClick,
}: TamaraPaymentOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative flex min-h-[108px] w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-white hover:border-primary/40 hover:bg-primary/[0.02]",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-4">
        <span className="relative flex h-12 w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white">
          <Image
            src="/payments/tamara.png"
            alt="Tamara"
            fill
            sizes="92px"
            className="object-contain p-2"
          />
        </span>

        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground">
            Tamara
          </p>

          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Buy now and split your payment with Tamara.
          </p>
        </div>
      </div>

      <span
        className={[
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected
            ? "border-primary bg-primary text-white"
            : "border-border bg-white",
        ].join(" ")}
      >
        {selected && <Check className="h-4 w-4" />}
      </span>
    </button>
  );
}