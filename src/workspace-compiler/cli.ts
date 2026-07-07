/**
 * fixb — the profile-workspace CLI (docs/PROFILE-WORKSPACE.md §5).
 *
 *   fixb build   [src] [--out dir] [--check]
 *   fixb explain [src] <entity-file>
 *   fixb explode <profile.json> [instruments.json] [--out dir]
 *   fixb init    [dir]
 *
 * This file is the only place with filesystem access; the compiler core is
 * pure. Bundled dependency-free (esbuild) for office use without npm.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  watch as fsWatch,
  writeFileSync,
} from 'node:fs';
import { join, relative } from 'node:path';
import { compileWorkspace, type CompiledWorkspace } from './compile.ts';
import { buildReport, lintWorkspace } from './report.ts';
import { generateGoldens } from './goldens.ts';
import { explodeProfile } from './explode.ts';
import { ideaFiles, scaffold } from './init.ts';
import { parseProfile } from '../engine/profile/load.ts';
import { parseInstrumentDb } from '../engine/instrument/db.ts';
import type { CompileIssue } from './types.ts';

function readWorkspace(dir: string): Map<string, string> {
  const files = new Map<string, string>();
  const walk = (d: string): void => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(json|csv)$/i.test(entry)) {
        files.set(relative(dir, full).replace(/\\/g, '/'), readFileSync(full, 'utf8'));
      }
    }
  };
  walk(dir);
  return files;
}

function printIssues(issues: readonly CompileIssue[]): void {
  for (const issue of issues) {
    const where = [issue.file, issue.path].filter(Boolean).join(' ');
    console.log(
      `${issue.severity.toUpperCase().padEnd(7)} ${where ? where + ' — ' : ''}${issue.message}`
    );
  }
}

interface OutFile {
  readonly path: string;
  readonly content: string;
}

function collectOutputs(
  compiled: CompiledWorkspace,
  report: string,
  goldens: ReadonlyMap<string, string> | undefined,
  outDir: string
): OutFile[] {
  const outputs: OutFile[] = [];
  if (compiled.profileText)
    outputs.push({ path: join(outDir, 'work.profile.json'), content: compiled.profileText });
  if (compiled.instrumentsText)
    outputs.push({ path: join(outDir, 'instruments.json'), content: compiled.instrumentsText });
  outputs.push({ path: join(outDir, 'BUILD-REPORT.md'), content: report });
  for (const [name, wire] of goldens ?? []) {
    outputs.push({ path: join(outDir, 'golden', name), content: wire });
  }
  return outputs;
}

async function build(src: string, outDir: string, check: boolean): Promise<number> {
  const compiled = compileWorkspace(readWorkspace(src));
  const profile = compiled.profileText ? parseProfile(compiled.profileText).profile : undefined;
  const db = compiled.instrumentsText ? parseInstrumentDb(compiled.instrumentsText).db : undefined;
  const lint = lintWorkspace(compiled, profile, db);
  const report = buildReport(compiled, lint);
  printIssues([...compiled.issues, ...lint]);

  const errors = compiled.issues.filter((i) => i.severity === 'error');
  if (errors.length > 0 || !compiled.profileText) {
    console.error(`\nbuild FAILED with ${errors.length} error(s).`);
    return 1;
  }

  const goldens = compiled.goldensRequested
    ? await generateGoldens(compiled.profileText, compiled.instrumentsText)
    : undefined;
  const outputs = collectOutputs(compiled, report, goldens, outDir);

  if (check) {
    const stale = outputs.filter(
      (o) => !existsSync(o.path) || readFileSync(o.path, 'utf8') !== o.content
    );
    if (stale.length > 0) {
      console.error(
        `\n--check FAILED: ${stale.length} output(s) out of date. Re-run 'fixb build' and commit:`
      );
      for (const o of stale) console.error(`  ${o.path}`);
      return 1;
    }
    console.log('\n--check OK: outputs are up to date.');
    return 0;
  }

  for (const o of outputs) {
    mkdirSync(join(o.path, '..'), { recursive: true });
    writeFileSync(o.path, o.content);
    console.log(`wrote ${o.path}`);
  }
  console.log(
    `\nbuild OK (${compiled.issues.length + lint.length} warning(s)) — see ${join(outDir, 'BUILD-REPORT.md')}`
  );
  return 0;
}

function explain(src: string, entity: string): number {
  const compiled = compileWorkspace(readWorkspace(src));
  if (!compiled.profile) {
    printIssues(compiled.issues);
    return 1;
  }
  const profile = compiled.profile as {
    systems: { id: string }[];
    dimensions: { id: string; options?: { id: string; fragment?: string }[] }[];
    fragments: Record<string, unknown>;
    dictionaryOverlay?: { fields?: Record<string, unknown> };
  };
  const id = entity.replace(/^.*\//, '').replace(/\.(json|csv)$/i, '');
  const chunks: Record<string, unknown> = {};

  if (entity.startsWith('links/')) {
    chunks[`system '${id}'`] = profile.systems.find((s) => s.id === id);
    for (const [fid, fragment] of Object.entries(profile.fragments)) {
      if (fid.startsWith(`link:${id}:`)) chunks[`fragment '${fid}'`] = fragment;
    }
    for (const dimension of profile.dimensions) {
      const gated = (dimension.options ?? []).filter((o) => JSON.stringify(o).includes(`"${id}"`));
      if (gated.length > 0)
        chunks[`dimension '${dimension.id}' options gated to this link`] = gated;
    }
  } else if (entity.startsWith('flows/')) {
    const flowDim = profile.dimensions.find((d) => d.id === 'flow');
    chunks[`flow option '${id}'`] = flowDim?.options?.find((o) => o.id === id);
    chunks[`fragment 'flow:${id}'`] = profile.fragments[`flow:${id}`];
  } else {
    console.error(`explain supports links/… and flows/… entities (got '${entity}')`);
    return 1;
  }
  for (const [title, chunk] of Object.entries(chunks)) {
    console.log(`\n── ${title} ${'─'.repeat(Math.max(1, 60 - title.length))}`);
    console.log(JSON.stringify(chunk, null, 2));
  }
  return 0;
}

function explodeCmd(
  profilePath: string,
  instrumentsPath: string | undefined,
  outDir: string
): number {
  const profileText = readFileSync(profilePath, 'utf8');
  const instrumentsText = instrumentsPath ? readFileSync(instrumentsPath, 'utf8') : undefined;
  const { files, notes } = explodeProfile(profileText, instrumentsText);
  printIssues(notes);
  for (const [path, content] of files) {
    const full = join(outDir, path);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, content);
    console.log(`wrote ${full}`);
  }
  console.log(`\nexploded into ${outDir}/ — run 'fixb build ${outDir}' to verify it compiles.`);
  return 0;
}

function initCmd(dir: string, idea: boolean): number {
  const files = new Map([...scaffold(), ...(idea ? ideaFiles() : [])]);
  for (const [path, content] of files) {
    const full = join(dir, path);
    if (existsSync(full)) {
      console.log(`skip  ${full} (exists)`);
      continue;
    }
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, content);
    console.log(`wrote ${full}`);
  }
  console.log(
    `\nworkspace scaffolded — edit the files, then 'fixb build ${dir}'.` +
      (idea
        ? ' IntelliJ users: reopen the project to pick up the File Watcher + schema mappings.'
        : " (tip: 'fixb init --idea' also writes IntelliJ File Watcher + schema mappings)")
  );
  return 0;
}

/** Rebuild on change — per-directory fs.watch (recursive watch needs newer
 *  Node on Linux; this stays compatible with the Node ≥14.18 floor). */
