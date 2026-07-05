import { describe, expect, it } from 'vitest';
import { parseCsv, serializeCsv } from './csv.ts';
import { parseInstrumentDb, parseInstrumentDbCsv, parseInstrumentDbJson } from './db.ts';
import { buildSearchIndex } from './search.ts';
import { resolveIdentity, type IdentityConvention } from './convention.ts';
import { placeIdentity, PLACEMENTS } from './placement.ts';

const dbJson = JSON.stringify({
  schemaVersion: 1,
  instruments: [
    {
      key: 'MERBANK',
      name: 'Meridian Bank',
      schemes: { isin: 'ZZ0000000012', exchangeSymbol: 'MERB', 'custom:omega': 'OMG-1201' },
      attrs: { securityType: 'CS', currency: 'ZZD', mic: 'XMER' },
    },
    {
      key: 'NIMBUS',
      name: 'Nimbus Retail',
      schemes: { isin: 'ZZ0000000045', exchangeSymbol: 'NIMB' },
      attrs: { securityType: 'CS', currency: 'ZZD', mic: 'XMER' },
    },
    {
      key: 'FCOR-U6',
      name: 'Corium Future Sep26',
      schemes: { exchangeSymbol: 'FCORU6', 'custom:omega': 'OMG-FCOR-U6' },
      attrs: { securityType: 'FUT', maturityMonthYear: '202609', contractMultiplier: '10' },
    },
    {
      key: 'MERBANK-C25',
      name: 'Meridian Bank Sep26 25 Call',
      schemes: { 'custom:omega': 'OMG-MERB-C-25-U6' },
      attrs: {
        securityType: 'OPT',
        maturityMonthYear: '202609',
        strikePrice: '25',
        putOrCall: '1',
        underlying: 'MERBANK',
      },
    },
  ],
  strategies: [
    {
      key: 'FCOR-CAL',
      name: 'Corium Calendar U6Z6',
      strategyType: 'CS',
      schemes: { 'custom:omega': 'OMG-FCOR-CAL-U6Z6' },
      attrs: { securityType: 'MLEG' },
      legs: [
        { instrument: 'FCOR-U6', ratioQty: '1', side: '1' },
        { instrument: 'FCOR-Z6', ratioQty: '1', side: '2' },
      ],
    },
  ],
});

describe('instrument DB JSON', () => {
  const { db, issues } = parseInstrumentDbJson(dbJson);

  it('loads records, strategies, and preserves order', () => {
    expect(db?.instrumentOrder).toEqual(['MERBANK', 'NIMBUS', 'FCOR-U6', 'MERBANK-C25']);
    expect(db?.instruments.get('MERBANK')?.schemes['custom:omega']).toBe('OMG-1201');
    expect(db?.strategies.get('FCOR-CAL')?.legs).toHaveLength(2);
  });

  it('warns on unknown leg instrument references', () => {
    expect(issues).toMatchObject([{ severity: 'warning', path: '/strategies/0/legs/1' }]);
  });

  it.each([
    { label: 'not json', text: 'nope', path: '' },
    { label: 'no instruments array', text: '{}', path: '' },
    { label: 'missing key', text: '{"instruments":[{"name":"x"}]}', path: '/instruments/0' },
  ])('reports $label', ({ text, path }) => {
    const result = parseInstrumentDbJson(text);
    expect(result.issues.some((i) => i.severity === 'error' && i.path === path)).toBe(true);
  });
});

describe('instrument DB CSV', () => {
  const csv = [
    'key,name,scheme:isin,scheme:exchangeSymbol,attr:securityType,attr:currency',
    'MERBANK,Meridian Bank,ZZ0000000012,MERB,CS,ZZD',
    'QUOTED,"Has, comma ""quoted""",ZZ0000000078,QTD,CS,ZZD',
  ].join('\n');

  it('parses prefix-mapped columns', () => {
    const { db, issues } = parseInstrumentDbCsv(csv);
    expect(issues).toEqual([]);
    expect(db?.instruments.get('MERBANK')).toMatchObject({
      name: 'Meridian Bank',
      schemes: { isin: 'ZZ0000000012', exchangeSymbol: 'MERB' },
      attrs: { securityType: 'CS', currency: 'ZZD' },
    });
    expect(db?.instruments.get('QUOTED')?.name).toBe('Has, comma "quoted"');
    expect(db?.csvColumns).toEqual([
      'key',
      'name',
      'scheme:isin',
      'scheme:exchangeSymbol',
      'attr:securityType',
      'attr:currency',
    ]);
  });

  it('round-trips cells through serializeCsv/parseCsv', () => {
    const rows = [
      ['a', 'plain'],
      ['b', 'comma, quote " newline\nend'],
    ];
    expect(parseCsv(serializeCsv(rows))).toEqual(rows);
  });

  it('auto-detects JSON vs CSV', () => {
    expect(parseInstrumentDb(dbJson).db?.instruments.size).toBe(4);
    expect(parseInstrumentDb(csv).db?.instruments.size).toBe(2);
  });
});

