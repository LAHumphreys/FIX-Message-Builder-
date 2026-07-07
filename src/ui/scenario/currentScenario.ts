import { SCENARIO_SCHEMA_VERSION, type RendererChoice, type Scenario } from '../../engine/index.ts';
import type { AppState } from '../state/types.ts';
import type { DerivedBuild } from '../state/derive.ts';

/** Snapshot the builder state as a scenario (shared by download + workspace save). */
export function currentScenario(state: AppState, derived: DerivedBuild): Scenario {
  const profile = state.profile!;
  const renderer: RendererChoice =
    state.outputTab === 'raw'
      ? {
          kind: 'tagvalue',
          delimiter: state.delimiter,
          ...(state.omitLengthAndChecksum ? { omitLengthAndChecksum: true } : {}),
        }
      : state.outputTab === 'json' && state.jsonMapping
        ? { kind: 'json', mapping: state.jsonMapping }
        : { kind: 'annotated' };
  return {
    schemaVersion: SCENARIO_SCHEMA_VERSION,
    name: state.scenarioName || 'untitled',
    profile: { name: profile.name, version: profile.version },
    fixVersion: state.fixVersion === 'profile' ? profile.fixVersion : state.fixVersion,
    mode: derived.mode,
    systemId: state.systemId ?? '',
    selections: state.selections,
    slotValues: state.slotValues,
    ...(derived.mode === 'batch' || derived.mode === 'list' ? { rows: state.rows } : {}),
    ...(derived.mode === 'multileg' && state.legOverrides.length > 0
      ? { legOverrides: state.legOverrides }
      : {}),
    renderer,
  };
}
