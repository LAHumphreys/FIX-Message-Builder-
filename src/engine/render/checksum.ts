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

/** UTF-8 encode without TextEncoder — a global only since Node 11, and the
 *  fixb CLI bundle must run on bare Node 10 office machines. Pure and
 *  environment-free, like the rest of the engine. */
export function encodeBytes(s: string): Uint8Array {
  const out: number[] = [];
  for (let i = 0; i < s.length; i++) {
    let cp = s.codePointAt(i)!;
    if (cp > 0xffff) i++; // surrogate pair consumed
    if (cp < 0x80) out.push(cp);
    else if (cp < 0x800) out.push(0xc0 | (cp >> 6), 0x80 | (cp & 0x3f));
    else if (cp < 0x10000) {
      // Lone surrogates encode as U+FFFD, matching TextEncoder.
      if (cp >= 0xd800 && cp <= 0xdfff) cp = 0xfffd;
      out.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
    } else {
      out.push(
        0xf0 | (cp >> 18),
        0x80 | ((cp >> 12) & 0x3f),
        0x80 | ((cp >> 6) & 0x3f),
        0x80 | (cp & 0x3f)
      );
    }
  }
  return Uint8Array.from(out);
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
