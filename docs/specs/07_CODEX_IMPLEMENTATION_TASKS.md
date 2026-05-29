# Codex Implementation Tasks and Prompts

## ER-001 - Scaffold the Next.js App Router project

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: None
- Reference specs: 00_SOURCE_OF_TRUTH.md, 01_PROJECT_STRUCTURE_SPEC.md

### Goal

Create the base app exactly on the assessment stack.

### Files / Areas

- `package.json`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `tailwind.config.*`
- `tsconfig.json`

### Prompt to Give Codex

```text
You are implementing ER-001: Scaffold the Next.js App Router project.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Create a Next.js 14+ App Router project with TypeScript, Tailwind CSS, ESLint, and a `src` directory.

If the project is already scaffolded, inspect it and only fill missing setup pieces. Do not add database, API, or product UI yet.

Use the app name `concierge-itinerary-proposal` if a name is needed. Keep the initial page minimal and verify the dev server can start.
```

### Acceptance Criteria

- Project uses Next.js App Router with TypeScript.
- Tailwind CSS is configured and imported through `src/app/globals.css`.
- `src/app/layout.tsx` and `src/app/page.tsx` exist.
- No product-specific backend or UI has been implemented yet.

### QA / Verification

- Run `npm run dev` or equivalent and confirm the app loads.

## ER-002 - Install required dependencies and scripts

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-001
- Reference specs: 01_PROJECT_STRUCTURE_SPEC.md

### Goal

Add the minimal dependencies and package scripts needed for the assessment.

### Files / Areas

- `package.json`

### Prompt to Give Codex

```text
You are implementing ER-002: Install required dependencies and scripts.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Add only the dependencies needed for this app: `better-sqlite3`, `tsx`, `@types/better-sqlite3`, and optionally `lucide-react` for icons.

Add scripts: `predev`, `dev`, `build`, `start`, `lint`, `db:seed`, and `db:reset`. `predev` should run the seed script once it exists; if the seed script does not exist yet, add the script now and create the script in the later database task.

Do not add Prisma, Drizzle, payment SDKs, email SDKs, state-management libraries, or component libraries.
```

### Acceptance Criteria

- Required dependencies are present.
- Scripts match the project structure spec.
- No out-of-scope dependency has been added.

### QA / Verification

- Run package install if needed.
- Confirm `package.json` is valid JSON.

## ER-003 - Add shared constants, types, and helpers

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-002
- Reference specs: 00_SOURCE_OF_TRUTH.md, 01_PROJECT_STRUCTURE_SPEC.md

### Goal

Create source-of-truth TypeScript definitions before implementing data or UI.

### Files / Areas

- `src/lib/types.ts`
- `src/lib/validation.ts`
- `src/lib/money.ts`
- `src/lib/dates.ts`

### Prompt to Give Codex

```text
You are implementing ER-003: Add shared constants, types, and helpers.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Create shared TypeScript constants and helper files for the app.

Include exact itinerary categories: Dining, Activities, Wellness, Excursions, Transport, Experiences.

Include exact proposal statuses: draft, sent, approved, paid.

Add types for Member, Reservation, Proposal, ProposalItem, ProposalStatus, ItineraryCategory, API success/error shapes, and create-proposal input.

Add helper functions to format money from integer cents and dates from ISO strings. Add validation helpers for category, status, item payloads, and allowed status transitions.
```

### Acceptance Criteria

- Categories and statuses exactly match the assessment.
- Money helper formats cents as USD.
- Date helper supports reservation date range and item date/time display.
- Validation helper blocks invalid categories and invalid status transitions.

### QA / Verification

- Run TypeScript check or build when available.

## ER-004 - Implement SQLite connection and schema initialization

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-003
- Reference specs: 02_DATA_MODEL_SPEC.md

### Goal

Create the database foundation using the required tables and field names.

### Files / Areas

- `src/lib/db.ts`
- `src/lib/schema.ts`
- `data/.gitkeep`
- `.gitignore`

### Prompt to Give Codex

