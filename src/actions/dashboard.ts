"use server";

import { listProposals } from "@/lib/proposals";
import { getCurrentReservation } from "@/lib/reservations";
import type { ProposalSummary, ReservationWithMember } from "@/lib/types";

export type DashboardData = {
  reservation: ReservationWithMember;
  proposals: ProposalSummary[];
};

export async function getDashboardData(): Promise<DashboardData> {
  // Keep dashboard reads server-side so the page can render with complete data.
  const reservation = getCurrentReservation();

  if (!reservation) {
    throw new Error("Reservation not found.");
  }

  return {
    reservation,
    proposals: listProposals(),
  };
}
