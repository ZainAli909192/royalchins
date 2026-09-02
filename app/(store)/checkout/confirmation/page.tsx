import { Suspense } from "react";
import { CheckoutConfirmation } from "@/components/store/checkout/checkout-confirmation";
import { AdminPageLoader } from "@/components/admin/shared/admin-page-loader";

export default function CheckoutConfirmationPage() {
  return <Suspense fallback={<div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 lg:px-8"><AdminPageLoader label="Placing your order…" className="min-h-[440px] rounded-3xl bg-background shadow-sm" /></div>}><CheckoutConfirmation /></Suspense>;
}