```text
You are implementing ER-004: Implement SQLite connection and schema initialization.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Implement SQLite persistence with `better-sqlite3`.

Create `data/app.db` as the database file. Ensure the data directory exists. Add `.gitignore` entries for SQLite DB files.

Create schema initialization for the five required tables: members, reservations, proposals, proposal_items, sent_emails.

Keep the required field names from the assessment. In `proposal_items`, the column must be named `price`; store integer cents in that column.
```

### Acceptance Criteria

- Database connection opens `data/app.db`.
- All five required tables are created.
- `proposal_items.price` exists and is integer cents.
- Status CHECK constraint allows only draft, sent, approved, paid.
- Database files are ignored by git.

### QA / Verification

- Run the schema initializer through the seed script or a temporary smoke check.

## ER-005 - Create idempotent seed and reset scripts

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-004
- Reference specs: 00_SOURCE_OF_TRUTH.md, 02_DATA_MODEL_SPEC.md

### Goal

Seed the assessment scenario without duplicating data.

### Files / Areas

- `src/lib/seed.ts`
- `src/lib/reset.ts`

### Prompt to Give Codex

```text
You are implementing ER-005: Create idempotent seed and reset scripts.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Create an idempotent seed script that initializes the schema and seeds James Whitfield plus the Villa Punta Mita reservation.

Use:
- James Whitfield
- james.whitfield@example.com
- Villa Punta Mita
- Punta Mita, Mexico
- arrival_date 2027-03-15
- departure_date 2027-03-22

Do not seed proposals by default. The app demo must create proposals through the UI.

Create a reset script that recreates the database and re-runs seed.
```

### Acceptance Criteria

- `npm run db:seed` creates schema and seed data.
- Running seed twice does not duplicate member or reservation.
- `npm run db:reset` returns DB to only the seeded member/reservation.
- No proposals are seeded.

### QA / Verification

- Run `npm run db:seed` twice.
- Run `npm run db:reset` once.

## ER-006 - Implement reservation API route

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-005
- Reference specs: 03_API_SPEC.md, 02_DATA_MODEL_SPEC.md

### Goal

Expose James Whitfield's current reservation to the dashboard.

### Files / Areas

- `src/app/api/reservations/route.ts`
- `src/lib/reservations.ts`

### Prompt to Give Codex

```text
You are implementing ER-006: Implement reservation API route.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Implement `GET /api/reservations`.

Return the current seeded reservation with member data using the exact response shape in the API spec. Use camelCase response fields.

Handle the missing-reservation case with a 404 JSON error.
```

### Acceptance Criteria

- `GET /api/reservations` returns James Whitfield and Villa Punta Mita data.
- Response uses `{ data: ... }`.
- Missing reservation returns `{ error: { message } }` with 404.

### QA / Verification

- Call the endpoint in the browser or with a local HTTP request.

## ER-007 - Implement proposal data access layer

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-005
- Reference specs: 02_DATA_MODEL_SPEC.md, 03_API_SPEC.md

### Goal

Centralize proposal database logic before writing route handlers.

### Files / Areas

- `src/lib/proposals.ts`

### Prompt to Give Codex

```text
You are implementing ER-007: Implement proposal data access layer.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Create proposal data access functions for create, list, get-by-id, update status, and send.

Functions should return normalized camelCase objects matching the API spec. Calculate `totalCents` from `proposal_items.price`. Sort member itinerary items by scheduled time, then sort order, then id.

Implement allowed transitions exactly: draft -> sent, sent -> approved, approved -> paid.
```

### Acceptance Criteria

- Data access functions exist for create/list/get/update/send.
- Totals and item counts are derived from database rows.
- Invalid transitions throw or return typed validation errors.
- Functions do not contain UI code.

### QA / Verification

- Use a temporary local script or route calls in later tasks to verify behavior.

## ER-008 - Implement proposals create and list API routes

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-007
- Reference specs: 03_API_SPEC.md

### Goal

Support dashboard proposal creation and list display.

### Files / Areas

- `src/app/api/proposals/route.ts`

### Prompt to Give Codex

```text
You are implementing ER-008: Implement proposals create and list API routes.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Implement:
- `POST /api/proposals`
- `GET /api/proposals`

`POST` should create a draft proposal and its line items. Validate reservationId, item category, title, description, scheduledAt, and priceCents.

`GET` should list all proposals with status, item count, totalCents, memberName, destination, villa, createdAt, sentAt, approvedAt, and paidAt.

Use consistent success and error response shapes from the API spec.
```

