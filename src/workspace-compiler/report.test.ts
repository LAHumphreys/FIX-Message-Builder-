import { describe, expect, it } from 'vitest';
import { compileWorkspace } from './compile.ts';
import { buildReport, lintWorkspace } from './report.ts';
import { parseProfile } from '../engine/profile/load.ts';
import { parseInstrumentDb } from '../engine/instrument/db.ts';

const j = (v: unknown) => JSON.stringify(v);

function smallWorkspace(): Map<string, string> {
  return new Map<string, string>([
    ['workspace.json', j({ name: 'R', version: '1', fixVersion: 'FIX.4.4' })],
    [
      'links/a.json',
      j({ label: 'A', session: { '49': 'X', '56': 'A-GW' }, convention: 'conv', algos: ['algo'] }),
    ],
    ['links/b.json', j({ label: 'B', session: { '49': 'X', '56': 'B-GW' } })],
    ['flows/limit.json', j({ label: 'Limit', fields: { '40': '2' } })],
    ['flows/algo.json', j({ label: 'Algo', availability: 'opt-in', fields: { '40': '2' } })],
    [
      'conventions/conv.json',
      j({
        variants: [{ emit: [{ role: 'securityId', from: { scheme: 'isin' }, required: true }] }],
      }),
    ],
    [
      'conventions/orphan.json',
      j({ variants: [{ emit: [{ role: 'symbol', from: { scheme: 'ric' } }] }] }),
    ],
    ['fragments/unused.json', j({ label: 'unused', ops: [] })],
    [
      'instruments/i.json',
      j({
        instruments: [
          { key: 'OK', schemes: { isin: 'XX1' } },
          { key: 'NOISIN', schemes: {} },
        ],
      }),
    ],
  ]);
}

describe('lint + report', () => {
  const compiled = compileWorkspace(smallWorkspace());
  const profile = parseProfile(compiled.profileText!).profile;
  const db = parseInstrumentDb(compiled.instrumentsText!).db;
  const lint = lintWorkspace(compiled, profile, db);
  const report = buildReport(compiled, lint);

  it('compiles clean', () => {
    expect(compiled.issues.filter((i) => i.severity === 'error')).toEqual([]);
  });

  it('lint flags orphan conventions, unused fragments and missing schemes', () => {
    const messages = lint.map((i) => i.message);
    expect(messages.some((m) => m.includes("convention 'orphan' is not referenced"))).toBe(true);
    expect(messages.some((m) => m.includes("fragment 'unused' is never referenced"))).toBe(true);
    expect(messages.some((m) => m.includes("lack scheme 'isin'") && m.includes('NOISIN'))).toBe(
      true
    );
  });

  it('report contains the flow×link matrix with opt-in gating', () => {
    expect(report).toContain('## Flows × links');
    // limit is everywhere; algo only on A
    expect(report).toMatch(/\| limit \| ✓ \| ✓ \|/);
    expect(report).toMatch(/\| algo \| ✓ \| — \|/);
  });

  it('report lists per-link summaries with source files', () => {
    expect(report).toContain('`links/a.json`');
    expect(report).toContain('convention: conv');
  });

  it('report carries lint warnings', () => {
    expect(report).toContain('## Warnings');
    expect(report).toContain("convention 'orphan'");
  });
});
