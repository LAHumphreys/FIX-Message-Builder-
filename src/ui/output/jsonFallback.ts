import type { JsonMappingConfig } from '../../engine/index.ts';

/**
 * Used when the loaded profile declares no renderers.json mapping: the JSON
 * tab and the transport send still need to render *something* (the tool
 * never refuses to render). Dictionary-name keys, arrays without counts,
 * typed values — a reasonable generic shape until the profile defines the
 * real in-house one.
 */
export const FALLBACK_JSON_MAPPING: JsonMappingConfig = {
  keyStyle: 'name',
  groupKey: 'countName',
  emitCounts: false,
  typedValues: true,
};
