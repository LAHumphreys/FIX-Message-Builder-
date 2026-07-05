import type { Dictionary, Profile, ProfileIssue, TagValueDelimiter } from '../../engine/index.ts';

export type OutputTab = 'annotated' | 'raw';

export interface AppState {
  readonly profile: Profile | undefined;
  readonly profileIssues: readonly ProfileIssue[];
  /** Base dictionary for the active FIX version (loaded async). */
  readonly baseDictionary: Dictionary | undefined;
  readonly systemId: string | undefined;
  /** dimensionId → optionId */
  readonly selections: Readonly<Record<string, string>>;
  /** tag → user-entered value */
  readonly slotValues: Readonly<Record<string, string>>;
  readonly outputTab: OutputTab;
  readonly delimiter: TagValueDelimiter;
  readonly omitLengthAndChecksum: boolean;
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
  | { readonly type: 'select-system'; readonly systemId: string }
  | { readonly type: 'select-option'; readonly dimensionId: string; readonly optionId: string }
  | { readonly type: 'set-slot'; readonly tag: number; readonly value: string }
  | { readonly type: 'clear-slot'; readonly tag: number }
  | { readonly type: 'set-output-tab'; readonly tab: OutputTab }
  | { readonly type: 'set-delimiter'; readonly delimiter: TagValueDelimiter }
  | { readonly type: 'set-omit-length-checksum'; readonly omit: boolean }
  | { readonly type: 'regenerate' };

export const initialState: AppState = {
  profile: undefined,
  profileIssues: [],
  baseDictionary: undefined,
  systemId: undefined,
  selections: {},
  slotValues: {},
  outputTab: 'annotated',
  delimiter: 'pipe',
  omitLengthAndChecksum: false,
  buildNonce: 1,
};
