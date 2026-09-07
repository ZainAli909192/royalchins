"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type TamaraPaymentPanelProps = {
  total: number;
  loading: boolean;
  error?: string;
  onPay: () => void;
};

export function TamaraPaymentPanel({
  total,
  loading,
  error,
  onPay,
}: TamaraPaymentPanelProps) {
  return (
    <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:rounded-3xl sm:p-6">
      <div className="flex justify-center">
        <span className="relative inline-flex h-12 w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white">
          <Image
            src="/payments/tamara.png"
            alt="Tamara"
            fill
            sizes="96px"
            className="object-contain p-2"
          />
        </span>
      </div>

      <div className="mt-4 text-center">
        <h2 className="text-lg font-bold text-foreground sm:text-xl">
          Pay with Tamara
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Split your purchase with Tamara and complete your payment securely.
        </p>
      </div>

      <div className="mx-auto mt-5 max-w-md rounded-xl border border-border bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            Order total
          </span>

          <span className="text-base font-bold text-foreground">
            AED {total.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-center text-sm font-semibold text-red-600">
          {error}
        </p>
      )}

      <div className="mx-auto mt-5 max-w-md">
        <Button
          type="button"
          variant="primary"
          onClick={onPay}
          disabled={loading}
          className="h-12 w-full rounded-xl"
        >
          <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
            <span>
              {loading
                ? "Connecting to Tamara..."
                : "Pay with Tamara"}
            </span>

            {!loading && (
              <ArrowRight className="h-4 w-4 shrink-0" />
            )}
          </span>
        </Button>
      </div>
    </section>
  );
}