"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type ApproveRefundDialogProps = {
  open: boolean;

  refundNumber: string;
  orderNumber: string;
  customerName: string;

  amount: number;
  currency?: string;

  onClose: () => void;

  onConfirm: () =>
    Promise<void> | void;
};

export function ApproveRefundDialog({
  open,
  refundNumber,
  orderNumber,
  customerName,
  amount,
  currency = "AED",
  onClose,
  onConfirm,
}: ApproveRefundDialogProps) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (open) {
      setLoading(false);
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleApprove =
    async () => {
      setError("");

      try {
        setLoading(true);

        await onConfirm();
      } catch {
        setError(
          "Unable to approve refund. Please try again."
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
        aria-label="Close approve refund dialog"
      />

      <div className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success-background)] text-success">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground">
                Approve Refund
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Review the refund details before approval.
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

        <div className="space-y-4 p-5 sm:p-6">
          <div className="rounded-xl bg-surface-subtle p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  Refund
                </p>

                <p className="mt-1 font-semibold text-foreground">
                  {refundNumber}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Order
                </p>

                <p className="mt-1 font-semibold text-foreground">
                  #{orderNumber}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Customer
                </p>

                <p className="mt-1 font-semibold text-foreground">
                  {customerName}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Refund Amount
                </p>

                <p className="mt-1 text-lg font-bold text-foreground">
                  {currency}{" "}
                  {amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[var(--warning-background)] p-4">
            <p className="text-sm leading-6 text-warning">
              Approval confirms that this refund is eligible. It does not send money to the customer yet.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-[var(--error-background)] p-4 text-sm text-error">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleApprove}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading
              ? "Approving..."
              : "Approve Refund"}
          </Button>
        </div>
      </div>
    </div>
  );
}