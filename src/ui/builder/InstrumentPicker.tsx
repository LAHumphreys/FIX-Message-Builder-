import { useEffect, useRef, useState } from 'react';
import type { SearchHit } from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import type { DerivedBuild } from '../state/derive.ts';

/**
 * Typeahead over the instrument DB (§3.10). The engine search index caps
 * results at 50, so plain rendering stays responsive even on 10k-row DBs.
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
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedKey = selections[dimensionId];
  const selected = selectedKey
    ? (instrumentDb?.instruments.get(selectedKey) ?? instrumentDb?.strategies.get(selectedKey))
    : undefined;

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const hits: SearchHit[] = open ? (derived.searchIndex?.search(query) ?? []) : [];

  return (
    <div className="field-row" ref={rootRef}>
      <label className="field-label" htmlFor={`inst-${dimensionId}`}>
        {label}
        {required && <span className="req">*</span>}
      </label>
      <div className="typeahead">
        <input
          id={`inst-${dimensionId}`}
          className="input"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          placeholder={
            instrumentDb
              ? (selected?.name ?? selected?.key ?? 'Search instruments…')
              : 'No instrument DB loaded'
          }
          value={query}
          disabled={!instrumentDb}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
        {open && hits.length > 0 && (
          <ul className="typeahead-list" role="listbox">
            {hits.map((hit) => (
              <li key={`${hit.kind}:${hit.key}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={hit.key === selectedKey}
                  className={hit.key === selectedKey ? 'selected' : ''}
                  onClick={() => {
                    dispatch({ type: 'select-option', dimensionId, optionId: hit.key });
                    setQuery('');
                    setOpen(false);
                  }}
                >
                  <span className="hit-label">{hit.label}</span>
                  <span className="hit-detail">
                    {hit.kind === 'strategy' ? '⧉ ' : ''}
                    {hit.detail}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
