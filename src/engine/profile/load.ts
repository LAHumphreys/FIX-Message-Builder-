/**
 * Profile parsing and structural validation with path-precise reporting.
 *
 * Fatal shape problems (not an object, missing systems array...) produce
 * errors and no profile. Referential problems (unknown fragment refs,
 * bad extends...) produce a usable profile plus warnings — consistent with
 * "the tool never refuses" wherever a best-effort interpretation exists.
 */
import type { Fragment, FragmentOp } from '../fragment/types.ts';
import { FIX_VERSIONS, type FixVersionId } from '../dictionary/types.ts';
import type { DimensionDef, Profile, SystemDef } from './types.ts';

export const PROFILE_SCHEMA_VERSION = 1;

export interface ProfileIssue {
  readonly severity: 'error' | 'warning';
  readonly path: string;
  readonly message: string;
}

export interface ProfileLoadResult {
  readonly profile?: Profile;
  readonly issues: readonly ProfileIssue[];
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function parseProfile(text: string): ProfileLoadResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return {
      issues: [{ severity: 'error', path: '', message: `not valid JSON: ${String(e)}` }],
    };
  }
  return validateProfile(raw);
}

export function validateProfile(raw: unknown): ProfileLoadResult {
  const issues: ProfileIssue[] = [];
  const error = (path: string, message: string) =>
    issues.push({ severity: 'error', path, message });
  const warn = (path: string, message: string) =>
    issues.push({ severity: 'warning', path, message });

  if (!isRecord(raw)) {
    return { issues: [{ severity: 'error', path: '', message: 'profile must be a JSON object' }] };
  }

  if (typeof raw.schemaVersion !== 'number') {
    error('/schemaVersion', 'missing or non-numeric schemaVersion');
  } else if (raw.schemaVersion > PROFILE_SCHEMA_VERSION) {
    warn(
      '/schemaVersion',
      `profile schemaVersion ${raw.schemaVersion} is newer than supported ${PROFILE_SCHEMA_VERSION}; loading best-effort`
    );
  }
  if (typeof raw.name !== 'string' || raw.name === '') error('/name', 'missing profile name');
  if (typeof raw.version !== 'string') error('/version', 'missing profile version');

  let fixVersion: FixVersionId = 'FIX.4.4';
  if (
    typeof raw.fixVersion !== 'string' ||
    !FIX_VERSIONS.includes(raw.fixVersion as FixVersionId)
  ) {
    warn(
      '/fixVersion',
      `unknown fixVersion ${JSON.stringify(raw.fixVersion)}; defaulting to FIX.4.4`
    );
  } else {
    fixVersion = raw.fixVersion as FixVersionId;
  }

  // Fragments
  const fragments: Record<string, Fragment> = {};
  if (raw.fragments !== undefined && !isRecord(raw.fragments)) {
    error('/fragments', 'fragments must be an object');
  } else if (isRecord(raw.fragments)) {
    for (const [id, f] of Object.entries(raw.fragments)) {
      const path = `/fragments/${id}`;
      if (!isRecord(f) || !Array.isArray(f.ops)) {
        error(path, 'fragment must be an object with an ops array');
        continue;
      }
      const ops = validateOps(f.ops, path + '/ops', error);
      fragments[id] = {
        id,
        label: typeof f.label === 'string' ? f.label : id,
        ops,
        ...(isRecord(f.meta) ? { meta: f.meta as NonNullable<Fragment['meta']> } : {}),
      };
    }
  }

  // Systems
  const systems: SystemDef[] = [];
  if (!Array.isArray(raw.systems) || raw.systems.length === 0) {
    error('/systems', 'profile must declare at least one system');
  } else {
    const ids = new Set<string>();
    raw.systems.forEach((s, i) => {
      const path = `/systems/${i}`;
      if (!isRecord(s) || typeof s.id !== 'string') {
        error(path, 'system must be an object with an id');
        return;
      }
      if (ids.has(s.id)) error(path + '/id', `duplicate system id '${s.id}'`);
      ids.add(s.id);
      systems.push({
        id: s.id,
        label: typeof s.label === 'string' ? s.label : s.id,
        ...(typeof s.extends === 'string' ? { extends: s.extends } : {}),
        ...(Array.isArray(s.fragments) ? { fragments: s.fragments as string[] } : {}),
        ...(typeof s.finalFragment === 'string' ? { finalFragment: s.finalFragment } : {}),
        ...(isRecord(s.dictionaryOverlay)
          ? {
              dictionaryOverlay: s.dictionaryOverlay as NonNullable<SystemDef['dictionaryOverlay']>,
            }
          : {}),
        ...(Array.isArray(s.capabilities) ? { capabilities: s.capabilities as string[] } : {}),
        ...(typeof s.convention === 'string' ? { convention: s.convention } : {}),
        ...(isRecord(s.validationPolicy)
          ? { validationPolicy: s.validationPolicy as NonNullable<SystemDef['validationPolicy']> }
          : {}),
        ...(s.transportHints !== undefined ? { transportHints: s.transportHints } : {}),
      });
    });
    // Referential checks
    systems.forEach((s, i) => {
      const path = `/systems/${i}`;
      if (s.extends) {
        const parent = systems.find((p) => p.id === s.extends);
        if (!parent) warn(path + '/extends', `unknown system '${s.extends}'`);
        else if (parent.extends)
          warn(path + '/extends', `extends chain deeper than one level (via '${parent.id}')`);
        if (s.extends === s.id) warn(path + '/extends', 'system extends itself');
      }
      for (const ref of s.fragments ?? []) {
        if (!fragments[ref]) warn(path + '/fragments', `unknown fragment '${ref}'`);
      }
      if (s.finalFragment && !fragments[s.finalFragment]) {
        warn(path + '/finalFragment', `unknown fragment '${s.finalFragment}'`);
      }
    });
  }

  // Dimensions
  const dimensions: DimensionDef[] = [];
  if (raw.dimensions !== undefined && !Array.isArray(raw.dimensions)) {
    error('/dimensions', 'dimensions must be an array');
  } else if (Array.isArray(raw.dimensions)) {
    raw.dimensions.forEach((d, i) => {
      const path = `/dimensions/${i}`;
      if (!isRecord(d) || typeof d.id !== 'string') {
        error(path, 'dimension must be an object with an id');
        return;
      }
      const kind = d.kind === 'instrument' ? 'instrument' : 'options';
      const options = Array.isArray(d.options) ? (d.options as DimensionDef['options']) : undefined;
      if (kind === 'options' && (!options || options.length === 0)) {
        warn(path, `dimension '${d.id}' has no options`);
      }
      options?.forEach((o, j) => {
        if (o.fragment && !fragments[o.fragment]) {
          warn(`${path}/options/${j}/fragment`, `unknown fragment '${o.fragment}'`);
        }
      });
      dimensions.push({
        id: d.id,
        label: typeof d.label === 'string' ? d.label : d.id,
        kind,
        ...(typeof d.required === 'boolean' ? { required: d.required } : {}),
        ...(options ? { options } : {}),
      });
    });
  }

  // Templates
  if (isRecord(raw.templates)) {
    for (const [msgType, ref] of Object.entries(raw.templates)) {
      if (typeof ref !== 'string' || !fragments[ref]) {
        warn(`/templates/${msgType}`, `unknown fragment '${String(ref)}'`);
      }
    }
  }

  if (issues.some((i) => i.severity === 'error')) {
    return { issues };
  }

  const profile: Profile = {
    schemaVersion: raw.schemaVersion as number,
    name: raw.name as string,
    version: raw.version as string,
    fixVersion,
    systems,
    dimensions,
    fragments,
    ...(isRecord(raw.dictionaryOverlay)
      ? { dictionaryOverlay: raw.dictionaryOverlay as NonNullable<Profile['dictionaryOverlay']> }
      : {}),
    ...(isRecord(raw.generators)
      ? { generators: raw.generators as NonNullable<Profile['generators']> }
      : {}),
    ...(isRecord(raw.conventions)
      ? { conventions: raw.conventions as NonNullable<Profile['conventions']> }
      : {}),
    ...(isRecord(raw.templates)
      ? { templates: raw.templates as NonNullable<Profile['templates']> }
      : {}),
    ...(isRecord(raw.renderers)
      ? { renderers: raw.renderers as NonNullable<Profile['renderers']> }
      : {}),
    ...(isRecord(raw.validationPolicy)
      ? { validationPolicy: raw.validationPolicy as NonNullable<Profile['validationPolicy']> }
      : {}),
  };
  return { profile, issues };
}

