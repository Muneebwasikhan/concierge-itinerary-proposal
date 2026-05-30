import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProposalDetailPageData } from "@/actions/proposal-detail";
import { ProposalHero } from "@/components/proposal/ProposalHero";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProposalPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function parseProposalId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { id } = await params;
  const proposalId = parseProposalId(id);

  if (!proposalId) {
    notFound();
  }

  const state = await getProposalDetailPageData(proposalId);

  if (!state.ok) {
    if (state.reason === "not-found") {
      notFound();
    }

    return <ProposalLoadFailedState message={state.message} />;
  }

  return (
    <main id="main-content" className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <ProposalHero proposal={state.proposal} />
      </div>
    </main>
  );
}

function ProposalLoadFailedState({ message }: { message: string }) {
  return (
    <main id="main-content" className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <EmptyState
          role="alert"
          icon={<AlertTriangle className="h-5 w-5" />}
          title="Itinerary could not load"
          description={message}
          action={
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium leading-none text-foreground shadow-[0_8px_18px_rgba(37,32,24,0.06)] transition hover:border-muted-foreground/45 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Return to dashboard
            </Link>
          }
        />
      </div>
    </main>
  );
}
