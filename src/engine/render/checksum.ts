/**
 * BodyLength(9) and CheckSum(10) arithmetic (brief §5.1).
 *
 * Both are defined over the SOH-delimited byte encoding of the message,
 * regardless of the display delimiter chosen for output:
 * - BodyLength counts the bytes after the SOH terminating the 9= field,
 *   up to and including the SOH immediately preceding "10=".
 * - CheckSum is the byte sum of everything before "10=", modulo 256,
 *   rendered as exactly three digits.
 */

export const SOH = '\x01';

const encoder = new TextEncoder();

export function encodeBytes(s: string): Uint8Array {
  return encoder.encode(s);
}

/** Byte length of a message segment (UTF-8). */
export function byteLength(segment: string): number {
  return encodeBytes(segment).length;
}

/** Sum bytes mod 256, formatted as the three-digit CheckSum(10) value. */
export function checkSum(segment: string): string {
  const bytes = encodeBytes(segment);
  let sum = 0;
  for (const b of bytes) sum = (sum + b) & 0xff;
  return String(sum).padStart(3, '0');
}
