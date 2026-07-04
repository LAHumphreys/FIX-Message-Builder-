# FIX Message Builder — Project Brief

## 1. Overview

A fully client-side, static web application for composing FIX protocol test messages. Instead of maintaining hundreds of hand-written message files, the user selects composable building blocks (instrument, flow type, route, session, etc.), fills in parameter slots, and renders the result in one of several output formats.

The public repository contains a **generic engine and UI with no knowledge of any specific trading environment**. All environment-specific detail — server names, bespoke routing tags, algo parameter sets, instrument universes, custom output mappings — lives in a **profile**: a config bundle the user loads locally at runtime and keeps in their own (private) version control. The public repo ships a fictional demo profile only.

### Goals

- Replace large libraries of static message files with a small set of composable fragments plus saved scenarios.
- Support single orders, batches of related independent orders, and true FIX order lists (35=E).
- Render to multiple output formats, including a profile-configurable JSON format.
- Be a credible public portfolio piece: clean architecture, strict typing, heavy unit testing.
- Guarantee no data ever leaves the user's machine.

### Non-goals

- No FIX session/transport layer. This builds message _content_; it does not connect to anything.
- No server-side component of any kind.
- No FIXML output in v1.
- Not a general-purpose FIX parser/analyser (though a paste-and-decode view is a possible later addition).

## 2. Privacy and deployment constraints (hard requirements)

- Static site, deployable to GitHub Pages directly from the public repo via GitHub Actions.
- **Zero network activity after page load.** No analytics, no telemetry, no CDN-loaded resources at runtime, no font/CDN fetches — everything bundled. Enforce with a strict Content-Security-Policy meta tag (`default-src 'self'` or stricter) and a CI check that greps the bundle for `fetch(`/`XMLHttpRequest`/`sendBeacon` usage outside allowlisted engine code (which should have none).
- Profiles and scenarios are loaded via file picker or drag-and-drop, and exported via file download or clipboard. On Chromium, an optional **workspace mode** grants read/write access to a local directory via the File System Access API (see 3.9) — access is per-origin, per-directory, by explicit user gesture, and purely local; it does not weaken the no-network guarantee.
- Optional convenience caching in IndexedDB, **off by default**, with an explicit "stored in this browser only" notice and a one-click "clear all local data" action (scope varies by tier — see 3.9). localStorage may hold UI preferences only (theme, last-used renderer).
- README prominently documents the privacy model — it is a feature, not a footnote.

## 3. Domain model

### 3.1 Canonical message representation

The engine's internal representation of a message: an ordered list of fields, where a field is `(tag: number, value: string)` or a repeating group `(countTag: number, entries: Field[][])`. Groups nest arbitrarily. Order is significant and preserved. All values are strings internally; typing is a dictionary/rendering concern.

Every field carries **provenance**: which fragment or user input set it, and whether it overwrote an earlier value. The UI surfaces this.

### 3.2 Dictionaries

- Base dictionaries for **FIX 4.2, 4.4, and 5.0 SP2** (application layer). Source: QuickFIX XML dictionaries, converted at build time into a compact JSON format bundled with the app. Note for 5.0: session-layer fields live in FIXT.1.1; since we build application messages offline, the 5.0 dictionary should merge in the standard header/trailer definitions so rendered messages are complete.
- A dictionary provides: tag → name, type, enum values; per-message-type field lists with required flags; repeating group definitions (count tag, member tags, delimiter/first tag).
- **Dictionaries are advisory, not authoritative.** Real trading systems interpret the standard creatively. The profile may extend and override the base dictionary: add custom tags (any range), add/replace enum values, change a field's type, mark required fields optional or vice versa, redefine group membership, define entirely custom message types.
- Effective dictionary = base dictionary + profile overlay, resolved at profile load.

### 3.3 Profile

A JSON document (or small bundle) defining an environment. Contains:

- `fixVersion` default (switchable in UI among the three supported).
- Dictionary overlay (custom tags, enum overrides, requiredness overrides, custom groups/messages).
- **Target system registry.** There are many target systems (dev/UAT boxes) in different configurations and versions; configuration drives behaviour more than version, and systems do not promote cleanly, so systems are modelled as a first-class selector — not as separate profiles, branches or environments. Each system entry contains:
  - session/routing fragments (CompIDs, bespoke per-box routing tags), including an optional **final fragment** applied after all other fragments so enforced routing fields cannot be clobbered by flow/instrument fragments;
  - a **dictionary overlay delta**, layered on top of the profile overlay (resolution order: base dictionary → profile overlay → system overlay) to capture per-box interpretation and version differences;
  - **capability tags** (e.g. `slicer-v2`, `lists`, `futures`) declaring what the box supports;
  - a reference to an **instrument identity convention** (see 3.10) defining which identifier schemes and FIX tags the box expects;
  - a **validation policy delta** (per-system muting/escalation);
  - optional single-level `extends` of another system entry, so near-identical boxes are declared as deltas.
