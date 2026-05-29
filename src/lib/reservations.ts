import type Database from "better-sqlite3";

import { getDb } from "./db";
import { initializeSchema } from "./schema";
import type { ReservationWithMember } from "./types";

type ReservationRow = {
  id: number;
  destination: string;
  villa: string;
  arrival_date: string;
  departure_date: string;
  member_id: number;
  member_name: string;
  member_email: string;
};

function mapReservationRow(row: ReservationRow): ReservationWithMember {
  return {
    id: row.id,
    destination: row.destination,
    villa: row.villa,
    arrivalDate: row.arrival_date,
    departureDate: row.departure_date,
    member: {
      id: row.member_id,
      name: row.member_name,
      email: row.member_email,
    },
  };
}

export function getCurrentReservation(
  db: Database.Database = getDb(),
): ReservationWithMember | null {
  initializeSchema(db);

  const row = db
    .prepare(
      `
      SELECT
        reservations.id,
        reservations.destination,
        reservations.villa,
        reservations.arrival_date,
        reservations.departure_date,
        members.id AS member_id,
        members.name AS member_name,
        members.email AS member_email
      FROM reservations
      INNER JOIN members ON members.id = reservations.member_id
      ORDER BY reservations.id ASC
      LIMIT 1
      `,
    )
    .get() as ReservationRow | undefined;

  return row ? mapReservationRow(row) : null;
}
