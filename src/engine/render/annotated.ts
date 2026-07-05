/**
 * Annotated human-readable view model (brief §5.3).
 *
 * Produces structured lines — `38 (OrderQty) = 100 [Buy]` with group
 * indentation and provenance — for the UI to format. Validation badges are
 * attached by the caller via the `path` key (validation findings carry the
 * same path format).
 */
import type { FieldList, FixMessage, Provenance } from '../message/types.ts';
import type { Dictionary } from '../dictionary/types.ts';
import { enumLabel, fieldName } from '../dictionary/types.ts';

export interface AnnotatedLine {
  /** Stable path key, e.g. "55", "73[1]/11" — mirrors validation FieldPath. */
  readonly path: string;
  readonly depth: number;
  readonly tag: number;
  readonly name: string | undefined;
  readonly value: string;
  readonly enumLabel: string | undefined;
  /** True for the count line of a repeating group. */
  readonly isGroupCount: boolean;
  readonly provenance: Provenance;
}

function annotate(
  fields: FieldList,
  dict: Dictionary,
  depth: number,
  prefix: string,
  out: AnnotatedLine[]
): void {
  const seen = new Map<number, number>();
  for (const field of fields) {
    const tag = field.kind === 'field' ? field.tag : field.countTag;
    const occurrence = seen.get(tag) ?? 0;
    seen.set(tag, occurrence + 1);
    const key = occurrence === 0 ? String(tag) : `${tag}#${occurrence}`;
    const path = prefix === '' ? key : `${prefix}/${key}`;

    if (field.kind === 'field') {
      out.push({
        path,
        depth,
        tag: field.tag,
        name: fieldName(dict, field.tag),
        value: field.value,
        enumLabel: enumLabel(dict, field.tag, field.value),
        isGroupCount: false,
        provenance: field.provenance,
      });
    } else {
      out.push({
        path,
        depth,
        tag: field.countTag,
        name: fieldName(dict, field.countTag),
        value: String(field.entries.length),
        enumLabel: undefined,
        isGroupCount: true,
        provenance: field.provenance,
      });
      field.entries.forEach((entry, i) => {
        annotate(entry, dict, depth + 1, `${path}[${i}]`, out);
      });
    }
  }
}

export function buildAnnotatedLines(msg: FixMessage, dict: Dictionary): AnnotatedLine[] {
  const out: AnnotatedLine[] = [];
  annotate(msg.fields, dict, 0, '', out);
  return out;
}
