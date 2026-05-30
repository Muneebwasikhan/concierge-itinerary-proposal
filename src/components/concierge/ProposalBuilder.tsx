"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  DraftItemList,
  type DraftItineraryItem,
} from "@/components/concierge/DraftItemList";
import { ItineraryItemForm } from "@/components/concierge/ItineraryItemForm";
import { ProposalPreview } from "@/components/concierge/ProposalPreview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { sumCents } from "@/lib/money";
import type {
  ApiFailure,
  ApiSuccess,
  CreateProposalInput,
  CreateProposalItemInput,
  CreateProposalResult,
  ReservationWithMember,
} from "@/lib/types";

type ProposalBuilderProps = {
  reservation: ReservationWithMember;
};

export function ProposalBuilder({ reservation }: ProposalBuilderProps) {
  const router = useRouter();
  const [draftItems, setDraftItems] = useState<DraftItineraryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>();
  const [savedDraftId, setSavedDraftId] = useState<number | null>(null);
  const totalCents = sumCents(draftItems);

  function addDraftItem(item: CreateProposalItemInput) {
    setSavedDraftId(null);
    setSaveError(undefined);
    setDraftItems((currentItems) => [
      ...currentItems,
      {
        ...item,
        // Local-only key until ER-015 persists draft items to SQLite.
        localId: crypto.randomUUID(),
      },
    ]);
  }

  function removeDraftItem(localId: string) {
    setSavedDraftId(null);
    setSaveError(undefined);
    setDraftItems((currentItems) =>
      currentItems.filter((item) => item.localId !== localId),
    );
  }

  async function saveDraft() {
    if (draftItems.length === 0) {
      setSaveError("Add at least one itinerary item before saving a draft.");
      return;
    }

    setIsSaving(true);
    setSaveError(undefined);

    try {
      const proposal = await createDraftProposal({
        reservationId: reservation.id,
        items: draftItems.map(toCreateProposalItem),
      });

      setSavedDraftId(proposal.id);
      router.refresh();
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Draft proposal could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card as="section" padding="lg">
      <CardHeader>
        <CardTitle>Itinerary Builder</CardTitle>
        <CardDescription>
          Add line items locally before saving or sending a proposal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
          <div className="space-y-6">
            {/* This client island owns temporary draft state until the save/send flows are complete. */}
            <ItineraryItemForm onAddItem={addDraftItem} />
            <DraftItemList
              items={draftItems}
              totalCents={totalCents}
              onRemoveItem={removeDraftItem}
            />
          </div>
          <ProposalPreview
            items={draftItems}
            reservation={reservation}
            totalCents={totalCents}
            isSaving={isSaving}
            savedDraftId={savedDraftId}
            error={saveError}
            onSaveDraft={saveDraft}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function toCreateProposalItem(item: DraftItineraryItem): CreateProposalItemInput {
  return {
    category: item.category,
    title: item.title,
    description: item.description,
    scheduledAt: item.scheduledAt,
    priceCents: item.priceCents,
  };
}

async function createDraftProposal(
  input: CreateProposalInput,
): Promise<CreateProposalResult> {
  const response = await fetch("/api/proposals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });
  const body = (await response.json()) as
    | ApiSuccess<CreateProposalResult>
    | ApiFailure;

  if (!response.ok || "error" in body) {
    throw new Error(
      "error" in body
        ? body.error.message
        : "Draft proposal could not be saved.",
    );
  }

  return body.data;
}
