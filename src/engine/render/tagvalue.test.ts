import { describe, expect, it } from 'vitest';
import { checkSum, byteLength, encodeBytes, SOH } from './checksum.ts';
import { flattenFields, renderTagValue } from './tagvalue.ts';
import { field, group } from '../message/builders.ts';
import type { FixMessage, Provenance } from '../message/types.ts';
import { dictionaryFromJson, type DictionaryJson } from '../dictionary/json.ts';

const src: Provenance = { sourceId: 'test', sourceLabel: 'Test' };

const dictJson: DictionaryJson = {
  fix: 'FIX.4.4',
  formatVersion: 1,
  partial: false,
  fields: {
    '8': ['BeginString', 'STRING'],
    '9': ['BodyLength', 'LENGTH'],
    '10': ['CheckSum', 'STRING'],
    '34': ['MsgSeqNum', 'SEQNUM'],
    '35': ['MsgType', 'STRING'],
    '49': ['SenderCompID', 'STRING'],
    '52': ['SendingTime', 'UTCTIMESTAMP'],
    '56': ['TargetCompID', 'STRING'],
    '11': ['ClOrdID', 'STRING'],
    '38': ['OrderQty', 'QTY'],
    '40': ['OrdType', 'CHAR'],
    '54': ['Side', 'CHAR'],
    '55': ['Symbol', 'STRING'],
    '60': ['TransactTime', 'UTCTIMESTAMP'],
    '73': ['NoOrders', 'NUMINGROUP'],
    '108': ['HeartBtInt', 'INT'],
  },
  components: {},
  header: [
    [8, 1],
    [9, 1],
    [35, 1],
    [49, 1],
    [56, 1],
    [34, 1],
    [52, 1],
  ],
  trailer: [[10, 1]],
  messages: {
    D: { name: 'NewOrderSingle', items: [[11, 1], [55, 1], [54, 1], [60, 1], [40, 1], [38]] },
    A: { name: 'Logon', items: [[108, 1]] },
  },
};

const dict = dictionaryFromJson(dictJson, 'FIX.4.4');

/**
 * Known-answer vectors. External agreement is the point: these byte strings
 * were transcribed verbatim from the QuickFIX-Go test suite
 * (github.com/quickfixgo/quickfix, message_test.go) — a reference
 * implementation's expected serializer output — and independently verified
 * arithmetically before adoption.
 */
describe('checkSum / byteLength known-answer vectors', () => {
  it.each([
    {
      label: 'quickfix-go FIX.4.0 NewOrderSingle (9=81, 10=250)',
      wire: '8=FIX.4.0\x019=81\x0135=D\x0111=id\x0121=3\x0138=100\x0140=1\x0154=1\x0155=MSFT\x0134=2\x0149=TW\x0152=20140521-22:07:09\x0156=ISLD\x0110=250\x01',
    },
    {
      label: 'quickfix-go FIX.4.4 Logon expectedBytes (9=49, 10=072)',
      wire: '8=FIX.4.4\x019=49\x0135=A\x0152=20140615-19:49:56\x01553=my_user\x01554=secret\x0110=072\x01',
    },
    {
      label: 'quickfix-go FIX.4.2 resend NewOrderSingle expectedBytes (9=131, 10=122)',
      wire: '8=FIX.4.2\x019=131\x0135=D\x0134=2\x0143=Y\x0149=TW\x0152=20140615-19:49:56\x0156=ISLD\x01122=20140515-19:49:56.659\x0111=100\x0121=1\x0140=1\x0154=1\x0155=TSLA\x0160=00010101-00:00:00.000\x0110=122\x01',
    },
  ])('$label', ({ wire }) => {
    const stated9 = /\x019=(\d+)\x01/.exec(wire)![1]!;
    const stated10 = /10=(\d{3})\x01$/.exec(wire)![1]!;
    const afterNine = wire.slice(
      wire.indexOf(`9=${stated9}${SOH}`) + `9=${stated9}${SOH}`.length,
      wire.indexOf('10=')
    );
    expect(String(byteLength(afterNine))).toBe(stated9);
    expect(checkSum(wire.slice(0, wire.indexOf('10=')))).toBe(stated10);
  });
});

