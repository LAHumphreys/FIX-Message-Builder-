import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  parseScenario,
  scenarioCompatibility,
  serializeScenario,
  type Scenario,
} from './scenario.ts';
import { canonicalStringify } from '../serialize/canonicalJson.ts';
import { parseProfile } from '../profile/load.ts';

const minimalProfile = parseProfile(
  JSON.stringify({
    schemaVersion: 1,
    name: 'Meridian Demo',
    version: '0.3.0',
    fixVersion: 'FIX.4.4',
    fragments: {},
    systems: [{ id: 'alpha-uat', label: 'ALPHA-UAT' }],
    dimensions: [],
  })
).profile!;

const stringDict = fc.dictionary(
  fc.stringMatching(/^[a-zA-Z0-9_-]{1,12}$/),
  fc.stringMatching(/^[ -~]{0,20}$/),
  { maxKeys: 5 }
);

const scenarioArb: fc.Arbitrary<Scenario> = fc
  .record({
    name: fc.stringMatching(/^[ -~]{1,30}$/),
    profileName: fc.stringMatching(/^[ -~]{1,20}$/),
    profileVersion: fc.stringMatching(/^[0-9.]{1,8}$/),
    fixVersion: fc.constantFrom('FIX.4.2', 'FIX.4.4', 'FIX.5.0SP2' as const),
    mode: fc.constantFrom('single', 'batch', 'list', 'multileg' as const),
    systemId: fc.stringMatching(/^[a-z-]{1,15}$/),
    selections: stringDict,
    slotValues: stringDict,
    rows: fc.array(
      fc.record({
        instrument: fc.option(fc.stringMatching(/^[A-Z0-9-]{1,10}$/), { nil: undefined }),
        slotValues: stringDict,
      }),
      { maxLength: 4 }
    ),
    delimiter: fc.constantFrom('soh', 'pipe', 'caretA' as const),
  })
  .map(
    ({
      name,
      profileName,
      profileVersion,
      fixVersion,
      mode,
      systemId,
      selections,
      slotValues,
      rows,
      delimiter,
    }) => ({
      schemaVersion: 1,
      name,
      profile: { name: profileName, version: profileVersion },
      fixVersion,
      mode,
      systemId,
      selections,
      slotValues,
      rows: rows.map((r) =>
        r.instrument === undefined ? { slotValues: r.slotValues } : (r as never)
      ),
      renderer: { kind: 'tagvalue' as const, delimiter },
    })
  );

describe('scenario round-trips (property-based)', () => {
  it('serialize -> parse -> deep-equal', () => {
    fc.assert(
      fc.property(scenarioArb, (scenario) => {
        const text = serializeScenario(scenario);
        const { scenario: back, issues } = parseScenario(text);
        expect(issues).toEqual([]);
        expect(back).toEqual(scenario);
      }),
      { numRuns: 200 }
    );
  });

  it('canonical serialization is byte-stable (same input, same bytes)', () => {
    fc.assert(
      fc.property(scenarioArb, (scenario) => {
        expect(serializeScenario(scenario)).toBe(serializeScenario({ ...scenario }));
      }),
      { numRuns: 50 }
    );
  });
});

describe('unknown-key preservation (§3.9)', () => {
  it('keeps unknown top-level keys through a round-trip', () => {
    const text = canonicalStringify({
      schemaVersion: 1,
      name: 'x',
      profile: { name: 'P', version: '1' },
      fixVersion: 'FIX.4.4',
      mode: 'single',
      systemId: 's',
      selections: {},
      slotValues: {},
      renderer: { kind: 'annotated' },
      futureFeatureConfig: { keep: ['me', 'intact'] },
      comment: 'user annotation',
    });
    const { scenario } = parseScenario(text);
    expect(scenario?.extra).toEqual({
      futureFeatureConfig: { keep: ['me', 'intact'] },
      comment: 'user annotation',
    });
    const reserialized = serializeScenario(scenario!);
    expect(reserialized).toBe(text);
  });
});

describe('parseScenario diagnostics', () => {
  it.each([
    { label: 'not JSON', text: '{{{', severity: 'error' },
    { label: 'not an object', text: '[1]', severity: 'error' },
    { label: 'missing schemaVersion', text: '{"profile":{"name":"p"}}', severity: 'error' },
    { label: 'missing profile ref', text: '{"schemaVersion":1}', severity: 'error' },
  ])('$label', ({ text, severity }) => {
    const result = parseScenario(text);
    expect(result.scenario).toBeUndefined();
    expect(result.issues.some((i) => i.severity === severity)).toBe(true);
  });

  it('newer schemaVersion loads best-effort with a warning', () => {
    const result = parseScenario(
      JSON.stringify({ schemaVersion: 99, profile: { name: 'P', version: '1' } })
    );
    expect(result.scenario).toBeDefined();
    expect(result.issues).toMatchObject([{ severity: 'warning' }]);
  });
});

describe('scenarioCompatibility', () => {
  const base: Scenario = {
    schemaVersion: 1,
    name: 's',
    profile: { name: 'Meridian Demo', version: '0.3.0' },
    fixVersion: 'FIX.4.4',
    mode: 'single',
    systemId: 'alpha-uat',
    selections: {},
    slotValues: {},
    renderer: { kind: 'annotated' },
  };

  it.each([
    { label: 'exact match -> clean', scenario: base, rules: [] },
    {
      label: 'different profile name -> warning',
      scenario: { ...base, profile: { name: 'Other', version: '1' } },
      rules: ['scenario-profile-mismatch'],
    },
    {
      label: 'different version -> info',
      scenario: { ...base, profile: { name: 'Meridian Demo', version: '0.1.0' } },
      rules: ['scenario-profile-version'],
    },
    {
      label: 'unknown system -> warning',
      scenario: { ...base, systemId: 'ghost' },
      rules: ['scenario-system-unknown'],
    },
  ])('$label', ({ scenario, rules }) => {
    const findings = scenarioCompatibility(scenario, minimalProfile);
    expect(findings.map((f) => f.ruleId)).toEqual(rules);
  });
});
