/**
 * Message validation (brief §4). Rules inform — they never block rendering.
 * Findings carry annotated-view paths and, where possible, the provenance
 * of the offending field.
 */
import type { Field, FieldList, FixMessage } from '../message/types.ts';
import type { Dictionary } from '../dictionary/types.ts';
import {
  findGroupDef,
  messageLayout,
  type FlatLayoutItem,
  type MessageLayout,
} from '../dictionary/layout.ts';
import type { ValidationPolicy } from '../profile/types.ts';
import { resolveSeverity } from './policy.ts';
import type { Finding, RuleId, Severity } from './types.ts';

/** Tags synthesized by the renderer; their absence is never a finding. */
const SYNTHETIC_TAGS = new Set([8, 9, 10, 35]);

interface RuleContext {
  readonly dict: Dictionary;
  readonly layout: MessageLayout;
  readonly msgType: string;
  readonly policyChain: readonly ValidationPolicy[];
  readonly findings: Finding[];
}

function report(
  ctx: RuleContext,
  ruleId: RuleId,
  path: string,
  message: string,
  tag?: number,
  provenance?: Field['provenance']
): void {
  const severity: Severity = resolveSeverity(ctx.policyChain, ruleId, ctx.msgType, tag);
  if (severity === 'off') return;
  ctx.findings.push({
    ruleId,
    severity,
    path,
    message,
    ...(tag !== undefined ? { tag } : {}),
    ...(provenance !== undefined ? { provenance } : {}),
  });
}

function pathFor(prefix: string, tag: number, occurrence: number): string {
  const key = occurrence === 0 ? String(tag) : `${tag}#${occurrence}`;
  return prefix === '' ? key : `${prefix}/${key}`;
}

/** Integer-valued FIX types. */
const INT_TYPES = new Set(['INT', 'LENGTH', 'SEQNUM', 'NUMINGROUP', 'DAYOFMONTH']);
const DECIMAL_TYPES = new Set(['QTY', 'PRICE', 'FLOAT', 'AMT', 'PERCENTAGE', 'PRICEOFFSET']);

function checkValueType(
  ctx: RuleContext,
  tag: number,
  value: string,
  path: string,
  prov: Field['provenance']
): void {
  const def = ctx.dict.fields.get(tag);
  if (!def) return;
  const t = def.type.toUpperCase();
  let ok = true;
  if (INT_TYPES.has(t)) ok = /^-?\d+$/.test(value);
  else if (DECIMAL_TYPES.has(t)) ok = /^-?\d+(\.\d+)?$/.test(value);
  else if (t === 'BOOLEAN') ok = value === 'Y' || value === 'N';
  else if (t === 'CHAR') ok = value.length === 1;
  else if (t === 'UTCTIMESTAMP') ok = /^\d{8}-\d{2}:\d{2}:\d{2}(\.\d{3,9})?$/.test(value);
  else if (t === 'UTCDATEONLY' || t === 'LOCALMKTDATE') ok = /^\d{8}$/.test(value);
  else if (t === 'MONTHYEAR') ok = /^\d{6}(\d{2}|w[1-5])?$/.test(value);
  if (!ok) {
    report(
      ctx,
      'type-mismatch',
      path,
      `${def.name}(${tag}) value '${value}' is not a valid ${def.type}`,
      tag,
      prov
    );
  }
}

function checkEnums(
  ctx: RuleContext,
  tag: number,
  value: string,
  path: string,
  prov: Field['provenance']
): void {
  const def = ctx.dict.fields.get(tag);
  if (!def?.enums || def.enums.size === 0) return;
  if (!def.enums.has(value)) {
    report(
      ctx,
      'enum-unknown',
      path,
      `${def.name}(${tag}) value '${value}' is not a defined enum value`,
      tag,
      prov
    );
  }
}

/** Validate one field list level against an expected flat layout. */
function validateLevel(
  ctx: RuleContext,
  fields: FieldList,
  expected: readonly FlatLayoutItem[] | undefined,
  prefix: string
): void {
  const occurrences = new Map<number, number>();
  const seenSimple = new Map<number, Field>();

  for (const field of fields) {
    const tag = field.kind === 'field' ? field.tag : field.countTag;
    const occurrence = occurrences.get(tag) ?? 0;
    occurrences.set(tag, occurrence + 1);
    const path = pathFor(prefix, tag, occurrence);

    // duplicate-tag: same simple tag twice at one level (groups aside).
    if (field.kind === 'field') {
      if (seenSimple.has(tag)) {
        report(
          ctx,
          'duplicate-tag',
          path,
          `Tag ${tag} appears more than once at the same level`,
          tag,
          field.provenance
        );
      }
      seenSimple.set(tag, field);
    }

    // unknown-tag
    if (!ctx.dict.fields.has(tag)) {
      report(
        ctx,
        'unknown-tag',
        path,
        `Tag ${tag} is not defined in the effective dictionary`,
        tag,
        field.provenance
      );
    }

    if (field.kind === 'field') {
      checkEnums(ctx, tag, field.value, path, field.provenance);
      checkValueType(ctx, tag, field.value, path, field.provenance);

      // group-count-mismatch: explicit count field with no matching group
      // entries at this level (both explicitly set contradicting each other
      // is modelled as: simple field with NUMINGROUP type + sibling group).
      const def = ctx.dict.fields.get(tag);
      if (def && def.type.toUpperCase() === 'NUMINGROUP') {
        const sibling = fields.find((f) => f.kind === 'group' && f.countTag === tag);
        if (sibling && sibling.kind === 'group') {
          if (String(sibling.entries.length) !== field.value) {
            report(
              ctx,
              'group-count-mismatch',
              path,
              `${def.name}(${tag}) explicitly set to ${field.value} but the group has ${sibling.entries.length} entries`,
              tag,
              field.provenance
            );
          }
        } else {
          report(
            ctx,
            'group-count-mismatch',
            path,
            `${def.name}(${tag}) set to ${field.value} but no group entries are present`,
            tag,
            field.provenance
          );
        }
      }
    } else {
      // Recurse into group entries against the group's member layout.
      const groupDef = expected ? findGroupDef(expected, field.countTag) : undefined;
      field.entries.forEach((entry, i) => {
        const entryPrefix = `${pathFor(prefix, tag, occurrence)}[${i}]`;
        validateLevel(ctx, entry, groupDef?.items, entryPrefix);
        if (groupDef) checkEntryOrder(ctx, entry, groupDef, entryPrefix);
      });
    }
  }

  // required-missing at this level.
  if (expected) {
    const presentTags = new Set(fields.map((f) => (f.kind === 'field' ? f.tag : f.countTag)));
    for (const item of expected) {
      const tag = item.kind === 'field' ? item.tag : item.countTag;
      if (!item.required || SYNTHETIC_TAGS.has(tag) || presentTags.has(tag)) continue;
      const name = ctx.dict.fields.get(tag)?.name ?? `Tag${tag}`;
      report(ctx, 'required-missing', prefix, `Required field ${name}(${tag}) is missing`, tag);
    }
  }
}

