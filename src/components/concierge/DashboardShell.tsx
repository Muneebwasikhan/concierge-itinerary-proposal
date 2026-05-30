"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, type ReactNode } from "react";

import { ProposalBuilder } from "@/components/concierge/ProposalBuilder";
import { ReservationSummary } from "@/components/concierge/ReservationSummary";
import { SentProposalsTable } from "@/components/concierge/SentProposalsTable";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ProposalSummary, ReservationWithMember, ProposalStatus } from "@/lib/types";

type DashboardShellProps = {
  reservation: ReservationWithMember;
  proposals: ProposalSummary[];
};

export function DashboardShell({ proposals, reservation }: DashboardShellProps) {
  const [editingDraftId, setEditingDraftId] = useState<number | null>(null);
  const [localProposals, setLocalProposals] = useState<ProposalSummary[]>(proposals);

  useEffect(() => {
    try {
      const overridesStr = localStorage.getItem("proposal_overrides");
      if (overridesStr) {
        const overrides = JSON.parse(overridesStr) as Record<
          string,
          { status: ProposalStatus; approvedAt?: string | null; paidAt?: string | null; updatedAt?: string }
        >;

        setTimeout(() => {
          setLocalProposals((current) =>
            current.map((p) => {
              const override = overrides[p.id.toString()];
              if (override) {
                return {
                  ...p,
                  status: override.status,
                  approvedAt: override.approvedAt !== undefined ? override.approvedAt : p.approvedAt,
                  paidAt: override.paidAt !== undefined ? override.paidAt : p.paidAt,
                  updatedAt: override.updatedAt !== undefined ? override.updatedAt : p.updatedAt,
                };
              }
              return p;
            })
          );
        }, 0);
      }
    } catch (err) {
      console.error("Failed to load proposal overrides from localStorage", err);
    }
  }, []);

  const handleProposalSaved = (proposalId: number, itemCount: number, totalCents: number) => {
    try {
      const overridesStr = localStorage.getItem("proposal_overrides");
      if (overridesStr) {
        const overrides = JSON.parse(overridesStr);
        delete overrides[proposalId.toString()];
        localStorage.setItem("proposal_overrides", JSON.stringify(overrides));
      }
    } catch {}

    setLocalProposals((current) => {
      const exists = current.some((p) => p.id === proposalId);
      if (exists) {
        return current.map((p) =>
          p.id === proposalId
            ? {
                ...p,
                itemCount,
                totalCents,
                updatedAt: new Date().toISOString(),
              }
            : p
        );
      } else {
        const newProposal: ProposalSummary = {
          id: proposalId,
          status: "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sentAt: null,
          approvedAt: null,
          paidAt: null,
          itemCount,
          totalCents,
          memberName: reservation.member.name,
          destination: reservation.destination,
          villa: reservation.villa,
        };
        return [newProposal, ...current];
      }
    });
  };

  const handleProposalSent = (proposalId: number) => {
    try {
      const overridesStr = localStorage.getItem("proposal_overrides");
      if (overridesStr) {
        const overrides = JSON.parse(overridesStr);
        delete overrides[proposalId.toString()];
        localStorage.setItem("proposal_overrides", JSON.stringify(overrides));
      }
    } catch {}

    setLocalProposals((current) =>
      current.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              status: "sent",
              sentAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  return (
    <DashboardFrame proposalCount={localProposals.length}>
      <ReservationSummary reservation={reservation} />
      <ProposalBuilder
        reservation={reservation}
        editingDraftId={editingDraftId}
        onCancelEdit={() => setEditingDraftId(null)}
        onProposalSaved={handleProposalSaved}
        onProposalSent={handleProposalSent}
      />
      <SentProposalsTable
        proposals={localProposals}
        onEditDraft={(id) => setEditingDraftId(id)}
      />
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
