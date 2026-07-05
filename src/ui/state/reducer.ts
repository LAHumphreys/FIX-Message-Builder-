import { initialState, type Action, type AppState } from './types.ts';

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'profile-loaded': {
      if (!action.profile) {
        return { ...state, profileIssues: action.issues };
      }
      // Fresh workspace state for a new profile; keep UI preferences.
      return {
        ...initialState,
        outputTab: state.outputTab,
        delimiter: state.delimiter,
        omitLengthAndChecksum: state.omitLengthAndChecksum,
        profile: action.profile,
        profileIssues: action.issues,
        systemId: action.profile.systems[0]?.id,
        buildNonce: state.buildNonce + 1,
      };
    }
    case 'dictionary-loaded':
      return { ...state, baseDictionary: action.dictionary };
    case 'select-system':
      // Retargeting (§3.8): keep selections and slot values; anything that
      // no longer resolves surfaces as findings — never silent breakage.
      return { ...state, systemId: action.systemId };
    case 'select-option':
      return {
        ...state,
        selections: { ...state.selections, [action.dimensionId]: action.optionId },
      };
    case 'set-slot':
      return { ...state, slotValues: { ...state.slotValues, [action.tag]: action.value } };
    case 'clear-slot': {
      const next = { ...state.slotValues };
      delete next[action.tag];
      return { ...state, slotValues: next };
    }
    case 'set-output-tab':
      return { ...state, outputTab: action.tab };
    case 'set-delimiter':
      return { ...state, delimiter: action.delimiter };
    case 'set-omit-length-checksum':
      return { ...state, omitLengthAndChecksum: action.omit };
    case 'regenerate':
      return { ...state, buildNonce: state.buildNonce + 1 };
  }
}