describe('search index', () => {
  const { db } = parseInstrumentDbJson(dbJson);
  const index = buildSearchIndex(db!);

  it.each([
    { q: 'merb', firstKey: 'MERBANK' },
    { q: 'nimbus', firstKey: 'NIMBUS' },
    { q: 'OMG-FCOR', firstKey: 'FCOR-U6' },
    { q: 'calendar', firstKey: 'FCOR-CAL' },
  ])("finds '$q' -> $firstKey", ({ q, firstKey }) => {
    expect(index.search(q)[0]?.key).toBe(firstKey);
  });

  it('empty query lists everything up to the cap; misses return empty', () => {
    expect(index.search('')).toHaveLength(5);
    expect(index.search('zzzzzz')).toEqual([]);
  });

  it('stays responsive on a 10k-row synthetic DB', () => {
    const rows = Array.from({ length: 10000 }, (_, i) => ({
      key: `SYN-${i}`,
      name: `Synthetic Instrument ${i}`,
      schemes: { isin: `ZZ${String(i).padStart(10, '0')}`, exchangeSymbol: `SY${i}` },
      attrs: { securityType: 'CS' },
    }));
    const big = parseInstrumentDbJson(JSON.stringify({ instruments: rows })).db!;
    const bigIndex = buildSearchIndex(big);
    const t0 = performance.now();
    for (let i = 0; i < 20; i++) {
      bigIndex.search('synthetic instrument 43');
      bigIndex.search('SY99');
      bigIndex.search('zz00000012');
    }
    const perQuery = (performance.now() - t0) / 60;
    expect(bigIndex.size).toBe(10000);
    expect(perQuery).toBeLessThan(20); // ms per query, generous CI margin
  });
});

const isinDecomposed: IdentityConvention = {
  variants: [
    {
      when: { securityType: ['OPT'] },
      emit: [
        { role: 'symbol', from: { scheme: 'exchangeSymbol' }, required: true },
        { role: 'securityType', from: { attr: 'securityType' } },
        { role: 'maturityMonthYear', from: { attr: 'maturityMonthYear' }, required: true },
        { role: 'strikePrice', from: { attr: 'strikePrice' }, required: true },
        { role: 'putOrCall', from: { attr: 'putOrCall' }, required: true },
      ],
    },
    {
      emit: [
        { role: 'securityId', from: { scheme: 'isin' }, required: true },
        { role: 'securityIdSource', from: { literal: '4' } },
        { role: 'symbol', from: { firstOf: [{ scheme: 'exchangeSymbol' }, { scheme: 'isin' }] } },
        { role: 'securityExchange', from: { attr: 'mic' } },
        { role: 'securityType', from: { attr: 'securityType' } },
      ],
      altIds: [{ from: { scheme: 'exchangeSymbol' }, sourceCode: '8' }],
    },
  ],
};

const houseComposed: IdentityConvention = {
  variants: [
    {
      emit: [
        { role: 'securityId', from: { scheme: 'custom:omega' }, required: true },
        { role: 'securityIdSource', from: { literal: '8' } },
        {
          role: 'symbol',
          from: { firstOf: [{ scheme: 'custom:omega' }, { scheme: 'exchangeSymbol' }] },
        },
      ],
    },
  ],
};

