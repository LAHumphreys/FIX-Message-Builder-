/**
 * Order groups (brief §3.7): batches of independent messages, true FIX
 * order lists (35=E), and multileg orders (35=AB). All three drive group
 * entries / sibling messages from the same slot grid.
 */
import type { Field, FixMessage } from '../message/types.ts';
import type { Fragment, FragmentOp, SourcedFragment } from '../fragment/types.ts';
import { mergeFragments } from '../fragment/merge.ts';
import type { Finding } from '../validation/types.ts';
import { beginStringFor } from '../dictionary/types.ts';
import { BatchScope, type GeneratorContext, type GeneratorDef } from '../generator/types.ts';
import { evaluateGenerator, type GeneratorDefs } from '../generator/evaluate.ts';
import type { ResolvedSystem } from '../profile/resolve.ts';
import type { InstrumentDb, StrategyRecord } from '../instrument/types.ts';
import type { IdentityConvention } from '../instrument/convention.ts';
import { instrumentFragment } from '../instrument/placement.ts';
import { resolveSelections, USER_SOURCE, type BuildEnv, type BuildInput } from './single.ts';
import type { ResolvedSlot } from '../slot/types.ts';
import type { MergeNotice } from '../fragment/types.ts';

export interface BatchRow {
  /** Instrument (or strategy) record key — baskets are multi-instrument. */
  readonly instrument?: string;
  /** Per-row slot overrides (tag → value). */
  readonly slotValues: Readonly<Record<string, string>>;
}

export interface GroupBuildInput extends BuildInput {
  readonly rows: readonly BatchRow[];
}

export interface InstrumentContext {
  readonly db: InstrumentDb;
  readonly convention: IdentityConvention;
}

export interface BatchBuildResult {
  readonly messages: readonly FixMessage[];
  readonly perMessage: readonly {
    readonly notices: readonly MergeNotice[];
    readonly findings: readonly Finding[];
  }[];
  readonly slots: readonly ResolvedSlot[];
  readonly findings: readonly Finding[];
}

function generatorDefs(resolved: ResolvedSystem): GeneratorDefs {
  return new Map<string, GeneratorDef>(Object.entries(resolved.profile.generators ?? {}));
}

function makeContext(env: BuildEnv, batch: BatchScope): GeneratorContext {
  return {
    clock: env.clock,
    random: env.random,
    counters: env.counters,
    batch,
    message: new Map(),
  };
}

function rowInstrumentFragment(
  row: BatchRow,
  resolved: ResolvedSystem,
  instruments: InstrumentContext | undefined,
  context: 'instrument' | 'leg',
  findings: Finding[]
): Fragment | undefined {
  if (!row.instrument) return undefined;
  const record =
    instruments?.db.instruments.get(row.instrument) ??
    instruments?.db.strategies.get(row.instrument);
  if (!record || !instruments) {
    findings.push({
      ruleId: 'selection-unresolved',
      severity: 'warning',
      path: '',
      message: `Instrument '${row.instrument}' is not in the loaded instrument database`,
    });
    return undefined;
  }
  const placed = instrumentFragment(
    record,
    instruments.convention,
    context,
    resolved.profile.fixVersion
  );
  findings.push(...placed.findings);
  return placed.fragment;
}

/** Effective per-row slot ops: defaults ⊕ shared values ⊕ row overrides. */
function rowSlotFragments(
  slots: readonly ResolvedSlot[],
  shared: Readonly<Record<string, string>>,
  row: BatchRow
): Fragment[] {
  const merged = new Map<number, string>();
  for (const [tag, value] of Object.entries(shared)) merged.set(Number(tag), value);
  for (const [tag, value] of Object.entries(row.slotValues)) merged.set(Number(tag), value);

  const defaults: FragmentOp[] = slots
    .filter((s) => !merged.has(s.spec.tag))
    .flatMap((s): FragmentOp[] => {
      if (s.spec.generatorDefault !== undefined) {
        return [{ op: 'setGenerated', tag: s.spec.tag, generator: s.spec.generatorDefault }];
      }
      if (s.spec.default !== undefined) {
        return [{ op: 'set', tag: s.spec.tag, value: s.spec.default }];
      }
      return [];
    });
  const users: FragmentOp[] = [...merged.entries()].map(([tag, value]) => ({
    op: 'set',
    tag,
    value,
  }));
  return [
    { id: 'slot-default', label: 'Slot default', ops: defaults },
    { id: USER_SOURCE.id, label: USER_SOURCE.label, ops: users },
  ];
}

/**
 * Batch (§3.7.1): N independent messages from one fragment stack, one row
 * each, sharing a BatchScope so `shared` generators (ListID) and batch
 * sequences (ClOrdID-1..N) link fields across rows.
 */
