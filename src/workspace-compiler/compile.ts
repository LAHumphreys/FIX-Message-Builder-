/**
 * Workspace → profile compiler (docs/PROFILE-WORKSPACE.md §4–§5).
 *
 * Deliberately semantics-free: this module only assembles JSON. The
 * assembled profile is validated by the REAL engine loader, so workspace
 * output can never drift from what the app accepts.
 */
import { validateProfile } from '../engine/profile/load.ts';
import { parseInstrumentDbCsv, parseInstrumentDbJson } from '../engine/instrument/db.ts';
import { canonicalStringify } from '../engine/serialize/canonicalJson.ts';
import type { CompileIssue, CompileResult, TagValueMap, WorkspaceFiles } from './types.ts';

type Json = Record<string, unknown>;

function isRecord(v: unknown): v is Json {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Strip "//"-prefixed comment keys recursively (workspace files may carry them). */
export function stripComments(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripComments);
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => !k.startsWith('//'))
        .map(([k, v]) => [k, stripComments(v)])
    );
  }
  return value;
}

function entityId(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1).replace(/\.(json|csv)$/i, '');
}

interface Ctx {
  readonly issues: CompileIssue[];
  error(file: string, path: string, message: string): void;
  warn(file: string, path: string, message: string): void;
}

function makeCtx(): Ctx {
  const issues: CompileIssue[] = [];
  return {
    issues,
    error: (file, path, message) => issues.push({ severity: 'error', file, path, message }),
    warn: (file, path, message) => issues.push({ severity: 'warning', file, path, message }),
  };
}

function parseJsonFile(files: WorkspaceFiles, path: string, ctx: Ctx): Json | undefined {
  const text = files.get(path);
  if (text === undefined) return undefined;
  try {
    const parsed = stripComments(JSON.parse(text));
    if (!isRecord(parsed)) {
      ctx.error(path, '', 'file must contain a JSON object');
      return undefined;
    }
    delete parsed.$schema;
    return parsed;
  } catch (e) {
    ctx.error(path, '', `not valid JSON: ${String(e)}`);
    return undefined;
  }
}

/** tag→value sugar → fragment ops (set / setGenerated). */
export function opsFromTagValues(map: TagValueMap, file: string, path: string, ctx: Ctx): Json[] {
  const ops: Json[] = [];
  for (const [tag, value] of Object.entries(map)) {
    if (!/^\d+$/.test(tag)) {
      ctx.error(file, `${path}/${tag}`, `'${tag}' is not a FIX tag number`);
      continue;
    }
    if (typeof value === 'string') {
      ops.push({ op: 'set', tag: Number(tag), value });
    } else if (isRecord(value) && typeof value.generator === 'string') {
      ops.push({ op: 'setGenerated', tag: Number(tag), generator: value.generator });
    } else {
      ctx.error(file, `${path}/${tag}`, 'value must be a string or { "generator": "…" }');
    }
  }
  return ops;
}

/** parties/account sugar → fragment ops (docs guide §8 recipe). */
export function clientOps(client: Json, file: string, path: string, ctx: Ctx): Json[] {
  const ops: Json[] = [];
  if (Array.isArray(client.parties) && client.parties.length > 0) {
    const entries = client.parties.map((p, i) => {
      if (!isRecord(p) || typeof p.id !== 'string') {
        ctx.error(file, `${path}/parties/${i}`, 'party needs an "id"');
        return [];
      }
      return [
        { op: 'set', tag: 448, value: p.id },
        { op: 'set', tag: 447, value: typeof p.source === 'string' ? p.source : 'D' },
        { op: 'set', tag: 452, value: typeof p.role === 'string' ? p.role : '3' },
      ];
    });
    ops.push({ op: 'group', countTag: 453, mode: 'append', entries });
  }
  const account = client.account;
  if (isRecord(account)) {
    if (account.editable === false) {
      if (typeof account.default === 'string') {
        ops.push({ op: 'set', tag: 1, value: account.default });
      } else {
        ctx.error(file, `${path}/account`, 'non-editable account needs a "default" value');
      }
    } else {
      ops.push({
        op: 'slot',
        tag: 1,
        slot: {
          tag: 1,
          label: 'Account',
          type: 'string',
          ...(typeof account.default === 'string' ? { default: account.default } : {}),
        },
      });
    }
  }
  if (Array.isArray(client.ops)) ops.push(...(client.ops as Json[]));
  return ops;
}

