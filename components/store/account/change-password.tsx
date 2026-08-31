"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const initialForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePassword() {
  const [form, setForm] =
    useState<PasswordForm>(initialForm);

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] =
    useState(false);

  const requirements = useMemo(
    () => ({
      length: form.newPassword.length >= 8,
      uppercase: /[A-Z]/.test(form.newPassword),
      lowercase: /[a-z]/.test(form.newPassword),
      number: /\d/.test(form.newPassword),
    }),
    [form.newPassword]
  );

  const validNewPassword = Object.values(
    requirements
  ).every(Boolean);

  const passwordsMatch =
    form.confirmPassword.length > 0 &&
    form.newPassword === form.confirmPassword;

  const canSubmit =
    form.currentPassword.length > 0 &&
    validNewPassword &&
    passwordsMatch &&
    !submitting;

  function updateField(
    field: keyof PasswordForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.currentPassword) {
      setError(
        "Please enter your current password."
      );
      return;
    }

    if (!validNewPassword) {
      setError(
        "Your new password does not meet the password requirements."
      );
      return;
    }

    if (
      form.newPassword !== form.confirmPassword
    ) {
      setError(
        "New password and confirmation do not match."
      );
      return;
    }

    if (
      form.currentPassword === form.newPassword
    ) {
      setError(
        "Your new password must be different from your current password."
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/store/account/password", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setForm(initialForm);
      setSuccess(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We couldn't update your password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[760px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Account
      </Link>

      <header className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          My Account
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Change Password
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Update your password to keep your
          Royal Chins account secure.
        </p>
      </header>

      {success && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-success/20 bg-success/5 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />

          <div>
            <p className="text-sm font-bold text-foreground">
              Password updated
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Your account password has been
              changed successfully.
            </p>
          </div>
        </div>
      )}

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-background shadow-sm sm:rounded-3xl">
        <div className="border-b border-border bg-surface-subtle p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <KeyRound className="h-5 w-5" />
            </span>

            <div>
              <h2 className="text-sm font-bold text-foreground sm:text-base">
                Account Security
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Choose a strong password that you
                don't use for another account.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6"
        >
          <PasswordField
            id="current-password"
            label="Current Password"
            value={form.currentPassword}
            show={showCurrent}
            onChange={(value) =>
              updateField(
                "currentPassword",
                value
              )
            }
            onToggle={() =>
              setShowCurrent(
                (current) => !current
              )
            }
            autoComplete="current-password"
          />

          <div className="my-6 border-t border-border" />

          <PasswordField
            id="new-password"
            label="New Password"
            value={form.newPassword}
            show={showNew}
            onChange={(value) =>
              updateField("newPassword", value)
            }
            onToggle={() =>
              setShowNew(
                (current) => !current
              )
            }
            autoComplete="new-password"
          />

          <PasswordRequirements
            requirements={requirements}
          />

          <div className="mt-5">
            <PasswordField
              id="confirm-password"
              label="Confirm New Password"
              value={form.confirmPassword}
              show={showConfirm}
              onChange={(value) =>
                updateField(
                  "confirmPassword",
                  value
                )
              }
              onToggle={() =>
                setShowConfirm(
                  (current) => !current
                )
              }
              autoComplete="new-password"
            />

            {form.confirmPassword && (
              <div className="mt-2">
                {passwordsMatch ? (
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Passwords match
                  </p>
                ) : (
                  <p className="text-[11px] font-semibold text-error">
                    Passwords do not match.
                  </p>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-xs font-semibold leading-5 text-error">
              {error}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <p className="text-xs font-bold text-foreground">
                  Protect your account
                </p>

                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  Never share your Royal Chins
                  password with anyone. We will
                  never ask you to send your
                  password by email, WhatsApp or
                  phone.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Button
              asChild
              type="button"
              variant="secondary"
              className="h-11 rounded-xl px-5"
            >
              <Link href="/account">
                Cancel
              </Link>
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={!canSubmit}
              className="h-11 rounded-xl px-6 font-bold disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LockKeyhole className="mr-2 h-4 w-4" />

              {submitting
                ? "Updating..."
                : "Update Password"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  show,
  onChange,
  onToggle,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  show: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
  autoComplete:
    | "current-password"
    | "new-password";
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-bold text-foreground"
      >
        {label}
        <span className="ml-1 text-error">
          *
        </span>
      </label>

      <div className="relative mt-2">
        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          autoComplete={autoComplete}
          placeholder="Enter password"
          className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            show
              ? `Hide ${label}`
              : `Show ${label}`
          }
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-foreground"
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function PasswordRequirements({
  requirements,
}: {
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
  };
}) {
  const items = [
    {
      label: "At least 8 characters",
      valid: requirements.length,
    },
    {
      label: "One uppercase letter",
      valid: requirements.uppercase,
    },
    {
      label: "One lowercase letter",
      valid: requirements.lowercase,
    },
    {
      label: "One number",
      valid: requirements.number,
    },
  ];

  return (
    <div className="mt-4 rounded-2xl bg-surface-subtle p-4">
      <p className="text-xs font-bold text-foreground">
        Password requirements
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-2 text-[11px] font-medium ${
              item.valid
                ? "text-success"
                : "text-muted-foreground"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                item.valid
                  ? "bg-success/10"
                  : "bg-background"
              }`}
            >
              <Check className="h-3 w-3" />
            </span>

            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
