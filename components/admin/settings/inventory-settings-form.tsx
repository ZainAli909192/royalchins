"use client";

import {
  Boxes,
  Eye,
  EyeOff,
  TriangleAlert,
} from "lucide-react";

import { Input } from "@/components/ui/input";

export type InventorySettings = {
  lowStockThreshold: number;
  hideOutOfStock: boolean;
};

type InventorySettingsFormProps = {
  values: InventorySettings;
  onChange: (values: InventorySettings) => void;
};

export function InventorySettingsForm({
  values,
  onChange,
}: InventorySettingsFormProps) {
  return (
    <section className="rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Boxes className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Inventory Settings
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Configure low stock alerts and out-of-stock product visibility.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <div className="max-w-xl">
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Low Stock Threshold
            <span className="ml-1 text-error">*</span>
          </label>

          <Input
            type="number"
            min="0"
            value={values.lowStockThreshold}
            onChange={(event) =>
              onChange({
                ...values,
                lowStockThreshold: Math.max(
                  0,
                  Number(event.target.value)
                ),
              })
            }
          />

          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
            Products at or below this quantity will be marked as low stock.
          </p>
        </div>

        <div className="rounded-xl border border-warning/20 bg-[var(--warning-background)] p-4">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />

            <div>
              <p className="text-sm font-semibold text-foreground">
                Low stock alert
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Products with{" "}
                <span className="font-semibold text-foreground">
                  {values.lowStockThreshold}
                </span>{" "}
                or fewer units will be marked as low stock.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Out of Stock Products
            </h3>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Choose what customers see when a product reaches zero stock.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...values,
                  hideOutOfStock: false,
                })
              }
              className={`relative flex min-h-[110px] items-start gap-3 rounded-xl border p-4 text-left transition ${
                !values.hideOutOfStock
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-white hover:border-primary/40"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  !values.hideOutOfStock
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Eye className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    Keep visible
                  </span>

                  {!values.hideOutOfStock && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      Selected
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Keep the product visible and show an Out of Stock status.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                onChange({
                  ...values,
                  hideOutOfStock: true,
                })
              }
              className={`relative flex min-h-[110px] items-start gap-3 rounded-xl border p-4 text-left transition ${
                values.hideOutOfStock
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-white hover:border-primary/40"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  values.hideOutOfStock
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <EyeOff className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    Hide from customers
                  </span>

                  {values.hideOutOfStock && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      Selected
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Remove out-of-stock products from customer-facing listings.
                </p>
              </div>
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-muted/50 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Current behavior:{" "}
              <span className="font-semibold text-foreground">
                {values.hideOutOfStock
                  ? "Out-of-stock products are hidden from customers."
                  : "Out-of-stock products remain visible with an Out of Stock status."}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}