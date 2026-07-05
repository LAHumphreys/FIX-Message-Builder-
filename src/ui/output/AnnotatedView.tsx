import {
  buildAnnotatedLines,
  type Finding,
  type FixMessage,
  type Provenance,
} from '../../engine/index.ts';
import type { DerivedBuild } from '../state/derive.ts';

function provenanceTitle(p: Provenance): string {
  const parts = [`Set by: ${p.sourceLabel}${p.via ? ` (generator: ${p.via})` : ''}`];
  let over = p.overwrote;
  while (over) {
    parts.push(`Overwrote: ${over.sourceLabel}`);
    over = over.overwrote;
  }
  return parts.join('\n');
}

const SEV_COLOR: Record<string, string> = {
  error: 'var(--sev-error)',
  warning: 'var(--sev-warning)',
  info: 'var(--sev-info)',
};

export function AnnotatedView({
  derived,
  message,
}: {
  derived: DerivedBuild;
  message: FixMessage;
}) {
  if (!derived.resolved) return null;
  const lines = buildAnnotatedLines(message, derived.resolved.dictionary);
  const findingsByPath = new Map<string, Finding>();
  for (const f of derived.findings) {
    if (f.path && !findingsByPath.has(f.path)) findingsByPath.set(f.path, f);
  }

  return (
    <div className="annotated panel-body tight">
      {lines.length === 0 && <p className="empty-note">No fields composed yet.</p>}
      {lines.map((line) => {
        const finding = findingsByPath.get(line.path);
        const flagged =
          finding && (finding.severity === 'error' || finding.severity === 'warning')
            ? ` flagged-${finding.severity}`
            : '';
        return (
          <div
            key={line.path}
            className={`line${flagged}`}
            style={{ paddingLeft: `${0.7 + line.depth * 1.2}rem` }}
            title={finding?.message}
          >
            {finding && (
              <span className="sev-dot" style={{ background: SEV_COLOR[finding.severity] }} />
            )}
            <span className="tag">{line.tag}</span>
            {line.name && <span className="name">({line.name})</span>}
            <span className="eq">=</span>
            <span className="value">{line.value}</span>
            {line.enumLabel && <span className="enum-label">[{line.enumLabel}]</span>}
            {line.isGroupCount && <span className="hint">entries</span>}
            <span className="prov" title={provenanceTitle(line.provenance)}>
              {line.provenance.overwrote && <span className="overwrote">⊘ </span>}
              {line.provenance.sourceLabel}
              {line.provenance.via ? ' ⚙' : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
