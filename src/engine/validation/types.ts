/**
 * Validation model (brief §4). Findings inform; they never block rendering.
 */
import type { Provenance } from '../message/types.ts';

export type Severity = 'error' | 'warning' | 'info' | 'off';

export const RULE_IDS = [
  'required-missing',
  'unknown-tag',
  'enum-unknown',
  'type-mismatch',
  'group-count-mismatch',
  'group-field-order',
  'header-trailer-order',
  'duplicate-tag',
] as const;

export type RuleId = (typeof RULE_IDS)[number];

export interface Finding {
  readonly ruleId: RuleId | string;
  readonly severity: Exclude<Severity, 'off'>;
  /** Path in annotated-view format ("55", "73[1]/11"), or '' for message-level. */
  readonly path: string;
  readonly tag?: number;
  readonly message: string;
  /** Which fragment/input introduced the offending field, when known. */
  readonly provenance?: Provenance;
}

/** Default severities: standards violations warn; internal contradictions error. */
export const DEFAULT_SEVERITIES: Readonly<Record<RuleId, Severity>> = {
  'required-missing': 'warning',
  'unknown-tag': 'warning',
  'enum-unknown': 'warning',
  'type-mismatch': 'warning',
  'group-count-mismatch': 'error',
  'group-field-order': 'warning',
  'header-trailer-order': 'warning',
  'duplicate-tag': 'warning',
};
