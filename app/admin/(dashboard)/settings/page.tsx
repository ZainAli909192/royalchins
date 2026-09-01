"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Save,
  Settings,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";

import {
  BrandSettingsForm,
  type BrandSettings,
} from "@/components/admin/settings/brand-settings-form";

import {
  ContactSettingsForm,
  type ContactSettings,
} from "@/components/admin/settings/contact-settings-form";

import {
  InventorySettingsForm,
  type InventorySettings,
} from "@/components/admin/settings/inventory-settings-form";

import {
  ReviewSettingsForm,
  type ReviewSettings,
} from "@/components/admin/settings/review-settings-form";

import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { getSettings, updateSettings } from "@/lib/api/settings";
import { applyBrandColors } from "@/lib/settings/brand-settings";

const initialBrandSettings: BrandSettings = {
  storeName: "Royal Chins",
  logo: "/logo.png",
  primaryColor: "#6F3CC3",
  secondaryColor: "#000000",
};

const initialContactSettings: ContactSettings = {
  email:
    "hello@royalchins.ae",

  phone:
    "+971 50 000 0000",

  whatsapp:
    "+971 50 000 0000",

  instagram:
    "@royalchins",
};

const initialInventorySettings: InventorySettings = {
  lowStockThreshold: 2,
  hideOutOfStock: false,
};

const initialReviewSettings: ReviewSettings = {
  autoApproveReviews: false,
};

export default function SettingsPage() {
  const [
    brandSettings,
    setBrandSettings,
  ] =
    useState<BrandSettings>(
      initialBrandSettings
    );

  const [
    contactSettings,
    setContactSettings,
  ] =
    useState<ContactSettings>(
      initialContactSettings
    );

  const [
    inventorySettings,
    setInventorySettings,
  ] =
    useState<InventorySettings>(
      initialInventorySettings
    );

  const [
    reviewSettings,
    setReviewSettings,
  ] =
    useState<ReviewSettings>(
      initialReviewSettings
    );

  const [
    settingsLoaded,
    setSettingsLoaded,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    getSettings().then((data: unknown) => {
      const saved = data as { brand: BrandSettings; contact: ContactSettings; inventory: InventorySettings; reviews: ReviewSettings };
      setBrandSettings(saved.brand);
      setContactSettings(saved.contact);
      setInventorySettings(saved.inventory);
      setReviewSettings(saved.reviews);
      applyBrandColors(saved.brand.primaryColor, saved.brand.secondaryColor);
    }).catch((error: unknown) => setErrorMessage(
      error instanceof Error
        ? error.message
        : "Unable to load settings. Please refresh and try again."
    )).finally(() => setSettingsLoaded(true));
  }, []);

  const validateSettings = () => {
    if (
      !brandSettings.storeName.trim()
    ) {
      setErrorMessage(
        "Store name is required."
      );

      return false;
    }

    if (
      !brandSettings.primaryColor.trim()
    ) {
      setErrorMessage(
        "Primary color is required."
      );

      return false;
    }

    if (
      !brandSettings.secondaryColor.trim()
    ) {
      setErrorMessage(
        "Secondary color is required."
      );

      return false;
    }

    if (
      !contactSettings.email.trim()
    ) {
      setErrorMessage(
        "Email address is required."
      );

      return false;
    }

    if (
      !contactSettings.phone.trim()
    ) {
      setErrorMessage(
        "Phone number is required."
      );

      return false;
    }

    if (
      inventorySettings.lowStockThreshold <
      0
    ) {
      setErrorMessage(
        "Low stock threshold cannot be negative."
      );

      return false;
    }

    return true;
  };

  const handleSave =
    async () => {
      setSuccessMessage("");
      setErrorMessage("");

      if (
        !validateSettings()
      ) {
        return;
      }

      try {
        setSaving(true);

        await updateSettings({ brand: brandSettings, contact: contactSettings, inventory: inventorySettings, reviews: reviewSettings });

        applyBrandColors(
          brandSettings.primaryColor,
          brandSettings.secondaryColor
        );

        window.dispatchEvent(new Event("royalchins-settings-updated"));

        setSuccessMessage(
          "Settings saved successfully."
        );
      } catch {
        setErrorMessage(
          "Unable to save settings. Please try again."
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Manage Royal Chins store, contact, inventory and review settings."
        action={
          <Button
            type="button"
            variant="primary"
            onClick={
              handleSave
            }
            disabled={
              saving ||
              !settingsLoaded
            }
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Save className="h-4 w-4" />

              {saving
                ? "Saving..."
                : "Save Settings"}
            </span>
          </Button>
        }
      />

      {successMessage && (
        <FormAlert
          variant="success"
          message={
            successMessage
          }
          onClose={() =>
            setSuccessMessage("")
          }
        />
      )}

      {errorMessage && (
        <FormAlert
          variant="error"
          message={
            errorMessage
          }
          onClose={() =>
            setErrorMessage("")
          }
        />
      )}

      <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary">
            <Settings className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">
              Global Configuration
            </h2>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
              Changes made here affect customer-facing website information and admin operational behavior.
            </p>
          </div>
        </div>
      </section>

      <BrandSettingsForm
        values={
          brandSettings
        }
        onChange={
          setBrandSettings
        }
      />

      <ContactSettingsForm
        values={
          contactSettings
        }
        onChange={
          setContactSettings
        }
      />

      <InventorySettingsForm
        values={
          inventorySettings
        }
        onChange={
          setInventorySettings
        }
      />

      {settingsLoaded && (
        <ReviewSettingsForm
          values={
            reviewSettings
          }
          onChange={
            setReviewSettings
          }
        />
      )}

      <section className="sticky bottom-4 z-20 rounded-xl border border-border bg-white/95 p-3 shadow-lg backdrop-blur sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Save your changes before leaving this page.
          </p>

          <Button
            type="button"
            variant="primary"
            onClick={
              handleSave
            }
            disabled={
              saving ||
              !settingsLoaded
            }
            className="w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />

              {saving
                ? "Saving..."
                : "Save Settings"}
            </span>
          </Button>
        </div>
      </section>
    </div>
  );
}
