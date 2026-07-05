import { useState } from 'react';
import {
  renderJsonText,
  renderTagValue,
  SOH,
  type FixMessage,
  type JsonMappingConfig,
  type TagValueDelimiter,
} from '../../engine/index.ts';
import { useAppDispatch, useAppState } from '../state/context.ts';
import type { DerivedBuild } from '../state/derive.ts';
import { AnnotatedView } from './AnnotatedView.tsx';
import { downloadText } from '../files/download.ts';

const DELIMITER_LABELS: Record<TagValueDelimiter, string> = {
  soh: 'SOH',
  pipe: '|',
  caretA: '^A',
};

function useWires(derived: DerivedBuild): string[] {
  const { delimiter, omitLengthAndChecksum } = useAppState();
  if (!derived.resolved) return [];
  return derived.messages.map((m: FixMessage) =>
    renderTagValue(m, derived.resolved!.dictionary, {
      delimiter,
      ...(omitLengthAndChecksum ? { omitLengthAndChecksum: true } : {}),
    })
  );
}

function useJsonMapping(derived: DerivedBuild): {
  name: string | undefined;
  cfg: JsonMappingConfig | undefined;
  names: string[];
} {
  const { jsonMapping } = useAppState();
  const mappings = derived.resolved?.profile.renderers?.json ?? {};
  const names = Object.keys(mappings);
  const name = jsonMapping && mappings[jsonMapping] ? jsonMapping : names[0];
  return { name, cfg: name ? mappings[name] : undefined, names };
}

function RawView({ derived }: { derived: DerivedBuild }) {
  const { delimiter } = useAppState();
  const wires = useWires(derived);
  return (
    <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {wires.map((wire, i) => (
        <div key={i} className="raw-wire">
          {delimiter === 'soh' ? wire.replaceAll(SOH, '␁') : wire}
        </div>
      ))}
    </div>
  );
}

function JsonView({ derived }: { derived: DerivedBuild }) {
  const { cfg } = useJsonMapping(derived);
  if (!derived.resolved || !cfg) {
    return <p className="empty-note">The loaded profile declares no JSON mapping.</p>;
  }
  const text = renderJsonText(derived.messages, derived.resolved.dictionary, cfg);
  return (
    <div className="panel-body">
      <pre className="raw-wire" style={{ margin: 0 }}>
        {text}
      </pre>
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
  const { outputTab, delimiter, omitLengthAndChecksum, scenarioName } = useAppState();
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const wires = useWires(derived);
  const { name: mappingName, cfg, names } = useJsonMapping(derived);

  if (!derived.resolved || derived.messages.length === 0) {
    return (
      <section className="panel">
        <div className="panel-header">Output</div>
        <p className="empty-note">Load a profile and pick a flow to see the message.</p>
      </section>
    );
  }

  const activeIndex = Math.min(msgIndex, derived.messages.length - 1);

  const exportText = (): { text: string; filename: string } => {
    if (outputTab === 'json' && cfg) {
      return {
        text: renderJsonText(derived.messages, derived.resolved!.dictionary, cfg),
        filename: `${scenarioName || 'messages'}.json`,
      };
    }
    return { text: wires.join('\n') + '\n', filename: `${scenarioName || 'messages'}.fix.txt` };
  };

  const doCopy = async () => {
    if (await copyText(exportText().text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        Output · <code>35={derived.messages[activeIndex]!.msgType}</code>
        {derived.messages.length > 1 && (
          <span className="seg">
            {derived.messages.map((_, i) => (
              <button
                key={i}
                className={i === activeIndex ? 'active' : ''}
                onClick={() => setMsgIndex(i)}
              >
                {i + 1}
              </button>
            ))}
          </span>
        )}
        <span style={{ flex: 1 }} />
        <span className="seg" role="tablist">
          {(['annotated', 'raw', 'json'] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={outputTab === tab}
              className={outputTab === tab ? 'active' : ''}
              onClick={() => dispatch({ type: 'set-output-tab', tab })}
            >
              {tab === 'annotated' ? 'Annotated' : tab === 'raw' ? 'tag=value' : 'JSON'}
            </button>
          ))}
        </span>
      </div>
      {outputTab === 'annotated' ? (
        <AnnotatedView derived={derived} message={derived.messages[activeIndex]!} />
      ) : outputTab === 'raw' ? (
        <RawView derived={derived} />
      ) : (
        <JsonView derived={derived} />
      )}
      <div
        className="panel-body"
        style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          borderTop: '1px solid var(--border)',
        }}
      >
        {outputTab !== 'json' && (
          <>
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
            <label
              className="hint"
              style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}
            >
              <input
                type="checkbox"
                checked={omitLengthAndChecksum}
                onChange={(e) =>
                  dispatch({ type: 'set-omit-length-checksum', omit: e.target.checked })
                }
              />
              omit 9/10
            </label>
          </>
        )}
        {outputTab === 'json' && names.length > 1 && (
          <select
            className="input"
            style={{ width: 'auto' }}
            value={mappingName}
            onChange={(e) => dispatch({ type: 'set-json-mapping', mapping: e.target.value })}
          >
            {names.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        )}
        <span style={{ flex: 1 }} />
        <button className="btn small" onClick={() => dispatch({ type: 'regenerate' })}>
          ↻ Regenerate
        </button>
        <button
          className="btn small"
          onClick={() => {
            const { text, filename } = exportText();
            downloadText(filename, text);
          }}
        >
          ⬇ Download
        </button>
        <button className="btn small primary" onClick={() => void doCopy()}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
    </section>
  );
}
