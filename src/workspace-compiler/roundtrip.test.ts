/**
 * The W1/W4 acceptance (docs/PROFILE-WORKSPACE.md §7): exploding the demo
 * profile into a workspace and compiling it back must produce the same
 * messages — verified by the golden mechanism (pinned clock/seed), not
 * string equality of the JSON.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { explodeProfile } from './explode.ts';
import { compileWorkspace } from './compile.ts';
import { generateGoldens } from './goldens.ts';
import { parseProfile } from '../engine/profile/load.ts';

const demoProfile = readFileSync('src/demo/demo.profile.json', 'utf8');
const demoInstruments = readFileSync('src/demo/demo.instruments.json', 'utf8');

describe('explode → compile round-trip on the demo profile', () => {
  const exploded = explodeProfile(demoProfile, demoInstruments);
  const compiled = compileWorkspace(exploded.files);

  it('explode produces a workspace with the expected entity files', () => {
    const paths = [...exploded.files.keys()];
    expect(paths).toContain('workspace.json');
    expect(paths).toContain('links/alpha-uat.json');
    expect(paths).toContain('links/omega-legacy.json');
    expect(paths).toContain('flows/slicer.json');
    expect(paths).toContain('conventions/isin-decomposed.json');
    expect(paths).toContain('mappings/omega-gateway.json');
    expect(paths).toContain('instruments/all.json');
  });

  it('the exploded workspace compiles with zero errors', () => {
    expect(compiled.issues.filter((i) => i.severity === 'error')).toEqual([]);
    expect(compiled.profileText).toBeDefined();
  });

  it('the compiled profile loads through the engine with zero issues', () => {
    const { issues } = parseProfile(compiled.profileText!);
    expect(issues).toEqual([]);
  });

  it('golden messages are identical between original and round-tripped profile', async () => {
    const original = await generateGoldens(demoProfile, demoInstruments);
    const rebuilt = await generateGoldens(compiled.profileText!, compiled.instrumentsText);
    expect(original.size).toBeGreaterThan(20); // 3 links × 12 flows
    expect([...rebuilt.keys()].sort()).toEqual([...original.keys()].sort());
    for (const [name, wire] of original) {
      expect(rebuilt.get(name), name).toBe(wire);
    }
  });

  it('exploding a second time is deterministic', () => {
    const again = explodeProfile(demoProfile, demoInstruments);
    expect([...again.files.entries()]).toEqual([...exploded.files.entries()]);
  });
});
