"use client";

import { AlertTriangle, ClipboardList, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ReservationSummary } from "@/components/concierge/ReservationSummary";
import { SentProposalsTable } from "@/components/concierge/SentProposalsTable";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type {
  ApiFailure,
  ApiSuccess,
  ProposalSummary,
  ReservationWithMember,
} from "@/lib/types";

type DashboardData = {
  reservation: ReservationWithMember;
  proposals: ProposalSummary[];
};

type DashboardState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: DashboardData };

async function getApiData<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });
  const body = (await response.json()) as ApiSuccess<T> | ApiFailure;

  if (!response.ok || "error" in body) {
    throw new Error(
      "error" in body
        ? body.error.message
        : "The dashboard could not load right now.",
    );
  }

  return body.data;
}

async function getDashboardData(): Promise<DashboardData> {
  const [reservation, proposals] = await Promise.all([
    getApiData<ReservationWithMember>("/api/reservations"),
    getApiData<ProposalSummary[]>("/api/proposals"),
  ]);

  return { reservation, proposals };
}

export function DashboardShell() {
  const [state, setState] = useState<DashboardState>({ status: "loading" });

  const loadDashboard = useCallback(async () => {
    setState({ status: "loading" });

    try {
      const data = await getDashboardData();
      setState({ status: "ready", data });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "The dashboard could not load right now.",
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialDashboard() {
      try {
        const data = await getDashboardData();

        if (isMounted) {
          setState({ status: "ready", data });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "The dashboard could not load right now.",
          });
        }
      }
    }

    void loadInitialDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

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
          {state.status === "ready" ? (
            <div className="min-w-44 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted-foreground shadow-[0_8px_18px_rgba(37,32,24,0.06)]">
              <p className="text-lg font-semibold leading-6 text-foreground">
                {state.data.proposals.length}
              </p>
              <p>proposals tracked</p>
            </div>
          ) : null}
        </header>

        {state.status === "loading" ? <DashboardLoadingState /> : null}

        {state.status === "error" ? (
          <EmptyState
            role="alert"
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Dashboard could not load"
            description={state.message}
            action={
              <Button onClick={loadDashboard} variant="secondary">
                Retry
              </Button>
            }
          />
        ) : null}

        {state.status === "ready" ? (
          <>
            <ReservationSummary reservation={state.data.reservation} />
            <Card as="section" padding="lg">
              <CardHeader>
                <CardTitle>Itinerary Builder</CardTitle>
                <CardDescription>
                  The line-item entry form will be added in the next step.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <BuilderPlaceholder label="Category" />
                  <BuilderPlaceholder label="Date and time" />
                  <BuilderPlaceholder label="Estimated price" />
                </div>
                <div className="mt-4 rounded-lg border border-dashed border-border bg-surface-muted px-4 py-8 text-center">
                  <ClipboardList
                    aria-hidden="true"
                    className="mx-auto h-6 w-6 text-accent"
                  />
                  <p className="mt-3 text-sm font-medium text-foreground">
                    Proposal item entry will live here.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Category, scheduling, price, and proposal actions will be
                    added here.
                  </p>
                </div>
              </CardContent>
            </Card>
            <SentProposalsTable proposals={state.data.proposals} />
          </>
        ) : null}
      </div>
    </main>
  );
}

function DashboardLoadingState() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <Card padding="lg">
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <Loader2
            aria-hidden="true"
            className="h-4 w-4 motion-safe:animate-spin"
          />
          Loading reservation and proposals
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
  );
}

function BuilderPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-border bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <div className="mt-3 h-2 rounded-full bg-muted" />
    </div>
  );
}
