import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

type FormAlertVariant =
  | "error"
  | "success"
  | "warning"
  | "info";

type FormAlertProps = {
  message?: string;
  variant?: FormAlertVariant;
  onClose?: () => void;
  className?: string;
};

const variantStyles: Record<FormAlertVariant, string> = {
  error:
    "border-red-200 bg-[var(--error-background)] text-error",

  success:
    "border-green-200 bg-[var(--success-background)] text-success",

  warning:
    "border-amber-200 bg-[var(--warning-background)] text-warning",

  info:
    "border-blue-200 bg-[var(--info-background)] text-[var(--info)]",
};

const icons: Record<FormAlertVariant, typeof AlertCircle> = {
  error: AlertCircle,
  success: CheckCircle2,
  warning: TriangleAlert,
  info: Info,
};

export function FormAlert({
  message,
  variant = "error",
  onClose,
  className = "",
}: FormAlertProps) {
  if (!message) return null;

  const Icon = icons[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={[
        "flex w-full items-start gap-3",
        "rounded-lg border",
        "px-4 py-3",
        "text-sm",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon
        className="mt-0.5 h-5 w-5 shrink-0"
        aria-hidden="true"
      />

      <p className="min-w-0 flex-1 break-words leading-5">
        {message}
      </p>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close message"
          className="
            flex h-6 w-6 shrink-0
            items-center justify-center
            rounded-md
            transition-opacity
            hover:opacity-60
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-current
          "
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}