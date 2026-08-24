"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const inputId =
      id || props.name || `input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className={[
                "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2",
                "flex items-center justify-center",
                error ? "text-error" : "text-primary",
              ].join(" ")}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={[
              "h-12 w-full rounded-md border bg-[var(--input-background)]",
              "text-sm text-foreground outline-none",
              "transition-all duration-200",
              "placeholder:text-[var(--input-placeholder)]",

              leftIcon ? "pl-12" : "pl-4",
              rightIcon ? "pr-12" : "pr-4",

              error
                ? [
                    "border-error",
                    "focus:border-error",
                    "focus:ring-4",
                    "focus:ring-red-500/10",
                  ].join(" ")
                : [
                    "border-[var(--input-border)]",
                    "hover:border-[var(--border-strong)]",
                    "focus:border-primary",
                    "focus:ring-4",
                    "focus:ring-[var(--focus-ring)]",
                  ].join(" "),

              disabled
                ? "cursor-not-allowed bg-muted text-muted-foreground opacity-70"
                : "",

              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="mt-2 text-sm font-medium text-error"
          >
            {error}
          </p>
        ) : helperText ? (
          <p
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";