/**
 * `explode` — decompile an existing profile (+ instruments) into a
 * workspace (docs/PROFILE-WORKSPACE.md §7). Recognizes the patterns the
 * sugar covers; anything else is emitted as raw fragments / in-file ops /
 * manifest extraDimensions. Never lossy, never guessing: the acceptance
 * bar is that compiling the result produces the same golden messages.
 */
import { parseProfile } from '../engine/profile/load.ts';
import { parseInstrumentDb } from '../engine/instrument/db.ts';
import { canonicalStringify } from '../engine/serialize/canonicalJson.ts';
import { clientOps, flowFragmentOps, opsFromTagValues, silentCtx } from './compile.ts';
import {
  resolveSystemDef,
  isAvailable,
  type DimensionDef,
  type DimensionOption,
} from '../engine/profile/types.ts';
import type { Fragment, FragmentOp } from '../engine/fragment/types.ts';
import type { CompileIssue } from './types.ts';

type Json = Record<string, unknown>;

export interface ExplodeResult {
  readonly files: Map<string, string>;
  readonly notes: readonly CompileIssue[];
}

function sameOps(a: unknown, b: unknown): boolean {
  return canonicalStringify(a) === canonicalStringify(b);
}

/**
 * tag→value sugar from ops, or undefined if not expressible. Self-verified:
 * the sugar is only returned when the compiler would synthesize exactly the
 * original op sequence from it (JSON objects iterate integer-like keys in
 * ascending order, so non-ascending tag order cannot round-trip).
 */
function tagValuesFrom(ops: readonly FragmentOp[]): Json | undefined {
  const map: Json = {};
  for (const op of ops) {
    if (op.op === 'set') {
      if (map[String(op.tag)] !== undefined) return undefined;
      map[String(op.tag)] = op.value;
    } else if (op.op === 'setGenerated') {
      if (map[String(op.tag)] !== undefined) return undefined;
      map[String(op.tag)] = { generator: op.generator };
    } else {
      return undefined;
    }
  }
  const synthesized = opsFromTagValues(map as never, '', '', silentCtx());
  return sameOps(synthesized, ops) ? map : undefined;
}

/** parties/account sugar from ops, or undefined. */
function clientConfigFrom(ops: readonly FragmentOp[]): Json | undefined {
  const config: Json = {};
  const leftovers: FragmentOp[] = [];
  for (const op of ops) {
    if (op.op === 'group' && op.countTag === 453 && !config.parties) {
      const parties: Json[] = [];
      for (const entry of op.entries) {
        const bytag: Record<number, string> = {};
        for (const entryOp of entry) {
          if (entryOp.op !== 'set') return undefined;
          bytag[entryOp.tag] = entryOp.value;
        }
        if (!bytag[448]) return undefined;
        parties.push({
          id: bytag[448],
          ...(bytag[447] && bytag[447] !== 'D' ? { source: bytag[447] } : {}),
          ...(bytag[452] && bytag[452] !== '3' ? { role: bytag[452] } : {}),
        });
      }
      config.parties = parties;
    } else if (op.op === 'slot' && op.tag === 1) {
      config.account = {
        ...(op.slot.default !== undefined ? { default: op.slot.default } : {}),
      };
    } else if (op.op === 'set' && op.tag === 1) {
      config.account = { default: op.value, editable: false };
    } else {
      leftovers.push(op);
    }
  }
  if (!config.parties && !config.account) return undefined;
  if (leftovers.length > 0) config.ops = leftovers as unknown as Json[];
  const synthesized = clientOps(config, '', '', silentCtx());
  return sameOps(synthesized, ops) ? config : undefined;
}

const CLIENTISH_DIMS = new Set(['client', 'clients']);
const ROUTISH_DIMS = new Set(['route', 'routes', 'routing']);

