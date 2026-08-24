"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: ReactNode;
  error?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      id,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const checkboxId =
      id ||
      props.name ||
      `checkbox-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="w-full">
        <label
          htmlFor={checkboxId}
          className={[
            "inline-flex items-center gap-3",
            disabled
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer",
          ].join(" ")}
        >
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={[
              "h-4 w-4 rounded border",
              "border-[var(--input-border)]",
              "accent-primary",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary",
              "focus-visible:ring-offset-2",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {label && (
            <span className="text-sm text-foreground">
              {label}
            </span>
          )}
        </label>

        {error && (
          <p
            role="alert"
            className="mt-2 text-sm font-medium text-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";