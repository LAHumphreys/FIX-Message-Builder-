# Profile workspace — draft specification (for review)

> **Status: DRAFT for review — no implementation yet.** This specifies a
> source format and build tool that compile down to the existing
> `work.profile.json` + `instruments.json`. The deployed app and the host
> page are unchanged: they keep consuming the two compiled files.

## 1. Why

The profile format is powerful but flat: one large JSON where a single
conceptual change ("add an algo", "enable it on a link") is smeared across
several sections (`dictionaryOverlay`, `fragments`, `dimensions`,
`capabilities`). Hand-editing it is cumbersome, reviews are noisy, and a
config assistant editing a 1,500-line file is unreliable.

The workspace replaces _authoring_ the profile with _compiling_ it from
small, single-purpose files — without changing what the app consumes.

## 2. Design principles

1. **Common case easy and discoverable.** Adding an instrument is a CSV row.
   Adding an algo is one file. Enabling an algo on a link is one string in
   one array. File names are entity ids; the directory listing _is_ the
   inventory.
2. **No cliffs — a ladder, not a wall.** Every convenience ("sugar") is
   defined by its expansion into profile primitives, documented next to the
   sugar itself. When sugar runs out, you drop exactly one rung: sugar →
   raw fragments/ops in the same file → freestanding fragments → a final
   whole-profile override. Each rung is reachable without abandoning the
   others.
3. **The engine is the only semantics.** The build tool contains no second
   implementation of merge/validation rules: it assembles JSON and then runs
   the **real profile loader** over the result. The workspace cannot drift
   from the app.
4. **Deterministic, diff-friendly output.** Byte-stable canonical
   serialization; a config PR's diff (source and compiled) is reviewable.
5. **Fail at build time, loudly, with file+path.** Errors name the source
   file and JSON path, not a location in the compiled output.

## 3. Directory layout

```
profile-src/
  workspace.json            # manifest: profile name/version, FIX version, generators, policy
  links/
    east-uat.json           # one file per target system
    east-dev.json
  flows/
    limit.json              # one file per flow — an "algo" is just a flow with params
    slicer.json
  conventions/
    isin-decomposed.json    # identity conventions, verbatim §10 format
  mappings/
    gateway.json            # renderers.json entries, verbatim §11 format
  instruments/
    equities.csv            # any mix of .csv / .json; merged
    futures.json
  fragments/                # OPTIONAL — raw fragments (escape-hatch rung 3)
    weird-session-x.json
  overrides.profile.json    # OPTIONAL — last-resort merge patch (rung 4)
```

- **File name = entity id** (`flows/slicer.json` → flow id `slicer`).
  No ids inside files to fall out of sync; renaming a file renames the
  entity and the build reports every dangling reference.
- Every file carries a `$schema` line (per-entity schemas ship in
  `docs/schemas/workspace/`); IntelliJ/VS Code completion works per file,
  against a schema a fraction of the size of the whole-profile one.

## 4. Entities

### 4.1 `workspace.json` — the manifest

```json
{
  "name": "Internal — Desk X",
  "version": "1.4.0",
  "fixVersion": "FIX.4.4",
  "generators": {
    "clOrdId": { "kind": "template", "template": "DESK-{date:yyyyMMdd}-{seq:4}" },
    "now": { "kind": "timestamp", "precision": "micros" }
  },
  "newOrderTemplate": {
    "11": { "generator": "clOrdId" },
    "21": "1",
    "60": { "generator": "now" }
  },
  "validationPolicy": { "rules": { "unknown-tag": "info" } }
}
```

`newOrderTemplate` is sugar for the `templates.D` fragment: a tag→value map
where a value is either a string (a `set` op) or `{ "generator": … }`
(a `setGenerated` op). _Expansion documented inline in the schema
description._ Need `remove`/`group`/per-msgType templates? Rung 2:
`"templates": { "D": "some-raw-fragment", "E:entry": … }` referencing
`fragments/`.

### 4.2 `links/<id>.json` — a FIX link (compiles to a system + its dimensions)

A link is not a flat fact-sheet: it carries its own selector space. Two
sub-dimensions recur on real links and are first-class here:

