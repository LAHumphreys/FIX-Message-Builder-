/**
 * Single-message build: selections + slot values → merged message.
 *
 * Two merge passes: the first (inert generators) discovers slot specs so
 * defaults can be computed without consuming sequence numbers; the second
 * applies everything for real, in §3.4 stage order.
 */
import type { FixMessage } from '../message/types.ts';
import type { Fragment, FragmentOp, MergeNotice, SourcedFragment } from '../fragment/types.ts';
import { mergeFragments } from '../fragment/merge.ts';
import type { ResolvedSlot } from '../slot/types.ts';
import type { Finding } from '../validation/types.ts';
import { beginStringFor, type FixVersionId } from '../dictionary/types.ts';
import {
  BatchScope,
  type CounterStore,
  type GeneratorContext,
  type GeneratorDef,
} from '../generator/types.ts';
import { evaluateGenerator, type GeneratorDefs } from '../generator/evaluate.ts';
import { isAvailable, type BuildMode, type DimensionOption } from '../profile/types.ts';
import type { ResolvedSystem } from '../profile/resolve.ts';

export interface BuildEnv {
  readonly clock: () => Date;
  readonly random: () => number;
  readonly counters: CounterStore;
}

export interface BuildInput {
  /** dimensionId → selected option id (options dimensions only). */
  readonly selections: Readonly<Record<string, string>>;
  /** tag → user-entered slot value. */
  readonly slotValues: Readonly<Record<string, string>>;
  readonly fixVersion?: FixVersionId;
  /** Ad-hoc fragments, stage 'extra'. */
  readonly extraFragments?: readonly Fragment[];
  /** Instrument fragment (stage 'instrument'), synthesized per §3.10. */
  readonly instrumentFragment?: Fragment;
}

export interface BuildResult {
  readonly message: FixMessage;
  readonly msgType: string;
  readonly mode: BuildMode;
  readonly notices: readonly MergeNotice[];
  readonly slots: readonly ResolvedSlot[];
  /** Build-level findings (unresolved selections, unavailable options). */
  readonly findings: readonly Finding[];
}

export interface SelectionResolution {
  readonly stack: SourcedFragment[];
  readonly msgType: string;
  readonly mode: BuildMode;
  readonly findings: Finding[];
  /** Identity-convention override from a selected option (§3.10);
   *  precedence: option > system. */
  readonly convention?: string;
  /** Human label of what set the override, e.g. "Client: Desk account". */
  readonly conventionSource?: string;
}

/** Resolve dimension selections into the fragment stack skeleton. */
export function resolveSelections(
  resolved: ResolvedSystem,
  selections: Readonly<Record<string, string>>
): SelectionResolution {
  const findings: Finding[] = [];
  const stack: SourcedFragment[] = [...resolved.systemFragments];
  let msgType = 'D';
  let mode: BuildMode = 'single';
  let convention: { name: string; source: string } | undefined;

  for (const dimension of resolved.profile.dimensions) {
    if (dimension.kind !== 'options') continue;
    const selection = selections[dimension.id];
    if (selection === undefined) {
      if (dimension.required) {
        findings.push({
          ruleId: 'selection-missing',
          severity: 'info',
          path: '',
          message: `No ${dimension.label} selected`,
        });
      }
      continue;
    }
    const option: DimensionOption | undefined = dimension.options?.find((o) => o.id === selection);
    if (!option) {
      findings.push({
        ruleId: 'selection-unresolved',
        severity: 'warning',
        path: '',
        message: `${dimension.label}: selection '${selection}' does not exist in this profile`,
      });
      continue;
    }
    if (!isAvailable(option.availableOn, resolved.system.id, resolved.capabilities)) {
      findings.push({
        ruleId: 'option-unavailable',
        severity: 'warning',
        path: '',
        message: `${dimension.label}: '${option.label}' is not available on ${resolved.system.label}`,
      });
    }
    if (option.msgType) msgType = option.msgType;
    if (option.modes && option.modes.length > 0) mode = option.modes[0]!;
    if (option.convention) {
      const source = `${dimension.label}: ${option.label}`;
      if (convention) {
        findings.push({
          ruleId: 'convention-conflict',
          severity: 'warning',
          path: '',
          message: `Both ${convention.source} and ${source} set an identity convention; using '${option.convention}' (last declared dimension wins)`,
        });
      }
      convention = { name: option.convention, source };
    }
    if (option.fragment) {
      const fragment = resolved.profile.fragments[option.fragment];
      if (fragment) stack.push({ fragment, stage: 'dimension' });
    }
  }

  const templateRef = resolved.profile.templates?.[msgType];
  const template = templateRef ? resolved.profile.fragments[templateRef] : undefined;
  if (template) stack.unshift({ fragment: template, stage: 'template' });

  return {
    stack,
    msgType,
    mode,
    findings,
    ...(convention ? { convention: convention.name, conventionSource: convention.source } : {}),
  };
}

