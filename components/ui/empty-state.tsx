import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex w-full flex-col items-center justify-center",
        "px-4 py-10 text-center",
        "sm:px-6 sm:py-12",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && (
        <div
          className="
            mb-4 flex h-14 w-14
            items-center justify-center
            rounded-full
            bg-surface-subtle
            text-primary
            sm:h-16 sm:w-16
          "
        >
          {icon}
        </div>
      )}

      <h3
        className="
          text-base font-semibold text-foreground
          sm:text-lg
        "
      >
        {title}
      </h3>

      {description && (
        <p
          className="
            mt-2 max-w-md
            text-sm leading-6
            text-muted-foreground
          "
        >
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}