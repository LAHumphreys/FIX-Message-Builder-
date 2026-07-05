/**
 * Merge semantics decision table (brief §3.4). These tests define the
 * normative behaviour; the implementation follows them, not vice versa.
 */
import { describe, expect, it } from 'vitest';
import { mergeFragments, type MergeContext } from './merge.ts';
import type { Fragment, FragmentOp, MergeStage, SourcedFragment } from './types.ts';
import type { SimpleField, RepeatingGroup } from '../message/types.ts';

const ctx: MergeContext = {
  evaluateGenerator: (ref) => `<gen:${ref}>`,
};

function frag(
  id: string,
  stage: MergeStage,
  ops: readonly FragmentOp[],
  label = id
): SourcedFragment {
  const fragment: Fragment = { id, label, ops };
  return { fragment, stage };
}

const set = (tag: number, value: string): FragmentOp => ({ op: 'set', tag, value });
const remove = (tag: number): FragmentOp => ({ op: 'remove', tag });

function simple(fields: ReturnType<typeof mergeFragments>['fields'], tag: number): SimpleField {
  const hit = fields.find((f) => f.kind === 'field' && f.tag === tag);
  if (!hit || hit.kind !== 'field') throw new Error(`no simple field ${tag}`);
  return hit;
}

function grp(
  fields: ReturnType<typeof mergeFragments>['fields'],
  countTag: number
): RepeatingGroup {
  const hit = fields.find((f) => f.kind === 'group' && f.countTag === countTag);
  if (!hit || hit.kind !== 'group') throw new Error(`no group ${countTag}`);
  return hit;
}

describe('merge: simple field collisions', () => {
  it('last-wins in place: position preserved, provenance chained, notice emitted', () => {
    const result = mergeFragments(
      [
        frag('a', 'template', [set(40, '2'), set(54, '1'), set(59, '0')]),
        frag('b', 'dimension', [set(54, '2')]),
      ],
      ctx
    );
    // Position: 54 stays between 40 and 59.
    expect(result.fields.map((f) => (f.kind === 'field' ? f.tag : -1))).toEqual([40, 54, 59]);
    const side = simple(result.fields, 54);
    expect(side.value).toBe('2');
    expect(side.provenance.sourceId).toBe('b');
    expect(side.provenance.overwrote?.sourceId).toBe('a');
    expect(result.notices).toEqual([
      {
        kind: 'overwrite',
        tag: 54,
        path: '54',
        by: 'b',
        previous: 'a',
        previousValue: '1',
      },
    ]);
  });

  it('collision inside one fragment also chains and notices', () => {
    const result = mergeFragments([frag('a', 'template', [set(38, '1'), set(38, '2')])], ctx);
    expect(simple(result.fields, 38).value).toBe('2');
    expect(simple(result.fields, 38).provenance.overwrote?.sourceId).toBe('a');
    expect(result.notices).toHaveLength(1);
  });

  it('chains provenance to depth 3 across stages', () => {
    const result = mergeFragments(
      [
        frag('t', 'template', [set(100, 'A')]),
        frag('d', 'dimension', [set(100, 'B')]),
        frag('f', 'final', [set(100, 'C')]),
      ],
      ctx
    );
    const p = simple(result.fields, 100).provenance;
    expect([p.sourceId, p.overwrote?.sourceId, p.overwrote?.overwrote?.sourceId]).toEqual([
      'f',
      'd',
      't',
    ]);
  });
});

