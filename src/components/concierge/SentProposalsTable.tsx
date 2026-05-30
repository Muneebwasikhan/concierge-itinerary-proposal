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

const statusClasses: Record<ProposalStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-info/15 text-info",
  approved: "bg-warning/15 text-warning",
  paid: "bg-success/15 text-success",
};

export function SentProposalsTable({ proposals }: SentProposalsTableProps) {
  return (
    <Card as="section" padding="none">
      <CardHeader className="px-5 pt-5">
        <CardTitle>Sent Proposals</CardTitle>
        <CardDescription>
          Track proposal status after drafts are saved and sent to James.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-5">
        {proposals.length === 0 ? (
          <div className="px-5 pb-5">
            <EmptyState
              icon={<ClipboardList className="h-5 w-5" />}
              title="No proposals yet"
              description="Saved and sent proposals will appear here."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
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
                    Items
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Total
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Created
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Sent
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
                        {proposal.villa}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {proposal.destination}
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
                          className="font-medium text-accent underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-accent/30"
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
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: ProposalStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase",
        statusClasses[status],
      )}
    >
      {status}
    </span>
  );
}
