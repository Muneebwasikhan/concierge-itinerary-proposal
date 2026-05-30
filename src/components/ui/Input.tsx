import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/classnames";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
};

export function Input({
  className,
  containerClassName,
  error,
  hint,
  id,
  label,
  required,
  ...props
}: InputProps) {
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
      <input
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          "block h-11 w-full rounded-lg border border-border bg-white px-3 text-sm leading-6 text-foreground shadow-[0_1px_0_rgba(37,32,24,0.04)] transition placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
          error ? "border-danger focus:border-danger focus:ring-danger/20" : null,
          className,
        )}
        {...props}
      />
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
