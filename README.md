# Concierge Itinerary Proposal System

A lightweight Exclusive Resorts assessment app for creating, sending, approving, and paying for a luxury itinerary proposal.

The app supports the core flow end to end:

```text
Concierge creates proposal -> Concierge sends proposal -> Member approves -> Member pays and locks it in
```

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- SQLite
- `better-sqlite3`
- `tsx` for seed/reset scripts
- `lucide-react` for interface icons

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

`npm run dev` runs the seed script first, so the app should be ready with the seeded James Whitfield reservation.

## Scripts

```bash
npm run dev       # Seed if needed and start the local dev server
npm run build     # Create a production build
npm run start     # Start the production server after build
npm run lint      # Run ESLint
npm run db:seed   # Initialize schema and seed required assessment data
npm run db:reset  # Recreate the SQLite database and seed it again
```

## Main Routes

- `/` - Concierge dashboard for the current reservation, draft builder, preview, send flow, and proposals table.
- `/proposal/[id]` - Member-facing proposal page with itinerary timeline, price summary, approve action, pay action, and paid confirmation.
- `/api/reservations` - Returns the seeded current reservation with member data.
- `/api/proposals` - Creates draft proposals and lists proposal summaries.
- `/api/proposals/[id]` - Returns proposal detail or updates proposal status.
- `/api/proposals/[id]/send` - Simulates sending a proposal and logs the send event.

## Data Model

SQLite stores the app data in `data/app.db`.

- `members` - Member identity: `id`, `name`, `email`.
- `reservations` - Trip context: `member_id`, `destination`, `villa`, `arrival_date`, `departure_date`.
- `proposals` - Proposal lifecycle: `reservation_id`, `status`, timestamps for created/updated/sent/approved/paid, and nullable `note`.
- `proposal_items` - Itinerary line items: `category`, `title`, `description`, `scheduled_at`, `price` in integer cents, and `sort_order`.
- `sent_emails` - Simulated email log: `proposal_id`, `to_email`, `sent_at`, `body_preview`.

Proposal statuses are limited to `draft`, `sent`, `approved`, and `paid`.

Allowed status transitions:

```text
draft -> sent -> approved -> paid
```

## Workflow

1. The concierge opens the dashboard and sees James Whitfield's Villa Punta Mita reservation.
2. The concierge adds itinerary items using the required categories.
3. The dashboard shows a local draft list, live total, and proposal preview.
4. The concierge saves a draft or sends the proposal.
5. Sending writes a simulated email record and makes the member link available.
6. The member opens `/proposal/[id]`, reviews the itinerary and total, then approves.
7. After approval, the member can pay and lock in the proposal.
8. Payment is simulated by moving the proposal to `paid` and showing confirmation.

## Assumptions

- The assessment specifies March 15-22 but not a year, so the reservation uses 2027.
- The app is seeded with one member, James Whitfield, and one Villa Punta Mita reservation.
- Email is simulated by writing to `sent_emails`; no real email provider is connected.
- Payment is simulated by changing proposal status to `paid`; no payment SDK is connected.
- Authentication and secure member links are out of scope for this assessment.
- The app is intentionally a single Next.js app repo, not a monorepo.

## Tradeoffs

- `better-sqlite3` keeps persistence simple, local, and easy to review for a small assessment app.
- The schema is normalized around the core workflow without adding unnecessary admin or multi-tenant concepts.
- The concierge dashboard stays single-page so the workflow is fast and aligned with the prompt.
- Real email, payment, and authentication were intentionally avoided because the assessment calls for simulated flows.

## Improvements With More Time

- Authentication and secure proposal links.
- Real email delivery with templates and delivery status.
- Real payment provider integration.
- Multiple members and reservations.
- Draft editing, proposal revisions, and version history.
- Drag-and-drop itinerary ordering.
- PDF export for the final itinerary.
- Audit log for status changes and sent messages.

## Interesting or Challenging

The most interesting part was balancing two different experiences in one small app: an efficient, work-focused concierge dashboard and a premium member proposal page. The core state machine also mattered: simulated email and payment still need clear persistence and status transitions so the workflow feels real without overbuilding.

## Loom Walkthrough

Placeholder: add the final 5-10 minute Loom or recorded walkthrough link here.

Suggested walkthrough path:

1. Introduce the assessment goal and tech stack.
2. Show the seeded James Whitfield reservation on the dashboard.
3. Add itinerary items and review the live preview.
4. Send the proposal and open the member link.
5. Approve the proposal.
6. Pay and show the locked-in confirmation state.
7. Briefly explain schema, API routes, tradeoffs, and future improvements.
