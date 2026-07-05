import { describe, expect, it } from 'vitest';
import { buildBatch, buildList, buildMultileg, type InstrumentContext } from './group.ts';
import type { BuildEnv } from './single.ts';
import { parseProfile } from '../profile/load.ts';
import { resolveForSystem } from '../profile/resolve.ts';
import { parseInstrumentDbJson } from '../instrument/db.ts';
import type { IdentityConvention } from '../instrument/convention.ts';
import { dictionaryFromJson, type DictionaryJson } from '../dictionary/json.ts';
import { memoryCounterStore } from '../generator/types.ts';
import { mulberry32 } from '../generator/evaluate.ts';
import type { RepeatingGroup, SimpleField } from '../message/types.ts';

const dictJson: DictionaryJson = {
  fix: 'FIX.4.4',
  formatVersion: 1,
  partial: false,
  fields: {
    '11': ['ClOrdID', 'STRING'],
    '38': ['OrderQty', 'QTY'],
    '54': ['Side', 'CHAR'],
    '55': ['Symbol', 'STRING'],
    '48': ['SecurityID', 'STRING'],
    '22': ['SecurityIDSource', 'STRING'],
    '66': ['ListID', 'STRING'],
    '67': ['ListSeqNo', 'INT'],
    '68': ['TotNoOrders', 'INT'],
    '73': ['NoOrders', 'NUMINGROUP'],
    '555': ['NoLegs', 'NUMINGROUP'],
    '600': ['LegSymbol', 'STRING'],
    '602': ['LegSecurityID', 'STRING'],
    '603': ['LegSecurityIDSource', 'STRING'],
    '610': ['LegMaturityMonthYear', 'MONTHYEAR'],
    '623': ['LegRatioQty', 'FLOAT'],
    '624': ['LegSide', 'CHAR'],
    '566': ['LegPrice', 'PRICE'],
    '762': ['SecuritySubType', 'STRING'],
    '20101': ['Gateway', 'STRING'],
  },
  components: {},
  header: [
    [8, 1],
    [9, 1],
    [35, 1],
  ],
  trailer: [[10, 1]],
  messages: {},
};
const dict = dictionaryFromJson(dictJson, 'FIX.4.4');

const profileText = JSON.stringify({
  schemaVersion: 1,
  name: 'GroupTest',
  version: '1',
  fixVersion: 'FIX.4.4',
  fragments: {
    'tmpl-d': { label: 'Base D', ops: [{ op: 'setGenerated', tag: 11, generator: 'clOrdId' }] },
    'tmpl-e-entry': {
      label: 'List entry base',
      ops: [{ op: 'setGenerated', tag: 11, generator: 'clOrdId' }],
    },
    basket: {
      label: 'Basket flow',
      ops: [
        { op: 'setGenerated', tag: 66, generator: 'listId' },
        { op: 'slot', tag: 54, slot: { tag: 54, label: 'Side', type: 'enum', default: '1' } },
        { op: 'slot', tag: 38, slot: { tag: 38, label: 'Qty', type: 'decimal' } },
      ],
    },
    enforce: { label: 'Enforced', ops: [{ op: 'set', tag: 20101, value: 'GW' }] },
  },
  templates: { D: 'tmpl-d', 'E:entry': 'tmpl-e-entry' },
  generators: {
    clOrdId: { kind: 'sequence', scope: 'batch', pad: 3 },
    listId: { kind: 'shared', of: 'listIdValue' },
    listIdValue: { kind: 'template', template: 'L-{seq:3}' },
  },
  systems: [{ id: 's1', label: 'S1', finalFragment: 'enforce' }],
  dimensions: [
    {
      id: 'flow',
      label: 'Flow',
      kind: 'options',
      options: [
        {
          id: 'basket',
          label: 'Basket',
          fragment: 'basket',
          msgType: 'D',
          modes: ['batch', 'list'],
        },
      ],
    },
  ],
});

