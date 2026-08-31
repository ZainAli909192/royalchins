"use client";

import {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "warning"
  | "danger"
  | "error"
  | "success"
  | "link";

type ButtonSize =
  | "sm"
  | "md"
  | "lg"
  | "icon";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
    asChild?: boolean;
  };

const variantClasses: Record<
  ButtonVariant,
  string
> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90",
  secondary:
    "border border-border bg-background text-foreground hover:bg-surface-subtle",
  outline:
    "border border-primary bg-background text-primary hover:bg-primary/5",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-subtle",
  warning:
    "bg-warning text-white hover:opacity-90",
  danger:
    "bg-error text-white hover:opacity-90",
  error:
    "bg-error text-white hover:opacity-90",
  success:
    "bg-success text-white hover:opacity-90",
  link:
    "h-auto bg-transparent p-0 text-primary hover:underline",
};

const sizeClasses: Record<
  ButtonSize,
  string
> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  icon: "h-10 w-10 p-0",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  asChild = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const Component =
    asChild ? Slot : "button";

  return (
    <Component
      className={[
        "inline-flex items-center justify-center rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={
        asChild
          ? undefined
          : disabled || loading
      }
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </Component>
  );
}
