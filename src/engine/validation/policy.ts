/**
 * Severity policy resolution (brief §4): defaults → profile policy →
 * system policy, with per-tag/per-message-type overrides. Most specific
 * match wins within a policy; later policies in the chain win overall.
 */
import type { ValidationPolicy } from '../profile/types.ts';
import { DEFAULT_SEVERITIES, type RuleId, type Severity } from './types.ts';

export function resolveSeverity(
  policyChain: readonly ValidationPolicy[],
  ruleId: RuleId | string,
  msgType?: string,
  tag?: number
): Severity {
  let severity: Severity = DEFAULT_SEVERITIES[ruleId as RuleId] ?? 'warning';

  for (const policy of policyChain) {
    const global = policy.rules?.[ruleId];
    if (global !== undefined) severity = global;

    let bestSpecificity = -1;
    for (const override of policy.overrides ?? []) {
      if (override.rule !== ruleId) continue;
      if (override.msgType !== undefined && override.msgType !== msgType) continue;
      if (override.tag !== undefined && override.tag !== tag) continue;
      const specificity =
        (override.msgType !== undefined ? 1 : 0) + (override.tag !== undefined ? 1 : 0);
      if (specificity > bestSpecificity) {
        bestSpecificity = specificity;
        severity = override.severity;
      }
    }
  }
  return severity;
}
