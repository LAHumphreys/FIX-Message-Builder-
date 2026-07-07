/**
 * Round-trip fidelity for instrument editing (brief §3.9 + acceptance:
 * "the on-disk file diff touches only the new record, verified against a
 * fixture containing unknown keys, which survive untouched").
 */
import { describe, expect, it } from 'vitest';
import { parseInstrumentDb } from './db.ts';
import { removeInstrument, serializeInstrumentDb, upsertInstrument } from './edit.ts';

const jsonFixture = JSON.stringify({
  $schema: './schemas/instruments.schema.json',
  schemaVersion: 1,
  reviewedBy: 'ops-team',
  instruments: [
    {
      key: 'AAA',
      name: 'Aaa Corp',
      schemes: { isin: 'XX0000000001' },
      attrs: { securityType: 'CS' },
      notes: 'unknown key on a record',
      audit: { addedBy: 'luke' },
    },
    { key: 'BBB', schemes: { isin: 'XX0000000002' }, attrs: {} },
  ],
  strategies: [
    {
      key: 'SPREAD',
      strategyType: 'CS',
      legs: [{ instrument: 'AAA', ratioQty: '1', side: '1', legNote: 'kept' }],
      deskOwner: 'x-desk',
    },
  ],
});

describe('instrument DB round-trip', () => {
  it('unknown keys survive at file, record, strategy and leg level', () => {
    const { db, issues } = parseInstrumentDb(jsonFixture);
    expect(issues).toEqual([]);
    const out = JSON.parse(serializeInstrumentDb(db!)) as Record<string, unknown>;
    expect(out['reviewedBy']).toBe('ops-team');
    expect(out['$schema']).toBe('./schemas/instruments.schema.json');
    const aaa = (out['instruments'] as Record<string, unknown>[]).find((r) => r.key === 'AAA')!;
    expect(aaa.notes).toBe('unknown key on a record');
    expect(aaa.audit).toEqual({ addedBy: 'luke' });
    const spread = (out['strategies'] as Record<string, unknown>[])[0]!;
    expect(spread.deskOwner).toBe('x-desk');
    expect((spread.legs as Record<string, unknown>[])[0]!.legNote).toBe('kept');
  });

  it('serialize → parse → serialize is a fixed point (canonical)', () => {
    const first = serializeInstrumentDb(parseInstrumentDb(jsonFixture).db!);
    const second = serializeInstrumentDb(parseInstrumentDb(first).db!);
    expect(second).toBe(first);
  });

  it('adding one record touches only that record (minimal diff)', () => {
    const db = parseInstrumentDb(jsonFixture).db!;
    const before = serializeInstrumentDb(db).split('\n');
    const after = serializeInstrumentDb(
      upsertInstrument(db, {
        key: 'CCC',
        name: 'Ccc Corp',
        schemes: { isin: 'XX0000000003' },
        attrs: { securityType: 'CS' },
      })
    ).split('\n');
    const removed = before.filter((line) => !after.includes(line));
    expect(removed.length).toBeLessThanOrEqual(1); // only the line losing its trailing comma
    // and every changed/new line belongs to the CCC record or that comma
    const added = after.filter((line) => !before.includes(line));
    expect(added.join('\n')).toContain('"key": "CCC"');
    expect(added.length).toBeLessThanOrEqual(9);
  });

  it('upsert keeps position for existing keys; remove drops from order', () => {
    const db = parseInstrumentDb(jsonFixture).db!;
    const edited = upsertInstrument(db, { ...db.instruments.get('AAA')!, name: 'Renamed' });
    expect(edited.instrumentOrder).toEqual(['AAA', 'BBB']);
    expect(edited.instruments.get('AAA')!.name).toBe('Renamed');
    expect(edited.instruments.get('AAA')!.extra?.notes).toBe('unknown key on a record');
    const removed = removeInstrument(db, 'AAA');
    expect(removed.instrumentOrder).toEqual(['BBB']);
  });

  it('CSV DBs write back as CSV: column order preserved, unknown columns kept, new columns appended', () => {
    const csv =
      'key,custom_note,name,scheme:isin,attr:securityType\n' +
      'AAA,keep me,Aaa Corp,XX0000000001,CS\n';
    const db = parseInstrumentDb(csv).db!;
    expect(serializeInstrumentDb(db)).toBe(csv);
    const withNew = upsertInstrument(db, {
      key: 'BBB',
      schemes: { isin: 'XX2', ric: 'BBB.L' },
      attrs: {},
    });
    const out = serializeInstrumentDb(withNew);
    expect(out.split('\n')[0]).toBe(
      'key,custom_note,name,scheme:isin,attr:securityType,scheme:ric'
    );
    expect(out).toContain('BBB,,,XX2,,BBB.L');
  });
});
