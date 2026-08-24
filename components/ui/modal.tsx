"use client";

import {
  useEffect,
  type ReactNode,
} from "react";

import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl";

type ModalProps = {
  open: boolean;
  onClose: () => void;

  title?: string;
  description?: string;

  children: ReactNode;
  footer?: ReactNode;

  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;

  className?: string;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,

  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,

  className = "",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        px-4 py-6
        sm:px-6
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={() => {
          if (closeOnOverlayClick) {
            onClose();
          }
        }}
        className="
          absolute inset-0
          bg-black/55
          backdrop-blur-[2px]
        "
      />

      {/* Modal */}
      <div
        className={[
          "relative z-10",
          "w-full",
          sizeClasses[size],
          "max-h-[90vh]",
          "overflow-hidden",
          "rounded-xl",
          "border border-border",
          "bg-surface",
          "shadow-lg",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <div
            className="
              flex items-start justify-between
              gap-4
              border-b border-border
              px-5 py-4
              sm:px-6 sm:py-5
            "
          >
            <div className="min-w-0">
              {title && (
                <h2
                  id="modal-title"
                  className="
                    text-lg font-semibold
                    text-foreground
                    sm:text-xl
                  "
                >
                  {title}
                </h2>
              )}

              {description && (
                <p
                  id="modal-description"
                  className="
                    mt-1
                    text-sm leading-6
                    text-muted-foreground
                  "
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-md
                  text-muted-foreground
                  transition-colors
                  hover:bg-surface-subtle
                  hover:text-primary
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                "
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className="
            max-h-[65vh]
            overflow-y-auto
            px-5 py-5
            sm:px-6
          "
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="
              border-t border-border
              px-5 py-4
              sm:px-6
            "
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}