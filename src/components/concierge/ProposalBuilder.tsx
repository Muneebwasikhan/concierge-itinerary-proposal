"use client";

import { useState } from "react";

import { ItineraryItemForm } from "@/components/concierge/ItineraryItemForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { CreateProposalItemInput } from "@/lib/types";

export function ProposalBuilder() {
  const [draftItems, setDraftItems] = useState<CreateProposalItemInput[]>([]);

  function addDraftItem(item: CreateProposalItemInput) {
    setDraftItems((currentItems) => [...currentItems, item]);
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
        {/* This client island owns temporary draft state until the save flow is added. */}
        <ItineraryItemForm onAddItem={addDraftItem} />
        <div
          role="status"
          aria-live="polite"
          className="mt-5 rounded-lg border border-border bg-surface-muted px-4 py-3 text-sm text-muted-foreground"
        >
          <span className="font-medium text-foreground">
            {draftItems.length}
          </span>{" "}
          {draftItems.length === 1 ? "item" : "items"} staged locally. The
          draft list and live total are added in the next step.
        </div>
      </CardContent>
    </Card>
  );
}
