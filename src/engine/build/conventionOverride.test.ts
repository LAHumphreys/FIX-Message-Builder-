/**
 * Option-level identity-convention override (§3.10, workspace spec W0):
 * a selected dimension option may carry `convention`, replacing the
 * system's for instrument placement. Precedence: option > system; when two
 * selected options both override, the last declared dimension wins with a
 * finding.
 */
import { describe, expect, it } from 'vitest';
import { resolveSelections } from './single.ts';
import { parseProfile } from '../profile/load.ts';
import { resolveForSystem } from '../profile/resolve.ts';
import { dictionaryFromJson, type DictionaryJson } from '../dictionary/json.ts';
import { instrumentFragment } from '../instrument/placement.ts';
import type { InstrumentRecord } from '../instrument/types.ts';

const dictJson: DictionaryJson = {
  fix: 'FIX.4.4',
  formatVersion: 1,
  partial: false,
  fields: {
    '22': ['SecurityIDSource', 'STRING'],
    '48': ['SecurityID', 'STRING'],
  },
  components: {},
  header: [
    [8, 1],
    [9, 1],
    [35, 1],
  ],
  trailer: [[10, 1]],
  messages: { D: { name: 'NewOrderSingle', items: [[48], [22]] } },
};
const dict = dictionaryFromJson(dictJson, 'FIX.4.4');

const profileText = JSON.stringify({
  schemaVersion: 1,
  name: 'Override test',
  version: '1',
  fixVersion: 'FIX.4.4',
  fragments: { noop: { label: 'noop', ops: [] } },
  conventions: {
    'by-isin': {
      variants: [
        {
          emit: [
            { role: 'securityId', from: { scheme: 'isin' }, required: true },
            { role: 'securityIdSource', from: { literal: '4' } },
          ],
        },
      ],
    },
    'by-house': {
      variants: [
        {
          emit: [
            { role: 'securityId', from: { scheme: 'house' }, required: true },
            { role: 'securityIdSource', from: { literal: '8' } },
          ],
        },
      ],
    },
  },
  systems: [{ id: 'sys', label: 'SYS', convention: 'by-isin' }],
  dimensions: [
    {
      id: 'client',
      label: 'Client',
      kind: 'options',
      options: [
        { id: 'desk', label: 'Desk' },
        { id: 'house', label: 'House entry', convention: 'by-house' },
      ],
    },
    {
      id: 'route',
      label: 'Route',
      kind: 'options',
      options: [
        { id: 'plain', label: 'Plain' },
        { id: 'special', label: 'Special', convention: 'by-isin' },
      ],
    },
  ],
});

const { profile, issues } = parseProfile(profileText);
const resolved = resolveForSystem(profile!, 'sys', dict)!;

const record: InstrumentRecord = {
  key: 'X',
  name: 'X Corp',
  schemes: { isin: 'GB0000000001', house: 'H-1' },
  attrs: {},
};

describe('option-level convention override', () => {
  it('the test profile itself loads cleanly', () => {
    expect(issues).toEqual([]);
  });

  it.each([
    { selections: {}, convention: undefined, source: undefined },
    { selections: { client: 'desk' }, convention: undefined, source: undefined },
    { selections: { client: 'house' }, convention: 'by-house', source: 'Client: House entry' },
  ])(
    'selections $selections resolve convention $convention',
    ({ selections, convention, source }) => {
      const info = resolveSelections(resolved, selections);
      expect(info.convention).toBe(convention);
      expect(info.conventionSource).toBe(source);
      expect(info.findings.filter((f) => f.ruleId === 'convention-conflict')).toEqual([]);
    }
  );

  it('two overriding selections: last declared dimension wins, with a finding', () => {
    const info = resolveSelections(resolved, { client: 'house', route: 'special' });
    expect(info.convention).toBe('by-isin');
    expect(info.conventionSource).toBe('Route: Special');
    const conflicts = info.findings.filter((f) => f.ruleId === 'convention-conflict');
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]!.message).toContain('Client: House entry');
    expect(conflicts[0]!.message).toContain('Route: Special');
  });

  it('the overridden convention changes the placed identity tags', () => {
    const systemConv = profile!.conventions!['by-isin']!;
    const overrideConv = profile!.conventions!['by-house']!;
    const viaSystem = instrumentFragment(record, systemConv, 'instrument', 'FIX.4.4');
    const viaOverride = instrumentFragment(
      record,
      overrideConv,
      'instrument',
      'FIX.4.4',
      'Client: House entry'
    );
    expect(viaSystem.fragment.ops).toContainEqual({ op: 'set', tag: 48, value: 'GB0000000001' });
    expect(viaSystem.fragment.ops).toContainEqual({ op: 'set', tag: 22, value: '4' });
    expect(viaOverride.fragment.ops).toContainEqual({ op: 'set', tag: 48, value: 'H-1' });
    expect(viaOverride.fragment.ops).toContainEqual({ op: 'set', tag: 22, value: '8' });
    expect(viaOverride.fragment.label).toBe(
      'Instrument: X Corp · convention via Client: House entry'
    );
  });

  it('unknown convention refs on options and systems are load warnings', () => {
    const bad = JSON.parse(profileText) as {
      systems: { convention: string }[];
      dimensions: { options: { convention?: string }[] }[];
    };
    bad.systems[0]!.convention = 'nope-sys';
    bad.dimensions[0]!.options[1]!.convention = 'nope-opt';
    const result = parseProfile(JSON.stringify(bad));
    const messages = result.issues.map((i) => `${i.path} ${i.message}`);
    expect(messages).toContainEqual("/systems/0/convention unknown convention 'nope-sys'");
    expect(messages).toContainEqual(
      "/dimensions/0/options/1/convention unknown convention 'nope-opt'"
    );
  });
});
