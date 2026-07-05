import { useAppDispatch, useAppState } from '../state/context.ts';
import type { DerivedBuild } from '../state/derive.ts';
import { Typeahead } from './Typeahead.tsx';

/**
 * Typeahead over the instrument DB (§3.10) bound to an instrument
 * dimension. The engine search index caps results at 50, so rendering
 * stays responsive even on 10k-row DBs.
 */
export function InstrumentPicker({
  dimensionId,
  label,
  required,
  derived,
}: {
  dimensionId: string;
  label: string;
  required: boolean | undefined;
  derived: DerivedBuild;
}) {
  const { selections, instrumentDb } = useAppState();
  const dispatch = useAppDispatch();

  const selectedKey = selections[dimensionId];
  const selected = selectedKey
    ? (instrumentDb?.instruments.get(selectedKey) ?? instrumentDb?.strategies.get(selectedKey))
    : undefined;

  return (
    <div className="field-row">
      <label className="field-label" htmlFor={`inst-${dimensionId}`}>
        {label}
        {required && <span className="req">*</span>}
      </label>
      <Typeahead
        id={`inst-${dimensionId}`}
        index={derived.searchIndex}
        placeholder="Search instruments…"
        {...(selected ? { selectedLabel: selected.name ?? selected.key } : {})}
        onPick={(key) => dispatch({ type: 'select-option', dimensionId, optionId: key ?? '' })}
        allowClear
      />
    </div>
  );
}