- **Clients** — different developers enter as different clients
  (PartyRole 3), and the chosen client can imply a different instrument
  identifier style (a different convention).
- **Routes** — coherent tag _combinations_ (typically HandlInst(21) +
  Text(58)) that steer the router down different paths into the box.

```json
{
  "label": "EAST-UAT",
  "session": { "49": "DESK-CLI", "56": "EAST-GW" },
  "convention": "isin-decomposed",
  "clients": {
    "luke": {
      "label": "Luke",
      "default": true,
      "parties": [{ "id": "LUKEH", "source": "D", "role": "3" }],
      "account": { "default": "LukeAcc", "editable": true }
    },
    "desk": {
      "label": "Desk account",
      "parties": [{ "id": "DESK-01", "source": "D", "role": "3" }],
      "convention": "house-composed"
    }
  },
  "routes": {
    "dma": { "label": "DMA", "default": true, "fields": { "21": "1" } },
    "care": { "label": "Care desk", "fields": { "21": "3", "58": "CARE" } }
  },
  "enforced": { "20101": "EAST-UAT-GW" },
  "algos": ["slicer"],
  "transportHints": { "route": "east-uat" },
  "extends": null
}
```

| Key          | Sugar for                                                                      | Notes                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `session`    | a system fragment of `set` ops                                                 | tag→value map; values may be `{ "generator": … }`                                                                      |
| `clients`    | options in a global **Client** dimension, gated to this link via `availableOn` | per-option: `parties`/`account` sugar as before, plus an optional `convention` that overrides the link's when selected |
| `routes`     | options in a global **Route** dimension, gated to this link                    | each option's `fields` is a tag→value map — a _coherent combination_, selected as one choice                           |
| `convention` | system `convention`                                                            | the link default; a client option may override                                                                         |
| `enforced`   | the system's `finalFragment`                                                   | tag→value map — always wins                                                                                            |
| `algos`      | capability tags + this link appearing in those flows' `availableOn`            | the algo×link matrix, link-side view                                                                                   |
| `extends`    | system `extends`                                                               | same one-level semantics as today                                                                                      |

Behaviour details:

- **Collapsed common case:** a link with exactly one client may write it as
  singular `"client": { … }` — compiled as a plain system fragment, no
  dropdown appears. Same for zero `routes` (no Route selector). The simple
  link file stays as short as the flat original.
- **`default: true`** marks the pre-selected option (exactly one per
  dimension per link; build-enforced). A `routes` dimension with no default
  is optional — "no route override" is a valid choice.
- The UI renders Client/Route selectors under the target system; switching
  links keeps selections and flags now-unavailable options as findings,
  exactly like the existing retargeting semantics (§3.8) — never silent.
- Routes vs. an enum _slot_ on Text(58): a slot edits one tag; a route
  option sets a **combination** coherently (21+58 must agree). Use a route
  when the values travel together; use a slot when one tag varies freely.
- The BUILD-REPORT gains client×link and route×link tables alongside the
  algo×link matrix.

**Rung 2 (in-file raw):** `"fragments": ["weird-session-x"]` appends raw
fragments from `fragments/` after the sugar-generated ones; a client/route
option accepts `"ops": [ … ]` (raw §6 ops) alongside or instead of its
sugar; `"dictionaryOverlay"` and `"validationPolicy"` accepted verbatim
(per-system quirks, §4/§12 format). Sugar and raw compose — you never
rewrite the easy parts to express the hard ones.

#### Engine prerequisite: option-level convention override

"The chosen client implies the identifier style" needs one small engine
addition: today `convention` is a system property only. The change — a
dimension option may carry `"convention": "<name>"`, and when selected it
overrides the system's convention for instrument placement (documented
precedence: option > system; two selected options both overriding is a
build-time error in the workspace and a load warning in the raw profile).
Touches the profile types/loader, selection resolution, and the derive
pipeline; surfaced in the annotated view's provenance ("convention via
Client: Desk account"). Ships as part of milestone W1, with the guide and
schemas updated in the same change as usual.

### 4.3 `flows/<id>.json` — a flow ("algo" = flow with params)

The altitude win: **one file is the whole algo** — custom tags, their
dictionary entries, which are user-editable, defaults, and where it runs.

