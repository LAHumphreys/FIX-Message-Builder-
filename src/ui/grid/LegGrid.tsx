import { enumLabel } from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import type { DerivedBuild } from '../state/derive.ts';

/**
 * Multileg leg grid (§3.7.3): legs come from the selected strategy record;
 * ratio, side and price are editable per leg.
 */
export function LegGrid({ derived }: { derived: DerivedBuild }) {
  const { legOverrides, instrumentDb } = useAppState();
  const dispatch = useAppDispatch();

  if (derived.mode !== 'multileg') return null;
  const strategy = derived.strategy;

  return (
    <section className="panel">
      <div className="panel-header">
        Legs {strategy ? `· ${strategy.name ?? strategy.key}` : ''}
      </div>
      <div className="panel-body" style={{ overflowX: 'auto', padding: '0.4rem' }}>
        {!strategy ? (
          <p className="empty-note">
            Select a strategy record (⧉) in the instrument search to populate the leg grid.
          </p>
        ) : (
          <table className="grid-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Instrument</th>
                <th>
                  <span className="tag mono">623</span> Ratio
                </th>
                <th>
                  <span className="tag mono">624</span> Side
                </th>
                <th>
                  <span className="tag mono">566</span> Price
                </th>
              </tr>
            </thead>
            <tbody>
              {strategy.legs.map((leg, i) => {
                const override = legOverrides[i] ?? {};
                const record = instrumentDb?.instruments.get(leg.instrument);
                const sideValue = override.side ?? leg.side;
                const sideLabel = derived.resolved
                  ? enumLabel(derived.resolved.dictionary, 54, sideValue)
                  : undefined;
                return (
                  <tr key={i}>
                    <td className="mono rownum">{i + 1}</td>
                    <td>
                      <span className="hit-label">{record?.name ?? leg.instrument}</span>
                    </td>
                    <td>
                      <input
                        className="input"
                        value={override.ratioQty ?? ''}
                        placeholder={leg.ratioQty}
                        onChange={(e) =>
                          dispatch({
                            type: 'leg-override',
                            index: i,
                            patch: { ratioQty: e.target.value },
                          })
                        }
                      />
                    </td>
                    <td>
                      <select
                        className="input"
                        value={sideValue}
                        title={sideLabel}
                        onChange={(e) =>
                          dispatch({
                            type: 'leg-override',
                            index: i,
                            patch: { side: e.target.value },
                          })
                        }
                      >
                        <option value="1">1 — Buy</option>
                        <option value="2">2 — Sell</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="input"
                        value={override.price ?? ''}
                        placeholder={leg.price ?? '—'}
                        onChange={(e) =>
                          dispatch({
                            type: 'leg-override',
                            index: i,
                            patch: { price: e.target.value },
                          })
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
