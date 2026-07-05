/**
 * Slots — user-facing inputs declared by fragments (brief §3.5).
 */

export type SlotType = 'string' | 'int' | 'decimal' | 'enum' | 'timestamp' | 'bool';

export type SlotEnumSource =
  | { readonly kind: 'dictionary' }
  | { readonly kind: 'inline'; readonly values: readonly { value: string; label: string }[] };

export interface SlotSpec {
  readonly tag: number;
  readonly label: string;
  readonly type: SlotType;
  readonly enumSource?: SlotEnumSource;
  /** Literal default value. */
  readonly default?: string;
  /** Generator reference producing the default at build time. */
  readonly generatorDefault?: string;
  readonly required?: boolean;
  /** Regex source for input validation (advisory — never blocks). */
  readonly pattern?: string;
}

/** A slot as surfaced to the UI after collection across the fragment stack. */
export interface ResolvedSlot {
  readonly spec: SlotSpec;
  /** Fragment that declared (or last redeclared) the slot. */
  readonly declaredBy: string;
}
