/**
 * The §3.4 merge pipeline. Semantics are defined by merge.test.ts:
 * - stages apply in MERGE_STAGES order (stable within a stage);
 * - simple-tag collision replaces the value IN PLACE, chaining provenance
 *   and emitting a notice;
 * - remove deletes (field or whole group) with a notice; a later set
 *   re-adds at append position with fresh provenance;
 * - group append extends, group replace swaps (notice when it replaced
 *   something);
 * - slot ops register specs (last spec wins, first position kept) and emit
 *   no fields;
 * - setGenerated evaluates through the injected context.
 */
import type { Field, Provenance } from '../message/types.ts';
import type { ResolvedSlot } from '../slot/types.ts';
import {
  MERGE_STAGES,
  type FragmentOp,
  type MergeNotice,
  type MergeStage,
  type SourcedFragment,
} from './types.ts';

export interface MergeContext {
  /** Evaluate a generator reference to a concrete value. */
  readonly evaluateGenerator: (ref: string, tag: number) => string;
}

export interface MergeResult {
  readonly fields: readonly Field[];
  readonly notices: readonly MergeNotice[];
  readonly slots: readonly ResolvedSlot[];
}

interface SourceInfo {
  readonly id: string;
  readonly label: string;
  readonly stage: MergeStage;
}

function provenance(source: SourceInfo, via?: string, overwrote?: Provenance): Provenance {
  return {
    sourceId: source.id,
    sourceLabel: source.label,
    stage: source.stage,
    ...(via !== undefined ? { via } : {}),
    ...(overwrote !== undefined ? { overwrote } : {}),
  };
}

/** Apply ops to a working field list (used for both top level and entries). */
function applyOps(
  fields: Field[],
  ops: readonly FragmentOp[],
  source: SourceInfo,
  ctx: MergeContext,
  notices: MergeNotice[],
  slots: Map<number, ResolvedSlot>,
  pathPrefix: string
): void {
  for (const op of ops) {
    switch (op.op) {
      case 'set':
      case 'setGenerated': {
        const value = op.op === 'set' ? op.value : ctx.evaluateGenerator(op.generator, op.tag);
        const via = op.op === 'setGenerated' ? op.generator : undefined;
        const index = fields.findIndex((f) => f.kind === 'field' && f.tag === op.tag);
        if (index >= 0) {
          const existing = fields[index]!;
          if (existing.kind !== 'field') break;
          notices.push({
            kind: 'overwrite',
            tag: op.tag,
            path: pathPrefix + String(op.tag),
            by: source.id,
            previous: existing.provenance.sourceId,
            previousValue: existing.value,
          });
          fields[index] = {
            kind: 'field',
            tag: op.tag,
            value,
            provenance: provenance(source, via, existing.provenance),
          };
        } else {
          fields.push({
            kind: 'field',
            tag: op.tag,
            value,
            provenance: provenance(source, via),
          });
        }
        break;
      }
      case 'remove': {
        const index = fields.findIndex(
          (f) =>
            (f.kind === 'field' && f.tag === op.tag) ||
            (f.kind === 'group' && f.countTag === op.tag)
        );
        if (index >= 0) {
          const existing = fields[index]!;
          notices.push({
            kind: 'remove',
            tag: op.tag,
            path: pathPrefix + String(op.tag),
            by: source.id,
            previous: existing.provenance.sourceId,
          });
          fields.splice(index, 1);
        }
        break;
      }
      case 'slot': {
        // Last spec wins; first declaration keeps its position in the order.
        slots.set(op.tag, { spec: op.slot, declaredBy: source.id });
        break;
      }
      case 'group': {
        const index = fields.findIndex((f) => f.kind === 'group' && f.countTag === op.countTag);
        const newEntries = op.entries.map((entryOps) => {
          const entryFields: Field[] = [];
          applyOps(
            entryFields,
            entryOps,
            source,
            ctx,
            notices,
            slots,
            `${pathPrefix}${op.countTag}[]/`
          );
          return entryFields as readonly Field[];
        });
        if (index < 0) {
          fields.push({
            kind: 'group',
            countTag: op.countTag,
            entries: newEntries,
            provenance: provenance(source),
          });
        } else {
          const existing = fields[index]!;
          if (existing.kind !== 'group') break;
          if (op.mode === 'append') {
            fields[index] = { ...existing, entries: [...existing.entries, ...newEntries] };
          } else {
            notices.push({
              kind: 'group-replace',
              countTag: op.countTag,
              by: source.id,
              previous: existing.provenance.sourceId,
            });
            fields[index] = {
              kind: 'group',
              countTag: op.countTag,
              entries: newEntries,
              provenance: provenance(source),
            };
          }
        }
        break;
      }
    }
  }
}

export function mergeFragments(stack: readonly SourcedFragment[], ctx: MergeContext): MergeResult {
  // Stable sort into normative stage order — §3.4 is enforced here, not
  // trusted from the caller.
  const stageIndex = new Map(MERGE_STAGES.map((s, i) => [s, i]));
  const ordered = [...stack].sort(
    (a, b) => (stageIndex.get(a.stage) ?? 0) - (stageIndex.get(b.stage) ?? 0)
  );

  const fields: Field[] = [];
  const notices: MergeNotice[] = [];
  const slots = new Map<number, ResolvedSlot>();

  for (const { fragment, stage } of ordered) {
    applyOps(
      fields,
      fragment.ops,
      { id: fragment.id, label: fragment.label, stage },
      ctx,
      notices,
      slots,
      ''
    );
  }

  return { fields, notices, slots: [...slots.values()] };
}
