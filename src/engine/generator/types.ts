/**
 * Generators (brief §3.6) — deterministic-where-possible value producers.
 * All entropy and time comes through GeneratorContext so tests can inject
 * a fixed clock and seeded randomness.
 */

export type TimestampPrecision = 'seconds' | 'millis' | 'micros';

export type SequenceScope = 'message' | 'batch' | 'persistent';

export type GeneratorDef =
  | {
      readonly kind: 'sequence';
      readonly scope: SequenceScope;
      readonly start?: number;
      /** Zero-pad to this width. */
      readonly pad?: number;
    }
  | { readonly kind: 'timestamp'; readonly precision: TimestampPrecision }
  | { readonly kind: 'template'; readonly template: string }
  | { readonly kind: 'shared'; readonly of: string }
  | { readonly kind: 'random'; readonly style: 'hex' | 'uuid'; readonly length?: number };

/**
 * Persistent counters (sequence scope 'persistent'). The UI supplies a
 * per-session store seeded from a user-editable start value (per the
 * locked decision: no cross-restart persistence in v1).
 */
export interface CounterStore {
  /** Return the next value for the key, starting at `start` if unseen. */
  next(key: string, start: number): number;
}

/** In-memory CounterStore — per-session semantics, also used by tests. */
export function memoryCounterStore(seed?: ReadonlyMap<string, number>): CounterStore {
  const counters = new Map<string, number>(seed);
  return {
    next(key, start) {
      const value = counters.get(key) ?? start;
      counters.set(key, value + 1);
      return value;
    },
  };
}

/** Per-batch evaluation scope: shared values and batch-scoped counters. */
export class BatchScope {
  readonly sharedValues = new Map<string, string>();
  readonly counters = new Map<string, number>();

  nextCounter(key: string, start: number): number {
    const value = this.counters.get(key) ?? start;
    this.counters.set(key, value + 1);
    return value;
  }
}

export interface GeneratorContext {
  /** UTC time source. */
  readonly clock: () => Date;
  /** Uniform [0,1) — seeded in tests. */
  readonly random: () => number;
  readonly counters: CounterStore;
  readonly batch: BatchScope;
  /** Per-message counters; a fresh map for every message build. */
  readonly message: Map<string, number>;
}
