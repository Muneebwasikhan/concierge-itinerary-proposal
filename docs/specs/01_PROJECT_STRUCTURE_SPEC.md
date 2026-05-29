# Project Structure and Engineering Spec

## Goal

Keep the project simple, reviewable, and aligned to the assessment. The reviewer should be able to understand the app structure quickly.

## Required Framework Shape

Use the Next.js App Router with a `src` directory.

Recommended structure:

```text
src/
  app/
    layout.tsx
    globals.css
    page.tsx
    proposal/
      [id]/
        page.tsx
    api/
      reservations/
        route.ts
      proposals/
        route.ts
        [id]/
          route.ts
          send/
            route.ts
  components/
    concierge/
      ReservationSummary.tsx
      ProposalBuilder.tsx
      CategoryPicker.tsx
      ItineraryItemForm.tsx
      DraftItemList.tsx
      ProposalPreview.tsx
      SentProposalsTable.tsx
      StatusBadge.tsx
    member/
      ProposalHero.tsx
      ConciergeNote.tsx
      ItineraryTimeline.tsx
      PriceSummary.tsx
      ProposalActions.tsx
      ConfirmationPanel.tsx
    ui/
      Button.tsx
      Input.tsx
      Textarea.tsx
      Select.tsx
      Card.tsx
      EmptyState.tsx
  lib/
    db.ts
    schema.ts
    seed.ts
    reset.ts
    proposals.ts
    validation.ts
    dates.ts
    money.ts
    types.ts
```

## Package Scripts

Recommended scripts:

```json
{
  "scripts": {
    "predev": "tsx src/lib/seed.ts",
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:seed": "tsx src/lib/seed.ts",
    "db:reset": "tsx src/lib/reset.ts"
  }
}
```

Reasoning:

- `predev` makes local startup close to one command after install.
- `db:seed` gives an explicit manual seed command.
- `db:reset` is helpful during development and demo prep.

## Dependencies

Required:

- `next`
- `react`
- `react-dom`
- `typescript`
- `tailwindcss`
- `better-sqlite3`
- `tsx`
- `@types/better-sqlite3`
- `@types/node`

Optional:

- `lucide-react` for small icons

Do not add:

- Redux
- Zustand
- React Query
- Payment SDKs
- Email SDKs
- Full component libraries unless choosing `shadcn/ui` intentionally

## Shared Constants

Create exact constants:

```ts
export const ITINERARY_CATEGORIES = [
  "Dining",
  "Activities",
  "Wellness",
  "Excursions",
  "Transport",
  "Experiences",
] as const;

export const PROPOSAL_STATUSES = [
  "draft",
  "sent",
  "approved",
  "paid",
] as const;
```

Status transitions:

```text
draft -> sent
sent -> approved
approved -> paid
```

Do not allow shortcuts such as `draft -> paid`.

## Helper Requirements

`money.ts`:

- Store DB price values as integer cents in the required `price` column.
- Expose TypeScript property names as `priceCents`.
- Format with `Intl.NumberFormat`.

`dates.ts`:

- Format reservation date range.
- Format scheduled item date/time.
- Group itinerary items by calendar day for member timeline if implemented.

`validation.ts`:

- Validate categories.
- Validate item payloads.
- Validate status transitions.
- Return plain, readable error messages.

## Coding Rules

- TypeScript throughout.
- Do not use `any` unless unavoidable and explained.
- Keep route handlers thin.
- Put database operations in `lib/proposals.ts` or similar.
- Keep components focused and named after their purpose.
- Do not invent routes, tables, statuses, or categories beyond the specs.
