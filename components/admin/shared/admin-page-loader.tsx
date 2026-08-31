import { Spinner } from "@/components/ui/spinner";

type AdminPageLoaderProps = {
  label?: string;
  className?: string;
};

export function AdminPageLoader({
  label = "Loading data",
  className = "",
}: AdminPageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={[
        "flex min-h-[260px] flex-col items-center justify-center gap-4",
        "rounded-xl border border-border bg-surface",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Spinner size="lg" label={label} />

      <p className="text-sm text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
