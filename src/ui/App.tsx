import { useEffect, useState } from 'react';
import { AppProvider } from './state/AppProvider.tsx';
import { useBuildResult } from './state/derive.ts';
import { LoadPanel } from './files/LoadPanel.tsx';
import { Selectors } from './builder/Selectors.tsx';
import { SlotForm } from './builder/SlotForm.tsx';
import { OutputPanel } from './output/OutputPanel.tsx';
import { FindingsPanel } from './validation/FindingsPanel.tsx';

type Theme = 'system' | 'light' | 'dark';

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('fixbuilder.theme') as Theme | null) ?? 'system'
  );

  useEffect(() => {
    if (theme === 'system') {
      delete document.documentElement.dataset.theme;
      localStorage.removeItem('fixbuilder.theme');
    } else {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem('fixbuilder.theme', theme);
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

function Workbench() {
  const derived = useBuildResult();
  return (
    <main className="app-main">
      <div className="rail">
        <LoadPanel />
      </div>
      <div className="col col-center">
        <Selectors derived={derived} />
        <SlotForm derived={derived} />
      </div>
      <div className="col">
        <OutputPanel derived={derived} />
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
        <Workbench />
      </div>
    </AppProvider>
  );
}
