"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  MapPin,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type DeliveryFeeStatus =
  | "Active"
  | "Inactive";

export type DeliveryFeeFormValues = {
  area: string;

  emirate: string;

  fee: number;

  eta: string;

  freeDeliveryThreshold:
    | number
    | "";

  status: DeliveryFeeStatus;
};

type DeliveryFeeFormDialogProps = {
  open: boolean;

  mode:
    | "create"
    | "edit";

  initialValues?: DeliveryFeeFormValues;

  onClose: () => void;

  onSubmit: (
    values: DeliveryFeeFormValues
  ) => void;
};

const emptyValues: DeliveryFeeFormValues = {
  area: "",

  emirate: "Dubai",

  fee: 0,

  eta: "",

  freeDeliveryThreshold:
    "",

  status: "Active",
};

const emirates = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

export function DeliveryFeeFormDialog({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
}: DeliveryFeeFormDialogProps) {
  const [
    form,
    setForm,
  ] =
    useState<DeliveryFeeFormValues>(
      emptyValues
    );

  const [
    errors,
    setErrors,
  ] = useState({
    area: "",
    emirate: "",
    fee: "",
    eta: "",
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
      area: "",
      emirate: "",
      fee: "",
      eta: "",
    });
  }, [
    open,
    initialValues,
  ]);

  if (!open) {
    return null;
  }

  const updateField = <
    K extends keyof DeliveryFeeFormValues,
  >(
    key: K,
    value: DeliveryFeeFormValues[K]
  ) => {
    setForm(
      (current) => ({
        ...current,
        [key]: value,
      })
    );

    if (
      key === "area" ||
      key === "emirate" ||
      key === "fee" ||
      key === "eta"
    ) {
      setErrors(
        (current) => ({
          ...current,
          [key]: "",
        })
      );
    }
  };

  const handleSubmit =
    () => {
      const nextErrors = {
        area:
          form.area.trim()
            ? ""
            : "Area is required.",

        emirate:
          form.emirate
            ? ""
            : "Emirate is required.",

        fee:
          form.fee >= 0
            ? ""
            : "Delivery fee must be 0 or greater.",

        eta:
          form.eta.trim()
            ? ""
            : "Delivery time is required.",
      };

      setErrors(
        nextErrors
      );

      if (
        nextErrors.area ||
        nextErrors.emirate ||
        nextErrors.fee ||
        nextErrors.eta
      ) {
        return;
      }

      onSubmit({
        area:
          form.area.trim(),

        emirate:
          form.emirate,

        fee:
          Number(
            form.fee
          ),

        eta:
          form.eta.trim(),

        freeDeliveryThreshold:
          form.freeDeliveryThreshold ===
          ""
            ? ""
            : Number(
                form.freeDeliveryThreshold
              ),

        status:
          form.status,
      });
    };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        aria-label="Close delivery fee dialog"
      />

      {/* Dialog */}
      <div className="relative z-10 flex max-h-[calc(100dvh-32px)] w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
        {/* =========================
            HEADER
        ========================= */}

        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-foreground">
                {mode === "edit"
                  ? "Edit Delivery Fee"
                  : "Add Delivery Fee"}
              </h2>

              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                Configure delivery pricing for a UAE area.
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

        {/* =========================
            CONTENT
        ========================= */}

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Area */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Area

                <span className="ml-1 text-error">
                  *
                </span>
              </label>

              <Input
                value={
                  form.area
                }
                onChange={(event) =>
                  updateField(
                    "area",
                    event.target
                      .value
                  )
                }
                placeholder="e.g. Dubai Marina"
                className={
                  errors.area
                    ? "border-error"
                    : ""
                }
              />

              {errors.area && (
                <p className="mt-1.5 text-xs text-error">
                  {
                    errors.area
                  }
                </p>
              )}
            </div>

            {/* Emirate */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Emirate

                <span className="ml-1 text-error">
                  *
                </span>
              </label>

              <select
                value={
                  form.emirate
                }
                onChange={(event) =>
                  updateField(
                    "emirate",
                    event.target
                      .value
                  )
                }
                className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {emirates.map(
                  (emirate) => (
                    <option
                      key={
                        emirate
                      }
                      value={
                        emirate
                      }
                    >
                      {
                        emirate
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Fee */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Delivery Fee (AED)

                <span className="ml-1 text-error">
                  *
                </span>
              </label>

              <Input
                type="number"
                min="0"
                step="0.01"
                value={
                  form.fee
                }
                onChange={(event) =>
                  updateField(
                    "fee",
                    event.target
                      .value ===
                      ""
                      ? 0
                      : Number(
                          event
                            .target
                            .value
                        )
                  )
                }
                placeholder="35"
                className={
                  errors.fee
                    ? "border-error"
                    : ""
                }
              />

              {errors.fee && (
                <p className="mt-1.5 text-xs text-error">
                  {
                    errors.fee
                  }
                </p>
              )}

              <p className="mt-1.5 text-xs text-muted-foreground">
                Enter 0 if delivery is free for this area.
              </p>
            </div>

            {/* ETA */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Estimated Delivery Time

                <span className="ml-1 text-error">
                  *
                </span>
              </label>

              <Input
                value={
                  form.eta
                }
                onChange={(event) =>
                  updateField(
                    "eta",
                    event.target
                      .value
                  )
                }
                placeholder="e.g. Same day"
                className={
                  errors.eta
                    ? "border-error"
                    : ""
                }
              />

              {errors.eta && (
                <p className="mt-1.5 text-xs text-error">
                  {
                    errors.eta
                  }
                </p>
              )}
            </div>

            {/* Free Delivery Threshold */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Free Delivery Above (AED)
              </label>

              <Input
                type="number"
                min="0"
                value={
                  form.freeDeliveryThreshold
                }
                onChange={(event) =>
                  updateField(
                    "freeDeliveryThreshold",
                    event.target
                      .value ===
                      ""
                      ? ""
                      : Number(
                          event
                            .target
                            .value
                        )
                  )
                }
                placeholder="Optional"
              />

              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                Leave empty if free delivery does not apply to this area.
              </p>
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
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target
                      .value as DeliveryFeeStatus
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
                Inactive delivery areas will not be available during checkout.
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            FOOTER
        ========================= */}

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
              ? "Update Delivery Fee"
              : "Add Delivery Fee"}
          </Button>
        </div>
      </div>
    </div>
  );
}