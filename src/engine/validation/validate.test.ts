import { describe, expect, it } from 'vitest';
import { validateMessage } from './validate.ts';
import { resolveSeverity } from './policy.ts';
import { field, group } from '../message/builders.ts';
import type { FixMessage, Provenance } from '../message/types.ts';
import { dictionaryFromJson, type DictionaryJson } from '../dictionary/json.ts';
import type { ValidationPolicy } from '../profile/types.ts';

const src: Provenance = { sourceId: 'flow:limit', sourceLabel: 'Flow: Limit' };

const dictJson: DictionaryJson = {
  fix: 'FIX.4.4',
  formatVersion: 1,
  partial: false,
  fields: {
    '8': ['BeginString', 'STRING'],
    '9': ['BodyLength', 'LENGTH'],
    '10': ['CheckSum', 'STRING'],
    '35': ['MsgType', 'STRING'],
    '49': ['SenderCompID', 'STRING'],
    '11': ['ClOrdID', 'STRING'],
    '38': ['OrderQty', 'QTY'],
    '40': ['OrdType', 'CHAR', { '1': 'Market', '2': 'Limit' }],
    '54': ['Side', 'CHAR', { '1': 'Buy', '2': 'Sell' }],
    '59': ['TimeInForce', 'CHAR', { '0': 'Day' }],
    '60': ['TransactTime', 'UTCTIMESTAMP'],
    '73': ['NoOrders', 'NUMINGROUP'],
    '67': ['ListSeqNo', 'INT'],
    '21': ['HandlInst', 'CHAR'],
  },
  components: {},
  header: [
    [8, 1],
    [9, 1],
    [35, 1],
    [49, 1],
  ],
  trailer: [[10, 1]],
  messages: {
    D: { name: 'NewOrderSingle', items: [[11, 1], [54, 1], [38], [40], [59], [60]] },
    E: {
      name: 'NewOrderList',
      items: [{ g: 73, req: 1, items: [[11, 1], [67], [54]] }],
    },
  },
};
const dict = dictionaryFromJson(dictJson, 'FIX.4.4');

function msgD(fields: FixMessage['fields']): FixMessage {
  return { beginString: 'FIX.4.4', msgType: 'D', fields };
}

describe('required-missing', () => {
  it.each([
    {
      label: 'missing required body field flags',
      fields: [field(11, 'X', src)],
      expectTags: [54, 49],
    },
    {
      label: 'all required present -> no findings',
      fields: [field(11, 'X', src), field(54, '1', src), field(49, 'ME', src)],
      expectTags: [],
    },
  ])('$label', ({ fields, expectTags }) => {
    const findings = validateMessage(msgD(fields), dict).filter(
      (f) => f.ruleId === 'required-missing'
    );
    expect(findings.map((f) => f.tag).sort()).toEqual(expectTags.sort());
    // 8/9/35/10 are synthesized by the renderer — never reported missing.
    expect(findings.some((f) => [8, 9, 10, 35].includes(f.tag!))).toBe(false);
  });

  it('flags missing required fields inside group entries', () => {
    const msg: FixMessage = {
      beginString: 'FIX.4.4',
      msgType: 'E',
      fields: [group(73, [[field(67, '1', src)]], src), field(49, 'ME', src)],
    };
    const findings = validateMessage(msg, dict).filter((f) => f.ruleId === 'required-missing');
    expect(findings).toMatchObject([{ tag: 11, path: '73[0]' }]);
  });
});

describe('unknown-tag', () => {
  it.each([
    { label: 'custom tag not in dictionary', fields: [field(20101, 'GW', src)], count: 1 },
    { label: 'known tags only', fields: [field(11, 'X', src)], count: 0 },
  ])('$label', ({ fields, count }) => {
    const findings = validateMessage(
      msgD([field(54, '1', src), field(49, 'ME', src), ...fields]),
      dict
    ).filter((f) => f.ruleId === 'unknown-tag');
    expect(findings).toHaveLength(count);
  });

  it('flags unknown message types at message level', () => {
    const msg: FixMessage = { beginString: 'FIX.4.4', msgType: 'ZZ', fields: [] };
    const findings = validateMessage(msg, dict).filter((f) => f.ruleId === 'unknown-tag');
    expect(findings).toMatchObject([{ tag: 35, path: '' }]);
  });
});