const OP_KINDS = new Set(['set', 'setGenerated', 'slot', 'remove', 'group']);

function validateOps(
  raw: unknown[],
  path: string,
  error: (path: string, message: string) => void
): FragmentOp[] {
  const ops: FragmentOp[] = [];
  raw.forEach((op, i) => {
    const opPath = `${path}/${i}`;
    if (!isRecord(op) || typeof op.op !== 'string' || !OP_KINDS.has(op.op)) {
      error(opPath, `invalid op ${JSON.stringify(isRecord(op) ? op.op : op)}`);
      return;
    }
    if (op.op === 'group') {
      if (typeof op.countTag !== 'number' || !Array.isArray(op.entries)) {
        error(opPath, 'group op needs countTag and entries');
        return;
      }
      const entries = (op.entries as unknown[][]).map((entry, j) =>
        Array.isArray(entry) ? validateOps(entry, `${opPath}/entries/${j}`, error) : []
      );
      ops.push({
        op: 'group',
        countTag: op.countTag,
        mode: op.mode === 'replace' ? 'replace' : 'append',
        entries,
      });
      return;
    }
    if (typeof op.tag !== 'number') {
      error(opPath, `${op.op} op needs a numeric tag`);
      return;
    }
    if (op.op === 'set') {
      if (typeof op.value !== 'string') {
        error(opPath, 'set op needs a string value');
        return;
      }
      ops.push({ op: 'set', tag: op.tag, value: op.value });
    } else if (op.op === 'setGenerated') {
      if (typeof op.generator !== 'string') {
        error(opPath, 'setGenerated op needs a generator reference');
        return;
      }
      ops.push({ op: 'setGenerated', tag: op.tag, generator: op.generator });
    } else if (op.op === 'remove') {
      ops.push({ op: 'remove', tag: op.tag });
    } else {
      if (!isRecord(op.slot)) {
        error(opPath, 'slot op needs a slot spec');
        return;
      }
      ops.push({ op: 'slot', tag: op.tag, slot: op.slot as never });
    }
  });
  return ops;
}
