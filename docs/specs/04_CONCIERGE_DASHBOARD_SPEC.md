# Concierge Dashboard UI Spec

## Route

Use `/` for the concierge dashboard.

## UX Goal

The concierge dashboard should feel efficient and functional. It is an internal work surface for professionals who move quickly.

Design priorities:

- Clear reservation context at the top
- Fast item entry
- Obvious proposal preview
- Clear send action
- Easy status visibility

Avoid:

- Marketing page layout
- Oversized hero
- Decorative clutter
- Too many nested cards

## Required Top Reservation Summary

Display prominently:

- James Whitfield
- Villa Punta Mita
- Punta Mita, Mexico
- Arrival date
- Departure date
- Trip length, e.g. `7 nights`

Use the data from `GET /api/reservations`.

## Required Builder Form

Fields:

- Category
- Title
- Description
- Date
- Time
- Estimated price

Category control:

- Use selectable cards, segmented controls, or a dropdown.
- Show the exact six required categories.

Form rules:

- Title required.
- Description required.
- Date required.
- Time required.
- Price required and >= 0.
- Date and time should combine into `scheduledAt`.
- Price should convert dollars to cents.

Primary action:

- `Add to Proposal`

Secondary:

- Clear/reset form.

## Draft Item List

Show every unsent item currently in the draft.

Each item displays:

- Category
- Title
- Description
- Scheduled date/time
- Price
- Remove action

The total should update immediately when items are added or removed.

## Proposal Preview

Before sending, the concierge must be able to preview:

- Member name
- Trip context
- Optional note if implemented
- Every line item
- Total cost

Actions:

- `Save Draft`
- `Send Proposal`

Recommended behavior:

- `Save Draft` calls `POST /api/proposals`.
- `Send Proposal` creates a draft first if needed, then calls `POST /api/proposals/[id]/send`.

## Send Success State

After successful send:

- Show a visible success message.
- Show or link to `/proposal/{id}`.
- Refresh the sent proposals table.

Example copy:

```text
Proposal sent. James can now review the itinerary.
```

## Proposals Table

Show all proposals with current status.

Columns:

- Proposal ID
- Member
- Destination
- Status
- Item count
- Total
- Created
- Sent
- Member link

Status badge colors:

- Draft: neutral gray
- Sent: blue
- Approved: amber/gold
- Paid: green

## Loading and Error States

Include:

- Loading state while reservation/proposals load.
- Empty state when no proposals exist.
- Inline form errors.
- Send error if attempting to send with zero items.

## Responsive Behavior

Desktop:

- Reservation summary on top.
- Builder and preview in two columns.
- Proposals table below.

Mobile:

- Stack reservation, builder, preview, and proposals.
- Keep buttons easy to tap.
