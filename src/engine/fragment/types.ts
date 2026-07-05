/**
 * Fragments and merge semantics (brief §3.4).
 *
 * A fragment is an ordered list of operations applied to the message under
 * construction. Fragments apply in the normative stage order:
 *   template → system → dimension (profile-declared order) → instrument →
 *   extra → slots (user values) → final (system final fragment)
 * Collisions are last-wins, always producing a provenance record and a
 * UI-visible merge notice. Deterministic, no improvised precedence.
 */
import type { SlotSpec } from '../slot/types.ts';

export type FragmentOp =
  | { readonly op: 'set'; readonly tag: number; readonly value: string }
  | { readonly op: 'setGenerated'; readonly tag: number; readonly generator: string }
  | { readonly op: 'slot'; readonly tag: number; readonly slot: SlotSpec }
  | { readonly op: 'remove'; readonly tag: number }
  | {
      readonly op: 'group';
      readonly countTag: number;
      /** append: add entries to an existing group; replace: swap it out. */
      readonly mode: 'append' | 'replace';
      readonly entries: readonly (readonly FragmentOp[])[];
    };

export interface FragmentMeta {
  readonly description?: string;
  /** Message types this fragment is meant for (advisory). */
  readonly msgTypes?: readonly string[];
  /** FIX versions this fragment is meant for (advisory). */
  readonly fixVersions?: readonly string[];
}

export interface Fragment {
  readonly id: string;
  readonly label: string;
  readonly ops: readonly FragmentOp[];
  readonly meta?: FragmentMeta;
}

/** §3.4 stage order. Merge applies stages in this exact sequence. */
export const MERGE_STAGES = [
  'template',
  'system',
  'dimension',
  'instrument',
  'extra',
  'slots',
  'final',
] as const;

export type MergeStage = (typeof MERGE_STAGES)[number];

export interface SourcedFragment {
  readonly fragment: Fragment;
  readonly stage: MergeStage;
}

export type MergeNotice =
  | {
      readonly kind: 'overwrite';
      readonly tag: number;
      readonly path: string;
      readonly by: string;
      readonly previous: string;
      readonly previousValue: string;
    }
  | {
      readonly kind: 'remove';
      readonly tag: number;
      readonly path: string;
      readonly by: string;
      readonly previous: string;
    }
  | {
      readonly kind: 'group-replace';
      readonly countTag: number;
      readonly by: string;
      readonly previous: string;
    };
