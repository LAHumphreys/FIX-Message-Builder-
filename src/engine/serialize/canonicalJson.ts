/**
 * Canonical JSON serialisation (§3.9): stable key order (sorted), fixed
 * 2-space formatting, trailing newline — so a single changed record
 * produces a minimal git diff. Unknown keys survive untouched because
 * callers merge them back before serialising.
 */

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a < b ? -1 : a > b ? 1 : 0
    );
    return Object.fromEntries(entries.map(([k, v]) => [k, sortValue(v)]));
  }
  return value;
}

export function canonicalStringify(value: unknown): string {
  return JSON.stringify(sortValue(value), null, 2) + '\n';
}
