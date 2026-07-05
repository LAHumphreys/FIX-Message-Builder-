/**
 * Per-system resolution (brief §3.3): effective dictionary, fragment stack
 * skeleton, capabilities, availability filtering, validation policy chain.
 */
import type { Dictionary } from '../dictionary/types.ts';
import { effectiveDictionary } from '../dictionary/overlay.ts';
import type { Fragment, SourcedFragment } from '../fragment/types.ts';
import type {
  DimensionDef,
  DimensionOption,
  Profile,
  ResolvedSystemDef,
  ValidationPolicy,
} from './types.ts';
import { isAvailable, resolveSystemDef } from './types.ts';

export interface ResolvedSystem {
  readonly profile: Profile;
  readonly system: ResolvedSystemDef;
  /** base → profile overlay → system overlay. */
  readonly dictionary: Dictionary;
  readonly capabilities: ReadonlySet<string>;
  /** Ordered policy chain: profile policy then system policy (system wins). */
  readonly policyChain: readonly ValidationPolicy[];
  /** System session/routing fragments, stage 'system'. */
  readonly systemFragments: readonly SourcedFragment[];
  /** The enforced final fragment, stage 'final', if declared. */
  readonly finalFragment: SourcedFragment | undefined;
}

export interface AvailableDimension {
  readonly dimension: DimensionDef;
  /** Options with availability evaluated for this system. */
  readonly options: readonly { option: DimensionOption; available: boolean }[];
}

export function resolveForSystem(
  profile: Profile,
  systemId: string,
  baseDictionary: Dictionary
): ResolvedSystem | undefined {
  const system = resolveSystemDef(profile, systemId);
  if (!system) return undefined;

  const capabilities = new Set(system.capabilities ?? []);
  const fragmentById = (id: string): Fragment | undefined => profile.fragments[id];

  const systemFragments: SourcedFragment[] = [];
  for (const ref of system.fragments ?? []) {
    const fragment = fragmentById(ref);
    if (fragment) systemFragments.push({ fragment, stage: 'system' });
  }

  const final = system.finalFragment ? fragmentById(system.finalFragment) : undefined;

  const policyChain: ValidationPolicy[] = [];
  if (profile.validationPolicy) policyChain.push(profile.validationPolicy);
  if (system.validationPolicy) policyChain.push(system.validationPolicy);

  return {
    profile,
    system,
    dictionary: effectiveDictionary(
      baseDictionary,
      profile.dictionaryOverlay,
      system.dictionaryOverlay
    ),
    capabilities,
    policyChain,
    systemFragments,
    finalFragment: final ? { fragment: final, stage: 'final' } : undefined,
  };
}

/** Dimensions with per-option availability for the selected system. */
export function availableDimensions(resolved: ResolvedSystem): AvailableDimension[] {
  return resolved.profile.dimensions.map((dimension) => ({
    dimension,
    options: (dimension.options ?? []).map((option) => ({
      option,
      available: isAvailable(option.availableOn, resolved.system.id, resolved.capabilities),
    })),
  }));
}
