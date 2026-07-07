/**
 * Golden messages (docs/PROFILE-WORKSPACE.md §5.1): one deterministic
 * single-mode wire per link × flow, with pinned clock/seed — so config PRs
 * diff as FIX, and explode round-trips can be verified semantically.
 */
import { parseProfile } from '../engine/profile/load.ts';
import { parseInstrumentDb } from '../engine/instrument/db.ts';
import { resolveForSystem } from '../engine/profile/resolve.ts';
import { loadBaseDictionary } from '../engine/dictionary/data/index.ts';
import { buildSingle, resolveSelections } from '../engine/build/single.ts';
import { instrumentFragment } from '../engine/instrument/placement.ts';
import { memoryCounterStore } from '../engine/generator/types.ts';
import { mulberry32 } from '../engine/generator/evaluate.ts';
import { renderTagValue } from '../engine/render/tagvalue.ts';
import { defaultSelections } from '../engine/profile/types.ts';

const PINNED_CLOCK = new Date('2026-01-01T00:00:00.000Z');
const PINNED_SEED = 1;

/** filename (link--flow.fix.txt) → pipe-delimited wire. */
export async function generateGoldens(
  profileText: string,
  instrumentsText: string | undefined
): Promise<Map<string, string>> {
  const goldens = new Map<string, string>();
  const { profile } = parseProfile(profileText);
  if (!profile) return goldens;
  const db = instrumentsText ? parseInstrumentDb(instrumentsText).db : undefined;
  const dictionary = await loadBaseDictionary(profile.fixVersion);

  const flowDim = profile.dimensions.find(
    (d) => d.id === 'flow' || (d.kind === 'options' && d.options?.some((o) => o.msgType))
  );
  const instrumentDim = profile.dimensions.find((d) => d.kind === 'instrument');
  const firstInstrument = db ? [...db.instruments.keys()].sort()[0] : undefined;

  for (const system of [...profile.systems].sort((a, b) => (a.id < b.id ? -1 : 1))) {
    const resolved = resolveForSystem(profile, system.id, dictionary);
    if (!resolved) continue;
    for (const option of flowDim?.options ?? []) {
      const selections: Record<string, string> = {
        ...defaultSelections(profile),
        ...(flowDim ? { [flowDim.id]: option.id } : {}),
      };
      const info = resolveSelections(resolved, selections);
      const conventionRef = info.convention ?? resolved.system.convention;
      const convention = conventionRef ? profile.conventions?.[conventionRef] : undefined;
      const record =
        instrumentDim && firstInstrument ? db?.instruments.get(firstInstrument) : undefined;
      const placed =
        record && convention
          ? instrumentFragment(record, convention, 'instrument', profile.fixVersion)
          : undefined;

      const result = buildSingle(
        resolved,
        {
          selections,
          slotValues: {},
          ...(placed ? { instrumentFragment: placed.fragment } : {}),
        },
        {
          clock: () => PINNED_CLOCK,
          random: mulberry32(PINNED_SEED),
          counters: memoryCounterStore(),
        }
      );
      const wire = renderTagValue(result.message, resolved.dictionary, { delimiter: 'pipe' });
      goldens.set(`${system.id}--${option.id}.fix.txt`, wire + '\n');
    }
  }
  return goldens;
}
