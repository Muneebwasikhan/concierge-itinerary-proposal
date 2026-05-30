import { NextResponse } from "next/server";

import {
  createProposal,
  listProposals,
  ProposalDataError,
} from "@/lib/proposals";
import type {
  ApiFailure,
  ApiSuccess,
  CreateProposalResult,
  ProposalSummary,
} from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function proposalErrorStatus(error: ProposalDataError): number {
  if (error.code === "RESERVATION_NOT_FOUND") {
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

export async function GET() {
  try {
    return NextResponse.json<ApiSuccess<ProposalSummary[]>>({
      data: listProposals(),
    });
  } catch (error) {
    console.error("Failed to list proposals.", error);

    return NextResponse.json<ApiFailure>(
      {
        error: {
          message: "Failed to list proposals.",
          code: "PROPOSALS_LIST_FAILED",
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json<ApiFailure>(
      {
        error: {
          message: "Request body must be valid JSON.",
          code: "INVALID_JSON",
        },
      },
      { status: 400 },
    );
  }

  try {
    const proposal = createProposal(payload);

    return NextResponse.json<ApiSuccess<CreateProposalResult>>(
      { data: proposal },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ProposalDataError) {
      return proposalErrorResponse(error);
    }

    console.error("Failed to create proposal.", error);

    return NextResponse.json<ApiFailure>(
      {
        error: {
          message: "Failed to create proposal.",
          code: "PROPOSAL_CREATE_FAILED",
        },
      },
      { status: 500 },
    );
  }
}
