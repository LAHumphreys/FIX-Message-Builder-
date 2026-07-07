/**
 * Instrument database (brief §3.10). Instruments are data, not fragments:
 * a user-supplied DB separate from the profile. Identifier schemes are
 * profile-declared, not engine-hardcoded.
 */

/** Well-known typed attributes; arbitrary extras are allowed alongside. */
export interface InstrumentAttrs {
  readonly securityType?: string; // SecurityType(167) value: CS, FUT, OPT...
  readonly currency?: string;
  readonly mic?: string; // SecurityExchange(207)
  readonly cfiCode?: string; // CFICode(461)
  readonly maturityMonthYear?: string; // 200: YYYYMM, YYYYMMDD, YYYYMMwN
  readonly maturityDate?: string; // 541: YYYYMMDD
  readonly strikePrice?: string; // 202
  readonly putOrCall?: string; // 201: 0 put / 1 call
  readonly optAttribute?: string; // 206
  readonly contractMultiplier?: string; // 231
  /** Key of the underlying instrument record. */
  readonly underlying?: string;
  readonly [extra: string]: string | undefined;
}

export interface InstrumentRecord {
  readonly key: string;
  readonly name?: string;
  /** Identifiers keyed by scheme: isin, exchangeSymbol, ric, custom:<n>... */
  readonly schemes: Readonly<Record<string, string>>;
  readonly attrs: InstrumentAttrs;
  /** Unknown top-level keys, preserved verbatim for round-trip fidelity
   *  (§3.9: files are git-reviewed; serialisation must not eat data). */
  readonly extra?: Readonly<Record<string, unknown>>;
}

export interface StrategyLeg {
  /** Key of an instrument record. */
  readonly instrument: string;
  readonly ratioQty: string; // LegRatioQty(623)
  readonly side: string; // LegSide(624)
  readonly price?: string; // LegPrice(566)
  /** Unknown keys, preserved verbatim. */
  readonly extra?: Readonly<Record<string, unknown>>;
}

export interface StrategyRecord {
  readonly key: string;
  readonly name?: string;
  /** Maps to SecuritySubType(762) where used. */
  readonly strategyType?: string;
  /** Venue-listed strategies carry their own identifier schemes. */
  readonly schemes?: Readonly<Record<string, string>>;
  readonly attrs?: InstrumentAttrs;
  readonly legs: readonly StrategyLeg[];
  /** Unknown top-level keys, preserved verbatim (see InstrumentRecord). */
  readonly extra?: Readonly<Record<string, unknown>>;
}

export interface InstrumentDb {
  readonly instruments: ReadonlyMap<string, InstrumentRecord>;
  readonly strategies: ReadonlyMap<string, StrategyRecord>;
  /** Declaration order, for stable listing and round-trip fidelity. */
  readonly instrumentOrder: readonly string[];
  /** Column order of the source CSV, when loaded from CSV. */
  readonly csvColumns?: readonly string[];
  /** Unknown top-level file keys ($schema, comments…), preserved verbatim. */
  readonly extra?: Readonly<Record<string, unknown>>;
}

export interface InstrumentDbIssue {
  readonly severity: 'error' | 'warning';
  readonly path: string;
  readonly message: string;
}
