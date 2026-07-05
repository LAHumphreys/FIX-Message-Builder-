/**
 * Instrument typeahead search — precomputed lowercase haystacks, ranked
 * prefix > word-start > substring. Must stay responsive at 10k rows: the
 * index is built once per DB load; a query is one linear scan with cheap
 * string ops and an early result cap.
 */
import type { InstrumentDb, InstrumentRecord, StrategyRecord } from './types.ts';

export interface SearchHit {
  readonly kind: 'instrument' | 'strategy';
  readonly key: string;
  readonly label: string;
  readonly detail: string;
}

interface IndexEntry {
  readonly hit: SearchHit;
  readonly haystack: string; // lowercase "key name scheme-values"
  readonly words: readonly number[]; // word-start offsets in haystack
}

export interface SearchIndex {
  search(query: string, limit?: number): SearchHit[];
  readonly size: number;
}

function entryFor(record: InstrumentRecord | StrategyRecord, kind: SearchHit['kind']): IndexEntry {
  const schemeValues = Object.values(record.schemes ?? {});
  const label = record.name ?? record.key;
  const detail =
    kind === 'strategy'
      ? `strategy · ${(record as StrategyRecord).legs.length} legs`
      : [record.attrs?.securityType, schemeValues[0]].filter(Boolean).join(' · ');
  const haystack = [record.key, record.name ?? '', ...schemeValues].join(' ').toLowerCase();
  const words: number[] = [0];
  for (let i = 1; i < haystack.length; i++) {
    if (haystack[i - 1] === ' ' || haystack[i - 1] === '-' || haystack[i - 1] === '.') {
      words.push(i);
    }
  }
  return { hit: { kind, key: record.key, label, detail }, haystack, words };
}

export function buildSearchIndex(db: InstrumentDb): SearchIndex {
  const entries: IndexEntry[] = [
    ...db.instrumentOrder.map((key) => entryFor(db.instruments.get(key)!, 'instrument')),
    ...[...db.strategies.values()].map((s) => entryFor(s, 'strategy')),
  ];

  return {
    size: entries.length,
    search(query, limit = 50) {
      const q = query.trim().toLowerCase();
      if (q === '') return entries.slice(0, limit).map((e) => e.hit);
      const scored: { hit: SearchHit; score: number }[] = [];
      for (const entry of entries) {
        const pos = entry.haystack.indexOf(q);
        if (pos < 0) continue;
        const score = pos === 0 ? 0 : entry.words.includes(pos) ? 1 : 2;
        scored.push({ hit: entry.hit, score });
        if (scored.length >= limit * 4) break; // plenty to rank from
      }
      return scored
        .sort((a, b) => a.score - b.score)
        .slice(0, limit)
        .map((s) => s.hit);
    },
  };
}