/** group-field-order: entry fields should follow the dictionary member
 * order, starting with the delimiter (first member). */
function checkEntryOrder(
  ctx: RuleContext,
  entry: FieldList,
  groupDef: Extract<FlatLayoutItem, { kind: 'group' }>,
  entryPrefix: string
): void {
  const order = new Map<number, number>();
  groupDef.items.forEach((item, i) => {
    order.set(item.kind === 'field' ? item.tag : item.countTag, i);
  });
  const delimiterTag =
    groupDef.items[0] &&
    (groupDef.items[0].kind === 'field' ? groupDef.items[0].tag : groupDef.items[0].countTag);

  const firstTag = entry[0] && (entry[0].kind === 'field' ? entry[0].tag : entry[0].countTag);
  if (delimiterTag !== undefined && firstTag !== undefined && firstTag !== delimiterTag) {
    const name = ctx.dict.fields.get(delimiterTag)?.name ?? `Tag${delimiterTag}`;
    report(
      ctx,
      'group-field-order',
      entryPrefix,
      `Group entry should start with its delimiter ${name}(${delimiterTag})`,
      firstTag,
      entry[0]?.provenance
    );
    return;
  }

  let lastIndex = -1;
  for (const field of entry) {
    const tag = field.kind === 'field' ? field.tag : field.countTag;
    const index = order.get(tag);
    if (index === undefined) continue; // unknown members flagged elsewhere
    if (index < lastIndex) {
      report(
        ctx,
        'group-field-order',
        entryPrefix,
        `Tag ${tag} is out of dictionary order within the group entry`,
        tag,
        field.provenance
      );
      return; // one ordering finding per entry is enough signal
    }
    lastIndex = index;
  }
}

/** header-trailer-order: header tags after body tags, or trailer tags not
 * at the end of the composed field list (advisory — the renderer reorders). */
function checkHeaderTrailerOrder(ctx: RuleContext, msg: FixMessage): void {
  let seenBody = false;
  const fields = msg.fields;
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]!;
    const tag = field.kind === 'field' ? field.tag : field.countTag;
    if (SYNTHETIC_TAGS.has(tag)) continue;
    const isHeader = ctx.layout.headerTags.has(tag);
    const isTrailer = ctx.layout.trailerTags.has(tag);
    if (isHeader && seenBody) {
      report(
        ctx,
        'header-trailer-order',
        pathFor('', tag, 0),
        `Header field ${tag} appears after body fields`,
        tag,
        field.provenance
      );
    } else if (isTrailer && i < fields.length - 1) {
      report(
        ctx,
        'header-trailer-order',
        pathFor('', tag, 0),
        `Trailer field ${tag} is not at the end of the message`,
        tag,
        field.provenance
      );
    } else if (!isHeader && !isTrailer) {
      seenBody = true;
    }
  }
}

export function validateMessage(
  msg: FixMessage,
  dict: Dictionary,
  policyChain: readonly ValidationPolicy[] = []
): Finding[] {
  const layout = messageLayout(dict, msg.msgType);
  const ctx: RuleContext = { dict, layout, msgType: msg.msgType, policyChain, findings: [] };

  // Unknown message type is itself a dictionary-level observation.
  if (!dict.messages.has(msg.msgType)) {
    report(
      ctx,
      'unknown-tag',
      '',
      `Message type '${msg.msgType}' is not defined in the effective dictionary`,
      35
    );
  }

  // Body + header fields both live in msg.fields; validate against the
  // combined expected layout so header fields (49/56/...) resolve.
  const combined = [...layout.header, ...layout.body, ...layout.trailer].filter((item) => {
    const tag = item.kind === 'field' ? item.tag : item.countTag;
    return !SYNTHETIC_TAGS.has(tag);
  });
  validateLevel(ctx, msg.fields, combined, '');
  checkHeaderTrailerOrder(ctx, msg);

  return ctx.findings;
}
