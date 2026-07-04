/**
 * Canonical message representation (brief §3.1).
 *
 * A message is an ordered list of fields. A field is either a simple
 * (tag, value) pair or a repeating group. Order is significant and preserved.
 * All values are strings internally — typing is a dictionary/rendering concern.
 * Every field carries provenance: which fragment or user input set it, and
 * whether it overwrote an earlier value.
 */

/** Where a field's value came from. */
export interface Provenance {
  /** Identifier of the fragment, generator, or user input that set the value. */
  readonly sourceId: string;
  /** Human-readable label for UI display, e.g. "Route: DMA London". */
  readonly sourceLabel: string;
  /** Present when this value replaced one set earlier in the merge order. */
  readonly overwrote?: Provenance;
}

/** A simple tag=value field. Values are always strings internally. */
export interface SimpleField {
  readonly kind: 'field';
  readonly tag: number;
  readonly value: string;
  readonly provenance: Provenance;
}

/**
 * A repeating group: the count tag (e.g. NoOrders 73) and its entries.
 * Each entry is itself an ordered field list, so groups nest arbitrarily.
 */
export interface RepeatingGroup {
  readonly kind: 'group';
  readonly countTag: number;
  readonly entries: readonly FieldList[];
  readonly provenance: Provenance;
}

export type Field = SimpleField | RepeatingGroup;

export type FieldList = readonly Field[];

/** A complete message under construction or ready to render. */
export interface FixMessage {
  /** e.g. "FIX.4.4", "FIXT.1.1" — rendered into BeginString(8). */
  readonly beginString: string;
  /** MsgType(35) value, e.g. "D", "E", "AB". */
  readonly msgType: string;
  /** Ordered body fields (header/trailer assembly is a renderer concern). */
  readonly fields: FieldList;
}
