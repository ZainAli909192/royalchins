import { AlertCircle } from "lucide-react";

type FormErrorProps = {
  message?: string;
  className?: string;
};

export function FormError({
  message,
  className = "",
}: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        "mt-2 flex items-start gap-2",
        "text-sm font-medium text-error",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <AlertCircle
        className="mt-0.5 h-4 w-4 shrink-0"
        aria-hidden="true"
      />

      <span className="leading-5">{message}</span>
    </div>
  );
}