describe('enum-unknown and type-mismatch', () => {
  const base = [field(11, 'X', src), field(49, 'ME', src)];

  it.each([
    {
      label: 'enum value off-dictionary',
      extra: field(54, '9', src),
      rule: 'enum-unknown',
      count: 1,
    },
    { label: 'enum value valid', extra: field(54, '2', src), rule: 'enum-unknown', count: 0 },
    {
      label: 'QTY not numeric',
      extra: [field(54, '1', src), field(38, 'lots', src)],
      rule: 'type-mismatch',
      count: 1,
    },
    {
      label: 'QTY decimal ok',
      extra: [field(54, '1', src), field(38, '10.5', src)],
      rule: 'type-mismatch',
      count: 0,
    },
    {
      label: 'timestamp malformed',
      extra: [field(54, '1', src), field(60, 'yesterday', src)],
      rule: 'type-mismatch',
      count: 1,
    },
    {
      label: 'timestamp with micros ok',
      extra: [field(54, '1', src), field(60, '20260705-09:30:15.123000', src)],
      rule: 'type-mismatch',
      count: 0,
    },
  ])('$label', ({ extra, rule, count }) => {
    const fields = [...base, ...(Array.isArray(extra) ? extra : [extra])];
    const findings = validateMessage(msgD(fields), dict).filter((f) => f.ruleId === rule);
    expect(findings).toHaveLength(count);
    if (count > 0) {
      expect(findings[0]!.provenance?.sourceId).toBe('flow:limit');
    }
  });
});

describe('group rules', () => {
  it('explicit count contradicting entry count is an error by default', () => {
    const msg: FixMessage = {
      beginString: 'FIX.4.4',
      msgType: 'E',
      fields: [
        field(49, 'ME', src),
        field(73, '5', src),
        group(73, [[field(11, 'A', src)], [field(11, 'B', src)]], src),
      ],
    };
    const findings = validateMessage(msg, dict).filter((f) => f.ruleId === 'group-count-mismatch');
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe('error');
  });

  it('count field with no group entries is a mismatch', () => {
    const msg = msgD([field(54, '1', src), field(49, 'ME', src), field(73, '3', src)]);
    expect(
      validateMessage(msg, dict).filter((f) => f.ruleId === 'group-count-mismatch')
    ).toHaveLength(1);
  });

  it.each([
    {
      label: 'entry not starting with delimiter',
      entry: [field(67, '1', src), field(11, 'A', src)],
      count: 1,
    },
    {
      label: 'entry fields out of dictionary order',
      entry: [field(11, 'A', src), field(54, '1', src), field(67, '2', src)],
      count: 1,
    },
    {
      label: 'well-ordered entry',
      entry: [field(11, 'A', src), field(67, '1', src), field(54, '1', src)],
      count: 0,
    },
  ])('group-field-order: $label', ({ entry, count }) => {
    const msg: FixMessage = {
      beginString: 'FIX.4.4',
      msgType: 'E',
      fields: [field(49, 'ME', src), group(73, [entry], src)],
    };
    expect(validateMessage(msg, dict).filter((f) => f.ruleId === 'group-field-order')).toHaveLength(
      count
    );
  });
});

describe('conditional-required (GTD expiry)', () => {
  const base = [field(11, 'X', src), field(49, 'ME', src), field(54, '1', src)];

  it.each([
    { label: 'TIF=6 with no expiry triggers', extra: [field(59, '6', src)], count: 1 },
    {
      label: 'TIF=6 with ExpireDate(432) is satisfied',
      extra: [field(59, '6', src), field(432, '20261230', src)],
      count: 0,
    },
    {
      label: 'TIF=6 with ExpireTime(126) is satisfied',
      extra: [field(59, '6', src), field(126, '20261230-16:30:00', src)],
      count: 0,
    },
    { label: 'other TIF values do not trigger', extra: [field(59, '0', src)], count: 0 },
  ])('$label', ({ extra, count }) => {
    const findings = validateMessage(msgD([...base, ...extra]), dict).filter(
      (f) => f.ruleId === 'conditional-required'
    );
    expect(findings).toHaveLength(count);
    if (count > 0) {
      expect(findings[0]).toMatchObject({ tag: 59, severity: 'warning' });
      expect(findings[0]!.message).toContain('ExpireDate(432)');
    }
  });

  it('is remappable like any other rule', () => {
    const fields = [...base, field(59, '6', src)];
    const muted = validateMessage(msgD(fields), dict, [
      { rules: { 'conditional-required': 'off' } },
    ]).filter((f) => f.ruleId === 'conditional-required');
    expect(muted).toHaveLength(0);
  });
});

