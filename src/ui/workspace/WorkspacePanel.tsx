import { useCallback, useEffect, useRef, useState } from 'react';
import {
  parseInstrumentDb,
  parseProfile,
  parseScenario,
  scenarioCompatibility,
  serializeScenario,
} from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import type { DerivedBuild } from '../state/derive.ts';
import { currentScenario } from '../scenario/currentScenario.ts';
import {
  ensurePermission,
  FsaWorkspace,
  getActiveWorkspace,
  isWorkspaceSupported,
  pickWorkspaceDirectory,
  readFixbSources,
  setActiveWorkspace,
} from './fsa.ts';
import { compileWorkspace } from '../../workspace-compiler/compile.ts';
import { clearStoredHandle, loadStoredHandle, storeHandle } from './handleStore.ts';

function scenarioFileName(name: string): string {
  const safe = name.trim().replace(/[^\w.-]+/g, '-') || 'untitled';
  return `scenarios/${safe}.scenario.json`;
}

/**
 * Workspace mode (brief §3.9 Tier 1, milestone 6): attach a directory —
 * typically a checkout of the private config repo — scan it by convention,
 * list scenarios in a sidebar, save in place with optimistic concurrency.
 * Chromium-only; feature-detected away elsewhere (Tier 2 keeps working).
 */
