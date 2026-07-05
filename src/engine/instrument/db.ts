/**
 * Instrument DB loading — JSON and CSV (§3.10). CSV columns map by prefix:
 * `key`, `name`, `scheme:<scheme>`, `attr:<name>`; strategies are JSON-only
 * (legs don't flatten naturally to CSV).
 */
import { parseCsv } from './csv.ts';
import type {
  InstrumentAttrs,
  InstrumentDb,
  InstrumentDbIssue,
  InstrumentRecord,
  StrategyRecord,
} from './types.ts';

export interface InstrumentDbLoadResult {
  readonly db?: InstrumentDb;
  readonly issues: readonly InstrumentDbIssue[];
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function stringMap(v: unknown): Record<string, string> {
  if (!isRecord(v)) return {};
  const out: Record<string, string> = {};
  for (const [k, value] of Object.entries(v)) {
    if (typeof value === 'string') out[k] = value;
    else if (typeof value === 'number') out[k] = String(value);
  }
  return out;
}

export function parseInstrumentDbJson(text: string): InstrumentDbLoadResult {
  const issues: InstrumentDbIssue[] = [];
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return { issues: [{ severity: 'error', path: '', message: `not valid JSON: ${String(e)}` }] };
  }
  if (!isRecord(raw) || !Array.isArray(raw.instruments)) {
    return {
      issues: [
        { severity: 'error', path: '', message: 'instrument DB must have an instruments array' },
      ],
    };
  }

  const instruments = new Map<string, InstrumentRecord>();
  const instrumentOrder: string[] = [];
  raw.instruments.forEach((r, i) => {
    const path = `/instruments/${i}`;
    if (!isRecord(r) || typeof r.key !== 'string' || r.key === '') {
      issues.push({ severity: 'error', path, message: 'instrument needs a non-empty key' });
      return;
    }
    if (instruments.has(r.key)) {
      issues.push({ severity: 'warning', path, message: `duplicate key '${r.key}' (last wins)` });
    } else {
      instrumentOrder.push(r.key);
    }
    instruments.set(r.key, {
      key: r.key,
      ...(typeof r.name === 'string' ? { name: r.name } : {}),
      schemes: stringMap(r.schemes),
      attrs: stringMap(r.attrs) as InstrumentAttrs,
    });
  });

  const strategies = new Map<string, StrategyRecord>();
  if (Array.isArray(raw.strategies)) {
    raw.strategies.forEach((s, i) => {
      const path = `/strategies/${i}`;
      if (!isRecord(s) || typeof s.key !== 'string' || !Array.isArray(s.legs)) {
        issues.push({ severity: 'error', path, message: 'strategy needs a key and legs array' });
        return;
      }
      const legs = s.legs.flatMap((leg, j) => {
        if (!isRecord(leg) || typeof leg.instrument !== 'string') {
          issues.push({
            severity: 'error',
            path: `${path}/legs/${j}`,
            message: 'leg needs an instrument key',
          });
          return [];
        }
        if (!instruments.has(leg.instrument)) {
          issues.push({
            severity: 'warning',
            path: `${path}/legs/${j}`,
            message: `leg references unknown instrument '${leg.instrument}'`,
          });
        }
        return [
          {
            instrument: leg.instrument,
            ratioQty: typeof leg.ratioQty === 'string' ? leg.ratioQty : '1',
            side: typeof leg.side === 'string' ? leg.side : '1',
            ...(typeof leg.price === 'string' ? { price: leg.price } : {}),
          },
        ];
      });
      strategies.set(s.key, {
        key: s.key,
        ...(typeof s.name === 'string' ? { name: s.name } : {}),
        ...(typeof s.strategyType === 'string' ? { strategyType: s.strategyType } : {}),
        ...(isRecord(s.schemes) ? { schemes: stringMap(s.schemes) } : {}),
        ...(isRecord(s.attrs) ? { attrs: stringMap(s.attrs) as InstrumentAttrs } : {}),
        legs,
      });
    });
  }

  return { db: { instruments, strategies, instrumentOrder }, issues };
}

/** CSV: header row with `key`, `name`, `scheme:*`, `attr:*` columns. */
export function parseInstrumentDbCsv(text: string): InstrumentDbLoadResult {
  const issues: InstrumentDbIssue[] = [];
  const rows = parseCsv(text);
  const header = rows[0];
  if (!header || !header.includes('key')) {
    return {
      issues: [
        { severity: 'error', path: '', message: "CSV needs a header row with a 'key' column" },
      ],
    };
  }

  const instruments = new Map<string, InstrumentRecord>();
  const instrumentOrder: string[] = [];
  rows.slice(1).forEach((row, i) => {
    const path = `/row/${i + 2}`;
    const get = (col: string) => {
      const idx = header.indexOf(col);
      return idx >= 0 ? (row[idx] ?? '') : '';
    };
    const key = get('key');
    if (!key) {
      issues.push({ severity: 'error', path, message: 'missing key' });
      return;
    }
    const schemes: Record<string, string> = {};
    const attrs: Record<string, string> = {};
    header.forEach((col, c) => {
      const value = row[c] ?? '';
      if (value === '') return;
      if (col.startsWith('scheme:')) schemes[col.slice(7)] = value;
      else if (col.startsWith('attr:')) attrs[col.slice(5)] = value;
    });
    if (instruments.has(key)) {
      issues.push({ severity: 'warning', path, message: `duplicate key '${key}' (last wins)` });
    } else {
      instrumentOrder.push(key);
    }
    const name = get('name');
    instruments.set(key, {
      key,
      ...(name ? { name } : {}),
      schemes,
      attrs: attrs as InstrumentAttrs,
    });
  });

  return {
    db: { instruments, strategies: new Map(), instrumentOrder, csvColumns: header },
    issues,
  };
}

/** Auto-detect JSON vs CSV by first non-whitespace character. */
export function parseInstrumentDb(text: string): InstrumentDbLoadResult {
  return /^\s*[{[]/.test(text) ? parseInstrumentDbJson(text) : parseInstrumentDbCsv(text);
}
