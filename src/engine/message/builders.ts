import type { FieldList, Provenance, RepeatingGroup, SimpleField } from './types.ts';

export function field(tag: number, value: string, provenance: Provenance): SimpleField {
  return { kind: 'field', tag, value, provenance };
}

export function group(
  countTag: number,
  entries: readonly FieldList[],
  provenance: Provenance
): RepeatingGroup {
  return { kind: 'group', countTag, entries, provenance };
}

/** Find the first simple field with the given tag at the top level of a list. */
export function findField(fields: FieldList, tag: number): SimpleField | undefined {
  for (const f of fields) {
    if (f.kind === 'field' && f.tag === tag) {
      return f;
    }
  }
  return undefined;
}
