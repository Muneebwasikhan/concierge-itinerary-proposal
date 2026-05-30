import type Database from "better-sqlite3";

import { getDb } from "./db";
import { initializeSchema } from "./schema";
import type {
  CreateProposalResult,
  ItineraryCategory,
  Proposal,
  ProposalDetail,
  ProposalDetailItem,
  ProposalStatus,
  ProposalStatusUpdate,
  ProposalSummary,
  SendProposalResult,
  UpdateProposalStatusResult,
} from "./types";
import {
  isItineraryCategory,
  isProposalStatus,
  isProposalStatusUpdate,
  validateCreateProposalInput,
  validateProposalStatusTransition,
} from "./validation";

export type ProposalDataErrorCode =
  | "DATA_INTEGRITY_ERROR"
  | "EMPTY_PROPOSAL"
  | "INVALID_STATUS"
  | "INVALID_STATUS_TRANSITION"
  | "PROPOSAL_NOT_FOUND"
  | "RESERVATION_NOT_FOUND"
  | "VALIDATION_ERROR";

export class ProposalDataError extends Error {
  constructor(
    readonly code: ProposalDataErrorCode,
    message: string,
    readonly errors: string[] = [message],
  ) {
    super(message);
    this.name = "ProposalDataError";
  }
}

type ProposalRow = {
  id: number;
  reservation_id: number;
  status: string;
  note: string | null;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  approved_at: string | null;
  paid_at: string | null;
};

type ProposalSummaryRow = ProposalRow & {
  item_count: number;
  total_cents: number;
  member_name: string;
  destination: string;
  villa: string;
};

type ProposalDetailRow = ProposalRow & {
  total_cents: number;
  reservation_destination: string;
  reservation_villa: string;
  reservation_arrival_date: string;
  reservation_departure_date: string;
  member_id: number;
  member_name: string;
  member_email: string;
};

type ProposalItemRow = {
  id: number;
  proposal_id: number;
  category: string;
  title: string;
  description: string;
  scheduled_at: string;
  price: number;
  sort_order: number;
};

type SendProposalRow = {
  id: number;
  status: string;
  member_name: string;
  member_email: string;
};

function nowIso(): string {
  return new Date().toISOString();
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new ProposalDataError(
      "VALIDATION_ERROR",
      `${label} must be a positive integer.`,
    );
  }
}

function normalizeStatus(value: string): ProposalStatus {
  if (isProposalStatus(value)) {
    return value;
  }

  throw new ProposalDataError(
    "DATA_INTEGRITY_ERROR",
    `Stored proposal status is invalid: ${value}.`,
  );
}

function normalizeCategory(value: string): ItineraryCategory {
  if (isItineraryCategory(value)) {
    return value;
  }

  throw new ProposalDataError(
    "DATA_INTEGRITY_ERROR",
    `Stored itinerary category is invalid: ${value}.`,
  );
}

function normalizeStatusUpdate(value: ProposalStatusUpdate): ProposalStatusUpdate {
  if (isProposalStatusUpdate(value)) {
    return value;
  }

  throw new ProposalDataError(
    "INVALID_STATUS",
    "Status must be one of: sent, approved, paid.",
  );
}

function mapProposal(row: ProposalRow): Proposal {
  return {
    id: row.id,
    reservationId: row.reservation_id,
    status: normalizeStatus(row.status),
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sentAt: row.sent_at,
    approvedAt: row.approved_at,
    paidAt: row.paid_at,
  };
}

function mapProposalDetailItem(row: ProposalItemRow): ProposalDetailItem {
  return {
    id: row.id,
    category: normalizeCategory(row.category),
    title: row.title,
    description: row.description,
    scheduledAt: row.scheduled_at,
    priceCents: row.price,
    sortOrder: row.sort_order,
  };
}

function reservationExists(db: Database.Database, reservationId: number): boolean {
  return Boolean(
    db
      .prepare("SELECT 1 FROM reservations WHERE id = ?")
      .get(reservationId),
  );
}

function getProposalStatus(
  db: Database.Database,
  proposalId: number,
): ProposalStatus {
  const row = db
    .prepare("SELECT status FROM proposals WHERE id = ?")
    .get(proposalId) as { status: string } | undefined;

  if (!row) {
    throw new ProposalDataError(
      "PROPOSAL_NOT_FOUND",
      "Proposal not found.",
    );
  }

  return normalizeStatus(row.status);
}

function assertAllowedStatusTransition(
  currentStatus: ProposalStatus,
  nextStatus: ProposalStatus,
): void {
  const result = validateProposalStatusTransition(currentStatus, nextStatus);

  if (!result.ok) {
    throw new ProposalDataError(
      "INVALID_STATUS_TRANSITION",
      result.errors[0] ?? "Invalid status transition.",
      result.errors,
    );
  }
}

function getItemCount(db: Database.Database, proposalId: number): number {
  const row = db
    .prepare(
      `
      SELECT COUNT(*) AS count
      FROM proposal_items
      WHERE proposal_id = ?
      `,
    )
    .get(proposalId) as { count: number };

  return row.count;
}