export function buildBatch(
  resolved: ResolvedSystem,
  input: GroupBuildInput,
  env: BuildEnv,
  instruments?: InstrumentContext
): BatchBuildResult {
  const { stack, msgType, findings } = resolveSelections(resolved, input.selections);
  const defs = generatorDefs(resolved);
  const batch = new BatchScope();

  // Discovery pass for the slot columns (inert generators).
  const discovery = mergeFragments(
    [...stack, ...(resolved.finalFragment ? [resolved.finalFragment] : [])],
    { evaluateGenerator: (ref) => `{${ref}}` }
  );

  const messages: FixMessage[] = [];
  const perMessage: { notices: MergeNotice[]; findings: Finding[] }[] = [];
  const beginString = beginStringFor(input.fixVersion ?? resolved.profile.fixVersion);

  for (const row of input.rows) {
    const rowFindings: Finding[] = [];
    const rowStack: SourcedFragment[] = [...stack];
    const inst = rowInstrumentFragment(row, resolved, instruments, 'instrument', rowFindings);
    if (inst) rowStack.push({ fragment: inst, stage: 'instrument' });
    const [defaultsFrag, userFrag] = rowSlotFragments(discovery.slots, input.slotValues, row);
    rowStack.push({ fragment: defaultsFrag!, stage: 'slots' });
    rowStack.push({ fragment: userFrag!, stage: 'slots' });
    if (resolved.finalFragment) rowStack.push(resolved.finalFragment);

    const ctx = makeContext(env, batch);
    const merged = mergeFragments(rowStack, {
      evaluateGenerator: (ref) => evaluateGenerator(defs, ref, ctx),
    });
    messages.push({ beginString, msgType, fields: merged.fields });
    perMessage.push({ notices: [...merged.notices], findings: rowFindings });
  }

  return { messages, perMessage, slots: discovery.slots, findings };
}

export interface ListBuildResult {
  readonly message: FixMessage;
  readonly notices: readonly MergeNotice[];
  readonly slots: readonly ResolvedSlot[];
  readonly findings: readonly Finding[];
}

/**
 * List (§3.7.2): a single 35=E whose orders are NoOrders(73) group entries,
 * driven by the same slot grid. An optional `E:entry` template fragment
 * (profile.templates) defines per-entry boilerplate (ClOrdID generator,
 * ListSeqNo...); the profile may redefine the group structure.
 */
export function buildList(
  resolved: ResolvedSystem,
  input: GroupBuildInput,
  env: BuildEnv,
  instruments?: InstrumentContext
): ListBuildResult {
  const { stack, findings } = resolveSelections(resolved, input.selections);
  const defs = generatorDefs(resolved);
  const batch = new BatchScope();

  const discovery = mergeFragments(
    [...stack, ...(resolved.finalFragment ? [resolved.finalFragment] : [])],
    { evaluateGenerator: (ref) => `{${ref}}` }
  );

  const entryTemplateRef = resolved.profile.templates?.['E:entry'];
  const entryTemplate = entryTemplateRef ? resolved.profile.fragments[entryTemplateRef] : undefined;

  const ctx = makeContext(env, batch);
  const evaluate = { evaluateGenerator: (ref: string) => evaluateGenerator(defs, ref, ctx) };

  // Build each entry through the same merge pipeline (per-entry stages).
  const entries: (readonly Field[])[] = [];
  const entryNotices: MergeNotice[] = [];
  input.rows.forEach((row, i) => {
    const rowFindings: Finding[] = [];
    const entryStack: SourcedFragment[] = [];
    if (entryTemplate) entryStack.push({ fragment: entryTemplate, stage: 'template' });
    entryStack.push({
      fragment: {
        id: 'list-seq',
        label: 'List sequencing',
        ops: [{ op: 'set', tag: 67, value: String(i + 1) }],
      },
      stage: 'template',
    });
    const inst = rowInstrumentFragment(row, resolved, instruments, 'instrument', rowFindings);
    if (inst) entryStack.push({ fragment: inst, stage: 'instrument' });
    const [defaultsFrag, userFrag] = rowSlotFragments(discovery.slots, input.slotValues, row);
    entryStack.push({ fragment: defaultsFrag!, stage: 'slots' });
    entryStack.push({ fragment: userFrag!, stage: 'slots' });

    // Fresh per-message counters per entry; shared batch scope across them.
    const entryCtx = makeContext(env, batch);
    const merged = mergeFragments(entryStack, {
      evaluateGenerator: (ref) => evaluateGenerator(defs, ref, entryCtx),
    });
    entries.push(merged.fields);
    entryNotices.push(...merged.notices);
    findings.push(...rowFindings);
  });

  // Top level: the normal stack (no slot values — they live in entries),
  // plus the NoOrders group and TotNoOrders(68).
  const listStack: SourcedFragment[] = [
    ...stack,
    {
      fragment: {
        id: 'list-orders',
        label: 'List orders',
        ops: [{ op: 'set', tag: 68, value: String(input.rows.length) }],
      },
      stage: 'extra',
    },
  ];
  if (resolved.finalFragment) listStack.push(resolved.finalFragment);
  const merged = mergeFragments(listStack, evaluate);

  const fields: Field[] = [
    ...merged.fields,
    {
      kind: 'group',
      countTag: 73,
      entries,
      provenance: { sourceId: 'list-builder', sourceLabel: 'List rows', stage: 'extra' },
    },
  ];

  return {
    message: {
      beginString: beginStringFor(input.fixVersion ?? resolved.profile.fixVersion),
      msgType: 'E',
      fields,
    },
    notices: [...merged.notices, ...entryNotices],
    slots: discovery.slots,
    findings,
  };
}

