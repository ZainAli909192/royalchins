
"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CancelOrderDialogProps = {
  open: boolean;
  orderNumber: string;
  customerName: string;
  onClose: () => void;
  onConfirm: (
    reason: string,
    notes: string
  ) => Promise<void> | void;
};

export  function CancelOrderDialog({
  open,
  orderNumber,
  customerName,
  onClose,
  onConfirm,
}: CancelOrderDialogProps) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setReason("");
      setNotes("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleConfirm = async () => {
    setError("");

    if (!reason) {
      setError(
        "Please select a cancellation reason."
      );
      return;
    }

    try {
      setLoading(true);

      await onConfirm(
        reason,
        notes.trim()
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
        aria-label="Close cancel order dialog"
      />

      <div className="relative z-10 max-h-[calc(100dvh-32px)] w-full max-w-[520px] overflow-y-auto rounded-2xl border border-border bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--error-background)] text-error">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground">
                Cancel Order
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                This will cancel the customer order.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-subtle hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-xl bg-surface-subtle p-4">
            <p className="font-semibold text-foreground">
              #{orderNumber}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {customerName}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Cancellation Reason
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

              <option value="customer-request">
                Customer request
              </option>

              <option value="out-of-stock">
                Out of stock
              </option>

              <option value="payment-issue">
                Payment issue
              </option>

              <option value="duplicate-order">
                Duplicate order
              </option>

              <option value="unable-to-deliver">
                Unable to deliver
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
            placeholder="Enter optional cancellation details..."
            rows={4}
            value={notes}
            onChange={(event) =>
              setNotes(
                event.target.value
              )
            }
            disabled={loading}
            helperText="Optional internal note."
          />

          <div className="rounded-xl bg-[var(--warning-background)] p-4">
            <p className="text-sm leading-6 text-warning">
              Cancelling the order does not automatically refund a paid payment. Refunds should be handled separately.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Keep Order
          </Button>

          <Button
            type="button"
            variant="danger"
            disabled={loading}
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            {loading
              ? "Cancelling..."
              : "Cancel Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}