import { ReceiptText } from "lucide-react";

import { formatCents } from "@/lib/money";
import type { ProposalDetail } from "@/lib/types";

type ProposalPriceSummaryProps = {
  proposal: ProposalDetail;
};

export function ProposalPriceSummary({ proposal }: ProposalPriceSummaryProps) {
  return (
    <aside
      aria-labelledby="price-summary-heading"
      className="rounded-lg border border-border bg-surface p-5 shadow-[0_18px_44px_rgba(37,32,24,0.07)] sm:p-6 lg:sticky lg:top-6"
    >
      <div
        aria-hidden="true"
        className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent"
      >
        <ReceiptText className="h-5 w-5" />
      </div>

      <h2
        id="price-summary-heading"
        className="mt-4 text-xl font-semibold leading-8 text-foreground"
      >
        Price summary
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Estimated cost for the proposed itinerary items.
      </p>

      <dl className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface-muted">
        <SummaryRow
          label="Itinerary items"
          value={proposal.items.length.toString()}
        />
        <SummaryRow
          label="Estimated total"
          value={formatCents(proposal.totalCents)}
          emphasis
        />
      </dl>
    </aside>
  );
}

function SummaryRow({
  emphasis = false,
  label,
  value,
}: {
  emphasis?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd
        className={
          emphasis
            ? "text-2xl font-semibold leading-8 text-foreground"
            : "text-sm font-semibold text-foreground"
        }
      >
        {value}
      </dd>
    </div>
  );
}
