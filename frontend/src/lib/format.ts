/**
 * Site-wide formats: dates "28 Mar 2026", times 24-hour "08:00–15:00",
 * money "USD 165,000". Render figures with the `tabular-nums` class.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Parses "YYYY-MM-DD" (or a Date) without timezone drift. */
export function toDate(input: string | Date): Date {
  if (input instanceof Date) return input;
  const [y, m, d] = input.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** "28 Mar 2026" */
export function formatDate(input: string | Date): string {
  const d = toDate(input);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Fri 9 Oct 2026, 17:00" */
export function formatDateTime(input: Date): string {
  const hh = String(input.getHours()).padStart(2, '0');
  const mm = String(input.getMinutes()).padStart(2, '0');
  return `${DAYS[input.getDay()]} ${formatDate(input)}, ${hh}:${mm}`;
}

/** "USD 165,000" — always comma thousands separators. */
export function formatMoney(amount: number, currency = 'USD', fractionDigits = 0): string {
  return `${currency} ${amount.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}
