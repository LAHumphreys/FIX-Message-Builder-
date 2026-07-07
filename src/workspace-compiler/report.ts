/**
 * BUILD-REPORT.md + semantic lint (docs/PROFILE-WORKSPACE.md §5.1–5.2).
 * The report is the discoverability artifact: matrices answering "what runs
 * where", per-link summaries, and every warning with its source file.
 */
import { parseProfile } from '../engine/profile/load.ts';
import { parseInstrumentDb } from '../engine/instrument/db.ts';
import { resolveSystemDef } from '../engine/profile/types.ts';
import type { Profile } from '../engine/profile/types.ts';
import type { InstrumentDb } from '../engine/instrument/types.ts';
import type { ValueSource } from '../engine/instrument/convention.ts';
import type { CompileIssue } from './types.ts';
import type { CompiledWorkspace } from './compile.ts';

function schemesIn(source: ValueSource): string[] {
  if ('scheme' in source) return [source.scheme];
  if ('firstOf' in source) return source.firstOf.flatMap(schemesIn);
  return [];
}

/** Semantic lint over the compiled result (warnings only; errors came earlier). */
export function lintWorkspace(
  _compiled: CompiledWorkspace,
  profile: Profile | undefined,
  db: InstrumentDb | undefined
): CompileIssue[] {
  const issues: CompileIssue[] = [];
  if (!profile) return issues;
  const warn = (file: string, path: string, message: string) =>
    issues.push({ severity: 'warning', file, path, message });

  // Conventions actually in use (system-level + option overrides).
  const used = new Set<string>();
  for (const system of profile.systems) {
    const resolved = resolveSystemDef(profile, system.id);
    if (resolved?.convention) used.add(resolved.convention);
  }
  for (const dimension of profile.dimensions) {
    for (const option of dimension.options ?? []) {
      if (option.convention) used.add(option.convention);
    }
  }
  for (const name of Object.keys(profile.conventions ?? {})) {
    if (!used.has(name)) {
      warn(
        `conventions/${name}.json`,
        '',
        `convention '${name}' is not referenced by any link or option`
      );
    }
  }

  // Fragments never referenced (raw fragments the author may have orphaned).
  const referenced = new Set<string>();
  for (const system of profile.systems) {
    const resolved = resolveSystemDef(profile, system.id);
    for (const ref of resolved?.fragments ?? []) referenced.add(ref);
    if (resolved?.finalFragment) referenced.add(resolved.finalFragment);
  }
  for (const dimension of profile.dimensions) {
    for (const option of dimension.options ?? []) {
      if (option.fragment) referenced.add(option.fragment);
    }
  }
  for (const ref of Object.values(profile.templates ?? {})) referenced.add(ref);
  for (const id of Object.keys(profile.fragments)) {
    if (!referenced.has(id)) {
      warn('', `/fragments/${id}`, `fragment '${id}' is never referenced`);
    }
  }

  // Instruments missing schemes that in-use conventions require.
  if (db) {
    for (const name of used) {
      const convention = profile.conventions?.[name];
      if (!convention) continue;
      const requiredSchemes = new Set(
        convention.variants.flatMap((v) =>
          v.emit.filter((e) => e.required).flatMap((e) => schemesIn(e.from))
        )
      );
      for (const scheme of requiredSchemes) {
        const missing = [...db.instruments.values()].filter((r) => !r.schemes?.[scheme]);
        if (missing.length > 0) {
          warn(
            `conventions/${name}.json`,
            '',
            `${missing.length} instrument(s) lack scheme '${scheme}' required by convention '${name}' (e.g. ${missing
              .slice(0, 3)
              .map((r) => r.key)
              .join(', ')})`
          );
        }
      }
    }
  }
  return issues;
}

