/**
 * Placement contexts (§3.10): render one abstract identity into the three
 * mechanically parallel tag families — the top-level Instrument block, the
 * InstrumentLeg block (600-series) and the UnderlyingInstrument block
 * (under NoUnderlyings 711). Conventions are written once, reused for all.
 */
import type { Fragment, FragmentOp } from '../fragment/types.ts';
import type { FixVersionId } from '../dictionary/types.ts';
import type { Finding } from '../validation/types.ts';
import type { InstrumentRecord, StrategyRecord } from './types.ts';
import { resolveIdentity, type IdentityConvention, type IdentityRole } from './convention.ts';

export type PlacementContext = 'instrument' | 'leg' | 'underlying';

interface PlacementMap {
  readonly roles: Partial<Record<IdentityRole, number>>;
  readonly altGroup: { readonly count: number; readonly id: number; readonly source: number };
}

export const PLACEMENTS: Record<PlacementContext, PlacementMap> = {
  instrument: {
    roles: {
      symbol: 55,
      securityId: 48,
      securityIdSource: 22,
      securityType: 167,
      securityExchange: 207,
      cfiCode: 461,
      currency: 15,
      maturityMonthYear: 200,
      maturityDate: 541,
      maturityDay: 205, // FIX 4.2 only; conventions gate it by version
      strikePrice: 202,
      putOrCall: 201,
      optAttribute: 206,
      contractMultiplier: 231,
      securitySubType: 762,
    },
    altGroup: { count: 454, id: 455, source: 456 },
  },
  leg: {
    roles: {
      symbol: 600,
      securityId: 602,
      securityIdSource: 603,
      securityType: 609,
      securityExchange: 616,
      cfiCode: 608,
      currency: 556,
      maturityMonthYear: 610,
      maturityDate: 611,
      strikePrice: 612,
      putOrCall: 1358, // FIX 5.0; earlier versions express put/call via LegCFICode(608)
      optAttribute: 613,
      contractMultiplier: 614,
      securitySubType: 764,
    },
    altGroup: { count: 604, id: 605, source: 606 },
  },
  underlying: {
    roles: {
      symbol: 311,
      securityId: 309,
      securityIdSource: 305,
      securityType: 310,
      securityExchange: 308,
      cfiCode: 463,
      currency: 318,
      maturityMonthYear: 313,
      maturityDate: 542,
      strikePrice: 316,
      putOrCall: 315,
      optAttribute: 317,
      contractMultiplier: 436,
      securitySubType: 763,
    },
    altGroup: { count: 457, id: 458, source: 459 },
  },
};

export interface PlacedIdentity {
  readonly ops: readonly FragmentOp[];
  readonly findings: readonly Finding[];
}

/**
 * Abstract identity → fragment ops for a context. Missing identifiers are
 * findings (default show-with-warning), never a refusal.
 */
export function placeIdentity(
  record: InstrumentRecord | StrategyRecord,
  convention: IdentityConvention,
  context: PlacementContext,
  fixVersion: FixVersionId
): PlacedIdentity {
  const placement = PLACEMENTS[context];
  const identity = resolveIdentity(record, convention, fixVersion);

  const ops: FragmentOp[] = [];
  for (const [role, value] of identity.values) {
    const tag = placement.roles[role];
    if (tag !== undefined) {
      ops.push({ op: 'set', tag, value });
    }
  }
  if (identity.altIds.length > 0) {
    ops.push({
      op: 'group',
      countTag: placement.altGroup.count,
      mode: 'replace',
      entries: identity.altIds.map((alt) => [
        { op: 'set', tag: placement.altGroup.id, value: alt.id },
        { op: 'set', tag: placement.altGroup.source, value: alt.sourceCode },
      ]),
    });
  }

  const findings: Finding[] = identity.missing.map((m) => ({
    ruleId: 'instrument-missing-identifier',
    severity: m.required ? 'warning' : 'info',
    path: '',
    message: `${record.name ?? record.key}: no value for ${m.role} (${m.source})${
      m.required ? ' — required by the convention' : ''
    }`,
  }));

  return { ops, findings };
}

/** Wrap a placed identity as a merge-pipeline fragment (stage 'instrument').
 *  `conventionNote` names a non-default convention source (e.g. an option
 *  override — "Client: Desk account") so provenance shows why the identity
 *  tags look the way they do. */
export function instrumentFragment(
  record: InstrumentRecord | StrategyRecord,
  convention: IdentityConvention,
  context: PlacementContext,
  fixVersion: FixVersionId,
  conventionNote?: string
): { fragment: Fragment; findings: readonly Finding[] } {
  const placed = placeIdentity(record, convention, context, fixVersion);
  return {
    fragment: {
      id: `instrument:${record.key}`,
      label: `Instrument: ${record.name ?? record.key}${
        conventionNote ? ` · convention via ${conventionNote}` : ''
      }`,
      ops: placed.ops,
    },
    findings: placed.findings,
  };
}
