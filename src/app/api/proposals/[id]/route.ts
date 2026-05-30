import { NextResponse } from "next/server";

import {
  getProposalById,
  ProposalDataError,
  updateProposalStatus,
} from "@/lib/proposals";
import type {
  ApiFailure,
  ApiSuccess,
  ProposalDetail,
  UpdateProposalStatusResult,
} from "@/lib/types";
import { isProposalStatusUpdate } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProposalRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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

function invalidStatusResponse() {
  return NextResponse.json<ApiFailure>(
    {
      error: {
        message: "Status must be one of: sent, approved, paid.",
        code: "INVALID_STATUS",
      },
    },
    { status: 400 },
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

async function getRouteProposalId(
  context: ProposalRouteContext,
): Promise<number | null> {
  const params = await context.params;
  return parseProposalId(params.id);
}

export async function GET(
  _request: Request,
  context: ProposalRouteContext,
) {
  const id = await getRouteProposalId(context);

  if (!id) {
    return notFoundResponse();
  }

  try {
    const proposal = getProposalById(id);

    if (!proposal) {
      return notFoundResponse();
    }

    return NextResponse.json<ApiSuccess<ProposalDetail>>({
      data: proposal,
    });
  } catch (error) {
    if (error instanceof ProposalDataError) {
      return proposalErrorResponse(error);
    }

    console.error("Failed to load proposal.", error);

    return NextResponse.json<ApiFailure>(
      {
        error: {
          message: "Failed to load proposal.",
          code: "PROPOSAL_LOAD_FAILED",
        },
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: ProposalRouteContext,
) {
  const id = await getRouteProposalId(context);

  if (!id) {
    return notFoundResponse();
  }

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

  if (!isRecord(payload) || !isProposalStatusUpdate(payload.status)) {
    return invalidStatusResponse();
  }

  try {
    const updatedProposal = updateProposalStatus(id, payload.status);

    return NextResponse.json<ApiSuccess<UpdateProposalStatusResult>>({
      data: updatedProposal,
    });
  } catch (error) {
    if (error instanceof ProposalDataError) {
      return proposalErrorResponse(error);
    }

    console.error("Failed to update proposal status.", error);

    return NextResponse.json<ApiFailure>(
      {
        error: {
          message: "Failed to update proposal status.",
          code: "PROPOSAL_STATUS_UPDATE_FAILED",
        },
      },
      { status: 500 },
    );
  }
}