export function explodeProfile(
  profileTextIn: string,
  instrumentsTextIn: string | undefined
): ExplodeResult {
  const files = new Map<string, string>();
  const notes: CompileIssue[] = [];
  const note = (message: string) =>
    notes.push({ severity: 'warning', file: '', path: '', message });
  const emit = (path: string, value: unknown) => {
    const depth = path.split('/').length - 1;
    const schemaFor = path.startsWith('links/')
      ? 'link'
      : path.startsWith('flows/')
        ? 'flow'
        : path === 'workspace.json'
          ? 'workspace'
          : undefined;
    const stamped =
      schemaFor && typeof value === 'object' && value !== null && !Array.isArray(value)
        ? { $schema: `${'../'.repeat(depth)}schemas/${schemaFor}.schema.json`, ...value }
        : value;
    files.set(path, canonicalStringify(stamped));
  };

  const { profile, issues } = parseProfile(profileTextIn);
  if (!profile) {
    return {
      files,
      notes: issues.map((i) => ({
        severity: i.severity,
        file: '',
        path: i.path,
        message: i.message,
      })),
    };
  }

  const consumedFragments = new Set<string>();
  const consumedOverlayTags = new Set<string>();
  const rawOverlayFields = (profile.dictionaryOverlay?.fields ?? {}) as Json;

  // ── Manifest ────────────────────────────────────────────────────────────
  const manifest: Json = {
    name: profile.name,
    version: profile.version,
    fixVersion: profile.fixVersion,
    ...(profile.generators ? { generators: profile.generators } : {}),
    ...(profile.validationPolicy ? { validationPolicy: profile.validationPolicy } : {}),
  };
  const templates: Json = { ...(profile.templates ?? {}) };
  const templateD = typeof templates.D === 'string' ? profile.fragments[templates.D] : undefined;
  if (templateD) {
    const sugar = tagValuesFrom(templateD.ops);
    if (sugar) {
      manifest.newOrderTemplate = sugar;
      consumedFragments.add(templates.D as string);
      delete templates.D;
    }
  }
  // Raw template refs stay in the manifest; their fragments are emitted to
  // fragments/ below (deliberately NOT marked consumed).
  if (Object.keys(templates).length > 0) manifest.templates = templates;

  // ── Dimensions: find flow / client-ish / route-ish ──────────────────────
  const flowDim = profile.dimensions.find(
    (d) => d.id === 'flow' || (d.kind === 'options' && d.options?.some((o) => o.msgType))
  );
  const clientDim = profile.dimensions.find((d) => d !== flowDim && CLIENTISH_DIMS.has(d.id));
  const routeDim = profile.dimensions.find((d) => d !== flowDim && ROUTISH_DIMS.has(d.id));
  const extraDims = profile.dimensions.filter(
    (d) => d !== flowDim && d !== clientDim && d !== routeDim && d.kind !== 'instrument'
  );
  if (extraDims.length > 0) {
    manifest.extraDimensions = extraDims;
    note(
      `dimension(s) ${extraDims.map((d) => `'${d.id}'`).join(', ')} kept verbatim in workspace.json extraDimensions`
    );
    for (const d of extraDims)
      for (const o of d.options ?? []) if (o.fragment) consumedFragments.add(o.fragment);
  }

  // ── Flows ───────────────────────────────────────────────────────────────
  if (flowDim) manifest.flowOrder = (flowDim.options ?? []).map((o) => o.id);
  for (const option of flowDim?.options ?? []) {
    const flow: Json = { label: option.label };
    if (option.msgType && option.msgType !== 'D') flow.msgType = option.msgType;
    if (option.modes) flow.modes = option.modes;
    if (option.availableOn && option.availableOn.length > 0) flow.availability = 'opt-in';
    const fragment = option.fragment ? profile.fragments[option.fragment] : undefined;
    if (fragment) {
      consumedFragments.add(option.fragment!);
      const fields: Json = {};
      const params: Json = {};
      const standardSlots: Json = {};
      const rawOps: FragmentOp[] = [];
      for (const op of fragment.ops) {
        const tag = 'tag' in op ? String(op.tag) : undefined;
        const overlayDef = tag ? rawOverlayFields[tag] : undefined;
        if (op.op === 'set' && overlayDef && Array.isArray(overlayDef)) {
          params[tag!] = paramFrom(overlayDef, { value: op.value });
          consumedOverlayTags.add(tag!);
        } else if (op.op === 'set' && fields[tag!] === undefined) {
          fields[tag!] = op.value;
        } else if (op.op === 'setGenerated' && fields[tag!] === undefined) {
          fields[tag!] = { generator: op.generator };
        } else if (op.op === 'slot' && overlayDef && Array.isArray(overlayDef)) {
          const slot = { ...(op.slot as unknown as Json) };
          delete slot.tag;
          params[tag!] = paramFrom(overlayDef, { slot: stripSlotEnum(slot) });
          consumedOverlayTags.add(tag!);
        } else if (op.op === 'slot') {
          const slot = { ...(op.slot as unknown as Json) };
          delete slot.tag;
          standardSlots[tag!] = slot;
        } else {
          rawOps.push(op);
        }
      }
      if (Object.keys(fields).length > 0) flow.fields = fields;
      if (Object.keys(params).length > 0) flow.params = params;
      if (Object.keys(standardSlots).length > 0) flow.standardSlots = standardSlots;
      if (rawOps.length > 0) flow.ops = rawOps;
      // Self-verify: the compiler must synthesize exactly the original ops
      // from this decomposition; otherwise keep the ops verbatim (order or
      // structure the sugar cannot express).
      const synthesized = flowFragmentOps(flow, '', silentCtx());
      if (!sameOps(synthesized, fragment.ops)) {
        delete flow.fields;
        delete flow.params;
        delete flow.standardSlots;
        flow.ops = fragment.ops as unknown as Json[];
        for (const tag of Object.keys(params)) consumedOverlayTags.delete(tag);
      }
    }
    emit(`flows/${option.id}.json`, flow);
  }

  // ── Clients / routes ────────────────────────────────────────────────────
  const clientConfigs = new Map<string, Json>();
  const routeConfigs = new Map<string, Json>();
  const optionAvailability = new Map<string, DimensionOption>();
  const collectOptionDim = (
    dim: DimensionDef | undefined,
    configs: Map<string, Json>,
    asClient: boolean
  ) => {
    for (const option of dim?.options ?? []) {
      const fragment = option.fragment ? profile.fragments[option.fragment] : undefined;
      const config: Json = { label: option.label };
      if (option.default) config.default = true;
      if (option.convention) config.convention = option.convention;
      if (fragment) {
        consumedFragments.add(option.fragment!);
        const client = asClient ? clientConfigFrom(fragment.ops) : undefined;
        const fieldsSugar = !asClient ? tagValuesFrom(fragment.ops) : undefined;
        if (client) Object.assign(config, client);
        else if (fieldsSugar) config.fields = fieldsSugar;
        else config.ops = fragment.ops as unknown as Json[];
      }
      configs.set(option.id, config);
      optionAvailability.set(`${dim!.id}:${option.id}`, option);
    }
  };
  collectOptionDim(clientDim, clientConfigs, true);
  collectOptionDim(routeDim, routeConfigs, false);

  // ── Links ───────────────────────────────────────────────────────────────
  for (const system of profile.systems) {
    const resolved = resolveSystemDef(profile, system.id)!;
    const capabilities = new Set(resolved.capabilities ?? []);
    const link: Json = { label: resolved.label };

    const leftoverFragments: string[] = [];
    let sessionDone = false;
    let clientDone = false;
    for (const ref of resolved.fragments ?? []) {
      const fragment = profile.fragments[ref];
      if (!fragment) continue;
      const asSession = !sessionDone ? tagValuesFrom(fragment.ops) : undefined;
      const asClient = !clientDone ? clientConfigFrom(fragment.ops) : undefined;
      if (asSession && Object.keys(asSession).length > 0) {
        link.session = asSession;
        sessionDone = true;
        consumedFragments.add(ref);
      } else if (asClient) {
        link.client = asClient;
        clientDone = true;
        consumedFragments.add(ref);
      } else {
        leftoverFragments.push(ref);
      }
    }
    if (leftoverFragments.length > 0) link.fragments = leftoverFragments;

    if (resolved.finalFragment) {
      const finalFragment = profile.fragments[resolved.finalFragment];
      const sugar = finalFragment ? tagValuesFrom(finalFragment.ops) : undefined;
      if (sugar) {
        link.enforced = sugar;
        consumedFragments.add(resolved.finalFragment);
      } else {
        link.finalFragment = resolved.finalFragment;
      }
    }
    if (resolved.convention) link.convention = resolved.convention;
    if (resolved.transportHints !== undefined) link.transportHints = resolved.transportHints;
    if (resolved.dictionaryOverlay) link.dictionaryOverlay = resolved.dictionaryOverlay;
    if (resolved.validationPolicy) link.validationPolicy = resolved.validationPolicy;

    // Opt-in flows: enabled where the original availability allowed them.
    const algos = (flowDim?.options ?? [])
      .filter((o) => o.availableOn && o.availableOn.length > 0)
      .filter((o) => isAvailable(o.availableOn, system.id, capabilities))
      .map((o) => o.id);
    if (algos.length > 0) link.algos = algos;

    // Clients/routes available on this link.
    const linkOptions = (
      dim: DimensionDef | undefined,
      configs: Map<string, Json>
    ): Json | undefined => {
      if (!dim) return undefined;
      const here: Json = {};
      for (const [id, config] of configs) {
        const option = optionAvailability.get(`${dim.id}:${id}`)!;
        if (isAvailable(option.availableOn, system.id, capabilities)) here[id] = config;
      }
      return Object.keys(here).length > 0 ? here : undefined;
    };
    const clients = linkOptions(clientDim, clientConfigs);
    const routes = linkOptions(routeDim, routeConfigs);
    if (clients) {
      if (link.client) {
        // both a client-shaped system fragment and a Client dimension: keep both
        note(`link '${system.id}' has both an inline client fragment and Client options`);
      }
      link.clients = clients;
      delete link.client;
      if (link.client === undefined && clients && link.clients === clients) {
        // ok
      }
    }
    if (routes) link.routes = routes;
    emit(`links/${system.id}.json`, link);
  }

  // ── Conventions, mappings ───────────────────────────────────────────────
  for (const [name, convention] of Object.entries(profile.conventions ?? {})) {
    emit(`conventions/${name}.json`, convention);
  }
  for (const [name, mapping] of Object.entries(profile.renderers?.json ?? {})) {
    emit(`mappings/${name}.json`, mapping);
  }

  // ── Leftover overlay tags → manifest overlay ────────────────────────────
  const leftoverOverlay: Json = {};
  for (const [tag, def] of Object.entries(rawOverlayFields)) {
    if (!consumedOverlayTags.has(tag)) leftoverOverlay[tag] = def;
  }
  if (Object.keys(leftoverOverlay).length > 0) {
    manifest.dictionaryOverlay = { ...(profile.dictionaryOverlay ?? {}), fields: leftoverOverlay };
  } else if (profile.dictionaryOverlay?.components || profile.dictionaryOverlay?.messages) {
    const rest = { ...profile.dictionaryOverlay } as Json;
    delete rest.fields;
    manifest.dictionaryOverlay = rest;
  }

  // ── Unconsumed fragments → raw files ────────────────────────────────────
  for (const [id, fragment] of Object.entries(profile.fragments)) {
    if (consumedFragments.has(id)) continue;
    const rest = { ...(fragment as Fragment & Json) } as Json;
    delete rest.id;
    emit(`fragments/${id}.json`, rest);
  }

  emit('workspace.json', manifest);

  if (instrumentsTextIn) {
    const { db } = parseInstrumentDb(instrumentsTextIn);
    if (db) {
      emit('instruments/all.json', {
        instruments: [...db.instruments.values()],
        ...(db.strategies.size > 0 ? { strategies: [...db.strategies.values()] } : {}),
      });
    }
  }

  return { files, notes };
}

function paramFrom(overlayDef: unknown[], rest: Json): Json {
  return {
    name: overlayDef[0],
    type: overlayDef[1],
    ...(overlayDef[2] !== undefined ? { enum: overlayDef[2] } : {}),
    ...rest,
  };
}

/** Drop enum plumbing the compiler regenerates from the param's enum. */
function stripSlotEnum(slot: Json): Json {
  const out = { ...slot };
  if ((out.enumSource as Json | undefined)?.kind === 'dictionary' && out.type === 'enum') {
    delete out.enumSource;
    delete out.type;
  }
  return out;
}
