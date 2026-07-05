/**
 * The memoized engine pipeline. All business logic lives in the engine;
 * this hook only wires state to it.
 */
import { useMemo } from 'react';
import {
  buildSingle,
  memoryCounterStore,
  mulberry32,
  resolveForSystem,
  validateMessage,
  type BuildResult,
  type Finding,
  type ResolvedSystem,
} from '../../engine/index.ts';
import { useAppState } from './context.ts';

export interface DerivedBuild {
  readonly resolved: ResolvedSystem | undefined;
  readonly result: BuildResult | undefined;
  readonly findings: readonly Finding[];
}

/**
 * Generators are deterministic per buildNonce: the clock value and PRNG seed
 * are pinned when the nonce changes ("Regenerate"), so typing in the form
 * doesn't churn ClOrdIDs and timestamps.
 */
export function useBuildResult(): DerivedBuild {
  const { profile, baseDictionary, systemId, selections, slotValues, buildNonce } = useAppState();

  // eslint-disable-next-line react-hooks/exhaustive-deps -- re-pin the clock per Regenerate
  const pinnedClock = useMemo(() => new Date(), [buildNonce]);

  return useMemo(() => {
    if (!profile || !baseDictionary || !systemId) {
      return { resolved: undefined, result: undefined, findings: [] };
    }
    const resolved = resolveForSystem(profile, systemId, baseDictionary);
    if (!resolved) {
      return { resolved: undefined, result: undefined, findings: [] };
    }
    const result = buildSingle(
      resolved,
      { selections, slotValues },
      {
        clock: () => pinnedClock,
        random: mulberry32(buildNonce),
        counters: memoryCounterStore(),
      }
    );
    const findings = [
      ...result.findings,
      ...validateMessage(result.message, resolved.dictionary, resolved.policyChain),
    ];
    return { resolved, result, findings };
  }, [profile, baseDictionary, systemId, selections, slotValues, buildNonce, pinnedClock]);
}
