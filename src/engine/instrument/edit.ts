/**
 * Instrument DB editing + write-back (brief §3.9, milestone 7). Pure
 * functions; the UI layer decides whether the serialized text becomes a
 * download (file mode) or an in-place workspace write.
 *
 * Round-trip fidelity is the hard requirement: unknown keys survive (parse
 * captures them in `extra`; serialization spreads them back), output is
 * canonical (stable key order, fixed formatting) so one added record is a
 * minimal git diff, and CSV DBs write back as CSV with column order
 * preserved.
 */
import { canonicalStringify } from '../serialize/canonicalJson.ts';
import { serializeCsv } from './csv.ts';
import type { InstrumentDb, InstrumentRecord, StrategyRecord } from './types.ts';

function recordJson(record: InstrumentRecord): Record<string, unknown> {
  return {
    key: record.key,
    ...(record.name !== undefined ? { name: record.name } : {}),
    ...(Object.keys(record.schemes).length > 0 ? { schemes: record.schemes } : {}),
    ...(Object.keys(record.attrs).length > 0 ? { attrs: record.attrs } : {}),
    ...(record.extra ?? {}),
  };
}

function strategyJson(strategy: StrategyRecord): Record<string, unknown> {
  return {
    key: strategy.key,
    ...(strategy.name !== undefined ? { name: strategy.name } : {}),
    ...(strategy.strategyType !== undefined ? { strategyType: strategy.strategyType } : {}),
    ...(strategy.schemes ? { schemes: strategy.schemes } : {}),
    ...(strategy.attrs ? { attrs: strategy.attrs } : {}),
    legs: strategy.legs.map((leg) => ({
      instrument: leg.instrument,
      ratioQty: leg.ratioQty,
      side: leg.side,
      ...(leg.price !== undefined ? { price: leg.price } : {}),
      ...(leg.extra ?? {}),
    })),
    ...(strategy.extra ?? {}),
  };
}

/**
 * Serialize a DB back to text: CSV when it was loaded from CSV (column
 * order preserved, new scheme/attr columns appended), canonical JSON
 * otherwise.
 */
export function serializeInstrumentDb(db: InstrumentDb): string {
  if (db.csvColumns) return serializeDbCsv(db);
  return canonicalStringify({
    schemaVersion: 1,
    ...(db.extra ?? {}),
    instruments: db.instrumentOrder.map((key) => recordJson(db.instruments.get(key)!)),
    ...(db.strategies.size > 0
      ? { strategies: [...db.strategies.values()].map(strategyJson) }
      : {}),
  });
}

function serializeDbCsv(db: InstrumentDb): string {
  const columns = [...db.csvColumns!];
  const has = new Set(columns);
  const addColumn = (col: string) => {
    if (!has.has(col)) {
      has.add(col);
      columns.push(col);
    }
  };
  const records = db.instrumentOrder.map((key) => db.instruments.get(key)!);
  for (const record of records) {
    for (const scheme of Object.keys(record.schemes)) addColumn(`scheme:${scheme}`);
    for (const attr of Object.keys(record.attrs)) addColumn(`attr:${attr}`);
  }
  const rows = records.map((record) =>
    columns.map((col) => {
      if (col === 'key') return record.key;
      if (col === 'name') return record.name ?? '';
      if (col.startsWith('scheme:')) return record.schemes[col.slice(7)] ?? '';
      if (col.startsWith('attr:')) return record.attrs[col.slice(5)] ?? '';
      const extra = record.extra?.[col];
      return typeof extra === 'string' ? extra : '';
    })
  );
  return serializeCsv([columns, ...rows]);
}

/** Add or replace a record. New keys append; existing keys keep their position. */
export function upsertInstrument(db: InstrumentDb, record: InstrumentRecord): InstrumentDb {
  const instruments = new Map(db.instruments);
  const existed = instruments.has(record.key);
  instruments.set(record.key, record);
  return {
    ...db,
    instruments,
    instrumentOrder: existed ? db.instrumentOrder : [...db.instrumentOrder, record.key],
  };
}

export function removeInstrument(db: InstrumentDb, key: string): InstrumentDb {
  const instruments = new Map(db.instruments);
  instruments.delete(key);
  return {
    ...db,
    instruments,
    instrumentOrder: db.instrumentOrder.filter((k) => k !== key),
  };
}
