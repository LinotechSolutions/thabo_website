/**
 * Masking helpers. Personal data must never be rendered before the customer is
 * authenticated, and must be masked even after.
 */

/** "63-119284 K18" -> "63-•••••• K18" */
export function maskNationalId(id: string): string {
  const m = id.trim().match(/^(\d{2})[-\s]?(\d+)\s?([A-Z])\s?(\d{2})$/i);
  if (!m) return '••••••';
  return `${m[1]}-${'•'.repeat(6)} ${m[3].toUpperCase()}${m[4]}`;
}

/** "+263 774 123 456" -> "+263 ••• ••• 456" */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '•••';
  const prefix = phone.trim().startsWith('+') ? `+${digits.slice(0, 3)} ` : '';
  return `${prefix}••• ••• ${digits.slice(-3)}`;
}

/** "nyasha@example.com" -> "n•••••@example.com" */
export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!domain) return '•••';
  return `${user.slice(0, 1)}${'•'.repeat(Math.max(3, user.length - 1))}@${domain}`;
}