function matrix(
  title: string,
  rows: readonly string[],
  links: readonly string[],
  enabled: (row: string, link: string) => boolean
): string {
  if (rows.length === 0) return '';
  const header = `| ${title} | ${links.join(' | ')} |`;
  const divider = `| --- | ${links.map(() => '---').join(' | ')} |`;
  const body = rows
    .map((row) => `| ${row} | ${links.map((l) => (enabled(row, l) ? '✓' : '—')).join(' | ')} |`)
    .join('\n');
  return `${header}\n${divider}\n${body}\n`;
}

export function buildReport(compiled: CompiledWorkspace, lint: readonly CompileIssue[]): string {
  const profile = compiled.profileText ? parseProfile(compiled.profileText).profile : undefined;
  const db = compiled.instrumentsText ? parseInstrumentDb(compiled.instrumentsText).db : undefined;
  const lines: string[] = [];
  const links = [...compiled.linkIds].sort();

  lines.push('# Build report');
  lines.push('');
  if (!profile) {
    lines.push('**Build failed** — see the issues below.');
  } else {
    lines.push(
      `**${profile.name}** v${profile.version} · ${profile.fixVersion} · ` +
        `${profile.systems.length} link(s) · ${profile.dimensions.find((d) => d.id === 'flow')?.options?.length ?? 0} flow(s) · ` +
        `${db ? `${db.instruments.size} instrument(s), ${db.strategies.size} strategy(ies)` : 'no instrument DB'}`
    );
  }
  lines.push('');

  const flowRows = [...compiled.flowLinks.keys()].sort();
  lines.push('## Flows × links');
  lines.push('');
  lines.push(
    matrix('flow', flowRows, links, (flow, link) => {
      const enabled = compiled.flowLinks.get(flow);
      return enabled === '*' || (enabled ?? []).includes(link);
    })
  );

  if (compiled.clientLinks.size > 0) {
    lines.push('## Clients × links');
    lines.push('');
    lines.push(
      matrix('client', [...compiled.clientLinks.keys()].sort(), links, (client, link) =>
        (compiled.clientLinks.get(client) ?? []).includes(link)
      )
    );
  }
  if (compiled.routeLinks.size > 0) {
    lines.push('## Routes × links');
    lines.push('');
    lines.push(
      matrix('route', [...compiled.routeLinks.keys()].sort(), links, (route, link) =>
        (compiled.routeLinks.get(route) ?? []).includes(link)
      )
    );
  }

  if (profile) {
    lines.push('## Links');
    lines.push('');
    for (const system of [...profile.systems].sort((a, b) => (a.id < b.id ? -1 : 1))) {
      const resolved = resolveSystemDef(profile, system.id)!;
      const finalOps = resolved.finalFragment
        ? (profile.fragments[resolved.finalFragment]?.ops ?? [])
        : [];
      const enforced = finalOps
        .filter((o): o is { op: 'set'; tag: number; value: string } => o.op === 'set')
        .map((o) => `${o.tag}=${o.value}`)
        .join(', ');
      lines.push(
        `- **${resolved.label}** (\`${system.id}\`, from \`links/${system.id}.json\`) — ` +
          `convention: ${resolved.convention ?? 'none'}; ` +
          `capabilities: ${(resolved.capabilities ?? []).join(', ') || 'none'}; ` +
          `enforced: ${enforced || 'none'}`
      );
    }
    lines.push('');
  }

  const warnings = [...compiled.issues.filter((i) => i.severity === 'warning'), ...lint];
  if (warnings.length > 0) {
    lines.push('## Warnings');
    lines.push('');
    for (const w of warnings) {
      lines.push(
        `- ${w.file ? `\`${w.file}\`` : '(workspace)'}${w.path ? ` \`${w.path}\`` : ''}: ${w.message}`
      );
    }
    lines.push('');
  }
  if (compiled.overrideTouches.length > 0) {
    lines.push('## Override-file touches');
    lines.push('');
    lines.push(
      '`overrides.profile.json` rewrote these paths — consider upstreaming them into entity files:'
    );
    lines.push('');
    for (const t of compiled.overrideTouches) lines.push(`- \`${t}\``);
    lines.push('');
  }
  return lines.join('\n');
}
