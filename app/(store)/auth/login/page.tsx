import { Suspense } from "react";

import { CheckoutAuth } from "@/components/store/checkout/checkout-auth";

export default function CustomerLoginPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Suspense fallback={<LoginFallback />}>
        <CheckoutAuth redirectTo="/account" />
      </Suspense>
    </main>
  );
}

function LoginFallback() {
  return <div className="mx-auto h-[540px] max-w-xl animate-pulse rounded-3xl border border-border bg-surface-subtle" />;
}
