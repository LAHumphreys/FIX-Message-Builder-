import { describe, expect, it } from 'vitest';
import { parseProfile, validateProfile } from './load.ts';
import { availableDimensions, resolveForSystem } from './resolve.ts';
import { isAvailable, resolveSystemDef } from './types.ts';
import { dictionaryFromJson, type DictionaryJson } from '../dictionary/json.ts';
import { enumLabel, fieldName } from '../dictionary/types.ts';

const baseDictJson: DictionaryJson = {
  fix: 'FIX.4.4',
  formatVersion: 1,
  partial: false,
  fields: {
    '40': ['OrdType', 'CHAR', { '1': 'Market', '2': 'Limit' }],
    '59': ['TimeInForce', 'CHAR', { '0': 'Day', '1': 'Good Till Cancel' }],
    '11': ['ClOrdID', 'STRING'],
    '54': ['Side', 'CHAR', { '1': 'Buy', '2': 'Sell' }],
  },
  components: {},
  header: [
    [8, 1],
    [9, 1],
    [35, 1],
  ],
  trailer: [[10, 1]],
  messages: { D: { name: 'NewOrderSingle', items: [[11, 1], [54, 1], [40], [59]] } },
};
const baseDict = dictionaryFromJson(baseDictJson, 'FIX.4.4');

const profileJson = {
  schemaVersion: 1,
  name: 'Meridian Demo',
  version: '1.0.0',
  fixVersion: 'FIX.4.4',
  dictionaryOverlay: {
    fields: {
      '7001': ['SlicerStyle', 'INT', { '1': 'TWAP', '2': 'VWAP' }],
    },
  },
  fragments: {
    'route-uat': { label: 'Route: Alpha UAT', ops: [{ op: 'set', tag: 49, value: 'MERIDIAN' }] },
    'final-uat': {
      label: 'Enforced: UAT gateway',
      ops: [{ op: 'set', tag: 20101, value: 'UAT-GW' }],
    },
    'final-dev': {
      label: 'Enforced: DEV gateway',
      ops: [{ op: 'set', tag: 20101, value: 'DEV-GW' }],
    },
    'flow-limit': {
      label: 'Flow: Limit',
      ops: [
        { op: 'set', tag: 40, value: '2' },
        { op: 'slot', tag: 54, slot: { tag: 54, label: 'Side', type: 'enum', required: true } },
      ],
    },
    'flow-slicer': {
      label: 'Flow: SLICER',
      ops: [{ op: 'set', tag: 7001, value: '1' }],
    },
    'tmpl-d': {
      label: 'NewOrderSingle base',
      ops: [{ op: 'setGenerated', tag: 11, generator: 'clOrdId' }],
    },
  },
  templates: { D: 'tmpl-d' },
  generators: {
    clOrdId: { kind: 'template', template: 'CLORD-{seq:4}' },
  },
  systems: [
    {
      id: 'alpha-uat',
      label: 'Alpha UAT',
      fragments: ['route-uat'],
      finalFragment: 'final-uat',
      capabilities: ['slicer-v2', 'lists'],
      dictionaryOverlay: {
        fields: { '59': { enums: { X: 'At Omega Close' } } },
      },
    },
    {
      id: 'alpha-dev',
      label: 'Alpha DEV',
      extends: 'alpha-uat',
      finalFragment: 'final-dev',
      capabilities: ['lists'],
    },
  ],
  dimensions: [
    {
      id: 'flow',
      label: 'Flow',
      kind: 'options',
      required: true,
      options: [
        { id: 'limit', label: 'Plain limit', fragment: 'flow-limit', msgType: 'D' },
        {
          id: 'slicer',
          label: 'SLICER algo',
          fragment: 'flow-slicer',
          msgType: 'D',
          availableOn: ['cap:slicer-v2'],
        },
      ],
    },
  ],
};

