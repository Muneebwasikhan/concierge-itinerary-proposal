import { ClipboardList } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/classnames";
import { formatDate } from "@/lib/dates";
import { formatCents } from "@/lib/money";
import type { ProposalStatus, ProposalSummary } from "@/lib/types";

type SentProposalsTableProps = {
  proposals: ProposalSummary[];
};

const statusBadgeConfig: Record<
  ProposalStatus,
  {
    className: string;
    dotClassName: string;
    label: string;
  }
> = {
  draft: {
    className: "border-border bg-muted text-muted-foreground",
    dotClassName: "bg-muted-foreground",
    label: "Draft",
  },
  sent: {
    className: "border-info/25 bg-info/10 text-info",
    dotClassName: "bg-info",
    label: "Sent",
  },
  approved: {
    className: "border-warning/25 bg-warning/10 text-warning",
    dotClassName: "bg-warning",
    label: "Approved",
  },
  paid: {
    className: "border-success/25 bg-success/10 text-success",
    dotClassName: "bg-success",
    label: "Paid",
  },
};

export function SentProposalsTable({ proposals }: SentProposalsTableProps) {
  return (
    <Card as="section" padding="none">
      <CardHeader className="px-5 pt-5">
        <CardTitle>Proposals</CardTitle>
        <CardDescription>
          Track drafts, sent proposals, approvals, and paid itineraries for
          James.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-5">
        {proposals.length === 0 ? (
          <div className="px-5 pb-5">
            <EmptyState
              icon={<ClipboardList className="h-5 w-5" />}
              title="No proposals yet"
              description="Saved drafts and sent proposals will appear here."
            />
          </div>
        ) : (
          <>
            <div className="grid gap-3 px-5 pb-5 md:hidden">
              {proposals.map((proposal) => (
                <article
                  key={proposal.id}
                  className="rounded-lg border border-border bg-surface p-4"
                  aria-labelledby={`proposal-${proposal.id}-mobile-title`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3
                        id={`proposal-${proposal.id}-mobile-title`}
                        className="break-words text-sm font-semibold text-foreground"
                      >
                        PR-{proposal.id.toString().padStart(4, "0")}
                      </h3>
                      <p className="mt-1 break-words text-sm text-muted-foreground">
                        {proposal.memberName}
                      </p>
                    </div>
                    <StatusBadge status={proposal.status} />
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm">
                    <MobileProposalFact
                      label="Destination"
                      value={`${proposal.destination} · ${proposal.villa}`}
                    />
                    <MobileProposalFact
                      label="Items"
                      value={proposal.itemCount.toString()}
                    />
                    <MobileProposalFact
                      label="Total"
                      value={formatCents(proposal.totalCents)}
                    />
                    <MobileProposalFact
                      label="Created"
                      value={formatDate(proposal.createdAt)}
                    />
                    <MobileProposalFact
                      label="Sent"
                      value={proposal.sentAt ? formatDate(proposal.sentAt) : "-"}
                    />
                  </dl>

                  <div className="mt-4 border-t border-border pt-4">
                    {proposal.status === "draft" ? (
                      <span className="text-sm text-muted-foreground">
                        Available after send
                      </span>
                    ) : (
                      <Link
                        href={`/proposal/${proposal.id}`}
                        className="inline-flex rounded-md text-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        Open member link
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-y border-border bg-surface-muted text-xs font-medium uppercase text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3">
                    Proposal ID
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Member
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Destination
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Item count
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Total
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Created date
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Sent date
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Member link
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="bg-surface">
                    <td className="px-5 py-4 font-medium text-foreground">
                      PR-{proposal.id.toString().padStart(4, "0")}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {proposal.memberName}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">
                        {proposal.destination}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {proposal.villa}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={proposal.status} />
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {proposal.itemCount}
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {formatCents(proposal.totalCents)}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {formatDate(proposal.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {proposal.sentAt ? formatDate(proposal.sentAt) : "-"}
                    </td>
                    <td className="px-5 py-4">
                      {proposal.status === "draft" ? (
                        <span className="text-muted-foreground">
                          Available after send
                        </span>
                      ) : (
                        <Link
                          href={`/proposal/${proposal.id}`}
                          className="rounded-md font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          Open
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function MobileProposalFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words font-medium text-foreground">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: ProposalStatus }) {
  const config = statusBadgeConfig[status];

  return (
    <span
      aria-label={`Proposal status: ${config.label}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        config.className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", config.dotClassName)}
      />
      {config.label}
    </span>
  );
}
