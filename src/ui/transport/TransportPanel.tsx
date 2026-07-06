import { renderJsonMessage, renderTagValue } from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import type { DerivedBuild } from '../state/derive.ts';
import { FALLBACK_JSON_MAPPING } from '../output/jsonFallback.ts';
import { isEmbedded } from './embedded.ts';
import { PROTOCOL_VERSION, type SendMessage } from './protocol.ts';

let requestCounter = 0;

/**
 * Send panel + response log. Only rendered when the builder is embedded in
 * a host page (§ internal transport bridge). The builder itself never makes
 * a request: it posts the enriched JSON to the host window, which owns the
 * actual delivery, and displays whatever comes back.
 */
export function TransportPanel({ derived }: { derived: DerivedBuild }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { hostOrigin, transportLog, jsonMapping, scenarioName } = state;

  if (!isEmbedded()) return null;

  const canSend = hostOrigin !== undefined && derived.resolved && derived.messages.length > 0;

  const doSend = () => {
    if (!canSend || !derived.resolved) return;
    const mappings = derived.resolved.profile.renderers?.json ?? {};
    const cfg =
      (jsonMapping ? mappings[jsonMapping] : undefined) ??
      Object.values(mappings)[0] ??
      FALLBACK_JSON_MAPPING;

    requestCounter += 1;
    const requestId = `req-${Date.now()}-${requestCounter}`;
    const message: SendMessage = {
      type: 'fixbuilder:send',
      requestId,
      protocolVersion: PROTOCOL_VERSION,
      system: derived.resolved.system.id,
      systemLabel: derived.resolved.system.label,
      fixVersion: derived.messages[0]!.beginString,
      msgType: derived.messages[0]!.msgType,
      mode: derived.mode,
      scenarioName,
      ...(derived.resolved.system.transportHints !== undefined
        ? { transportHints: derived.resolved.system.transportHints }
        : {}),
      messages: derived.messages.map((m) => ({
        json: renderJsonMessage(m, derived.resolved!.dictionary, cfg),
        wire: renderTagValue(m, derived.resolved!.dictionary, { delimiter: 'pipe' }),
      })),
    };
    dispatch({
      type: 'transport-sent',
      id: requestId,
      summary: `${derived.messages.length} × 35=${message.msgType} → ${message.systemLabel}`,
      sentAt: Date.now(),
    });
    window.parent.postMessage(message, hostOrigin!);
  };

  return (
    <section className="panel">
      <div className="panel-header">
        Transport
        <span className="hint">
          {hostOrigin ? `host: ${hostOrigin}` : 'waiting for host page…'}
        </span>
        <span style={{ flex: 1 }} />
        {transportLog.length > 0 && (
          <button className="btn small" onClick={() => dispatch({ type: 'transport-clear' })}>
            Clear
          </button>
        )}
        <button className="btn small primary" disabled={!canSend} onClick={doSend}>
          ⇪ Send {derived.messages.length > 1 ? `${derived.messages.length} messages` : 'message'}
        </button>
      </div>
      <div className="panel-body tight">
        {transportLog.length === 0 && (
          <p className="empty-note">
            Messages sent to the host page appear here with their responses. The builder itself
            makes no network requests — delivery happens in the host window.
          </p>
        )}
        {transportLog.map((entry) => (
          <details key={entry.id} className={`transport-entry ${entry.state}`}>
            <summary>
              <span className={`sev-label ${entry.state === 'error' ? 'error' : ''}`}>
                {entry.state === 'pending' ? '…' : entry.state === 'ok' ? '✓' : '✗'}
              </span>
              <span className="mono">{entry.summary}</span>
              <span className="hint" style={{ marginLeft: 'auto' }}>
                {entry.status !== undefined ? `status ${entry.status} · ` : ''}
                {entry.timingMs !== undefined ? `${entry.timingMs} ms` : ''}
              </span>
            </summary>
            {entry.error && <div className="finding error">{entry.error}</div>}
            {entry.body !== undefined && (
              <pre className="raw-wire" style={{ margin: '0.4rem 0.7rem' }}>
                {typeof entry.body === 'string' ? entry.body : JSON.stringify(entry.body, null, 2)}
              </pre>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
