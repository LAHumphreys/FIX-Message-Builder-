import { useAppDispatch, useAppState } from '../state/context.ts';
import type { DerivedBuild } from '../state/derive.ts';
import { Typeahead } from '../builder/Typeahead.tsx';

/**
 * Batch / list grid (§3.7): one row per order, one column per slot, plus an
 * optional per-row instrument column — baskets are typically
 * multi-instrument. Empty cells inherit the shared slot value or default.
 */
export function BatchGrid({ derived }: { derived: DerivedBuild }) {
  const { rows, instrumentDb, slotValues } = useAppState();
  const dispatch = useAppDispatch();
  const slots = derived.slots;

  if (derived.mode !== 'batch' && derived.mode !== 'list') return null;

  return (
    <section className="panel">
      <div className="panel-header">
        {derived.mode === 'list' ? 'List orders (35=E rows)' : 'Batch rows'}
        <span style={{ flex: 1 }} />
        <button className="btn small" onClick={() => dispatch({ type: 'row-add' })}>
          + Row
        </button>
      </div>
      <div className="panel-body" style={{ overflowX: 'auto', padding: '0.4rem' }}>
        <table className="grid-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Instrument</th>
              {slots.map((s) => (
                <th key={s.spec.tag}>
                  <span className="tag mono">{s.spec.tag}</span> {s.spec.label}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className="mono rownum">{i + 1}</td>
                <td className="instrument-cell">
                  <Typeahead
                    id={`row-inst-${i}`}
                    index={derived.searchIndex}
                    placeholder={
                      row.instrument
                        ? (instrumentDb?.instruments.get(row.instrument)?.name ?? row.instrument)
                        : '—'
                    }
                    onPick={(key) =>
                      dispatch({ type: 'row-update', index: i, instrument: key ?? '' })
                    }
                    allowClear
                    compact
                  />
                </td>
                {slots.map((s) => (
                  <td key={s.spec.tag}>
                    <input
                      className="input"
                      value={row.slotValues[s.spec.tag] ?? ''}
                      placeholder={slotValues[s.spec.tag] ?? s.spec.default ?? ''}
                      onChange={(e) =>
                        dispatch({
                          type: 'row-update',
                          index: i,
                          slotValues: { [s.spec.tag]: e.target.value },
                        })
                      }
                    />
                  </td>
                ))}
                <td className="row-actions">
                  <button
                    className="btn small"
                    title="Duplicate row"
                    onClick={() => dispatch({ type: 'row-duplicate', index: i })}
                  >
                    ⧉
                  </button>
                  <button
                    className="btn small"
                    title="Remove row"
                    onClick={() => dispatch({ type: 'row-remove', index: i })}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint" style={{ margin: '0.4rem 0 0' }}>
          Empty cells inherit the shared parameter values; the instrument column overrides the
          instrument dimension per row.
        </p>
      </div>
    </section>
  );
}
