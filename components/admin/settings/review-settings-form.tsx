"use client";

import {
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export type ReviewSettings = {
  autoApproveReviews: boolean;
};

type ReviewSettingsFormProps = {
  values: ReviewSettings;
  onChange: (
    values: ReviewSettings
  ) => void;
};

export function ReviewSettingsForm({
  values,
  onChange,
}: ReviewSettingsFormProps) {
  return (
    <section className="rounded-xl border border-border bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Review Settings
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Configure how verified customer reviews are moderated.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Auto Approve Reviews
              </h3>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  values.autoApproveReviews
                    ? "bg-[var(--success-background)] text-success"
                    : "bg-[var(--warning-background)] text-warning"
                }`}
              >
                {values.autoApproveReviews
                  ? "Enabled"
                  : "Manual Approval"}
              </span>
            </div>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {values.autoApproveReviews
                ? "New verified customer reviews will be approved and published automatically."
                : "New customer reviews will remain pending until an administrator approves or rejects them."}
            </p>
          </div>

          {/* Toggle */}
          <label className="flex shrink-0 cursor-pointer items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              {values.autoApproveReviews
                ? "On"
                : "Off"}
            </span>

            <input
              type="checkbox"
              checked={
                values.autoApproveReviews
              }
              onChange={(event) =>
                onChange({
                  ...values,

                  autoApproveReviews:
                    event.target.checked,
                })
              }
              className="peer sr-only"
            />

            <span className="relative h-6 w-11 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20">
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
            </span>
          </label>
        </div>

        {values.autoApproveReviews && (
          <div className="mt-4 rounded-xl border border-success/20 bg-[var(--success-background)] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />

              <div>
                <p className="text-sm font-semibold text-success">
                  Automatic moderation is active
                </p>

                <p className="mt-1 text-sm leading-6 text-success">
                  This only affects new reviews. Existing pending reviews are not automatically changed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}