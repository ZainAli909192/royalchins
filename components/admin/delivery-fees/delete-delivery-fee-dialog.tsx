"use client";

import {
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type DeleteDeliveryFeeDialogProps = {
  open: boolean;
  area?: string;
  emirate?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteDeliveryFeeDialog({
  open,
  area,
  emirate,
  onClose,
  onConfirm,
}: DeleteDeliveryFeeDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        aria-label="Close delete delivery fee dialog"
      />

      <div className="relative z-10 w-full max-w-[460px] overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--error-background)] text-error">
              <Trash2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Delete Delivery Fee?
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-subtle"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <p className="text-sm leading-6 text-muted-foreground">
            Are you sure you want to delete the delivery fee for
            <span className="font-semibold text-foreground">
              {" "}
              {area}, {emirate}
            </span>
            ?
          </p>

          <div className="mt-4 rounded-xl bg-[var(--error-background)] p-4">
            <p className="text-sm leading-6 text-error">
              Customers will no longer be able to use this delivery pricing rule.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
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
            variant="danger"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            Delete Delivery Fee
          </Button>
        </div>
      </div>
    </div>
  );
}