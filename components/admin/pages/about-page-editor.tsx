"use client";

import {
  useState,
} from "react";

import {
  ImageIcon,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type AboutPageValues = {
  pageTitle: string;
  heading: string;
  description: string;
  image: string;
  status:
    | "Active"
    | "Inactive";
};

type AboutPageEditorProps = {
  initialValues: AboutPageValues;
  onSave: (
    values: AboutPageValues
  ) => Promise<void> | void;
};

export function AboutPageEditor({
  initialValues,
  onSave,
}: AboutPageEditorProps) {
  const [
    form,
    setForm,
  ] =
    useState<AboutPageValues>(
      initialValues
    );

  const [
    errors,
    setErrors,
  ] = useState({
    pageTitle: "",
    heading: "",
    description: "",
  });

  const [
    saving,
    setSaving,
  ] = useState(false);

  const updateField = <
    K extends keyof AboutPageValues,
  >(
    key: K,
    value: AboutPageValues[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    if (
      key === "pageTitle" ||
      key === "heading" ||
      key === "description"
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

        heading:
          form.heading.trim()
            ? ""
            : "Heading is required.",

        description:
          form.description.trim()
            ? ""
            : "Description is required.",
      };

      setErrors(nextErrors);

      if (
        nextErrors.pageTitle ||
        nextErrors.heading ||
        nextErrors.description
      ) {
        return;
      }

      try {
        setSaving(true);

        await onSave({
          ...form,

          pageTitle:
            form.pageTitle.trim(),

          heading:
            form.heading.trim(),

          description:
            form.description.trim(),

          image:
            form.image.trim(),
        });
      } finally {
        setSaving(false);
      }
    };

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            About Page Content
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Manage the main About Royal Chins content shown to customers.
          </p>
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
              placeholder="About Royal Chins"
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
              className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

            <p className="mt-1.5 text-xs text-muted-foreground">
              Inactive content will not be displayed publicly.
            </p>
          </div>

          {/* Heading */}
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Main Heading

              <span className="ml-1 text-error">
                *
              </span>
            </label>

            <Input
              value={
                form.heading
              }
              onChange={(
                event
              ) =>
                updateField(
                  "heading",
                  event.target
                    .value
                )
              }
              placeholder="A Better Way to Find Your Companion"
              className={
                errors.heading
                  ? "border-error"
                  : ""
              }
            />

            {errors.heading && (
              <p className="mt-1.5 text-xs text-error">
                {
                  errors.heading
                }
              </p>
            )}
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <Textarea
              label="Description"
              required
              rows={8}
              value={
                form.description
              }
              onChange={(
                event
              ) =>
                updateField(
                  "description",
                  event.target
                    .value
                )
              }
              placeholder="Enter the About Royal Chins content..."
              error={
                errors.description
              }
            />
          </div>
        </div>
      </section>

      {/* Image */}
      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary">
            <ImageIcon className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              About Image
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Optional image used in the About section.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Image URL / Path
          </label>

          <Input
            value={
              form.image
            }
            onChange={(
              event
            ) =>
              updateField(
                "image",
                event.target
                  .value
              )
            }
            placeholder="/images/about-royal-chins.jpg"
          />

          <p className="mt-1.5 text-xs text-muted-foreground">
            This can later be replaced with your real media upload component.
          </p>
        </div>
      </section>

      {/* Save */}
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