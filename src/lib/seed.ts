import path from "node:path";
import { fileURLToPath } from "node:url";

import type Database from "better-sqlite3";

import { closeDb, getDb } from "./db";
import { initializeSchema } from "./schema";

export const SEEDED_MEMBER = {
  name: "James Whitfield",
  email: "james.whitfield@example.com",
} as const;

export const SEEDED_RESERVATION = {
  destination: "Punta Mita, Mexico",
  villa: "Villa Punta Mita",
  arrivalDate: "2027-03-15",
  departureDate: "2027-03-22",
} as const;

type IdRow = {
  id: number;
};

export type SeedResult = {
  memberId: number;
  reservationId: number;
};

function getSeededMemberId(db: Database.Database): number {
  db.prepare(
    `
    INSERT INTO members (name, email)
    VALUES (@name, @email)
    ON CONFLICT(email) DO UPDATE SET
      name = excluded.name
    `,
  ).run(SEEDED_MEMBER);

  const member = db
    .prepare("SELECT id FROM members WHERE email = ?")
    .get(SEEDED_MEMBER.email) as IdRow | undefined;

  if (!member) {
    throw new Error("Seed failed: James Whitfield was not created.");
  }

  return member.id;
}

function getSeededReservationId(
  db: Database.Database,
  memberId: number,
): number {
  const existingReservation = db
    .prepare(
      `
      SELECT id
      FROM reservations
      WHERE member_id = ?
        AND destination = ?
        AND villa = ?
        AND arrival_date = ?
        AND departure_date = ?
      `,
    )
    .get(
      memberId,
      SEEDED_RESERVATION.destination,
      SEEDED_RESERVATION.villa,
      SEEDED_RESERVATION.arrivalDate,
      SEEDED_RESERVATION.departureDate,
    ) as IdRow | undefined;

  if (existingReservation) {
    return existingReservation.id;
  }

  const insertResult = db
    .prepare(
      `
      INSERT INTO reservations (
        member_id,
        destination,
        villa,
        arrival_date,
        departure_date
      )
      VALUES (?, ?, ?, ?, ?)
      `,
    )
    .run(
      memberId,
      SEEDED_RESERVATION.destination,
      SEEDED_RESERVATION.villa,
      SEEDED_RESERVATION.arrivalDate,
      SEEDED_RESERVATION.departureDate,
    );

  return Number(insertResult.lastInsertRowid);
}

export function seedDatabase(db: Database.Database = getDb()): SeedResult {
  initializeSchema(db);

  const seed = db.transaction(() => {
    const memberId = getSeededMemberId(db);
    const reservationId = getSeededReservationId(db, memberId);

    return { memberId, reservationId };
  });

  return seed();
}

function isDirectRun(): boolean {
  return path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url);
}

if (isDirectRun()) {
  const result = seedDatabase();

  console.log(
    `Seed complete: James Whitfield member #${result.memberId}, Villa Punta Mita reservation #${result.reservationId}.`,
  );

  closeDb();
}
