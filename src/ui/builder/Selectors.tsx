import { availableDimensions } from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import type { DerivedBuild } from '../state/derive.ts';

/**
 * Target system first (it drives availability filtering of everything else),
 * then the profile-declared dimensions. Unavailable options stay visible but
 * flagged — selecting one is allowed and produces a finding, never a block.
 */
export function Selectors({ derived }: { derived: DerivedBuild }) {
  const { profile, systemId, selections } = useAppState();
  const dispatch = useAppDispatch();

  if (!profile) return null;
  const dims = derived.resolved ? availableDimensions(derived.resolved) : [];

  return (
    <section className="panel">
      <div className="panel-header">Build selection</div>
      <div className="panel-body">
        <div className="field-row">
          <label className="field-label" htmlFor="sel-system">
            Target system
          </label>
          <select
            id="sel-system"
            className="input"
            value={systemId ?? ''}
            onChange={(e) => dispatch({ type: 'select-system', systemId: e.target.value })}
          >
            {profile.systems.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {dims
          .filter(({ dimension }) => dimension.kind === 'options')
          .map(({ dimension, options }) => (
            <div className="field-row" key={dimension.id}>
              <label className="field-label" htmlFor={`sel-${dimension.id}`}>
                {dimension.label}
                {dimension.required && <span className="req">*</span>}
              </label>
              <select
                id={`sel-${dimension.id}`}
                className="input"
                value={selections[dimension.id] ?? ''}
                onChange={(e) =>
                  dispatch({
                    type: 'select-option',
                    dimensionId: dimension.id,
                    optionId: e.target.value,
                  })
                }
              >
                <option value="">—</option>
                {options.map(({ option, available }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                    {!available ? ' (not on this system)' : ''}
                  </option>
                ))}
              </select>
            </div>
          ))}
      </div>
    </section>
  );
}
