# Database, Seed, and Persistence Spec

## Database

Use SQLite with `better-sqlite3`.

Recommended file:

```text
data/app.db
```

Add to `.gitignore`:

```text
data/*.db
data/*.db-shm
data/*.db-wal
```

## Schema

Use these tables.

```sql
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  destination TEXT NOT NULL,
  villa TEXT NOT NULL,
  arrival_date TEXT NOT NULL,
  departure_date TEXT NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id)
);

CREATE TABLE IF NOT EXISTS proposals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reservation_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'approved', 'paid')),
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sent_at TEXT,
  approved_at TEXT,
  paid_at TEXT,
  FOREIGN KEY (reservation_id) REFERENCES reservations(id)
);

CREATE TABLE IF NOT EXISTS proposal_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proposal_id INTEGER NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  price INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sent_emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proposal_id INTEGER NOT NULL,
  to_email TEXT NOT NULL,
  sent_at TEXT NOT NULL,
  body_preview TEXT NOT NULL,
  FOREIGN KEY (proposal_id) REFERENCES proposals(id)
);
```

Important:

- The DB column must be named `price` because the assessment requires it.
- Store cents in `proposal_items.price`.
- In TypeScript responses use `priceCents`.

## Seed Data

Seed one member:

```text
name: James Whitfield
email: james.whitfield@example.com
```

Seed one reservation:

```text
member_id: James Whitfield's id
destination: Punta Mita, Mexico
villa: Villa Punta Mita
arrival_date: 2027-03-15
departure_date: 2027-03-22
```

README assumption:

```text
The assessment provides March 15-22 without a year. This implementation uses 2027 so the reservation remains upcoming.
```

## Seed Behavior

The seed script must be idempotent:

- Running it multiple times must not duplicate James.
- Running it multiple times must not duplicate the base reservation.
- It should create schema first if needed.

Do not seed proposals by default. The demo should create a proposal through the UI.

## Reset Behavior

`db:reset` may:

- Delete or recreate the DB file.
- Re-run schema creation.
- Re-run seed.

Do not require manual SQLite commands from the reviewer.

## Data Access Functions

Create functions equivalent to:

- `getCurrentReservation()`
- `createProposal(input)`
- `listProposals()`
- `getProposalById(id)`
- `updateProposalStatus(id, nextStatus)`
- `sendProposal(id, baseUrl)`

Each function should return normalized camelCase TypeScript objects.

## Derived Values

Proposal totals:

- Sum `proposal_items.price`.
- Return as `totalCents`.

Proposal item count:

- Count items by `proposal_id`.

Ordering:

- In dashboard lists, newest proposals first.
- In member itinerary, order by `scheduled_at`, then `sort_order`, then `id`.
