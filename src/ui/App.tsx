import { useEffect, useState } from 'react';
import { AppProvider } from './state/AppProvider.tsx';
import { useAppState } from './state/context.ts';
import { useBuildResult } from './state/derive.ts';
import { LoadPanel } from './files/LoadPanel.tsx';
import { Selectors } from './builder/Selectors.tsx';
import { SlotForm } from './builder/SlotForm.tsx';
import { BatchGrid } from './grid/BatchGrid.tsx';
import { LegGrid } from './grid/LegGrid.tsx';
import { ScenarioBar } from './scenario/ScenarioBar.tsx';
import { OutputPanel } from './output/OutputPanel.tsx';
import { FindingsPanel } from './validation/FindingsPanel.tsx';
import { HostBridge } from './transport/HostBridge.tsx';
import { TransportPanel } from './transport/TransportPanel.tsx';

type Theme = 'system' | 'light' | 'dark';

// Sandboxed iframes without allow-same-origin (e.g. some artifact/preview
// hosts) throw a SecurityError on any localStorage access; the theme
// preference is not worth crashing over.
function readStoredTheme(): Theme | undefined {
  try {
    return (localStorage.getItem('fixbuilder.theme') as Theme | null) ?? undefined;
  } catch {
    return undefined;
  }
}

function writeStoredTheme(theme: Theme | undefined): void {
  try {
    if (theme === undefined) localStorage.removeItem('fixbuilder.theme');
    else localStorage.setItem('fixbuilder.theme', theme);
  } catch {
    // storage unavailable — theme still applies for this session
  }
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme() ?? 'system');

  useEffect(() => {
    if (theme === 'system') {
      delete document.documentElement.dataset.theme;
      writeStoredTheme(undefined);
    } else {
      document.documentElement.dataset.theme = theme;
      writeStoredTheme(theme);
    }
  }, [theme]);

  return (
    <span className="seg" title="Theme">
      {(['system', 'light', 'dark'] as const).map((t) => (
        <button key={t} className={theme === t ? 'active' : ''} onClick={() => setTheme(t)}>
          {t === 'system' ? 'auto' : t}
        </button>
      ))}
    </span>
  );
}

/** Shown when the async dictionary chunk failed to load — most commonly a
 *  browser running a cached bundle from before the latest deploy. Reloading
 *  is the only real fix: browsers cache a failed module fetch, so an in-page
 *  re-import of the same URL rejects without retrying the network. */
function DictionaryErrorBanner() {
  const { dictionaryError } = useAppState();
  if (!dictionaryError) return null;
  return (
    <div className="finding error" style={{ margin: '0.6rem 0.9rem 0', alignItems: 'center' }}>
      <span className="sev-label">error</span>
      <span>
        {dictionaryError}. If this page has been open a while, the site was likely updated
        underneath it — reload to pick up the new version.
      </span>
      <span style={{ flex: 1 }} />
      <button className="btn small primary" onClick={() => window.location.reload()}>
        Reload page
      </button>
    </div>
  );
}

function Workbench() {
  const derived = useBuildResult();
  return (
    <main className="app-main">
      <HostBridge />
      <div className="rail">
        <LoadPanel />
        <ScenarioBar derived={derived} />
      </div>
      <div className="col col-center">
        <Selectors derived={derived} />
        <SlotForm derived={derived} />
        <BatchGrid derived={derived} />
        <LegGrid derived={derived} />
      </div>
      <div className="col">
        <OutputPanel derived={derived} />
        <TransportPanel derived={derived} />
        <FindingsPanel derived={derived} />
      </div>
    </main>
  );
}

export function App() {
  const channel = import.meta.env.BASE_URL.endsWith('/dev/') ? 'dev preview' : 'stable';
  return (
    <AppProvider>
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">
            <span className="fix-8">8=</span>FIX Message Builder
          </h1>
          <span className="badge-channel">{channel}</span>
          <span className="spacer" />
          <span className="hint">no data leaves this browser</span>
          <ThemeToggle />
        </header>
        <DictionaryErrorBanner />
        <Workbench />
      </div>
    </AppProvider>
  );
}
