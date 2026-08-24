"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> & {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
};

export function SubmitButton({
  children,
  loading = false,
  loadingText = "Please wait...",
  fullWidth = true,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? loadingText : children}
    </Button>
  );
}