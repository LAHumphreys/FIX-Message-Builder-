/**
 * The internal-host starter configs (docs/internal-host/starter.*.json) are
 * the "iterate from a working state" seed for building a private profile.
 * They must always load cleanly and produce a renderable message — a starter
 * that errors on first drag-drop defeats its purpose.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseProfile } from './load.ts';
import { resolveForSystem } from './resolve.ts';
import { parseInstrumentDb } from '../instrument/db.ts';
import { loadBaseDictionary } from '../dictionary/data/index.ts';
import { buildSingle } from '../build/single.ts';
import { memoryCounterStore } from '../generator/types.ts';
import { mulberry32 } from '../generator/evaluate.ts';

const profileText = readFileSync('docs/internal-host/starter.profile.json', 'utf8');
const instrumentsText = readFileSync('docs/internal-host/starter.instruments.json', 'utf8');

describe('internal-host starter files', () => {
  it('starter profile loads with zero issues', () => {
    const { profile, issues } = parseProfile(profileText);
    expect(issues).toEqual([]);
    expect(profile?.systems[0]?.id).toBe('uat-gateway');
    // The JSON tab reads the profile's mapping; the starter must declare one
    // so first-run users see real JSON output, not the fallback hint.
    expect(Object.keys(profile?.renderers?.json ?? {})).not.toHaveLength(0);
  });

  it('starter instrument DB loads with zero issues', () => {
    const { db, issues } = parseInstrumentDb(instrumentsText);
    expect(issues).toEqual([]);
    expect(db?.instruments.size).toBe(2);
  });

  it('starter profile builds a renderable NewOrderSingle out of the box', async () => {
    const { profile } = parseProfile(profileText);
    const dictionary = await loadBaseDictionary('FIX.4.4');
    const resolved = resolveForSystem(profile!, 'uat-gateway', dictionary);
    expect(resolved).toBeDefined();
    const result = buildSingle(
      resolved!,
      { selections: { flow: 'limit' }, slotValues: { 38: '100' } },
      {
        clock: () => new Date('2026-01-02T03:04:05Z'),
        random: mulberry32(1),
        counters: memoryCounterStore(),
      }
    );
    const tags = result.message.fields.map((f) => (f.kind === 'field' ? f.tag : f.countTag));
    expect(tags).toEqual(expect.arrayContaining([11, 49, 56, 40, 54, 38]));
  });
});
