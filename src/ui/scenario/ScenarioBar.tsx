import {
  parseScenario,
  scenarioCompatibility,
  serializeScenario,
  SCENARIO_SCHEMA_VERSION,
  type RendererChoice,
  type Scenario,
} from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import type { DerivedBuild } from '../state/derive.ts';
import { downloadText } from '../files/download.ts';
import demoScenarioSlicer from '../../demo/scenarios/slicer-alpha.scenario.json?raw';
import demoScenarioBasket from '../../demo/scenarios/basket-5.scenario.json?raw';
import demoScenarioList from '../../demo/scenarios/list-3.scenario.json?raw';
import demoScenarioSpread from '../../demo/scenarios/calendar-spread.scenario.json?raw';

const DEMO_SCENARIOS: Record<string, string> = {
  'SLICER on Alpha (retarget me)': demoScenarioSlicer,
  'Basket of 5': demoScenarioBasket,
  'Order list (3 rows)': demoScenarioList,
  'Calendar spread (35=AB)': demoScenarioSpread,
};

export function ScenarioBar({ derived }: { derived: DerivedBuild }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { profile, scenarioName } = state;
  if (!profile) return null;

  const currentScenario = (): Scenario => {
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
      name: scenarioName || 'untitled',
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
  };

  const loadScenarioText = (text: string) => {
    const { scenario, issues } = parseScenario(text);
    if (!scenario) return;
    const findings = [
      ...issues.map((i) => ({
        ruleId: 'scenario-load',
        severity: i.severity,
        path: i.path,
        message: i.message,
      })),
      ...scenarioCompatibility(scenario, profile),
    ];
    dispatch({ type: 'apply-scenario', scenario, findings });
  };

  return (
    <section className="panel">
      <div className="panel-header">Scenario</div>
      <div className="panel-body" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          className="input"
          style={{ flex: '1 1 8rem' }}
          placeholder="scenario name"
          value={scenarioName}
          onChange={(e) => dispatch({ type: 'set-scenario-name', name: e.target.value })}
        />
        <button
          className="btn small"
          onClick={() =>
            downloadText(
              `${scenarioName || 'untitled'}.scenario.json`,
              serializeScenario(currentScenario())
            )
          }
        >
          ⬇ Save
        </button>
        <select
          className="input"
          style={{ flex: '1 1 100%' }}
          value=""
          onChange={(e) => {
            const text = DEMO_SCENARIOS[e.target.value];
            if (text) loadScenarioText(text);
          }}
        >
          <option value="">Load a demo scenario…</option>
          {Object.keys(DEMO_SCENARIOS).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <p className="hint" style={{ margin: 0 }}>
          Scenario files also load via the Workspace drop zone.
        </p>
      </div>
    </section>
  );
}
