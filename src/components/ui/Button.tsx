import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/classnames";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-accent bg-accent text-accent-foreground shadow-[0_12px_24px_rgba(154,122,54,0.18)] hover:bg-accent-strong",
  secondary:
    "border-border bg-surface text-foreground shadow-[0_8px_18px_rgba(37,32,24,0.06)] hover:border-muted-foreground/45 hover:bg-white",
  ghost:
    "border-transparent bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  danger:
    "border-danger bg-danger text-white shadow-[0_12px_24px_rgba(184,91,69,0.16)] hover:bg-danger-strong",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  icon: "h-10 w-10 p-0",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingLabel?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  leadingIcon,
  loadingLabel = "Loading",
  size = "md",
  trailingIcon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border font-medium leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-55",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current motion-safe:animate-spin"
        />
      ) : (
        leadingIcon
      )}
      {size === "icon" ? children : <span>{isLoading ? loadingLabel : children}</span>}
      {!isLoading ? trailingIcon : null}
    </button>
  );
}
