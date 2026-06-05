export function parseGermanNumber(val: string): number {
  const normalized = val.trim().replace(/\./g, "").replace(",", ".");
  return parseFloat(normalized);
}

export function formatGermanNumber(num: number, fractionDigits = 2): string {
  return num.toLocaleString("de-DE", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function parseGermanDate(value: string): string | null {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

  if (!match) {
    return null;
  }

  const [, dd, mm, yyyy] = match;

  const date = new Date(`${yyyy}-${mm}-${dd}`);

  if (isNaN(date.getTime())) {
    return null;
  }

  return `${yyyy}-${mm}-${dd}`;
}
