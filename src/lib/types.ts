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

export const STATUS_TRANSITIONS = {
  draft: "sent",
  sent: "approved",
  approved: "paid",
  paid: null,
} as const satisfies Record<ProposalStatus, ProposalStatus | null>;

export type ItineraryCategory = (typeof ITINERARY_CATEGORIES)[number];

export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

export type ProposalStatusUpdate = Exclude<ProposalStatus, "draft">;

export interface Member {
  id: number;
  name: string;
  email: string;
}

export interface Reservation {
  id: number;
  destination: string;
  villa: string;
  arrivalDate: string;
  departureDate: string;
}

export interface ReservationWithMember extends Reservation {
  member: Member;
}

export interface ProposalItem {
  id: number;
  proposalId: number;
  category: ItineraryCategory;
  title: string;
  description: string;
  scheduledAt: string;
  priceCents: number;
  sortOrder: number;
}

export interface Proposal {
  id: number;
  reservationId: number;
  status: ProposalStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
  approvedAt: string | null;
  paidAt: string | null;
}

export interface ProposalDetail extends Proposal {
  totalCents: number;
  reservation: Reservation;
  member: Member;
  items: ProposalItem[];
}

export interface ProposalSummary {
  id: number;
  status: ProposalStatus;
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
}

export interface CreateProposalItemInput {
  category: ItineraryCategory;
  title: string;
  description: string;
  scheduledAt: string;
  priceCents: number;
}

export interface CreateProposalInput {
  reservationId: number;
  note?: string;
  items: CreateProposalItemInput[];
}

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiFailure {
  error: {
    message: string;
    code?: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface ValidationSuccess<T> {
  ok: true;
  data: T;
}

export interface ValidationFailure {
  ok: false;
  errors: string[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;
