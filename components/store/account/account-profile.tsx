"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const initialProfile: ProfileForm = {
  firstName: "Ahmed",
  lastName: "Daniyal",
  email: "ahmed@example.com",
  phone: "50 780 1110",
};

export function AccountProfile() {
  const [form, setForm] =
    useState<ProfileForm>(initialProfile);

  const [savedProfile, setSavedProfile] =
    useState<ProfileForm>(initialProfile);

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const hasChanges =
    JSON.stringify(form) !==
    JSON.stringify(savedProfile);

  function updateField(
    field: keyof ProfileForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSaved(false);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim().toLowerCase();

    const cleanPhone = form.phone
      .replace(/\D/g, "")
      .replace(/^971/, "")
      .replace(/^0/, "");

    if (!firstName || !lastName || !email) {
      setError(
        "Please complete all required fields."
      );
      return;
    }

    if (!isValidEmail(email)) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (cleanPhone.length !== 9) {
      setError(
        "Please enter a valid UAE mobile number."
      );
      return;
    }

    const updatedProfile: ProfileForm = {
      firstName,
      lastName,
      email,
      phone: formatPhone(cleanPhone),
    };

    setForm(updatedProfile);
    setSavedProfile(updatedProfile);
    setError("");
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 4000);
  }

  function handleCancelChanges() {
    setForm(savedProfile);
    setError("");
    setSaved(false);
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
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
          Profile Information
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Manage the personal and contact
          information associated with your
          Royal Chins account.
        </p>
      </header>

      {saved && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-success/20 bg-success/5 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />

          <div>
            <p className="text-sm font-bold text-foreground">
              Profile updated
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Your account information has been
              saved successfully.
            </p>
          </div>
        </div>
      )}

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-background shadow-sm sm:rounded-3xl">
        <ProfileHeader
          firstName={savedProfile.firstName}
          lastName={savedProfile.lastName}
          email={savedProfile.email}
        />

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="First Name"
              required
            >
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  value={form.firstName}
                  onChange={(event) =>
                    updateField(
                      "firstName",
                      event.target.value
                    )
                  }
                  autoComplete="given-name"
                  placeholder="First name"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </FormField>

            <FormField
              label="Last Name"
              required
            >
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  value={form.lastName}
                  onChange={(event) =>
                    updateField(
                      "lastName",
                      event.target.value
                    )
                  }
                  autoComplete="family-name"
                  placeholder="Last name"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </FormField>

            <div className="sm:col-span-2">
              <FormField
                label="Email Address"
                required
              >
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </FormField>
            </div>

            <div className="sm:col-span-2">
              <FormField
                label="Mobile Number"
                required
              >
                <div className="flex h-12 overflow-hidden rounded-xl border border-border bg-background transition-colors focus-within:border-primary">
                  <span className="flex shrink-0 items-center gap-2 border-r border-border bg-surface-subtle px-3 text-sm font-semibold text-foreground">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    +971
                  </span>

                  <input
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="50 123 4567"
                    className="min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </FormField>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-xs font-semibold text-error">
              {error}
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-surface-subtle p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </span>

              <div>
                <p className="text-xs font-bold text-foreground">
                  Keep your contact details
                  current
                </p>

                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  Your email and mobile number
                  may be used for important
                  order and delivery updates.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/account/change-password"
              className="flex h-11 items-center justify-center rounded-xl px-4 text-sm font-bold text-primary transition-colors hover:bg-primary/5 sm:justify-start"
            >
              Change Password
            </Link>

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              {hasChanges && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancelChanges}
                  className="h-11 rounded-xl px-5"
                >
                  Cancel Changes
                </Button>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={!hasChanges}
                className="h-11 rounded-xl px-6 font-bold disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

function ProfileHeader({
  firstName,
  lastName,
  email,
}: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(
      0
    )}`.toUpperCase();

  return (
    <div className="border-b border-border bg-surface-subtle p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground sm:h-20 sm:w-20 sm:text-2xl">
          {initials}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-foreground sm:text-xl">
            {firstName} {lastName}
          </h2>

          <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
            {email}
          </p>

          <span className="mt-2 inline-flex rounded-full bg-success/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-success">
            Active Account
          </span>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-foreground">
        {label}

        {required && (
          <span className="ml-1 text-error">
            *
          </span>
        )}
      </span>

      <div className="mt-2">
        {children}
      </div>
    </label>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

function formatPhone(value: string) {
  if (value.length !== 9) {
    return value;
  }

  return `${value.slice(
    0,
    2
  )} ${value.slice(
    2,
    5
  )} ${value.slice(5)}`;
}

const inputClass =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
  