describe('identity conventions', () => {
  const { db } = parseInstrumentDbJson(dbJson);
  const merbank = db!.instruments.get('MERBANK')!;
  const nimbus = db!.instruments.get('NIMBUS')!;
  const option = db!.instruments.get('MERBANK-C25')!;

  it('resolves scheme/attr/literal/firstOf sources', () => {
    const identity = resolveIdentity(merbank, isinDecomposed, 'FIX.4.4');
    expect(Object.fromEntries(identity.values)).toEqual({
      securityId: 'ZZ0000000012',
      securityIdSource: '4',
      symbol: 'MERB',
      securityExchange: 'XMER',
      securityType: 'CS',
    });
    expect(identity.altIds).toEqual([{ id: 'MERB', sourceCode: '8' }]);
    expect(identity.missing).toEqual([]);
  });

  it('selects security-type variants: option gets decomposed 200/201/202 roles', () => {
    const identity = resolveIdentity(option, isinDecomposed, 'FIX.4.4');
    expect(identity.values.get('strikePrice')).toBe('25');
    expect(identity.values.get('putOrCall')).toBe('1');
    // Option record has no exchangeSymbol -> required symbol is missing.
    expect(identity.missing).toMatchObject([{ role: 'symbol', required: true }]);
  });

  it('same record, different convention: composed house code', () => {
    const identity = resolveIdentity(option, houseComposed, 'FIX.4.4');
    expect(identity.values.get('securityId')).toBe('OMG-MERB-C-25-U6');
    expect(identity.values.get('maturityMonthYear')).toBeUndefined(); // composed mode
  });

  it('reports missing identifiers without blocking (NIMBUS lacks custom:omega)', () => {
    const identity = resolveIdentity(nimbus, houseComposed, 'FIX.4.4');
    expect(identity.missing).toMatchObject([{ role: 'securityId', required: true }]);
    expect(identity.values.get('symbol')).toBe('NIMB'); // fallback chain still works
  });
});

describe('placement contexts', () => {
  const { db } = parseInstrumentDbJson(dbJson);
  const future = db!.instruments.get('FCOR-U6')!;
  const nimbus = db!.instruments.get('NIMBUS')!;

  it('places the instrument context with alt-ID group', () => {
    const placed = placeIdentity(
      db!.instruments.get('MERBANK')!,
      isinDecomposed,
      'instrument',
      'FIX.4.4'
    );
    const setOps = placed.ops.filter((o) => o.op === 'set');
    expect(Object.fromEntries(setOps.map((o) => [o.tag, o.op === 'set' ? o.value : '']))).toEqual({
      '48': 'ZZ0000000012',
      '22': '4',
      '55': 'MERB',
      '207': 'XMER',
      '167': 'CS',
    });
    const groupOp = placed.ops.find((o) => o.op === 'group');
    expect(groupOp).toMatchObject({ countTag: 454 });
  });

  it('mirror invariant: leg block equals tag-translated instrument block', () => {
    const conventionUsed = houseComposed;
    const inst = placeIdentity(future, conventionUsed, 'instrument', 'FIX.4.4');
    const leg = placeIdentity(future, conventionUsed, 'leg', 'FIX.4.4');

    const instRoles = PLACEMENTS.instrument.roles;
    const legRoles = PLACEMENTS.leg.roles;
    const tagTranslation = new Map<number, number>();
    for (const [role, instTag] of Object.entries(instRoles)) {
      const legTag = legRoles[role as keyof typeof legRoles];
      if (legTag !== undefined) tagTranslation.set(instTag, legTag);
    }

    const instSets = inst.ops.filter((o) => o.op === 'set');
    const legSets = leg.ops.filter((o) => o.op === 'set');
    expect(legSets.length).toBe(instSets.length);
    for (const op of instSets) {
      if (op.op !== 'set') continue;
      const translated = tagTranslation.get(op.tag)!;
      const legOp = legSets.find((l) => l.op === 'set' && l.tag === translated);
      expect(legOp && legOp.op === 'set' && legOp.value).toBe(op.value);
    }
  });

  it('underlying context uses the 300-series family', () => {
    const placed = placeIdentity(future, houseComposed, 'underlying', 'FIX.4.4');
    const tags = placed.ops.filter((o) => o.op === 'set').map((o) => o.tag);
    expect(tags).toContain(309); // UnderlyingSecurityID
    expect(tags).toContain(305); // UnderlyingSecurityIDSource
  });

  it('missing identifiers become findings, ops still emitted for what resolves', () => {
    const placed = placeIdentity(nimbus, houseComposed, 'instrument', 'FIX.4.4');
    expect(placed.findings).toMatchObject([
      { ruleId: 'instrument-missing-identifier', severity: 'warning' },
    ]);
    expect(placed.ops.some((o) => o.op === 'set' && o.tag === 55)).toBe(true);
  });
});