```json
{
  "label": "SLICER algo",
  "msgType": "D",
  "availability": "opt-in",
  "fields": { "40": "2" },
  "params": {
    "7001": {
      "name": "SlicerStyle",
      "type": "INT",
      "enum": { "1": "Passive", "2": "Neutral", "3": "Aggressive" },
      "slot": { "label": "Slicer style", "required": true, "default": "1" }
    },
    "7002": {
      "name": "SliceQty",
      "type": "QTY",
      "slot": { "label": "Slice quantity", "required": true }
    },
    "7003": { "name": "SliceIntervalMs", "type": "INT", "value": "5000" }
  },
  "standardSlots": {
    "54": { "label": "Side", "type": "enum", "required": true, "default": "1" },
    "38": { "label": "Total quantity", "type": "decimal", "required": true },
    "44": { "label": "Limit price", "type": "decimal" }
  }
}
```

Each `params` entry feeds **both** consumers at once — `name`/`type`/`enum`
compile to the `dictionaryOverlay` entry; `slot` _or_ `value` compiles into
the flow fragment (an editable form field vs. a fixed constant). Declaring a
tag in two places today is the single most error-prone part of profile
authoring; here it cannot desync.

- `availability`: `"everywhere"` (default — plain limit/market flows) or
  `"opt-in"` (algos; links list them in `algos`). The build fails if an
  opt-in flow is enabled nowhere (dead config) — with the fix spelled out.
- `modes`: `["batch", "list"]` etc., verbatim as today, for basket flows.
- **Rung 2:** `"ops": [ … ]` — raw fragment ops appended after the
  generated ones, for `remove`, `group`, conditional structures; full §6
  op format. `standardSlots` is itself just sugar for slot ops.

### 4.4 `conventions/`, `mappings/`, `instruments/`

Deliberately **verbatim today's formats** (guide §10, §11, §13/CSV). These
sections are already well-shaped and altitude-appropriate; wrapping them
would add translation without removing complexity. Two additions:

- Multiple instrument files merge (build fails on duplicate keys, naming
  both files). A JSON instrument file may declare file-level
  `"defaults": { "attrs": { … } }` applied to every record in that file —
  the bulk case ("all of these are XLON equities") stays one line.
- A mapping file is one named mapping (`mappings/gateway.json` → the
  `renderers.json.gateway` entry).

### 4.5 The escape-hatch ladder (rungs 3 and 4)

- **`fragments/<id>.json`** — raw fragments in today's §6 format,
  referenced from links/flows/manifest. Anything the sugar can't say.
- **`overrides.profile.json`** — a JSON merge-patch applied to the
  assembled profile as the final build step. The build **warns** on every
  path it touches ("overrides.profile.json rewrote /systems/0/label —
  consider moving this into links/east-uat.json"): the pressure valve stays
  open, but drift is visible and nagged, never silent.

## 5. The build tool

A single CLI, shipped two ways: source in this repo, and **precompiled
(dependency-free, Node-only) in `internal-dist`** so the office never needs
npm.

```
fixb build   [src] [--out dir]     # assemble + validate + report (the default)
fixb explain [src] <entity>        # print the compiled profile JSON for one entity,
                                   #   annotated with which source line produced what
fixb explode [src] <profile.json>  # migrate: decompile an existing profile into a workspace
fixb init    [dir]                 # scaffold a new workspace with commented starter files
```

### 5.1 Outputs

- `work.profile.json` + `instruments.json` — canonical serialization
  (sorted keys, stable ordering): byte-identical for unchanged source.
- `BUILD-REPORT.md` — the discoverability artifact, written for humans:
  - the **algo × link matrix** (what runs where — the answer to the most
    common "wait, is X enabled on Y?" question),
  - per-link summaries (session, enforced tags, convention, client),
  - warnings: tag collisions between flows co-enabled on a link, instruments
    missing a scheme that some enabled link's convention requires, unused
    fragments/conventions/mappings, override-file touches,
  - a link back from every section to its source file.
- **Golden messages** (optional, recommended): one rendered message per
  link×flow with pinned clock/seed, written to `golden/`. Config PRs then
  show _what changed on the wire_, not just what changed in JSON — reviewers
  read FIX, not diffs of diffs.

### 5.2 Validation layers (all in one run, all file+path addressed)

1. Per-file schema validation (same schemas the IDE uses).
2. Cross-reference checks (every id resolves; opt-in flows enabled
   somewhere; conventions referenced by links exist).
3. **The real engine loader** parses the assembled output and must report
   zero issues — the same code path as the app's drag-drop.
4. Semantic lint (collisions, missing schemes, dead config) — warnings with
   suggested fixes.
5. Golden-message regeneration; unexpected diffs fail `--check` mode (CI).

### 5.3 Where it runs

Designed for the private config repo's CI (build + validate on every PR,
artifact = the compiled pair), and locally/office via the precompiled CLI.
The public repo ships the tool + schemas + docs only — no environment data,
as ever.

