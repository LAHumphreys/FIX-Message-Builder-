import type {
  BatchRow,
  BuildMode,
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

export interface AppState {
  readonly profile: Profile | undefined;
  readonly profileIssues: readonly ProfileIssue[];
  readonly instrumentDb: InstrumentDb | undefined;
  readonly instrumentDbIssues: readonly InstrumentDbIssue[];
  /** Base dictionary for the active FIX version (loaded async). */
  readonly baseDictionary: Dictionary | undefined;
  readonly systemId: string | undefined;
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
  /** Bumped by "Regenerate": reseeds generators and refreshes timestamps. */
  readonly buildNonce: number;
}

export type Action =
  | {
      readonly type: 'profile-loaded';
      readonly profile: Profile | undefined;
      readonly issues: readonly ProfileIssue[];
    }
  | { readonly type: 'dictionary-loaded'; readonly dictionary: Dictionary }
  | {
      readonly type: 'instruments-loaded';
      readonly db: InstrumentDb | undefined;
      readonly issues: readonly InstrumentDbIssue[];
    }
  | { readonly type: 'select-system'; readonly systemId: string }
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
  | {
      readonly type: 'apply-scenario';
      readonly scenario: Scenario;
      readonly findings: readonly Finding[];
    }
  | { readonly type: 'regenerate' };

export const initialState: AppState = {
  profile: undefined,
  profileIssues: [],
  instrumentDb: undefined,
  instrumentDbIssues: [],
  baseDictionary: undefined,
  systemId: undefined,
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
  buildNonce: 1,
};
