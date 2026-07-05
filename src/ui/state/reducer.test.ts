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

  it('profile-loaded keeps the loaded dictionary (regression: reloading a profile bricked the builder)', () => {
    // The dictionary-reload effect only fires when the FIX version changes,
    // so profile-loaded must not discard an already-loaded dictionary.
    const dictionary = { version: 'FIX.4.4' } as never;
    let s = reducer(initialState, { type: 'profile-loaded', profile, issues });
    s = reducer(s, { type: 'dictionary-loaded', dictionary });
    const reloaded = reducer(s, { type: 'profile-loaded', profile, issues });
    expect(reloaded.baseDictionary).toBe(dictionary);
  });

  it('dictionary error surfaces and clears on a later successful load', () => {
    const s = reducer(initialState, { type: 'dictionary-error', message: 'chunk 404' });
    expect(s.dictionaryError).toBe('chunk 404');
    const loaded = reducer(s, {
      type: 'dictionary-loaded',
      dictionary: { version: 'FIX.4.4' } as never,
    });
    expect(loaded.dictionaryError).toBeUndefined();
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

  it('transport lifecycle: connect, send, respond, clear', () => {
    let s = reducer(initialState, { type: 'host-connected', origin: 'https://intranet.example' });
    expect(s.hostOrigin).toBe('https://intranet.example');
    s = reducer(s, { type: 'transport-sent', id: 'r1', summary: '1 × 35=D → UAT', sentAt: 123 });
    expect(s.transportLog).toMatchObject([{ id: 'r1', state: 'pending' }]);
    s = reducer(s, {
      type: 'transport-response',
      id: 'r1',
      ok: true,
      status: 202,
      body: { ack: true },
      timingMs: 41,
    });
    expect(s.transportLog).toMatchObject([
      { id: 'r1', state: 'ok', status: 202, body: { ack: true }, timingMs: 41 },
    ]);
    const failed = reducer(s, { type: 'transport-response', id: 'nope', ok: false });
    expect(failed.transportLog).toEqual(s.transportLog); // unknown ids ignored
    expect(reducer(s, { type: 'transport-clear' }).transportLog).toEqual([]);
  });

  it('regenerate bumps the build nonce only', () => {
    const next = reducer(initialState, { type: 'regenerate' });
    expect(next.buildNonce).toBe(initialState.buildNonce + 1);
    expect({ ...next, buildNonce: initialState.buildNonce }).toEqual(initialState);
  });
});
