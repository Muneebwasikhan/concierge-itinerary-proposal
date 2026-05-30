import type { HTMLAttributes } from "react";

import { cn } from "@/lib/classnames";

type CardElement = "article" | "aside" | "div" | "section";
type CardVariant = "default" | "muted" | "outline";
type CardPadding = "none" | "sm" | "md" | "lg";

const variantClasses: Record<CardVariant, string> = {
  default: "border-border bg-surface shadow-[0_18px_44px_rgba(37,32,24,0.07)]",
  muted: "border-border bg-surface-muted shadow-none",
  outline: "border-border bg-transparent shadow-none",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: CardElement;
  variant?: CardVariant;
  padding?: CardPadding;
};

export function Card({
  as: Component = "div",
  className,
  padding = "md",
  variant = "default",
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-lg border",
        variantClasses[variant],
        paddingClasses[padding],
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold leading-7 text-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm leading-6 text-muted-foreground", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-5 flex flex-wrap items-center gap-3", className)}
      {...props}
    />
  );
}
