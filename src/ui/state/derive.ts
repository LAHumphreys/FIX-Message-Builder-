/**
 * The memoized engine pipeline. All business logic lives in the engine;
 * this hook only wires state to it.
 */
import { useMemo } from 'react';
import {
  buildBatch,
  buildList,
  buildMultileg,
  buildSearchIndex,
  buildSingle,
  instrumentFragment,
  memoryCounterStore,
  mulberry32,
  resolveForSystem,
  resolveSelections,
  validateMessage,
  type BuildMode,
  type Finding,
  type FixMessage,
  type Fragment,
  type InstrumentContext,
  type MergeNotice,
  type ResolvedSlot,
  type ResolvedSystem,
  type SearchIndex,
  type StrategyRecord,
} from '../../engine/index.ts';
import { useAppState } from './context.ts';

export interface DerivedBuild {
  readonly resolved: ResolvedSystem | undefined;
  readonly mode: BuildMode;
  /** Modes the selected flow option supports. */
  readonly availableModes: readonly BuildMode[];
  readonly messages: readonly FixMessage[];
  readonly slots: readonly ResolvedSlot[];
  readonly notices: readonly MergeNotice[];
  readonly findings: readonly Finding[];
  readonly searchIndex: SearchIndex | undefined;
  /** The strategy selected via the instrument dimension, if any. */
  readonly strategy: StrategyRecord | undefined;
}

const EMPTY: Omit<DerivedBuild, 'searchIndex'> = {
  resolved: undefined,
  mode: 'single',
  availableModes: ['single'],
  messages: [],
  slots: [],
  notices: [],
  findings: [],
  strategy: undefined,
};

/**
 * Generators are deterministic per buildNonce: the clock value and PRNG seed
 * are pinned when the nonce changes ("Regenerate"), so typing in the form
 * doesn't churn ClOrdIDs and timestamps.
 */
export function useBuildResult(): DerivedBuild {
  const {
    profile,
    baseDictionary,
    systemId,
    fixVersion: fixVersionChoice,
    selections,
    slotValues,
    mode,
    rows,
    legOverrides,
    buildNonce,
    instrumentDb,
    scenarioFindings,
  } = useAppState();

  // eslint-disable-next-line react-hooks/exhaustive-deps -- re-pin the clock per Regenerate
  const pinnedClock = useMemo(() => new Date(), [buildNonce]);

  const searchIndex = useMemo(
    () => (instrumentDb ? buildSearchIndex(instrumentDb) : undefined),
    [instrumentDb]
  );

  return useMemo(() => {
    if (!profile || !baseDictionary || !systemId) {
      return { ...EMPTY, searchIndex };
    }
    const resolved = resolveForSystem(profile, systemId, baseDictionary);
    if (!resolved) {
      return { ...EMPTY, searchIndex };
    }

    const env = {
      clock: () => pinnedClock,
      random: mulberry32(buildNonce),
      counters: memoryCounterStore(),
    };
    const fixVersion = fixVersionChoice === 'profile' ? profile.fixVersion : fixVersionChoice;

    // Effective mode: explicit choice, else the flow option's first mode.
    const selectionInfo = resolveSelections(resolved, selections);
    const flowDim = profile.dimensions.find(
      (d) => d.kind === 'options' && d.options?.some((o) => o.msgType || o.modes)
    );
    const flowOption = flowDim?.options?.find((o) => o.id === selections[flowDim.id]);
    const availableModes: readonly BuildMode[] = flowOption?.modes?.length
      ? flowOption.modes
      : [selectionInfo.mode];
    const effectiveMode: BuildMode = mode === 'auto' ? (availableModes[0] ?? 'single') : mode;

    // Instrument dimension selection.
    const instrumentDim = profile.dimensions.find((d) => d.kind === 'instrument');
    const instrumentKey = instrumentDim ? selections[instrumentDim.id] : undefined;
    const conventionRef = resolved.system.convention;
    const convention = conventionRef ? profile.conventions?.[conventionRef] : undefined;
    const instruments: InstrumentContext | undefined =
      instrumentDb && convention ? { db: instrumentDb, convention } : undefined;
    const record = instrumentKey
      ? (instrumentDb?.instruments.get(instrumentKey) ??
        instrumentDb?.strategies.get(instrumentKey))
      : undefined;
    const strategy = instrumentKey ? instrumentDb?.strategies.get(instrumentKey) : undefined;

    const preFindings: Finding[] = [...scenarioFindings];
    if (instrumentKey && instrumentDb && !record) {
      preFindings.push({
        ruleId: 'selection-unresolved',
        severity: 'warning',
        path: '',
        message: `Instrument '${instrumentKey}' is not in the loaded instrument database`,
      });
    }
    if (instrumentKey && record && !convention) {
      preFindings.push({
        ruleId: 'convention-unresolved',
        severity: 'warning',
        path: '',
        message: `System ${resolved.system.label} has no resolvable identity convention ('${conventionRef ?? 'none'}')`,
      });
    }

    let messages: FixMessage[] = [];
    let slots: readonly ResolvedSlot[] = [];
    let notices: readonly MergeNotice[] = [];
    const findings: Finding[] = [...preFindings];

    if (effectiveMode === 'batch') {
      const result = buildBatch(
        resolved,
        { selections, slotValues, rows, fixVersion },
        env,
        instruments
      );
      messages = [...result.messages];
      slots = result.slots;
      findings.push(...result.findings, ...result.perMessage.flatMap((m) => m.findings));
      notices = result.perMessage.flatMap((m) => m.notices);
    } else if (effectiveMode === 'list') {
      const result = buildList(
        resolved,
        { selections, slotValues, rows, fixVersion },
        env,
        instruments
      );
      messages = [result.message];
      slots = result.slots;
      notices = result.notices;
      findings.push(...result.findings);
    } else if (effectiveMode === 'multileg') {
      if (strategy) {
        const result = buildMultileg(
          resolved,
          { selections, slotValues, strategyKey: strategy.key, legOverrides, fixVersion },
          env,
          instruments
        );
        messages = [result.message];
        slots = result.slots;
        notices = result.notices;
        findings.push(...result.findings);
      } else {
        findings.push({
          ruleId: 'selection-missing',
          severity: 'info',
          path: '',
          message: 'Multileg mode needs a strategy record selected in the instrument dimension',
        });
      }
    } else {
      let instFragment: Fragment | undefined;
      if (record && convention) {
        const placed = instrumentFragment(record, convention, 'instrument', fixVersion);
        instFragment = placed.fragment;
        findings.push(...placed.findings);
      }
      const result = buildSingle(
        resolved,
        {
          selections,
          slotValues,
          fixVersion,
          ...(instFragment ? { instrumentFragment: instFragment } : {}),
        },
        env
      );
      messages = [result.message];
      slots = result.slots;
      notices = result.notices;
      findings.push(...result.findings);
    }

    for (const message of messages) {
      findings.push(...validateMessage(message, resolved.dictionary, resolved.policyChain));
    }

    return {
      resolved,
      mode: effectiveMode,
      availableModes,
      messages,
      slots,
      notices,
      findings,
      searchIndex,
      strategy,
    };
  }, [
    profile,
    baseDictionary,
    systemId,
    fixVersionChoice,
    selections,
    slotValues,
    mode,
    rows,
    legOverrides,
    buildNonce,
    pinnedClock,
    instrumentDb,
    searchIndex,
    scenarioFindings,
  ]);
}
