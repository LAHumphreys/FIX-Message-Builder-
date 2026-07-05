/**
 * Compact JSON dictionary format (produced by scripts/convert-quickfix.mjs)
 * and its loader. Layout items are tuple-encoded to keep the checked-in data
 * small: [tag], [tag, 1], ["#Component"], ["#Component", 1], or
 * {"g": countTag, "req"?: 1, "items": [...]}.
 */
import type { Dictionary, FieldDef, FixVersionId, LayoutItem, MessageDef } from './types.ts';

export type JsonLayoutItem =
  | readonly [number | string]
  | readonly [number | string, number]
  | { readonly g: number; readonly req?: number; readonly items: readonly JsonLayoutItem[] };

export type JsonFieldDef =
  readonly [string, string] | readonly [string, string, Readonly<Record<string, string>>];

export interface DictionaryJson {
  readonly fix: string;
  readonly formatVersion: number;
  readonly partial: boolean;
  readonly fields: Readonly<Record<string, JsonFieldDef>>;
  readonly components: Readonly<Record<string, readonly JsonLayoutItem[]>>;
  readonly header: readonly JsonLayoutItem[];
  readonly trailer: readonly JsonLayoutItem[];
  readonly messages: Readonly<
    Record<
      string,
      { readonly name: string; readonly cat?: string; readonly items: readonly JsonLayoutItem[] }
    >
  >;
}

export class DictionaryFormatError extends Error {
  constructor(
    message: string,
    readonly path: string
  ) {
    super(`${path}: ${message}`);
    this.name = 'DictionaryFormatError';
  }
}

function convertLayoutItem(item: JsonLayoutItem, path: string): LayoutItem {
  if (Array.isArray(item)) {
    const [ref, req] = item as readonly [number | string, number?];
    const required = req === 1;
    if (typeof ref === 'number') {
      return { kind: 'field', tag: ref, required };
    }
    if (typeof ref === 'string' && ref.startsWith('#')) {
      return { kind: 'component', name: ref.slice(1), required };
    }
    throw new DictionaryFormatError(`invalid layout ref ${JSON.stringify(ref)}`, path);
  }
  if (typeof item === 'object' && item !== null && 'g' in item) {
    return {
      kind: 'group',
      countTag: item.g,
      required: item.req === 1,
      items: item.items.map((sub, i) => convertLayoutItem(sub, `${path}/items/${i}`)),
    };
  }
  throw new DictionaryFormatError(`invalid layout item ${JSON.stringify(item)}`, path);
}

function convertLayout(items: readonly JsonLayoutItem[], path: string): LayoutItem[] {
  return items.map((item, i) => convertLayoutItem(item, `${path}/${i}`));
}

/**
 * Convert the compact JSON into the runtime Dictionary model.
 * Throws DictionaryFormatError with a JSON-pointer-style path on bad input.
 */
export function dictionaryFromJson(json: DictionaryJson, version: FixVersionId): Dictionary {
  if (json.formatVersion !== 1) {
    throw new DictionaryFormatError(
      `unsupported formatVersion ${json.formatVersion}`,
      '/formatVersion'
    );
  }
  const fields = new Map<number, FieldDef>();
  for (const [tagStr, def] of Object.entries(json.fields)) {
    const tag = Number(tagStr);
    if (!Number.isInteger(tag) || tag <= 0) {
      throw new DictionaryFormatError(`invalid tag '${tagStr}'`, '/fields');
    }
    const [name, type, enums] = def;
    fields.set(tag, {
      tag,
      name,
      type,
      ...(enums ? { enums: new Map(Object.entries(enums)) } : {}),
    });
  }

  const components = new Map<string, readonly LayoutItem[]>();
  for (const [name, items] of Object.entries(json.components)) {
    components.set(name, convertLayout(items, `/components/${name}`));
  }

  const messages = new Map<string, MessageDef>();
  for (const [msgType, def] of Object.entries(json.messages)) {
    messages.set(msgType, {
      msgType,
      name: def.name,
      ...(def.cat ? { category: def.cat } : {}),
      items: convertLayout(def.items, `/messages/${msgType}/items`),
    });
  }

  return {
    version,
    partial: json.partial,
    fields,
    components,
    header: convertLayout(json.header, '/header'),
    trailer: convertLayout(json.trailer, '/trailer'),
    messages,
  };
}
