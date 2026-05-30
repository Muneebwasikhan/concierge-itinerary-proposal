"use client";

import { Plus, RotateCcw } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

import { CategoryPicker } from "@/components/concierge/CategoryPicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { parseIsoDate } from "@/lib/dates";
import { dollarsToCents } from "@/lib/money";
import {
  ITINERARY_CATEGORIES,
  type CreateProposalItemInput,
  type ItineraryCategory,
} from "@/lib/types";
import { isItineraryCategory } from "@/lib/validation";

type ItineraryItemFormProps = {
  onAddItem: (item: CreateProposalItemInput) => void;
};

type FormValues = {
  category: ItineraryCategory;
  title: string;
  description: string;
  date: string;
  time: string;
  price: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  category: ITINERARY_CATEGORIES[0],
  title: "",
  description: "",
  date: "",
  time: "",
  price: "",
};

export function ItineraryItemForm({ onAddItem }: ItineraryItemFormProps) {
  const [category, setCategory] = useState<ItineraryCategory>(
    initialValues.category,
  );
  const [errors, setErrors] = useState<FormErrors>({});

  function clearError(field: keyof FormValues) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function resetForm(form?: HTMLFormElement) {
    form?.reset();
    setCategory(initialValues.category);
    setErrors({});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateFormValues({
      category,
      ...readFormValues(event.currentTarget),
    });

    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    onAddItem(validation.item);
    resetForm(event.currentTarget);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <CategoryPicker
        value={category}
        onChange={(nextCategory) => {
          setCategory(nextCategory);
          clearError("category");
        }}
        error={errors.category}
      />

      <Input
        id="item-title"
        name="title"
        label="Title"
        onInput={() => clearError("title")}
        placeholder="Private chef welcome dinner"
        error={errors.title}
        required
      />

      <Textarea
        id="item-description"
        name="description"
        label="Description"
        onInput={() => clearError("description")}
        placeholder="Describe the experience, inclusions, and concierge notes."
        error={errors.description}
        required
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          id="item-date"
          name="date"
          label="Date"
          type="text"
          inputMode="numeric"
          pattern="\\d{4}-\\d{2}-\\d{2}"
          placeholder="2027-03-15"
          hint="Use YYYY-MM-DD."
          onInput={() => clearError("date")}
          error={errors.date}
          required
        />
        <Input
          id="item-time"
          name="time"
          label="Time"
          type="text"
          inputMode="numeric"
          pattern="\\d{2}:\\d{2}"
          placeholder="19:30"
          hint="Use 24-hour HH:MM."
          onInput={() => clearError("time")}
          error={errors.time}
          required
        />
        <Input
          id="item-price"
          name="price"
          label="Estimated price"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          onInput={() => clearError("price")}
          placeholder="350.00"
          error={errors.price}
          required
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" leadingIcon={<Plus className="h-4 w-4" />}>
          Add to Proposal
        </Button>
        <Button
          type="button"
          variant="secondary"
          leadingIcon={<RotateCcw className="h-4 w-4" />}
          onClick={(event) => resetForm(event.currentTarget.form ?? undefined)}
        >
          Clear form
        </Button>
      </div>
    </form>
  );
}

function readFormValues(form: HTMLFormElement): Omit<FormValues, "category"> {
  const formData = new FormData(form);

  return {
    title: readFormDataText(formData, "title"),
    description: readFormDataText(formData, "description"),
    date: readFormDataText(formData, "date"),
    time: readFormDataText(formData, "time"),
    price: readFormDataText(formData, "price"),
  };
}

function readFormDataText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function validateFormValues(values: FormValues):
  | { ok: true; item: CreateProposalItemInput }
  | { ok: false; errors: FormErrors } {
  const errors: FormErrors = {};
  const title = values.title.trim();
  const description = values.description.trim();

  if (!isItineraryCategory(values.category)) {
    errors.category = "Choose one of the required itinerary categories.";
  }

  if (!title) {
    errors.title = "Title is required.";
  }

  if (!description) {
    errors.description = "Description is required.";
  }

  if (!values.date) {
    errors.date = "Date is required.";
  }

  if (!values.time) {
    errors.time = "Time is required.";
  }

  const scheduledAt = `${values.date}T${values.time}:00`;

  if (values.date && values.time && !parseIsoDate(scheduledAt)) {
    errors.date = "Enter a valid date.";
    errors.time = "Enter a valid time.";
  }

  const priceCents = dollarsToCents(values.price);

  if (values.price.trim().length === 0) {
    errors.price = "Estimated price is required.";
  } else if (priceCents === null) {
    errors.price = "Estimated price must be zero or greater.";
  }

  if (Object.keys(errors).length > 0 || priceCents === null) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    item: {
      category: values.category,
      title,
      description,
      scheduledAt,
      priceCents,
    },
  };
}
