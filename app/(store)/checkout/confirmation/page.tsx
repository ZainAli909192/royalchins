import { Suspense } from "react";
import { CheckoutConfirmation } from "@/components/store/checkout/checkout-confirmation";

export default function CheckoutConfirmationPage() {
  return <Suspense fallback={<div className="mx-auto max-w-[1100px] px-4 py-16 text-center text-sm font-semibold text-muted-foreground">Loading your order…</div>}><CheckoutConfirmation /></Suspense>;
}
