/**
 * Keeps docs/PROFILE-AUTHORING.md honest: every `json` code block in the
 * guide must be valid JSON (bare, or an object/array fragment), and the
 * documented sections must assemble into a profile the real loader accepts
 * with zero issues. If the profile format evolves, this test fails until
 * the guide is updated — the documentation cannot drift.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateProfile } from './load.ts';
import { parseInstrumentDbCsv, parseInstrumentDbJson } from '../instrument/db.ts';

const doc = readFileSync('docs/PROFILE-AUTHORING.md', 'utf8');

function extractBlocks(language: string): string[] {
  const blocks: string[] = [];
  const re = new RegExp('```' + language + '\\n([\\s\\S]*?)```', 'g');
  let match;
  while ((match = re.exec(doc)) !== null) blocks.push(match[1]!);
  return blocks;
}

/** Parse a doc example: standalone JSON, or a `"key": {...}` object fragment. */
function parseExample(block: string): unknown {
  const attempts = [block, `{${block}}`, `[${block}]`];
  for (const attempt of attempts) {
    try {
      return JSON.parse(attempt);
    } catch {
      // try the next wrapping
    }
  }
  throw new Error(`documentation example is not valid JSON:\n${block.slice(0, 200)}`);
}

const jsonBlocks = extractBlocks('json');

describe('PROFILE-AUTHORING.md examples', () => {
  it('contains the expected sections (sanity check the doc still has examples)', () => {
    expect(jsonBlocks.length).toBeGreaterThanOrEqual(15);
  });

  it.each(jsonBlocks.map((block, i) => ({ i, block })))(
    'json example #$i parses as JSON',
    ({ block }) => {
      expect(() => parseExample(block)).not.toThrow();
    }
  );

  it('the documented sections assemble into a profile the loader accepts cleanly', () => {
    const parsed = jsonBlocks.map(parseExample);
    const objects = parsed.filter(
      (p): p is Record<string, unknown> => typeof p === 'object' && p !== null && !Array.isArray(p)
    );

    const skeleton = objects.find((o) => o.schemaVersion === 1 && 'systems' in o && 'name' in o);
    const section = (key: string) =>
      objects.filter((o) => key in o && o.schemaVersion === undefined);

    expect(skeleton, 'the §3 skeleton block').toBeDefined();
    for (const key of [
      'dictionaryOverlay',
      'generators',
      'templates',
      'systems',
      'dimensions',
      'conventions',
      'renderers',
      'validationPolicy',
    ]) {
      expect(section(key).length, `a documented "${key}" example`).toBeGreaterThanOrEqual(1);
    }

    // Merge the documented sections over the skeleton. Multiple blocks touch
    // fragments/dictionaryOverlay; merge those maps rather than replacing.
    const composite: Record<string, unknown> = { ...skeleton };
    const mergedFragments: Record<string, unknown> = {};
    const mergedOverlayFields: Record<string, unknown> = {};
    for (const o of objects) {
      if (o.schemaVersion !== undefined) continue; // the skeleton itself
      for (const [key, value] of Object.entries(o)) {
        if (key === 'fragments') {
          Object.assign(mergedFragments, value);
        } else if (key === 'dictionaryOverlay') {
          Object.assign(
            mergedOverlayFields,
            (value as { fields?: Record<string, unknown> }).fields ?? {}
          );
        } else {
          composite[key] = value;
        }
      }
    }

    // The guide references routing/flow fragments whose contents are
    // environment-specific by nature; the copilot authors them. Stub the
    // referenced ids so reference checking exercises the real rules.
    const referenced = [
      'session-east',
      'final-east-uat',
      'final-east-dev',
      'flow-limit',
      'flow-algo-x',
      'flow-basket',
      'flow-multileg',
      'tmpl-new-order',
      'tmpl-list-entry',
    ];
    for (const id of referenced) {
      mergedFragments[id] ??= { label: id, ops: [] };
    }
    composite.fragments = mergedFragments;
    composite.dictionaryOverlay = { fields: mergedOverlayFields };
    composite.name = 'Doc Composite';

    const result = validateProfile(composite);
    expect(result.issues).toEqual([]);
    expect(result.profile).toBeDefined();
    expect(result.profile!.systems.map((s) => s.id)).toEqual(['east-uat', 'east-dev']);
  });

  it('op and slot example arrays are accepted inside a fragment', () => {
    const arrays = jsonBlocks
      .map(parseExample)
      .filter((p): p is unknown[] => Array.isArray(p))
      .filter((a) => a.every((op) => typeof op === 'object' && op !== null && 'op' in op));
    expect(arrays.length).toBeGreaterThanOrEqual(2);
    for (const ops of arrays) {
      const result = validateProfile({
        schemaVersion: 1,
        name: 'ops-check',
        version: '1',
        fixVersion: 'FIX.4.4',
        systems: [{ id: 's', label: 's' }],
        dimensions: [],
        fragments: { example: { label: 'example', ops } },
      });
      expect(result.issues).toEqual([]);
    }
  });

  it('every instrument DB JSON example loads cleanly', () => {
    const dbBlocks = jsonBlocks
      .map(parseExample)
      .filter(
        (p): p is Record<string, unknown> =>
          typeof p === 'object' && p !== null && !Array.isArray(p) && 'instruments' in p
      );
    expect(dbBlocks.length, 'instrument DB examples').toBeGreaterThanOrEqual(1);
    const parsedDbs = dbBlocks.map((block) => {
      const { db, issues } = parseInstrumentDbJson(JSON.stringify(block));
      expect(issues.filter((i) => i.severity === 'error')).toEqual([]);
      expect(db!.instruments.size).toBeGreaterThanOrEqual(1);
      return db!;
    });
    // The §13 reference example must also demonstrate strategies.
    expect(parsedDbs.some((db) => db.strategies.size >= 1)).toBe(true);
  });

  it('the instrument DB CSV example loads cleanly', () => {
    const csvBlocks = extractBlocks('csv');
    expect(csvBlocks.length).toBeGreaterThanOrEqual(1);
    const { db, issues } = parseInstrumentDbCsv(csvBlocks[0]!);
    expect(issues).toEqual([]);
    expect(db!.instruments.size).toBeGreaterThanOrEqual(1);
  });
});
