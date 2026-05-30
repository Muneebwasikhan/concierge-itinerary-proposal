import { CalendarDays, Home, MapPin, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import {
  formatDate,
  formatReservationDateRange,
  getTripNightCount,
} from "@/lib/dates";
import type { ReservationWithMember } from "@/lib/types";

type ReservationSummaryProps = {
  reservation: ReservationWithMember;
};

export function ReservationSummary({ reservation }: ReservationSummaryProps) {
  const tripRange = formatReservationDateRange(
    reservation.arrivalDate,
    reservation.departureDate,
  );
  const nights = getTripNightCount(
    reservation.arrivalDate,
    reservation.departureDate,
  );
  const memberInitials = reservation.member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card as="section" padding="lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-base font-semibold text-accent">
            {memberInitials}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Current reservation
            </p>
            <h2 className="mt-1 text-2xl font-semibold leading-8 text-foreground">
              {reservation.member.name}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {reservation.member.email}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[680px] lg:grid-cols-4">
          <SummaryStat
            icon={<Home className="h-4 w-4" />}
            label="Villa"
            value={reservation.villa}
          />
          <SummaryStat
            icon={<MapPin className="h-4 w-4" />}
            label="Destination"
            value={reservation.destination}
          />
          <SummaryStat
            icon={<CalendarDays className="h-4 w-4" />}
            label="Trip dates"
            value={tripRange}
            detail={
              nights === null
                ? undefined
                : `${nights} ${nights === 1 ? "night" : "nights"}`
            }
          />
          <SummaryStat
            icon={<UserRound className="h-4 w-4" />}
            label="Arrival / departure"
            value={formatDate(reservation.arrivalDate)}
            detail={formatDate(reservation.departureDate)}
          />
        </div>
      </div>
    </Card>
  );
}

function SummaryStat({
  detail,
  icon,
  label,
  value,
}: {
  detail?: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
        <span aria-hidden="true" className="text-accent">
          {icon}
        </span>
        {label}
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-foreground">
        {value}
      </p>
      {detail ? (
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  );
}