describe('merge: stage ordering (§3.4)', () => {
  it('applies stages in normative order regardless of input order', () => {
    const result = mergeFragments(
      [
        frag('final', 'final', [set(57, 'ENFORCED')]),
        frag('user', 'slots', [set(57, 'USER')]),
        frag('tmpl', 'template', [set(57, 'BASE')]),
      ],
      ctx
    );
    const f = simple(result.fields, 57);
    expect(f.value).toBe('ENFORCED');
    expect(f.provenance.overwrote?.sourceId).toBe('user');
    expect(f.provenance.overwrote?.overwrote?.sourceId).toBe('tmpl');
  });

  it('final fragment cannot be clobbered by slot values (routing enforcement)', () => {
    const result = mergeFragments(
      [
        frag('user', 'slots', [set(20101, 'USER-GW')]),
        frag('sysfinal', 'final', [set(20101, 'ALPHA-UAT-GW')]),
      ],
      ctx
    );
    expect(simple(result.fields, 20101).value).toBe('ALPHA-UAT-GW');
  });

  it('preserves relative order of fragments within the same stage', () => {
    const result = mergeFragments(
      [frag('d1', 'dimension', [set(1, 'one')]), frag('d2', 'dimension', [set(1, 'two')])],
      ctx
    );
    expect(simple(result.fields, 1).value).toBe('two');
    expect(simple(result.fields, 1).provenance.overwrote?.sourceId).toBe('d1');
  });
});

describe('merge: remove', () => {
  it('removes a field and records a notice', () => {
    const result = mergeFragments(
      [frag('a', 'template', [set(21, '1'), set(40, '2')]), frag('b', 'system', [remove(21)])],
      ctx
    );
    expect(result.fields.map((f) => (f.kind === 'field' ? f.tag : -1))).toEqual([40]);
    expect(result.notices).toEqual([
      { kind: 'remove', tag: 21, path: '21', by: 'b', previous: 'a' },
    ]);
  });

  it('remove of an absent tag is a silent no-op', () => {
    const result = mergeFragments([frag('a', 'template', [remove(9999)])], ctx);
    expect(result.fields).toEqual([]);
    expect(result.notices).toEqual([]);
  });

  it('a later set re-adds a removed tag at append position', () => {
    const result = mergeFragments(
      [
        frag('a', 'template', [set(21, '1'), set(40, '2')]),
        frag('b', 'system', [remove(21)]),
        frag('c', 'dimension', [set(21, '3')]),
      ],
      ctx
    );
    expect(result.fields.map((f) => (f.kind === 'field' ? f.tag : -1))).toEqual([40, 21]);
    // Fresh provenance: the removed field's history does not resurrect.
    expect(simple(result.fields, 21).provenance.overwrote).toBeUndefined();
  });

  it('removes a whole group by count tag', () => {
    const result = mergeFragments(
      [
        frag('a', 'template', [
          { op: 'group', countTag: 73, mode: 'append', entries: [[set(11, 'X')]] },
        ]),
        frag('b', 'system', [remove(73)]),
      ],
      ctx
    );
    expect(result.fields).toEqual([]);
    expect(result.notices).toMatchObject([{ kind: 'remove', tag: 73 }]);
  });
});

describe('merge: generated values', () => {
  it('evaluates setGenerated via the context and records via', () => {
    const result = mergeFragments(
      [frag('a', 'template', [{ op: 'setGenerated', tag: 11, generator: 'clOrdId' }])],
      ctx
    );
    const f = simple(result.fields, 11);
    expect(f.value).toBe('<gen:clOrdId>');
    expect(f.provenance.via).toBe('clOrdId');
    expect(f.provenance.sourceId).toBe('a');
  });
});

describe('merge: slots', () => {
  const qtySlot: FragmentOp = {
    op: 'slot',
    tag: 38,
    slot: { tag: 38, label: 'Quantity', type: 'decimal', required: true },
  };

  it('registers slot specs without emitting fields', () => {
    const result = mergeFragments([frag('a', 'template', [qtySlot])], ctx);
    expect(result.fields).toEqual([]);
    expect(result.slots).toEqual([
      { spec: qtySlot.op === 'slot' ? qtySlot.slot : null, declaredBy: 'a' },
    ]);
  });

  it('last slot spec wins for a tag, position kept from first declaration', () => {
    const result = mergeFragments(
      [
        frag('a', 'template', [
          qtySlot,
          { op: 'slot', tag: 44, slot: { tag: 44, label: 'Price', type: 'decimal' } },
        ]),
        frag('b', 'dimension', [
          { op: 'slot', tag: 38, slot: { tag: 38, label: 'Total Qty', type: 'int' } },
        ]),
      ],
      ctx
    );
    expect(result.slots.map((s) => [s.spec.tag, s.spec.label, s.declaredBy])).toEqual([
      [38, 'Total Qty', 'b'],
      [44, 'Price', 'a'],
    ]);
  });
});