### Acceptance Criteria

- `POST /api/proposals` creates a draft proposal.
- `GET /api/proposals` lists proposals newest first.
- Invalid payloads return 400.
- Route handlers use the data access layer.

### QA / Verification

- Create a draft proposal with a local request.
- List proposals and confirm totals.

## ER-009 - Implement proposal detail and status update API routes

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-008
- Reference specs: 03_API_SPEC.md

### Goal

Support member proposal rendering and status transitions.

### Files / Areas

- `src/app/api/proposals/[id]/route.ts`

### Prompt to Give Codex

```text
You are implementing ER-009: Implement proposal detail and status update API routes.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Implement:
- `GET /api/proposals/[id]`
- `PATCH /api/proposals/[id]`

`GET` returns the full proposal with reservation, member, items, and totalCents.

`PATCH` accepts `{ status: "sent" | "approved" | "paid" }` and enforces the allowed transitions exactly. Set relevant timestamp fields when status changes.

Return 404 for unknown proposal IDs and 400 for invalid statuses or invalid transitions.
```

### Acceptance Criteria

- `GET /api/proposals/[id]` returns proposal with line items.
- `PATCH` supports sent, approved, and paid.
- Invalid transitions are blocked.
- Timestamp fields update appropriately.

### QA / Verification

- Use local requests to test draft -> sent -> approved -> paid and one invalid transition.

## ER-010 - Implement send proposal API route and email log

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-009
- Reference specs: 03_API_SPEC.md, 02_DATA_MODEL_SPEC.md

### Goal

Simulate the email send workflow required by the assessment.

### Files / Areas

- `src/app/api/proposals/[id]/send/route.ts`

### Prompt to Give Codex

```text
You are implementing ER-010: Implement send proposal API route and email log.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Implement `POST /api/proposals/[id]/send`.

It must:
- Require proposal exists.
- Require proposal is draft.
- Require proposal has at least one item.
- Mark status as sent.
- Set sent_at and updated_at.
- Insert a row into `sent_emails`.
- Return `{ data: { id, status: "sent", proposalUrl } }`.

No real email service should be added.
```

### Acceptance Criteria

- Draft proposal with items can be sent.
- Sending inserts into `sent_emails`.
- Sending an empty proposal returns 400.
- No real email dependency is used.

### QA / Verification

- Send a proposal locally and inspect response plus DB row if needed.

## ER-011 - Build base layout, global styles, and reusable UI primitives

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-010
- Reference specs: 01_PROJECT_STRUCTURE_SPEC.md, 04_CONCIERGE_DASHBOARD_SPEC.md, 05_MEMBER_PROPOSAL_SPEC.md

### Goal

Prepare a consistent visual foundation without a component library.

### Files / Areas

- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/components/ui/*`

### Prompt to Give Codex

```text
You are implementing ER-011: Build base layout, global styles, and reusable UI primitives.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Set up the app shell and small reusable UI components: Button, Input, Textarea, Select, Card, EmptyState.

Use Tailwind CSS only. Do not add shadcn/ui unless explicitly requested later.

The visual base should support two tones:
- efficient internal dashboard
- premium member proposal page

Keep components accessible with labels, focus states, and semantic buttons.
```

### Acceptance Criteria

- Reusable UI primitives exist and are typed.
- Global styles do not create a one-note color palette.
- Layout has metadata and sensible body styling.
- No component library is introduced.

### QA / Verification

- Run the app and confirm no styling errors.

## ER-012 - Build dashboard data-loading shell

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-011
- Reference specs: 04_CONCIERGE_DASHBOARD_SPEC.md, 03_API_SPEC.md

### Goal

Create the dashboard container that loads reservation and proposals.

### Files / Areas

- `src/app/page.tsx`
- `src/components/concierge/ReservationSummary.tsx`
- `src/components/concierge/SentProposalsTable.tsx`

### Prompt to Give Codex

```text
You are implementing ER-012: Build dashboard data-loading shell.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Build the `/` dashboard shell.

It should fetch:
- `GET /api/reservations`
- `GET /api/proposals`

Render loading, error, and empty states. Show the top reservation summary with James Whitfield's trip context.

Do not implement the full builder form yet; leave a clear placeholder where the builder will go.
```

### Acceptance Criteria

- Dashboard loads reservation data from the API.
- Reservation summary is prominent at the top.
- Proposals table area exists.
- Loading and error states exist.

### QA / Verification

- Open `/` and verify reservation data renders from the API.

## ER-013 - Build itinerary category picker and item form

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-012
- Reference specs: 04_CONCIERGE_DASHBOARD_SPEC.md, 00_SOURCE_OF_TRUTH.md

### Goal

Let the concierge enter valid proposal line items.

### Files / Areas

- `src/components/concierge/CategoryPicker.tsx`
- `src/components/concierge/ItineraryItemForm.tsx`

### Prompt to Give Codex

```text
You are implementing ER-013: Build itinerary category picker and item form.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Implement the category picker and item form.

Use only the six required categories. The form fields are category, title, description, date, time, and estimated price.

Validate on the client before adding an item to the local draft list. Convert entered dollar price to integer cents.

Do not save to the backend in this task.
```

### Acceptance Criteria

- All six categories are available.
- Client validation catches blank required fields and negative price.
- A valid item can be emitted to parent state.
- Price is represented as integer cents in state.

### QA / Verification

- Manually try adding valid and invalid item data.

## ER-014 - Build draft item list, remove action, and live total

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-013
- Reference specs: 04_CONCIERGE_DASHBOARD_SPEC.md

### Goal

Show the concierge exactly what is currently in the proposal draft.

### Files / Areas

- `src/components/concierge/DraftItemList.tsx`
- `src/lib/money.ts`

### Prompt to Give Codex

```text
You are implementing ER-014: Build draft item list, remove action, and live total.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Render the local draft itinerary item list in the dashboard.

Each item should display category, title, description, scheduled date/time, price, and a remove action.

Show a live total using the money helper. The total must update after add/remove.
```

### Acceptance Criteria

- Draft items render in the dashboard.
- Remove action works.
- Total updates correctly.
- Empty state is shown when no draft items exist.

### QA / Verification

- Add and remove several items and verify the total.

## ER-015 - Build proposal preview and save draft flow

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-014
- Reference specs: 04_CONCIERGE_DASHBOARD_SPEC.md, 03_API_SPEC.md

### Goal

Allow the concierge to review and persist a draft proposal.

### Files / Areas

- `src/components/concierge/ProposalPreview.tsx`
- `src/app/page.tsx`

### Prompt to Give Codex

```text
You are implementing ER-015: Build proposal preview and save draft flow.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Build the proposal preview component and wire up `Save Draft`.

Preview must show member/trip context, items, and total. Include the optional note field only if it already exists in state/schema; otherwise keep note out for now.

`Save Draft` should call `POST /api/proposals` with reservationId and draft items. Refresh the proposals table after save.
```

### Acceptance Criteria

- Preview shows all draft items and total.
- Save Draft persists a draft proposal.
- Saved proposal appears in proposals list.
- Errors are shown clearly.

### QA / Verification

- Save a draft and confirm it appears in `GET /api/proposals`.

## ER-016 - Build send proposal flow and success state

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-015
- Reference specs: 04_CONCIERGE_DASHBOARD_SPEC.md, 03_API_SPEC.md

### Goal

Complete the concierge create/send side of the core loop.

### Files / Areas

- `src/app/page.tsx`
- `src/components/concierge/ProposalPreview.tsx`

### Prompt to Give Codex

```text
You are implementing ER-016: Build send proposal flow and success state.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Wire up `Send Proposal`.

If there is no saved proposal yet, create a draft first with `POST /api/proposals`, then call `POST /api/proposals/[id]/send`.

Show a success state after sending, including the member route `/proposal/{id}`. Refresh the proposals table.

Block sending if there are zero draft items and show a clear error.
```

### Acceptance Criteria

- Concierge can send a proposal from the dashboard.
- Send creates a `sent_emails` row through the API.
- Success state includes member proposal link.
- Empty proposal cannot be sent.

### QA / Verification

- Complete create -> send from the UI.
- Confirm proposals table shows status `sent`.

## ER-017 - Finish sent proposals table and status badges

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-016
- Reference specs: 04_CONCIERGE_DASHBOARD_SPEC.md

### Goal

Make proposal statuses visible and useful to the concierge.

### Files / Areas

- `src/components/concierge/SentProposalsTable.tsx`
- `src/components/concierge/StatusBadge.tsx`

### Prompt to Give Codex

```text
You are implementing ER-017: Finish sent proposals table and status badges.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Complete the proposals table.

Show proposal id, member, destination, status, item count, total, created date, sent date, and member link.

Create status badges for draft, sent, approved, and paid. Use the colors from the dashboard spec and include readable text so status is not color-only.
```

### Acceptance Criteria

- All required table columns render.
- All four statuses have badges.
- Member link opens `/proposal/{id}`.
- Table has an empty state.

### QA / Verification

- Create/send/approve/pay proposals and verify the table reflects statuses after refresh.

## ER-018 - Build member proposal page shell and data fetch

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-017
- Reference specs: 05_MEMBER_PROPOSAL_SPEC.md, 03_API_SPEC.md

### Goal

Render proposal details for the member route.

### Files / Areas

- `src/app/proposal/[id]/page.tsx`
- `src/components/member/ProposalHero.tsx`

### Prompt to Give Codex

```text
You are implementing ER-018: Build member proposal page shell and data fetch.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Build `/proposal/[id]`.

Fetch `GET /api/proposals/[id]` and render the hero/header content: Your Punta Mita Itinerary, James Whitfield, Villa Punta Mita, Punta Mita, Mexico, and March 15-22, 2027.

Handle proposal not found and failed load states.

Do not implement approve/pay buttons yet.
```

### Acceptance Criteria

- `/proposal/{id}` loads proposal data.
- Hero content matches member UI spec.
- Not-found state exists.
- Page visual tone is premium, not dashboard-like.

### QA / Verification

- Open a sent proposal link and verify data appears.

## ER-019 - Build member itinerary timeline and price summary

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-018
- Reference specs: 05_MEMBER_PROPOSAL_SPEC.md

### Goal

Show the itinerary beautifully with all line items and pricing.

### Files / Areas

- `src/components/member/ItineraryTimeline.tsx`
- `src/components/member/PriceSummary.tsx`

### Prompt to Give Codex

```text
You are implementing ER-019: Build member itinerary timeline and price summary.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Implement the member itinerary timeline and price summary.

Timeline must show every item with category, title, description, date/time, and price. Sort by scheduled date/time. Group by day if practical; otherwise use a clean ordered vertical timeline.

Price summary must show total estimated cost clearly.
```

### Acceptance Criteria

- All proposal items render.
- Items are ordered by date/time.
- Each item shows category, title, description, date/time, and price.
- Total cost is clear and matches dashboard total.

### QA / Verification

- Compare member total with dashboard total.

## ER-020 - Build approve action

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-019
- Reference specs: 05_MEMBER_PROPOSAL_SPEC.md, 03_API_SPEC.md

### Goal

Allow the member to approve sent proposals.

### Files / Areas

- `src/components/member/ProposalActions.tsx`
- `src/app/proposal/[id]/page.tsx`

### Prompt to Give Codex

```text
You are implementing ER-020: Build approve action.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Implement member proposal actions for the `sent` state.

When proposal status is `sent`, show `Approve Proposal`. On click, call `PATCH /api/proposals/[id]` with `{ status: "approved" }`, show loading state, refresh local proposal state, and then show the next appropriate action.

Do not implement payment in this task.
```

### Acceptance Criteria

- Sent proposal shows approve button.
- Approve updates proposal to `approved`.
- Invalid or failed approval shows an error.
- After approval, approve button no longer appears.

### QA / Verification

- Open sent proposal, approve it, refresh page, confirm status persists.

## ER-021 - Build pay and lock-in action plus confirmation screen

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-020
- Reference specs: 05_MEMBER_PROPOSAL_SPEC.md, 03_API_SPEC.md

### Goal

Complete the member approve/pay side of the core loop.

### Files / Areas

- `src/components/member/ProposalActions.tsx`
- `src/components/member/ConfirmationPanel.tsx`

### Prompt to Give Codex

```text
You are implementing ER-021: Build pay and lock-in action plus confirmation screen.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Implement payment simulation.

When proposal status is `approved`, show `Pay & Lock In`. On click, call `PATCH /api/proposals/[id]` with `{ status: "paid" }`, show loading state, refresh local proposal state, and render a confirmation screen.

When status is `paid`, show the confirmation screen directly. Do not add a real payment form or payment SDK.
```

### Acceptance Criteria

- Approved proposal shows Pay & Lock In.
- Pay updates proposal to `paid`.
- Paid proposal shows confirmation screen.
- No real payment dependency is used.

### QA / Verification

- Approve then pay a proposal and refresh page to verify paid state persists.

## ER-022 - Add full loading, empty, and error state polish

- Owner: Codex
- Type: Implementation
- Priority: P1
- Depends on: ER-021
- Reference specs: 04_CONCIERGE_DASHBOARD_SPEC.md, 05_MEMBER_PROPOSAL_SPEC.md

### Goal

Make failure and edge states reviewer-friendly.

### Files / Areas

- `src/components/ui/EmptyState.tsx`
- `src/app/page.tsx`
- `src/app/proposal/[id]/page.tsx`

### Prompt to Give Codex

```text
You are implementing ER-022: Add full loading, empty, and error state polish.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Audit the app for loading, empty, and error states.

Add or improve:
- reservation load error
- no proposals yet
- no draft items yet
- send with zero items
- proposal not found
- failed approval
- failed payment
- draft proposal opened by member

Use concise, human-readable copy.
```

### Acceptance Criteria

- Every required edge state has visible UI.
- Error copy is clear and not technical.
- No broken blank screens remain.

### QA / Verification

- Manually trigger at least three edge states.

## ER-023 - Responsive and accessibility pass

- Owner: Codex
- Type: Implementation
- Priority: P1
- Depends on: ER-022
- Reference specs: 04_CONCIERGE_DASHBOARD_SPEC.md, 05_MEMBER_PROPOSAL_SPEC.md

### Goal

Make the app usable across viewport sizes and keyboard-friendly.

### Files / Areas

- `src/app/globals.css`
- `src/components/**/*.tsx`

### Prompt to Give Codex

```text
You are implementing ER-023: Responsive and accessibility pass.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Review the dashboard and member proposal page for responsive behavior and basic accessibility.

