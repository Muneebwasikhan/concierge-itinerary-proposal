const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  timeZone: "UTC",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const scheduledDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export interface GroupedByDay<T> {
  dateKey: string;
  label: string;
  items: T[];
}

export function parseIsoDate(value: string): Date | null {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function formatDate(value: string): string {
  const date = parseIsoDate(value);
  return date ? dateFormatter.format(date) : value;
}

export function formatScheduledDateTime(value: string): string {
  const date = parseIsoDate(value);
  return date ? scheduledDateTimeFormatter.format(date) : value;
}

export function formatScheduledTime(value: string): string {
  const date = parseIsoDate(value);
  return date ? timeFormatter.format(date) : value;
}

export function formatReservationDateRange(
  arrivalDate: string,
  departureDate: string,
): string {
  const arrival = parseIsoDate(arrivalDate);
  const departure = parseIsoDate(departureDate);

  if (!arrival || !departure) {
    return `${arrivalDate} - ${departureDate}`;
  }

  const sameYear = arrival.getUTCFullYear() === departure.getUTCFullYear();
  const sameMonth = arrival.getUTCMonth() === departure.getUTCMonth();

  if (sameYear && sameMonth) {
    return `${monthFormatter.format(arrival)} ${arrival.getUTCDate()}-${departure.getUTCDate()}, ${arrival.getUTCFullYear()}`;
  }

  if (sameYear) {
    return `${monthDayFormatter.format(arrival)} - ${monthDayFormatter.format(departure)}, ${arrival.getUTCFullYear()}`;
  }

  return `${dateFormatter.format(arrival)} - ${dateFormatter.format(departure)}`;
}

export function getTripNightCount(
  arrivalDate: string,
  departureDate: string,
): number | null {
  const arrival = parseIsoDate(arrivalDate);
  const departure = parseIsoDate(departureDate);

  if (!arrival || !departure) {
    return null;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const nights = Math.round(
    (departure.getTime() - arrival.getTime()) / millisecondsPerDay,
  );

  return nights >= 0 ? nights : null;
}

export function getDateKey(value: string): string {
  const date = parseIsoDate(value);

  if (!date) {
    return value;
  }

  return date.toISOString().slice(0, 10);
}

export function groupItemsByDay<T extends { scheduledAt: string }>(
  items: T[],
): GroupedByDay<T>[] {
  const groups = new Map<string, GroupedByDay<T>>();

  for (const item of items) {
    const dateKey = getDateKey(item.scheduledAt);
    const existing = groups.get(dateKey);

    if (existing) {
      existing.items.push(item);
      continue;
    }

    groups.set(dateKey, {
      dateKey,
      label: formatDate(dateKey),
      items: [item],
    });
  }

  return Array.from(groups.values()).sort((a, b) =>
    a.dateKey.localeCompare(b.dateKey),
  );
}
