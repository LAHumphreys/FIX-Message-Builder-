import type { ResolvedSlot, SlotSpec } from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import type { DerivedBuild } from '../state/derive.ts';

function enumOptions(
  spec: SlotSpec,
  derived: DerivedBuild
): readonly { value: string; label: string }[] {
  if (spec.enumSource?.kind === 'inline') return spec.enumSource.values;
  const enums = derived.resolved?.dictionary.fields.get(spec.tag)?.enums;
  if (!enums) return [];
  return [...enums.entries()].map(([value, label]) => ({ value, label }));
}

function SlotInput({ slot, derived }: { slot: ResolvedSlot; derived: DerivedBuild }) {
  const { slotValues } = useAppState();
  const dispatch = useAppDispatch();
  const spec = slot.spec;
  const value = slotValues[spec.tag] ?? '';
  const placeholder =
    spec.generatorDefault !== undefined
      ? `generated (${spec.generatorDefault})`
      : (spec.default ?? '');

  const set = (v: string) =>
    v === ''
      ? dispatch({ type: 'clear-slot', tag: spec.tag })
      : dispatch({ type: 'set-slot', tag: spec.tag, value: v });

  const options = spec.type === 'enum' || spec.type === 'bool' ? enumOptions(spec, derived) : [];

  return (
    <div className="field-row">
      <label className="field-label" htmlFor={`slot-${spec.tag}`}>
        <span className="tag">{spec.tag}</span>
        {spec.label}
        {spec.required && <span className="req">*</span>}
      </label>
      {spec.type === 'enum' && options.length > 0 ? (
        <select
          id={`slot-${spec.tag}`}
          className="input"
          value={value}
          onChange={(e) => set(e.target.value)}
        >
          <option value="">{spec.default !== undefined ? `default (${spec.default})` : '—'}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.value} — {o.label}
            </option>
          ))}
        </select>
      ) : spec.type === 'bool' ? (
        <select
          id={`slot-${spec.tag}`}
          className="input"
          value={value}
          onChange={(e) => set(e.target.value)}
        >
          <option value="">{spec.default !== undefined ? `default (${spec.default})` : '—'}</option>
          <option value="Y">Y — Yes</option>
          <option value="N">N — No</option>
        </select>
      ) : (
        <input
          id={`slot-${spec.tag}`}
          className="input"
          value={value}
          placeholder={placeholder}
          inputMode={spec.type === 'int' || spec.type === 'decimal' ? 'decimal' : undefined}
          onChange={(e) => set(e.target.value)}
        />
      )}
    </div>
  );
}

export function SlotForm({ derived }: { derived: DerivedBuild }) {
  const { selections } = useAppState();
  const slots = derived.slots;
  if (!derived.resolved) return null;
  const grouped = derived.mode === 'batch' || derived.mode === 'list';
  const flowDim = derived.resolved.profile.dimensions.find((d) => d.kind === 'options');
  const flowPicked = !flowDim || selections[flowDim.id] !== undefined;

  return (
    <section className="panel">
      <div className="panel-header">
        Parameters
        {grouped && <span className="hint">shared defaults — rows override</span>}
      </div>
      <div className="panel-body">
        {slots.length === 0 ? (
          <p className="empty-note" style={{ padding: 0 }}>
            {flowPicked
              ? 'The selected flow declares no parameter slots.'
              : 'Pick a flow to see its parameters.'}
          </p>
        ) : (
          slots.map((slot) => <SlotInput key={slot.spec.tag} slot={slot} derived={derived} />)
        )}
      </div>
    </section>
  );
}
