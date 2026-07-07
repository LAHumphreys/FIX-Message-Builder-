import { useMemo, useState } from 'react';
import {
  removeInstrument,
  schemesUsed,
  serializeInstrumentDb,
  upsertInstrument,
  type InstrumentAttrs,
  type InstrumentDb,
  type InstrumentRecord,
} from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import { downloadText } from '../files/download.ts';
import { getActiveWorkspace } from '../workspace/fsa.ts';

const SUGGESTED_ATTRS = [
  'securityType',
  'currency',
  'mic',
  'cfiCode',
  'maturityMonthYear',
  'maturityDate',
  'strikePrice',
  'putOrCall',
  'optAttribute',
  'contractMultiplier',
  'underlying',
];

interface Pair {
  key: string;
  value: string;
}

function pairs(map: Readonly<Record<string, string | undefined>>): Pair[] {
  return Object.entries(map)
    .filter((e): e is [string, string] => e[1] !== undefined)
    .map(([key, value]) => ({ key, value }));
}

function toMap(list: readonly Pair[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const { key, value } of list) {
    if (key.trim() !== '' && value !== '') out[key.trim()] = value;
  }
  return out;
}

function PairRows({
  label,
  rows,
  onChange,
  keySuggestions,
  requiredKeys,
}: {
  label: string;
  rows: Pair[];
  onChange: (rows: Pair[]) => void;
  keySuggestions: readonly string[];
  requiredKeys?: ReadonlySet<string>;
}) {
  const listId = `sugg-${label.replace(/\W+/g, '')}`;
  return (
    <div className="pair-rows">
      <div className="pair-rows-head">
        <span>{label}</span>
        <button
          type="button"
          className="btn small"
          onClick={() => onChange([...rows, { key: '', value: '' }])}
        >
          + {label.replace(/s$/, '')}
        </button>
      </div>
      <datalist id={listId}>
        {keySuggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      {rows.map((row, i) => (
        <div key={i} className="pair-row">
          <input
            className="input mono"
            list={listId}
            placeholder="name"
            value={row.key}
            onChange={(e) =>
              onChange(rows.map((r, j) => (j === i ? { ...r, key: e.target.value } : r)))
            }
          />
          <input
            className="input mono"
            placeholder={requiredKeys?.has(row.key) ? 'required by convention' : 'value'}
            value={row.value}
            onChange={(e) =>
              onChange(rows.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))
            }
          />
          {requiredKeys?.has(row.key) && row.value === '' && <span className="req">*</span>}
          <button
            type="button"
            className="btn small"
            title="Remove row"
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * In-app instrument CRUD (brief §3.9, milestone 7). Data-shaped records get
 * forms; the schemes list is pre-filled from the active system's convention
 * so missing identifiers are visible at entry time. Unknown keys on records
 * are preserved untouched; write-back is canonical (minimal git diff) via
 * workspace in-place save or file download. Target systems are deliberately
 * NOT editable here — they belong to the fixb profile workspace.
 */
export function InstrumentEditor({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { instrumentDb, profile, systemId, workspace } = state;
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<
    | { original?: InstrumentRecord; key: string; name: string; schemes: Pair[]; attrs: Pair[] }
    | undefined
  >();
  const [dirty, setDirty] = useState(0);
  const [persistNote, setPersistNote] = useState<string | undefined>();

  const db: InstrumentDb = instrumentDb ?? {
    instruments: new Map(),
    strategies: new Map(),
    instrumentOrder: [],
  };

  // Convention of the currently selected system → scheme pre-fill.
  const conventionSchemes = useMemo(() => {
    const conventionRef = profile?.systems.find((s) => s.id === systemId)?.convention;
    const convention = conventionRef ? profile?.conventions?.[conventionRef] : undefined;
    return convention ? schemesUsed(convention) : [];
  }, [profile, systemId]);

  const records = db.instrumentOrder
    .map((key) => db.instruments.get(key)!)
    .filter((record) => {
      if (query.trim() === '') return true;
      const q = query.toLowerCase();
      return [record.key, record.name ?? '', ...Object.values(record.schemes)]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });

  const startEdit = (record?: InstrumentRecord, duplicate = false) => {
    const schemeRows = record
      ? pairs(record.schemes)
      : conventionSchemes.map(({ scheme }) => ({ key: scheme, value: '' }));
    // Pre-fill any convention scheme the record lacks, so gaps are visible.
    for (const { scheme } of conventionSchemes) {
      if (!schemeRows.some((r) => r.key === scheme)) schemeRows.push({ key: scheme, value: '' });
    }
    setEditing({
      ...(record && !duplicate ? { original: record } : {}),
      key: duplicate ? `${record!.key}-copy` : (record?.key ?? ''),
      name: record?.name ?? '',
      schemes: schemeRows,
      attrs: record ? pairs(record.attrs) : [{ key: 'securityType', value: 'CS' }],
    });
  };

  const commitEdit = () => {
    if (!editing || editing.key.trim() === '') return;
    const record: InstrumentRecord = {
      key: editing.key.trim(),
      ...(editing.name.trim() !== '' ? { name: editing.name.trim() } : {}),
      schemes: toMap(editing.schemes),
      attrs: toMap(editing.attrs) as InstrumentAttrs,
      ...(editing.original?.extra ? { extra: editing.original.extra } : {}),
    };
    let next = upsertInstrument(db, record);
    if (editing.original && editing.original.key !== record.key) {
      next = removeInstrument(next, editing.original.key);
    }
    dispatch({ type: 'instruments-loaded', db: next, issues: [] });
    setEditing(undefined);
    setDirty((d) => d + 1);
    setPersistNote(undefined);
  };

  const deleteRecord = (key: string) => {
    dispatch({ type: 'instruments-loaded', db: removeInstrument(db, key), issues: [] });
    setDirty((d) => d + 1);
    setPersistNote(undefined);
  };

  const persist = async () => {
    const text = serializeInstrumentDb(db);
    const ws = getActiveWorkspace();
    if (ws && workspace?.instrumentsPath) {
      const result = await ws.write(workspace.instrumentsPath, text, workspace.instrumentsToken);
      if (!result.ok) {
        setPersistNote(
          `Conflict: ${workspace.instrumentsPath} changed on disk. Re-attach or use Download and merge by hand.`
        );
        return;
      }
      dispatch({
        type: 'workspace-instruments-origin',
        path: result.entry.path,
        token: result.entry.modifiedToken,
      });
      setDirty(0);
      setPersistNote(`Saved to ${result.entry.path}`);
    } else {
      downloadText(db.csvColumns ? 'instruments.csv' : 'instruments.json', text);
      setDirty(0);
      setPersistNote('Downloaded — replace the file in your repo.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-label="Instrument editor">
        <div className="panel-header">
          Instruments · {db.instruments.size} records
          {dirty > 0 && <span className="badge-dirty">{dirty} unsaved change(s)</span>}
          <span style={{ flex: 1 }} />
          {dirty > 0 && (
            <button className="btn small primary" onClick={() => void persist()}>
              {getActiveWorkspace() && workspace?.instrumentsPath
                ? '💾 Save to workspace'
                : '⬇ Download updated file'}
            </button>
          )}
          <button className="btn small" onClick={onClose}>
            Close
          </button>
        </div>

        {persistNote && (
          <div className="finding info" style={{ margin: '0.5rem 0.7rem 0' }}>
            {persistNote}
          </div>
        )}

        {editing ? (
          <div className="panel-body instrument-form">
            <div className="field-row">
              <label className="field-label">Key</label>
              <input
                className="input mono"
                value={editing.key}
                disabled={editing.original !== undefined}
                placeholder="UNIQUE-KEY"
                onChange={(e) => setEditing({ ...editing, key: e.target.value })}
              />
            </div>
            <div className="field-row">
              <label className="field-label">Name</label>
              <input
                className="input"
                value={editing.name}
                placeholder="Display name"
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </div>
            <PairRows
              label="Schemes"
              rows={editing.schemes}
              onChange={(schemes) => setEditing({ ...editing, schemes })}
              keySuggestions={conventionSchemes.map((s) => s.scheme)}
              requiredKeys={
                new Set(conventionSchemes.filter((s) => s.required).map((s) => s.scheme))
              }
            />
            <PairRows
              label="Attrs"
              rows={editing.attrs}
              onChange={(attrs) => setEditing({ ...editing, attrs })}
              keySuggestions={SUGGESTED_ATTRS}
            />
            {editing.original?.extra && (
              <p className="hint" style={{ margin: 0 }}>
                {Object.keys(editing.original.extra).length} unknown key(s) on this record are
                preserved untouched.
              </p>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setEditing(undefined)}>
                Cancel
              </button>
              <button
                className="btn primary"
                disabled={editing.key.trim() === ''}
                onClick={commitEdit}
              >
                {editing.original ? 'Apply changes' : 'Add instrument'}
              </button>
            </div>
          </div>
        ) : (
          <div
            className="panel-body"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="input"
                placeholder="Filter by key, name or identifier…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn primary" onClick={() => startEdit()}>
                + Add
              </button>
            </div>
            <div className="instrument-list">
              {records.map((record) => (
                <div key={record.key} className="instrument-row">
                  <span className="mono key">{record.key}</span>
                  <span className="name">{record.name ?? ''}</span>
                  <span className="hint">
                    {Object.entries(record.schemes)
                      .map(([k, v]) => `${k}=${v}`)
                      .join(' · ')}
                  </span>
                  {record.extra && (
                    <span className="badge-extra" title="Unknown keys preserved">
                      +{Object.keys(record.extra).length}
                    </span>
                  )}
                  <span style={{ flex: 1 }} />
                  <button className="btn small" onClick={() => startEdit(record)}>
                    Edit
                  </button>
                  <button
                    className="btn small"
                    title="Duplicate"
                    onClick={() => startEdit(record, true)}
                  >
                    ⧉
                  </button>
                  <button
                    className="btn small"
                    title="Delete"
                    onClick={() => deleteRecord(record.key)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {records.length === 0 && (
                <p className="empty-note">No matching instruments — add one above.</p>
              )}
            </div>
            <p className="hint" style={{ margin: 0 }}>
              Schemes required by the selected system's convention are pre-filled when adding.
              Target systems are configured in the fixb profile workspace, not here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
