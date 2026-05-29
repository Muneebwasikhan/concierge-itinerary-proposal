# Source of Truth and Assessment Alignment

This implementation pack is based on:

- Assessment file: `/Users/muneebwasikhan/Desktop/Full Stack Developer TT.docx`
- Build plan: `APP_BUILD_PLAN.md`

The assessment is the source of truth. The build plan provides implementation decisions that stay inside the assessment scope.

## Required App

Build a lightweight Concierge Itinerary Proposal System for Exclusive Resorts.

Core workflow:

```text
Concierge creates proposal -> Concierge sends proposal -> Member approves -> Member pays and locks it in
```

The workflow must work end to end. Do not stop after static screens.

## Required Stack

- Next.js 14+ with App Router preferred
- TypeScript throughout
- Tailwind CSS for styling
- SQLite for persistence
- SQLite access through `better-sqlite3`, Prisma with SQLite, or Drizzle with SQLite

Chosen implementation:

- Next.js 14+ App Router
- TypeScript
- Tailwind CSS
- SQLite
- `better-sqlite3`

## Required Scenario Data

Member:

- Name: James Whitfield
- Email: `james.whitfield@example.com`

Reservation:

- Villa: Villa Punta Mita
- Destination: Punta Mita, Mexico
- Arrival: March 15
- Departure: March 22

The assessment does not specify a year. Use 2027 and document that assumption in the README.

## Required Itinerary Categories

Use these categories exactly:

- Dining
- Activities
- Wellness
- Excursions
- Transport
- Experiences

Each proposal line item must include:

- Category
- Title
- Description
- Date/time
- Estimated price

## Required Pages

Concierge dashboard:

- Single-page dashboard
- Displays destination, arrival date, and departure date prominently at the top
- Lets concierge build itinerary proposal from predefined categories
- Lets concierge preview before sending
- Lets concierge send proposal
- Simulates email by console log and/or writing to `sent_emails`
- Shows success state after sending
- Shows all sent proposals with status: `draft`, `sent`, `approved`, `paid`

Member experience:

- Separate route such as `/proposal/[id]`
- Beautifully presented itinerary
- Shows all line items, dates, and pricing
- Shows total cost clearly
- Approve button moves proposal to `approved`
- Pay & Lock In button moves proposal to `paid`
- Shows confirmation screen after payment
- Must feel premium and luxurious

## Required API Routes

- `GET /api/reservations` returns the member's current reservation
- `POST /api/proposals` creates a new draft proposal
- `GET /api/proposals` lists all proposals with status
- `GET /api/proposals/[id]` gets a single proposal with line items
- `PATCH /api/proposals/[id]` updates status: `sent`, `approved`, `paid`
- `POST /api/proposals/[id]/send` marks as sent and logs the simulated email

## Required Database Tables

Minimum assessment schema:

- `members`: `id`, `name`, `email`
- `reservations`: `id`, `member_id`, `destination`, `villa`, `arrival_date`, `departure_date`
- `proposals`: `id`, `reservation_id`, `status`, `created_at`, `sent_at`
- `proposal_items`: `id`, `proposal_id`, `category`, `title`, `description`, `scheduled_at`, `price`
- `sent_emails`: `id`, `proposal_id`, `to_email`, `sent_at`, `body_preview`

Implementation may add:

- `proposals.updated_at`
- `proposals.approved_at`
- `proposals.paid_at`
- `proposals.note` only if implementing the stretch note/message field
- `proposal_items.sort_order`

Do not remove or rename the required fields.

## Required Deliverables

- GitHub repo with the full solution
- README with:
  - How to install and run locally
  - Assumptions made
  - What would be improved given more time
  - What was most interesting or challenging
- 5-10 minute Loom or recorded walkthrough showing the full flow and key decisions

## Explicit Non-Goals

Do not implement these unless all required work is complete and they are clearly marked as future or stretch:

- Real payment processing
- Real email sending
- Authentication
- Multi-member UI
- Multi-reservation UI
- Admin dashboard
- PDF export
- Overly complex database architecture