const instrumentsJson = JSON.stringify({
  instruments: [
    { key: 'AAA', name: 'Alpha', schemes: { isin: 'ZZ1' }, attrs: { securityType: 'CS' } },
    { key: 'BBB', name: 'Beta', schemes: { isin: 'ZZ2' }, attrs: { securityType: 'CS' } },
    {
      key: 'FUT-U6',
      name: 'Fut Sep',
      schemes: { isin: 'ZZF1' },
      attrs: { securityType: 'FUT', maturityMonthYear: '202609' },
    },
    {
      key: 'FUT-Z6',
      name: 'Fut Dec',
      schemes: { isin: 'ZZF2' },
      attrs: { securityType: 'FUT', maturityMonthYear: '202612' },
    },
  ],
  strategies: [
    {
      key: 'CAL',
      name: 'Calendar',
      strategyType: 'CS',
      schemes: { isin: 'ZZCAL' },
      attrs: { securityType: 'MLEG' },
      legs: [
        { instrument: 'FUT-U6', ratioQty: '1', side: '1' },
        { instrument: 'FUT-Z6', ratioQty: '1', side: '2', price: '5.5' },
      ],
    },
  ],
});

const convention: IdentityConvention = {
  variants: [
    {
      emit: [
        { role: 'securityId', from: { scheme: 'isin' }, required: true },
        { role: 'securityIdSource', from: { literal: '4' } },
        { role: 'maturityMonthYear', from: { attr: 'maturityMonthYear' } },
      ],
    },
  ],
};

const { profile } = parseProfile(profileText);
const resolved = resolveForSystem(profile!, 's1', dict)!;
const { db } = parseInstrumentDbJson(instrumentsJson);
const instruments: InstrumentContext = { db: db!, convention };

function env(): BuildEnv {
  return {
    clock: () => new Date(Date.UTC(2026, 6, 5, 12, 0, 0)),
    random: mulberry32(1),
    counters: memoryCounterStore(),
  };
}

function val(fields: readonly (SimpleField | RepeatingGroup)[], tag: number): string | undefined {
  const f = fields.find((f) => f.kind === 'field' && f.tag === tag);
  return f && f.kind === 'field' ? f.value : undefined;
}

describe('buildBatch', () => {
  const input = {
    selections: { flow: 'basket' },
    slotValues: { '54': '2' },
    rows: [
      { instrument: 'AAA', slotValues: { '38': '100' } },
      { instrument: 'BBB', slotValues: { '38': '200', '54': '1' } },
      { instrument: 'AAA', slotValues: { '38': '300' } },
    ],
  };

  it('builds N messages sharing a ListID with sequential ClOrdIDs', () => {
    const result = buildBatch(resolved, input, env(), instruments);
    expect(result.messages).toHaveLength(3);
    const listIds = result.messages.map((m) => val(m.fields as never, 66));
    expect(listIds[0]).toBe('L-001');
    expect(new Set(listIds).size).toBe(1); // shared generator: same everywhere
    expect(result.messages.map((m) => val(m.fields as never, 11))).toEqual(['001', '002', '003']);
  });

  it('applies per-row instruments and slot overrides over shared values', () => {
    const result = buildBatch(resolved, input, env(), instruments);
    expect(result.messages.map((m) => val(m.fields as never, 48))).toEqual(['ZZ1', 'ZZ2', 'ZZ1']);
    expect(result.messages.map((m) => val(m.fields as never, 38))).toEqual(['100', '200', '300']);
    // Shared slot value 54=2 applies except where row overrides to 1.
    expect(result.messages.map((m) => val(m.fields as never, 54))).toEqual(['2', '1', '2']);
    // Final fragment enforced on every row.
    expect(result.messages.every((m) => val(m.fields as never, 20101) === 'GW')).toBe(true);
  });

  it('is deterministic under an injected env', () => {
    const a = buildBatch(resolved, input, env(), instruments);
    const b = buildBatch(resolved, input, env(), instruments);
    expect(a.messages).toEqual(b.messages);
  });
});

