"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  adminLoginSchema,
  type AdminLoginFormValues,
} from "@/lib/validations/admin-login";

import { FormError } from "@/components/forms/form-error";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),

    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },

    mode: "onTouched",
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    setServerError("");
    setIsSuccess(false);

    try {
      /*
       * Replace this demo request with your real API.
       *
       * Example:
       *
       * const response = await fetch(
       *   `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/login`,
       *   {
       *     method: "POST",
       *     headers: {
       *       "Content-Type": "application/json",
       *     },
       *     credentials: "include",
       *     body: JSON.stringify(values),
       *   }
       * );
       */

      await new Promise((resolve) => setTimeout(resolve, 1200));

      console.log("Admin login:", values);

      setIsSuccess(true);

      /*
       * After successful API response:
       *
       * router.push("/admin/dashboard");
       * router.refresh();
       */
    } catch {
      setServerError(
        "Unable to sign in. Please check your credentials and try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfcfd]">
      <div className="mx-auto grid min-h-screen w-full lg:grid-cols-[1.08fr_0.92fr]">
        {/* =====================================================
            LEFT SIDE
        ====================================================== */}
        <section className="relative hidden items-center justify-center overflow-hidden px-10 lg:flex">
          {/* Decorative subtle background */}
          <div className="absolute inset-0">
            <div className="absolute left-[30%] top-[35%] h-72 w-72 rounded-full bg-[#6f3cc3]/[0.025] blur-3xl" />
          </div>

          <div className="relative flex items-center justify-center">
            {/* Replace this with your exact Royal Chins logo */}
            <Image
              src="/images/royal-chins-logo.svg"
              alt="Royal Chins"
              width={520}
              height={180}
              priority
              className="h-auto w-[400px] xl:w-[480px]"
            />
          </div>
        </section>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}
        <section className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-10 xl:px-14">
          <div className="w-full max-w-[640px] rounded-[24px] border border-[#e5e7eb] bg-white px-6 py-8 shadow-[0_12px_45px_rgba(15,23,42,0.05)] sm:px-10 sm:py-10 xl:px-12">
            {/* Mobile Logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Image
                src="/images/royal-chins-logo.svg"
                alt="Royal Chins"
                width={280}
                height={100}
                priority
                className="h-auto w-[240px]"
              />
            </div>

            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-[108px] w-[108px] items-center justify-center rounded-full bg-[#6f3cc3]/[0.065]">
                <ShieldCheck
                  strokeWidth={1.8}
                  className="h-[55px] w-[55px] text-[#6f3cc3]"
                />
              </div>

              <h1 className="mt-5 text-[34px] font-bold tracking-[-0.03em] text-[#171a2b] sm:text-[38px]">
                Admin Portal
              </h1>

              <p className="mt-1 text-base text-[#667085] sm:text-lg">
                Authorized access only
              </p>

              {/* Decorative divider */}
              <div className="mt-7 flex items-center gap-3">
                <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#9b68ed]" />

                <span className="h-2.5 w-2.5 rounded-full bg-[#7137d7]" />

                <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#9b68ed]" />
              </div>
            </div>

            {/* =====================================================
                LOGIN FORM
            ====================================================== */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-7"
            >
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2.5 block text-[15px] font-semibold text-[#1d2333]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className={`absolute left-5 top-1/2 h-[22px] w-[22px] -translate-y-1/2 ${
                      errors.email ? "text-red-500" : "text-[#6f3cc3]"
                    }`}
                    strokeWidth={1.9}
                  />

                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    aria-invalid={Boolean(errors.email)}
                    className={`
                      h-[68px]
                      w-full
                      rounded-[10px]
                      border
                      bg-white
                      pl-[64px]
                      pr-5
                      text-base
                      text-[#151928]
                      outline-none
                      transition-all
                      duration-200
                      placeholder:text-[#8b91a4]
                      ${
                        errors.email
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-[#d8dbe3] hover:border-[#b9a2e3] focus:border-[#6f3cc3] focus:ring-4 focus:ring-[#6f3cc3]/10"
                      }
                    `}
                  />
                </div>

                <FormError message={errors.email?.message} />
              </div>

              {/* PASSWORD */}
              <div className="mt-7">
                <label
                  htmlFor="password"
                  className="mb-2.5 block text-[15px] font-semibold text-[#1d2333]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    className={`absolute left-5 top-1/2 h-[22px] w-[22px] -translate-y-1/2 ${
                      errors.password ? "text-red-500" : "text-[#6f3cc3]"
                    }`}
                    strokeWidth={1.9}
                  />

                  <input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={Boolean(errors.password)}
                    className={`
                      h-[68px]
                      w-full
                      rounded-[10px]
                      border
                      bg-white
                      pl-[64px]
                      pr-[60px]
                      text-base
                      text-[#151928]
                      outline-none
                      transition-all
                      duration-200
                      placeholder:text-[#8b91a4]
                      ${
                        errors.password
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-[#d8dbe3] hover:border-[#b9a2e3] focus:border-[#6f3cc3] focus:ring-4 focus:ring-[#6f3cc3]/10"
                      }
                    `}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#858b9d] transition hover:text-[#6f3cc3]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-[23px] w-[23px]" />
                    ) : (
                      <Eye className="h-[23px] w-[23px]" />
                    )}
                  </button>
                </div>

                <FormError message={errors.password?.message} />
              </div>

              {/* REMEMBER / FORGOT */}
              <div className="mt-7 flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-3 text-[15px] text-[#303646]">
                  <input
                    {...register("rememberMe")}
                    type="checkbox"
                    className="
                      h-[19px]
                      w-[19px]
                      cursor-pointer
                      rounded
                      border-[#bfc3ce]
                      accent-[#6f3cc3]
                    "
                  />

                  <span>Remember me</span>
                </label>

                <Link
                  href="/admin/forgot-password"
                  className="text-[15px] font-medium text-[#6f3cc3] transition hover:text-[#5423ad] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* SERVER ERROR */}
              {serverError && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                  {serverError}
                </div>
              )}

              {/* SUCCESS */}
              {isSuccess && (
                <div
                  role="status"
                  className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
                >
                  Login validated successfully.
                </div>
              )}

              {/* SIGN IN */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  group
                  mt-7
                  flex
                  h-[63px]
                  w-full
                  items-center
                  justify-center
                  rounded-[10px]
                  bg-gradient-to-r
                  from-[#7134da]
                  via-[#682cc9]
                  to-[#5420aa]
                  px-6
                  text-[17px]
                  font-semibold
                  text-white
                  shadow-[0_9px_25px_rgba(111,60,195,0.18)]
                  transition-all
                  duration-300
                  hover:-translate-y-[1px]
                  hover:shadow-[0_12px_30px_rgba(111,60,195,0.25)]
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                    <span>Signing In...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In to Admin</span>

                    <ArrowRight className="absolute ml-[85%] h-[23px] w-[23px] transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* OR */}
              <div className="my-8 flex items-center gap-7">
                <div className="h-px flex-1 bg-[#dfe2e8]" />

                <span className="text-sm font-semibold text-[#454b59]">
                  OR
                </span>

                <div className="h-px flex-1 bg-[#dfe2e8]" />
              </div>

              {/* SECURITY NOTICE */}
              <div className="flex items-center gap-5 rounded-[14px] bg-gradient-to-r from-[#f7f2ff] to-[#f9f5ff] px-5 py-5 sm:px-6">
                <ShieldCheck
                  className="h-10 w-10 shrink-0 text-[#6f3cc3]"
                  strokeWidth={1.8}
                />

                <div>
                  <h2 className="font-semibold text-[#1c2030]">
                    Authorized Access Only
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-[#3f4555]">
                    All access is monitored and recorded for security purposes.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}