describe('merge: groups', () => {
  const entryA = [set(11, 'A'), set(38, '10')];
  const entryB = [set(11, 'B'), set(38, '20')];

  it('append creates the group, later append adds entries', () => {
    const result = mergeFragments(
      [
        frag('a', 'template', [{ op: 'group', countTag: 73, mode: 'append', entries: [entryA] }]),
        frag('b', 'dimension', [{ op: 'group', countTag: 73, mode: 'append', entries: [entryB] }]),
      ],
      ctx
    );
    const g = grp(result.fields, 73);
    expect(g.entries).toHaveLength(2);
    expect(g.entries.map((e) => (e[0] as SimpleField).value)).toEqual(['A', 'B']);
    expect(result.notices).toEqual([]);
  });

  it('replace swaps entries and provenance, with a notice', () => {
    const result = mergeFragments(
      [
        frag('a', 'template', [{ op: 'group', countTag: 73, mode: 'append', entries: [entryA] }]),
        frag('b', 'system', [{ op: 'group', countTag: 73, mode: 'replace', entries: [entryB] }]),
      ],
      ctx
    );
    const g = grp(result.fields, 73);
    expect(g.entries).toHaveLength(1);
    expect((g.entries[0]![0] as SimpleField).value).toBe('B');
    expect(g.provenance.sourceId).toBe('b');
    expect(result.notices).toEqual([
      { kind: 'group-replace', countTag: 73, by: 'b', previous: 'a' },
    ]);
  });

  it('replace on a non-existent group creates it without a notice', () => {
    const result = mergeFragments(
      [frag('a', 'template', [{ op: 'group', countTag: 73, mode: 'replace', entries: [entryA] }])],
      ctx
    );
    expect(grp(result.fields, 73).entries).toHaveLength(1);
    expect(result.notices).toEqual([]);
  });

  it('supports nested groups and set/remove inside entries', () => {
    const result = mergeFragments(
      [
        frag('a', 'template', [
          {
            op: 'group',
            countTag: 555,
            mode: 'append',
            entries: [
              [
                set(600, 'FCOR'),
                set(624, '1'),
                remove(624),
                { op: 'group', countTag: 604, mode: 'append', entries: [[set(605, 'ALT')]] },
              ],
            ],
          },
        ]),
      ],
      ctx
    );
    const g = grp(result.fields, 555);
    const entry = g.entries[0]!;
    expect(entry.map((f) => (f.kind === 'field' ? f.tag : f.countTag))).toEqual([600, 604]);
    const nested = entry.find((f) => f.kind === 'group');
    expect(nested && nested.kind === 'group' && (nested.entries[0]![0] as SimpleField).value).toBe(
      'ALT'
    );
  });

  it('generated values evaluate inside group entries', () => {
    const result = mergeFragments(
      [
        frag('a', 'template', [
          {
            op: 'group',
            countTag: 73,
            mode: 'append',
            entries: [[{ op: 'setGenerated', tag: 11, generator: 'seq' }]],
          },
        ]),
      ],
      ctx
    );
    expect((grp(result.fields, 73).entries[0]![0] as SimpleField).value).toBe('<gen:seq>');
  });
});

describe('merge: determinism', () => {
  it('same input produces deep-equal output', () => {
    const stack = [
      frag('a', 'template', [set(40, '2'), set(54, '1')]),
      frag('b', 'dimension', [set(54, '2'), remove(40)]),
    ];
    expect(mergeFragments(stack, ctx)).toEqual(mergeFragments(stack, ctx));
  });

  it('records the stage on provenance', () => {
    const result = mergeFragments([frag('a', 'dimension', [set(1, 'x')])], ctx);
    expect(simple(result.fields, 1).provenance.stage).toBe('dimension');
  });
});
