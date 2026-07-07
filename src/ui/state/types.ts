import type {
  BatchRow,
  BuildMode,
  FixVersionId,
  Dictionary,
  Finding,
  InstrumentDb,
  InstrumentDbIssue,
  LegOverride,
  Profile,
  ProfileIssue,
  Scenario,
  TagValueDelimiter,
} from '../../engine/index.ts';

export type OutputTab = 'annotated' | 'raw' | 'json';

/** Attached File System Access workspace (§3.9 Tier 1) — display state
 *  only; the provider object lives outside the reducer. */
export interface WorkspaceState {
  readonly name: string;
  readonly scenarios: readonly { readonly path: string; readonly modifiedToken: string }[];
  /** Origin of the currently loaded scenario, for in-place save + dirty checks. */
  readonly loadedScenarioPath?: string;
  readonly loadedScenarioToken?: string;
  /** The loaded scenario's file changed externally (focus rescan). */
  readonly changedOnDisk?: boolean;
  /** Instruments file backing the in-app editor, when the workspace has one. */
  readonly instrumentsPath?: string;
  readonly instrumentsToken?: string;
}

export interface TransportEntry {
  readonly id: string;
  readonly summary: string;
  readonly sentAt: number;
  readonly state: 'pending' | 'ok' | 'error';
  readonly status?: number | string;
  readonly body?: unknown;
  readonly error?: string;
  readonly timingMs?: number;
}

export interface AppState {
  readonly profile: Profile | undefined;
  readonly profileIssues: readonly ProfileIssue[];
  readonly instrumentDb: InstrumentDb | undefined;
  readonly instrumentDbIssues: readonly InstrumentDbIssue[];
  /** Base dictionary for the active FIX version (loaded async). */
  readonly baseDictionary: Dictionary | undefined;
  /** Set when the async dictionary load failed (e.g. stale cached bundle
   *  requesting a chunk that a newer deploy has replaced). */
  readonly dictionaryError: string | undefined;
  readonly systemId: string | undefined;
  /** 'profile' follows the profile's declared default. */
  readonly fixVersion: FixVersionId | 'profile';
  /** dimensionId → optionId (or instrument key for instrument dimensions). */
  readonly selections: Readonly<Record<string, string>>;
  /** tag → user-entered value (single mode; shared defaults in group modes). */
  readonly slotValues: Readonly<Record<string, string>>;
  /** 'auto' follows the selected flow option's first declared mode. */
  readonly mode: BuildMode | 'auto';
  readonly rows: readonly BatchRow[];
  readonly legOverrides: readonly LegOverride[];
  readonly outputTab: OutputTab;
  readonly delimiter: TagValueDelimiter;
  readonly omitLengthAndChecksum: boolean;
  /** Selected JSON mapping name (profile.renderers.json key). */
  readonly jsonMapping: string | undefined;
  readonly scenarioName: string;
  readonly scenarioFindings: readonly Finding[];
  /** Origin of the embedding host page, once its first message arrives. */
  readonly hostOrigin: string | undefined;
  readonly transportLog: readonly TransportEntry[];
  /** Bumped by "Regenerate": reseeds generators and refreshes timestamps. */
  readonly buildNonce: number;
  readonly workspace: WorkspaceState | undefined;
}

export type Action =
  | {
      readonly type: 'profile-loaded';
      readonly profile: Profile | undefined;
      readonly issues: readonly ProfileIssue[];
    }
  | { readonly type: 'dictionary-loaded'; readonly dictionary: Dictionary }
  | { readonly type: 'dictionary-error'; readonly message: string }
  | {
      readonly type: 'instruments-loaded';
      readonly db: InstrumentDb | undefined;
      readonly issues: readonly InstrumentDbIssue[];
    }
  | { readonly type: 'select-system'; readonly systemId: string }
  | { readonly type: 'set-fix-version'; readonly fixVersion: FixVersionId | 'profile' }
  | { readonly type: 'select-option'; readonly dimensionId: string; readonly optionId: string }
  | { readonly type: 'set-slot'; readonly tag: number; readonly value: string }
  | { readonly type: 'clear-slot'; readonly tag: number }
  | { readonly type: 'set-mode'; readonly mode: BuildMode | 'auto' }
  | { readonly type: 'row-add' }
  | { readonly type: 'row-duplicate'; readonly index: number }
  | { readonly type: 'row-remove'; readonly index: number }
  | {
      readonly type: 'row-update';
      readonly index: number;
      readonly instrument?: string;
      readonly slotValues?: Readonly<Record<string, string>>;
    }
  | { readonly type: 'leg-override'; readonly index: number; readonly patch: LegOverride }
  | { readonly type: 'set-output-tab'; readonly tab: OutputTab }
  | { readonly type: 'set-delimiter'; readonly delimiter: TagValueDelimiter }
  | { readonly type: 'set-omit-length-checksum'; readonly omit: boolean }
  | { readonly type: 'set-json-mapping'; readonly mapping: string }
  | { readonly type: 'set-scenario-name'; readonly name: string }
  | { readonly type: 'host-connected'; readonly origin: string }
  | {
      readonly type: 'transport-sent';
      readonly id: string;
      readonly summary: string;
      readonly sentAt: number;
    }
  | {
      readonly type: 'transport-response';
      readonly id: string;
      readonly ok: boolean;
      readonly status?: number | string;
      readonly body?: unknown;
      readonly error?: string;
      readonly timingMs?: number;
    }
  | { readonly type: 'transport-clear' }
  | {
      readonly type: 'apply-scenario';
      readonly scenario: Scenario;
      readonly findings: readonly Finding[];
    }
  | { readonly type: 'regenerate' }
  | { readonly type: 'workspace-attached'; readonly workspace: WorkspaceState }
  | { readonly type: 'workspace-detached' }
  | {
      readonly type: 'workspace-scenarios';
      readonly scenarios: WorkspaceState['scenarios'];
      readonly changedOnDisk?: boolean;
    }
  | {
      readonly type: 'workspace-scenario-origin';
      readonly path: string | undefined;
      readonly token: string | undefined;
    }
  | {
      readonly type: 'workspace-instruments-origin';
      readonly path: string;
      readonly token: string;
    };

export const initialState: AppState = {
  profile: undefined,
  profileIssues: [],
  instrumentDb: undefined,
  instrumentDbIssues: [],
  baseDictionary: undefined,
  dictionaryError: undefined,
  systemId: undefined,
  fixVersion: 'profile',
  selections: {},
  slotValues: {},
  mode: 'auto',
  rows: [{ slotValues: {} }, { slotValues: {} }, { slotValues: {} }],
  legOverrides: [],
  outputTab: 'annotated',
  delimiter: 'pipe',
  omitLengthAndChecksum: false,
  jsonMapping: undefined,
  scenarioName: '',
  scenarioFindings: [],
  hostOrigin: undefined,
  transportLog: [],
  buildNonce: 1,
  workspace: undefined,
};
