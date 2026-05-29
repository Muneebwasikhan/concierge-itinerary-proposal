# Documentation, QA, and Demo Spec

## README Requirements

The README must include:

- Project overview
- Tech stack
- How to install and run locally
- Available scripts
- Main routes
- Data model summary
- Workflow summary
- Assumptions
- Tradeoffs
- What would be improved with more time
- What was most interesting or challenging
- Loom/walkthrough note or link placeholder

## Required Setup Instructions

Recommended:

```bash
npm install
npm run dev
```

Because `predev` seeds the database, this should be enough after install.

Also document:

```bash
npm run db:seed
npm run db:reset
npm run build
```

## Required Assumptions

Include:

- The assessment did not specify a year for March 15-22, so the app uses 2027.
- Email sending is simulated by writing to `sent_emails`.
- Payment is simulated by moving proposal status to `paid`.
- The app is seeded with one member and one reservation.
- Authentication is out of scope.

## Required Tradeoffs

Include:

- Used `better-sqlite3` for a small, reviewable assessment app.
- Kept the database simple and normalized only where useful.
- Kept the concierge dashboard single-page to match the assessment.
- Did not add real payment or email providers because the assessment says not to.

## Improvements With More Time

Mention:

- Authentication and secure proposal links
- Real email provider
- Real payment provider
- Multiple members/reservations
- Draft editing and revision history
- Drag-and-drop itinerary ordering
- PDF export
- Audit log

## Interesting or Challenging

Mention:

- Balancing an efficient concierge workflow with a premium member view.
- Keeping simulated email/payment meaningful without overbuilding.
- Modeling status transitions clearly.

## Manual QA Checklist

Required flow:

1. Start app.
2. Dashboard loads James Whitfield reservation.
3. Add at least three itinerary items.
4. Preview proposal.
5. Send proposal.
6. Confirm sent proposal appears in table.
7. Open `/proposal/{id}`.
8. Approve proposal.
9. Pay and lock in.
10. Confirm paid state appears.

API checks:

- `GET /api/reservations`
- `POST /api/proposals`
- `GET /api/proposals`
- `GET /api/proposals/[id]`
- `PATCH /api/proposals/[id]`
- `POST /api/proposals/[id]/send`

Build checks:

- `npm run lint`
- `npm run build`

If a check cannot be run, note why in the README or final delivery notes.

## Loom Walkthrough Structure

Target: 5-10 minutes.

1. Introduce the app and assessment goal.
2. Show reservation context on dashboard.
3. Add itinerary items.
4. Preview and send proposal.
5. Show sent proposal table.
6. Open member proposal route.
7. Approve proposal.
8. Pay and lock in.
9. Explain schema/API decisions.
10. Explain tradeoffs and future improvements.
