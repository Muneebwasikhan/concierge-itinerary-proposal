import { CheckCircle2, ClipboardList } from "lucide-react";
import type { ReactNode } from "react";

import type { DraftItineraryItem } from "@/components/concierge/DraftItemList";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  formatReservationDateRange,
  formatScheduledDateTime,
  getTripNightCount,
} from "@/lib/dates";
import { formatCents } from "@/lib/money";
import type { ReservationWithMember } from "@/lib/types";

type ProposalPreviewProps = {
  items: DraftItineraryItem[];
  reservation: ReservationWithMember;
  totalCents: number;
  isSaving: boolean;
  savedDraftId: number | null;
  error?: string;
  onSaveDraft: () => void;
};

export function ProposalPreview({
  error,
  isSaving,
  items,
  onSaveDraft,
  reservation,
  savedDraftId,
  totalCents,
}: ProposalPreviewProps) {
  const tripDates = formatReservationDateRange(
    reservation.arrivalDate,
    reservation.departureDate,
  );
  const nights = getTripNightCount(
    reservation.arrivalDate,
    reservation.departureDate,
  );
  const isSaveDisabled = items.length === 0 || isSaving || savedDraftId !== null;

  return (
    <aside
      className="rounded-lg border border-border bg-surface-muted p-5"
      aria-labelledby="proposal-preview-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3
            id="proposal-preview-heading"
            className="text-base font-semibold leading-7 text-foreground"
          >
            Proposal Preview
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Review the draft before saving it.
          </p>
        </div>
        <p className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
          Draft
        </p>
      </div>

      <div className="mt-5 rounded-lg border border-border bg-surface px-4 py-4">
        <PreviewRow label="Member" value={reservation.member.name} />
        <PreviewRow label="Villa" value={reservation.villa} />
        <PreviewRow label="Destination" value={reservation.destination} />
        <PreviewRow
          label="Trip dates"
          value={tripDates}
          detail={
            nights === null
              ? undefined
              : `${nights} ${nights === 1 ? "night" : "nights"}`
          }
        />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-sm font-semibold text-foreground">Items</h4>
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>

        {items.length === 0 ? (
          <EmptyState
            className="mt-3 min-h-40 bg-surface"
            icon={<ClipboardList className="h-5 w-5" />}
            title="Nothing to preview yet"
            description="Add itinerary items to see them here."
          />
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-surface">
            {items.map((item) => (
              <li key={item.localId} className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCents(item.priceCents)}
                  </p>
                </div>
                <p className="mt-1 text-xs font-medium text-accent">
                  {item.category} · {formatScheduledDateTime(item.scheduledAt)}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 rounded-lg border border-border bg-surface px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            Estimated total
          </p>
          <p className="text-xl font-semibold leading-7 text-foreground">
            {formatCents(totalCents)}
          </p>
        </div>
      </div>

      {savedDraftId ? (
        <StatusMessage tone="success" icon={<CheckCircle2 className="h-4 w-4" />}>
          Draft proposal PR-{savedDraftId.toString().padStart(4, "0")} saved.
        </StatusMessage>
      ) : null}

      {error ? (
        <StatusMessage tone="error">
          {error}
        </StatusMessage>
      ) : null}

      <Button
        type="button"
        className="mt-5 w-full"
        isLoading={isSaving}
        loadingLabel="Saving draft"
        disabled={isSaveDisabled}
        onClick={onSaveDraft}
      >
        {savedDraftId ? "Draft saved" : "Save Draft"}
      </Button>
    </aside>
  );
}

function PreviewRow({
  detail,
  label,
  value,
}: {
  detail?: string;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-border py-3 first:pt-0 last:border-b-0 last:pb-0">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
        {value}
      </p>
      {detail ? (
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  );
}

function StatusMessage({
  children,
  icon,
  tone,
}: {
  children: ReactNode;
  icon?: ReactNode;
  tone: "error" | "success";
}) {
  const toneClasses =
    tone === "success"
      ? "border-success/25 bg-success/10 text-success"
      : "border-danger/25 bg-danger/10 text-danger";

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${toneClasses}`}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span>{children}</span>
    </div>
  );
}