Ensure:
- inputs have labels
- buttons are semantic buttons
- focus states are visible
- color contrast is acceptable
- dashboard stacks on mobile
- member timeline reads well on mobile
- text does not overflow buttons/cards

Do not redesign the app from scratch.
```

### Acceptance Criteria

- Dashboard works on desktop and mobile widths.
- Member page works on desktop and mobile widths.
- Interactive controls are keyboard accessible.
- No obvious text overflow or overlap.

### QA / Verification

- Check at desktop and mobile viewport sizes.
- Tab through primary flows.

## ER-024 - Final visual polish for concierge and member experiences

- Owner: Codex
- Type: Implementation
- Priority: P1
- Depends on: ER-023
- Reference specs: 04_CONCIERGE_DASHBOARD_SPEC.md, 05_MEMBER_PROPOSAL_SPEC.md

### Goal

Make the two surfaces feel intentionally different and assessment-ready.

### Files / Areas

- `src/app/page.tsx`
- `src/app/proposal/[id]/page.tsx`
- `src/components/**/*.tsx`
- `src/app/globals.css`

### Prompt to Give Codex

```text
You are implementing ER-024: Final visual polish for concierge and member experiences.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Polish the UI while preserving all behavior.

Concierge dashboard should feel efficient, clear, and professional.

