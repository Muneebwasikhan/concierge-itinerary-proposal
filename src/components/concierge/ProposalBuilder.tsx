"use client";

import { useState } from "react";

import {
  DraftItemList,
  type DraftItineraryItem,
} from "@/components/concierge/DraftItemList";
import { ItineraryItemForm } from "@/components/concierge/ItineraryItemForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { sumCents } from "@/lib/money";
import type { CreateProposalItemInput } from "@/lib/types";

export function ProposalBuilder() {
  const [draftItems, setDraftItems] = useState<DraftItineraryItem[]>([]);
  const totalCents = sumCents(draftItems);

  function addDraftItem(item: CreateProposalItemInput) {
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
    setDraftItems((currentItems) =>
      currentItems.filter((item) => item.localId !== localId),
    );
  }

  return (
    <Card as="section" padding="lg">
      <CardHeader>
        <CardTitle>Itinerary Builder</CardTitle>
        <CardDescription>
          Add line items locally before saving or sending a proposal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* This client island owns temporary draft state until the save flow is added. */}
        <ItineraryItemForm onAddItem={addDraftItem} />
        <DraftItemList
          items={draftItems}
          totalCents={totalCents}
          onRemoveItem={removeDraftItem}
        />
      </CardContent>
    </Card>
  );
}
