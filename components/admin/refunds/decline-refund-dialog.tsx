"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  TriangleAlert,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type DeclineRefundDialogProps = {
  open: boolean;

  refundNumber: string;
  orderNumber: string;
  customerName: string;

  onClose: () => void;

  onConfirm: (
    reason: string,
    notes: string
  ) => Promise<void> | void;
};

export function DeclineRefundDialog({
  open,
  refundNumber,
  orderNumber,
  customerName,
  onClose,
  onConfirm,
}: DeclineRefundDialogProps) {
  const [reason, setReason] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (open) {
      setReason("");
      setNotes("");
      setError("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleDecline =
    async () => {
      setError("");

      if (!reason) {
        setError(
          "Please select a decline reason."
        );

        return;
      }

      try {
        setLoading(true);

        await onConfirm(
          reason,
          notes.trim()
        );
      } catch {
        setError(
          "Unable to decline refund. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
        aria-label="Close decline refund dialog"
      />

      <div className="relative z-10 max-h-[calc(100dvh-32px)] w-full max-w-[520px] overflow-y-auto rounded-2xl border border-border bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--error-background)] text-error">
              <TriangleAlert className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground">
                Decline Refund
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                A reason is required when declining a refund.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-subtle hover:text-foreground disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-xl bg-surface-subtle p-4">
            <p className="font-semibold text-foreground">
              {refundNumber}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Order #{orderNumber}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {customerName}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Decline Reason
              <span className="ml-1 text-error">
                *
              </span>
            </label>

            <select
              value={reason}
              onChange={(event) =>
                setReason(
                  event.target.value
                )
              }
              disabled={loading}
              className={`h-12 w-full rounded-lg border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                error
                  ? "border-error"
                  : "border-border"
              }`}
            >
              <option value="">
                Select reason
              </option>

              <option value="not-eligible">
                Refund not eligible
              </option>

              <option value="already-fulfilled">
                Order already fulfilled
              </option>

              <option value="outside-policy">
                Request outside refund policy
              </option>

              <option value="invalid-claim">
                Invalid claim
              </option>

              <option value="duplicate-request">
                Duplicate request
              </option>

              <option value="other">
                Other
              </option>
            </select>

            {error && (
              <p className="mt-1.5 text-sm text-error">
                {error}
              </p>
            )}
          </div>

          <Textarea
            label="Notes"
            placeholder="Add optional internal notes..."
            rows={4}
            value={notes}
            onChange={(event) =>
              setNotes(
                event.target.value
              )
            }
            disabled={loading}
            helperText="These notes are for admin reference."
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Keep Requested
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleDecline}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading
              ? "Declining..."
              : "Decline Refund"}
          </Button>
        </div>
      </div>
    </div>
  );
}