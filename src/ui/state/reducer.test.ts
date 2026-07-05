import { describe, expect, it } from 'vitest';
import { reducer } from './reducer.ts';
import { initialState } from './types.ts';
import { parseProfile } from '../../engine/index.ts';
import demoProfileText from '../../demo/demo.profile.json?raw';

const { profile, issues } = parseProfile(demoProfileText);

describe('reducer', () => {
  it('demo profile parses cleanly', () => {
    expect(issues).toEqual([]);
    expect(profile?.systems.map((s) => s.id)).toEqual(['alpha-uat', 'alpha-dev', 'omega-legacy']);
  });

  it('profile-loaded resets workspace, keeps UI prefs, selects first system', () => {
    const prior = {
      ...initialState,
      delimiter: 'soh' as const,
      slotValues: { '38': '5' },
      buildNonce: 4,
    };
    const next = reducer(prior, { type: 'profile-loaded', profile, issues });
    expect(next.systemId).toBe('alpha-uat');
    expect(next.slotValues).toEqual({});
    expect(next.delimiter).toBe('soh');
    expect(next.buildNonce).toBe(5);
  });

  it('select-system keeps selections and slot values (retargeting)', () => {
    const loaded = reducer(initialState, { type: 'profile-loaded', profile, issues });
    const chosen = reducer(loaded, {
      type: 'select-option',
      dimensionId: 'flow',
      optionId: 'slicer',
    });
    const filled = reducer(chosen, { type: 'set-slot', tag: 38, value: '100' });
    const retargeted = reducer(filled, { type: 'select-system', systemId: 'alpha-dev' });
    expect(retargeted.selections).toEqual({ flow: 'slicer' });
    expect(retargeted.slotValues).toEqual({ '38': '100' });
  });

  it('set-slot and clear-slot round-trip', () => {
    const set = reducer(initialState, { type: 'set-slot', tag: 44, value: '9.5' });
    expect(set.slotValues).toEqual({ '44': '9.5' });
    const cleared = reducer(set, { type: 'clear-slot', tag: 44 });
    expect(cleared.slotValues).toEqual({});
  });

  it('regenerate bumps the build nonce only', () => {
    const next = reducer(initialState, { type: 'regenerate' });
    expect(next.buildNonce).toBe(initialState.buildNonce + 1);
    expect({ ...next, buildNonce: initialState.buildNonce }).toEqual(initialState);
  });
});
