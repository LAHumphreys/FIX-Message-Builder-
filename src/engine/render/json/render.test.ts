import { describe, expect, it } from 'vitest';
import { renderJsonBatch, renderJsonMessage, renderJsonText } from './render.ts';
import type { JsonMappingConfig } from './types.ts';
import { field, group } from '../../message/builders.ts';
import type { FixMessage, Provenance } from '../../message/types.ts';
import { dictionaryFromJson, type DictionaryJson } from '../../dictionary/json.ts';

const src: Provenance = { sourceId: 't', sourceLabel: 'T' };

const dict = dictionaryFromJson(
  {
    fix: 'FIX.4.4',
    formatVersion: 1,
    partial: false,
    fields: {
      '8': ['BeginString', 'STRING'],
      '35': ['MsgType', 'STRING'],
      '11': ['ClOrdID', 'STRING'],
      '38': ['OrderQty', 'QTY'],
      '44': ['Price', 'PRICE'],
      '52': ['SendingTime', 'UTCTIMESTAMP'],
      '54': ['Side', 'CHAR'],
      '73': ['NoOrders', 'NUMINGROUP'],
      '7004': ['SliceRandomize', 'BOOLEAN'],
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
    field(52, '20260705-12:00:00', src),
    field(38, '100', src),
    field(44, '25.5', src),
    field(7004, 'Y', src),
    field(9999, 'custom', src),
    group(
      73,
      [
        [field(11, 'A', src), field(54, '1', src)],
        [field(11, 'B', src), field(54, '2', src)],
      ],
      src
    ),
  ],
};

const base: JsonMappingConfig = {
  keyStyle: 'name',
  groupKey: 'countName',
  emitCounts: false,
  typedValues: false,
};

describe('renderJsonMessage: mapping matrix', () => {
  it('name keys / omit counts / string values (the demo default)', () => {
    expect(renderJsonMessage(msg, dict, base)).toEqual({
      BeginString: 'FIX.4.4',
      MsgType: 'E',
      SendingTime: '20260705-12:00:00',
      OrderQty: '100',
      Price: '25.5',
      SliceRandomize: 'Y',
      '9999': 'custom',
      NoOrders: [
        { ClOrdID: 'A', Side: '1' },
        { ClOrdID: 'B', Side: '2' },
      ],
    });
  });

  it('tag keys', () => {
    const out = renderJsonMessage(msg, dict, { ...base, keyStyle: 'tag', groupKey: 'countTag' });
    expect(out).toMatchObject({ '38': '100', '73': [{ '11': 'A' }, { '11': 'B' }] });
  });

  it('alias map with name fallback', () => {
    const out = renderJsonMessage(msg, dict, {
      ...base,
      keyStyle: { alias: { '38': 'qty', '44': 'px' } },
      groupKey: { alias: { '73': 'orders' } },
    });
    expect(out).toMatchObject({
      qty: '100',
      px: '25.5',
      SendingTime: '20260705-12:00:00', // falls back to name
      orders: [{ ClOrdID: 'A' }, { ClOrdID: 'B' }],
    });
  });

  it('explicit counts', () => {
    const out = renderJsonMessage(msg, dict, { ...base, emitCounts: true }) as Record<
      string,
      unknown
    >;
    expect(out['NoOrders']).toEqual([
      { ClOrdID: 'A', Side: '1' },
      { ClOrdID: 'B', Side: '2' },
    ]);
    // Count emitted under the field-key style name... same name collides;
    // the array (written after) wins — counts are meaningful with distinct
    // group keys or tag keys:
    const tagged = renderJsonMessage(msg, dict, {
      ...base,
      keyStyle: 'tag',
      groupKey: { alias: { '73': 'orders' } },
      emitCounts: true,
    }) as Record<string, unknown>;
    expect(tagged['73']).toBe('2');
    expect(tagged['orders']).toHaveLength(2);
  });

  it('typed values convert numerics and booleans where the dictionary permits', () => {
    const out = renderJsonMessage(msg, dict, { ...base, typedValues: true }) as Record<
      string,
      unknown
    >;
    expect(out['OrderQty']).toBe(100);
    expect(out['Price']).toBe(25.5);
    expect(out['SliceRandomize']).toBe(true);
    expect(out['SendingTime']).toBe('20260705-12:00:00'); // stays string
    expect(out['9999']).toBe('custom'); // unknown type stays string
  });

  it('omitTags suppresses fields (e.g. header the consumer supplies)', () => {
    const out = renderJsonMessage(msg, dict, { ...base, omitTags: [8, 52] }) as Record<
      string,
      unknown
    >;
    expect(out['BeginString']).toBeUndefined();
    expect(out['SendingTime']).toBeUndefined();
    expect(out['MsgType']).toBe('E');
  });

  it('message envelope and top-level wrapper', () => {
    const cfg: JsonMappingConfig = {
      ...base,
      envelope: {
        message: { target: 'omega-gw', kind: 'order' },
        messageKey: 'payload',
        topLevelKey: 'batch',
      },
    };
    const out = renderJsonBatch([msg, msg], dict, cfg) as Record<string, unknown>;
    const arr = out['batch'] as Record<string, unknown>[];
    expect(arr).toHaveLength(2);
    expect(arr[0]).toMatchObject({ target: 'omega-gw', kind: 'order' });
    expect(arr[0]!['payload']).toMatchObject({ MsgType: 'E' });
  });

  it('renderJsonText emits a stable formatted document', () => {
    const text = renderJsonText([msg], dict, base);
    expect(text).toBe(renderJsonText([msg], dict, base));
    expect(JSON.parse(text)).toHaveLength(1);
  });
});
