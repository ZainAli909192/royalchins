import { CheckoutAuth } from "@/components/store/checkout/checkout-auth";
import { CheckoutProgress } from "@/components/store/checkout/checkout-progress";
import { Suspense } from "react";

export default function CheckoutAuthPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mb-7 sm:mb-9">
        <CheckoutProgress currentStep="account" />
      </div>

      <Suspense fallback={<CheckoutAuthFallback />}>
        <CheckoutAuth />
      </Suspense>
    </div>
  );
}

function CheckoutAuthFallback() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
      <div className="h-11 w-11 animate-pulse rounded-2xl bg-surface-subtle" />
      <div className="mt-5 h-3 w-28 animate-pulse rounded bg-surface-subtle" />
      <div className="mt-3 h-8 w-64 animate-pulse rounded bg-surface-subtle" />
      <div className="mt-6 h-12 animate-pulse rounded-xl bg-surface-subtle" />
      <div className="mt-4 h-12 animate-pulse rounded-xl bg-surface-subtle" />
    </div>
  );
}
