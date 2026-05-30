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
import { Textarea } from "@/components/ui/Textarea";
import { sumCents } from "@/lib/money";
import type {
  ApiFailure,
  ApiSuccess,
  CreateProposalInput,
  CreateProposalItemInput,
  CreateProposalResult,
  ReservationWithMember,
  SendProposalResult,
} from "@/lib/types";

type ProposalBuilderProps = {
  reservation: ReservationWithMember;
};

export function ProposalBuilder({ reservation }: ProposalBuilderProps) {
  const router = useRouter();
  const [draftItems, setDraftItems] = useState<DraftItineraryItem[]>([]);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>();
  const [savedDraftId, setSavedDraftId] = useState<number | null>(null);
  const [sentProposalId, setSentProposalId] = useState<number | null>(null);
  const totalCents = sumCents(draftItems);

  function addDraftItem(item: CreateProposalItemInput) {
    setSavedDraftId(null);
    setSentProposalId(null);
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
    setSentProposalId(null);
    setSaveError(undefined);
    setDraftItems((currentItems) =>
      currentItems.filter((item) => item.localId !== localId),
    );
  }

  async function saveDraft() {
    if (draftItems.length === 0) {
      setSaveError("Add an itinerary item before saving.");
      return;
    }

    setIsSaving(true);
    setSaveError(undefined);

    try {
      const proposal = await createDraftProposal({
        reservationId: reservation.id,
        note: note.trim() || undefined,
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

  async function sendDraftProposal() {
    if (draftItems.length === 0) {
      setSaveError("Add an itinerary item before sending.");
      return;
    }

    setIsSending(true);
    setSaveError(undefined);

    try {
      let proposalId = savedDraftId;

      if (!proposalId) {
        const draftProposal = await createDraftProposal({
          reservationId: reservation.id,
          note: note.trim() || undefined,
          items: draftItems.map(toCreateProposalItem),
        });

        proposalId = draftProposal.id;
        setSavedDraftId(draftProposal.id);
      }

      const sentProposal = await sendProposal(proposalId);

      setSavedDraftId(proposalId);
      setSentProposalId(sentProposal.id);
      router.refresh();
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Proposal could not be sent.",
      );
    } finally {
      setIsSending(false);
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
            <div className="mt-6">
              <Textarea
                id="proposal-note"
                label="Concierge Message (Optional)"
                placeholder="Add a warm personal greeting, trip details, or preparation notes for the member..."
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setSaveError(undefined);
                }}
                disabled={savedDraftId !== null || sentProposalId !== null}
              />
            </div>
          </div>
          <ProposalPreview
            items={draftItems}
            reservation={reservation}
            totalCents={totalCents}
            isSaving={isSaving}
            isSending={isSending}
            savedDraftId={savedDraftId}
            sentProposalId={sentProposalId}
            error={saveError}
            note={note}
            onSaveDraft={saveDraft}
            onSendProposal={sendDraftProposal}
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

async function sendProposal(proposalId: number): Promise<SendProposalResult> {
  const response = await fetch(`/api/proposals/${proposalId}/send`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const body = (await response.json()) as
    | ApiSuccess<SendProposalResult>
    | ApiFailure;

  if (!response.ok || "error" in body) {
    throw new Error(
      "error" in body ? body.error.message : "Proposal could not be sent.",
    );
  }

  return body.data;
}