describe('renderTagValue', () => {
  const order: FixMessage = {
    beginString: 'FIX.4.4',
    msgType: 'D',
    fields: [
      field(49, 'SENDER', src),
      field(56, 'TARGET', src),
      field(34, '1', src),
      field(52, '20260705-12:00:00.000000', src),
      field(11, 'ORD-1', src),
      field(55, 'DEMO', src),
      field(54, '1', src),
      field(60, '20260705-12:00:00.000000', src),
      field(40, '2', src),
      field(38, '100', src),
    ],
  };

  it('orders header 8,9,35 first and trailer 10 last, with self-consistent 9 and 10', () => {
    const wire = renderTagValue(order, dict, { delimiter: 'soh' });
    expect(wire.startsWith(`8=FIX.4.4${SOH}9=`)).toBe(true);
    expect(wire).toMatch(/\x0110=\d{3}\x01$/);

    const tags = wire
      .split(SOH)
      .filter(Boolean)
      .map((p) => Number(p.split('=')[0]));
    expect(tags.slice(0, 3)).toEqual([8, 9, 35]);
    expect(tags.slice(3, 7)).toEqual([49, 56, 34, 52]); // dictionary header order
    expect(tags[tags.length - 1]).toBe(10);

    // Self-consistency: recompute 9 and 10 from the rendered bytes.
    const nine = /9=(\d+)\x01/.exec(wire)![1];
    const afterNine = wire.slice(wire.indexOf(`9=${nine}${SOH}`) + `9=${nine}${SOH}`.length);
    const beforeTen = afterNine.slice(0, afterNine.indexOf('10='));
    expect(String(byteLength(beforeTen))).toBe(nine);
    const upToTen = wire.slice(0, wire.indexOf('10='));
    expect(wire).toContain(`10=${checkSum(upToTen)}`);
  });

  it.each([
    { delimiter: 'pipe', sep: '|' },
    { delimiter: 'caretA', sep: '^A' },
  ] as const)('renders identical content with $delimiter delimiter', ({ delimiter, sep }) => {
    const soh = renderTagValue(order, dict, { delimiter: 'soh' });
    const other = renderTagValue(order, dict, { delimiter });
    expect(other).toBe(soh.split(SOH).join(sep));
    // Checksum identical: computed over SOH bytes regardless of display.
    expect(/10=(\d{3})/.exec(other)![1]).toBe(/10=(\d{3})\x01$/.exec(soh)![1]);
  });

  it('omits 9 and 10 when requested', () => {
    const wire = renderTagValue(order, dict, { delimiter: 'pipe', omitLengthAndChecksum: true });
    const tags = wire
      .split('|')
      .filter(Boolean)
      .map((p) => p.split('=')[0]);
    expect(tags).not.toContain('9');
    expect(tags).not.toContain('10');
    expect(wire.startsWith('8=FIX.4.4|35=D|')).toBe(true);
  });

  it.each([
    { tag: 9, value: '9999', pattern: /\|9=9999\|/ },
    { tag: 10, value: '000', pattern: /\|10=000\|$/ },
    { tag: 8, value: 'FIX.9.9', pattern: /^8=FIX\.9\.9\|/ },
    { tag: 35, value: 'ZZ', pattern: /\|35=ZZ\|/ },
  ])(
    'lets an explicit $tag override the computed value (negative testing)',
    ({ tag, value, pattern }) => {
      const malformed: FixMessage = {
        ...order,
        fields: [field(tag, value, src), ...order.fields],
      };
      const wire = renderTagValue(malformed, dict, { delimiter: 'pipe' });
      expect(wire).toMatch(pattern);
    }
  );

  it('renders groups as count followed by flattened entries', () => {
    const list: FixMessage = {
      beginString: 'FIX.4.4',
      msgType: 'E',
      fields: [
        group(
          73,
          [
            [field(11, 'A', src), field(38, '10', src)],
            [field(11, 'B', src), field(38, '20', src)],
          ],
          src
        ),
      ],
    };
    const wire = renderTagValue(list, dict, { delimiter: 'pipe', omitLengthAndChecksum: true });
    expect(wire).toBe('8=FIX.4.4|35=E|73=2|11=A|38=10|11=B|38=20|');
  });

  it('renders unknown message types and unknown tags without complaint', () => {
    const weird: FixMessage = {
      beginString: 'FIX.4.4',
      msgType: 'ZZ',
      fields: [field(99999, 'x', src)],
    };
    const wire = renderTagValue(weird, dict, { delimiter: 'pipe', omitLengthAndChecksum: true });
    expect(wire).toBe('8=FIX.4.4|35=ZZ|99999=x|');
  });
});

describe('flattenFields', () => {
  it('flattens nested groups depth-first with counts', () => {
    const fields = [
      group(73, [[field(11, 'A', src), group(454, [[field(455, 'X', src)]], src)]], src),
    ];
    expect(flattenFields(fields)).toEqual([
      { tag: 73, value: '1' },
      { tag: 11, value: 'A' },
      { tag: 454, value: '1' },
      { tag: 455, value: 'X' },
    ]);
  });
});

describe('encodeBytes (hand-rolled UTF-8 for the Node 10 CLI floor)', () => {
  it.each([
    ['ascii wire', '8=FIX.4.4\x0135=D\x01'],
    ['latin-1 range', 'café £9.50'],
    ['multibyte + 4-byte astral', 'ümlaut — 東京 𝄞'],
    ['empty', ''],
  ])('matches TextEncoder byte-for-byte: %s', (_name, s) => {
    expect([...encodeBytes(s)]).toEqual([...new TextEncoder().encode(s)]);
  });

  it('encodes a lone surrogate as U+FFFD, matching TextEncoder', () => {
    const lone = 'a\ud800b';
    expect([...encodeBytes(lone)]).toEqual([...new TextEncoder().encode(lone)]);
  });
});
