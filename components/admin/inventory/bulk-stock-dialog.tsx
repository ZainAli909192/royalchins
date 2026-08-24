"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type BulkStockAction =
  | "add"
  | "remove"
  | "set"
  | "threshold";

type BulkStockDialogProps = {
  open: boolean;
  selectedCount: number;
  action: BulkStockAction;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

export function BulkStockDialog({
  open,
  selectedCount,
  action,
  onClose,
  onSuccess,
}: BulkStockDialogProps) {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("new-stock");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const getTitle = () => {
    if (action === "add") return "Add Stock";
    if (action === "remove") return "Remove Stock";
    if (action === "set") return "Set Exact Quantity";

    return "Update Low Stock Threshold";
  };

  const getQuantityLabel = () => {
    if (action === "threshold") {
      return "Low Stock Threshold";
    }

    if (action === "set") {
      return "New Quantity";
    }

    return "Quantity";
  };

  const handleSubmit = async () => {
    setError("");

    const value = Number(quantity);

    if (!quantity || Number.isNaN(value)) {
      setError("Please enter a quantity.");
      return;
    }

    if (!Number.isInteger(value)) {
      setError("Quantity must be a whole number.");
      return;
    }

    if (value < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    if (
      (action === "add" || action === "remove") &&
      value === 0
    ) {
      setError("Quantity must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        action,
        quantity: value,
        reason,
        notes,
        selectedCount,
      };

      console.log("Bulk stock update:", payload);

      const message =
        action === "threshold"
          ? `Low stock threshold updated for ${selectedCount} products.`
          : `Stock updated successfully for ${selectedCount} products.`;

      onSuccess(message);

      setQuantity("");
      setNotes("");
      setReason("new-stock");

      onClose();
    } catch {
      setError("Unable to update stock. Please try again.");
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
        aria-label="Close bulk stock dialog"
      />

      <div className="relative z-10 max-h-[calc(100dvh-32px)] w-full max-w-[520px] overflow-y-auto rounded-2xl border border-border bg-white shadow-xl sm:max-h-[calc(100dvh-48px)]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Bulk Stock Update
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {getTitle()}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-subtle hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-lg bg-surface-subtle px-4 py-3">
            <p className="text-sm font-medium text-primary">
              {selectedCount}{" "}
              {selectedCount === 1
                ? "product selected"
                : "products selected"}
            </p>
          </div>

          <Input
            label={getQuantityLabel()}
            required
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={quantity}
            onChange={(event) =>
              setQuantity(event.target.value)
            }
            disabled={loading}
            error={error}
          />

          {action !== "threshold" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Reason
                <span className="ml-1 text-error">
                  *
                </span>
              </label>

              <select
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                disabled={loading}
                className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="new-stock">
                  New stock received
                </option>

                <option value="sold-offline">
                  Sold offline
                </option>

                <option value="damaged">
                  Damaged
                </option>

                <option value="returned">
                  Returned
                </option>

                <option value="correction">
                  Inventory correction
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>
          )}

          <Textarea
            label="Notes"
            placeholder="Enter optional notes..."
            rows={4}
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            disabled={loading}
            helperText="Optional internal note for stock history."
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full sm:w-auto"
          >
            {loading
              ? "Updating..."
              : `Update ${selectedCount} ${
                  selectedCount === 1
                    ? "Product"
                    : "Products"
                }`}
          </Button>
        </div>
      </div>
    </div>
  );
}