describe('duplicate-tag and header-trailer-order', () => {
  it('flags duplicate simple tags at one level', () => {
    const msg = msgD([field(54, '1', src), field(49, 'ME', src), field(54, '2', src)]);
    const findings = validateMessage(msg, dict).filter((f) => f.ruleId === 'duplicate-tag');
    expect(findings).toMatchObject([{ tag: 54, path: '54#1' }]);
  });

  it('does not flag the same tag in different group entries', () => {
    const msg: FixMessage = {
      beginString: 'FIX.4.4',
      msgType: 'E',
      fields: [
        field(49, 'ME', src),
        group(73, [[field(11, 'A', src)], [field(11, 'B', src)]], src),
      ],
    };
    expect(validateMessage(msg, dict).filter((f) => f.ruleId === 'duplicate-tag')).toHaveLength(0);
  });

  it('does not flag top-level composition order (the renderer reorders it)', () => {
    const msg = msgD([field(11, 'X', src), field(54, '1', src), field(49, 'ME', src)]);
    expect(validateMessage(msg, dict).filter((f) => f.ruleId === 'header-trailer-order')).toEqual(
      []
    );
  });

  it('flags header/trailer tags nested inside group entries', () => {
    const msg: FixMessage = {
      beginString: 'FIX.4.4',
      msgType: 'E',
      fields: [
        field(49, 'ME', src),
        group(73, [[field(11, 'A', src), field(49, 'SNEAKY', src)]], src),
      ],
    };
    const findings = validateMessage(msg, dict).filter((f) => f.ruleId === 'header-trailer-order');
    expect(findings).toMatchObject([{ tag: 49, path: '73[0]/49' }]);
  });
});

describe('policy resolution', () => {
  const profilePolicy: ValidationPolicy = {
    rules: { 'enum-unknown': 'info' },
    overrides: [{ rule: 'enum-unknown', tag: 59, severity: 'off' }],
  };
  const systemPolicy: ValidationPolicy = {
    overrides: [{ rule: 'enum-unknown', msgType: 'D', tag: 54, severity: 'error' }],
  };

  it.each([
    { chain: [], tag: 54, expected: 'warning' },
    { chain: [profilePolicy], tag: 54, expected: 'info' },
    { chain: [profilePolicy], tag: 59, expected: 'off' },
    { chain: [profilePolicy, systemPolicy], tag: 54, expected: 'error' },
    { chain: [profilePolicy, systemPolicy], tag: 59, expected: 'off' },
  ] as const)('chain depth $chain.length tag $tag -> $expected', ({ chain, tag, expected }) => {
    expect(resolveSeverity(chain, 'enum-unknown', 'D', tag)).toBe(expected);
  });

  it('muted rules produce no findings; remap changes severity', () => {
    const fields = [
      field(11, 'X', src),
      field(49, 'ME', src),
      field(54, '9', src),
      field(59, 'X', src),
    ];
    const none = validateMessage(msgD(fields), dict, [{ rules: { 'enum-unknown': 'off' } }]).filter(
      (f) => f.ruleId === 'enum-unknown'
    );
    expect(none).toHaveLength(0);

    const remapped = validateMessage(msgD(fields), dict, [profilePolicy]).filter(
      (f) => f.ruleId === 'enum-unknown'
    );
    // 54 -> info (global remap), 59 -> muted (tag override)
    expect(remapped).toMatchObject([{ tag: 54, severity: 'info' }]);
  });

  it('default severities: standards violations warn, internal contradictions error', () => {
    expect(resolveSeverity([], 'required-missing')).toBe('warning');
    expect(resolveSeverity([], 'group-count-mismatch')).toBe('error');
  });
});
