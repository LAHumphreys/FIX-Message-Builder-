import { useRef, useState, type DragEvent } from 'react';
import { parseInstrumentDb, parseProfile } from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import demoProfileText from '../../demo/demo.profile.json?raw';
import demoInstrumentsText from '../../demo/demo.instruments.json?raw';

/** Route a dropped/picked file by shape: profile vs instrument DB (§3.9). */
function classify(text: string, filename: string): 'profile' | 'instruments' {
  if (/\.csv$/i.test(filename)) return 'instruments';
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null && 'instruments' in parsed) {
      return 'instruments';
    }
  } catch {
    return 'instruments'; // non-JSON → try the CSV instrument path
  }
  return 'profile';
}

export function LoadPanel() {
  const { profile, profileIssues, instrumentDb, instrumentDbIssues } = useAppState();
  const dispatch = useAppDispatch();
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function loadProfileText(text: string) {
    const { profile: loaded, issues } = parseProfile(text);
    dispatch({ type: 'profile-loaded', profile: loaded, issues });
  }

  function loadInstrumentsText(text: string) {
    const { db, issues } = parseInstrumentDb(text);
    dispatch({ type: 'instruments-loaded', db, issues });
  }

  async function onFiles(files: FileList | null) {
    for (const file of files ?? []) {
      const text = await file.text();
      if (classify(text, file.name) === 'instruments') loadInstrumentsText(text);
      else loadProfileText(text);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    void onFiles(e.dataTransfer.files);
  }

  const issues = [...profileIssues, ...instrumentDbIssues];

  return (
    <section className="panel">
      <div className="panel-header">Workspace</div>
      <div
        className="panel-body"
        style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
      >
        {profile ? (
          <div className="profile-card">
            <span className="name">{profile.name}</span>
            <span className="meta">
              v{profile.version} · {profile.fixVersion} · {profile.systems.length} systems
            </span>
          </div>
        ) : (
          <p className="empty-note" style={{ padding: 0 }}>
            No profile loaded. Load the demo, or drop your own files — nothing ever leaves this
            browser.
          </p>
        )}
        {instrumentDb && (
          <div className="profile-card">
            <span className="name">Instrument DB</span>
            <span className="meta">
              {instrumentDb.instruments.size} instruments · {instrumentDb.strategies.size}{' '}
              strategies
            </span>
          </div>
        )}
        <div
          className={`dropzone${dragOver ? ' over' : ''}`}
          onClick={() => fileInput.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInput.current?.click();
          }}
          role="button"
          tabIndex={0}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          Drop <code>*.profile.json</code> or instrument files (JSON/CSV) here, or click to browse
        </div>
        <input
          ref={fileInput}
          type="file"
          accept=".json,.csv,application/json,text/csv"
          multiple
          hidden
          onChange={(e) => void onFiles(e.target.files)}
        />
        <button
          className="btn primary"
          onClick={() => {
            loadProfileText(demoProfileText);
            loadInstrumentsText(demoInstrumentsText);
          }}
        >
          Load demo profile + instruments
        </button>
        {issues.length > 0 && (
          <div>
            {issues.map((issue, i) => (
              <div key={i} className={`finding ${issue.severity}`}>
                <span className="sev-label">{issue.severity}</span>
                <span>
                  {issue.path && <code>{issue.path}</code>} {issue.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
