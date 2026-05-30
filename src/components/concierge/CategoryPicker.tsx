"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/classnames";
import { ITINERARY_CATEGORIES, type ItineraryCategory } from "@/lib/types";

type CategoryPickerProps = {
  value: ItineraryCategory;
  onChange: (category: ItineraryCategory) => void;
  error?: string;
};

export function CategoryPicker({ error, onChange, value }: CategoryPickerProps) {
  const errorId = error ? "category-error" : undefined;

  return (
    <fieldset aria-describedby={errorId} aria-invalid={Boolean(error)}>
      <legend className="text-sm font-medium text-foreground">
        Category <span className="text-danger">*</span>
      </legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {ITINERARY_CATEGORIES.map((category) => {
          const isSelected = category === value;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(category)}
              className={cn(
                "flex min-h-11 items-center justify-between rounded-lg border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isSelected
                  ? "border-accent bg-accent-soft text-foreground"
                  : "border-border bg-white text-muted-foreground hover:border-muted-foreground/45 hover:text-foreground",
              )}
            >
              <span>{category}</span>
              {isSelected ? (
                <Check
                  aria-hidden="true"
                  className="h-4 w-4 text-accent"
                  strokeWidth={2.25}
                />
              ) : null}
            </button>
          );
        })}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
