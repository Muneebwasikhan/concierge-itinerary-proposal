import { NextResponse } from "next/server";

import { ProposalDataError, sendProposal } from "@/lib/proposals";
import type { ApiFailure, ApiSuccess, SendProposalResult } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SendProposalRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseProposalId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function notFoundResponse() {
  return NextResponse.json<ApiFailure>(
    {
      error: {
        message: "Proposal not found.",
        code: "PROPOSAL_NOT_FOUND",
      },
    },
    { status: 404 },
  );
}

function proposalErrorStatus(error: ProposalDataError): number {
  if (
    error.code === "PROPOSAL_NOT_FOUND" ||
    error.code === "RESERVATION_NOT_FOUND"
  ) {
    return 404;
  }

  if (error.code === "DATA_INTEGRITY_ERROR") {
    return 500;
  }

  return 400;
}

function proposalErrorResponse(error: ProposalDataError) {
  return NextResponse.json<ApiFailure>(
    {
      error: {
        message: error.message,
        code: error.code,
      },
    },
    { status: proposalErrorStatus(error) },
  );
}

export async function POST(
  request: Request,
  context: SendProposalRouteContext,
) {
  const params = await context.params;
  const id = parseProposalId(params.id);

  if (!id) {
    return notFoundResponse();
  }

  try {
    const proposal = sendProposal(id, new URL(request.url).origin);

    return NextResponse.json<ApiSuccess<SendProposalResult>>({
      data: proposal,
    });
  } catch (error) {
    if (error instanceof ProposalDataError) {
      return proposalErrorResponse(error);
    }

    console.error("Failed to send proposal.", error);

    return NextResponse.json<ApiFailure>(
      {
        error: {
          message: "Failed to send proposal.",
          code: "PROPOSAL_SEND_FAILED",
        },
      },
      { status: 500 },
    );
  }
}