/**
 * A flow file's fragment ops: fields → params → standardSlots → raw ops.
 * Exported so `explode` can synthesize and self-verify its sugar candidates
 * against the exact ops the compiler would produce.
 */
export function flowFragmentOps(
  raw: Json,
  path: string,
  ctx: Ctx,
  onParamTuple?: (tag: string, tuple: unknown[]) => void
): Json[] {
  const ops: Json[] = [];
  if (isRecord(raw.fields)) {
    ops.push(...opsFromTagValues(raw.fields as TagValueMap, path, '/fields', ctx));
  }
  if (isRecord(raw.params)) {
    for (const [tag, p] of Object.entries(raw.params)) {
      if (!isRecord(p) || typeof p.name !== 'string') {
        ctx.error(path, `/params/${tag}`, 'param needs at least a "name"');
        continue;
      }
      const type = typeof p.type === 'string' ? p.type : 'STRING';
      const tuple: unknown[] = [p.name, type];
      if (isRecord(p.enum)) tuple.push(p.enum);
      onParamTuple?.(tag, tuple);
      if (isRecord(p.slot) && p.value !== undefined) {
        ctx.error(path, `/params/${tag}`, 'param declares both "slot" and "value" — pick one');
      } else if (isRecord(p.slot)) {
        const slot: Json = { tag: Number(tag), ...(p.slot as Json) };
        if (isRecord(p.enum) && type !== 'BOOLEAN' && slot.type === undefined) {
          slot.type = 'enum';
          slot.enumSource ??= { kind: 'dictionary' };
        }
        slot.type ??= 'string';
        ops.push({ op: 'slot', tag: Number(tag), slot });
      } else if (typeof p.value === 'string') {
        ops.push({ op: 'set', tag: Number(tag), value: p.value });
      } else if (p.value !== undefined) {
        ctx.error(path, `/params/${tag}/value`, 'param "value" must be a string');
      } else {
        ctx.warn(
          path,
          `/params/${tag}`,
          `param ${tag} has neither "slot" nor "value" — tag declared but never emitted`
        );
      }
    }
  }
  if (isRecord(raw.standardSlots)) {
    for (const [tag, spec] of Object.entries(raw.standardSlots)) {
      if (!isRecord(spec)) {
        ctx.error(path, `/standardSlots/${tag}`, 'slot spec must be an object');
        continue;
      }
      ops.push({ op: 'slot', tag: Number(tag), slot: { tag: Number(tag), ...spec } });
    }
  }
  if (Array.isArray(raw.ops)) ops.push(...(raw.ops as Json[]));
  return ops;
}

/** A no-op issue collector for synthesis/self-verification runs. */
export function silentCtx(): Ctx {
  return makeCtx();
}

/** Option definitions shared across links must be identical (spec §4.2). */
interface SharedOption {
  readonly id: string;
  readonly config: Json;
  readonly configText: string;
  readonly firstFile: string;
  readonly links: string[];
}

function collectShared(
  pool: Map<string, SharedOption>,
  id: string,
  config: Json,
  linkId: string,
  file: string,
  kind: string,
  ctx: Ctx
): void {
  const configText = canonicalStringify(config);
  const existing = pool.get(id);
  if (!existing) {
    pool.set(id, { id, config, configText, firstFile: file, links: [linkId] });
    return;
  }
  if (existing.configText !== configText) {
    ctx.error(
      file,
      `/${kind}s/${id}`,
      `${kind} '${id}' differs from its definition in ${existing.firstFile}; shared ${kind} ids must be identical (or use distinct ids)`
    );
    return;
  }
  existing.links.push(linkId);
}

const LINK_KEYS = new Set([
  'label',
  'session',
  'client',
  'clients',
  'routes',
  'enforced',
  'finalFragment',
  'convention',
  'algos',
  'flows',
  'transportHints',
  'extends',
  'fragments',
  'dictionaryOverlay',
  'validationPolicy',
]);

const FLOW_KEYS = new Set([
  'label',
  'msgType',
  'modes',
  'availability',
  'fields',
  'params',
  'standardSlots',
  'ops',
]);

