/**
 * Configurable JSON renderer mapping (brief §5.2). The in-house work format
 * is one configuration of this mechanism; only a fictional demo mapping
 * ships in this repo.
 */

export type JsonKeyStyle = 'tag' | 'name' | { readonly alias: Readonly<Record<string, string>> };

export type JsonGroupKeyStyle =
  'countName' | 'countTag' | { readonly alias: Readonly<Record<string, string>> };

export interface JsonEnvelopeConfig {
  /** Static per-message wrapper fields; the message itself sits under messageKey. */
  readonly message?: Readonly<Record<string, string>>;
  /** Key the message object is nested under when a message envelope is used. */
  readonly messageKey?: string;
  /** Wrap the top-level array in an object under this key. */
  readonly topLevelKey?: string;
}

export interface JsonMappingConfig {
  /** Object keys: tag numbers, dictionary names, or a custom alias map. */
  readonly keyStyle: JsonKeyStyle;
  /** Group keys: count-tag name, count-tag number, or alias map. */
  readonly groupKey: JsonGroupKeyStyle;
  /** Emit the count field alongside the entries array. */
  readonly emitCounts: boolean;
  /** Emit native JSON numbers/booleans where the dictionary type permits. */
  readonly typedValues: boolean;
  /** Suppress these tags (e.g. [8, 9, 10, 52] when the consumer adds them). */
  readonly omitTags?: readonly number[];
  readonly envelope?: JsonEnvelopeConfig;
}
