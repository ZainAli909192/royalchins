"use client";

import {
  useState,
} from "react";

import {
  FileText,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type LegalPageValues = {
  pageTitle: string;
  content: string;
  lastUpdated: string;
  status:
    | "Active"
    | "Inactive";
};

type LegalPageEditorProps = {
  type:
    | "privacy"
    | "terms";

  initialValues: LegalPageValues;

  onSave: (
    values: LegalPageValues
  ) => Promise<void> | void;
};

export function LegalPageEditor({
  type,
  initialValues,
  onSave,
}: LegalPageEditorProps) {
  const [
    form,
    setForm,
  ] =
    useState<LegalPageValues>(
      initialValues
    );

  const [
    errors,
    setErrors,
  ] = useState({
    pageTitle: "",
    content: "",
    lastUpdated: "",
  });

  const [
    saving,
    setSaving,
  ] = useState(false);

  const updateField = <
    K extends keyof LegalPageValues,
  >(
    key: K,
    value: LegalPageValues[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    if (
      key === "pageTitle" ||
      key === "content" ||
      key === "lastUpdated"
    ) {
      setErrors(
        (current) => ({
          ...current,
          [key]: "",
        })
      );
    }
  };

  const handleSave =
    async () => {
      const nextErrors = {
        pageTitle:
          form.pageTitle.trim()
            ? ""
            : "Page title is required.",

        content:
          form.content.trim()
            ? ""
            : "Page content is required.",

        lastUpdated:
          form.lastUpdated
            ? ""
            : "Last updated date is required.",
      };

      setErrors(nextErrors);

      if (
        nextErrors.pageTitle ||
        nextErrors.content ||
        nextErrors.lastUpdated
      ) {
        return;
      }

      try {
        setSaving(true);

        await onSave({
          ...form,

          pageTitle:
            form.pageTitle.trim(),

          content:
            form.content.trim(),
        });
      } finally {
        setSaving(false);
      }
    };

  const heading =
    type === "privacy"
      ? "Privacy Policy Content"
      : "Terms & Conditions Content";

  const description =
    type === "privacy"
      ? "Manage the privacy policy displayed to customers."
      : "Manage the terms and conditions displayed to customers.";

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {heading}
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {/* Page Title */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Page Title

              <span className="ml-1 text-error">
                *
              </span>
            </label>

            <Input
              value={
                form.pageTitle
              }
              onChange={(
                event
              ) =>
                updateField(
                  "pageTitle",
                  event.target
                    .value
                )
              }
              placeholder={
                type === "privacy"
                  ? "Privacy Policy"
                  : "Terms & Conditions"
              }
              className={
                errors.pageTitle
                  ? "border-error"
                  : ""
              }
            />

            {errors.pageTitle && (
              <p className="mt-1.5 text-xs text-error">
                {
                  errors.pageTitle
                }
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Status
            </label>

            <select
              value={
                form.status
              }
              onChange={(
                event
              ) =>
                updateField(
                  "status",
                  event.target
                    .value as
                    | "Active"
                    | "Inactive"
                )
              }
              className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* Last Updated */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Last Updated

              <span className="ml-1 text-error">
                *
              </span>
            </label>

            <Input
              type="date"
              value={
                form.lastUpdated
              }
              onChange={(
                event
              ) =>
                updateField(
                  "lastUpdated",
                  event.target
                    .value
                )
              }
              className={
                errors.lastUpdated
                  ? "border-error"
                  : ""
              }
            />

            {errors.lastUpdated && (
              <p className="mt-1.5 text-xs text-error">
                {
                  errors.lastUpdated
                }
              </p>
            )}
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            <Textarea
              label="Page Content"
              required
              rows={18}
              value={
                form.content
              }
              onChange={(
                event
              ) =>
                updateField(
                  "content",
                  event.target
                    .value
                )
              }
              placeholder={
                type === "privacy"
                  ? "Enter the privacy policy..."
                  : "Enter the terms and conditions..."
              }
              error={
                errors.content
              }
            />

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              For the MVP this uses a clean text editor. A rich-text editor can be connected later if required.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col-reverse gap-3 rounded-xl border border-border bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="primary"
          onClick={
            handleSave
          }
          disabled={
            saving
          }
          className="w-full sm:w-auto"
        >
          <span className="flex items-center justify-center gap-2">
            <Save className="h-4 w-4" />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </span>
        </Button>
      </section>
    </div>
  );
}