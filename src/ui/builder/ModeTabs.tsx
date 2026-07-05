import type { BuildMode } from '../../engine/index.ts';
import { useAppDispatch } from '../state/context.ts';
import type { DerivedBuild } from '../state/derive.ts';

const LABELS: Record<BuildMode, string> = {
  single: 'Single',
  batch: 'Batch',
  list: 'List (35=E)',
  multileg: 'Multileg (35=AB)',
};

/** Build-mode switch; only shown when the selected flow supports several. */
export function ModeTabs({ derived }: { derived: DerivedBuild }) {
  const dispatch = useAppDispatch();
  if (derived.availableModes.length < 2) return null;

  return (
    <div className="field-row">
      <span className="field-label">Mode</span>
      <span className="seg" role="tablist">
        {derived.availableModes.map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={derived.mode === m}
            className={derived.mode === m ? 'active' : ''}
            onClick={() => dispatch({ type: 'set-mode', mode: m })}
          >
            {LABELS[m]}
          </button>
        ))}
      </span>
    </div>
  );
}
