"use client";

import {
  AtSign,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

import { Input } from "@/components/ui/input";

export type ContactSettings = {
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
};

type ContactSettingsFormProps = {
  values: ContactSettings;
  onChange: (
    values: ContactSettings
  ) => void;
};

export function ContactSettingsForm({
  values,
  onChange,
}: ContactSettingsFormProps) {
  const updateField = <
    K extends keyof ContactSettings,
  >(
    key: K,
    value: ContactSettings[K]
  ) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  return (
    <section className="rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Phone className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Contact Details
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Manage customer-facing contact details used across the Royal Chins website.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Email Address
            <span className="ml-1 text-error">*</span>
          </label>

          <Input
            type="email"
            value={values.email}
            onChange={(event) =>
              updateField(
                "email",
                event.target.value
              )
            }
            placeholder="hello@royalchins.ae"
            leftIcon={
              <Mail className="h-5 w-5" />
            }
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Phone Number
            <span className="ml-1 text-error">*</span>
          </label>

          <Input
            type="tel"
            value={values.phone}
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
        </div>

        {/* WhatsApp */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            WhatsApp Number
          </label>

          <Input
            type="tel"
            value={values.whatsapp}
            onChange={(event) =>
              updateField(
                "whatsapp",
                event.target.value
              )
            }
            placeholder="+971 50 000 0000"
            leftIcon={
              <MessageCircle className="h-5 w-5" />
            }
          />

          <p className="mt-1.5 text-xs text-muted-foreground">
            Use the international UAE format including +971.
          </p>
        </div>

        {/* Instagram */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Instagram
          </label>

          <Input
            value={values.instagram}
            onChange={(event) =>
              updateField(
                "instagram",
                event.target.value
              )
            }
            placeholder="@royalchins"
            leftIcon={
              <AtSign className="h-5 w-5" />
            }
          />
        </div>
      </div>
    </section>
  );
}