Member proposal should feel premium, calm, spacious, and luxurious.

Avoid one-note palettes, marketing-page hero sections on the dashboard, decorative clutter, and nested cards. Keep text sizes appropriate for their containers.
```

### Acceptance Criteria

- Dashboard is clean and work-focused.
- Member page feels premium and luxurious.
- Status badges and CTAs are visually clear.
- No layout overlaps or cramped tables.

### QA / Verification

- Visually review both routes after completing the full flow.

## ER-025 - Write README

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-024
- Reference specs: 06_DOCUMENTATION_AND_QA_SPEC.md, 00_SOURCE_OF_TRUTH.md

### Goal

Document setup, assumptions, decisions, and future improvements for the reviewer.

### Files / Areas

- `README.md`

### Prompt to Give Codex

```text
You are implementing ER-025: Write README.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Write the project README using the documentation spec.

Include:
- overview
- tech stack
- setup and run commands
- available scripts
- main routes
- data model summary
- workflow
- assumptions
- tradeoffs
- improvements with more time
- what was interesting or challenging
- Loom/walkthrough placeholder

Be concise but complete. Mention that email and payment are simulated.
```

### Acceptance Criteria

- README covers all assessment-required sections.
- Setup instructions are accurate.
- Assumption about 2027 dates is documented.
- Simulated email/payment are clearly explained.

### QA / Verification

- Follow README setup commands from a clean state if possible.

## ER-026 - Run full manual QA and fix blockers

- Owner: Codex
- Type: Implementation
- Priority: P0
- Depends on: ER-025
- Reference specs: 06_DOCUMENTATION_AND_QA_SPEC.md

### Goal

Verify the full assessment loop works before submission.

### Files / Areas

- `All implementation files as needed`

### Prompt to Give Codex

```text
You are implementing ER-026: Run full manual QA and fix blockers.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Run the full manual QA checklist from the documentation spec.

