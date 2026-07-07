/**
 * `fixb init` scaffold: a commented, working starter workspace. Every file
 * demonstrates the common case and points at the next rung ("//" keys are
 * stripped at build).
 */
export function scaffold(): Map<string, string> {
  const j = (v: unknown) => JSON.stringify(v, null, 2) + '\n';
  return new Map<string, string>([
    [
      'workspace.json',
      j({
        '//': 'Manifest — profile-wide facts. docs/PROFILE-WORKSPACE.md §4.1',
        name: 'RENAME ME',
        version: '0.1.0',
        fixVersion: 'FIX.4.4',
        generators: {
          clOrdId: { kind: 'template', template: 'TEST-{date:yyyyMMdd}-{seq:4}' },
          now: { kind: 'timestamp', precision: 'micros' },
        },
        '// newOrderTemplate':
          'base fields on every 35=D; values are strings or {"generator": "…"}',
        newOrderTemplate: {
          '11': { generator: 'clOrdId' },
          '21': '1',
          '60': { generator: 'now' },
        },
        goldens: false,
      }),
    ],
    [
      'links/example-uat.json',
      j({
        '//': 'One file per FIX link. §4.2 — clients/routes become dropdowns.',
        label: 'EXAMPLE-UAT',
        session: { '49': 'RENAME-SENDER', '56': 'RENAME-TARGET' },
        client: {
          '//': 'singular client = no dropdown; rename to "clients": {id: {...}} for a selector',
          parties: [{ id: 'RENAME-CLIENT-CODE' }],
          account: { default: 'RENAME-ACC' },
        },
        enforced: { '//': 'finalFragment tags nothing can override', '20101': 'RENAME-GW' },
        convention: 'default',
        algos: ['example-algo'],
        transportHints: { '//': 'opaque routing data handed to the internal host page' },
      }),
    ],
    [
      'flows/limit.json',
      j({
        '//': 'A plain flow: available everywhere. §4.3',
        label: 'Limit',
        fields: { '40': '2' },
        standardSlots: {
          '54': {
            label: 'Side',
            type: 'enum',
            enumSource: { kind: 'dictionary' },
            required: true,
            default: '1',
          },
          '38': { label: 'Quantity', type: 'decimal', required: true },
          '44': { label: 'Limit price', type: 'decimal' },
        },
      }),
    ],
    [
      'flows/example-algo.json',
      j({
        '//': 'An algo: opt-in per link (add "example-algo" to a link\'s "algos").',
        '// params': 'one entry declares the tag AND its form field — cannot desync',
        label: 'Example algo',
        availability: 'opt-in',
        fields: { '40': '2' },
        params: {
          '7001': {
            name: 'ExampleStyle',
            type: 'INT',
            enum: { '1': 'Gentle', '2': 'Aggressive' },
            slot: { label: 'Style', required: true, default: '1' },
          },
          '7002': { name: 'ExampleWindowMs', type: 'INT', value: '5000' },
        },
        standardSlots: { '38': { label: 'Quantity', type: 'decimal', required: true } },
      }),
    ],
    [
      'conventions/default.json',
      j({
        '//': 'Instrument identity (verbatim authoring-guide §10). Reference from links via "convention".',
        variants: [
          {
            emit: [
              { role: 'securityId', from: { scheme: 'isin' }, required: true },
              { role: 'securityIdSource', from: { literal: '4' } },
              {
                role: 'symbol',
                from: { firstOf: [{ scheme: 'exchangeSymbol' }, { scheme: 'isin' }] },
              },
            ],
          },
        ],
      }),
    ],
    [
      'mappings/default.json',
      j({
        '//': 'JSON output mapping (verbatim authoring-guide §11).',
        keyStyle: 'name',
        groupKey: 'countName',
        emitCounts: false,
        typedValues: true,
      }),
    ],
    [
      'instruments/starter.json',
      j({
        '//': 'Instrument records; "defaults" apply to every record in this file. CSV files work too.',
        defaults: { attrs: { securityType: 'CS' } },
        instruments: [
          {
            key: 'RENAME-1',
            name: 'Rename Me Corp',
            schemes: { isin: 'XX0000000001', exchangeSymbol: 'RNM1' },
          },
        ],
      }),
    ],
  ]);
}
