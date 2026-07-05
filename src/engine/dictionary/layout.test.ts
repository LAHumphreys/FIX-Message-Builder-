import { describe, expect, it } from 'vitest';
import { dictionaryFromJson, type DictionaryJson } from './json.ts';
import { collectTags, expandLayout, findGroupDef, messageLayout } from './layout.ts';

const json: DictionaryJson = {
  fix: 'FIX.4.4',
  formatVersion: 1,
  partial: false,
  fields: {
    '8': ['BeginString', 'STRING'],
    '9': ['BodyLength', 'LENGTH'],
    '10': ['CheckSum', 'STRING'],
    '35': ['MsgType', 'STRING'],
    '11': ['ClOrdID', 'STRING'],
    '54': ['Side', 'CHAR'],
    '55': ['Symbol', 'STRING'],
    '48': ['SecurityID', 'STRING'],
    '454': ['NoSecurityAltID', 'NUMINGROUP'],
    '455': ['SecurityAltID', 'STRING'],
    '456': ['SecurityAltIDSource', 'STRING'],
    '73': ['NoOrders', 'NUMINGROUP'],
  },
  components: {
    SecAltIDGrp: [{ g: 454, items: [[455], [456]] }],
    Instrument: [[55, 1], [48], ['#SecAltIDGrp']],
  },
  header: [
    [8, 1],
    [9, 1],
    [35, 1],
  ],
  trailer: [[10, 1]],
  messages: {
    D: { name: 'NewOrderSingle', items: [[11, 1], ['#Instrument', 1], [54]] },
    X: { name: 'OptionalComponent', items: [['#Instrument']] },
    E: {
      name: 'NewOrderList',
      items: [
        {
          g: 73,
          req: 1,
          items: [
            [11, 1],
            ['#Instrument', 1],
          ],
        },
      ],
    },
  },
};

const dict = dictionaryFromJson(json, 'FIX.4.4');

describe('expandLayout', () => {
  it('expands nested components and groups', () => {
    const body = messageLayout(dict, 'D').body;
    expect(collectTags(body)).toEqual([11, 55, 48, 454, 54]);
    const group = findGroupDef(body, 454);
    expect(group && collectTags(group.items)).toEqual([455, 456]);
  });

  it('keeps requiredness through a required component', () => {
    const body = messageLayout(dict, 'D').body;
    const symbol = body.find((i) => i.kind === 'field' && i.tag === 55);
    expect(symbol).toMatchObject({ required: true });
  });

  it('demotes members of an optional component to optional', () => {
    const body = messageLayout(dict, 'X').body;
    const symbol = body.find((i) => i.kind === 'field' && i.tag === 55);
    expect(symbol).toMatchObject({ required: false });
  });

  it('keeps requiredness inside group entries regardless of component optionality', () => {
    const body = messageLayout(dict, 'E').body;
    const group = findGroupDef(body, 73);
    const clOrdId = group?.items.find((i) => i.kind === 'field' && i.tag === 11);
    expect(clOrdId).toMatchObject({ required: true });
  });

  it('expands unknown component references to nothing', () => {
    const items = expandLayout([{ kind: 'component', name: 'DoesNotExist', required: true }], dict);
    expect(items).toEqual([]);
  });
});

describe('messageLayout', () => {
  it('yields empty body for unknown message types but keeps header/trailer', () => {
    const layout = messageLayout(dict, 'ZZ');
    expect(layout.body).toEqual([]);
    expect(collectTags(layout.header)).toEqual([8, 9, 35]);
    expect(collectTags(layout.trailer)).toEqual([10]);
  });

  it('provides header/trailer tag sets', () => {
    const layout = messageLayout(dict, 'D');
    expect(layout.headerTags.has(35)).toBe(true);
    expect(layout.trailerTags.has(10)).toBe(true);
    expect(layout.headerTags.has(11)).toBe(false);
  });
});
