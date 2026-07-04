import { describe, expect, it } from 'vitest';
import { field, findField, group } from './builders.ts';
import type { Provenance } from './types.ts';

const userInput: Provenance = { sourceId: 'user', sourceLabel: 'User input' };

describe('field builders', () => {
  it('preserves field order and nesting in groups', () => {
    const noOrders = group(
      73,
      [
        [field(11, 'ORD-1', userInput), field(38, '100', userInput)],
        [field(11, 'ORD-2', userInput), field(38, '200', userInput)],
      ],
      userInput
    );

    expect(noOrders.countTag).toBe(73);
    expect(noOrders.entries).toHaveLength(2);
    expect(noOrders.entries[0]?.map((f) => (f.kind === 'field' ? f.tag : f.countTag))).toEqual([
      11, 38,
    ]);
  });

  it('records overwrite provenance chains', () => {
    const fromFragment: Provenance = { sourceId: 'route:dma', sourceLabel: 'Route: DMA' };
    const overriding = field(100, 'XLON', {
      ...userInput,
      overwrote: fromFragment,
    });

    expect(overriding.provenance.overwrote?.sourceId).toBe('route:dma');
  });
});

describe('findField', () => {
  const fields = [
    field(35, 'D', userInput),
    group(73, [[field(11, 'ORD-1', userInput)]], userInput),
    field(55, 'DEMO', userInput),
  ];

  it.each([
    { tag: 35, expected: 'D' },
    { tag: 55, expected: 'DEMO' },
  ])('finds top-level tag $tag', ({ tag, expected }) => {
    expect(findField(fields, tag)?.value).toBe(expected);
  });

  it('does not descend into groups', () => {
    expect(findField(fields, 11)).toBeUndefined();
  });

  it('returns undefined for absent tags', () => {
    expect(findField(fields, 99)).toBeUndefined();
  });
});
