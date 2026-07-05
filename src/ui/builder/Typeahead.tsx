import { useEffect, useRef, useState } from 'react';
import type { SearchHit, SearchIndex } from '../../engine/index.ts';

/** Generic instrument-search dropdown; used by the dimension picker and grid cells. */
export function Typeahead({
  id,
  index,
  placeholder,
  selectedLabel,
  onPick,
  allowClear,
  compact,
}: {
  id: string;
  index: SearchIndex | undefined;
  placeholder: string;
  /** Current selection, shown as a real value while not searching. */
  selectedLabel?: string;
  onPick: (key: string | undefined) => void;
  allowClear?: boolean;
  compact?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const hits: SearchHit[] = open ? (index?.search(query) ?? []) : [];
  // Closed with a selection: display it as a value, not a grey hint. Opening
  // switches to the (empty) query so typing starts a fresh search.
  const showSelection = !open && query === '' && selectedLabel !== undefined;

  return (
    <div className={`typeahead${compact ? ' compact' : ''}`} ref={rootRef}>
      <input
        id={id}
        className="input"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        placeholder={index ? placeholder : 'No instrument DB loaded'}
        value={showSelection ? selectedLabel : query}
        disabled={!index}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />
      {open && (hits.length > 0 || allowClear) && (
        <ul className="typeahead-list" role="listbox">
          {allowClear && (
            <li>
              <button
                type="button"
                onClick={() => {
                  onPick(undefined);
                  setQuery('');
                  setOpen(false);
                }}
              >
                <span className="hit-label hint">— clear —</span>
              </button>
            </li>
          )}
          {hits.map((hit) => (
            <li key={`${hit.kind}:${hit.key}`}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => {
                  onPick(hit.key);
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
  );
}