Verify:
- reservation loads
- proposal can be created
- proposal can be sent
- sent proposal appears in table
- member route opens
- member can approve
- member can pay
- confirmation appears

Run lint and build. Fix any blockers. Do not add new features during this task.
```

### Acceptance Criteria

- Full create -> send -> approve -> pay loop works.
- `npm run build` passes.
- `npm run lint` passes or any lint limitation is documented.
- No known required feature is broken.

### QA / Verification

- Record exact commands run and results for final notes.

## ER-027 - Prepare Loom walkthrough script notes

- Owner: Codex
- Type: Implementation
- Priority: P1
- Depends on: ER-026
- Reference specs: 06_DOCUMENTATION_AND_QA_SPEC.md

### Goal

Prepare a concise demo path for the required recorded walkthrough.

### Files / Areas

- `docs/LOOM_WALKTHROUGH.md`

### Prompt to Give Codex

```text
You are implementing ER-027: Prepare Loom walkthrough script notes.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Create `docs/LOOM_WALKTHROUGH.md` with a 5-10 minute walkthrough outline.

Include:
- intro
- dashboard reservation context
- add itinerary items
- preview and send
- open member proposal
- approve
- pay and confirmation
- schema/API decisions
- tradeoffs and future improvements

Do not record the Loom. This task only prepares the script/notes.
```

### Acceptance Criteria

- Walkthrough notes exist.
- Notes cover the full flow and key technical decisions.
- Notes are concise enough for 5-10 minutes.

### QA / Verification

- Read the notes aloud mentally and confirm order matches the app flow.

## ER-028 - Optional stretch: concierge note/message field

- Owner: Codex
- Type: Implementation
- Priority: P2
- Depends on: ER-027
- Reference specs: 00_SOURCE_OF_TRUTH.md, 04_CONCIERGE_DASHBOARD_SPEC.md, 05_MEMBER_PROPOSAL_SPEC.md

### Goal

Add the highest-value stretch goal only after required work passes.

### Files / Areas

- `src/components/concierge/ProposalPreview.tsx`
- `src/components/member/ConciergeNote.tsx`
- `src/lib/proposals.ts`

### Prompt to Give Codex

```text
You are implementing ER-028: Optional stretch: concierge note/message field.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Only start this task if all P0 tasks are complete and passing.

Add a concierge note/message field to the proposal builder. Persist it in `proposals.note` and render it in the member proposal page.

