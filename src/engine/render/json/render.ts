/**
 * Configurable JSON renderer (brief §5.2): an array of objects, one per
 * message, repeating groups as arrays of sub-objects — generalized by a
 * profile-supplied mapping so the exact in-house format never ships here.
 */
import type { Field, FieldList, FixMessage } from '../../message/types.ts';
import type { Dictionary } from '../../dictionary/types.ts';
import type { JsonGroupKeyStyle, JsonKeyStyle, JsonMappingConfig } from './types.ts';

const INT_TYPES = new Set(['INT', 'LENGTH', 'SEQNUM', 'NUMINGROUP', 'DAYOFMONTH', 'QTY']);
const FLOAT_TYPES = new Set(['PRICE', 'FLOAT', 'AMT', 'PERCENTAGE', 'PRICEOFFSET', 'QTY']);

function keyFor(tag: number, dict: Dictionary, style: JsonKeyStyle): string {
  if (style === 'tag') return String(tag);
  const name = dict.fields.get(tag)?.name;
  if (style === 'name') return name ?? String(tag);
  return style.alias[String(tag)] ?? name ?? String(tag);
}

function groupKeyFor(countTag: number, dict: Dictionary, style: JsonGroupKeyStyle): string {
  if (style === 'countTag') return String(countTag);
  const name = dict.fields.get(countTag)?.name;
  if (style === 'countName') return name ?? String(countTag);
  return style.alias[String(countTag)] ?? name ?? String(countTag);
}

function typedValue(tag: number, value: string, dict: Dictionary, cfg: JsonMappingConfig): unknown {
  if (!cfg.typedValues) return value;
  const type = dict.fields.get(tag)?.type.toUpperCase();
  if (!type) return value;
  if (type === 'BOOLEAN') {
    if (value === 'Y') return true;
    if (value === 'N') return false;
    return value;
  }
  if (INT_TYPES.has(type) && /^-?\d+$/.test(value)) return Number(value);
  if (FLOAT_TYPES.has(type) && /^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

function objectFor(
  fields: FieldList,
  dict: Dictionary,
  cfg: JsonMappingConfig,
  omit: ReadonlySet<number>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const tag = field.kind === 'field' ? field.tag : field.countTag;
    if (omit.has(tag)) continue;
    if (field.kind === 'field') {
      out[keyFor(tag, dict, cfg.keyStyle)] = typedValue(tag, field.value, dict, cfg);
    } else {
      if (cfg.emitCounts) {
        out[keyFor(tag, dict, cfg.keyStyle)] = cfg.typedValues
          ? field.entries.length
          : String(field.entries.length);
      }
      out[groupKeyFor(tag, dict, cfg.groupKey)] = field.entries.map((entry) =>
        objectFor(entry, dict, cfg, omit)
      );
    }
  }
  return out;
}

export function renderJsonMessage(
  msg: FixMessage,
  dict: Dictionary,
  cfg: JsonMappingConfig
): unknown {
  const omit = new Set(cfg.omitTags ?? []);
  // 8 and 35 are synthesized (like the tag=value renderer); 9/10 are wire
  // arithmetic and never appear in JSON output.
  const synthetic: Field[] = [];
  const has = (tag: number) =>
    msg.fields.some((f) => (f.kind === 'field' ? f.tag : f.countTag) === tag);
  const prov = { sourceId: 'renderer', sourceLabel: 'Renderer' };
  if (!has(8)) synthetic.push({ kind: 'field', tag: 8, value: msg.beginString, provenance: prov });
  if (!has(35)) synthetic.push({ kind: 'field', tag: 35, value: msg.msgType, provenance: prov });

  const body = objectFor([...synthetic, ...msg.fields], dict, cfg, omit);

  if (cfg.envelope?.message) {
    const messageKey = cfg.envelope.messageKey ?? 'message';
    return { ...cfg.envelope.message, [messageKey]: body };
  }
  return body;
}

/** Batch export: one array (optionally wrapped) containing every message. */
export function renderJsonBatch(
  messages: readonly FixMessage[],
  dict: Dictionary,
  cfg: JsonMappingConfig
): unknown {
  const array = messages.map((m) => renderJsonMessage(m, dict, cfg));
  if (cfg.envelope?.topLevelKey) {
    return { [cfg.envelope.topLevelKey]: array };
  }
  return array;
}

export function renderJsonText(
  messages: readonly FixMessage[],
  dict: Dictionary,
  cfg: JsonMappingConfig
): string {
  return JSON.stringify(renderJsonBatch(messages, dict, cfg), null, 2);
}
