import { describe, expect, it } from 'vitest';
import { DictionaryFormatError, dictionaryFromJson, type DictionaryJson } from './json.ts';
import { beginStringFor, enumLabel, fieldName } from './types.ts';
import { loadBaseDictionary } from './data/index.ts';

const minimal: DictionaryJson = {
  fix: 'FIX.4.4',
  formatVersion: 1,
  partial: false,
  fields: {
    '8': ['BeginString', 'STRING'],
    '9': ['BodyLength', 'LENGTH'],
    '10': ['CheckSum', 'STRING'],
    '35': ['MsgType', 'STRING', { D: 'New Order Single' }],
    '11': ['ClOrdID', 'STRING'],
    '54': ['Side', 'CHAR', { '1': 'Buy', '2': 'Sell' }],
    '55': ['Symbol', 'STRING'],
    '73': ['NoOrders', 'NUMINGROUP'],
  },
  components: { Instrument: [[55, 1]] },
  header: [
    [8, 1],
    [9, 1],
    [35, 1],
  ],
  trailer: [[10, 1]],
  messages: {
    D: { name: 'NewOrderSingle', cat: 'app', items: [[11, 1], ['#Instrument', 1], [54]] },
    E: {
      name: 'NewOrderList',
      items: [{ g: 73, req: 1, items: [[11, 1], ['#Instrument']] }],
    },
  },
};

describe('dictionaryFromJson', () => {
  const dict = dictionaryFromJson(minimal, 'FIX.4.4');

  it('parses field definitions with enums', () => {
    expect(fieldName(dict, 54)).toBe('Side');
    expect(enumLabel(dict, 54, '1')).toBe('Buy');
    expect(enumLabel(dict, 54, '9')).toBeUndefined();
    expect(dict.fields.get(11)?.enums).toBeUndefined();
  });

  it.each([
    { msgType: 'D', name: 'NewOrderSingle', itemCount: 3 },
    { msgType: 'E', name: 'NewOrderList', itemCount: 1 },
  ])('parses message $msgType', ({ msgType, name, itemCount }) => {
    const msg = dict.messages.get(msgType);
    expect(msg?.name).toBe(name);
    expect(msg?.items).toHaveLength(itemCount);
  });

  it('parses required flags and component refs', () => {
    const d = dict.messages.get('D')!;
    expect(d.items[0]).toEqual({ kind: 'field', tag: 11, required: true });
    expect(d.items[1]).toEqual({ kind: 'component', name: 'Instrument', required: true });
    expect(d.items[2]).toEqual({ kind: 'field', tag: 54, required: false });
  });

  it('parses nested group layouts', () => {
    const e = dict.messages.get('E')!;
    expect(e.items[0]).toMatchObject({ kind: 'group', countTag: 73, required: true });
  });

  it.each([
    {
      label: 'bad formatVersion',
      mutate: (j: DictionaryJson) => ({ ...j, formatVersion: 2 }),
      path: '/formatVersion',
    },
    {
      label: 'invalid tag key',
      mutate: (j: DictionaryJson) => ({
        ...j,
        fields: { ...j.fields, abc: ['Bad', 'STRING'] as const },
      }),
      path: '/fields',
    },
    {
      label: 'invalid layout ref',
      mutate: (j: DictionaryJson) => ({
        ...j,
        components: { ...j.components, Broken: [['NotARef'] as unknown as [number]] },
      }),
      path: '/components/Broken/0',
    },
  ])('rejects $label with a precise path', ({ mutate, path }) => {
    let caught: unknown;
    try {
      dictionaryFromJson(mutate(minimal), 'FIX.4.4');
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(DictionaryFormatError);
    expect((caught as DictionaryFormatError).path).toBe(path);
  });
});

describe('beginStringFor', () => {
  it.each([
    { version: 'FIX.4.2', expected: 'FIX.4.2' },
    { version: 'FIX.4.4', expected: 'FIX.4.4' },
    { version: 'FIX.5.0SP2', expected: 'FIXT.1.1' },
  ] as const)('$version renders as $expected', ({ version, expected }) => {
    expect(beginStringFor(version)).toBe(expected);
  });
});

describe('checked-in dictionary data', () => {
  it.each([
    { version: 'FIX.4.2', msgType: 'D', hasAB: false },
    { version: 'FIX.4.4', msgType: 'D', hasAB: true },
    { version: 'FIX.5.0SP2', msgType: 'D', hasAB: true },
  ] as const)(
    '$version loads with NewOrderSingle (AB: $hasAB)',
    async ({ version, msgType, hasAB }) => {
      const dict = await loadBaseDictionary(version);
      expect(dict.messages.get(msgType)?.name).toBe('NewOrderSingle');
      expect(dict.messages.has('AB')).toBe(hasAB);
      expect(dict.partial).toBe(false);
      // Header starts 8, 9, 35 in every version.
      expect(dict.header.slice(0, 3).map((i) => (i.kind === 'field' ? i.tag : -1))).toEqual([
        8, 9, 35,
      ]);
    }
  );

  it('FIX 4.4 knows Side enums and Instrument component', async () => {
    const dict = await loadBaseDictionary('FIX.4.4');
    expect(enumLabel(dict, 54, '2')).toBe('Sell');
    expect(dict.components.has('Instrument')).toBe(true);
  });

  it('FIX 5.0SP2 header carries ApplVerID(1128) from FIXT', async () => {
    const dict = await loadBaseDictionary('FIX.5.0SP2');
    const headerTags = dict.header.map((i) => (i.kind === 'field' ? i.tag : -1));
    expect(headerTags).toContain(1128);
  });
});
