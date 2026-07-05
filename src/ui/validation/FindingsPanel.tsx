import type { DerivedBuild } from '../state/derive.ts';

const ORDER = { error: 0, warning: 1, info: 2 } as const;

export function FindingsPanel({ derived }: { derived: DerivedBuild }) {
  if (!derived.resolved) return null;
  const findings = [...derived.findings].sort((a, b) => ORDER[a.severity] - ORDER[b.severity]);
  const notices = derived.notices;

  return (
    <section className="panel">
      <div className="panel-header">
        Findings
        <span style={{ flex: 1 }} />
        <span className="hint">
          {findings.length === 0
            ? 'clean'
            : `${findings.length} finding${findings.length > 1 ? 's' : ''}`}
          {notices.length > 0
            ? ` · ${notices.length} merge notice${notices.length > 1 ? 's' : ''}`
            : ''}
        </span>
      </div>
      <div className="panel-body tight">
        {findings.length === 0 && notices.length === 0 && (
          <p className="empty-note">
            No validation findings. Validation informs — it never blocks.
          </p>
        )}
        {findings.map((f, i) => (
          <div key={i} className={`finding ${f.severity}`}>
            <span className="sev-label">{f.severity}</span>
            <span>
              {f.path && <code>{f.path}</code>} {f.message}
            </span>
            <span className="rule">{f.ruleId}</span>
          </div>
        ))}
        {notices.map((n, i) => (
          <div key={`n${i}`} className="finding info">
            <span className="sev-label">merge</span>
            <span>
              {n.kind === 'overwrite' && (
                <>
                  <code>{n.path}</code> '{n.previousValue}' from <em>{n.previous}</em> overwritten
                  by <em>{n.by}</em>
                </>
              )}
              {n.kind === 'remove' && (
                <>
                  <code>{n.path}</code> set by <em>{n.previous}</em> removed by <em>{n.by}</em>
                </>
              )}
              {n.kind === 'group-replace' && (
                <>
                  group <code>{n.countTag}</code> from <em>{n.previous}</em> replaced by{' '}
                  <em>{n.by}</em>
                </>
              )}
            </span>
            <span className="rule">merge</span>
          </div>
        ))}
      </div>
    </section>
  );
}
