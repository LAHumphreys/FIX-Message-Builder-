/**
 * Profile model (brief §3.3) — a JSON document defining an environment:
 * dictionary overlay, target-system registry, selector dimensions, fragment
 * library, generators, renderer configs, validation policy.
 */
import type { Fragment } from '../fragment/types.ts';
import type { GeneratorDef } from '../generator/types.ts';
import type { FixVersionId } from '../dictionary/types.ts';
import type { JsonFieldDef, JsonLayoutItem } from '../dictionary/json.ts';
import type { JsonMappingConfig } from '../render/json/types.ts';
import type { IdentityConvention } from '../instrument/convention.ts';
import type { Severity } from '../validation/types.ts';

/** Overlay on a single field definition. */
export interface FieldOverlay {
  readonly name?: string;
  readonly type?: string;
  /** Enum values to merge in (or replace with, when enumMode = 'replace'). */
  readonly enums?: Readonly<Record<string, string>>;
  readonly enumMode?: 'merge' | 'replace';
}

export interface MessageOverlay {
  readonly name?: string;
  /** Full layout replacement (compact JSON item encoding). */
  readonly items?: readonly JsonLayoutItem[];
  /** Per-tag requiredness flips, applied recursively into groups. */
  readonly required?: Readonly<Record<string, boolean>>;
}

/**
 * Dictionary overlay (§3.2): the profile may extend and override the base
 * dictionary; a system overlay layers on top of the profile overlay.
 */
export interface DictionaryOverlay {
  /** New or overridden fields, keyed by tag. New fields use the tuple form. */
  readonly fields?: Readonly<Record<string, JsonFieldDef | FieldOverlay>>;
  readonly components?: Readonly<Record<string, readonly JsonLayoutItem[]>>;
  readonly messages?: Readonly<Record<string, MessageOverlay>>;
}

export type BuildMode = 'single' | 'batch' | 'list' | 'multileg';

export interface DimensionOption {
  readonly id: string;
  readonly label: string;
  /** Fragment applied when this option is selected. */
  readonly fragment?: string;
  /** Message type this option implies (typically flow options). */
  readonly msgType?: string;
  /** Build modes this option supports (first is the default). */
  readonly modes?: readonly BuildMode[];
  /**
   * Availability: system ids or "cap:<tag>" tokens, OR semantics.
   * Absent = available everywhere.
   */
  readonly availableOn?: readonly string[];
  /**
   * Identity-convention override (§3.10): selecting this option makes
   * instruments render through this convention instead of the system's
   * (e.g. a client whose entry path expects different identifiers).
   * Precedence: option > system; if several selected options declare one,
   * the last declared dimension wins and a finding reports the conflict.
   */
  readonly convention?: string;
}

export interface DimensionDef {
  readonly id: string;
  readonly label: string;
  readonly required?: boolean;
  /** 'instrument' dimensions search the instrument DB instead of options. */
  readonly kind: 'options' | 'instrument';
  readonly options?: readonly DimensionOption[];
}

export interface ValidationPolicyOverride {
  readonly rule: string;
  readonly msgType?: string;
  readonly tag?: number;
  readonly severity: Severity;
}

export interface ValidationPolicy {
  /** Global severity remap per rule id. */
  readonly rules?: Readonly<Record<string, Severity>>;
  /** Per-tag / per-message-type remaps (most specific wins). */
  readonly overrides?: readonly ValidationPolicyOverride[];
}

export interface SystemDef {
  readonly id: string;
  readonly label: string;
  /** Single-level inheritance: unset properties come from the parent. */
  readonly extends?: string;
  /** Session/routing fragment ids, applied at the 'system' stage. */
  readonly fragments?: readonly string[];
  /** Applied after everything else — enforced fields (§3.3). */
  readonly finalFragment?: string;
  readonly dictionaryOverlay?: DictionaryOverlay;
  readonly capabilities?: readonly string[];
  /** Identity convention reference (§3.10). */
  readonly convention?: string;
  readonly validationPolicy?: ValidationPolicy;
  /**
   * Opaque per-system routing data handed to the embedded-mode host page
   * with every send (never interpreted by the builder itself).
   */
  readonly transportHints?: unknown;
}

export interface Profile {
  readonly schemaVersion: number;
  readonly name: string;
  readonly version: string;
  readonly fixVersion: FixVersionId;
  readonly dictionaryOverlay?: DictionaryOverlay;
  readonly systems: readonly SystemDef[];
  readonly dimensions: readonly DimensionDef[];
  readonly fragments: Readonly<Record<string, Fragment>>;
  readonly generators?: Readonly<Record<string, GeneratorDef>>;
  /** Identity conventions (§3.10), referenced by systems. */
  readonly conventions?: Readonly<Record<string, IdentityConvention>>;
  /** Base message-type template fragments, keyed by MsgType(35). */
  readonly templates?: Readonly<Record<string, string>>;
  readonly renderers?: {
    readonly json?: Readonly<Record<string, JsonMappingConfig>>;
  };
  readonly validationPolicy?: ValidationPolicy;
}

/** A system with `extends` resolved (all inheritable properties concrete). */
export type ResolvedSystemDef = Omit<SystemDef, 'extends'>;

/**
 * Resolve single-level extends: unset child properties inherit from the
 * parent; set properties replace wholesale (delta model, no deep merges).
 */
export function resolveSystemDef(
  profile: Profile,
  systemId: string
): ResolvedSystemDef | undefined {
  const system = profile.systems.find((s) => s.id === systemId);
  if (!system) return undefined;
  if (!system.extends) return system;
  const parent = profile.systems.find((s) => s.id === system.extends);
  if (!parent || parent.extends) {
    // Unknown parent or >1 level: validation reports it; use child as-is.
    return system;
  }
  return {
    id: system.id,
    label: system.label,
    ...((system.fragments ?? parent.fragments)
      ? { fragments: system.fragments ?? parent.fragments! }
      : {}),
    ...((system.finalFragment ?? parent.finalFragment) !== undefined
      ? { finalFragment: (system.finalFragment ?? parent.finalFragment)! }
      : {}),
    ...((system.dictionaryOverlay ?? parent.dictionaryOverlay) !== undefined
      ? { dictionaryOverlay: (system.dictionaryOverlay ?? parent.dictionaryOverlay)! }
      : {}),
    ...((system.capabilities ?? parent.capabilities) !== undefined
      ? { capabilities: (system.capabilities ?? parent.capabilities)! }
      : {}),
    ...((system.convention ?? parent.convention) !== undefined
      ? { convention: (system.convention ?? parent.convention)! }
      : {}),
    ...((system.validationPolicy ?? parent.validationPolicy) !== undefined
      ? { validationPolicy: (system.validationPolicy ?? parent.validationPolicy)! }
      : {}),
    ...((system.transportHints ?? parent.transportHints) !== undefined
      ? { transportHints: system.transportHints ?? parent.transportHints }
      : {}),
  };
}

/** Availability check: option tokens are system ids or "cap:<tag>" (OR). */
export function isAvailable(
  availableOn: readonly string[] | undefined,
  systemId: string,
  capabilities: ReadonlySet<string>
): boolean {
  if (!availableOn || availableOn.length === 0) return true;
  return availableOn.some((token) =>
    token.startsWith('cap:') ? capabilities.has(token.slice(4)) : token === systemId
  );
}
