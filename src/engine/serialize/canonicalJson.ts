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
    // No Object.fromEntries — the fixb bundle runs on bare Node 10.
    // defineProperty, not assignment: a '__proto__' key must become an own
    // property (as fromEntries and JSON.parse make it), not set the prototype.
    const out: Record<string, unknown> = {};
    for (const [k, v] of entries) {
      Object.defineProperty(out, k, {
        value: sortValue(v),
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
    return out;
  }
  return value;
}

export function canonicalStringify(value: unknown): string {
  return JSON.stringify(sortValue(value), null, 2) + '\n';
}
