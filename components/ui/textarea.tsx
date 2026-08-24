import {
  forwardRef,
  type TextareaHTMLAttributes,
} from "react";

type TextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
    helperText?: string;
    containerClassName?: string;
  };

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      label,
      error,
      helperText,
      id,
      disabled,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const textareaId = id || props.name;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`
            min-h-[140px]
            w-full
            resize-y
            rounded-lg
            border
            bg-white
            px-4
            py-3
            text-sm
            leading-6
            text-foreground
            outline-none
            transition
            placeholder:text-muted-foreground
            focus:border-primary
            focus:ring-2
            focus:ring-primary/10
            disabled:cursor-not-allowed
            disabled:bg-muted
            disabled:opacity-60
            ${
              error
                ? "border-error"
                : "border-border"
            }
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="mt-1.5 text-sm text-error">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="mt-1.5 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";