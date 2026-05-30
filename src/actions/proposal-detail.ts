"use server";

import { getProposalById, ProposalDataError } from "@/lib/proposals";
import type { ProposalDetail } from "@/lib/types";

export type ProposalDetailPageState =
  | { ok: true; proposal: ProposalDetail }
  | { ok: false; reason: "not-found" }
  | { ok: false; reason: "failed"; message: string };

export async function getProposalDetailPageData(
  proposalId: number,
): Promise<ProposalDetailPageState> {
  try {
    // Keep member-facing proposal reads server-side so the page renders complete.
    const proposal = getProposalById(proposalId);

    if (!proposal) {
      return { ok: false, reason: "not-found" };
    }

    return { ok: true, proposal };
  } catch (error) {
    if (
      error instanceof ProposalDataError &&
      error.code === "PROPOSAL_NOT_FOUND"
    ) {
      return { ok: false, reason: "not-found" };
    }

    console.error("Failed to load proposal detail page data.", error);

    return {
      ok: false,
      reason: "failed",
      message:
        error instanceof Error
          ? error.message
          : "This itinerary could not be loaded right now.",
    };
  }
}
