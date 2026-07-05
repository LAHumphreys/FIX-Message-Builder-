/**
 * Layout walker — the single component-expansion routine shared by renderer
 * ordering (header/body/trailer order) and group-aware validation.
 */
import type { Dictionary, LayoutItem, MessageDef } from './types.ts';

/** A layout item with component references expanded away. */
export type FlatLayoutItem =
  | { readonly kind: 'field'; readonly tag: number; readonly required: boolean }
  | {
      readonly kind: 'group';
      readonly countTag: number;
      readonly required: boolean;
      readonly items: readonly FlatLayoutItem[];
    };

/**
 * Expand component references recursively. Unknown component names expand to
 * nothing (advisory dictionaries never block). A `required` component marks
 * its first-level required members as required; an optional component makes
 * all its members optional (per FIX component semantics).
 */
export function expandLayout(
  items: readonly LayoutItem[],
  dict: Dictionary,
  parentOptional = false
): FlatLayoutItem[] {
  const out: FlatLayoutItem[] = [];
  for (const item of items) {
    if (item.kind === 'field') {
      out.push(parentOptional && item.required ? { ...item, required: false } : item);
    } else if (item.kind === 'group') {
      const required = parentOptional ? false : item.required;
      out.push({
        kind: 'group',
        countTag: item.countTag,
        required,
        items: expandLayout(item.items, dict, false),
      });
    } else {
      const componentItems = dict.components.get(item.name);
      if (componentItems) {
        out.push(...expandLayout(componentItems, dict, parentOptional || !item.required));
      }
    }
  }
  return out;
}

export interface MessageLayout {
  readonly header: readonly FlatLayoutItem[];
  readonly body: readonly FlatLayoutItem[];
  readonly trailer: readonly FlatLayoutItem[];
  /** Tags that belong to the header/trailer, for ordering decisions. */
  readonly headerTags: ReadonlySet<number>;
  readonly trailerTags: ReadonlySet<number>;
}

/**
 * Resolve the full expected layout for a message type. Unknown message types
 * yield an empty body (header/trailer still apply): rendering must proceed.
 */
export function messageLayout(dict: Dictionary, msgType: string): MessageLayout {
  const def: MessageDef | undefined = dict.messages.get(msgType);
  const header = expandLayout(dict.header, dict);
  const trailer = expandLayout(dict.trailer, dict);
  return {
    header,
    body: def ? expandLayout(def.items, dict) : [],
    trailer,
    headerTags: new Set(collectTags(header)),
    trailerTags: new Set(collectTags(trailer)),
  };
}

/** Top-level tags of a flat layout (group count tags included, members not). */
export function collectTags(items: readonly FlatLayoutItem[]): number[] {
  return items.map((i) => (i.kind === 'field' ? i.tag : i.countTag));
}

/** Find a group definition (by count tag) anywhere in a flat layout. */
export function findGroupDef(
  items: readonly FlatLayoutItem[],
  countTag: number
): Extract<FlatLayoutItem, { kind: 'group' }> | undefined {
  for (const item of items) {
    if (item.kind === 'group') {
      if (item.countTag === countTag) return item;
      const nested = findGroupDef(item.items, countTag);
      if (nested) return nested;
    }
  }
  return undefined;
}
