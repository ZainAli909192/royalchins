"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/forms/password-input";
import { SubmitButton } from "@/components/forms/submit-button";
import { FormAlert } from "@/components/forms/form-alert";

import {
  adminLoginSchema,
  type AdminLoginFormValues,
} from "@/lib/validations/admin-login";

import { adminLogin } from "@/lib/api/auth";
import { saveAdminSession } from "@/lib/auth/admin-auth";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminLoginPage() {
  const router = useRouter();

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof adminLoginSchema>,
    unknown,
    AdminLoginFormValues
  >({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    setFormError("");
    setSuccessMessage("");

    try {
      const response = await adminLogin(values);

      saveAdminSession(response.token);

      setSuccessMessage("Login successful. Redirecting...");

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          "Unable to sign in. Please check your credentials and try again."
        )
      );
    }
  };

  return (
    <main className="min-h-screen bg-red-400 ">
    

      <section className=" relative flex min-h-screen items-center justify-center bg-white px-4 pb-8 pt-28 sm:px-8 lg:bg-surface-subtle lg:px-9 lg:py-6">
     

        <div className="relative z-10 w-full max-w-[640px] bg-white px-1 py-4 sm:px-8 sm:py-9 lg:flex lg:min-h-[calc(70vh-48px)] lg:flex-col lg:justify-center lg:rounded-[22px] lg:border lg:border-border lg:px-[52px] lg:py-10 lg:shadow-lg xl:px-[54px]">
          <div className="text-center">
            <div className="mx-auto flex h-[86px] w-[86px] items-center justify-center rounded-full bg-surface-subtle text-primary">
              <LockKeyhole className="h-11 w-11" strokeWidth={1.7} />
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-[40px] sm:leading-tight">
              Admin Portal
            </h1>
    <Image
            src="/logo.png" 
            alt=""
            width={112}
            height={112}
            priority
            className="h-28 w-28 shrink-0 object-contain"
            style={{ width: "50vw" }}
          />
            <p className="mt-2 text-sm text-muted-foreground sm:text-lg">
              Authorized access only
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="h-px w-16 bg-primary/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="h-px w-16 bg-primary/40" />
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-7 space-y-6"
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

            <Input
              {...register("email")}
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              disabled={isSubmitting}
              error={errors.email?.message}
              leftIcon={<Mail className="h-5 w-5" />}
              className="h-14 sm:h-[68px]"
            />

            <PasswordInput
              {...register("password")}
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isSubmitting}
              error={errors.password?.message}
              className="h-14 sm:h-[68px]"
            />

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
              <Checkbox
                {...register("rememberMe")}
                label="Remember me"
                disabled={isSubmitting}
              />

              <Link
                href="/admin/forgot-password"
                className="shrink-0 text-sm font-medium text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <SubmitButton
              loading={isSubmitting}
              loadingText="Signing In..."
              className="h-14 bg-gradient-to-r from-primary to-primary-active text-base shadow-primary hover:opacity-95 sm:h-[62px] sm:text-lg [&>span]:w-full"
            >
              <span className="grid w-full grid-cols-[1fr_auto_1fr] items-center">
                <span />
                <span>Sign In to Admin</span>
                <ArrowRight className="ml-auto h-6 w-6" />
              </span>
            </SubmitButton>

            

            <div className="flex items-start gap-4 rounded-xl bg-surface-subtle p-5 sm:p-6">
              <ShieldCheck className="mt-0.5 h-10 w-10 shrink-0 text-primary" strokeWidth={1.8} />

              <div>
                <p className="text-base font-semibold text-foreground">
                  Authorized Access Only
                </p>

                <p className="mt-1 text-sm leading-5 text-muted-foreground sm:text-[15px]">
                  All access is monitored and recorded for security purposes.
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
