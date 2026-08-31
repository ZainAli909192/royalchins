"use client";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

type AuthMode = "login" | "signup";

export function CheckoutAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] =
    useState<AuthMode>("login");

  const [showLoginPassword, setShowLoginPassword] =
    useState(false);

  const [showSignupPassword, setShowSignupPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loginEmail, setLoginEmail] =
    useState("");

  const [loginPassword, setLoginPassword] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [signupEmail, setSignupEmail] =
    useState("");

  const [signupPassword, setSignupPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    fetch("/api/store/auth/session")
      .then((response) => { if (response.ok) goToDelivery(); })
      .catch(() => undefined);
  // Redirecting an already signed-in customer is intentional for checkout.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToDelivery = () => {
    const params = new URLSearchParams();

    const product =
      searchParams.get("product");

    const quantity =
      searchParams.get("quantity");

    const source =
      searchParams.get("source");

    if (product) {
      params.set("product", product);
    }

    if (quantity) {
      params.set("quantity", quantity);
    }

    if (source) {
      params.set("source", source);
    }

    const query = params.toString();

    router.push(
      query
        ? `/checkout/delivery?${query}`
        : "/checkout/delivery"
    );
  };

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (!loginEmail.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (!loginPassword) {
      setError(
        "Please enter your password."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/store/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: loginEmail, password: loginPassword }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      goToDelivery();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (!signupEmail.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (signupPassword.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (
      signupPassword !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/store/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: fullName, email: signupEmail, password: signupPassword }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      goToDelivery();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (
    nextMode: AuthMode
  ) => {
    setMode(nextMode);
    setError("");
  };

  return (
    <section className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
      <div className="p-6 pb-0 sm:p-8 sm:pb-0">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck
            aria-hidden="true"
            className="h-5 w-5"
          />
        </span>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
          Secure Checkout
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {mode === "login"
            ? "Sign in to continue"
            : "Create your account"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {mode === "login"
            ? "Sign in to continue with your order and delivery."
            : "Create an account to continue with your Royal Chins order."}
        </p>
      </div>

      <div className="px-6 pt-6 sm:px-8">
        <div className="grid grid-cols-2 rounded-xl bg-surface-subtle p-1">
          <button
            type="button"
            onClick={() =>
              switchMode("login")
            }
            className={`h-11 rounded-lg text-sm font-bold transition-colors ${
              mode === "login"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() =>
              switchMode("signup")
            }
            className={`h-11 rounded-lg text-sm font-bold transition-colors ${
              mode === "signup"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create Account
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {mode === "login" ? (
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            <Field
              id="login-email"
              label="Email address"
              type="email"
              value={loginEmail}
              onChange={setLoginEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <PasswordField
              id="login-password"
              label="Password"
              value={loginPassword}
              onChange={setLoginPassword}
              visible={showLoginPassword}
              onToggle={() =>
                setShowLoginPassword(
                  (current) => !current
                )
              }
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs font-bold text-primary transition-opacity hover:opacity-70"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <ErrorMessage
                message={error}
              />
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Signing in..."
                : "Sign In & Continue"}

              {!submitting && (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() =>
                  switchMode("signup")
                }
                className="font-bold text-primary hover:underline"
              >
                Create account
              </button>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleSignup}
            className="space-y-5"
          >
            <Field
              id="signup-name"
              label="Full name"
              type="text"
              value={fullName}
              onChange={setFullName}
              placeholder="Enter your full name"
              autoComplete="name"
              icon="user"
            />

            <Field
              id="signup-email"
              label="Email address"
              type="email"
              value={signupEmail}
              onChange={setSignupEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <PasswordField
              id="signup-password"
              label="Password"
              value={signupPassword}
              onChange={
                setSignupPassword
              }
              visible={
                showSignupPassword
              }
              onToggle={() =>
                setShowSignupPassword(
                  (current) => !current
                )
              }
              autoComplete="new-password"
            />

            <PasswordStrength
              password={signupPassword}
            />

            <PasswordField
              id="confirm-password"
              label="Confirm password"
              value={confirmPassword}
              onChange={
                setConfirmPassword
              }
              visible={
                showConfirmPassword
              }
              onToggle={() =>
                setShowConfirmPassword(
                  (current) => !current
                )
              }
              autoComplete="new-password"
            />

            {confirmPassword &&
              signupPassword ===
                confirmPassword && (
                <p className="flex items-center gap-1.5 text-xs font-semibold text-success">
                  <Check className="h-3.5 w-3.5" />
                  Passwords match
                </p>
              )}

            {error && (
              <ErrorMessage
                message={error}
              />
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Creating account..."
                : "Create Account & Continue"}

              {!submitting && (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() =>
                  switchMode("login")
                }
                className="font-bold text-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        )}

        <div className="mt-6 flex items-start gap-3 border-t border-border pt-5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

          <p className="text-xs leading-5 text-muted-foreground">
            Your account helps us securely
            manage your orders, delivery
            information and purchase history.
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  icon,
}: {
  id: string;
  label: string;
  type: "text" | "email";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
  icon?: "user";
}) {
  return (
    <label
      htmlFor={id}
      className="block"
    >
      <span className="text-sm font-bold text-foreground">
        {label}
        <span className="ml-1 text-error">
          *
        </span>
      </span>

      <div className="relative mt-2">
        {icon === "user" && (
          <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className={`h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary ${
            icon ? "pl-11" : ""
          }`}
        />
      </div>
    </label>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  autoComplete:
    | "current-password"
    | "new-password";
}) {
  return (
    <label
      htmlFor={id}
      className="block"
    >
      <span className="text-sm font-bold text-foreground">
        {label}
        <span className="ml-1 text-error">
          *
        </span>
      </span>

      <div className="relative mt-2">
        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          id={id}
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          autoComplete={autoComplete}
          required
          placeholder="Enter password"
          className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-foreground"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </label>
  );
}

function PasswordStrength({
  password,
}: {
  password: string;
}) {
  const requirements = [
    {
      label: "8+ characters",
      valid: password.length >= 8,
    },
    {
      label: "Uppercase",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Lowercase",
      valid: /[a-z]/.test(password),
    },
    {
      label: "Number",
      valid: /\d/.test(password),
    },
  ];

  return (
    <div className="rounded-xl bg-surface-subtle p-3.5">
      <p className="text-xs font-bold text-foreground">
        Password requirements
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {requirements.map(
          (requirement) => (
            <div
              key={
                requirement.label
              }
              className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                requirement.valid
                  ? "text-success"
                  : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  requirement.valid
                    ? "bg-success/10"
                    : "bg-background"
                }`}
              >
                <Check className="h-2.5 w-2.5" />
              </span>

              {requirement.label}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ErrorMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-xs font-semibold leading-5 text-error">
      {message}
    </div>
  );
}
