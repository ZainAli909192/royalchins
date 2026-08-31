"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/forms/submit-button";
import { FormAlert } from "@/components/forms/form-alert";

import {
  adminForgotPasswordSchema,
  type AdminForgotPasswordFormValues,
} from "@/lib/validations/admin-forgot-password";

import { adminForgotPassword } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminForgotPasswordPage() {
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminForgotPasswordFormValues>({
    resolver: zodResolver(adminForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (
    values: AdminForgotPasswordFormValues
  ) => {
    setFormError("");
    setSuccessMessage("");
    setResetUrl("");

    try {
      const response = await adminForgotPassword(values.email);

      setSuccessMessage(
        response.message || "Password reset link sent successfully."
      );
      setResetUrl(response.resetUrl ?? "");
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          "Unable to send the reset link. Please try again."
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
              <Mail className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.8} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-foreground sm:text-3xl">
              Forgot Password?
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              Enter your admin email address and we will send you a password
              reset link.
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

            {resetUrl && (
              <Link href={resetUrl} className="block rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center text-sm font-semibold text-primary hover:bg-primary/10">
                Continue to password reset
              </Link>
            )}

            <Input
              {...register("email")}
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              disabled={isSubmitting}
              error={errors.email?.message}
              leftIcon={<Mail className="h-5 w-5" />}
              className="h-14 sm:h-[64px]"
            />

            <SubmitButton
              loading={isSubmitting}
              loadingText="Sending..."
              className="h-14 sm:h-[62px]"
            >
              <span className="flex items-center justify-center gap-2">
                <Send className="h-5 w-5" />
                Send Reset Link
              </span>
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
