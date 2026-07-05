/**
 * The demo profile doubles as documentation (brief §8) — so it is tested
 * like code. Every flow must load cleanly and produce its signature tags
 * through the real build pipeline.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  buildSingle,
  loadBaseDictionary,
  memoryCounterStore,
  mulberry32,
  parseInstrumentDbJson,
  parseProfile,
  resolveForSystem,
  validateMessage,
  type BuildEnv,
  type SimpleField,
} from '../engine/index.ts';

const profileText = readFileSync('src/demo/demo.profile.json', 'utf8');
const instrumentsText = readFileSync('src/demo/demo.instruments.json', 'utf8');

const { profile, issues } = parseProfile(profileText);
const dict = await loadBaseDictionary('FIX.4.4');
const resolved = resolveForSystem(profile!, 'alpha-uat', dict)!;

function env(): BuildEnv {
  return {
    clock: () => new Date(Date.UTC(2026, 6, 5, 12, 0, 0)),
    random: mulberry32(1),
    counters: memoryCounterStore(),
  };
}

function tagValue(result: ReturnType<typeof buildSingle>, tag: number): string | undefined {
  const hit = result.message.fields.find((f) => f.kind === 'field' && f.tag === tag);
  return hit ? (hit as SimpleField).value : undefined;
}

describe('demo profile', () => {
  it('parses with zero issues', () => {
    expect(issues).toEqual([]);
  });

  it('demo instrument DB loads with zero issues', () => {
    const db = parseInstrumentDbJson(instrumentsText);
    expect(db.issues).toEqual([]);
    expect(db.db!.instruments.size).toBeGreaterThanOrEqual(15);
  });
});

describe('standard order-type flows build their signature tags', () => {
  const cases = [
    {
      flow: 'market',
      slots: { '38': '100' },
      expected: { 40: '1', 38: '100', 59: '0' },
      absent: [44, 99],
    },
    {
      flow: 'limit',
      slots: { '38': '100', '44': '25.10' },
      expected: { 40: '2', 44: '25.10' },
      absent: [99],
    },
    {
      flow: 'limit-gtd',
      slots: { '38': '100', '44': '25.10', '432': '20261230' },
      expected: { 40: '2', 59: '6', 432: '20261230' },
      absent: [],
    },
    {
      flow: 'stop',
      slots: { '38': '100', '99': '24.00' },
      expected: { 40: '3', 99: '24.00' },
      absent: [44],
    },
    {
      flow: 'stop-limit',
      slots: { '38': '100', '99': '24.00', '44': '23.90' },
      expected: { 40: '4', 99: '24.00', 44: '23.90' },
      absent: [],
    },
    {
      flow: 'iceberg',
      slots: { '38': '10000', '44': '25.10', '111': '500' },
      expected: { 40: '2', 111: '500' },
      absent: [110],
    },
    {
      flow: 'peg-mid',
      slots: { '38': '100', '211': '0.01' },
      expected: { 40: 'P', 18: 'M', 211: '0.01' },
      absent: [44],
    },
    {
      flow: 'moc',
      slots: { '38': '100' },
      expected: { 40: '1', 59: '7' },
      absent: [44, 99],
    },
    {
      flow: 'broker-algo',
      slots: { '38': '100', '849': '15' },
      expected: { 40: '2', 847: '1', 849: '15' },
      absent: [99],
    },
  ] as const;

  it.each(cases)('$flow', ({ flow, slots, expected, absent }) => {
    const result = buildSingle(
      resolved,
      { selections: { flow, instrument: 'MERBANK' }, slotValues: slots },
      env()
    );
    expect(result.msgType).toBe('D');
    expect(result.findings).toEqual([]);
    for (const [tag, value] of Object.entries(expected)) {
      expect(tagValue(result, Number(tag)), `tag ${tag}`).toBe(value);
    }
    for (const tag of absent) {
      expect(tagValue(result, tag), `tag ${tag} should be absent`).toBeUndefined();
    }
    // Every flow keeps the base plumbing: generated ClOrdID, enforced routing.
    expect(tagValue(result, 11)).toMatch(/^CLORD-\d{8}-\d{4}$/);
    expect(tagValue(result, 20101)).toBe('ALPHA-UAT-GW');
  });

  it.each(cases)('$flow validates clean against the effective dictionary', ({ flow, slots }) => {
    const result = buildSingle(resolved, { selections: { flow }, slotValues: slots }, env());
    const findings = validateMessage(result.message, resolved.dictionary, resolved.policyChain);
    // Instrument intentionally unselected here; the only acceptable finding
    // is the missing required Symbol from the D layout.
    expect(findings.filter((f) => f.tag !== 55)).toEqual([]);
  });
});
