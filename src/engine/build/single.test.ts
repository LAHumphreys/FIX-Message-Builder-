import { describe, expect, it } from 'vitest';
import { buildSingle, type BuildEnv } from './single.ts';
import { parseProfile } from '../profile/load.ts';
import { resolveForSystem } from '../profile/resolve.ts';
import { dictionaryFromJson, type DictionaryJson } from '../dictionary/json.ts';
import { memoryCounterStore } from '../generator/types.ts';
import { mulberry32 } from '../generator/evaluate.ts';
import { renderTagValue } from '../render/tagvalue.ts';
import type { SimpleField } from '../message/types.ts';

const dictJson: DictionaryJson = {
  fix: 'FIX.4.4',
  formatVersion: 1,
  partial: false,
  fields: {
    '11': ['ClOrdID', 'STRING'],
    '38': ['OrderQty', 'QTY'],
    '40': ['OrdType', 'CHAR'],
    '44': ['Price', 'PRICE'],
    '49': ['SenderCompID', 'STRING'],
    '54': ['Side', 'CHAR'],
    '60': ['TransactTime', 'UTCTIMESTAMP'],
  },
  components: {},
  header: [
    [8, 1],
    [9, 1],
    [35, 1],
    [49, 1],
  ],
  trailer: [[10, 1]],
  messages: { D: { name: 'NewOrderSingle', items: [[11, 1], [54, 1], [38], [44], [40], [60]] } },
};
const dict = dictionaryFromJson(dictJson, 'FIX.4.4');

const profileText = JSON.stringify({
  schemaVersion: 1,
  name: 'Test',
  version: '1',
  fixVersion: 'FIX.4.4',
  fragments: {
    session: { label: 'Session', ops: [{ op: 'set', tag: 49, value: 'MERIDIAN' }] },
    enforce: { label: 'Enforced routing', ops: [{ op: 'set', tag: 20101, value: 'GW-1' }] },
    'tmpl-d': {
      label: 'Base D',
      ops: [
        { op: 'setGenerated', tag: 11, generator: 'clOrdId' },
        { op: 'setGenerated', tag: 60, generator: 'now' },
      ],
    },
    limit: {
      label: 'Limit flow',
      ops: [
        { op: 'set', tag: 40, value: '2' },
        {
          op: 'slot',
          tag: 54,
          slot: { tag: 54, label: 'Side', type: 'enum', required: true, default: '1' },
        },
        { op: 'slot', tag: 38, slot: { tag: 38, label: 'Qty', type: 'decimal' } },
        { op: 'slot', tag: 44, slot: { tag: 44, label: 'Price', type: 'decimal' } },
        { op: 'set', tag: 20101, value: 'FLOW-CLOBBER-ATTEMPT' },
      ],
    },
  },
  templates: { D: 'tmpl-d' },
  generators: {
    clOrdId: { kind: 'template', template: 'CLORD-{date:yyyyMMdd}-{seq:4}' },
    now: { kind: 'timestamp', precision: 'micros' },
  },
  systems: [
    {
      id: 'sys1',
      label: 'System One',
      fragments: ['session'],
      finalFragment: 'enforce',
      capabilities: [],
    },
  ],
  dimensions: [
    {
      id: 'flow',
      label: 'Flow',
      kind: 'options',
      required: true,
      options: [
        { id: 'limit', label: 'Limit', fragment: 'limit', msgType: 'D' },
        { id: 'ghost-flow', label: 'Ghost', fragment: 'limit', availableOn: ['other-system'] },
      ],
    },
  ],
});

function env(): BuildEnv {
  return {
    clock: () => new Date(Date.UTC(2026, 6, 5, 9, 30, 15, 123)),
    random: mulberry32(7),
    counters: memoryCounterStore(),
  };
}

const { profile } = parseProfile(profileText);
const resolved = resolveForSystem(profile!, 'sys1', dict)!;

function fieldValue(result: ReturnType<typeof buildSingle>, tag: number): string | undefined {
  const hit = result.message.fields.find((f) => f.kind === 'field' && f.tag === tag);
  return hit && hit.kind === 'field' ? hit.value : undefined;
}

describe('buildSingle', () => {
  it('assembles template + system + dimension + slots + final, deterministic end-to-end', () => {
    const result = buildSingle(
      resolved,
      { selections: { flow: 'limit' }, slotValues: { '38': '100', '44': '25.5' } },
      env()
    );
    expect(result.msgType).toBe('D');
    expect(fieldValue(result, 11)).toBe('CLORD-20260705-0001');
    expect(fieldValue(result, 60)).toBe('20260705-09:30:15.123000');
    expect(fieldValue(result, 49)).toBe('MERIDIAN');
    expect(fieldValue(result, 40)).toBe('2');
    expect(fieldValue(result, 38)).toBe('100');
    expect(fieldValue(result, 54)).toBe('1'); // slot default applied
    expect(result.findings).toEqual([]);

    const wire = renderTagValue(result.message, resolved.dictionary, { delimiter: 'pipe' });
    expect(wire).toContain('8=FIX.4.4|9=');
    expect(wire).toContain('49=MERIDIAN');
    expect(wire).toMatch(/\|10=\d{3}\|$/);

    // Determinism: same env -> byte-identical output.
    const again = buildSingle(
      resolved,
      { selections: { flow: 'limit' }, slotValues: { '38': '100', '44': '25.5' } },
      env()
    );
    expect(renderTagValue(again.message, resolved.dictionary, { delimiter: 'pipe' })).toBe(wire);
  });

  it('user slot values beat defaults; final fragment beats flow fragments', () => {
    const result = buildSingle(
      resolved,
      { selections: { flow: 'limit' }, slotValues: { '54': '2' } },
      env()
    );
    const side = result.message.fields.find(
      (f) => f.kind === 'field' && f.tag === 54
    ) as SimpleField;
    expect(side.value).toBe('2');
    expect(side.provenance.sourceId).toBe('user');
    // The flow fragment tried to set 20101; the system final fragment wins.
    expect(fieldValue(result, 20101)).toBe('GW-1');
  });

  it('slot defaults do not consume sequence numbers in the discovery pass', () => {
    const e = env();
    const first = buildSingle(resolved, { selections: { flow: 'limit' }, slotValues: {} }, e);
    const second = buildSingle(resolved, { selections: { flow: 'limit' }, slotValues: {} }, e);
    // Each build consumes exactly one clOrdId sequence value... per batch scope.
    expect(fieldValue(first, 11)).toBe('CLORD-20260705-0001');
    expect(fieldValue(second, 11)).toBe('CLORD-20260705-0001'); // fresh batch each
  });

  it('reports unresolved selections and unavailable options as findings, still renders', () => {
    const unresolved = buildSingle(
      resolved,
      { selections: { flow: 'does-not-exist' }, slotValues: {} },
      env()
    );
    expect(unresolved.findings).toMatchObject([{ ruleId: 'selection-unresolved' }]);
    expect(unresolved.message.fields.length).toBeGreaterThan(0);

    const unavailable = buildSingle(
      resolved,
      { selections: { flow: 'ghost-flow' }, slotValues: {} },
      env()
    );
    expect(unavailable.findings).toMatchObject([{ ruleId: 'option-unavailable' }]);
    // The fragment still applies — never silent breakage, never a refusal.
    expect(fieldValue(unavailable, 40)).toBe('2');
  });

  it('exposes collected slots for the UI form', () => {
    const result = buildSingle(resolved, { selections: { flow: 'limit' }, slotValues: {} }, env());
    expect(result.slots.map((s) => s.spec.tag)).toEqual([54, 38, 44]);
  });
});
