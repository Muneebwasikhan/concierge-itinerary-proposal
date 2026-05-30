import { CalendarDays, Home, MapPin, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { formatReservationDateRange } from "@/lib/dates";
import type { ProposalDetail } from "@/lib/types";

type ProposalHeroProps = {
  proposal: ProposalDetail;
};

export function ProposalHero({ proposal }: ProposalHeroProps) {
  const destinationName =
    proposal.reservation.destination.split(",")[0]?.trim() ||
    proposal.reservation.destination;
  const tripDates = formatReservationDateRange(
    proposal.reservation.arrivalDate,
    proposal.reservation.departureDate,
  );
  const pageTitle = `Your ${destinationName} Itinerary`;

  return (
    <section
      aria-labelledby="proposal-hero-heading"
      className="overflow-hidden rounded-lg border border-border bg-surface shadow-[0_24px_60px_rgba(37,32,24,0.08)]"
    >
      <div className="border-b border-border bg-surface-muted px-5 py-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            Exclusive Resorts itinerary proposal
          </p>
          <p className="break-words rounded-full border border-accent/25 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
            PR-{proposal.id.toString().padStart(4, "0")}
          </p>
        </div>
      </div>

      <div className="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-accent">
            {destinationName}
          </p>
          <h1
            id="proposal-hero-heading"
            className="mt-3 max-w-3xl break-words text-4xl font-semibold leading-tight text-foreground sm:text-5xl"
          >
            {pageTitle}
          </h1>
          <p className="mt-4 max-w-2xl break-words text-base leading-7 text-muted-foreground">
            A curated itinerary prepared for {proposal.member.name} at{" "}
            {proposal.reservation.villa}.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface-muted p-4">
          <dl className="grid gap-4">
            <HeroFact
              icon={<UserRound className="h-4 w-4" />}
              label="Member"
              value={proposal.member.name}
            />
            <HeroFact
              icon={<Home className="h-4 w-4" />}
              label="Villa"
              value={proposal.reservation.villa}
            />
            <HeroFact
              icon={<MapPin className="h-4 w-4" />}
              label="Destination"
              value={proposal.reservation.destination}
            />
            <HeroFact
              icon={<CalendarDays className="h-4 w-4" />}
              label="Dates"
              value={tripDates}
            />
          </dl>
        </div>
      </div>
    </section>
  );
}

function HeroFact({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
      <div
        aria-hidden="true"
        className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-accent"
      >
        {icon}
      </div>
      <div>
        <dt className="text-xs font-medium uppercase text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-1 break-words text-sm font-semibold leading-6 text-foreground">
          {value}
        </dd>
      </div>
    </div>
  );
}