export function WorkspacePanel({ derived }: { derived: DerivedBuild }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { workspace, profile, scenarioName } = state;
  const [restorable, setRestorable] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [conflict, setConflict] = useState<{ path: string; text: string } | undefined>();
  const stateRef = useRef(state);
  stateRef.current = state;
  const saveScenarioRef = useRef<(() => Promise<void>) | undefined>(undefined);

  const lastCompiledRef = useRef<string | undefined>(undefined);

  /** fixb source repo: compile in the browser; the app previews live config. */
  const loadFixb = useCallback(
    async (ws: FsaWorkspace, initial: boolean): Promise<void> => {
      const sources = await readFixbSources(ws);
      const compiled = compileWorkspace(sources);
      const errors = compiled.issues.filter((i) => i.severity === 'error');
      if (!compiled.profileText || errors.length > 0) {
        setError(
          `fixb build failed: ${errors[0] ? `${errors[0].file} ${errors[0].path} — ${errors[0].message}` : 'no output'}` +
            (errors.length > 1 ? ` (+${errors.length - 1} more)` : '')
        );
        return;
      }
      setError(undefined);
      if (compiled.profileText !== lastCompiledRef.current) {
        lastCompiledRef.current = compiled.profileText;
        const { profile: loaded, issues } = parseProfile(compiled.profileText);
        if (loaded && !initial) {
          // Recompile of an already-attached workspace: hot-swap, keeping
          // the tester's selections and values (live preview).
          dispatch({ type: 'profile-hot-swapped', profile: loaded, issues });
        } else {
          dispatch({ type: 'profile-loaded', profile: loaded, issues });
        }
        if (compiled.instrumentsText) {
          const { db, issues: dbIssues } = parseInstrumentDb(compiled.instrumentsText);
          dispatch({ type: 'instruments-loaded', db, issues: dbIssues });
        }
      }
      if (initial) {
        // Instrument CRUD may write back only when there is exactly one JSON
        // source file without the compiler's `defaults` sugar — otherwise the
        // compiled DB cannot be split back into sources faithfully.
        const sourceFiles = [...sources.keys()].filter((p) => p.startsWith('instruments/'));
        const single = sourceFiles.length === 1 && sourceFiles[0]!.endsWith('.json');
        const hasDefaults = single && (sources.get(sourceFiles[0]!) ?? '').includes('"defaults"');
        if (single && !hasDefaults) {
          const file = await ws.read(sourceFiles[0]!);
          if (file) {
            dispatch({
              type: 'workspace-instruments-origin',
              path: file.path,
              token: file.modifiedToken,
            });
          }
        }
      }
    },
    [dispatch]
  );

  const scan = useCallback(
    async (ws: FsaWorkspace, loadConfig: boolean) => {
      const scenarios = await ws.list('scenarios');
      const isFixb = (await ws.read('workspace.json')) !== undefined;
      if (isFixb && !loadConfig) {
        // Live preview: recompile the sources on every rescan; the dispatch
        // is skipped when the compiled output is unchanged.
        await loadFixb(ws, false);
      }
      if (loadConfig) {
        if (isFixb) {
          await loadFixb(ws, true);
          dispatch({
            type: 'workspace-attached',
            workspace: { name: ws.name, kind: 'fixb', scenarios: [...scenarios] },
          });
          return;
        }
        const profiles = (await ws.list('profile')).filter((e) => e.path.endsWith('.json'));
        const profileFile = profiles[0] && (await ws.read(profiles[0].path));
        if (profileFile) {
          const { profile: loaded, issues } = parseProfile(profileFile.text);
          dispatch({ type: 'profile-loaded', profile: loaded, issues });
        }
        const instrumentFiles = await ws.list('instruments');
        const instrumentsFile = instrumentFiles[0] && (await ws.read(instrumentFiles[0].path));
        if (instrumentsFile) {
          const { db, issues } = parseInstrumentDb(instrumentsFile.text);
          dispatch({ type: 'instruments-loaded', db, issues });
        }
        dispatch({
          type: 'workspace-attached',
          workspace: { name: ws.name, kind: 'plain', scenarios: [...scenarios] },
        });
        if (instrumentsFile) {
          dispatch({
            type: 'workspace-instruments-origin',
            path: instrumentsFile.path,
            token: instrumentsFile.modifiedToken,
          });
        }
      } else {
        const loaded = stateRef.current.workspace;
        const current = loaded?.loadedScenarioPath
          ? scenarios.find((s) => s.path === loaded.loadedScenarioPath)
          : undefined;
        dispatch({
          type: 'workspace-scenarios',
          scenarios: [...scenarios],
          ...(loaded?.loadedScenarioPath
            ? { changedOnDisk: !!current && current.modifiedToken !== loaded.loadedScenarioToken }
            : {}),
        });
      }
    },
    [dispatch, loadFixb]
  );

  // Offer one-click reattach for a handle persisted in IndexedDB.
  useEffect(() => {
    if (!isWorkspaceSupported()) return;
    void loadStoredHandle().then((handle) => {
      if (handle && typeof handle === 'object' && 'name' in handle) {
        setRestorable((handle as { name: string }).name);
      }
    });
  }, []);

  // Ctrl/Cmd+S saves in place while a workspace is attached (desktop-first).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && stateRef.current.workspace) {
        e.preventDefault();
        void saveScenarioRef.current?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Rescan on window focus (§3.9: no file-watch API exists).
  useEffect(() => {
    const onFocus = () => {
      const ws = getActiveWorkspace();
      if (ws) void scan(ws, false).catch(() => undefined);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [scan]);

  if (!isWorkspaceSupported()) return null;

  const attach = async (handle?: unknown) => {
    setBusy(true);
    setError(undefined);
    try {
      let dir = handle as ConstructorParameters<typeof FsaWorkspace>[0] | undefined;
      if (dir) {
        if (!(await ensurePermission(dir))) throw new Error('permission not granted');
      } else {
        dir = await pickWorkspaceDirectory();
      }
      const ws = new FsaWorkspace(dir);
      setActiveWorkspace(ws);
      await storeHandle(dir);
      setRestorable(undefined);
      await scan(ws, true);
    } catch (e) {
      if (!String(e).includes('AbortError')) setError(String(e));
    } finally {
      setBusy(false);
    }
  };

  const reattach = async () => {
    const handle = await loadStoredHandle();
    if (handle) await attach(handle);
  };

  const detach = async () => {
    setActiveWorkspace(undefined);
    await clearStoredHandle();
    setRestorable(undefined);
    dispatch({ type: 'workspace-detached' });
  };

  const loadScenario = async (path: string) => {
    const ws = getActiveWorkspace();
    if (!ws || !profile) return;
    const file = await ws.read(path);
    if (!file) return;
    const { scenario, issues } = parseScenario(file.text);
    if (!scenario) {
      setError(`could not parse ${path}`);
      return;
    }
    dispatch({
      type: 'apply-scenario',
      scenario,
      findings: [
        ...issues.map((i) => ({
          ruleId: 'scenario-load',
          severity: i.severity,
          path: i.path,
          message: i.message,
        })),
        ...scenarioCompatibility(scenario, profile),
      ],
    });
    dispatch({ type: 'workspace-scenario-origin', path, token: file.modifiedToken });
  };

  const writeScenario = async (path: string, text: string, expectedToken: string | undefined) => {
    const ws = getActiveWorkspace();
    if (!ws) return;
    const result = await ws.write(path, text, expectedToken);
    if (!result.ok) {
      setConflict({ path, text });
      return;
    }
    setConflict(undefined);
    dispatch({ type: 'workspace-scenario-origin', path, token: result.entry.modifiedToken });
    await scan(ws, false);
  };

  const saveScenario = async () => {
    if (!profile || !derived.resolved) return;
    const text = serializeScenario(currentScenario(stateRef.current, derived));
    const path = scenarioFileName(scenarioName);
    const expected =
      workspace?.loadedScenarioPath === path ? workspace.loadedScenarioToken : undefined;
    // A brand-new file needs no token; an existing file we did NOT load from
    // still deserves a conflict check — read its current token as "expected
    // none" and let overwrite be explicit via the conflict flow.
    const ws = getActiveWorkspace();
    if (!ws) return;
    if (expected === undefined) {
      const existing = await ws.read(path);
      if (existing) {
        setConflict({ path, text });
        return;
      }
    }
    await writeScenario(path, text, expected);
  };
  saveScenarioRef.current = saveScenario;

  if (!workspace) {
    return (
      <section className="panel">
        <div className="panel-header">Workspace folder</div>
        <div
          className="panel-body"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <p className="hint" style={{ margin: 0 }}>
            Attach a local checkout of your config repo (<code>profile/</code>,{' '}
            <code>instruments/</code>, <code>scenarios/</code>) to load and save files in place.
            Nothing leaves this machine.
          </p>
          {restorable && (
            <button className="btn" disabled={busy} onClick={() => void reattach()}>
              ↻ Reattach “{restorable}”
            </button>
          )}
          <button className="btn primary" disabled={busy} onClick={() => void attach()}>
            📂 Attach workspace folder…
          </button>
          {error && <div className="finding error">{error}</div>}
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-header">
        Workspace: {workspace.name}
        {workspace.kind === 'fixb' && (
          <span className="badge-channel" title="fixb source workspace — compiled in the browser">
            fixb
          </span>
        )}
        <span style={{ flex: 1 }} />
        <button
          className="btn small"
          title="Rescan (also happens on window focus)"
          onClick={() => {
            const ws = getActiveWorkspace();
            if (ws) void scan(ws, false);
          }}
        >
          ↻
        </button>
        <button className="btn small" onClick={() => void detach()}>
          Detach
        </button>
      </div>
      <div
        className="panel-body"
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        {workspace.changedOnDisk && workspace.loadedScenarioPath && (
          <div className="finding warning">
            <span className="sev-label">changed</span>
            <span>
              <code>{workspace.loadedScenarioPath}</code> changed on disk since it was loaded.
            </span>
            <button
              className="btn small"
              onClick={() => void loadScenario(workspace.loadedScenarioPath!)}
            >
              Reload
            </button>
          </div>
        )}
        {conflict && (
          <div className="finding error" style={{ alignItems: 'center', gap: '0.4rem' }}>
            <span className="sev-label">conflict</span>
            <span style={{ flex: 1 }}>
              <code>{conflict.path}</code> changed on disk — never silently overwritten.
            </span>
            <button
              className="btn small"
              onClick={() => void writeScenario(conflict.path, conflict.text, undefined)}
            >
              Overwrite
            </button>
            <button className="btn small" onClick={() => void loadScenario(conflict.path)}>
              Reload theirs
            </button>
            <button
              className="btn small"
              onClick={() => {
                const copy = conflict.path.replace(/\.scenario\.json$/, '-copy.scenario.json');
                void writeScenario(copy, conflict.text, undefined);
              }}
            >
              Save as copy
            </button>
          </div>
        )}
        {workspace.kind === 'fixb' && (
          <p className="hint" style={{ margin: 0 }}>
            Source workspace: edit <code>links/</code>, <code>flows/</code>… in your IDE — switching
            back to this tab recompiles and refreshes the preview.
          </p>
        )}
        {profile && (
          <button
            className="btn primary"
            disabled={!derived.resolved}
            onClick={() => void saveScenario()}
          >
            💾 Save scenario to workspace
            {workspace.loadedScenarioPath === scenarioFileName(scenarioName) ? ' (in place)' : ''}
          </button>
        )}
        <div className="workspace-scenarios">
          {workspace.scenarios.length === 0 && (
            <p className="hint" style={{ margin: 0 }}>
              No <code>scenarios/*.scenario.json</code> yet — save one above.
            </p>
          )}
          {workspace.scenarios.map((entry) => (
            <button
              key={entry.path}
              className={`workspace-scenario${
                workspace.loadedScenarioPath === entry.path ? ' active' : ''
              }`}
              onClick={() => void loadScenario(entry.path)}
              title={entry.path}
            >
              {entry.path.replace(/^scenarios\//, '').replace(/\.scenario\.json$/, '')}
            </button>
          ))}
        </div>
        {error && <div className="finding error">{error}</div>}
      </div>
    </section>
  );
}
