"use client";

import { useEffect, useState } from "react";
import { HelpCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type FaqStatus =
  | "Active"
  | "Inactive";

export type FaqFormValues = {
  category: string;
  question: string;
  answer: string;
  status: FaqStatus;
};

type FaqFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: FaqFormValues;
  onClose: () => void;
  onSubmit: (
    values: FaqFormValues
  ) => void;
};

const emptyValues: FaqFormValues = {
  category: "",
  question: "",
  answer: "",
  status: "Active",
};

export function FaqFormDialog({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
}: FaqFormDialogProps) {
  const [form, setForm] =
    useState<FaqFormValues>(
      emptyValues
    );

  const [errors, setErrors] =
    useState({
      category: "",
      question: "",
      answer: "",
    });

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(
      initialValues ??
        emptyValues
    );

    setErrors({
      category: "",
      question: "",
      answer: "",
    });
  }, [
    open,
    initialValues,
  ]);

  if (!open) {
    return null;
  }

  const updateField = <
    K extends keyof FaqFormValues,
  >(
    key: K,
    value: FaqFormValues[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    if (
      key === "category" ||
      key === "question" ||
      key === "answer"
    ) {
      setErrors(
        (current) => ({
          ...current,
          [key]: "",
        })
      );
    }
  };

  const handleSubmit = () => {
    const nextErrors = {
      category:
        form.category.trim()
          ? ""
          : "Category is required.",

      question:
        form.question.trim()
          ? ""
          : "Question is required.",

      answer:
        form.answer.trim()
          ? ""
          : "Answer is required.",
    };

    setErrors(nextErrors);

    if (
      nextErrors.category ||
      nextErrors.question ||
      nextErrors.answer
    ) {
      return;
    }

    onSubmit({
      category:
        form.category.trim(),

      question:
        form.question.trim(),

      answer:
        form.answer.trim(),

      status: form.status,
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        aria-label="Close FAQ dialog"
      />

      {/* Dialog */}
      <div className="relative z-10 flex max-h-[calc(100dvh-32px)] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HelpCircle className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-foreground">
                {mode === "edit"
                  ? "Edit FAQ"
                  : "Add FAQ"}
              </h2>

              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {mode === "edit"
                  ? "Update the frequently asked question."
                  : "Create a new frequently asked question."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="space-y-5">
            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Category

                <span className="ml-1 text-error">
                  *
                </span>
              </label>

              <Input
                value={
                  form.category
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "category",
                    event.target
                      .value
                  )
                }
                placeholder="e.g. Orders"
                className={
                  errors.category
                    ? "border-error"
                    : ""
                }
              />

              {errors.category && (
                <p className="mt-1.5 text-xs text-error">
                  {
                    errors.category
                  }
                </p>
              )}
            </div>

            {/* Question */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Question

                <span className="ml-1 text-error">
                  *
                </span>
              </label>

              <Input
                value={
                  form.question
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "question",
                    event.target
                      .value
                  )
                }
                placeholder="Enter question"
                className={
                  errors.question
                    ? "border-error"
                    : ""
                }
              />

              {errors.question && (
                <p className="mt-1.5 text-xs text-error">
                  {
                    errors.question
                  }
                </p>
              )}
            </div>

            {/* Answer */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Answer

                <span className="ml-1 text-error">
                  *
                </span>
              </label>

              <textarea
                rows={6}
                value={form.answer}
                onChange={(
                  event
                ) =>
                  updateField(
                    "answer",
                    event.target
                      .value
                  )
                }
                placeholder="Enter answer"
                className={`w-full resize-none rounded-lg border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                  errors.answer
                    ? "border-error"
                    : "border-border"
                }`}
              />

              {errors.answer && (
                <p className="mt-1.5 text-xs text-error">
                  {errors.answer}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Status
              </label>

              <select
                value={form.status}
                onChange={(
                  event
                ) =>
                  updateField(
                    "status",
                    event.target
                      .value as FaqStatus
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

              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                Inactive FAQs will not be shown to customers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-border bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={
              handleSubmit
            }
            className="w-full sm:w-auto"
          >
            {mode === "edit"
              ? "Update FAQ"
              : "Add FAQ"}
          </Button>
        </div>
      </div>
    </div>
  );
}