import { describe, expect, it } from 'vitest';
import {
  evaluateGenerator,
  formatFixTimestamp,
  interpolateTemplate,
  mulberry32,
  type GeneratorDefs,
} from './evaluate.ts';
import { BatchScope, memoryCounterStore, type GeneratorContext } from './types.ts';

const FIXED = new Date(Date.UTC(2026, 6, 5, 9, 30, 15, 123));

function makeCtx(overrides?: Partial<GeneratorContext>): GeneratorContext {
  return {
    clock: () => FIXED,
    random: mulberry32(42),
    counters: memoryCounterStore(),
    batch: new BatchScope(),
    message: new Map(),
    ...overrides,
  };
}

const defs: GeneratorDefs = new Map([
  ['msgSeq', { kind: 'sequence', scope: 'message' }],
  ['rowSeq', { kind: 'sequence', scope: 'batch', pad: 3 }],
  ['persistSeq', { kind: 'sequence', scope: 'persistent', start: 100 }],
  ['now', { kind: 'timestamp', precision: 'micros' }],
  ['nowMs', { kind: 'timestamp', precision: 'millis' }],
  ['nowS', { kind: 'timestamp', precision: 'seconds' }],
  ['clOrdId', { kind: 'template', template: 'CLORD-{date:yyyyMMdd}-{seq:4}' }],
  ['listId', { kind: 'shared', of: 'clOrdId' }],
  ['token', { kind: 'random', style: 'hex', length: 12 }],
  ['uuid', { kind: 'random', style: 'uuid' }],
] as const);

describe('timestamp formatting', () => {
  it.each([
    { precision: 'seconds', expected: '20260705-09:30:15' },
    { precision: 'millis', expected: '20260705-09:30:15.123' },
    { precision: 'micros', expected: '20260705-09:30:15.123000' },
  ] as const)('$precision', ({ precision, expected }) => {
    expect(formatFixTimestamp(FIXED, precision)).toBe(expected);
  });
});

describe('sequence scopes', () => {
  it('message scope resets per message, increments within one', () => {
    const ctx = makeCtx();
    expect(evaluateGenerator(defs, 'msgSeq', ctx)).toBe('1');
    expect(evaluateGenerator(defs, 'msgSeq', ctx)).toBe('2');
    const nextMessage = makeCtx({ batch: ctx.batch, counters: ctx.counters });
    expect(evaluateGenerator(defs, 'msgSeq', nextMessage)).toBe('1');
  });

  it('batch scope continues across messages in a batch, resets with a new batch', () => {
    const batch = new BatchScope();
    const row1 = makeCtx({ batch });
    const row2 = makeCtx({ batch });
    expect(evaluateGenerator(defs, 'rowSeq', row1)).toBe('001');
    expect(evaluateGenerator(defs, 'rowSeq', row2)).toBe('002');
    expect(evaluateGenerator(defs, 'rowSeq', makeCtx())).toBe('001');
  });

  it('persistent scope rides the CounterStore across batches', () => {
    const counters = memoryCounterStore();
    expect(evaluateGenerator(defs, 'persistSeq', makeCtx({ counters }))).toBe('100');
    expect(evaluateGenerator(defs, 'persistSeq', makeCtx({ counters }))).toBe('101');
  });
});

describe('templates', () => {
  it('interpolates date and padded batch-scoped sequence', () => {
    const ctx = makeCtx();
    expect(evaluateGenerator(defs, 'clOrdId', ctx)).toBe('CLORD-20260705-0001');
    expect(evaluateGenerator(defs, 'clOrdId', ctx)).toBe('CLORD-20260705-0002');
  });

  it('renders rand as seeded hex and leaves unknown placeholders verbatim', () => {
    const ctx = makeCtx();
    const out = interpolateTemplate('{rand:6}-{nope}-{date:yyyy}', 'k', ctx);
    expect(out).toMatch(/^[0-9a-f]{6}-\{nope\}-2026$/);
  });
});

describe('shared generators (the ListID mechanism)', () => {
  it('evaluates once per batch and injects the same value everywhere', () => {
    const batch = new BatchScope();
    const a = evaluateGenerator(defs, 'listId', makeCtx({ batch }));
    const b = evaluateGenerator(defs, 'listId', makeCtx({ batch }));
    expect(a).toBe('CLORD-20260705-0001');
    expect(b).toBe(a);
    // New batch, new value.
    expect(evaluateGenerator(defs, 'listId', makeCtx())).toBe('CLORD-20260705-0001');
  });
});

describe('random', () => {
  it('is byte-identical under the same seed', () => {
    const a = evaluateGenerator(defs, 'token', makeCtx());
    const b = evaluateGenerator(defs, 'token', makeCtx());
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{12}$/);
  });

  it('produces RFC-4122-shaped uuids', () => {
    expect(evaluateGenerator(defs, 'uuid', makeCtx())).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });
});

describe('failure modes', () => {
  it('unknown reference renders a visible placeholder, never throws', () => {
    expect(evaluateGenerator(defs, 'missing', makeCtx())).toBe('{missing?}');
  });

  it('self-referential shared generators terminate with a placeholder', () => {
    const cyclic: GeneratorDefs = new Map([['loop', { kind: 'shared', of: 'loop' }]]);
    expect(evaluateGenerator(cyclic, 'loop', makeCtx())).toBe('{loop?}');
  });
});
