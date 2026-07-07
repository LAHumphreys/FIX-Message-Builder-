import { describe, expect, it } from 'vitest';
import { scaffold } from './init.ts';
import { compileWorkspace } from './compile.ts';
import { parseProfile } from '../engine/profile/load.ts';
import { lintWorkspace } from './report.ts';
import { parseInstrumentDb } from '../engine/instrument/db.ts';

describe('fixb init scaffold', () => {
  const compiled = compileWorkspace(scaffold());

  it('builds with zero errors and zero warnings out of the box', () => {
    expect(compiled.issues).toEqual([]);
  });

  it('loads through the engine cleanly and lints clean', () => {
    const { profile, issues } = parseProfile(compiled.profileText!);
    expect(issues).toEqual([]);
    const db = parseInstrumentDb(compiled.instrumentsText!).db;
    expect(lintWorkspace(compiled, profile, db)).toEqual([]);
  });
});
