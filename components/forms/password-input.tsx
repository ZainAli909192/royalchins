"use client";

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from "react";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { Input } from "@/components/ui/input";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    {
      label,
      error,
      helperText,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        label={label}
        error={error}
        helperText={helperText}
        disabled={disabled}
        leftIcon={<LockKeyhole className="h-5 w-5" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            disabled={disabled}
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition hover:text-primary"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";