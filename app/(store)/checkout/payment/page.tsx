import { CheckoutPayment } from "@/components/store/checkout/checkout-payment";
import { CheckoutProgress } from "@/components/store/checkout/checkout-progress";

export default function CheckoutPaymentPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mb-7 sm:mb-9">
        <CheckoutProgress currentStep="payment" />
      </div>

      <CheckoutPayment />
    </div>
  );
}