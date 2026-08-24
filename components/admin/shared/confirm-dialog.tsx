"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Trash2,
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type ConfirmDialogVariant =
  | "danger"
  | "warning"
  | "success"
  | "default";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;

  title: string;
  description?: string;

  confirmText?: string;
  cancelText?: string;

  variant?: ConfirmDialogVariant;
  loading?: boolean;
};

const variantConfig = {
  danger: {
    icon: Trash2,
    iconWrapper:
      "bg-[var(--error-background)] text-error",
    buttonVariant: "danger" as const,
  },

  warning: {
    icon: AlertTriangle,
    iconWrapper:
      "bg-[var(--warning-background)] text-warning",
    buttonVariant: "warning" as const,
  },

  success: {
    icon: CheckCircle2,
    iconWrapper:
      "bg-[var(--success-background)] text-success",
    buttonVariant: "success" as const,
  },

  default: {
    icon: Info,
    iconWrapper:
      "bg-surface-subtle text-primary",
    buttonVariant: "primary" as const,
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,

  title,
  description,

  confirmText = "Confirm",
  cancelText = "Cancel",

  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!loading) {
          onClose();
        }
      }}
      size="sm"
      showCloseButton={!loading}
      closeOnOverlayClick={!loading}
    >
      <div className="text-center">
        <div
          className={[
            "mx-auto",
            "flex h-14 w-14",
            "items-center justify-center",
            "rounded-full",
            config.iconWrapper,
          ].join(" ")}
        >
          <Icon
            className="h-7 w-7"
            aria-hidden="true"
          />
        </div>

        <h2
          className="
            mt-5
            text-lg font-semibold
            text-foreground
            sm:text-xl
          "
        >
          {title}
        </h2>

        {description && (
          <p
            className="
              mx-auto mt-2
              max-w-sm
              text-sm leading-6
              text-muted-foreground
            "
          >
            {description}
          </p>
        )}

        <div
          className="
            mt-6
            flex flex-col-reverse
            gap-3
            sm:flex-row
            sm:justify-center
          "
        >
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>

          <Button
            variant={config.buttonVariant}
            loading={loading}
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}