import { Clock3, ListChecks } from "lucide-react";

import {
  formatScheduledDateTime,
  groupItemsByDay,
  parseIsoDate,
} from "@/lib/dates";
import { formatCents } from "@/lib/money";
import type { ProposalDetailItem } from "@/lib/types";

type ProposalTimelineProps = {
  items: ProposalDetailItem[];
};

export function ProposalTimeline({ items }: ProposalTimelineProps) {
  const sortedItems = [...items].sort(compareScheduledItems);
  const groupedItems = groupItemsByDay(sortedItems);

  return (
    <section
      aria-labelledby="proposal-timeline-heading"
      className="rounded-lg border border-border bg-surface p-5 shadow-[0_18px_44px_rgba(37,32,24,0.07)] sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-sm font-semibold uppercase text-accent">
            Itinerary
          </p>
          <h2
            id="proposal-timeline-heading"
            className="mt-1 break-words text-2xl font-semibold leading-8 text-foreground"
          >
            Daily timeline
          </h2>
        </div>
        <p className="rounded-full border border-border bg-surface-muted px-3 py-1 text-sm font-medium text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {sortedItems.length === 0 ? (
        <div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted px-6 py-10 text-center">
          <div
            aria-hidden="true"
            className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent"
          >
            <ListChecks className="h-5 w-5" />
          </div>
          <p className="text-base font-semibold leading-7 text-foreground">
            No itinerary items yet
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Once the concierge adds experiences, they will appear here in
            scheduled order.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {groupedItems.map((group) => (
            <section key={group.dateKey} aria-labelledby={`day-${group.dateKey}`}>
              <h3
                id={`day-${group.dateKey}`}
                className="text-sm font-semibold uppercase text-muted-foreground"
              >
                {group.label}
              </h3>

              <ol className="mt-4 space-y-4 border-l border-border pl-4 sm:pl-5">
                {group.items.map((item) => (
                  <TimelineItem key={item.id} item={item} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

function TimelineItem({ item }: { item: ProposalDetailItem }) {
  return (
    <li className="relative rounded-lg border border-border bg-surface-muted p-4">
      <span
        aria-hidden="true"
        className="absolute -left-[1.48rem] top-5 h-3 w-3 rounded-full border-2 border-surface bg-accent sm:-left-[1.72rem]"
      />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-accent">
            {item.category}
          </p>
          <h4 className="mt-1 break-words text-lg font-semibold leading-7 text-foreground">
            {item.title}
          </h4>
        </div>
        <p className="shrink-0 text-base font-semibold leading-7 text-foreground">
          {formatCents(item.priceCents)}
        </p>
      </div>

      <p className="mt-3 flex items-start gap-2 text-sm font-medium text-muted-foreground">
        <Clock3 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <time className="min-w-0 break-words" dateTime={item.scheduledAt}>
          {formatScheduledDateTime(item.scheduledAt)}
        </time>
      </p>

      <p className="mt-3 break-words text-sm leading-6 text-muted-foreground">
        {item.description}
      </p>
    </li>
  );
}

function compareScheduledItems(
  left: ProposalDetailItem,
  right: ProposalDetailItem,
): number {
  const leftDate = parseIsoDate(left.scheduledAt)?.getTime() ?? 0;
  const rightDate = parseIsoDate(right.scheduledAt)?.getTime() ?? 0;

  if (leftDate !== rightDate) {
    return leftDate - rightDate;
  }

  if (left.sortOrder !== right.sortOrder) {
    return left.sortOrder - right.sortOrder;
  }

  return left.id - right.id;
}
