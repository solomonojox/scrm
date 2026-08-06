// invoiceUtils.ts
//
// Shared formatting helpers for the Invoice Records feature.
//
// IMPORTANT: do not use Intl.NumberFormat(..., { style: 'currency', currency: 'NGN' })
// anywhere in the PDF-rendering path. It inserts the literal Naira glyph (₦, U+20A6),
// which the standard PDF fonts (and most trimmed webfont subsets) do not include.
// An unresolvable glyph can silently break the whole @react-pdf/renderer render,
// so we always format the number ourselves and prefix a plain-text currency code.

export type CurrencyCode = 'NGN' | 'USD' | 'GBP';

/**
 * Formats a number as "<CODE> 1,234.00" — grouping + 2 decimals, no currency glyph.
 * Safe to render with the standard Helvetica font in @react-pdf/renderer.
 */
export function formatCurrencyPlain(amount: number, code: CurrencyCode = 'NGN'): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const formatted = safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${code} ${formatted}`;
}

/**
 * Formats a number with the Naira symbol for display in the UI (not PDF).
 */
export function formatCurrencyWithSymbol(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `₦${safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateInput: string | number | Date): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// --- Amount-in-words -------------------------------------------------------

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
];

function chunkToWords(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  if (n < 100) return `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ''}`;
  return `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? ` and ${chunkToWords(n % 100)}` : ''}`;
}

function integerToWords(n: number): string {
  if (n === 0) return 'Zero';
  const units = [
    { value: 1_000_000_000, label: 'Billion' },
    { value: 1_000_000, label: 'Million' },
    { value: 1_000, label: 'Thousand' },
    { value: 1, label: '' },
  ];
  let remainder = n;
  const parts: string[] = [];
  for (const unit of units) {
    const count = Math.floor(remainder / unit.value);
    if (count > 0) {
      parts.push(`${chunkToWords(count)}${unit.label ? ` ${unit.label}` : ''}`);
      remainder %= unit.value;
    }
  }
  return parts.join(' ');
}

/**
 * Spells out a monetary amount, e.g. 125430.5 -> "One Hundred and Twenty-Five
 * Thousand, Four Hundred and Thirty Naira, Fifty Kobo".
 * `majorUnit`/`minorUnit` let this be reused across currencies without a Naira
 * glyph anywhere in the string.
 */
export function amountToWords(
  amount: number,
  majorUnit: string = 'Naira',
  minorUnit: string = 'Kobo'
): string {
  const safeAmount = Number.isFinite(amount) ? Math.abs(amount) : 0;
  const wholePart = Math.floor(safeAmount);
  const fractionPart = Math.round((safeAmount - wholePart) * 100);

  const wholeWords = `${integerToWords(wholePart)} ${majorUnit}`;
  if (fractionPart === 0) return `${wholeWords} Only`;

  const fractionWords = `${integerToWords(fractionPart)} ${minorUnit}`;
  return `${wholeWords}, ${fractionWords} Only`;
}

// --- Invoice status ----------------------------------------------------------

export type InvoiceStatus = 'PAID' | 'UNPAID' | 'OVERDUE';

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, { bg: string; text: string; dot: string }> = {
  PAID: { bg: '#dcfce7', text: '#15803d', dot: '#22c55e' },
  UNPAID: { bg: '#fef9c3', text: '#a16207', dot: '#eab308' },
  OVERDUE: { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444' },
};

export function deriveInvoiceStatus(dueDate: string | number | Date, amountPaid: number, totalAmount: number): InvoiceStatus {
  if (amountPaid >= totalAmount && totalAmount > 0) return 'PAID';
  const due = new Date(dueDate);
  if (!Number.isNaN(due.getTime()) && due.getTime() < Date.now()) return 'OVERDUE';
  return 'UNPAID';
}

/**
 * Same idea, but for the real GeneratedInvoiceData shape, which carries an
 * `isPaid` flag rather than a running amountPaid total.
 */
export function deriveInvoiceStatusFromPaid(isPaid: boolean, dueDate: string | number | Date): InvoiceStatus {
  if (isPaid) return 'PAID';
  const due = new Date(dueDate);
  if (!Number.isNaN(due.getTime()) && due.getTime() < Date.now()) return 'OVERDUE';
  return 'UNPAID';
}