describe('buildList (35=E)', () => {
  const input = {
    selections: { flow: 'basket' },
    slotValues: {},
    rows: [
      { instrument: 'AAA', slotValues: { '38': '10' } },
      { instrument: 'BBB', slotValues: { '38': '20' } },
      { instrument: 'AAA', slotValues: { '38': '30' } },
    ],
  };

  it('builds one message with a NoOrders group entry per row', () => {
    const result = buildList(resolved, input, env(), instruments);
    expect(result.message.msgType).toBe('E');
    const group = result.message.fields.find((f) => f.kind === 'group') as RepeatingGroup;
    expect(group.countTag).toBe(73);
    expect(group.entries).toHaveLength(3);
    expect(val(result.message.fields as never, 68)).toBe('3'); // TotNoOrders
    // ListID at top level via the flow fragment's shared generator.
    expect(val(result.message.fields as never, 66)).toBe('L-001');
  });

  it('entries carry sequencing, per-entry ClOrdIDs, instruments, and slot values', () => {
    const result = buildList(resolved, input, env(), instruments);
    const group = result.message.fields.find((f) => f.kind === 'group') as RepeatingGroup;
    const entryVals = group.entries.map((e) => ({
      clOrdId: val(e as never, 11),
      seq: val(e as never, 67),
      secId: val(e as never, 48),
      qty: val(e as never, 38),
      side: val(e as never, 54),
    }));
    expect(entryVals).toEqual([
      { clOrdId: '001', seq: '1', secId: 'ZZ1', qty: '10', side: '1' },
      { clOrdId: '002', seq: '2', secId: 'ZZ2', qty: '20', side: '1' },
      { clOrdId: '003', seq: '3', secId: 'ZZ1', qty: '30', side: '1' },
    ]);
  });
});

describe('buildMultileg (35=AB)', () => {
  const input = {
    selections: { flow: 'basket' },
    slotValues: { '38': '5' },
    strategyKey: 'CAL',
  };

  it('builds the 555 group from strategy legs via the leg placement context', () => {
    const result = buildMultileg(resolved, input, env(), instruments);
    expect(result.message.msgType).toBe('AB');
    const legs = result.message.fields.find(
      (f) => f.kind === 'group' && f.countTag === 555
    ) as RepeatingGroup;
    expect(legs.entries).toHaveLength(2);
    const leg1 = legs.entries[0]!;
    const leg2 = legs.entries[1]!;
    // Leg instrument blocks use 600-series tags, same convention.
    expect(val(leg1 as never, 602)).toBe('ZZF1');
    expect(val(leg1 as never, 603)).toBe('4');
    expect(val(leg1 as never, 610)).toBe('202609');
    expect(val(leg1 as never, 623)).toBe('1');
    expect(val(leg1 as never, 624)).toBe('1');
    expect(val(leg2 as never, 602)).toBe('ZZF2');
    expect(val(leg2 as never, 624)).toBe('2');
    expect(val(leg2 as never, 566)).toBe('5.5');
  });

  it('places the strategy identity at top level with 762 and applies leg overrides', () => {
    const result = buildMultileg(
      resolved,
      { ...input, legOverrides: [{ ratioQty: '2' }, { price: '6.0' }] },
      env(),
      instruments
    );
    expect(val(result.message.fields as never, 48)).toBe('ZZCAL');
    expect(val(result.message.fields as never, 762)).toBe('CS');
    const legs = result.message.fields.find(
      (f) => f.kind === 'group' && f.countTag === 555
    ) as RepeatingGroup;
    expect(val(legs.entries[0]! as never, 623)).toBe('2');
    expect(val(legs.entries[1]! as never, 566)).toBe('6.0');
  });

  it('unknown strategy is a finding, message still renders', () => {
    const result = buildMultileg(resolved, { ...input, strategyKey: 'GHOST' }, env(), instruments);
    expect(result.findings.some((f) => f.ruleId === 'selection-unresolved')).toBe(true);
    expect(result.message.msgType).toBe('AB');
  });
});
