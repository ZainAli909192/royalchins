"use client";

import {
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";

import {
  AboutPageEditor,
  type AboutPageValues,
} from "@/components/admin/pages/about-page-editor";

import {
  LegalPageEditor,
  type LegalPageValues,
} from "@/components/admin/pages/legal-page-editor";

import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";

const aboutPage: AboutPageValues = {
  pageTitle:
    "About Royal Chins",

  heading:
    "A Better Way to Find Your Companion",

  description:
    "Royal Chins connects customers with carefully presented animals and quality accessories through a simple and trusted online experience.",

  image:
    "/images/about-royal-chins.jpg",

  status:
    "Active",
};

const privacyPage: LegalPageValues = {
  pageTitle:
    "Privacy Policy",

  content:
    `Royal Chins respects your privacy and is committed to protecting the personal information you provide when using our website.

Information We Collect

We may collect information such as your name, email address, phone number, delivery address and payment-related information required to process your order.

How We Use Your Information

Your information may be used to process purchases, arrange delivery, provide customer support and maintain your account.

Payment Information

Payments are processed through supported payment providers. Royal Chins does not store complete card details.

Customer Reviews

Verified customers may submit reviews related to products they have purchased.

Contact

Customers may contact Royal Chins regarding privacy-related questions through the official contact methods provided on the website.`,

  lastUpdated:
    "2026-08-25",

  status:
    "Active",
};

const termsPage: LegalPageValues = {
  pageTitle:
    "Terms & Conditions",

  content:
    `These Terms & Conditions govern the use of the Royal Chins website and purchases made through the platform.

Orders

Customers must provide accurate account, delivery and payment information when placing an order.

Product Availability

All animals and accessories are subject to availability. Availability may change before an order is successfully completed.

Payments

Orders must be paid through the supported online payment methods available during checkout.

Delivery

Delivery is currently provided within supported locations in the UAE. Applicable delivery charges are shown during checkout.

Cancellations and Refunds

Cancellation and refund requests are subject to review and the applicable Royal Chins policies.

Reviews

Only eligible verified customers may submit product reviews. Reviews may be moderated according to the configured review moderation policy.

Changes to These Terms

Royal Chins may update these Terms & Conditions when required.`,

  lastUpdated:
    "2026-08-25",

  status:
    "Active",
};

export default function EditContentPage() {
  const params =
    useParams();

  const router =
    useRouter();

  const slug =
    String(
      params.slug ?? ""
    );

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const pageConfig =
    getPageConfig(slug);

  if (!pageConfig) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Page Not Found"
          description="The requested content page does not exist."
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(
                  "/admin/pages"
                )
              }
            >
              <span className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />

                Back
              </span>
            </Button>
          }
        />

        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            Invalid page
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            This page cannot be edited because the supplied page slug is not recognised.
          </p>
        </section>
      </div>
    );
  }

  const handleAboutSave =
    async (
      values: AboutPageValues
    ) => {
      setSuccessMessage("");
      setErrorMessage("");

      try {
        /*
         * BACKEND LATER:
         *
         * await updatePage(
         *   "about",
         *   values
         * );
         */

        console.log(
          "Save About Page:",
          values
        );

        setSuccessMessage(
          "About page updated successfully."
        );
      } catch {
        setErrorMessage(
          "Unable to update the About page."
        );
      }
    };

  const handleLegalSave =
    async (
      values: LegalPageValues
    ) => {
      setSuccessMessage("");
      setErrorMessage("");

      try {
        /*
         * BACKEND LATER:
         *
         * await updatePage(
         *   slug,
         *   values
         * );
         */

        console.log(
          `Save ${slug}:`,
          values
        );

        setSuccessMessage(
          `${
            pageConfig.title
          } updated successfully.`
        );
      } catch {
        setErrorMessage(
          `Unable to update ${pageConfig.title}.`
        );
      }
    };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title={
          pageConfig.title
        }
        description={
          pageConfig.description
        }
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(
                "/admin/pages"
              )
            }
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              <ArrowLeft className="h-4 w-4" />

              Back
            </span>
          </Button>
        }
      />

      {/* Success */}
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

      {/* Error */}
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

      {/* About */}
      {slug === "about" && (
        <AboutPageEditor
          initialValues={
            aboutPage
          }
          onSave={
            handleAboutSave
          }
        />
      )}

      {/* Privacy */}
      {slug ===
        "privacy-policy" && (
        <LegalPageEditor
          type="privacy"
          initialValues={
            privacyPage
          }
          onSave={
            handleLegalSave
          }
        />
      )}

      {/* Terms */}
      {slug === "terms" && (
        <LegalPageEditor
          type="terms"
          initialValues={
            termsPage
          }
          onSave={
            handleLegalSave
          }
        />
      )}
    </div>
  );
}

function getPageConfig(
  slug: string
) {
  if (slug === "about") {
    return {
      title:
        "Edit About Royal Chins",

      description:
        "Manage the customer-facing About page content.",
    };
  }

  if (
    slug ===
    "privacy-policy"
  ) {
    return {
      title:
        "Edit Privacy Policy",

      description:
        "Manage the privacy policy displayed on the website.",
    };
  }

  if (slug === "terms") {
    return {
      title:
        "Edit Terms & Conditions",

      description:
        "Manage the website terms and conditions.",
    };
  }

  return null;
}