## 6. Discovery paths (how a configurer finds the next rung)

- **`fixb init`** scaffolds every folder with a commented example file.
- **Schema descriptions teach expansions**: hovering `session` in IntelliJ
  says _"sugar for a system fragment of set ops — need setGenerated/remove/
  groups? use `fragments`"_. The docs for each sugar show its exact
  compiled form.
- **`fixb explain links/east-uat.json`** shows precisely what a file became
  — the bridge from "magic" to the §-numbered profile format, which remains
  fully documented in PROFILE-AUTHORING.md.
- **`explode` is also a teacher**: run it on the demo profile to see what
  idiomatic workspace source looks like for config you already understand.
- The BUILD-REPORT names the source file for everything, so reading compiled
  output never dead-ends.

## 7. Migration

`fixb explode work.profile.json --out profile-src/` decompiles the current
hand-written profile into a workspace: recognizes the patterns the sugar
covers (session-shaped fragments, parties groups, enforced-tag final
fragments, overlay+slot pairs → `params`) and emits anything unrecognized
as raw `fragments/` + in-file `ops` — never lossy, never guessing.
Acceptance: `build(explode(p))` produces a profile the engine considers
semantically identical to `p` (same messages for a fixed clock/seed across
every link×flow — verified by the golden mechanism, not by string equality).

## 8. What this deliberately does not do

- No new syntax: everything is JSON with schemas (comments arrive via
  `"//"`-keys being tolerated and stripped at build, nothing more exotic).
- No UI changes in this phase. The workspace makes file authoring good; the
  planned instruments grid and algo×link matrix UI (separate proposal)
  layer on top and write these same files.
- No change to what the app/host page consume, to scenario files, or to
  PROFILE-AUTHORING.md's role as the authority on the compiled format.

## 9. Open questions for review

1. **Naming — RESOLVED: `links/`.** A "system" is the flat compiled
   artifact; the workspace entity is richer — a link with its own selector
   space (clients, routes) hanging under it. The compiled profile keeps the
   `systems` terminology unchanged.
2. Should `explode` become the _only_ supported migration, or do we also
   keep the single-file profile as a first-class authoring path forever?
   (Spec assumes: single-file remains supported and documented; workspace is
   recommended.)
3. Golden messages in the config repo: valuable, or too much churn per PR?
   (Spec makes them opt-in via a manifest flag.)
4. Per-link instrument universes (filter which instruments show per link)
   have come up implicitly — in scope for v1 or later? (Spec: later; note
   the `attrs`-based filtering design sketch reserved in §4.4.)

## 10. Milestones

| #   | Deliverable                                                                | Acceptance                                                                                              |
| --- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| W0  | Engine: option-level `convention` override (+ guide/schema updates)        | Client option switches identity tags in the annotated view with provenance; precedence tested           |
| W1  | Entity schemas + `build` (assemble, validate via engine, canonical output) | Demo profile re-expressed as a workspace builds byte-identical output; CI-tested like the authoring doc |
| W2  | BUILD-REPORT + semantic lint + `--check`                                   | Report matrix matches demo; seeded mistakes produce file+path errors                                    |
| W3  | `explain`, `init`, precompiled CLI into `internal-dist`                    | Office flow: clone → `node fixb.cjs build` with no npm                                                  |
| W4  | `explode` + goldens                                                        | Round-trip acceptance on the demo profile                                                               |
