const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCents(priceCents: number): string {
  return usdFormatter.format(priceCents / 100);
}

export function dollarsToCents(value: string | number): number | null {
  const amount =
    typeof value === "number" ? value : Number.parseFloat(value.trim());

  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  return Math.round(amount * 100);
}

export function centsToDollars(priceCents: number): number {
  return priceCents / 100;
}

export function sumCents(items: Iterable<{ priceCents: number }>): number {
  let total = 0;

  for (const item of items) {
    total += item.priceCents;
  }

  return total;
}
