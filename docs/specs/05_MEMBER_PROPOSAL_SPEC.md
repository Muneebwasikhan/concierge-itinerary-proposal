# Member Proposal UI Spec

## Route

Use `/proposal/[id]`.

## UX Goal

The member page should feel premium, calm, and luxurious. It is the experience James sees after clicking the simulated email link.

Design priorities:

- Spacious layout
- Elegant typography
- Refined color palette
- Clear itinerary timeline
- Clear total price
- Simple approval/payment actions

Avoid:

- Generic SaaS dashboard styling
- Dense tables for the itinerary
- Cluttered controls
- Real payment forms

## Required Content

Hero/header:

- `Your Punta Mita Itinerary`
- James Whitfield
- Villa Punta Mita
- Punta Mita, Mexico
- March 15-22, 2027

Itinerary:

- All proposal line items
- Category
- Title
- Description
- Date/time
- Price

Total:

- Total estimated cost shown clearly

Actions:

- If status is `sent`, show `Approve Proposal`.
- If status is `approved`, show `Pay & Lock In`.
- If status is `paid`, show confirmation screen.
- If status is `draft`, show a message that the proposal has not been sent yet.

## Timeline

Show the itinerary ordered by scheduled date/time.

Preferred layout:

- Group by day.
- Under each day, show timeline items in time order.

Example:

```text
March 15
4:00 PM - Private Airport Transfer
7:30 PM - Private Chef Welcome Dinner
```

If day grouping is too much for the first version, still display a clean vertical timeline ordered by date/time.

## Approval Action

When James clicks `Approve Proposal`:

- Call `PATCH /api/proposals/[id]` with `{ "status": "approved" }`.
- Show loading state while updating.
- Refresh local proposal state.
- Replace approve button with `Pay & Lock In`.

Only sent proposals can be approved.

## Payment Action

When James clicks `Pay & Lock In`:

- Call `PATCH /api/proposals/[id]` with `{ "status": "paid" }`.
- Show loading state while updating.
- Refresh local proposal state.
- Show confirmation screen.

Only approved proposals can be paid.

## Confirmation Screen

Show:

- `Your itinerary is locked in.`
- Villa and destination
- Trip dates
- Total paid/locked-in amount
- Calm confirmation copy

Example:

```text
Our concierge team will finalize each experience ahead of your arrival at Villa Punta Mita.
```

## Premium Visual Direction

Use:

- Warm ivory or soft neutral background
- Deep charcoal text
- Muted gold accent
- Soft green for paid confirmation
- Plenty of whitespace
- Subtle borders/shadows

Do not make the entire page one color family. Keep the palette balanced and restrained.

## Error States

Handle:

- Proposal not found
- Failed approval
- Failed payment
- Draft proposal accessed by member

Use readable, calm copy.
