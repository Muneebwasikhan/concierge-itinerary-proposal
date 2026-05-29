import { parseIsoDate } from "./dates";
import {
  ITINERARY_CATEGORIES,
  PROPOSAL_STATUSES,
  STATUS_TRANSITIONS,
  type CreateProposalInput,
  type CreateProposalItemInput,
  type ItineraryCategory,
  type ProposalStatus,
  type ProposalStatusUpdate,
  type ValidationResult,
} from "./types";

export function isItineraryCategory(
  value: unknown,
): value is ItineraryCategory {
  return (
    typeof value === "string" &&
    ITINERARY_CATEGORIES.includes(value as ItineraryCategory)
  );
}

export function isProposalStatus(value: unknown): value is ProposalStatus {
  return (
    typeof value === "string" &&
    PROPOSAL_STATUSES.includes(value as ProposalStatus)
  );
}

export function isProposalStatusUpdate(
  value: unknown,
): value is ProposalStatusUpdate {
  return isProposalStatus(value) && value !== "draft";
}

export function canTransitionProposalStatus(
  currentStatus: ProposalStatus,
  nextStatus: ProposalStatus,
): boolean {
  return STATUS_TRANSITIONS[currentStatus] === nextStatus;
}

export function validateProposalStatusTransition(
  currentStatus: ProposalStatus,
  nextStatus: ProposalStatus,
): ValidationResult<{ status: ProposalStatus }> {
  if (canTransitionProposalStatus(currentStatus, nextStatus)) {
    return { ok: true, data: { status: nextStatus } };
  }

  const allowedNext = STATUS_TRANSITIONS[currentStatus];

  if (!allowedNext) {
    return {
      ok: false,
      errors: ["Paid proposals cannot move to another status."],
    };
  }

  return {
    ok: false,
    errors: [
      `Invalid status transition. ${currentStatus} proposals can only move to ${allowedNext}.`,
    ],
  };
}

export function validateProposalItemInput(
  input: unknown,
): ValidationResult<CreateProposalItemInput> {
  if (!isRecord(input)) {
    return {
      ok: false,
      errors: ["Proposal item must be an object."],
    };
  }

  const errors: string[] = [];
  const category = readCategory(input.category, errors);
  const title = readRequiredString(input.title, "Item title", errors);
  const description = readRequiredString(
    input.description,
    "Item description",
    errors,
  );
  const scheduledAt = readScheduledAt(input.scheduledAt, errors);
  const priceCents = readPriceCents(input.priceCents, errors);

  if (
    errors.length > 0 ||
    !category ||
    !title ||
    !description ||
    !scheduledAt ||
    priceCents === null
  ) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      category,
      title,
      description,
      scheduledAt,
      priceCents,
    },
  };
}

export function validateCreateProposalInput(
  input: unknown,
): ValidationResult<CreateProposalInput> {
  if (!isRecord(input)) {
    return {
      ok: false,
      errors: ["Proposal payload must be an object."],
    };
  }

  const errors: string[] = [];
  const reservationId = readPositiveInteger(
    input.reservationId,
    "Reservation ID",
    errors,
  );
  const note = readOptionalString(input.note, "Proposal note", errors);
  const items = readProposalItems(input.items, errors);

  if (errors.length > 0 || reservationId === null || items === null) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      reservationId,
      ...(note ? { note } : {}),
      items,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readCategory(
  value: unknown,
  errors: string[],
): ItineraryCategory | null {
  if (isItineraryCategory(value)) {
    return value;
  }

  errors.push(
    `Category must be one of: ${ITINERARY_CATEGORIES.join(", ")}.`,
  );
  return null;
}

function readRequiredString(
  value: unknown,
  label: string,
  errors: string[],
): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${label} is required.`);
    return null;
  }

  return value.trim();
}

function readOptionalString(
  value: unknown,
  label: string,
  errors: string[],
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    errors.push(`${label} must be text.`);
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readScheduledAt(value: unknown, errors: string[]): string | null {
  const scheduledAt = readRequiredString(value, "Scheduled date/time", errors);

  if (!scheduledAt) {
    return null;
  }

  if (!parseIsoDate(scheduledAt)) {
    errors.push("Scheduled date/time must be a valid ISO date.");
    return null;
  }

  return scheduledAt;
}

function readPriceCents(value: unknown, errors: string[]): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    errors.push("Estimated price must be a non-negative integer in cents.");
    return null;
  }

  return value;
}

function readPositiveInteger(
  value: unknown,
  label: string,
  errors: string[],
): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    errors.push(`${label} must be a positive integer.`);
    return null;
  }

  return value;
}

function readProposalItems(
  value: unknown,
  errors: string[],
): CreateProposalItemInput[] | null {
  if (!Array.isArray(value)) {
    errors.push("Items must be an array.");
    return null;
  }

  const items: CreateProposalItemInput[] = [];

  value.forEach((item, index) => {
    const result = validateProposalItemInput(item);

    if (result.ok) {
      items.push(result.data);
      return;
    }

    for (const error of result.errors) {
      errors.push(`Item ${index + 1}: ${error}`);
    }
  });

  return items;
}