describe('parseProfile', () => {
  it('parses a valid profile with no issues', () => {
    const result = parseProfile(JSON.stringify(profileJson));
    expect(result.issues).toEqual([]);
    expect(result.profile?.name).toBe('Meridian Demo');
    expect(Object.keys(result.profile!.fragments)).toHaveLength(6);
  });

  it('rejects non-JSON and reports fatal shape errors with paths', () => {
    expect(parseProfile('not json').issues[0]).toMatchObject({ severity: 'error', path: '' });
    const result = validateProfile({ schemaVersion: 'x', name: '', systems: [] });
    const paths = result.issues.map((i) => i.path);
    expect(result.profile).toBeUndefined();
    expect(paths).toContain('/schemaVersion');
    expect(paths).toContain('/name');
    expect(paths).toContain('/systems');
  });

  it.each([
    {
      label: 'unknown fragment ref in system',
      mutate: (p: typeof profileJson) => ({
        ...p,
        systems: [{ ...p.systems[0]!, fragments: ['nope'] }, p.systems[1]!],
      }),
      path: '/systems/0/fragments',
    },
    {
      label: 'unknown extends target',
      mutate: (p: typeof profileJson) => ({
        ...p,
        systems: [p.systems[0]!, { ...p.systems[1]!, extends: 'ghost' }],
      }),
      path: '/systems/1/extends',
    },
    {
      label: 'newer schemaVersion',
      mutate: (p: typeof profileJson) => ({ ...p, schemaVersion: 99 }),
      path: '/schemaVersion',
    },
  ])('warns (still loads) on $label', ({ mutate, path }) => {
    const result = validateProfile(mutate(profileJson));
    expect(result.profile).toBeDefined();
    expect(result.issues.some((i) => i.severity === 'warning' && i.path === path)).toBe(true);
  });

  it('reports invalid fragment ops with precise paths', () => {
    const bad = {
      ...profileJson,
      fragments: { broken: { ops: [{ op: 'set', tag: 'x' }] } },
    };
    const result = validateProfile(bad);
    expect(
      result.issues.some((i) => i.severity === 'error' && i.path === '/fragments/broken/ops/0')
    ).toBe(true);
  });
});

describe('resolveSystemDef (extends)', () => {
  const { profile } = parseProfile(JSON.stringify(profileJson));

  it('child inherits unset properties and overrides set ones', () => {
    const dev = resolveSystemDef(profile!, 'alpha-dev')!;
    expect(dev.fragments).toEqual(['route-uat']); // inherited
    expect(dev.finalFragment).toBe('final-dev'); // overridden
    expect(dev.capabilities).toEqual(['lists']); // overridden (no slicer-v2)
    expect(dev.dictionaryOverlay).toBeDefined(); // inherited
  });

  it('returns the parent untouched', () => {
    const uat = resolveSystemDef(profile!, 'alpha-uat')!;
    expect(uat.finalFragment).toBe('final-uat');
    expect(uat.capabilities).toContain('slicer-v2');
  });
});

describe('resolveForSystem', () => {
  const { profile } = parseProfile(JSON.stringify(profileJson));

  it('layers dictionary overlays base -> profile -> system', () => {
    const resolved = resolveForSystem(profile!, 'alpha-uat', baseDict)!;
    // Profile overlay added the custom 7001.
    expect(fieldName(resolved.dictionary, 7001)).toBe('SlicerStyle');
    expect(enumLabel(resolved.dictionary, 7001, '2')).toBe('VWAP');
    // System overlay merged a non-standard TimeInForce enum, keeping the rest.
    expect(enumLabel(resolved.dictionary, 59, 'X')).toBe('At Omega Close');
    expect(enumLabel(resolved.dictionary, 59, '0')).toBe('Day');
  });

  it('filters option availability by capability tags', () => {
    const uat = resolveForSystem(profile!, 'alpha-uat', baseDict)!;
    const dev = resolveForSystem(profile!, 'alpha-dev', baseDict)!;
    const uatFlow = availableDimensions(uat)[0]!;
    const devFlow = availableDimensions(dev)[0]!;
    expect(uatFlow.options.map((o) => o.available)).toEqual([true, true]);
    expect(devFlow.options.map((o) => o.available)).toEqual([true, false]);
  });

  it('returns undefined for unknown systems', () => {
    expect(resolveForSystem(profile!, 'ghost', baseDict)).toBeUndefined();
  });
});

describe('isAvailable', () => {
  const caps = new Set(['lists']);
  it.each([
    { tokens: undefined, expected: true },
    { tokens: [], expected: true },
    { tokens: ['alpha-uat'], expected: true },
    { tokens: ['other-system'], expected: false },
    { tokens: ['cap:lists'], expected: true },
    { tokens: ['cap:slicer-v2'], expected: false },
    { tokens: ['other-system', 'cap:lists'], expected: true },
  ])('$tokens -> $expected', ({ tokens, expected }) => {
    expect(isAvailable(tokens, 'alpha-uat', caps)).toBe(expected);
  });
});
