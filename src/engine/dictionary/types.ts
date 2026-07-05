/**
 * Dictionary model (brief §3.2).
 *
 * Dictionaries are advisory, not authoritative: they inform validation and
 * rendering but never block. The effective dictionary is resolved as
 * base → profile overlay → system overlay (see overlay.ts / resolve.ts).
 */

export type FixVersionId = 'FIX.4.2' | 'FIX.4.4' | 'FIX.5.0SP2';

export const FIX_VERSIONS: readonly FixVersionId[] = ['FIX.4.2', 'FIX.4.4', 'FIX.5.0SP2'];

/** BeginString(8) value a version renders with (5.0+ rides on FIXT.1.1). */
export function beginStringFor(version: FixVersionId): string {
  return version === 'FIX.5.0SP2' ? 'FIXT.1.1' : version;
}

export interface FieldDef {
  readonly tag: number;
  readonly name: string;
  /** FIX type name (QTY, PRICE, CHAR, ...). Advisory. */
  readonly type: string;
  /** enum value → human label. */
  readonly enums?: ReadonlyMap<string, string>;
}

export type LayoutItem =
  | { readonly kind: 'field'; readonly tag: number; readonly required: boolean }
  | { readonly kind: 'component'; readonly name: string; readonly required: boolean }
  | {
      readonly kind: 'group';
      readonly countTag: number;
      readonly required: boolean;
      readonly items: readonly LayoutItem[];
    };

export interface MessageDef {
  readonly msgType: string;
  readonly name: string;
  /** 'admin' | 'app' — advisory categorisation from the source dictionary. */
  readonly category?: string;
  readonly items: readonly LayoutItem[];
}

export interface Dictionary {
  readonly version: FixVersionId;
  /** True when built from a hand-authored subset rather than a full spec. */
  readonly partial: boolean;
  readonly fields: ReadonlyMap<number, FieldDef>;
  readonly components: ReadonlyMap<string, readonly LayoutItem[]>;
  readonly header: readonly LayoutItem[];
  readonly trailer: readonly LayoutItem[];
  readonly messages: ReadonlyMap<string, MessageDef>;
}

export function fieldName(dict: Dictionary, tag: number): string | undefined {
  return dict.fields.get(tag)?.name;
}

export function enumLabel(dict: Dictionary, tag: number, value: string): string | undefined {
  return dict.fields.get(tag)?.enums?.get(value);
}
