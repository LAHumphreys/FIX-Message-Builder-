import { describe, expect, it } from 'vitest';
import { compileWorkspace } from './compile.ts';
import { parseProfile } from '../engine/profile/load.ts';
import { parseInstrumentDb } from '../engine/instrument/db.ts';

const j = (v: unknown) => JSON.stringify(v, null, 2);

/** A fixture exercising every piece of sugar in docs/PROFILE-WORKSPACE.md §4. */
function fixture(): Map<string, string> {
  return new Map<string, string>([
    [
      'workspace.json',
      j({
        '//': 'comment keys are stripped',
        name: 'Fixture',
        version: '1.0.0',
        fixVersion: 'FIX.4.4',
        generators: {
          clOrdId: { kind: 'template', template: 'T-{date:yyyyMMdd}-{seq:4}' },
          now: { kind: 'timestamp', precision: 'micros' },
        },
        newOrderTemplate: { '11': { generator: 'clOrdId' }, '21': '1', '60': { generator: 'now' } },
        validationPolicy: { rules: { 'unknown-tag': 'info' } },
        flowOrder: ['limit', 'algo-x'],
      }),
    ],
    [
      'links/east-uat.json',
      j({
        label: 'EAST-UAT',
        session: { '49': 'CLI', '56': 'EAST-GW' },
        convention: 'by-isin',
        clients: {
          luke: {
            label: 'Luke',
            default: true,
            parties: [{ id: 'LUKEH' }],
            account: { default: 'LukeAcc' },
          },
          desk: {
            label: 'Desk',
            parties: [{ id: 'DESK-01', source: 'D', role: '3' }],
            convention: 'by-house',
          },
        },
        routes: {
          dma: { label: 'DMA', default: true, fields: { '21': '1' } },
          care: { label: 'Care', fields: { '21': '3', '58': 'CARE' } },
        },
        enforced: { '20101': 'EAST-UAT-GW' },
        algos: ['algo-x'],
        transportHints: { route: 'east-uat' },
      }),
    ],
    [
      'links/east-dev.json',
      j({
        label: 'EAST-DEV',
        extends: 'east-uat',
        enforced: { '20101': 'EAST-DEV-GW' },
        algos: [],
      }),
    ],
    [
      'flows/limit.json',
      j({
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
      'flows/algo-x.json',
      j({
        label: 'Algo X',
        availability: 'opt-in',
        fields: { '40': '2' },
        params: {
          '7001': {
            name: 'AlgoStyle',
            type: 'INT',
            enum: { '1': 'Fast', '2': 'Slow' },
            slot: { label: 'Style', required: true, default: '1' },
          },
          '7002': { name: 'AlgoWindowMs', type: 'INT', value: '5000' },
        },
        standardSlots: { '38': { label: 'Quantity', type: 'decimal', required: true } },
        ops: [{ op: 'remove', tag: 21 }],
      }),
    ],
    [
      'conventions/by-isin.json',
      j({
        variants: [
          {
            emit: [
              { role: 'securityId', from: { scheme: 'isin' }, required: true },
              { role: 'securityIdSource', from: { literal: '4' } },
            ],
          },
        ],
      }),
    ],
    [
      'conventions/by-house.json',
      j({
        variants: [
          {
            emit: [
              { role: 'securityId', from: { scheme: 'custom:house' }, required: true },
              { role: 'securityIdSource', from: { literal: '8' } },
            ],
          },
        ],
      }),
    ],
    [
      'mappings/gateway.json',
      j({ keyStyle: 'name', groupKey: 'countName', emitCounts: false, typedValues: true }),
    ],
    [
      'instruments/equities.json',
      j({
        defaults: { attrs: { securityType: 'CS', currency: 'XXX' } },
        instruments: [
          {
            key: 'AAA',
            name: 'Aaa Corp',
            schemes: { isin: 'XX0000000001', 'custom:house': 'H-1' },
          },
          {
            key: 'BBB',
            name: 'Bbb Corp',
            schemes: { isin: 'XX0000000002' },
            attrs: { currency: 'YYY' },
          },
        ],
      }),
    ],
    [
      'instruments/more.csv',
      'key,name,scheme:isin,attr:securityType\nCCC,Ccc Corp,XX0000000003,CS\n',
    ],
    [
      'fragments/weird-session.json',
      j({ label: 'Weird', ops: [{ op: 'set', tag: 128, value: 'ONBEHALF' }] }),
    ],
  ]);
}

describe('compileWorkspace', () => {
  const result = compileWorkspace(fixture());

  it('compiles the fixture with zero errors', () => {
    expect(result.issues.filter((i) => i.severity === 'error')).toEqual([]);
    expect(result.profileText).toBeDefined();
    expect(result.instrumentsText).toBeDefined();
  });

  it('the assembled profile loads through the real engine with zero issues', () => {
    const { profile, issues } = parseProfile(result.profileText!);
    expect(issues).toEqual([]);
    expect(profile?.systems.map((s) => s.id)).toEqual(['east-dev', 'east-uat']);
  });

  it('link extends resolves per top-level key (delta model)', () => {
    const { profile } = parseProfile(result.profileText!);
    const dev = profile!.systems.find((s) => s.id === 'east-dev')!;
    const uat = profile!.systems.find((s) => s.id === 'east-uat')!;
    // inherited session (compiled per-link, identical ops), own enforced
    // fragment, algos overridden to []
    const devSession = profile!.fragments[dev.fragments![0]!]!;
    const uatSession = profile!.fragments[uat.fragments![0]!]!;
    expect(devSession.ops).toEqual(uatSession.ops);
    expect(dev.finalFragment).toBe('link:east-dev:final');
    expect(uat.capabilities).toEqual(['algo-x']);
    expect(dev.capabilities).toBeUndefined();
  });

  it('flows compile to dimension options in flowOrder, opt-in gated by capability', () => {
    const { profile } = parseProfile(result.profileText!);
    const flow = profile!.dimensions.find((d) => d.id === 'flow')!;
    expect(flow.options!.map((o) => o.id)).toEqual(['limit', 'algo-x']);
    expect(flow.options![0]!.availableOn).toBeUndefined();
    expect(flow.options![1]!.availableOn).toEqual(['cap:algo-x']);
  });

  it('params feed overlay and fragment from one declaration', () => {
    const { profile } = parseProfile(result.profileText!);
    const overlay = profile!.dictionaryOverlay!.fields!;
    expect(overlay['7001']).toEqual(['AlgoStyle', 'INT', { '1': 'Fast', '2': 'Slow' }]);
    const flowFragment = profile!.fragments['flow:algo-x']!;
    const slotOp = flowFragment.ops.find((o) => o.op === 'slot' && o.tag === 7001);
    const setOp = flowFragment.ops.find((o) => o.op === 'set' && o.tag === 7002);
    const removeOp = flowFragment.ops.find((o) => o.op === 'remove');
    expect(slotOp).toBeDefined();
    expect(setOp).toMatchObject({ value: '5000' });
    expect(removeOp).toMatchObject({ tag: 21 });
  });

  it('clients become a Client dimension with defaults, parties ops and convention override', () => {
    const { profile } = parseProfile(result.profileText!);
    const client = profile!.dimensions.find((d) => d.id === 'client')!;
    expect(client.options!.map((o) => o.id)).toEqual(['desk', 'luke']);
    const luke = client.options!.find((o) => o.id === 'luke')!;
    const desk = client.options!.find((o) => o.id === 'desk')!;
    expect(luke.default).toBe(true);
    expect(desk.convention).toBe('by-house');
    const lukeFragment = profile!.fragments[luke.fragment!]!;
    const group = lukeFragment.ops.find((o) => o.op === 'group');
    expect(group).toMatchObject({ countTag: 453, mode: 'append' });
    expect(lukeFragment.ops.find((o) => o.op === 'slot' && o.tag === 1)).toBeDefined();
  });

  it('routes become a Route dimension with coherent field combinations', () => {
    const { profile } = parseProfile(result.profileText!);
    const route = profile!.dimensions.find((d) => d.id === 'route')!;
    const care = route.options!.find((o) => o.id === 'care')!;
    const ops = profile!.fragments[care.fragment!]!.ops;
    expect(ops).toContainEqual({ op: 'set', tag: 21, value: '3' });
    expect(ops).toContainEqual({ op: 'set', tag: 58, value: 'CARE' });
  });

  it('client/route options shared via extends are gated to both links (no availableOn = all)', () => {
    // both links share the same clients (east-dev extends east-uat), so no gating needed
    const { profile } = parseProfile(result.profileText!);
    const client = profile!.dimensions.find((d) => d.id === 'client')!;
    expect(client.options!.find((o) => o.id === 'luke')!.availableOn).toBeUndefined();
  });

  it('instruments merge across json+csv with file-level defaults applied', () => {
    const { db, issues } = parseInstrumentDb(result.instrumentsText!);
    expect(issues).toEqual([]);
    expect([...db!.instruments.keys()].sort()).toEqual(['AAA', 'BBB', 'CCC']);
    expect(db!.instruments.get('AAA')!.attrs?.currency).toBe('XXX'); // file default
    expect(db!.instruments.get('BBB')!.attrs?.currency).toBe('YYY'); // record wins
  });

  it('is deterministic: same input, byte-identical output', () => {
    const again = compileWorkspace(fixture());
    expect(again.profileText).toBe(result.profileText);
    expect(again.instrumentsText).toBe(result.instrumentsText);
  });

  it('raw fragments are available and referenced fragments resolve', () => {
    const { profile } = parseProfile(result.profileText!);
    expect(profile!.fragments['weird-session']).toBeDefined();
  });
});

describe('compileWorkspace error paths', () => {
  it('a shared client id with divergent config is a build error naming both files', () => {
    const files = fixture();
    const dev = JSON.parse(files.get('links/east-dev.json')!) as Record<string, unknown>;
    delete dev.extends;
    dev.session = { '49': 'CLI', '56': 'DEV-GW' };
    dev.clients = { luke: { label: 'Luke', parties: [{ id: 'SOMEONE-ELSE' }] } };
    files.set('links/east-dev.json', j(dev));
    const result = compileWorkspace(files);
    const errors = result.issues.filter((i) => i.severity === 'error');
    const conflict = errors.find((e) => e.message.includes("client 'luke' differs"));
    expect(conflict).toBeDefined();
    // the error names both files: one as its location, the other in the message
    const both = `${conflict!.file} ${conflict!.message}`;
    expect(both).toContain('links/east-uat.json');
    expect(both).toContain('links/east-dev.json');
  });

  it('an opt-in flow enabled nowhere is a build error with the fix spelled out', () => {
    const files = fixture();
    const uat = JSON.parse(files.get('links/east-uat.json')!) as Record<string, unknown>;
    uat.algos = [];
    files.set('links/east-uat.json', j(uat));
    const result = compileWorkspace(files);
    expect(
      result.issues.some(
        (i) =>
          i.severity === 'error' &&
          i.file === 'flows/algo-x.json' &&
          i.message.includes('enabled on no link')
      )
    ).toBe(true);
  });

  it('a param tag declared differently in two flows is an error naming the first file', () => {
    const files = fixture();
    files.set(
      'flows/algo-y.json',
      j({
        label: 'Algo Y',
        availability: 'everywhere',
        params: { '7001': { name: 'SomethingElse', type: 'QTY', value: '1' } },
      })
    );
    const result = compileWorkspace(files);
    expect(
      result.issues.some(
        (i) =>
          i.severity === 'error' &&
          i.file === 'flows/algo-y.json' &&
          i.message.includes('flows/algo-x.json')
      )
    ).toBe(true);
  });

  it('overrides.profile.json applies as a merge patch and warns per touched path', () => {
    const files = fixture();
    files.set('overrides.profile.json', j({ name: 'Patched Name' }));
    const result = compileWorkspace(files);
    expect(result.issues.filter((i) => i.severity === 'error')).toEqual([]);
    expect(result.overrideTouches).toEqual(['/name']);
    expect(JSON.parse(result.profileText!).name).toBe('Patched Name');
    expect(
      result.issues.some((i) => i.file === 'overrides.profile.json' && i.severity === 'warning')
    ).toBe(true);
  });

  it('unknown keys in entity files warn with a pointer to the spec', () => {
    const files = fixture();
    const uat = JSON.parse(files.get('links/east-uat.json')!) as Record<string, unknown>;
    uat.sesion = { '49': 'TYPO' };
    files.set('links/east-uat.json', j(uat));
    const result = compileWorkspace(files);
    expect(
      result.issues.some(
        (i) => i.severity === 'warning' && i.message.includes("unknown key 'sesion'")
      )
    ).toBe(true);
  });
});