Keep it optional. Do not break existing proposals without notes.
```

### Acceptance Criteria

- Concierge can add an optional note.
- Note persists with the proposal.
- Member page renders note when present.
- Existing proposals without notes still work.

### QA / Verification

- Create a proposal with a note and verify member page.

## ER-029 - Optional stretch: edit draft before sending

- Owner: Codex
- Type: Implementation
- Priority: P2
- Depends on: ER-027
- Reference specs: 00_SOURCE_OF_TRUTH.md, 04_CONCIERGE_DASHBOARD_SPEC.md

### Goal

Allow draft refinement only if core flow is already complete.

### Files / Areas

- `src/app/page.tsx`
- `src/lib/proposals.ts`
- `src/app/api/proposals/[id]/route.ts`

### Prompt to Give Codex

```text
You are implementing ER-029: Optional stretch: edit draft before sending.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Only start this task if all required tasks are complete.

Allow concierge to load a draft proposal, edit its items, and save before sending. Keep the scope limited to draft proposals. Do not allow editing sent, approved, or paid proposals.
```

### Acceptance Criteria

- Draft proposal can be edited before send.
- Sent/approved/paid proposals cannot be edited.
- Totals update after draft edits.

### QA / Verification

- Create a draft, edit it, save it, then send it.

## ER-030 - Optional stretch: optimistic status updates and confirmation animation

- Owner: Codex
- Type: Implementation
- Priority: P2
- Depends on: ER-027
- Reference specs: 00_SOURCE_OF_TRUTH.md, 05_MEMBER_PROPOSAL_SPEC.md

### Goal

Improve feel without changing core behavior.

### Files / Areas

- `src/components/member/ProposalActions.tsx`
- `src/components/member/ConfirmationPanel.tsx`

### Prompt to Give Codex

```text
You are implementing ER-030: Optional stretch: optimistic status updates and confirmation animation.

This task is intended to be standalone. It includes the core implementation context below. If `docs/specs` exists in the repo, read the referenced spec files too for extra detail, but do not require hidden context to complete this task.

Project context:
- App name: Concierge Itinerary Proposal System.
- Company/scenario: Exclusive Resorts lightweight luxury travel assessment.
- Core workflow: concierge creates proposal -> sends proposal -> member approves -> member pays and locks it in.
- Required stack: Next.js 14+ App Router, TypeScript, Tailwind CSS, SQLite, `better-sqlite3`.
- Repo style: single Next.js app repo, not a monorepo.
- Required member: James Whitfield, `james.whitfield@example.com`.
- Required reservation: Villa Punta Mita, Punta Mita, Mexico, March 15-22. Use 2027 and document that year assumption.
- Required categories exactly: Dining, Activities, Wellness, Excursions, Transport, Experiences.
- Required statuses exactly: draft, sent, approved, paid.
- Allowed status transitions only: draft -> sent, sent -> approved, approved -> paid.
- Required API routes: GET /api/reservations, POST /api/proposals, GET /api/proposals, GET /api/proposals/[id], PATCH /api/proposals/[id], POST /api/proposals/[id]/send.
- Required DB tables: members, reservations, proposals, proposal_items, sent_emails.
- Required line item fields: category, title, description, date/time, estimated price.
- Email is simulated only by console log and/or `sent_emails` row. Do not add real email services.
- Payment is simulated only by moving proposal status to paid. Do not add payment SDKs.
- Concierge dashboard must be efficient, single-page, and show reservation context prominently.
- Member proposal route `/proposal/[id]` must feel premium/luxury and support approve/pay/confirmation.
- README must include setup, assumptions, improvements with more time, and what was interesting or challenging.
- Human deliverables include GitHub repo and 5-10 minute Loom/recorded walkthrough.

Do not invent routes, tables, statuses, categories, dependencies, or product features beyond the referenced specs. If a required detail is missing, stop and ask.

Only start this task after all required work passes.

Add light optimistic UI for approve/pay and a subtle confirmation animation. Keep it tasteful and accessible. Do not add animation libraries unless already present.
```

### Acceptance Criteria

- Approve/pay feel instant while preserving error handling.
- Confirmation animation is subtle.
- No accessibility regression.

### QA / Verification

- Test approve/pay success and one simulated failure if practical.