- **Selector dimensions**: the profile declares its own dimensions rather than the engine hardcoding "instrument/flow/route". Each dimension has a name, display label, whether it is required, and a set of options, where each option references a fragment. The **target system is always the first dimension**; its selection drives availability filtering of the rest. The **instrument dimension is database-driven** (typeahead search over the instrument DB, see 3.10) rather than a fixed option list. Fragments and dimension options may declare `availableOn` — a list of system IDs or capability-tag expressions (default: available everywhere) — and the UI filters options accordingly (e.g. an algo flow only appears for systems where it is deployed).
- Fragment library (see 3.4).
- Generator definitions (see 3.6).
- Renderer configurations, including the in-house JSON mapping (see 5.2).
- Validation policy (see 4).

### 3.4 Fragments

A fragment is an ordered list of operations applied to the message under construction:

- `set(tag, value)` — literal value.
- `setGenerated(tag, generatorRef)` — value produced at render time.
- `slot(tag, slotSpec)` — declares a user-input field (see 3.5).
- `remove(tag)` — strips a tag set by an earlier fragment.
- `group(countTag, entrySpecs)` — append or define repeating group entries; entries themselves contain the same operation types.
- `meta` — human description, applicable message types, applicable FIX versions.

**Merge semantics:** fragments apply in a defined order (base message-type template → target-system fragments → remaining dimension fragments in profile-declared order → extras → user slot values → system final fragment, if any). Collisions are last-wins, always producing a provenance record and a UI-visible notice. Deterministic and fully unit-testable.

### 3.5 Slots

User-facing inputs declared by fragments. A slot has: tag, label, type (`string | int | decimal | enum | timestamp | bool`), optional enum source (dictionary or inline), default, optional generator default, required flag, and optional validation pattern. Typical slots: Side, OrderQty, Price, TimeInForce.

### 3.6 Generators

Deterministic-where-possible value producers, defined in the profile and referenced by fragments/slots:

- `sequence` — scoped counter: per-message, per-batch, or persistent (persistent counters live in the optional local cache; without cache they seed from a user-editable start value).
- `timestamp` — UTC now with configurable FIX format/precision (seconds/millis/micros).
- `template` — string interpolation, e.g. `CLORD-{date:yyyyMMdd}-{seq:4}`.
- `shared` — a value generated once per batch and injected into every message in the batch. This is the ListID/basket-linking mechanism.
- `random` — hex/uuid-style token with configurable length.

### 3.7 Order groups

Three distinct concepts, all required:

1. **Batch**: N independent messages built from the same fragment stack. UI presents a grid — one row per order, one column per slot, plus an optional per-row **instrument** column (baskets are typically multi-instrument) — with per-row overrides and `shared` generators linking fields across rows (same ListID, ClOrdID-1..N via per-batch sequence, etc.). Export as one array/file or per-message files.
2. **List (35=E)**: a single NewOrderList message whose orders are entries in the NoOrders repeating group. The same slot grid drives group entries. Profile may redefine the group structure to match local interpretation.
3. **Multileg (35=AB)**: a single NewOrderMultileg message whose legs come from a strategy record (see 3.10), each leg's instrument block rendered via the InstrumentLeg placement context, with an editable leg grid (ratio, side, price, per-leg overrides). FIX ≥4.3 only; availability gated per-system by capability tags alongside the venue-listed and define-then-trade strategy patterns.

A saved scenario records which mode it uses. CSV paste into the grid is a stretch goal, not v1.

### 3.8 Scenarios

A scenario is the full serialized builder state: profile reference (by name/version, not embedded), FIX version, dimension selections (including target system), slot values, batch/list rows, renderer choice. Round-trips losslessly to a JSON file. **Scenarios are the replacement for the current library of hundreds of static message files** — the private work repo stores scenarios plus one profile.

**Retargeting:** changing a scenario's target system re-resolves everything through the new system's overlays. Selections that no longer resolve (algo not deployed there, option filtered by capability) surface as validation findings — never silent breakage — so running one test scenario against several differently-configured systems is a single dropdown change per run.

