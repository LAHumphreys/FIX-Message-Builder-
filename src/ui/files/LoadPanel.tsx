import { useRef, useState, type DragEvent } from 'react';
import { parseProfile } from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import demoProfileText from '../../demo/demo.profile.json?raw';

export function LoadPanel() {
  const { profile, profileIssues } = useAppState();
  const dispatch = useAppDispatch();
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function loadText(text: string) {
    const { profile: loaded, issues } = parseProfile(text);
    dispatch({ type: 'profile-loaded', profile: loaded, issues });
  }

  async function onFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    loadText(await file.text());
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    void onFiles(e.dataTransfer.files);
  }

  return (
    <section className="panel">
      <div className="panel-header">Profile</div>
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
            No profile loaded. Load the demo, or drop your own <code>*.profile.json</code> — files
            never leave this browser.
          </p>
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
          Drop a profile here, or click to browse
        </div>
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={(e) => void onFiles(e.target.files)}
        />
        <button className="btn primary" onClick={() => loadText(demoProfileText)}>
          Load demo profile
        </button>
        {profileIssues.length > 0 && (
          <div>
            {profileIssues.map((issue, i) => (
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
