import { useState } from 'react';
import { renderTagValue, SOH, type TagValueDelimiter } from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import type { DerivedBuild } from '../state/derive.ts';
import { AnnotatedView } from './AnnotatedView.tsx';

const DELIMITER_LABELS: Record<TagValueDelimiter, string> = {
  soh: 'SOH',
  pipe: '|',
  caretA: '^A',
};

function RawView({ derived }: { derived: DerivedBuild }) {
  const { delimiter, omitLengthAndChecksum } = useAppState();
  if (!derived.result || !derived.resolved) return null;
  const wire = renderTagValue(derived.result.message, derived.resolved.dictionary, {
    delimiter,
    ...(omitLengthAndChecksum ? { omitLengthAndChecksum: true } : {}),
  });
  // SOH is invisible; show it as ␁ in the view (copy still uses the real byte).
  const display = delimiter === 'soh' ? wire.replaceAll(SOH, '␁') : wire;
  return (
    <div className="panel-body">
      <div className="raw-wire">{display}</div>
    </div>
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function OutputPanel({ derived }: { derived: DerivedBuild }) {
  const { outputTab, delimiter, omitLengthAndChecksum } = useAppState();
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);

  if (!derived.result || !derived.resolved) {
    return (
      <section className="panel">
        <div className="panel-header">Output</div>
        <p className="empty-note">Load a profile and pick a flow to see the message.</p>
      </section>
    );
  }

  const doCopy = async () => {
    const wire = renderTagValue(derived.result!.message, derived.resolved!.dictionary, {
      delimiter,
      ...(omitLengthAndChecksum ? { omitLengthAndChecksum: true } : {}),
    });
    if (await copyText(wire)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        Output · <code>35={derived.result.msgType}</code>
        <span style={{ flex: 1 }} />
        <span className="seg" role="tablist">
          {(['annotated', 'raw'] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={outputTab === tab}
              className={outputTab === tab ? 'active' : ''}
              onClick={() => dispatch({ type: 'set-output-tab', tab })}
            >
              {tab === 'annotated' ? 'Annotated' : 'tag=value'}
            </button>
          ))}
        </span>
      </div>
      {outputTab === 'annotated' ? (
        <AnnotatedView derived={derived} />
      ) : (
        <RawView derived={derived} />
      )}
      <div
        className="panel-body"
        style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          borderTop: '1px solid var(--border)',
        }}
      >
        <span className="seg">
          {(Object.keys(DELIMITER_LABELS) as TagValueDelimiter[]).map((d) => (
            <button
              key={d}
              className={delimiter === d ? 'active' : ''}
              onClick={() => dispatch({ type: 'set-delimiter', delimiter: d })}
              title={`Delimiter: ${DELIMITER_LABELS[d]}`}
            >
              {DELIMITER_LABELS[d]}
            </button>
          ))}
        </span>
        <label className="hint" style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={omitLengthAndChecksum}
            onChange={(e) => dispatch({ type: 'set-omit-length-checksum', omit: e.target.checked })}
          />
          omit 9/10
        </label>
        <span style={{ flex: 1 }} />
        <button className="btn small" onClick={() => dispatch({ type: 'regenerate' })}>
          ↻ Regenerate
        </button>
        <button className="btn small primary" onClick={() => void doCopy()}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
    </section>
  );
}
