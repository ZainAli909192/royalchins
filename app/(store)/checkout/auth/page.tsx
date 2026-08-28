import { CheckoutAuth } from "@/components/store/checkout/checkout-auth";
import { CheckoutProgress } from "@/components/store/checkout/checkout-progress";

export default function CheckoutAuthPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mb-7 sm:mb-9">
        <CheckoutProgress currentStep="account" />
      </div>

      <CheckoutAuth />
    </div>
  );
}