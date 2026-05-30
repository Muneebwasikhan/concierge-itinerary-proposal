import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/classnames";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({
  action,
  className,
  description,
  icon,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted px-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent"
        >
          {icon}
        </div>
      ) : null}
      <h2 className="text-base font-semibold leading-7 text-foreground">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
