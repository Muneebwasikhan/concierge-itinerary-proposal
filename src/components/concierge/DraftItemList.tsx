import { CalendarClock, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatScheduledDateTime } from "@/lib/dates";
import { formatCents } from "@/lib/money";
import type { CreateProposalItemInput } from "@/lib/types";

export type DraftItineraryItem = CreateProposalItemInput & {
  localId: string;
};

type DraftItemListProps = {
  items: DraftItineraryItem[];
  totalCents: number;
  onRemoveItem: (localId: string) => void;
};

export function DraftItemList({
  items,
  onRemoveItem,
  totalCents,
}: DraftItemListProps) {
  return (
    <section className="border-t border-border pt-5" aria-labelledby="draft-items-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3
            id="draft-items-heading"
            className="text-base font-semibold leading-7 text-foreground"
          >
            Draft Items
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Local items waiting to be saved to a proposal.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface-muted px-4 py-3 text-sm">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Live total
          </p>
          <p className="mt-1 text-lg font-semibold leading-6 text-foreground">
            {formatCents(totalCents)}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          className="mt-4 min-h-44"
          icon={<CalendarClock className="h-5 w-5" />}
          title="No draft items yet"
          description="Add an itinerary item to start building this proposal."
        />
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface">
          {items.map((item) => (
            <li
              key={item.localId}
              className="grid gap-4 px-4 py-4 lg:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                    {item.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatScheduledDateTime(item.scheduledAt)}
                  </span>
                </div>
                <h4 className="mt-3 text-base font-semibold leading-6 text-foreground">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 lg:min-w-48 lg:justify-end">
                <p className="text-base font-semibold text-foreground">
                  {formatCents(item.priceCents)}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${item.title}`}
                  onClick={() => onRemoveItem(item.localId)}
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
