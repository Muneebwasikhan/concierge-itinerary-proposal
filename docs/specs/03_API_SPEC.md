# API Route Spec

All API responses should be consistent.

Success:

```ts
{ data: ... }
```

Error:

```ts
{
  error: {
    message: string;
    code?: string;
  }
}
```

Use appropriate status codes:

- `200` for successful reads/updates
- `201` for creation
- `400` for validation errors or invalid status transitions
- `404` for missing records
- `500` for unexpected errors

## GET /api/reservations

Purpose:

- Return the current seeded reservation with member data.

Response:

```ts
{
  data: {
    id: number;
    destination: string;
    villa: string;
    arrivalDate: string;
    departureDate: string;
    member: {
      id: number;
      name: string;
      email: string;
    };
  }
}
```

## POST /api/proposals

Purpose:

- Create a new draft proposal.

Request:

```ts
{
  reservationId: number;
  note?: string;
  items: Array<{
    category: "Dining" | "Activities" | "Wellness" | "Excursions" | "Transport" | "Experiences";
    title: string;
    description: string;
    scheduledAt: string;
    priceCents: number;
  }>;
}
```

Response:

```ts
{
  data: {
    id: number;
    status: "draft";
  }
}
```

Validation:

- Reservation exists.
- `items` is an array.
- Item category is one of the required categories.
- Item title is not blank.
- Item description is not blank.
- Item scheduledAt is not blank.
- Item priceCents is an integer >= 0.

Empty items are allowed for a saved draft, but sending must require at least one item.

## GET /api/proposals

Purpose:

- List proposals for the concierge dashboard.

Response:

```ts
{
  data: Array<{
    id: number;
    status: "draft" | "sent" | "approved" | "paid";
    createdAt: string;
    updatedAt: string;
    sentAt: string | null;
    approvedAt: string | null;
    paidAt: string | null;
    itemCount: number;
    totalCents: number;
    memberName: string;
    destination: string;
    villa: string;
  }>
}
```

## GET /api/proposals/[id]

Purpose:

- Return one proposal with member, reservation, and line items.

Response:

```ts
{
  data: {
    id: number;
    status: "draft" | "sent" | "approved" | "paid";
    note: string | null;
    createdAt: string;
    updatedAt: string;
    sentAt: string | null;
    approvedAt: string | null;
    paidAt: string | null;
    totalCents: number;
    reservation: {
      id: number;
      destination: string;
      villa: string;
      arrivalDate: string;
      departureDate: string;
    };
    member: {
      id: number;
      name: string;
      email: string;
    };
    items: Array<{
      id: number;
      category: string;
      title: string;
      description: string;
      scheduledAt: string;
      priceCents: number;
      sortOrder: number;
    }>;
  }
}
```

## PATCH /api/proposals/[id]

Purpose:

- Update proposal status.

Request:

```ts
{
  status: "sent" | "approved" | "paid"
}
```

Rules:

- `draft -> sent` is allowed.
- `sent -> approved` is allowed.
- `approved -> paid` is allowed.
- All other transitions return `400`.
- `sent` should set `sent_at` if not already set.
- `approved` should set `approved_at`.
- `paid` should set `paid_at`.
- `updated_at` should change on every successful status update.

Response:

```ts
{
  data: {
    id: number;
    status: "sent" | "approved" | "paid";
  }
}
```

Note:

- The UI should use `POST /api/proposals/[id]/send` for sending so the simulated email is logged.
- This PATCH route still supports `sent` because the assessment says it should cover `sent`, `approved`, and `paid`.

## POST /api/proposals/[id]/send

Purpose:

- Simulate sending an email proposal.

Rules:

- Proposal must exist.
- Proposal must be `draft`.
- Proposal must have at least one item.
- Status becomes `sent`.
- `sent_at` and `updated_at` are set.
- A row is inserted into `sent_emails`.

Response:

```ts
{
  data: {
    id: number;
    status: "sent";
    proposalUrl: string;
  }
}
```

Email body preview:

```text
James, your curated Punta Mita itinerary proposal is ready. Review it here: /proposal/{id}
```

## API Must Not

- Invent authentication.
- Send real emails.
- Process real payments.
- Add statuses beyond `draft`, `sent`, `approved`, `paid`.
- Accept categories outside the required list.
