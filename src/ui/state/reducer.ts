import type { BatchRow } from '../../engine/index.ts';
import { initialState, type Action, type AppState } from './types.ts';

function updateRow(
  rows: readonly BatchRow[],
  index: number,
  patch: { instrument?: string; slotValues?: Readonly<Record<string, string>> }
): readonly BatchRow[] {
  return rows.map((row, i) => {
    if (i !== index) return row;
    const instrument = patch.instrument === '' ? undefined : (patch.instrument ?? row.instrument);
    const slotValues = { ...row.slotValues, ...patch.slotValues };
    for (const key of Object.keys(slotValues)) {
      if (slotValues[key] === '') delete slotValues[key];
    }
    return {
      ...(instrument !== undefined ? { instrument } : {}),
      slotValues,
    };
  });
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'profile-loaded': {
      if (!action.profile) {
        return { ...state, profileIssues: action.issues };
      }
      // Fresh workspace state for a new profile; keep UI preferences and
      // any already-loaded instrument DB.
      return {
        ...initialState,
        outputTab: state.outputTab,
        delimiter: state.delimiter,
        omitLengthAndChecksum: state.omitLengthAndChecksum,
        instrumentDb: state.instrumentDb,
        instrumentDbIssues: state.instrumentDbIssues,
        hostOrigin: state.hostOrigin,
        transportLog: state.transportLog,
        profile: action.profile,
        profileIssues: action.issues,
        systemId: action.profile.systems[0]?.id,
        jsonMapping: Object.keys(action.profile.renderers?.json ?? {})[0],
        buildNonce: state.buildNonce + 1,
      };
    }
    case 'dictionary-loaded':
      return { ...state, baseDictionary: action.dictionary };
    case 'instruments-loaded':
      return action.db
        ? { ...state, instrumentDb: action.db, instrumentDbIssues: action.issues }
        : { ...state, instrumentDbIssues: action.issues };
    case 'set-fix-version':
      // Dictionary reloads via the AppProvider effect; build re-derives.
      return { ...state, fixVersion: action.fixVersion, baseDictionary: undefined };
    case 'select-system':
      // Retargeting (§3.8): keep selections and slot values; anything that
      // no longer resolves surfaces as findings — never silent breakage.
      return { ...state, systemId: action.systemId };
    case 'select-option':
      return {
        ...state,
        mode: 'auto',
        selections: { ...state.selections, [action.dimensionId]: action.optionId },
      };
    case 'set-slot':
      return { ...state, slotValues: { ...state.slotValues, [action.tag]: action.value } };
    case 'clear-slot': {
      const next = { ...state.slotValues };
      delete next[action.tag];
      return { ...state, slotValues: next };
    }
    case 'set-mode':
      return { ...state, mode: action.mode };
    case 'row-add':
      return { ...state, rows: [...state.rows, { slotValues: {} }] };
    case 'row-duplicate': {
      const source = state.rows[action.index];
      if (!source) return state;
      const rows = [...state.rows];
      rows.splice(action.index + 1, 0, { ...source, slotValues: { ...source.slotValues } });
      return { ...state, rows };
    }
    case 'row-remove':
      return { ...state, rows: state.rows.filter((_, i) => i !== action.index) };
    case 'row-update':
      return {
        ...state,
        rows: updateRow(state.rows, action.index, {
          ...(action.instrument !== undefined ? { instrument: action.instrument } : {}),
          ...(action.slotValues !== undefined ? { slotValues: action.slotValues } : {}),
        }),
      };
    case 'leg-override': {
      const legOverrides = [...state.legOverrides];
      while (legOverrides.length <= action.index) legOverrides.push({});
      legOverrides[action.index] = { ...legOverrides[action.index], ...action.patch };
      return { ...state, legOverrides };
    }
    case 'set-output-tab':
      return { ...state, outputTab: action.tab };
    case 'set-delimiter':
      return { ...state, delimiter: action.delimiter };
    case 'set-omit-length-checksum':
      return { ...state, omitLengthAndChecksum: action.omit };
    case 'set-json-mapping':
      return { ...state, jsonMapping: action.mapping };
    case 'set-scenario-name':
      return { ...state, scenarioName: action.name };
    case 'host-connected':
      return state.hostOrigin === action.origin ? state : { ...state, hostOrigin: action.origin };
    case 'transport-sent':
      return {
        ...state,
        transportLog: [
          {
            id: action.id,
            summary: action.summary,
            sentAt: action.sentAt,
            state: 'pending' as const,
          },
          ...state.transportLog,
        ].slice(0, 50),
      };
    case 'transport-response':
      return {
        ...state,
        transportLog: state.transportLog.map((entry) =>
          entry.id === action.id
            ? {
                ...entry,
                state: action.ok ? ('ok' as const) : ('error' as const),
                ...(action.status !== undefined ? { status: action.status } : {}),
                ...(action.body !== undefined ? { body: action.body } : {}),
                ...(action.error !== undefined ? { error: action.error } : {}),
                ...(action.timingMs !== undefined ? { timingMs: action.timingMs } : {}),
              }
            : entry
        ),
      };
    case 'transport-clear':
      return { ...state, transportLog: [] };
    case 'apply-scenario': {
      const s = action.scenario;
      return {
        ...state,
        systemId: s.systemId || state.systemId,
        fixVersion: s.fixVersion,
        selections: s.selections,
        slotValues: s.slotValues,
        mode: s.mode,
        rows: s.rows ?? initialState.rows,
        legOverrides: s.legOverrides ?? [],
        scenarioName: s.name,
        scenarioFindings: action.findings,
        ...(s.renderer.kind === 'tagvalue'
          ? {
              outputTab: 'raw' as const,
              delimiter: s.renderer.delimiter,
              omitLengthAndChecksum: s.renderer.omitLengthAndChecksum ?? false,
            }
          : s.renderer.kind === 'json'
            ? { outputTab: 'json' as const, jsonMapping: s.renderer.mapping }
            : { outputTab: 'annotated' as const }),
        buildNonce: state.buildNonce + 1,
      };
    }
    case 'regenerate':
      return { ...state, buildNonce: state.buildNonce + 1 };
  }
}
