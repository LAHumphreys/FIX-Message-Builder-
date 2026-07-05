import { describe, expect, it } from 'vitest';
import { MemoryWorkspace } from './memory.ts';

describe('WorkspaceProvider contract (memory reference)', () => {
  it('lists by conventional directory', async () => {
    const ws = new MemoryWorkspace();
    await ws.write('scenarios/a.scenario.json', '{}', undefined);
    await ws.write('scenarios/b.scenario.json', '{}', undefined);
    await ws.write('profile/main.profile.json', '{}', undefined);
    const scenarios = await ws.list('scenarios');
    expect(scenarios.map((e) => e.path).sort()).toEqual([
      'scenarios/a.scenario.json',
      'scenarios/b.scenario.json',
    ]);
  });

  it('read returns the token that write reported', async () => {
    const ws = new MemoryWorkspace();
    const write = await ws.write('scenarios/x.json', 'v1', undefined);
    expect(write.ok).toBe(true);
    const file = await ws.read('scenarios/x.json');
    expect(file?.text).toBe('v1');
    expect(file?.modifiedToken).toBe(write.ok ? write.entry.modifiedToken : '');
    expect(await ws.read('nope')).toBeUndefined();
  });

  it('detects external modification and refuses to clobber (§3.9)', async () => {
    const ws = new MemoryWorkspace();
    await ws.write('scenarios/x.json', 'v1', undefined);
    const loaded = await ws.read('scenarios/x.json');

    // External edit (git pull, IDE) bumps the token.
    ws.externallyModify('scenarios/x.json', 'external-change');

    const conflict = await ws.write('scenarios/x.json', 'my-edit', loaded!.modifiedToken);
    expect(conflict).toMatchObject({ ok: false, reason: 'conflict' });
    // The external content survives.
    expect((await ws.read('scenarios/x.json'))?.text).toBe('external-change');

    // Reload -> retry with the fresh token succeeds (the "reload" path).
    const fresh = await ws.read('scenarios/x.json');
    const retry = await ws.write('scenarios/x.json', 'my-edit', fresh!.modifiedToken);
    expect(retry.ok).toBe(true);
  });
});
