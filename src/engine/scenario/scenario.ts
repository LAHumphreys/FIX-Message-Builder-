/**
 * Scenarios (brief §3.8): the full serialized builder state — the
 * replacement for a library of static message files. Round-trips
 * losslessly; unknown keys are preserved (§3.9).
 */
import type { FixVersionId } from '../dictionary/types.ts';
import type { BuildMode, Profile } from '../profile/types.ts';
import type { TagValueDelimiter } from '../render/tagvalue.ts';
import type { Finding } from '../validation/types.ts';
import type { BatchRow, LegOverride } from '../build/group.ts';
import { canonicalStringify } from '../serialize/canonicalJson.ts';

export const SCENARIO_SCHEMA_VERSION = 1;

export type RendererChoice =
  | {
      readonly kind: 'tagvalue';
      readonly delimiter: TagValueDelimiter;
      readonly omitLengthAndChecksum?: boolean;
    }
  | { readonly kind: 'json'; readonly mapping: string }
  | { readonly kind: 'annotated' };

export interface Scenario {
  readonly schemaVersion: number;
  readonly name: string;
  /** Reference by name/version — the profile is never embedded. */
  readonly profile: { readonly name: string; readonly version: string };
  readonly fixVersion: FixVersionId;
  readonly mode: BuildMode;
  readonly systemId: string;
  readonly selections: Readonly<Record<string, string>>;
  readonly slotValues: Readonly<Record<string, string>>;
  readonly rows?: readonly BatchRow[];
  readonly legOverrides?: readonly LegOverride[];
  readonly renderer: RendererChoice;
  /** Unknown keys from the source file, preserved for round-trip fidelity. */
  readonly extra?: Readonly<Record<string, unknown>>;
}

const KNOWN_KEYS = new Set([
  'schemaVersion',
  'name',
  'profile',
  'fixVersion',
  'mode',
  'systemId',
  'selections',
  'slotValues',
  'rows',
  'legOverrides',
  'renderer',
]);

export interface ScenarioLoadResult {
  readonly scenario?: Scenario;
  readonly issues: readonly { severity: 'error' | 'warning'; path: string; message: string }[];
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function parseScenario(text: string): ScenarioLoadResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return { issues: [{ severity: 'error', path: '', message: `not valid JSON: ${String(e)}` }] };
  }
  if (!isRecord(raw)) {
    return { issues: [{ severity: 'error', path: '', message: 'scenario must be a JSON object' }] };
  }
  const issues: { severity: 'error' | 'warning'; path: string; message: string }[] = [];
  if (typeof raw.schemaVersion !== 'number') {
    issues.push({ severity: 'error', path: '/schemaVersion', message: 'missing schemaVersion' });
  } else if (raw.schemaVersion > SCENARIO_SCHEMA_VERSION) {
    issues.push({
      severity: 'warning',
      path: '/schemaVersion',
      message: `scenario schemaVersion ${raw.schemaVersion} is newer than supported ${SCENARIO_SCHEMA_VERSION}; loading best-effort`,
    });
  }
  if (!isRecord(raw.profile) || typeof raw.profile.name !== 'string') {
    issues.push({ severity: 'error', path: '/profile', message: 'missing profile reference' });
  }
  if (issues.some((i) => i.severity === 'error')) return { issues };

  const extra: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!KNOWN_KEYS.has(key)) extra[key] = value;
  }

  const mode: BuildMode = ['single', 'batch', 'list', 'multileg'].includes(raw.mode as string)
    ? (raw.mode as BuildMode)
    : 'single';

  const scenario: Scenario = {
    schemaVersion: raw.schemaVersion as number,
    name: typeof raw.name === 'string' ? raw.name : 'untitled',
    profile: {
      name: (raw.profile as { name: string }).name,
      version: String((raw.profile as { version?: unknown }).version ?? ''),
    },
    fixVersion: (raw.fixVersion as FixVersionId) ?? 'FIX.4.4',
    mode,
    systemId: typeof raw.systemId === 'string' ? raw.systemId : '',
    selections: isRecord(raw.selections) ? (raw.selections as Record<string, string>) : {},
    slotValues: isRecord(raw.slotValues) ? (raw.slotValues as Record<string, string>) : {},
    ...(Array.isArray(raw.rows) ? { rows: raw.rows as BatchRow[] } : {}),
    ...(Array.isArray(raw.legOverrides) ? { legOverrides: raw.legOverrides as LegOverride[] } : {}),
    renderer: isRecord(raw.renderer)
      ? (raw.renderer as unknown as RendererChoice)
      : { kind: 'annotated' },
    ...(Object.keys(extra).length > 0 ? { extra } : {}),
  };
  return { scenario, issues };
}

/** Canonical serialization; unknown keys merge back at the top level. */
export function serializeScenario(scenario: Scenario): string {
  const { extra, ...known } = scenario;
  return canonicalStringify({ ...known, ...extra });
}

/**
 * Compatibility check against the loaded profile (§3.9): mismatches warn
 * and apply best-effort; unresolvable selections surface via the normal
 * build findings when the scenario is applied.
 */
export function scenarioCompatibility(scenario: Scenario, profile: Profile): Finding[] {
  const findings: Finding[] = [];
  if (scenario.profile.name !== profile.name) {
    findings.push({
      ruleId: 'scenario-profile-mismatch',
      severity: 'warning',
      path: '',
      message: `Scenario was saved against profile '${scenario.profile.name}' but '${profile.name}' is loaded; applying best-effort`,
    });
  } else if (scenario.profile.version !== profile.version) {
    findings.push({
      ruleId: 'scenario-profile-version',
      severity: 'info',
      path: '',
      message: `Scenario was saved against ${scenario.profile.name} v${scenario.profile.version}; v${profile.version} is loaded`,
    });
  }
  if (!profile.systems.some((s) => s.id === scenario.systemId)) {
    findings.push({
      ruleId: 'scenario-system-unknown',
      severity: 'warning',
      path: '',
      message: `Scenario targets system '${scenario.systemId}' which this profile does not declare`,
    });
  }
  return findings;
}
