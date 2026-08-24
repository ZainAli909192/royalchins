import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: string;
};

export const Checkbox = forwardRef<
  HTMLInputElement,
  CheckboxProps
>(({ label, id, className = "", ...props }, ref) => {
  const checkboxId = id || props.name;

  return (
    <label
      htmlFor={checkboxId}
      className="inline-flex cursor-pointer items-center gap-2.5"
    >
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        className={`
          h-4 w-4 shrink-0 cursor-pointer
          accent-primary
          sm:h-[18px] sm:w-[18px]
          ${className}
        `}
        {...props}
      />

      {label && (
        <span className="text-sm text-foreground sm:text-[15px]">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";