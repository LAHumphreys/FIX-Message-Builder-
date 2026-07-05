import { field, findField } from '../engine/index.ts';

export function App() {
  // Placeholder wiring proving the UI layer consumes the engine's public
  // surface; replaced by the real builder in milestone 3.
  const demo = findField([field(35, 'D', { sourceId: 'demo', sourceLabel: 'Demo' })], 35);

  // The dev channel deploys under /dev/ (docs/WORKFLOW.md); the base path
  // therefore identifies which channel is being viewed.
  const channel = import.meta.env.BASE_URL.endsWith('/dev/') ? 'dev preview' : 'stable';

  return (
    <main>
      <h1>FIX Message Builder</h1>
      <p>
        A fully client-side tool for composing FIX protocol test messages. No data ever leaves your
        machine — there is no network activity after page load.
      </p>
      <p>
        Engine smoke test: <code>35 (MsgType) = {demo?.value}</code>
      </p>
      <footer>
        <small>
          Channel: <strong>{channel}</strong>
        </small>
      </footer>
    </main>
  );
}