export const USER_SOURCE = { id: 'user', label: 'User input' } as const;
export const DEFAULT_SOURCE = { id: 'slot-default', label: 'Slot default' } as const;

function generatorDefs(resolved: ResolvedSystem): GeneratorDefs {
  return new Map<string, GeneratorDef>(Object.entries(resolved.profile.generators ?? {}));
}

export function buildSingle(
  resolved: ResolvedSystem,
  input: BuildInput,
  env: BuildEnv,
  batch?: BatchScope
): BuildResult {
  const { stack, msgType, mode, findings } = resolveSelections(resolved, input.selections);

  if (input.instrumentFragment) {
    stack.push({ fragment: input.instrumentFragment, stage: 'instrument' });
  }
  for (const fragment of input.extraFragments ?? []) {
    stack.push({ fragment, stage: 'extra' });
  }
  if (resolved.finalFragment) stack.push(resolved.finalFragment);

  // Pass 1: discover slots without consuming entropy or sequence numbers.
  const discovery = mergeFragments(stack, { evaluateGenerator: (ref) => `{${ref}}` });

  // Effective slot values: user input wins; otherwise literal or generated default.
  const userValues = new Map(
    Object.entries(input.slotValues)
      .filter(([, value]) => value !== '')
      .map(([tag, value]) => [Number(tag), value])
  );
  const userFragment: Fragment = {
    id: USER_SOURCE.id,
    label: USER_SOURCE.label,
    ops: [...userValues.entries()].map(([tag, value]) => ({ op: 'set', tag, value })),
  };
  const defaultsFragment: Fragment = {
    id: DEFAULT_SOURCE.id,
    label: DEFAULT_SOURCE.label,
    ops: discovery.slots
      .filter((s) => !userValues.has(s.spec.tag))
      .flatMap((s): FragmentOp[] => {
        if (s.spec.generatorDefault !== undefined) {
          return [{ op: 'setGenerated', tag: s.spec.tag, generator: s.spec.generatorDefault }];
        }
        if (s.spec.default !== undefined) {
          return [{ op: 'set', tag: s.spec.tag, value: s.spec.default }];
        }
        return [];
      }),
  };

  const fullStack: SourcedFragment[] = [
    ...stack,
    { fragment: defaultsFragment, stage: 'slots' },
    { fragment: userFragment, stage: 'slots' },
  ];

  // Pass 2: real evaluation.
  const defs = generatorDefs(resolved);
  const ctx: GeneratorContext = {
    clock: env.clock,
    random: env.random,
    counters: env.counters,
    batch: batch ?? new BatchScope(),
    message: new Map(),
  };
  const merged = mergeFragments(fullStack, {
    evaluateGenerator: (ref) => evaluateGenerator(defs, ref, ctx),
  });

  const fixVersion = input.fixVersion ?? resolved.profile.fixVersion;
  return {
    message: {
      beginString: beginStringFor(fixVersion),
      msgType,
      fields: merged.fields,
    },
    msgType,
    mode,
    notices: merged.notices,
    slots: merged.slots,
    findings,
  };
}