### 3.9 Persistence, workspaces and file management

Files in a git repository are the system of record; the browser is a workspace. Three tiers:

**Tier 1 — Workspace mode (Chromium only; File System Access API).** The user grants read/write access to a local directory (typically a checkout of their private repo) via `showDirectoryPicker()`. The app scans it by convention:

```
workspace/
├── profile/            one or more *.profile.json (or a profile bundle)
├── instruments/        instrument database file(s) — CSV or JSON (see 3.10)
├── scenarios/          *.scenario.json — listed in a sidebar browser
└── rendered/           optional; export target if downstream tools read from the repo
```

- Save writes scenario files in place; the user commits/reviews with normal git tooling. The app has no git awareness.
- The directory handle is persisted in IndexedDB so reattaching on revisit is one permission click (or zero with Chrome's persistent grants).
- **Files are the single source of truth.** In workspace mode, IndexedDB stores only the handle, UI preferences and sequence counters — never file content — eliminating dual-source-of-truth reconciliation.
- **Optimistic concurrency:** before writing, compare the on-disk `lastModified` with the value captured at load; if the file changed externally (git pull, IDE edit), warn with overwrite / reload / save-as options. Never silently clobber.
- **Rescan on window focus** plus manual refresh (no file-watch API exists); per-scenario dirty indicators distinguish unsaved builder state from disk state.

**Tier 2 — File mode (all browsers; the demo default).** Drag-drop / file picker to load, file download to save; the user moves files into the repo manually. Identical file formats, so files interchange freely between tiers. Firefox/Safari get this tier only.

**Tier 3 — Browser cache (opt-in, off by default).** In file mode, caches the loaded profile and recent scenarios in IndexedDB for convenience, with staleness warnings when a loaded scenario declares a different profile version than the cached profile. In workspace mode the cache deliberately holds no file content (see Tier 1). One-click "clear all local data" always available; an explicit "stored in this browser only" notice shown on enable.

**Sequence counters** (persistent ClOrdID-style sequences) live in IndexedDB per-workspace with a user-editable seed — committing counter bumps to git would be noise. Counters are per-machine by design; date-prefixed templates (`{date}-{seq}`) make cross-machine collisions a non-issue for test traffic.

**Versioning:** both profile and scenario formats carry a `schemaVersion` (app format version) and profiles carry a user-facing `name`/`version`. Loading a scenario whose declared profile name/version mismatches the loaded profile produces a warning and a best-effort apply, with validation findings for slots/fragments that no longer resolve. Profiles may optionally be a **bundle**: a root file referencing fragment files (multi-file load or zip in file mode; natural in workspace mode) for larger fragment libraries with per-file ownership.

**Authoring and in-app editing:** the profile splits into _data-shaped_ and _code-shaped_ content, with different editing stories. **Data-shaped** — instrument records and target-system entries (flat structured records with known schemas) — get **in-app form-based CRUD**: add/edit/duplicate/delete, with the instrument form pre-filled from the selected system's convention requirements so missing schemes are visible at entry time. **Code-shaped** — fragments, identity conventions, renderer mappings, validation policies — are edited in the user's IDE only (v1 has no editor for these; they are compositional and cross-referencing, and the shipped **JSON Schemas** give IDE autocomplete/validation). Save-back requirements for in-app edits:

- **Round-trip fidelity:** unknown keys are always preserved; serialisation is canonical (stable key order, fixed formatting) so a single added record produces a minimal git diff — this is a hard requirement, since git review is the change-control layer. CSV instrument DBs write back as CSV with column order preserved.
- **Workspace mode** writes the profile/instrument file in place under the same optimistic-concurrency rules as scenarios (mtime check, conflict prompt). **File mode** downloads the updated file for manual replacement.
- The app validates on load with path-precise error reporting regardless of how a file was produced.

### 3.10 Instrument database and identity conventions

Different target systems expect different instrument identifier conventions (ISIN vs exchange code vs house/custom codes), so instruments are **data, not fragments** — a user-supplied instrument database, separate from the profile (different size and change cadence; typically exported from internal reference data).

FIX instrument identity is a **composite component**, not a single ID: `Symbol(55)`, `SecurityID(48)`+`SecurityIDSource(22)`, the `NoSecurityAltID(454)` repeating group, `SecurityType(167)`, `CFICode(461)`, `SecurityExchange(207)`, plus contract fields for derivatives. The same abstract identity is rendered into three mechanically parallel tag contexts: the top-level **Instrument** block, the **InstrumentLeg** block (600-series: 600/602/603/609/610/612…), and the **UnderlyingInstrument** block (311/309/305/313/316…, under `NoUnderlyings(711)`). The engine therefore separates **identity resolution** (instrument record → abstract identity: scheme values + typed attributes) from **placement** (abstract identity → tags in a given component context). Conventions are written once and reused for outrights, legs and underlyings.

- **Format:** CSV and JSON both supported (CSV is the likely real-world export format). Lives in `instruments/` in workspace mode; drag-drop in file mode. Never shipped in the public repo beyond a small fictional demo set.
- **Record shape:** a stable internal key; a map of identifiers keyed by **scheme** (`isin`, `exchangeSymbol`, `ric`, `custom:<name>`, composed contract codes such as OSI or `ESU6`-style, …); core attributes (security type, currency, MIC); **typed derivative attributes** — maturity (`MaturityMonthYear(200)` supporting `YYYYMM`/`YYYYMMDD`/`YYYYMMwN` weekly forms, and/or `MaturityDate(541)`), strike (`202`), put/call (`201`), `OptAttribute(206)`, `CFICode(461)`, `ContractMultiplier(231)`, underlying reference (key of another record); arbitrary additional attributes. Schemes are profile-declared, not engine-hardcoded.
- **Strategy records:** composites with their own key, a strategy type (mapping to `SecuritySubType(762)` where used), and an ordered list of legs, each referencing an instrument record with `LegRatioQty(623)`, `LegSide(624)` and optional `LegPrice(566)`. A strategy may _also_ carry its own identifier schemes (venue-listed strategies have their own security IDs).
- **Identity conventions:** named, profile-level mappings from an instrument record to the tags of a component context — scheme lookups, attribute lookups, literals, fallback chains (`55 ← custom:oms ?? exchangeSymbol`), per-entry required/optional. Conventions support: **repeating-group emission** (alt-ID group 454/455/456); **security-type variants** (equity vs future vs option tag sets); **FIX-version variants** (e.g. `MaturityDay(205)` in 4.2 vs `541` in 4.4+; `PutOrCall(201)` vs `CFICode(461)` — 201 is formally deprecated from 4.3 but remains in wide use, so both must be expressible); and **composed vs decomposed modes** (whole contract in one code — OSI in 55/48, or `48`+`22=8` exchange-ID style with no maturity/strike tags — vs explicit 200/201/202 decomposition). **Each system references a convention**; many systems share one.
- **Strategy emission — three patterns**, gated per-system by capability tags:
  1. **Venue-listed**: the strategy trades under its own security ID (`167=MLEG`, optional 762) — identified via a convention like any instrument.
  2. **Leg-enumerated**: `NewOrderMultileg(35=AB)` with the `NoLegs(555)` group; each leg's instrument block is produced by applying the convention in the InstrumentLeg placement context, plus ratio/side/price from the strategy record. (35=AB does not exist in FIX 4.2 — version-gated.)
  3. **Define-then-trade**: generate a `SecurityDefinitionRequest(35=c)` enumerating legs; subsequent orders use the venue-assigned ID via pattern 1. The 35=c is just another buildable message type; correlating the assigned ID back is manual (out of scope — no session layer).
- **Resolution:** instrument/strategy selection + target system's convention + placement context synthesises an instrument fragment that enters the normal merge pipeline with standard provenance.
- **Missing identifiers:** if the convention requires a scheme or attribute the record lacks, default behaviour is show-with-warning (consistent with never-block); the profile may opt to filter such instruments from search instead.
- **UI:** the instrument selector is typeahead search over the DB (must remain responsive at thousands of rows); in the batch/list grid, instrument is an optional per-row column — baskets are typically multi-instrument. Selecting a strategy record in a multileg flow populates an editable leg grid.
- Hand-written instrument fragments remain supported for one-off oddities; the DB is the primary path.

## 4. Validation policy

Guiding principle: **the tool never refuses to render.** Deliberately malformed messages are legitimate test inputs (negative testing). Validation informs; it does not block.

- Rule categories: required field missing (per effective dictionary), unknown tag, enum value not in dictionary, type mismatch, group count/entry mismatch, group field ordering, header/trailer ordering, duplicate tag outside a group.
- Each finding has a severity: `error | warning | info | off`. Defaults: standards violations are `warning`; internal inconsistencies (e.g. group count contradicts entry count when both explicitly set) are `error` — but even errors only badge the output, never suppress it.
- The profile's validation policy can remap any rule's severity globally or per-tag/per-message-type ("yes, we know tag 21 is weird here — mute it").
- Findings display inline in the annotated view and as a summary panel, each carrying provenance (which fragment introduced the offending field).

## 5. Output renderers

All renderers consume the canonical representation. Renderer choice is per-scenario with per-export override. Exports: copy single message, download single file, download batch as one document or zip of per-message files.

### 5.1 Raw tag=value

- Delimiter selectable: SOH (`\x01`), `|`, `^A` literal.
- Correct header ordering (8, 9, 35 first), trailer last.
- BodyLength(9) and CheckSum(10) computed correctly (known-answer tested against published examples).
- Option to omit 9/10 for downstream tools that compute their own.

### 5.2 Configurable JSON (covers the in-house format)

The in-house format is: an array of objects, one object per message, repeating groups as arrays of sub-objects. The renderer generalizes this via a mapping config stored in the profile, so the exact work format never appears in the public repo:

- **Key style**: tag number (`"38"`), dictionary field name (`"OrderQty"`), or a custom alias map (profile-supplied `tag → key`).
- **Group representation**: keyed by count-tag name or number, or by a custom key; entries as arrays of sub-objects (same key style, recursively).
- **Count emission**: emit the count field explicitly, or omit it (inferred from array length by the consumer).
- **Value typing**: all strings, or native JSON numbers/booleans where the dictionary type permits.
- **Envelope**: optional per-message wrapper object with static or generated metadata fields; optional top-level wrapper around the array.
- **Field order / omission**: include-all vs. suppress header/trailer fields the consumer supplies itself (e.g. omit 8/9/10/52).

The demo profile ships one plausible mapping; the private work profile encodes the real one.

### 5.3 Annotated human-readable

`38 (OrderQty) = 100 [Buy]`-style listing with enum labels resolved, group indentation, provenance markers, and inline validation badges. This is the primary demo/portfolio view.

## 6. Architecture and stack

- **TypeScript, strict mode throughout.** Vite build, React UI, Vitest for tests, ESLint + Prettier, GitHub Actions for CI (typecheck, lint, test, bundle-privacy check) and Pages deployment.
- Two-layer structure enforced by lint rules:
  - `src/engine/` — pure TypeScript, zero DOM/browser dependencies, zero runtime dependencies. Dictionaries, profile resolution, fragment merge, generators, validation, renderers, scenario (de)serialization.
  - `src/ui/` — React components over the engine. Thin: no business logic.
- Build-time script converts QuickFIX XML dictionaries to bundled JSON (checked-in output so the site builds without the XML step; script re-runnable).
- No backend, no service worker needed in v1 (add later for offline install if desired).

## 7. Testing strategy

- Engine target: high coverage, table-driven tests as the default style.
- Merge semantics: exhaustive precedence/collision/provenance cases.
- Renderers: golden-file tests; tag=value checksum/bodylength known-answer tests from published FIX examples.
- Validation: one test table per rule category, including profile severity remapping.
- Scenario and profile serialization: property-based round-trip tests (fast-check).
- Generators: determinism under injected clock/seed; `shared` scoping across batch rows.
- UI: light component tests for the grid and provenance display; engine carries the weight.

## 8. Demo profile (public)

Entirely fictional environment shipped in-repo: **three "systems"** — two sharing a base via `extends` but differing in one routing tag and one capability (demonstrating the delta model), a third on an older "deployment" whose dictionary overlay changes an algo's tag set — bespoke routing tags in the 20000+ range; a **small fictional instrument DB** — a dozen equities, a future with quarterly and weekly maturities, an option series, and one two-leg calendar-spread strategy record — with two identity conventions (ISIN-based decomposed vs custom-code composed) split across the systems, one system taking decomposed option identity (55/200/201/202) and another taking a composed code, and one instrument deliberately missing a scheme to demonstrate the missing-identifier warning; four flow types (plain limit, a fictional "SLICER" algo with custom 7xxx-range tags gated by capability tag, a basket flow, and a multileg flow gated to one system); one deliberately non-standard dictionary override (to demonstrate the tolerance + warning-mute machinery); one JSON mapping config; and several saved example scenarios — including one that produces a validation finding when retargeted. The demo doubles as documentation.

## 9. Milestones

1. **Engine core** — canonical representation, dictionary load (4.4 first), tag=value renderer with checksum/bodylength, test harness.
2. **Composition** — profile schema, dictionary overlay, fragment merge with provenance, slots, generators, validation rules + policy.
3. **Builder UI** — dimension selectors from profile, slot form, annotated view, copy/export, profile file loading.
4. **Groups** — batch grid, shared generators, 35=E list mode, batch export.
5. **JSON renderer + scenarios** — mapping config, scenario save/load (file mode), schemaVersion handling, FIX 4.2 and 5.0 dictionaries.
6. **Workspace mode** — File System Access integration, directory scan, scenario sidebar, in-place save with conflict detection, focus rescan, persistent handle, Tier 2 fallback path verified in Firefox.
7. **Data editing** — in-app CRUD for instruments and target systems with canonical, unknown-key-preserving serialisation; save-back in both tiers; convention-driven instrument form pre-fill.
8. **Ship** — demo profile, JSON Schemas, README (privacy model, architecture, screenshots), CSP + bundle-privacy CI check, Pages deployment, polish.

## 10. Acceptance criteria

- Build a plausible single order (demo profile) in under a minute from a cold page load, and copy it as pipe-delimited tag=value with a correct checksum.
- Build a 5-order batch sharing a generated ListID; export as a single JSON array matching the demo mapping config.
- Build a 35=E list with 3 orders in the repeating group; annotated view shows correct group nesting.
- A profile dictionary override silences a specific standards warning; removing the override restores it.
- Retarget a saved scenario from a system with the SLICER capability to one without it: the flow selection surfaces as a validation finding, the message still renders, and retargeting back restores a clean state.
- Systems related by `extends` render identically except for the declared delta (verified by golden-file diff).
- The same instrument selected against two systems with different identity conventions produces correspondingly different instrument tags (e.g. 48/22/ISIN vs 55/custom code), each with correct provenance; an instrument missing a required scheme renders with a warning, not a block.
- The same option rendered decomposed (55/200/201/202) on one system and as a composed code on another, from one instrument record, by switching target system only.
- A two-leg strategy record builds a 35=AB with a correct 555 group — leg instrument blocks produced by the _same_ convention via the InstrumentLeg placement (verified: leg tags 600/602/603/610 mirror what 55/48/22/200 would have been) — and the same strategy renders as a single venue-listed order on a system with that capability instead.
- Instrument typeahead remains responsive with a 10,000-row generated test DB.
- Add one instrument via the in-app editor in workspace mode: the on-disk file diff touches only the new record (verified against a fixture containing unknown keys, which survive untouched); the same edit in file mode produces a byte-identical downloaded file.
- Network tab shows zero requests after initial page load through all of the above.
- A scenario saved, page reloaded, profile re-loaded, scenario re-imported → byte-identical output.
- Workspace mode: attach a directory, edit a scenario file externally, return to the tab → the app detects the change; attempting to save over it triggers the conflict prompt rather than a silent overwrite.
- Firefox: full build/export workflow succeeds in file mode with workspace features cleanly absent (feature-detected, not broken).
- Engine coverage high (target ≥90% lines) and CI green on typecheck/lint/test/privacy check.

## 11. Open questions (resolve before or during milestone 2)

1. In-house JSON key style: tag numbers, standard names, or aliases? (Determines which mapping options need the most polish first — the mechanism covers all three regardless.)
2. Are group count fields emitted explicitly in the in-house format or inferred from array length?
3. Is there any per-message envelope/metadata in the in-house format (session hints, comments)?
4. Timestamp conventions at work: SendingTime/TransactTime precision (millis? micros?) — affects generator defaults.
5. Do ClOrdID-style counters need to survive browser restarts (persistent sequence via opt-in cache), or is per-session sufficient?
6. What identifier schemes are actually in play across systems (ISIN / exchange symbol / RIC / house codes), and can the instrument DB be exported from internal reference data as CSV — and if so, roughly what columns? (Determines the default column-mapping config for CSV import.)
7. Do any systems need composite instrument identity (multiple tags required simultaneously, e.g. 55+207+48+22 together)? For options: which systems take decomposed (200/201/202) vs composed (OSI-style) identity, and 201 vs 461 for put/call?
8. Strategy patterns in use per system: venue-listed IDs, 35=AB leg enumeration, define-then-trade (35=c), or bespoke custom-tag schemes? Do delta-neutral/covered orders (UnderlyingInstrument block) occur in test flows?
9. MaturityMonthYear format per venue (YYYYMM vs YYYYMMDD vs weekly YYYYMMwN) — affects instrument DB column typing and convention variants.
