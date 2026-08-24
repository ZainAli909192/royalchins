import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-primary">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={`
              h-12 w-full rounded-lg border bg-white text-sm text-foreground
              outline-none transition
              placeholder:text-muted-foreground
              focus:border-primary focus:ring-2 focus:ring-primary/10
              disabled:cursor-not-allowed disabled:opacity-60
              sm:h-14 sm:text-base
              ${leftIcon ? "pl-12" : "pl-4"}
              ${rightIcon ? "pr-12" : "pr-4"}
              ${error ? "border-error" : "border-border"}
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center">
              {rightIcon}
            </div>
          )}
        </div>

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

Input.displayName = "Input";