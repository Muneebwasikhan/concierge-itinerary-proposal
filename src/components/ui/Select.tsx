import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/classnames";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "id"> & {
  id: string;
  label: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  placeholder?: string;
  containerClassName?: string;
};

export function Select({
  className,
  containerClassName,
  error,
  hint,
  id,
  label,
  options,
  placeholder,
  required,
  ...props
}: SelectProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-danger">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            "block h-11 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-10 text-sm leading-6 text-foreground shadow-[0_1px_0_rgba(37,32,24,0.04)] transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
            error ? "border-danger focus:border-danger focus:ring-danger/20" : null,
            className,
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={2}
        />
      </div>
      {hint ? (
        <p id={hintId} className="text-sm leading-5 text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm leading-5 text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
