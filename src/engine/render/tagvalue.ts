/**
 * Raw tag=value renderer (brief §5.1).
 *
 * - Header ordering: 8, 9, 35 first (then remaining header fields in
 *   dictionary header order), trailer fields last with 10 at the very end.
 * - BodyLength(9)/CheckSum(10) computed over the SOH encoding, whatever the
 *   display delimiter — unless the message explicitly carries 8/9/10/35
 *   values, which win (deliberately malformed messages are legitimate).
 * - Never refuses to render.
 */
import type { FieldList, FixMessage } from '../message/types.ts';
import type { Dictionary } from '../dictionary/types.ts';
import { messageLayout } from '../dictionary/layout.ts';
import { checkSum, byteLength, SOH } from './checksum.ts';

export type TagValueDelimiter = 'soh' | 'pipe' | 'caretA';

export interface TagValueOptions {
  readonly delimiter: TagValueDelimiter;
  /** Omit 9/10 for downstream tools that compute their own. */
  readonly omitLengthAndChecksum?: boolean;
}

const DELIMITERS: Record<TagValueDelimiter, string> = {
  soh: SOH,
  pipe: '|',
  caretA: '^A',
};

interface WirePair {
  readonly tag: number;
  readonly value: string;
}

/** Flatten the canonical tree to wire pairs: count tag then entry fields. */
export function flattenFields(fields: FieldList): WirePair[] {
  const out: WirePair[] = [];
  for (const field of fields) {
    if (field.kind === 'field') {
      out.push({ tag: field.tag, value: field.value });
    } else {
      out.push({ tag: field.countTag, value: String(field.entries.length) });
      for (const entry of field.entries) {
        out.push(...flattenFields(entry));
      }
    }
  }
  return out;
}

function takeFirst(pairs: WirePair[], tag: number): WirePair | undefined {
  const i = pairs.findIndex((p) => p.tag === tag);
  return i >= 0 ? pairs.splice(i, 1)[0] : undefined;
}

/**
 * Order the message for the wire: standard header fields (in dictionary
 * order), body (input order preserved), standard trailer fields, 10 last.
 * Returns pairs WITHOUT 8/9/10/35 — those are handled by render().
 */
function orderForWire(
  msg: FixMessage,
  dict: Dictionary
): {
  header: WirePair[];
  body: WirePair[];
  trailer: WirePair[];
  explicit: Map<number, string>;
} {
  const layout = messageLayout(dict, msg.msgType);
  const pool = flattenFields(msg.fields);

  // 8/9/35/10 are computed by render(); an explicit first occurrence in the
  // message overrides the computed value (deliberate malformation support).
  const explicit = new Map<number, string>();
  for (const tag of [8, 9, 35, 10]) {
    const hit = takeFirst(pool, tag);
    if (hit) explicit.set(tag, hit.value);
  }

  const header: WirePair[] = [];
  for (const item of layout.header) {
    const tag = item.kind === 'field' ? item.tag : item.countTag;
    if (tag === 8 || tag === 9 || tag === 35 || tag === 10) continue;
    // Groups in the header (NoHops) are rare; treat their count tag like a field.
    let hit = takeFirst(pool, tag);
    while (hit) {
      header.push(hit);
      hit = takeFirst(pool, tag);
    }
  }

  const trailer: WirePair[] = [];
  for (const item of layout.trailer) {
    const tag = item.kind === 'field' ? item.tag : item.countTag;
    if (tag === 10) continue;
    let hit = takeFirst(pool, tag);
    while (hit) {
      trailer.push(hit);
      hit = takeFirst(pool, tag);
    }
  }

  return { header, body: pool, trailer, explicit };
}

export function renderTagValue(
  msg: FixMessage,
  dict: Dictionary,
  options: TagValueOptions
): string {
  const { header, body, trailer, explicit } = orderForWire(msg, dict);

  const beginString = explicit.get(8) ?? msg.beginString;
  const msgType = explicit.get(35) ?? msg.msgType;
  const explicitLength = explicit.get(9);
  const explicitChecksum = explicit.get(10);

  const afterLength = [
    `35=${msgType}`,
    ...header.map((p) => `${p.tag}=${p.value}`),
    ...body.map((p) => `${p.tag}=${p.value}`),
    ...trailer.map((p) => `${p.tag}=${p.value}`),
  ]
    .map((f) => f + SOH)
    .join('');

  const parts: string[] = [`8=${beginString}${SOH}`];
  if (!options.omitLengthAndChecksum) {
    const bodyLength = explicitLength ?? String(byteLength(afterLength));
    parts.push(`9=${bodyLength}${SOH}`);
  }
  parts.push(afterLength);
  if (!options.omitLengthAndChecksum) {
    const sum = explicitChecksum ?? checkSum(parts.join(''));
    parts.push(`10=${sum}${SOH}`);
  }

  const wire = parts.join('');
  const delimiter = DELIMITERS[options.delimiter];
  return delimiter === SOH ? wire : wire.split(SOH).join(delimiter);
}