async function watchCmd(src: string, outDir: string): Promise<number> {
  const run = async () => {
    const started = Date.now();
    const code = await build(src, outDir, false);
    console.log(`— ${code === 0 ? 'ok' : 'FAILED'} in ${Date.now() - started}ms; watching…\n`);
  };
  await run();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const trigger = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => void run(), 250);
  };
  const dirs = ['', 'links', 'flows', 'conventions', 'mappings', 'instruments', 'fragments']
    .map((d) => join(src, d))
    .filter((d) => existsSync(d));
  for (const dir of dirs) fsWatch(dir, trigger);
  await new Promise(() => undefined); // run until Ctrl+C
  return 0;
}

export async function main(argv: readonly string[]): Promise<number> {
  const args = argv.filter((a) => !a.startsWith('--'));
  const flags = new Set(argv.filter((a) => a.startsWith('--')));
  const outFlag = argv.find((a) => a.startsWith('--out='))?.slice('--out='.length);
  const [command, ...rest] = args;

  switch (command) {
    case 'build':
      return build(rest[0] ?? '.', outFlag ?? rest[0] ?? '.', flags.has('--check'));
    case 'explain': {
      if (!rest[1] && !rest[0]) {
        console.error('usage: fixb explain <src-dir> <entity-file>');
        return 1;
      }
      const [src, entity] = rest.length >= 2 ? [rest[0]!, rest[1]!] : ['.', rest[0]!];
      return explain(src, entity);
    }
    case 'explode':
      if (!rest[0]) {
        console.error('usage: fixb explode <profile.json> [instruments.json] [--out=dir]');
        return 1;
      }
      return explodeCmd(rest[0], rest[1], outFlag ?? 'profile-src');
    case 'init':
      return initCmd(rest[0] ?? 'profile-src', flags.has('--idea'));
    case 'watch':
      return watchCmd(rest[0] ?? '.', outFlag ?? rest[0] ?? '.');
    default:
      console.error(
        'fixb — FIX Message Builder profile workspace tool\n\n' +
          'usage:\n' +
          '  fixb build   [src] [--out=dir] [--check]   assemble + validate + report (+ goldens)\n' +
          '  fixb explain [src] <entity-file>           show what a source file compiles into\n' +
          '  fixb explode <profile.json> [instruments.json] [--out=dir]\n' +
          '                                             decompile an existing profile into a workspace\n' +
          '  fixb init    [dir] [--idea]                scaffold a starter workspace (+ IntelliJ files)\n' +
          '  fixb watch   [src] [--out=dir]             rebuild on change (for the IDE terminal)\n\n' +
          'docs: docs/PROFILE-WORKSPACE.md'
      );
      return command ? 1 : 0;
  }
}
