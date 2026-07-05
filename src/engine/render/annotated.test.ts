import { describe, expect, it } from 'vitest';
import { buildAnnotatedLines } from './annotated.ts';
import { field, group } from '../message/builders.ts';
import type { FixMessage, Provenance } from '../message/types.ts';
import { dictionaryFromJson, type DictionaryJson } from '../dictionary/json.ts';

const user: Provenance = { sourceId: 'user', sourceLabel: 'User input' };
const fragment: Provenance = {
  sourceId: 'flow:limit',
  sourceLabel: 'Flow: Limit',
  overwrote: user,
};

const dict = dictionaryFromJson(
  {
    fix: 'FIX.4.4',
    formatVersion: 1,
    partial: false,
    fields: {
      '11': ['ClOrdID', 'STRING'],
      '38': ['OrderQty', 'QTY'],
      '54': ['Side', 'CHAR', { '1': 'Buy', '2': 'Sell' }],
      '73': ['NoOrders', 'NUMINGROUP'],
    },
    components: {},
    header: [],
    trailer: [],
    messages: {},
  } satisfies DictionaryJson,
  'FIX.4.4'
);

const msg: FixMessage = {
  beginString: 'FIX.4.4',
  msgType: 'E',
  fields: [
    field(54, '1', fragment),
    field(9999, 'custom', user),
    group(73, [[field(11, 'A', user), field(54, '2', user)], [field(11, 'B', user)]], user),
  ],
};

describe('buildAnnotatedLines', () => {
  const lines = buildAnnotatedLines(msg, dict);

  it('resolves names and enum labels; unknown tags get no name', () => {
    expect(lines[0]).toMatchObject({ tag: 54, name: 'Side', value: '1', enumLabel: 'Buy' });
    expect(lines[1]).toMatchObject({ tag: 9999, name: undefined, enumLabel: undefined });
  });

  it('renders group counts and indents entries', () => {
    const count = lines.find((l) => l.isGroupCount);
    expect(count).toMatchObject({ tag: 73, value: '2', depth: 0, name: 'NoOrders' });
    const entryLines = lines.filter((l) => l.depth === 1);
    expect(entryLines.map((l) => `${l.path}=${l.value}`)).toEqual([
      '73[0]/11=A',
      '73[0]/54=2',
      '73[1]/11=B',
    ]);
  });

  it('keeps provenance including overwrote chains', () => {
    expect(lines[0]!.provenance.sourceId).toBe('flow:limit');
    expect(lines[0]!.provenance.overwrote?.sourceId).toBe('user');
  });

  it('disambiguates duplicate tags in paths', () => {
    const dup: FixMessage = {
      beginString: 'FIX.4.4',
      msgType: 'D',
      fields: [field(38, '1', user), field(38, '2', user)],
    };
    const dupLines = buildAnnotatedLines(dup, dict);
    expect(dupLines.map((l) => l.path)).toEqual(['38', '38#1']);
  });
});
