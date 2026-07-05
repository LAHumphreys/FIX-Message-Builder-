/**
 * Identity conventions (§3.10): named, profile-level mappings from an
 * instrument record to an abstract identity — scheme lookups, attribute
 * lookups, literals, fallback chains — with security-type and FIX-version
 * variants. Resolution is separate from placement: the same convention
 * renders outrights, legs and underlyings.
 */
import type { FixVersionId } from '../dictionary/types.ts';
import type { InstrumentRecord, StrategyRecord } from './types.ts';

/** Abstract identity roles; placement maps them to context tags. */
export type IdentityRole =
  | 'symbol'
  | 'securityId'
  | 'securityIdSource'
  | 'securityType'
  | 'securityExchange'
  | 'cfiCode'
  | 'currency'
  | 'maturityMonthYear'
  | 'maturityDate'
  | 'maturityDay'
  | 'strikePrice'
  | 'putOrCall'
  | 'optAttribute'
  | 'contractMultiplier'
  | 'securitySubType';

export type ValueSource =
  | { readonly scheme: string }
  | { readonly attr: string }
  | { readonly literal: string }
  | { readonly firstOf: readonly ValueSource[] };

export interface ConventionEmit {
  readonly role: IdentityRole;
  readonly from: ValueSource;
  readonly required?: boolean;
}

export interface ConventionVariant {
  /** All present conditions must match; absent = matches everything. */
  readonly when?: {
    readonly securityType?: readonly string[];
    readonly fixVersion?: readonly FixVersionId[];
  };
  readonly emit: readonly ConventionEmit[];
  /** Alt-ID repeating group entries (454/455/456-family per context). */
  readonly altIds?: readonly { readonly from: ValueSource; readonly sourceCode: string }[];
}

export interface IdentityConvention {
  readonly variants: readonly ConventionVariant[];
}

export interface MissingIdentity {
  readonly role: IdentityRole | 'altId';
  readonly required: boolean;
  readonly source: string;
}

export interface ResolvedIdentity {
  readonly values: ReadonlyMap<IdentityRole, string>;
  readonly altIds: readonly { readonly id: string; readonly sourceCode: string }[];
  readonly missing: readonly MissingIdentity[];
}

export function describeSource(source: ValueSource): string {
  if ('scheme' in source) return `scheme:${source.scheme}`;
  if ('attr' in source) return `attr:${source.attr}`;
  if ('literal' in source) return `'${source.literal}'`;
  return source.firstOf.map(describeSource).join(' ?? ');
}

function resolveSource(
  source: ValueSource,
  record: InstrumentRecord | StrategyRecord
): string | undefined {
  if ('literal' in source) return source.literal;
  if ('scheme' in source) return record.schemes?.[source.scheme];
  if ('attr' in source) return record.attrs?.[source.attr];
  for (const candidate of source.firstOf) {
    const value = resolveSource(candidate, record);
    if (value !== undefined) return value;
  }
  return undefined;
}

function variantMatches(
  variant: ConventionVariant,
  record: InstrumentRecord | StrategyRecord,
  fixVersion: FixVersionId
): boolean {
  const securityType = record.attrs?.securityType;
  if (variant.when?.securityType && !variant.when.securityType.includes(securityType ?? '')) {
    return false;
  }
  if (variant.when?.fixVersion && !variant.when.fixVersion.includes(fixVersion)) {
    return false;
  }
  return true;
}

/**
 * Record → abstract identity. The first matching variant applies. Missing
 * sources are reported (show-with-warning downstream — never a block).
 */
export function resolveIdentity(
  record: InstrumentRecord | StrategyRecord,
  convention: IdentityConvention,
  fixVersion: FixVersionId
): ResolvedIdentity {
  const variant = convention.variants.find((v) => variantMatches(v, record, fixVersion));
  if (!variant) {
    return { values: new Map(), altIds: [], missing: [] };
  }
  const values = new Map<IdentityRole, string>();
  const missing: MissingIdentity[] = [];
  for (const emit of variant.emit) {
    const value = resolveSource(emit.from, record);
    if (value !== undefined) {
      values.set(emit.role, value);
    } else {
      missing.push({
        role: emit.role,
        required: emit.required ?? false,
        source: describeSource(emit.from),
      });
    }
  }
  const altIds: { id: string; sourceCode: string }[] = [];
  for (const alt of variant.altIds ?? []) {
    const value = resolveSource(alt.from, record);
    if (value !== undefined) {
      altIds.push({ id: value, sourceCode: alt.sourceCode });
    } else {
      missing.push({ role: 'altId', required: false, source: describeSource(alt.from) });
    }
  }
  return { values, altIds, missing };
}