export interface LegOverride {
  readonly ratioQty?: string;
  readonly side?: string;
  readonly price?: string;
  readonly slotValues?: Readonly<Record<string, string>>;
}

export interface MultilegInput extends BuildInput {
  readonly strategyKey: string;
  readonly legOverrides?: readonly LegOverride[];
}

/**
 * Multileg (§3.7.3, pattern 2): 35=AB with the NoLegs(555) group; each
 * leg's instrument block comes from the SAME convention via the
 * InstrumentLeg placement context, plus ratio/side/price from the strategy
 * record with per-leg overrides.
 */
export function buildMultileg(
  resolved: ResolvedSystem,
  input: MultilegInput,
  env: BuildEnv,
  instruments: InstrumentContext | undefined
): ListBuildResult {
  const { stack, findings } = resolveSelections(resolved, input.selections);
  const defs = generatorDefs(resolved);
  const batch = new BatchScope();

  const strategy: StrategyRecord | undefined = instruments?.db.strategies.get(input.strategyKey);
  if (!strategy) {
    findings.push({
      ruleId: 'selection-unresolved',
      severity: 'warning',
      path: '',
      message: `Strategy '${input.strategyKey}' is not in the loaded instrument database`,
    });
  }

  const discovery = mergeFragments(
    [...stack, ...(resolved.finalFragment ? [resolved.finalFragment] : [])],
    { evaluateGenerator: (ref) => `{${ref}}` }
  );

  const ctx = makeContext(env, batch);

  const entries: (readonly Field[])[] = [];
  strategy?.legs.forEach((leg, i) => {
    const override = input.legOverrides?.[i];
    const legFindings: Finding[] = [];
    const legStack: SourcedFragment[] = [];
    const record = instruments?.db.instruments.get(leg.instrument);
    if (record && instruments) {
      const placed = instrumentFragment(
        record,
        instruments.convention,
        'leg',
        resolved.profile.fixVersion
      );
      legStack.push({ fragment: placed.fragment, stage: 'instrument' });
      legFindings.push(...placed.findings);
    } else {
      legFindings.push({
        ruleId: 'selection-unresolved',
        severity: 'warning',
        path: '',
        message: `Leg instrument '${leg.instrument}' is not in the loaded instrument database`,
      });
    }
    const legOps: FragmentOp[] = [
      { op: 'set', tag: 623, value: override?.ratioQty ?? leg.ratioQty },
      { op: 'set', tag: 624, value: override?.side ?? leg.side },
    ];
    const price = override?.price ?? leg.price;
    if (price !== undefined) legOps.push({ op: 'set', tag: 566, value: price });
    for (const [tag, value] of Object.entries(override?.slotValues ?? {})) {
      legOps.push({ op: 'set', tag: Number(tag), value });
    }
    legStack.push({
      fragment: { id: `leg:${i}`, label: `Leg ${i + 1}`, ops: legOps },
      stage: 'slots',
    });
    const merged = mergeFragments(legStack, {
      evaluateGenerator: (ref) => evaluateGenerator(defs, ref, makeContext(env, batch)),
    });
    entries.push(merged.fields);
    findings.push(...legFindings);
  });

  // Top level: stack + strategy identity (762 via convention roles) + slots.
  const topStack: SourcedFragment[] = [...stack];
  if (strategy && instruments) {
    const placed = instrumentFragment(
      strategy,
      instruments.convention,
      'instrument',
      resolved.profile.fixVersion
    );
    topStack.push({ fragment: placed.fragment, stage: 'instrument' });
    findings.push(...placed.findings);
    if (strategy.strategyType) {
      topStack.push({
        fragment: {
          id: 'strategy-type',
          label: 'Strategy type',
          ops: [{ op: 'set', tag: 762, value: strategy.strategyType }],
        },
        stage: 'instrument',
      });
    }
  }
  const [defaultsFrag, userFrag] = rowSlotFragments(discovery.slots, input.slotValues, {
    slotValues: {},
  });
  topStack.push({ fragment: defaultsFrag!, stage: 'slots' });
  topStack.push({ fragment: userFrag!, stage: 'slots' });
  if (resolved.finalFragment) topStack.push(resolved.finalFragment);

  const merged = mergeFragments(topStack, {
    evaluateGenerator: (ref) => evaluateGenerator(defs, ref, ctx),
  });

  const fields: Field[] = [
    ...merged.fields,
    {
      kind: 'group',
      countTag: 555,
      entries,
      provenance: {
        sourceId: `strategy:${input.strategyKey}`,
        sourceLabel: `Strategy: ${strategy?.name ?? input.strategyKey}`,
        stage: 'instrument',
      },
    },
  ];

  return {
    message: {
      beginString: beginStringFor(input.fixVersion ?? resolved.profile.fixVersion),
      msgType: 'AB',
      fields,
    },
    notices: merged.notices,
    slots: discovery.slots,
    findings,
  };
}
