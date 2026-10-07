export const formatNaira = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount ?? 0);

const hasTimezone = (s: string) => /(Z|[+-]\d{2}:?\d{2})$/i.test(s);

// The payments list returns UTC timestamps without a "Z" (e.g. 2026-09-28T13:23:34.8733865),
// which JS would read as local time. This treats them as UTC and trims the fraction to
// 3 digits, since Safari rejects longer ones.
export const formatDateTime = (iso?: string) => {
  if (!iso) return "—";
  const trimmed = iso.replace(/(\.\d{3})\d+/, "$1");
  const d = new Date(hasTimezone(trimmed) ? trimmed : `${trimmed}Z`);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};