"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { Input } from "@/components/ui/input";

type PasswordInputProps = {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
};

export function PasswordInput({
  label = "Password",
  placeholder = "Enter your password",
  error,
  helperText,
  disabled,
  name,
  id,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      id={id}
      name={name}
      label={label}
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      disabled={disabled}
      autoComplete="current-password"
      leftIcon={
        <LockKeyhole className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
      }
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="
            flex h-8 w-8 items-center justify-center
            rounded-md
            text-muted-foreground
            transition-colors
            hover:bg-surface-subtle
            hover:text-primary
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      }
    />
  );
}