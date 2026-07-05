/**
 * Dictionary overlay application (brief §3.2): profile and system overlays
 * extend/override the base dictionary. Resolution order is
 * base → profile overlay → system overlay (applied left to right).
 */
import type { Dictionary, FieldDef, LayoutItem, MessageDef } from './types.ts';
import { dictionaryFromJson, type JsonFieldDef, type JsonLayoutItem } from './json.ts';
import type { DictionaryOverlay, FieldOverlay } from '../profile/types.ts';

function isTupleFieldDef(def: JsonFieldDef | FieldOverlay): def is JsonFieldDef {
  return Array.isArray(def);
}

function convertItems(items: readonly JsonLayoutItem[], path: string): readonly LayoutItem[] {
  // Reuse the loader's conversion by wrapping in a minimal document.
  const dict = dictionaryFromJson(
    {
      fix: 'overlay',
      formatVersion: 1,
      partial: true,
      fields: {},
      components: { __items: items },
      header: [],
      trailer: [],
      messages: {},
    },
    'FIX.4.4'
  );
  void path;
  return dict.components.get('__items')!;
}

function applyRequiredFlips(
  items: readonly LayoutItem[],
  flips: Readonly<Record<string, boolean>>
): readonly LayoutItem[] {
  return items.map((item) => {
    if (item.kind === 'field') {
      const flip = flips[String(item.tag)];
      return flip === undefined ? item : { ...item, required: flip };
    }
    if (item.kind === 'group') {
      const flip = flips[String(item.countTag)];
      return {
        ...item,
        required: flip ?? item.required,
        items: applyRequiredFlips(item.items, flips),
      };
    }
    return item;
  });
}

export function applyOverlay(dict: Dictionary, overlay: DictionaryOverlay | undefined): Dictionary {
  if (!overlay) return dict;

  const fields = new Map(dict.fields);
  for (const [tagStr, def] of Object.entries(overlay.fields ?? {})) {
    const tag = Number(tagStr);
    const existing = fields.get(tag);
    if (isTupleFieldDef(def)) {
      const [name, type, enums] = def;
      fields.set(tag, {
        tag,
        name,
        type,
        ...(enums ? { enums: new Map(Object.entries(enums)) } : {}),
      });
    } else {
      const merged: FieldDef = {
        tag,
        name: def.name ?? existing?.name ?? `Tag${tag}`,
        type: def.type ?? existing?.type ?? 'STRING',
        ...(def.enums || existing?.enums
          ? {
              enums: new Map([
                ...(def.enumMode === 'replace' ? [] : (existing?.enums ?? new Map())),
                ...Object.entries(def.enums ?? {}),
              ]),
            }
          : {}),
      };
      fields.set(tag, merged);
    }
  }

  const components = new Map(dict.components);
  for (const [name, items] of Object.entries(overlay.components ?? {})) {
    components.set(name, convertItems(items, `/components/${name}`));
  }

  const messages = new Map(dict.messages);
  for (const [msgType, msgOverlay] of Object.entries(overlay.messages ?? {})) {
    const existing = messages.get(msgType);
    let items: readonly LayoutItem[] =
      msgOverlay.items !== undefined
        ? convertItems(msgOverlay.items, `/messages/${msgType}/items`)
        : (existing?.items ?? []);
    if (msgOverlay.required) {
      items = applyRequiredFlips(items, msgOverlay.required);
    }
    const def: MessageDef = {
      msgType,
      name: msgOverlay.name ?? existing?.name ?? msgType,
      ...(existing?.category ? { category: existing.category } : {}),
      items,
    };
    messages.set(msgType, def);
  }

  return { ...dict, fields, components, messages };
}

/** base → profile overlay → system overlay. */
export function effectiveDictionary(
  base: Dictionary,
  profileOverlay?: DictionaryOverlay,
  systemOverlay?: DictionaryOverlay
): Dictionary {
  return applyOverlay(applyOverlay(base, profileOverlay), systemOverlay);
}
