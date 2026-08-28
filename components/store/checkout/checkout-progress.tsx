import {
  Check,
  CreditCard,
  MapPin,
  UserRound,
  ClipboardCheck,
} from "lucide-react";

type CheckoutStep =
  | "account"
  | "delivery"
  | "review"
  | "payment";

type CheckoutProgressProps = {
  currentStep: CheckoutStep;
};

const steps = [
  {
    id: "account" as const,
    label: "Account",
    icon: UserRound,
  },
  {
    id: "delivery" as const,
    label: "Delivery",
    icon: MapPin,
  },
  {
    id: "review" as const,
    label: "Review",
    icon: ClipboardCheck,
  },
  {
    id: "payment" as const,
    label: "Payment",
    icon: CreditCard,
  },
];

export function CheckoutProgress({
  currentStep,
}: CheckoutProgressProps) {
  const currentIndex = steps.findIndex(
    (step) => step.id === currentStep
  );

  return (
    <div className="w-full">
      <div className="relative flex items-start justify-between">
        <div className="absolute left-[10%] right-[10%] top-5 h-px bg-border" />

        <div
          className="absolute left-[10%] top-5 h-px bg-primary transition-all duration-300"
          style={{
            width:
              currentIndex === 0
                ? "0%"
                : currentIndex === 1
                  ? "26.5%"
                  : currentIndex === 2
                    ? "53%"
                    : "80%",
          }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;

          const completed =
            index < currentIndex;

          const active =
            index === currentIndex;

          return (
            <div
              key={step.id}
              className="relative z-10 flex min-w-[60px] flex-col items-center"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  completed || active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {completed ? (
                  <Check
                    className="h-4 w-4"
                    strokeWidth={2.5}
                  />
                ) : (
                  <Icon
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                )}
              </div>

              <span
                className={`mt-2 text-[10px] font-semibold sm:text-xs ${
                  active
                    ? "text-primary"
                    : completed
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}