const MANIFEST_KEYS = new Set([
  'name',
  'version',
  'fixVersion',
  'generators',
  'newOrderTemplate',
  'templates',
  'dictionaryOverlay',
  'validationPolicy',
  'flowOrder',
  'extraDimensions',
  'goldens',
]);

function warnUnknownKeys(obj: Json, allowed: Set<string>, file: string, ctx: Ctx): void {
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) {
      ctx.warn(file, `/${key}`, `unknown key '${key}' (typo? see docs/PROFILE-WORKSPACE.md)`);
    }
  }
}

/** Resolve link-level extends: per-top-level-key delta (child key wins). */
function resolveLinkExtends(links: Map<string, { file: string; raw: Json }>, ctx: Ctx): void {
  for (const [id, link] of links) {
    const parentId = link.raw.extends;
    if (parentId === undefined || parentId === null) continue;
    if (typeof parentId !== 'string' || !links.has(parentId)) {
      ctx.warn(link.file, '/extends', `unknown link '${String(parentId)}'`);
      continue;
    }
    if (parentId === id) {
      ctx.warn(link.file, '/extends', 'link extends itself');
      continue;
    }
    const parent = links.get(parentId)!;
    if (parent.raw.extends) {
      ctx.warn(link.file, '/extends', `extends chain deeper than one level (via '${parentId}')`);
    }
    const merged: Json = { ...parent.raw, ...link.raw };
    delete merged.extends;
    link.raw = merged;
  }
}

/** RFC 7386-style merge patch; records every touched path for the report. */
function applyMergePatch(target: Json, patch: Json, prefix: string, touched: string[]): Json {
  const out: Json = { ...target };
  for (const [key, value] of Object.entries(patch)) {
    const path = `${prefix}/${key}`;
    if (value === null) {
      delete out[key];
      touched.push(path);
    } else if (isRecord(value) && isRecord(out[key])) {
      out[key] = applyMergePatch(out[key] as Json, value, path, touched);
    } else {
      out[key] = value;
      touched.push(path);
    }
  }
  return out;
}

export interface CompiledWorkspace extends CompileResult {
  /** Paths rewritten by overrides.profile.json (report fodder). */
  readonly overrideTouches: readonly string[];
  /** flowId → link ids it is enabled on (opt-in) or '*' (everywhere). */
  readonly flowLinks: ReadonlyMap<string, readonly string[] | '*'>;
  readonly linkIds: readonly string[];
  readonly clientLinks: ReadonlyMap<string, readonly string[]>;
  readonly routeLinks: ReadonlyMap<string, readonly string[]>;
  readonly goldensRequested: boolean;
}

