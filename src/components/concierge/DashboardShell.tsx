import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProposalBuilder } from "@/components/concierge/ProposalBuilder";
import { ReservationSummary } from "@/components/concierge/ReservationSummary";
import { SentProposalsTable } from "@/components/concierge/SentProposalsTable";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ProposalSummary, ReservationWithMember } from "@/lib/types";

type DashboardShellProps = {
  reservation: ReservationWithMember;
  proposals: ProposalSummary[];
};

export function DashboardShell({ proposals, reservation }: DashboardShellProps) {
  return (
    <DashboardFrame proposalCount={proposals.length}>
      <ReservationSummary reservation={reservation} />
      <ProposalBuilder reservation={reservation} />
      <SentProposalsTable proposals={proposals} />
    </DashboardFrame>
  );
}

export function DashboardLoadingState() {
  return (
    <DashboardFrame>
      <div className="space-y-6" aria-busy="true" aria-live="polite">
        <Card padding="lg">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <Loader2
              aria-hidden="true"
              className="h-4 w-4 motion-safe:animate-spin"
            />
            Loading reservation details
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 rounded-lg border border-border bg-surface-muted"
              />
            ))}
          </div>
        </Card>
        <Card padding="lg">
          <div className="h-44 rounded-lg border border-dashed border-border bg-surface-muted" />
        </Card>
      </div>
    </DashboardFrame>
  );
}

export function DashboardErrorState({ message }: { message: string }) {
  return (
    <DashboardFrame>
      <EmptyState
        role="alert"
        icon={<AlertTriangle className="h-5 w-5" />}
        title="Reservation could not load"
        description={message}
        action={
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium leading-none text-foreground shadow-[0_8px_18px_rgba(37,32,24,0.06)] transition hover:border-muted-foreground/45 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Reload dashboard
          </Link>
        }
      />
    </DashboardFrame>
  );
}

function DashboardFrame({
  children,
  proposalCount,
}: {
  children: ReactNode;
  proposalCount?: number;
}) {
  return (
    <main id="main-content" className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Exclusive Resorts concierge workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-10 text-foreground">
              Concierge Itinerary Proposal System
            </h1>
          </div>
          {typeof proposalCount === "number" ? (
            <div className="min-w-44 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted-foreground shadow-[0_8px_18px_rgba(37,32,24,0.06)]">
              <p className="text-lg font-semibold leading-6 text-foreground">
                {proposalCount}
              </p>
              <p>proposals tracked</p>
            </div>
          ) : null}
        </header>

        {children}
      </div>
    </main>
  );
}
