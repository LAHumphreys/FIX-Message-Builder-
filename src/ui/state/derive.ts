/**
 * The memoized engine pipeline. All business logic lives in the engine;
 * this hook only wires state to it.
 */
import { useMemo } from 'react';
import {
  buildSearchIndex,
  buildSingle,
  instrumentFragment,
  memoryCounterStore,
  mulberry32,
  resolveForSystem,
  validateMessage,
  type BuildResult,
  type Finding,
  type Fragment,
  type ResolvedSystem,
  type SearchIndex,
} from '../../engine/index.ts';
import { useAppState } from './context.ts';

export interface DerivedBuild {
  readonly resolved: ResolvedSystem | undefined;
  readonly result: BuildResult | undefined;
  readonly findings: readonly Finding[];
  readonly searchIndex: SearchIndex | undefined;
}

/**
 * Generators are deterministic per buildNonce: the clock value and PRNG seed
 * are pinned when the nonce changes ("Regenerate"), so typing in the form
 * doesn't churn ClOrdIDs and timestamps.
 */
export function useBuildResult(): DerivedBuild {
  const { profile, baseDictionary, systemId, selections, slotValues, buildNonce, instrumentDb } =
    useAppState();

  // eslint-disable-next-line react-hooks/exhaustive-deps -- re-pin the clock per Regenerate
  const pinnedClock = useMemo(() => new Date(), [buildNonce]);

  const searchIndex = useMemo(
    () => (instrumentDb ? buildSearchIndex(instrumentDb) : undefined),
    [instrumentDb]
  );

  return useMemo(() => {
    if (!profile || !baseDictionary || !systemId) {
      return { resolved: undefined, result: undefined, findings: [], searchIndex };
    }
    const resolved = resolveForSystem(profile, systemId, baseDictionary);
    if (!resolved) {
      return { resolved: undefined, result: undefined, findings: [], searchIndex };
    }

    // Instrument dimension: selection + system convention -> fragment (§3.10).
    const instrumentFindings: Finding[] = [];
    let instFragment: Fragment | undefined;
    const instrumentDim = profile.dimensions.find((d) => d.kind === 'instrument');
    const instrumentKey = instrumentDim ? selections[instrumentDim.id] : undefined;
    if (instrumentDim && instrumentKey && instrumentDb) {
      const record =
        instrumentDb.instruments.get(instrumentKey) ?? instrumentDb.strategies.get(instrumentKey);
      const conventionRef = resolved.system.convention;
      const convention = conventionRef ? profile.conventions?.[conventionRef] : undefined;
      if (record && convention) {
        const placed = instrumentFragment(record, convention, 'instrument', profile.fixVersion);
        instFragment = placed.fragment;
        instrumentFindings.push(...placed.findings);
      } else if (record && !convention) {
        instrumentFindings.push({
          ruleId: 'convention-unresolved',
          severity: 'warning',
          path: '',
          message: `System ${resolved.system.label} has no resolvable identity convention ('${conventionRef ?? 'none'}')`,
        });
      } else {
        instrumentFindings.push({
          ruleId: 'selection-unresolved',
          severity: 'warning',
          path: '',
          message: `Instrument '${instrumentKey}' is not in the loaded instrument database`,
        });
      }
    }

    const result = buildSingle(
      resolved,
      {
        selections,
        slotValues,
        ...(instFragment ? { instrumentFragment: instFragment } : {}),
      },
      {
        clock: () => pinnedClock,
        random: mulberry32(buildNonce),
        counters: memoryCounterStore(),
      }
    );
    const findings = [
      ...result.findings,
      ...instrumentFindings,
      ...validateMessage(result.message, resolved.dictionary, resolved.policyChain),
    ];
    return { resolved, result, findings, searchIndex };
  }, [
    profile,
    baseDictionary,
    systemId,
    selections,
    slotValues,
    buildNonce,
    pinnedClock,
    instrumentDb,
    searchIndex,
  ]);
}