function buildProposalUrl(baseUrl: string, proposalPath: string): string {
  const trimmedBaseUrl = baseUrl.trim();

  if (!trimmedBaseUrl) {
    return proposalPath;
  }

  try {
    const urlBase = trimmedBaseUrl.endsWith("/")
      ? trimmedBaseUrl
      : `${trimmedBaseUrl}/`;

    return new URL(proposalPath, urlBase).toString();
  } catch {
    return proposalPath;
  }
}

export function createProposal(
  input: unknown,
  db: Database.Database = getDb(),
): CreateProposalResult {
  initializeSchema(db);

  const validation = validateCreateProposalInput(input);

  if (!validation.ok) {
    throw new ProposalDataError(
      "VALIDATION_ERROR",
      validation.errors[0] ?? "Proposal input is invalid.",
      validation.errors,
    );
  }

  const proposalInput = validation.data;

  if (!reservationExists(db, proposalInput.reservationId)) {
    throw new ProposalDataError(
      "RESERVATION_NOT_FOUND",
      "Reservation not found.",
    );
  }

  const create = db.transaction(() => {
    const timestamp = nowIso();
    const proposalResult = db
      .prepare(
        `
        INSERT INTO proposals (
          reservation_id,
          status,
          note,
          created_at,
          updated_at
        )
        VALUES (?, 'draft', ?, ?, ?)
        `,
      )
      .run(
        proposalInput.reservationId,
        proposalInput.note ?? null,
        timestamp,
        timestamp,
      );

    const proposalId = Number(proposalResult.lastInsertRowid);
    const insertItem = db.prepare(
      `
      INSERT INTO proposal_items (
        proposal_id,
        category,
        title,
        description,
        scheduled_at,
        price,
        sort_order
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    );

    proposalInput.items.forEach((item, index) => {
      insertItem.run(
        proposalId,
        item.category,
        item.title,
        item.description,
        item.scheduledAt,
        item.priceCents,
        index,
      );
    });

    return {
      id: proposalId,
      status: "draft" as const,
    };
  });

  return create();
}

export function listProposals(
  db: Database.Database = getDb(),
): ProposalSummary[] {
  initializeSchema(db);

  const rows = db
    .prepare(
      `
      SELECT
        proposals.id,
        proposals.reservation_id,
        proposals.status,
        proposals.note,
        proposals.created_at,
        proposals.updated_at,
        proposals.sent_at,
        proposals.approved_at,
        proposals.paid_at,
        COUNT(proposal_items.id) AS item_count,
        COALESCE(SUM(proposal_items.price), 0) AS total_cents,
        members.name AS member_name,
        reservations.destination,
        reservations.villa
      FROM proposals
      INNER JOIN reservations ON reservations.id = proposals.reservation_id
      INNER JOIN members ON members.id = reservations.member_id
      LEFT JOIN proposal_items ON proposal_items.proposal_id = proposals.id
      GROUP BY
        proposals.id,
        proposals.reservation_id,
        proposals.status,
        proposals.note,
        proposals.created_at,
        proposals.updated_at,
        proposals.sent_at,
        proposals.approved_at,
        proposals.paid_at,
        members.name,
        reservations.destination,
        reservations.villa
      ORDER BY proposals.created_at DESC, proposals.id DESC
      `,
    )
    .all() as ProposalSummaryRow[];

  return rows.map((row) => ({
    id: row.id,
    status: normalizeStatus(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sentAt: row.sent_at,
    approvedAt: row.approved_at,
    paidAt: row.paid_at,
    itemCount: row.item_count,
    totalCents: row.total_cents,
    memberName: row.member_name,
    destination: row.destination,
    villa: row.villa,
  }));
}

export function getProposalById(
  id: number,
  db: Database.Database = getDb(),
): ProposalDetail | null {
  assertPositiveInteger(id, "Proposal ID");
  initializeSchema(db);

  const row = db
    .prepare(
      `
      SELECT
        proposals.id,
        proposals.reservation_id,
        proposals.status,
        proposals.note,
        proposals.created_at,
        proposals.updated_at,
        proposals.sent_at,
        proposals.approved_at,
        proposals.paid_at,
        COALESCE(SUM(proposal_items.price), 0) AS total_cents,
        reservations.destination AS reservation_destination,
        reservations.villa AS reservation_villa,
        reservations.arrival_date AS reservation_arrival_date,
        reservations.departure_date AS reservation_departure_date,
        members.id AS member_id,
        members.name AS member_name,
        members.email AS member_email
      FROM proposals
      INNER JOIN reservations ON reservations.id = proposals.reservation_id
      INNER JOIN members ON members.id = reservations.member_id
      LEFT JOIN proposal_items ON proposal_items.proposal_id = proposals.id
      WHERE proposals.id = ?
      GROUP BY
        proposals.id,
        proposals.reservation_id,
        proposals.status,
        proposals.note,
        proposals.created_at,
        proposals.updated_at,
        proposals.sent_at,
        proposals.approved_at,
        proposals.paid_at,
        reservations.destination,
        reservations.villa,
        reservations.arrival_date,
        reservations.departure_date,
        members.id,
        members.name,
        members.email
      `,
    )
    .get(id) as ProposalDetailRow | undefined;

  if (!row) {
    return null;
  }

  const items = db
    .prepare(
      `
      SELECT
        id,
        proposal_id,
        category,
        title,
        description,
        scheduled_at,
        price,
        sort_order
      FROM proposal_items
      WHERE proposal_id = ?
      ORDER BY scheduled_at ASC, sort_order ASC, id ASC
      `,
    )
    .all(id) as ProposalItemRow[];

  const proposal = mapProposal(row);

  return {
    id: proposal.id,
    status: proposal.status,
    note: proposal.note,
    createdAt: proposal.createdAt,
    updatedAt: proposal.updatedAt,
    sentAt: proposal.sentAt,
    approvedAt: proposal.approvedAt,
    paidAt: proposal.paidAt,
    totalCents: row.total_cents,
    reservation: {
      id: row.reservation_id,
      destination: row.reservation_destination,
      villa: row.reservation_villa,
      arrivalDate: row.reservation_arrival_date,
      departureDate: row.reservation_departure_date,
    },
    member: {
      id: row.member_id,
      name: row.member_name,
      email: row.member_email,
    },
    items: items.map(mapProposalDetailItem),
  };
}

export function updateProposalStatus(
  id: number,
  nextStatus: ProposalStatusUpdate,
  db: Database.Database = getDb(),
): UpdateProposalStatusResult {
  assertPositiveInteger(id, "Proposal ID");
  const normalizedNextStatus = normalizeStatusUpdate(nextStatus);
  initializeSchema(db);

  const update = db.transaction(() => {
    const currentStatus = getProposalStatus(db, id);
    assertAllowedStatusTransition(currentStatus, normalizedNextStatus);

    const timestamp = nowIso();

    db.prepare(
      `
      UPDATE proposals
      SET
        status = @status,
        updated_at = @updatedAt,
        sent_at = CASE
          WHEN @status = 'sent' THEN COALESCE(sent_at, @updatedAt)
          ELSE sent_at
        END,
        approved_at = CASE
          WHEN @status = 'approved' THEN @updatedAt
          ELSE approved_at
        END,
        paid_at = CASE
          WHEN @status = 'paid' THEN @updatedAt
          ELSE paid_at
        END
      WHERE id = @id
      `,
    ).run({
      id,
      status: normalizedNextStatus,
      updatedAt: timestamp,
    });

    return {
      id,
      status: normalizedNextStatus,
    };
  });

  return update();
}

export function sendProposal(
  id: number,
  baseUrl: string,
  db: Database.Database = getDb(),
): SendProposalResult {
  assertPositiveInteger(id, "Proposal ID");
  initializeSchema(db);

  const send = db.transaction(() => {
    const proposal = db
      .prepare(
        `
        SELECT
          proposals.id,
          proposals.status,
          members.name AS member_name,
          members.email AS member_email
        FROM proposals
        INNER JOIN reservations ON reservations.id = proposals.reservation_id
        INNER JOIN members ON members.id = reservations.member_id
        WHERE proposals.id = ?
        `,
      )
      .get(id) as SendProposalRow | undefined;

    if (!proposal) {
      throw new ProposalDataError(
        "PROPOSAL_NOT_FOUND",
        "Proposal not found.",
      );
    }

    const currentStatus = normalizeStatus(proposal.status);
    assertAllowedStatusTransition(currentStatus, "sent");

    if (getItemCount(db, id) === 0) {
      throw new ProposalDataError(
        "EMPTY_PROPOSAL",
        "A proposal must have at least one itinerary item before sending.",
      );
    }

    const timestamp = nowIso();
    const proposalPath = `/proposal/${id}`;
    const proposalUrl = buildProposalUrl(baseUrl, proposalPath);
    const firstName = proposal.member_name.split(" ")[0] || proposal.member_name;
    const bodyPreview = `${firstName}, your curated Punta Mita itinerary proposal is ready. Review it here: ${proposalPath}`;

    db.prepare(
      `
      UPDATE proposals
      SET
        status = 'sent',
        sent_at = COALESCE(sent_at, @sentAt),
        updated_at = @sentAt
      WHERE id = @id
      `,
    ).run({
      id,
      sentAt: timestamp,
    });

    db.prepare(
      `
      INSERT INTO sent_emails (
        proposal_id,
        to_email,
        sent_at,
        body_preview
      )
      VALUES (?, ?, ?, ?)
      `,
    ).run(id, proposal.member_email, timestamp, bodyPreview);

    return {
      id,
      status: "sent" as const,
      proposalUrl,
    };
  });

  return send();
}
