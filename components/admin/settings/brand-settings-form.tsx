"use client";

import {
  ChangeEvent,
  useRef,
} from "react";

import {
  ImageIcon,
  Palette,
  RotateCcw,
  Store,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  applyBrandColors,
} from "@/lib/settings/brand-settings";

export type BrandSettings = {
  storeName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
};

type BrandSettingsFormProps = {
  values: BrandSettings;

  onChange: (
    values: BrandSettings
  ) => void;
};

const DEFAULT_PRIMARY_COLOR =
  "#6F3CC3";

const DEFAULT_SECONDARY_COLOR =
  "#000000";

export function BrandSettingsForm({
  values,
  onChange,
}: BrandSettingsFormProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const updateField = <
    K extends keyof BrandSettings,
  >(
    key: K,
    value: BrandSettings[K]
  ) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  const handleLogoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/svg+xml",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        "Please upload PNG, JPG, WEBP or SVG."
      );

      event.target.value = "";

      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      alert(
        "Logo must be smaller than 2MB."
      );

      event.target.value = "";

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result ===
        "string"
      ) {
        updateField(
          "logo",
          reader.result
        );
      }
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const removeLogo = () => {
    updateField(
      "logo",
      ""
    );
  };

  const resetColors = () => {
    const nextValues = {
      ...values,

      primaryColor:
        DEFAULT_PRIMARY_COLOR,

      secondaryColor:
        DEFAULT_SECONDARY_COLOR,
    };

    onChange(
      nextValues
    );

    applyBrandColors(
      DEFAULT_PRIMARY_COLOR,
      DEFAULT_SECONDARY_COLOR
    );
  };

  const colorsAreDefault =
    values.primaryColor.toLowerCase() ===
      DEFAULT_PRIMARY_COLOR.toLowerCase() &&
    values.secondaryColor.toLowerCase() ===
      DEFAULT_SECONDARY_COLOR.toLowerCase();

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Store & Brand
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Manage the Royal Chins name, logo and website brand colors.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-7 p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Store Name

              <span className="ml-1 text-error">
                *
              </span>
            </label>

            <Input
              value={
                values.storeName
              }
              onChange={(
                event
              ) =>
                updateField(
                  "storeName",
                  event.target.value
                )
              }
              placeholder="Royal Chins"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Store Logo
            </label>

            <div className="rounded-xl border border-border p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-[100px] w-[160px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-3">
                  {values.logo ? (
                    <img
                      src={
                        values.logo
                      }
                      alt={
                        values.storeName ||
                        "Royal Chins"
                      }
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {values.logo
                      ? "Current Logo"
                      : "No logo uploaded"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    PNG, JPG, WEBP or SVG. Maximum 2MB.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      <span className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />

                        {values.logo
                          ? "Change Logo"
                          : "Upload Logo"}
                      </span>
                    </Button>

                    {values.logo && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={
                          removeLogo
                        }
                        className="text-error hover:border-error hover:bg-[var(--error-background)] hover:text-error"
                      >
                        <span className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4" />

                          Remove
                        </span>
                      </Button>
                    )}
                  </div>

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={
                      handleLogoChange
                    }
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Palette className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Brand Colors
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  These colors will be applied across the website after saving.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={
                resetColors
              }
              disabled={
                colorsAreDefault
              }
              className="w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <RotateCcw className="h-4 w-4" />

                Reset Colors
              </span>
            </Button>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Primary Color
              </label>

              <div className="flex gap-3">
                <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-xl border border-border">
                  <input
                    type="color"
                    value={
                      values.primaryColor
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "primaryColor",
                        event.target.value
                      )
                    }
                    className="absolute inset-[-8px] h-[64px] w-[72px] cursor-pointer"
                    aria-label="Primary color"
                  />
                </div>

                <Input
                  value={
                    values.primaryColor
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "primaryColor",
                      event.target.value
                    )
                  }
                  placeholder="#6F3CC3"
                />
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground">
                Default:{" "}
                {DEFAULT_PRIMARY_COLOR}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Secondary Color
              </label>

              <div className="flex gap-3">
                <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-xl border border-border">
                  <input
                    type="color"
                    value={
                      values.secondaryColor
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "secondaryColor",
                        event.target.value
                      )
                    }
                    className="absolute inset-[-8px] h-[64px] w-[72px] cursor-pointer"
                    aria-label="Secondary color"
                  />
                </div>

                <Input
                  value={
                    values.secondaryColor
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "secondaryColor",
                      event.target.value
                    )
                  }
                  placeholder="#000000"
                />
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground">
                Default:{" "}
                {DEFAULT_SECONDARY_COLOR}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 sm:p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-[110px] w-[170px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-4">
              {values.logo ? (
                <img
                  src={
                    values.logo
                  }
                  alt={
                    values.storeName ||
                    "Royal Chins"
                  }
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <ImageIcon className="h-7 w-7 text-muted-foreground" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />

                <span className="text-sm font-semibold text-foreground">
                  Brand Preview
                </span>
              </div>

              <p className="mt-3 text-xl font-bold text-foreground">
                {values.storeName ||
                  "Royal Chins"}
              </p>

              <div className="mt-4 flex flex-wrap gap-4">
                <div>
                  <div
                    className="h-10 w-20 rounded-xl border border-border"
                    style={{
                      backgroundColor:
                        values.primaryColor,
                    }}
                  />

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Primary
                  </p>
                </div>

                <div>
                  <div
                    className="h-10 w-20 rounded-xl border border-border"
                    style={{
                      backgroundColor:
                        values.secondaryColor,
                    }}
                  />

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Secondary
                  </p>
                </div>
              </div>

              {!colorsAreDefault && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Custom brand colors are selected. Reset Colors restores the Royal Chins defaults.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}