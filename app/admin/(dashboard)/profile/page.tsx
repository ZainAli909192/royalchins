"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Camera,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/forms/password-input";
import { FormAlert } from "@/components/forms/form-alert";

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type FormErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

const initialProfile: ProfileForm = {
  fullName: "",
  email: "",
  phone: "",
  role: "Owner / Admin",
  avatar: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ProfilePage() {
  const [form, setForm] =
    useState<ProfileForm>(initialProfile);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [saving, setSaving] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [loading, setLoading] = useState(true);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then(async (response) => ({ response, data: await response.json().catch(() => null) }))
      .then(({ response, data }) => {
        if (!response.ok) throw new Error(data?.message ?? "Unable to load your profile.");
        setForm((current) => ({ ...current, fullName: data.fullName, email: data.email, phone: data.phone ?? "", avatar: data.avatar ?? "", role: data.role ?? current.role }));
      })
      .catch((error) => setErrorMessage(error instanceof Error ? error.message : "Unable to load your profile."))
      .finally(() => setLoading(false));
  }, []);

  const updateField = <K extends keyof ProfileForm>(
    key: K,
    value: ProfileForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleAvatarChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        "Please upload a PNG, JPG or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage(
        "Profile image must be smaller than 2MB."
      );

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("avatar", reader.result);
      }
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const removeAvatar = () => {
    updateField("avatar", "");
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName =
        "Full name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone =
        "Phone number is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const profilePayload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        avatar: form.avatar,
      };

      const response = await fetch("/api/admin/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profilePayload) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message ?? "Unable to save your changes.");

      setForm((current) => ({
        ...current, fullName: data.fullName, email: data.email, phone: data.phone ?? "", avatar: data.avatar ?? "",
      }));

      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    const nextErrors: FormErrors = {};
    if (!form.currentPassword) nextErrors.currentPassword = "Current password is required.";
    if (!form.newPassword) nextErrors.newPassword = "New password is required.";
    else if (form.newPassword.length < 8) nextErrors.newPassword = "Password must be at least 8 characters.";
    else if (form.newPassword === form.currentPassword) nextErrors.newPassword = "New password must be different from the current password.";
    if (!form.confirmPassword) nextErrors.confirmPassword = "Please confirm your new password.";
    else if (form.newPassword !== form.confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setSaving(true);
      const response = await fetch("/api/admin/profile/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword, confirmPassword: form.confirmPassword }) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message ?? "Unable to update your password.");
      setForm((current) => ({ ...current, currentPassword: "", newPassword: "", confirmPassword: "" }));
      setSuccessMessage(data.message ?? "Password updated successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update your password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Profile"
        description="Manage your admin account information and password."
      />

      {loading && <p className="rounded-xl border border-border bg-white p-5 text-sm text-muted-foreground">Loading profile…</p>}

      {!loading && successMessage && (
        <FormAlert
          variant="success"
          message={successMessage}
          onClose={() =>
            setSuccessMessage("")
          }
        />
      )}

      {!loading && errorMessage && (
        <FormAlert
          variant="error"
          message={errorMessage}
          onClose={() =>
            setErrorMessage("")
          }
        />
      )}

      {!loading && <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-start">
            <div className="flex shrink-0 flex-col items-center lg:w-[190px]">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-subtle">
                  {form.avatar ? (
                    <img
                      src={form.avatar}
                      alt={form.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-primary text-white shadow-sm transition hover:opacity-90"
                  aria-label="Change profile photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-3 text-sm font-semibold text-foreground">
                {form.fullName ||
                  "Royal Chins Admin"}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {form.role}
              </p>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                Change Photo
              </button>

              {form.avatar && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="mt-1 text-xs font-medium text-error hover:underline"
                >
                  Remove Photo
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <p className="mt-2 text-center text-[11px] leading-4 text-muted-foreground">
                PNG, JPG or WEBP
                <br />
                Maximum 2MB
              </p>
            </div>

            <div className="min-w-0 flex-1">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Full Name
                    <span className="ml-1 text-error">
                      *
                    </span>
                  </label>

                  <Input
                    value={form.fullName}
                    onChange={(event) =>
                      updateField(
                        "fullName",
                        event.target.value
                      )
                    }
                    placeholder="Full name"
                    leftIcon={
                      <User className="h-5 w-5" />
                    }
                  />

                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-error">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Email Address
                    <span className="ml-1 text-error">
                      *
                    </span>
                  </label>

                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="admin@royalchins.ae"
                    leftIcon={
                      <Mail className="h-5 w-5" />
                    }
                  />

                  {errors.email && (
                    <p className="mt-1.5 text-xs text-error">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Phone Number
                    <span className="ml-1 text-error">
                      *
                    </span>
                  </label>

                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                    placeholder="+971 50 000 0000"
                    leftIcon={
                      <Phone className="h-5 w-5" />
                    }
                  />

                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-error">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Role
                  </label>

                  <Input
                    value={form.role}
                    disabled
                    leftIcon={
                      <ShieldCheck className="h-5 w-5" />
                    }
                    className="cursor-not-allowed bg-surface-subtle"
                  />

                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Account role cannot be changed.
                  </p>
                </div>

                <div>
                  <PasswordInput
                    label="Current Password"
                    value={
                      form.currentPassword
                    }
                    onChange={(event) =>
                      updateField(
                        "currentPassword",
                        event.target.value
                      )
                    }
                    error={
                      errors.currentPassword
                    }
                  />
                </div>

                <div>
                  <PasswordInput
                    label="New Password"
                    value={form.newPassword}
                    onChange={(event) =>
                      updateField(
                        "newPassword",
                        event.target.value
                      )
                    }
                    error={
                      errors.newPassword
                    }
                    helperText="Use the Update Password button below to save a password change."
                  />
                </div>

                <div className="md:col-span-2 md:max-w-[calc(50%-0.625rem)]">
                  <PasswordInput
                    label="Confirm New Password"
                    value={
                      form.confirmPassword
                    }
                    onChange={(event) =>
                      updateField(
                        "confirmPassword",
                        event.target.value
                      )
                    }
                    error={
                      errors.confirmPassword
                    }
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  {saving
                    ? "Saving..."
                    : "Save Profile"}
                </Button>
                <Button type="button" variant="outline" onClick={handlePasswordSave} disabled={saving} className="w-full sm:w-auto">
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}
