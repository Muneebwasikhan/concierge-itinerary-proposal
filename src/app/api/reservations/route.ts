import { NextResponse } from "next/server";

import { getCurrentReservation } from "@/lib/reservations";
import type { ApiFailure, ApiSuccess, ReservationWithMember } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reservation = getCurrentReservation();

    if (!reservation) {
      return NextResponse.json<ApiFailure>(
        {
          error: {
            message: "Current reservation not found.",
            code: "RESERVATION_NOT_FOUND",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiSuccess<ReservationWithMember>>({
      data: reservation,
    });
  } catch (error) {
    console.error("Failed to load current reservation.", error);

    return NextResponse.json<ApiFailure>(
      {
        error: {
          message: "Failed to load current reservation.",
          code: "RESERVATION_LOAD_FAILED",
        },
      },
      { status: 500 },
    );
  }
}
