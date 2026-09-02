"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

type PasswordResetFlowProps = {
  accountType: "customer" | "admin";
  initialStep: "request" | "reset";
};

export function PasswordResetFlow({ accountType, initialStep }: PasswordResetFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = accountType === "admin";
  const loginHref = isAdmin ? "/admin/login" : "/auth/login";
  const forgotHref = isAdmin ? "/admin/forgot-password" : "/auth/forgot-password";
  const resetHref = isAdmin ? "/admin/reset-password" : "/auth/reset-password";
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestPath = isAdmin ? "/api/admin/auth/forgot-password" : "/api/store/auth/forgot-password";
  const verifyPath = isAdmin ? "/api/admin/auth/verify-reset-otp" : "/api/store/auth/verify-reset-otp";
  const resetPath = isAdmin ? "/api/admin/auth/reset-password" : "/api/store/auth/reset-password";
  const isRequest = initialStep === "request";

  async function readResponse(response: Response) {
    return response.json().catch(() => ({ message: "Something went wrong. Please try again." }));
  }

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch(requestPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.message);
      router.push(`${resetHref}?email=${encodeURIComponent(email.trim())}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not send the reset code.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch(verifyPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.message);
      setOtpVerified(true);
      setMessage(data.message);
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "We could not verify that code.");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!otpVerified) {
      setError("Verify the code before choosing a new password.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(resetPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password, passwordConfirmation }),
      });
      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.message);
      setMessage(data.message);
      window.setTimeout(() => router.replace(loginHref), 1200);
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "We could not reset your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface-subtle px-4 py-8 sm:px-6">
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="w-full max-w-[520px] rounded-2xl border border-border bg-white px-5 py-7 shadow-lg sm:px-8 sm:py-9">
          <h1 className="text-center text-2xl font-bold text-foreground">
            {isRequest ? "Forgot password?" : otpVerified ? "Choose a new password" : "Verify your code"}
          </h1>
          <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">
            {isRequest
              ? "Enter your email and we’ll send a six-digit verification code."
              : otpVerified
                ? "Your code is verified. Create a secure new password."
                : "Enter the six-digit code we sent to your email address."}
          </p>

          {error && <p className="mt-5 rounded-xl bg-error/10 px-4 py-3 text-sm font-semibold text-error">{error}</p>}
          {message && <p className="mt-5 rounded-xl bg-success/10 px-4 py-3 text-sm font-semibold text-success">{message}</p>}

          {isRequest ? (
            <form onSubmit={requestCode} className="mt-6 space-y-4">
              <EmailField value={email} onChange={setEmail} />
              <Button type="submit" disabled={loading} variant="primary" className="h-12 w-full rounded-xl font-bold">
                {loading ? "Please wait..." : "Send verification code"}
              </Button>
            </form>
          ) : !otpVerified ? (
            <form onSubmit={verifyCode} className="mt-6 space-y-4">
              <EmailField value={email} onChange={setEmail} />
              <label className="block text-sm font-semibold text-foreground">
                Verification code
                <input
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-center text-lg font-bold tracking-[0.35em] outline-none focus:border-primary"
                />
              </label>
              <Button type="submit" disabled={loading} variant="primary" className="h-12 w-full rounded-xl font-bold">
                {loading ? "Verifying..." : "Verify code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={resetPassword} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-foreground">
                New password
                <input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </label>
              <label className="block text-sm font-semibold text-foreground">
                Confirm password
                <input required minLength={8} type="password" autoComplete="new-password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder="Repeat your new password" className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </label>
              <Button type="submit" disabled={loading} variant="primary" className="h-12 w-full rounded-xl font-bold">
                {loading ? "Resetting password..." : "Reset password"}
              </Button>
            </form>
          )}

          <div className="mt-5 text-center text-sm">
            <Link href={isRequest ? loginHref : forgotHref} className="font-semibold text-primary hover:underline">
              {isRequest ? "Back to sign in" : "Send a new code"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function EmailField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-semibold text-foreground">
      Email address
      <input required type="email" autoComplete="email" value={value} onChange={(event) => onChange(event.target.value)} placeholder="you@example.com" className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
    </label>
  );
}
