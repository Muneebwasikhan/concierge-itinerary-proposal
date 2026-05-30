"use client";

import { CheckCircle2, Clock3, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/dates";
import type {
  ApiFailure,
  ApiSuccess,
  ProposalDetail,
  ProposalStatusUpdate,
  UpdateProposalStatusResult,
} from "@/lib/types";

type ProposalMemberActionsProps = {
  proposal: ProposalDetail;
};

export function ProposalMemberActions({
  proposal: initialProposal,
}: ProposalMemberActionsProps) {
  const [proposal, setProposal] = useState(initialProposal);
  const [isApproving, setIsApproving] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function approveProposal() {
    const originalProposal = proposal;
    setIsApproving(true);

    setProposal((prev) => ({
      ...prev,
      status: "approved" as const,
      approvedAt: new Date().toISOString(),
    }));
    setError(undefined);

    // Save optimistic override to localStorage
    try {
      const overrides = JSON.parse(localStorage.getItem("proposal_overrides") || "{}");
      overrides[proposal.id.toString()] = {
        status: "approved",
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("proposal_overrides", JSON.stringify(overrides));
    } catch (e) {
      console.error("Failed to write optimistic approval override", e);
    }

    try {
      await updateProposalStatus(proposal.id, "approved");
      const refreshedProposal = await fetchProposalDetail(proposal.id);
      setProposal(refreshedProposal);
    } catch (approvalError) {
      console.error("Proposal approval failed.", approvalError);
      setProposal(originalProposal);
      setError(
        "We couldn't approve this proposal. Please check your connection and try again.",
      );

      // Revert localStorage override on failure
      try {
        const overrides = JSON.parse(localStorage.getItem("proposal_overrides") || "{}");
        delete overrides[proposal.id.toString()];
        localStorage.setItem("proposal_overrides", JSON.stringify(overrides));
      } catch {}
    } finally {
      setIsApproving(false);
    }
  }

  async function payProposal() {
    const originalProposal = proposal;
    setIsPaying(true);

    setProposal((prev) => ({
      ...prev,
      status: "paid" as const,
      paidAt: new Date().toISOString(),
    }));
    setError(undefined);

    // Save optimistic override to localStorage
    try {
      const overrides = JSON.parse(localStorage.getItem("proposal_overrides") || "{}");
      overrides[proposal.id.toString()] = {
        status: "paid",
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("proposal_overrides", JSON.stringify(overrides));
    } catch (e) {
      console.error("Failed to write optimistic payment override", e);
    }

    try {
      await updateProposalStatus(proposal.id, "paid");
      const refreshedProposal = await fetchProposalDetail(proposal.id);
      setProposal(refreshedProposal);
    } catch (paymentError) {
      console.error("Proposal payment failed.", paymentError);
      setProposal(originalProposal);
      setError(
        "We couldn't lock in this itinerary. Please check your connection and try again.",
      );

      // Revert localStorage override on failure
      try {
        const overrides = JSON.parse(localStorage.getItem("proposal_overrides") || "{}");
        delete overrides[proposal.id.toString()];
        localStorage.setItem("proposal_overrides", JSON.stringify(overrides));
      } catch {}
    } finally {
      setIsPaying(false);
    }
  }

  if (proposal.status === "paid") {
    return <ProposalConfirmation proposal={proposal} />;
  }

  return (
    <section
      aria-labelledby="member-actions-heading"
      className="rounded-lg border border-border bg-surface p-5 shadow-[0_18px_44px_rgba(37,32,24,0.07)] sm:p-6"
    >
      <p className="text-sm font-semibold uppercase text-accent">
        Member action
      </p>
      <h2
        id="member-actions-heading"
        className="mt-1 break-words text-xl font-semibold leading-8 text-foreground"
      >
        {getActionTitle(proposal)}
      </h2>
      <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
        {getActionDescription(proposal)}
      </p>

      {proposal.status === "sent" ? (
        <Button
          type="button"
          className="mt-5 w-full"
          isLoading={isApproving}
          loadingLabel="Approving proposal"
          disabled={isPaying}
          onClick={approveProposal}
        >
          Approve Proposal
        </Button>
      ) : null}

      {proposal.status === "approved" ? (
        <Button
          type="button"
          className="mt-5 w-full"
          isLoading={isPaying}
          loadingLabel="Locking in itinerary"
          disabled={isApproving}
          leadingIcon={<LockKeyhole className="h-4 w-4" />}
          onClick={payProposal}
        >
          Pay &amp; Lock In
        </Button>
      ) : null}

      {proposal.status === "draft" ? (
        <StatusCallout
          icon={<Clock3 className="h-4 w-4" />}
          title="Proposal not ready"
          description="This draft needs to be sent before member actions are available."
        />
      ) : null}

      {proposal.approvedAt ? (
        <p className="mt-4 text-xs font-medium text-muted-foreground">
          Approved on {formatDate(proposal.approvedAt)}
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger/25 bg-danger/10 px-3 py-2 text-sm font-medium text-danger"
        >
          {error}
        </p>
      ) : null}
    </section>
  );
}

function getActionTitle(proposal: ProposalDetail): string {
  if (proposal.status === "sent") {
    return "Ready for approval";
  }

  if (proposal.status === "approved") {
    return "Ready to lock in";
  }

  return "Proposal not ready";
}

function getActionDescription(proposal: ProposalDetail): string {
  if (proposal.status === "sent") {
    return "Review the itinerary details and approve the proposal when everything looks right.";
  }

  if (proposal.status === "approved") {
    return "Approve the estimated total and lock in this itinerary for your trip.";
  }

  return "The concierge must send this proposal before member approval is available.";
}

function ProposalConfirmation({ proposal }: { proposal: ProposalDetail }) {
  return (
    <section
      aria-labelledby="proposal-confirmation-heading"
      className="rounded-lg border border-success/25 bg-success/10 p-5 shadow-[0_18px_44px_rgba(37,32,24,0.07)] sm:p-6 animate-fade-in-up"
    >
      <div
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface text-success"
      >
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <p className="mt-5 text-sm font-semibold uppercase text-success">
        Confirmation
      </p>
      <h2
        id="proposal-confirmation-heading"
        className="mt-1 break-words text-2xl font-semibold leading-8 text-foreground"
      >
        Itinerary locked in
      </h2>
      <p className="mt-3 break-words text-sm leading-6 text-muted-foreground">
        Your Punta Mita itinerary has been confirmed for{" "}
        {proposal.member.name}. The concierge team can now prepare the final
        arrangements.
      </p>

      <dl className="mt-5 divide-y divide-success/20 rounded-lg border border-success/20 bg-surface/80">
        <ConfirmationRow
          label="Proposal"
          value={`PR-${proposal.id.toString().padStart(4, "0")}`}
        />
        <ConfirmationRow label="Status" value="Paid" />
        <ConfirmationRow
          label="Locked in"
          value={proposal.paidAt ? formatDate(proposal.paidAt) : "Just now"}
        />
      </dl>
    </section>
  );
}

function ConfirmationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="break-words text-right text-sm font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}

function StatusCallout({
  description,
  icon,
  title,
}: {
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="mt-5 rounded-lg border border-border bg-surface-muted p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-accent"
        >
          {icon}
        </span>
        {title}
      </div>
      <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

async function updateProposalStatus(
  proposalId: number,
  status: ProposalStatusUpdate,
): Promise<UpdateProposalStatusResult> {
  const response = await fetch(`/api/proposals/${proposalId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ status }),
  });
  const body = (await response.json()) as
    | ApiSuccess<UpdateProposalStatusResult>
    | ApiFailure;

  if (!response.ok || "error" in body) {
    throw new Error(
      "error" in body
        ? body.error.message
        : "Proposal status could not be updated.",
    );
  }

  return body.data;
}

async function fetchProposalDetail(proposalId: number): Promise<ProposalDetail> {
  const response = await fetch(`/api/proposals/${proposalId}`, {
    headers: {
      Accept: "application/json",
    },
  });
  const body = (await response.json()) as
    | ApiSuccess<ProposalDetail>
    | ApiFailure;

  if (!response.ok || "error" in body) {
    throw new Error(
      "error" in body
        ? body.error.message
        : "Proposal could not be refreshed.",
    );
  }

  return body.data;
}
