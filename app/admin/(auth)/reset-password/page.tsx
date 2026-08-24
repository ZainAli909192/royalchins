"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PasswordInput } from "@/components/forms/password-input";
import { SubmitButton } from "@/components/forms/submit-button";
import { FormAlert } from "@/components/forms/form-alert";

import {
  adminResetPasswordSchema,
  type AdminResetPasswordFormValues,
} from "@/lib/validations/admin-reset-password";

import { adminResetPassword } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/utils/errors";

function AdminResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminResetPasswordFormValues>({
    resolver: zodResolver(adminResetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (
    values: AdminResetPasswordFormValues
  ) => {
    setFormError("");
    setSuccessMessage("");

    if (!token) {
      setFormError(
        "Reset token is missing or invalid. Please request a new password reset link."
      );
      return;
    }

    try {
      const response = await adminResetPassword({
        token,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      });

      setSuccessMessage(
        response.message || "Password reset successfully."
      );
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          "Unable to reset your password. Please try again."
        )
      );
    }
  };

  return (
    <main className="min-h-screen bg-surface-subtle px-4 py-8 sm:px-6">
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="w-full max-w-[560px] rounded-2xl border border-border bg-white px-5 py-7 shadow-lg sm:px-8 sm:py-9 lg:px-10">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-subtle text-primary sm:h-20 sm:w-20">
              <KeyRound
                className="h-8 w-8 sm:h-10 sm:w-10"
                strokeWidth={1.8}
              />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-foreground sm:text-3xl">
              Reset Password
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              Create a new password for your admin account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-7 space-y-5"
          >
            {formError && (
              <FormAlert
                variant="error"
                message={formError}
                onClose={() => setFormError("")}
              />
            )}

            {successMessage && (
              <FormAlert
                variant="success"
                message={successMessage}
              />
            )}

            <PasswordInput
              {...register("password")}
              label="New Password"
              placeholder="Enter your new password"
              autoComplete="new-password"
              disabled={isSubmitting}
              error={errors.password?.message}
              className="h-14 sm:h-[64px]"
            />

            <PasswordInput
              {...register("passwordConfirmation")}
              label="Confirm Password"
              placeholder="Confirm your new password"
              autoComplete="new-password"
              disabled={isSubmitting}
              error={errors.passwordConfirmation?.message}
              className="h-14 sm:h-[64px]"
            />

            <SubmitButton
              loading={isSubmitting}
              loadingText="Resetting..."
              className="h-14 sm:h-[62px]"
            >
              Reset Password
            </SubmitButton>

            <div className="text-center">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin Login
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-surface-subtle">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
            role="status"
            aria-label="Loading password reset form"
          />
        </main>
      }
    >
      <AdminResetPasswordForm />
    </Suspense>
  );
}