export function compileWorkspace(files: WorkspaceFiles): CompiledWorkspace {
  const ctx = makeCtx();
  const empty = {
    issues: ctx.issues,
    overrideTouches: [],
    flowLinks: new Map<string, readonly string[] | '*'>(),
    linkIds: [],
    clientLinks: new Map<string, readonly string[]>(),
    routeLinks: new Map<string, readonly string[]>(),
    goldensRequested: false,
  };

  // ── Manifest ────────────────────────────────────────────────────────────
  const manifest = parseJsonFile(files, 'workspace.json', ctx);
  if (!manifest) {
    ctx.error('workspace.json', '', 'workspace.json is required');
    return empty;
  }
  warnUnknownKeys(manifest, MANIFEST_KEYS, 'workspace.json', ctx);

  const fragments: Json = {};
  const overlayFields: Json = {};
  const overlayDeclaredIn: Record<string, string> = {};

  // ── Raw fragments (rung 3) ──────────────────────────────────────────────
  for (const path of [...files.keys()].sort()) {
    if (!path.startsWith('fragments/') || !path.endsWith('.json')) continue;
    const raw = parseJsonFile(files, path, ctx);
    if (raw) fragments[entityId(path)] = raw;
  }

  // ── Manifest template sugar ─────────────────────────────────────────────
  const templates: Json = isRecord(manifest.templates) ? { ...manifest.templates } : {};
  if (isRecord(manifest.newOrderTemplate)) {
    fragments['template:D'] = {
      label: 'NewOrderSingle base',
      ops: opsFromTagValues(
        manifest.newOrderTemplate as TagValueMap,
        'workspace.json',
        '/newOrderTemplate',
        ctx
      ),
    };
    if (templates.D !== undefined) {
      ctx.error(
        'workspace.json',
        '/newOrderTemplate',
        'newOrderTemplate and templates.D are mutually exclusive'
      );
    }
    templates.D = 'template:D';
  }
  if (isRecord(manifest.dictionaryOverlay) && isRecord(manifest.dictionaryOverlay.fields)) {
    for (const [tag, def] of Object.entries(manifest.dictionaryOverlay.fields)) {
      overlayFields[tag] = def;
      overlayDeclaredIn[tag] = 'workspace.json';
    }
  }

  // ── Flows ───────────────────────────────────────────────────────────────
  interface FlowInfo {
    id: string;
    file: string;
    label: string;
    optIn: boolean;
    option: Json;
  }
  const flows = new Map<string, FlowInfo>();
  for (const path of [...files.keys()].sort()) {
    if (!path.startsWith('flows/') || !path.endsWith('.json')) continue;
    const id = entityId(path);
    const raw = parseJsonFile(files, path, ctx);
    if (!raw) continue;
    warnUnknownKeys(raw, FLOW_KEYS, path, ctx);
    const label = typeof raw.label === 'string' ? raw.label : id;
    const optIn = raw.availability === 'opt-in';
    if (
      raw.availability !== undefined &&
      raw.availability !== 'opt-in' &&
      raw.availability !== 'everywhere'
    ) {
      ctx.error(
        path,
        '/availability',
        `availability must be "everywhere" or "opt-in", not ${JSON.stringify(raw.availability)}`
      );
    }

    const ops = flowFragmentOps(raw, path, ctx, (tag, tuple) => {
      const prior = overlayDeclaredIn[tag];
      if (prior && canonicalStringify(overlayFields[tag]) !== canonicalStringify(tuple)) {
        ctx.error(path, `/params/${tag}`, `tag ${tag} already declared differently in ${prior}`);
      } else {
        overlayFields[tag] = tuple;
        overlayDeclaredIn[tag] = path;
      }
    });

    const fragmentId = `flow:${id}`;
    if (fragments[fragmentId])
      ctx.error(path, '', `fragment id '${fragmentId}' collides with fragments/${fragmentId}.json`);
    fragments[fragmentId] = { label, ops };

    const option: Json = {
      id,
      label,
      fragment: fragmentId,
      msgType: typeof raw.msgType === 'string' ? raw.msgType : 'D',
      ...(Array.isArray(raw.modes) ? { modes: raw.modes } : {}),
      ...(optIn ? { availableOn: [`cap:${id}`] } : {}),
    };
    flows.set(id, { id, file: path, label, optIn, option });
  }

  // ── Links ───────────────────────────────────────────────────────────────
  const linkFiles = new Map<string, { file: string; raw: Json }>();
  for (const path of [...files.keys()].sort()) {
    if (!path.startsWith('links/') || !path.endsWith('.json')) continue;
    const raw = parseJsonFile(files, path, ctx);
    if (raw) linkFiles.set(entityId(path), { file: path, raw });
  }
  resolveLinkExtends(linkFiles, ctx);

  const systems: Json[] = [];
  const clientPool = new Map<string, SharedOption>();
  const routePool = new Map<string, SharedOption>();

  for (const [linkId, { file, raw }] of linkFiles) {
    warnUnknownKeys(raw, LINK_KEYS, file, ctx);
    const systemFragments: string[] = [];

    if (isRecord(raw.session)) {
      const fid = `link:${linkId}:session`;
      fragments[fid] = {
        label: `Session: ${typeof raw.label === 'string' ? raw.label : linkId}`,
        ops: opsFromTagValues(raw.session as TagValueMap, file, '/session', ctx),
      };
      systemFragments.push(fid);
    }
    if (isRecord(raw.client) && isRecord(raw.clients)) {
      ctx.error(file, '/client', '"client" (singular) and "clients" are mutually exclusive');
    }
    if (isRecord(raw.client)) {
      const fid = `link:${linkId}:client`;
      fragments[fid] = {
        label: `Client (${linkId})`,
        ops: clientOps(raw.client, file, '/client', ctx),
      };
      systemFragments.push(fid);
    }
    if (isRecord(raw.clients)) {
      for (const [cid, config] of Object.entries(raw.clients)) {
        if (!isRecord(config)) {
          ctx.error(file, `/clients/${cid}`, 'client must be an object');
          continue;
        }
        collectShared(clientPool, cid, config, linkId, file, 'client', ctx);
      }
    }
    if (isRecord(raw.routes)) {
      for (const [rid, config] of Object.entries(raw.routes)) {
        if (!isRecord(config)) {
          ctx.error(file, `/routes/${rid}`, 'route must be an object');
          continue;
        }
        collectShared(routePool, rid, config, linkId, file, 'route', ctx);
      }
    }
    for (const ref of Array.isArray(raw.fragments) ? (raw.fragments as unknown[]) : []) {
      if (typeof ref === 'string') systemFragments.push(ref);
    }

    let finalFragment: string | undefined;
    if (isRecord(raw.enforced) && typeof raw.finalFragment === 'string') {
      ctx.error(file, '/enforced', '"enforced" and "finalFragment" are mutually exclusive');
    }
    if (isRecord(raw.enforced)) {
      finalFragment = `link:${linkId}:final`;
      fragments[finalFragment] = {
        label: `Enforced (${typeof raw.label === 'string' ? raw.label : linkId})`,
        ops: opsFromTagValues(raw.enforced as TagValueMap, file, '/enforced', ctx),
      };
    } else if (typeof raw.finalFragment === 'string') {
      finalFragment = raw.finalFragment;
    }

    const algos = Array.isArray(raw.algos)
      ? (raw.algos as unknown[]).filter((a): a is string => typeof a === 'string')
      : [];
    for (const algo of algos) {
      const flow = flows.get(algo);
      if (!flow) ctx.error(file, '/algos', `unknown flow '${algo}' (no flows/${algo}.json)`);
      else if (!flow.optIn)
        ctx.warn(
          file,
          '/algos',
          `flow '${algo}' is available everywhere; listing it in algos is redundant`
        );
    }

    systems.push({
      id: linkId,
      label: typeof raw.label === 'string' ? raw.label : linkId,
      ...(systemFragments.length > 0 ? { fragments: systemFragments } : {}),
      ...(finalFragment ? { finalFragment } : {}),
      ...(algos.length > 0 ? { capabilities: algos } : {}),
      ...(typeof raw.convention === 'string' ? { convention: raw.convention } : {}),
      ...(isRecord(raw.dictionaryOverlay) ? { dictionaryOverlay: raw.dictionaryOverlay } : {}),
      ...(isRecord(raw.validationPolicy) ? { validationPolicy: raw.validationPolicy } : {}),
      ...(raw.transportHints !== undefined ? { transportHints: raw.transportHints } : {}),
    });
  }
  if (systems.length === 0)
    ctx.error('', '', 'no links/ defined — a workspace needs at least one link');

  // ── Client / Route dimensions from the shared pools ─────────────────────
  const dimensions: Json[] = [];

  const flowOrder = Array.isArray(manifest.flowOrder)
    ? (manifest.flowOrder as unknown[]).filter((f): f is string => typeof f === 'string')
    : [];
  for (const f of flowOrder) {
    if (!flows.has(f)) ctx.warn('workspace.json', '/flowOrder', `unknown flow '${f}'`);
  }
  const orderedFlows = [
    ...flowOrder.filter((f) => flows.has(f)),
    ...[...flows.keys()].filter((f) => !flowOrder.includes(f)).sort(),
  ];
  if (orderedFlows.length > 0) {
    dimensions.push({
      id: 'flow',
      label: 'Flow',
      kind: 'options',
      required: true,
      options: orderedFlows.map((f) => flows.get(f)!.option),
    });
  }

  const buildOptionDimension = (
    pool: Map<string, SharedOption>,
    dimId: string,
    dimLabel: string,
    optionFor: (shared: SharedOption) => Json
  ): void => {
    if (pool.size === 0) return;
    const allLinks = new Set(linkFiles.keys());
    const options = [...pool.values()]
      .sort((a, b) => (a.id < b.id ? -1 : 1))
      .map((shared) => {
        const everywhere = shared.links.length === allLinks.size;
        return {
          ...optionFor(shared),
          ...(everywhere ? {} : { availableOn: [...shared.links].sort() }),
          ...(shared.config.default === true ? { default: true } : {}),
        };
      });
    dimensions.push({ id: dimId, label: dimLabel, kind: 'options', options });
  };

  buildOptionDimension(clientPool, 'client', 'Client', (shared) => {
    const fid = `client:${shared.id}`;
    fragments[fid] = {
      label: `Client: ${typeof shared.config.label === 'string' ? shared.config.label : shared.id}`,
      ops: clientOps(shared.config, shared.firstFile, `/clients/${shared.id}`, ctx),
    };
    return {
      id: shared.id,
      label: typeof shared.config.label === 'string' ? shared.config.label : shared.id,
      fragment: fid,
      ...(typeof shared.config.convention === 'string'
        ? { convention: shared.config.convention }
        : {}),
    };
  });

  buildOptionDimension(routePool, 'route', 'Route', (shared) => {
    const fid = `route:${shared.id}`;
    const ops = isRecord(shared.config.fields)
      ? opsFromTagValues(
          shared.config.fields as TagValueMap,
          shared.firstFile,
          `/routes/${shared.id}/fields`,
          ctx
        )
      : [];
    if (Array.isArray(shared.config.ops)) ops.push(...(shared.config.ops as Json[]));
    fragments[fid] = {
      label: `Route: ${typeof shared.config.label === 'string' ? shared.config.label : shared.id}`,
      ops,
    };
    return {
      id: shared.id,
      label: typeof shared.config.label === 'string' ? shared.config.label : shared.id,
      fragment: fid,
      ...(typeof shared.config.convention === 'string'
        ? { convention: shared.config.convention }
        : {}),
    };
  });

  if (Array.isArray(manifest.extraDimensions)) {
    dimensions.push(...(manifest.extraDimensions as Json[]));
  }
  dimensions.push({ id: 'instrument', label: 'Instrument', kind: 'instrument' });

  // Per-dimension default sanity (the loader warns too, but here we can name files).
  for (const dim of dimensions) {
    const defs = ((dim.options as Json[] | undefined) ?? []).filter((o) => o.default === true);
    if (defs.length > 1) {
      ctx.error(
        '',
        `/${String(dim.id)}`,
        `dimension '${String(dim.id)}' has ${defs.length} options marked default`
      );
    }
  }

  // ── Dead opt-in flows ───────────────────────────────────────────────────
  const flowLinks = new Map<string, readonly string[] | '*'>();
  for (const flow of flows.values()) {
    if (!flow.optIn) {
      flowLinks.set(flow.id, '*');
      continue;
    }
    const enabled = systems
      .filter(
        (s) => Array.isArray(s.capabilities) && (s.capabilities as string[]).includes(flow.id)
      )
      .map((s) => s.id as string);
    flowLinks.set(flow.id, enabled);
    if (enabled.length === 0) {
      ctx.error(
        flow.file,
        '/availability',
        `opt-in flow '${flow.id}' is enabled on no link — add it to some link's "algos" or set availability to "everywhere"`
      );
    }
  }

  // ── Conventions & mappings (verbatim) ───────────────────────────────────
  const conventions: Json = {};
  const mappings: Json = {};
  for (const path of [...files.keys()].sort()) {
    if (path.startsWith('conventions/') && path.endsWith('.json')) {
      const raw = parseJsonFile(files, path, ctx);
      if (raw) conventions[entityId(path)] = raw;
    }
    if (path.startsWith('mappings/') && path.endsWith('.json')) {
      const raw = parseJsonFile(files, path, ctx);
      if (raw) mappings[entityId(path)] = raw;
    }
  }

  // ── Instruments ─────────────────────────────────────────────────────────
  const instruments: Json[] = [];
  const strategies: Json[] = [];
  const instrumentSource: Record<string, string> = {};
  for (const path of [...files.keys()].sort()) {
    if (!path.startsWith('instruments/')) continue;
    if (path.endsWith('.csv')) {
      const { db, issues } = parseInstrumentDbCsv(files.get(path)!);
      for (const issue of issues) {
        ctx.issues.push({
          severity: issue.severity === 'error' ? 'error' : 'warning',
          file: path,
          path: issue.path,
          message: issue.message,
        });
      }
      for (const record of db ? [...db.instruments.values()] : []) {
        instruments.push({ ...record });
        instrumentSource[record.key] ??= path;
      }
      continue;
    }
    if (!path.endsWith('.json')) continue;
    const raw = parseJsonFile(files, path, ctx);
    if (!raw) continue;
    const defaults = isRecord(raw.defaults) ? raw.defaults : {};
    const defaultAttrs = isRecord(defaults.attrs) ? defaults.attrs : {};
    const defaultSchemes = isRecord(defaults.schemes) ? defaults.schemes : {};
    const applyDefaults = (record: Json): Json => ({
      ...record,
      ...(Object.keys(defaultSchemes).length > 0 || isRecord(record.schemes)
        ? { schemes: { ...defaultSchemes, ...(isRecord(record.schemes) ? record.schemes : {}) } }
        : {}),
      ...(Object.keys(defaultAttrs).length > 0 || isRecord(record.attrs)
        ? { attrs: { ...defaultAttrs, ...(isRecord(record.attrs) ? record.attrs : {}) } }
        : {}),
    });
    for (const record of Array.isArray(raw.instruments) ? (raw.instruments as Json[]) : []) {
      instruments.push(applyDefaults(record));
      if (typeof record.key === 'string') {
        if (instrumentSource[record.key]) {
          ctx.error(
            path,
            `/instruments`,
            `duplicate instrument key '${record.key}' (also in ${instrumentSource[record.key]})`
          );
        }
        instrumentSource[record.key] ??= path;
      }
    }
    for (const record of Array.isArray(raw.strategies) ? (raw.strategies as Json[]) : []) {
      strategies.push(applyDefaults(record));
    }
  }

  // ── Assemble, patch, validate ───────────────────────────────────────────
  let profile: Json = {
    schemaVersion: 1,
    name: typeof manifest.name === 'string' ? manifest.name : 'Unnamed workspace',
    version: typeof manifest.version === 'string' ? manifest.version : '0.0.0',
    fixVersion: typeof manifest.fixVersion === 'string' ? manifest.fixVersion : 'FIX.4.4',
    ...(Object.keys(overlayFields).length > 0
      ? {
          dictionaryOverlay: {
            ...(isRecord(manifest.dictionaryOverlay) ? manifest.dictionaryOverlay : {}),
            fields: overlayFields,
          },
        }
      : {}),
    ...(isRecord(manifest.generators) ? { generators: manifest.generators } : {}),
    ...(Object.keys(conventions).length > 0 ? { conventions } : {}),
    fragments,
    ...(Object.keys(templates).length > 0 ? { templates } : {}),
    systems,
    dimensions,
    ...(Object.keys(mappings).length > 0 ? { renderers: { json: mappings } } : {}),
    ...(isRecord(manifest.validationPolicy) ? { validationPolicy: manifest.validationPolicy } : {}),
  };

  const overrideTouches: string[] = [];
  const overrides = parseJsonFile(files, 'overrides.profile.json', ctx);
  if (overrides) {
    profile = applyMergePatch(profile, overrides, '', overrideTouches);
    for (const touch of overrideTouches) {
      ctx.warn(
        'overrides.profile.json',
        touch,
        `override rewrote ${touch} — consider moving this into an entity file`
      );
    }
  }

  // The real engine loader is the semantics; its issues are our issues.
  const loaded = validateProfile(profile);
  for (const issue of loaded.issues) {
    ctx.issues.push({
      severity: issue.severity,
      file: '(assembled profile)',
      path: issue.path,
      message: issue.message,
    });
  }

  const instrumentsJson =
    instruments.length + strategies.length > 0
      ? {
          schemaVersion: 1,
          instruments,
          ...(strategies.length > 0 ? { strategies } : {}),
        }
      : undefined;
  if (instrumentsJson) {
    const { issues } = parseInstrumentDbJson(JSON.stringify(instrumentsJson));
    for (const issue of issues) {
      ctx.issues.push({
        severity: issue.severity === 'error' ? 'error' : 'warning',
        file: '(assembled instruments)',
        path: issue.path,
        message: issue.message,
      });
    }
  }

  const hasErrors = ctx.issues.some((i) => i.severity === 'error');
  return {
    ...(hasErrors ? {} : { profile, profileText: canonicalStringify(profile) }),
    ...(!hasErrors && instrumentsJson
      ? { instrumentsText: canonicalStringify(instrumentsJson) }
      : {}),
    issues: ctx.issues,
    overrideTouches,
    flowLinks,
    linkIds: [...linkFiles.keys()],
    clientLinks: new Map([...clientPool.values()].map((s) => [s.id, [...s.links]])),
    routeLinks: new Map([...routePool.values()].map((s) => [s.id, [...s.links]])),
    goldensRequested: manifest.goldens === true,
  };
}
