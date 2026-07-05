# Building a FIX Message Builder profile — complete authoring guide

This document is **self-contained**. It is written so that an AI assistant (or
a human) with **no access to the FIX Message Builder source code** can build a
correct, working profile from an environment specification (rules of
engagement, FIX spec documents, onboarding guides). Follow it top to bottom.

> Maintainers: every `json` code block in this file is parsed by the real
> profile loader in CI (`src/engine/profile/authoringDoc.test.ts`), so the
> examples cannot drift from the implementation. If you change the profile
> format, this document must be updated for the build to stay green.

---

## 1. Context: what you are building

**FIX Message Builder** is a static web app that composes FIX protocol test
messages. The app itself is generic — it knows nothing about any specific
trading environment. All environment knowledge lives in **three kinds of JSON
files that you will produce**:

| File              | Contains                                                                | Typical name        |
| ----------------- | ----------------------------------------------------------------------- | ------------------- |
| **Profile**       | Systems, routing, flows/algos, custom tags, generators, output mappings | `work.profile.json` |
| **Instrument DB** | Tradable instruments and their identifiers (JSON or CSV)                | `instruments.json`  |
| **Scenarios**     | Saved builder states (produced by the app; you rarely author these)     | `*.scenario.json`   |

The user loads these files into the app by drag-and-drop. **Nothing is
uploaded anywhere** — the app makes zero network requests — but these files
contain proprietary environment details, so they must live only in the
private internal repository, never in anything public.

### Vocabulary you need

- **Tag** — a FIX field number, e.g. `38` is OrderQty. Custom/bespoke tags are
  usually ≥ 5000 (e.g. `7001`, `20101`).
- **Fragment** — an ordered list of operations that set/remove fields on the
  message being built. Profiles are mostly made of fragments.
- **Slot** — a user-editable input declared by a fragment (quantity, price,
  side…). Slots become form fields in the app.
- **System** — one target box/gateway (a dev or UAT deployment). The user
  picks a system first; it drives routing fields and what flows are available.
- **Flow** — one kind of order (plain limit, an algo, a basket…). Flows are
  options in a "dimension" (a dropdown).
- **Generator** — a value produced at build time (ClOrdID sequences,
  timestamps).
- **Identity convention** — the rule for turning an instrument record into
  FIX tags (ISIN in 48/22? symbol in 55? strike in 202?). Systems reference
  a convention by name.

### The merge model (why fragment order does not matter much)

When the user builds a message, fragments apply in this **fixed stage order**
(you cannot change it, and you don't need to):

```
1. template   – base fields for the message type (ClOrdID generator, HandlInst…)
2. system     – the selected system's session/routing fragments
3. dimension  – the selected flow option's fragment
4. instrument – tags synthesized from the selected instrument + convention
5. extra      – (ad-hoc, not profile-driven)
6. slots      – slot defaults, then the user's typed values
7. final      – the system's "finalFragment" — ALWAYS WINS, cannot be overridden
```

Later stages overwrite earlier ones (the app records and displays every
overwrite). Put **enforced routing fields in `finalFragment`** so nothing can
clobber them.

---

## 2. Information to extract from the environment documents FIRST

Before writing any JSON, extract these facts from the RoE / spec documents.
If a fact is missing, ask the user rather than guessing.

**Per target system (one entry per box/gateway):**

- [ ] A short id (lowercase, hyphenated, e.g. `uat-east-2`) and display label
- [ ] SenderCompID(49) / TargetCompID(56) values (and 115/116/128/50/57 if used)
- [ ] Any bespoke routing tags this box requires (tag numbers AND values)
- [ ] Which routing fields are _mandatory and must never be overridden_
      → these go in the `finalFragment`
- [ ] Which flows/algos are actually deployed on this box → capability tags
- [ ] Which instrument identifier style this box expects (ISIN? house code?
      symbol+exchange? decomposed option tags or a composed code?)
- [ ] Any non-standard FIX interpretation (extra enum values, repurposed tags,
      different tag numbers for the same algo)

**Per flow/algo:**

- [ ] The MsgType it produces (usually `D`; lists are `E`, multileg `AB`)
- [ ] Every custom tag: number, name, type (int/qty/price/char/string/bool),
      and enum values with meanings
- [ ] Which parameters the tester should be able to edit (→ slots), their
      defaults, and which are required
- [ ] Which parameters are fixed constants (→ plain `set` ops)
- [ ] Which systems support this flow (→ `availableOn`)

**Global:**

- [ ] FIX version(s): `FIX.4.2`, `FIX.4.4`, or `FIX.5.0SP2`
- [ ] ClOrdID format convention (e.g. `DESK-20260705-0001`)
- [ ] Timestamp precision (seconds / millis / micros)
- [ ] The downstream JSON format if one exists (key names, group shape,
      envelope fields) → the `renderers.json` mapping
- [ ] Identifier schemes present in instrument reference data (ISIN, RIC,
      exchange symbol, house codes) and per-system requirements

---

## 3. File skeleton — start from this

Create `work.profile.json` starting from this skeleton and fill it in section
by section (§4–§11 below explain every part):

```json
{
  "schemaVersion": 1,
  "name": "REPLACE — environment name",
  "version": "1.0.0",
  "fixVersion": "FIX.4.4",
  "dictionaryOverlay": { "fields": {} },
  "generators": {},
  "conventions": {},
  "fragments": {},
  "templates": {},
  "systems": [],
  "dimensions": [],
  "renderers": { "json": {} },
  "validationPolicy": {}
}
```

**Golden rules (read twice):**

1. **Tags are JSON numbers inside fragment ops** (`"tag": 7001`) but **JSON
   string keys** in `dictionaryOverlay.fields` (`"7001": …`) and in slot
   defaults maps. Getting this wrong is the #1 mistake.
2. **All field VALUES are strings**, even numeric ones: `"value": "100"`,
   never `"value": 100`.
3. Every id you reference (fragment names, generator names, convention names,
   system ids) must exactly match an id you defined. The app reports unknown
   references with a JSON path like `/systems/2/fragments` — fix them all.
4. **Declare every custom tag** you use in `dictionaryOverlay.fields`.
   Undeclared tags still render (nothing ever blocks) but show
   "unknown tag" findings and lose their names/enum labels in the UI.
5. Never invent tag numbers or enum values — copy them from the environment
   documents exactly.

---

## 4. `dictionaryOverlay` — declare custom tags and local quirks

Every bespoke tag gets an entry. Two forms:

**Tuple form** (define a new tag): `[name, type, enums?]`

```json
"dictionaryOverlay": {
  "fields": {
    "7001": ["AlgoStyle", "INT", { "1": "TWAP", "2": "VWAP", "3": "POV" }],
    "7002": ["SliceQty", "QTY"],
    "7010": ["Level1Qty", "QTY"],
    "7011": ["Level2Qty", "QTY"],
    "20101": ["GatewayRoute", "STRING"]
  }
}
```

Valid `type` values (affects validation + JSON number conversion):
`STRING`, `CHAR`, `INT`, `QTY`, `PRICE`, `FLOAT`, `AMT`, `BOOLEAN` (Y/N),
`UTCTIMESTAMP`, `MONTHYEAR`, `NUMINGROUP`, `EXCHANGE`, `CURRENCY`.
When unsure use `STRING`.

**Patch form** (modify an existing standard tag — e.g. a venue that added a
non-standard enum value):

```json
"dictionaryOverlay": {
  "fields": {
    "59": { "enums": { "X": "At Venue Close" }, "enumMode": "merge" }
  }
}
```

`"enumMode": "merge"` keeps the standard values and adds yours;
`"replace"` throws the standard list away.

A **system** can also carry its own `dictionaryOverlay` with the same shape —
use that when only one box interprets a tag differently. Resolution order is:
standard dictionary → profile overlay → system overlay.

---

## 5. `generators` — runtime values

```json
"generators": {
  "clOrdId":      { "kind": "template", "template": "DESK-{date:yyyyMMdd}-{seq:4}" },
  "transactTime": { "kind": "timestamp", "precision": "micros" },
  "sendingTime":  { "kind": "timestamp", "precision": "micros" },
  "listId":       { "kind": "shared", "of": "listIdValue" },
  "listIdValue":  { "kind": "template", "template": "L{date:yyyyMMdd}-{rand:4}" },
  "token":        { "kind": "random", "style": "hex", "length": 8 }
}
```

The five kinds:

| kind        | Fields                                                                | Produces                                                                                                                          |
| ----------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `template`  | `template` with `{date:yyyyMMdd}` `{seq:4}` `{rand:8}`                | Interpolated string; `{seq:N}` counts up per batch, zero-padded to N                                                              |
| `timestamp` | `precision`: `"seconds"` \| `"millis"` \| `"micros"`                  | FIX UTC timestamp `YYYYMMDD-HH:MM:SS[.ffffff]`                                                                                    |
| `sequence`  | `scope`: `"message"` \| `"batch"` \| `"persistent"`, `start?`, `pad?` | A counter                                                                                                                         |
| `shared`    | `of`: another generator name                                          | Evaluates `of` ONCE per batch; every message in the batch gets the same value (this is how all orders in a basket share a ListID) |
| `random`    | `style`: `"hex"` \| `"uuid"`, `length?`                               | Random token                                                                                                                      |

Sequence scopes: `message` resets per message; `batch` counts 1,2,3 across
the rows of one batch (ClOrdID-1..N); `persistent` keeps counting across
builds in one browser session.

---

## 6. `fragments` — the building blocks

A fragment is `{ "label": "...", "ops": [...] }`. The five op types:

```json
[
  { "op": "set", "tag": 40, "value": "2" },
  { "op": "setGenerated", "tag": 11, "generator": "clOrdId" },
  {
    "op": "slot",
    "tag": 38,
    "slot": { "tag": 38, "label": "Quantity", "type": "decimal", "required": true }
  },
  { "op": "remove", "tag": 21 },
  {
    "op": "group",
    "countTag": 957,
    "mode": "append",
    "entries": [[{ "op": "set", "tag": 958, "value": "ParamName" }]]
  }
]
```

- `set` — a fixed constant.
- `setGenerated` — value from a generator (§5) at build time.
- `slot` — a user-editable form field (§7). The slot op itself sets nothing;
  it declares the input.
- `remove` — strips a tag set by an earlier stage (e.g. the base template
  sets HandlInst but this venue rejects it).
- `group` — emits a repeating group. `entries` is an array of entries; each
  entry is an array of ops (normally `set`/`setGenerated`). `mode: "append"`
  adds entries to an existing group; `"replace"` swaps the whole group.

### Slot spec fields (§7 in detail)

```json
{
  "tag": 7001,
  "label": "Algo style",
  "type": "enum",
  "enumSource": { "kind": "dictionary" },
  "default": "1",
  "required": true
}
```

| Field              | Meaning                                                                                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`             | `"string"` \| `"int"` \| `"decimal"` \| `"enum"` \| `"timestamp"` \| `"bool"`                                                                                                             |
| `enumSource`       | For `enum` slots: `{"kind":"dictionary"}` uses the enum values declared for that tag in the dictionary/overlay (preferred), or `{"kind":"inline","values":[{"value":"1","label":"Low"}]}` |
| `default`          | Literal default applied when the user leaves the field empty                                                                                                                              |
| `generatorDefault` | Generator name evaluated as the default (mutually exclusive intent with `default`; if both set, `generatorDefault` wins)                                                                  |
| `required`         | `true` → missing value shows a warning (never blocks)                                                                                                                                     |

### Algo parameter patterns — INCLUDING LEVEL PARAMETERS

**Pattern A — a "level" is one enum field** (aggression 1–5 in a single tag):

```json
{
  "op": "slot",
  "tag": 7005,
  "slot": {
    "tag": 7005,
    "label": "Aggression level",
    "type": "enum",
    "enumSource": { "kind": "dictionary" },
    "default": "3"
  }
}
```

(and declare `"7005": ["AggressionLevel", "INT", {"1":"Passive", ... }]` in
the overlay).

**Pattern B — distinct tags per level** (`Level1Qty`, `Level2Qty`, …). This is
the RECOMMENDED shape whenever the venue defines separate tag numbers per
level — each level is just another slot:

```json
[
  {
    "op": "slot",
    "tag": 7010,
    "slot": { "tag": 7010, "label": "Level 1 qty", "type": "decimal", "required": true }
  },
  { "op": "slot", "tag": 7011, "slot": { "tag": 7011, "label": "Level 2 qty", "type": "decimal" } },
  { "op": "slot", "tag": 7012, "slot": { "tag": 7012, "label": "Level 3 qty", "type": "decimal" } }
]
```

Optional levels: mark only level 1 `required`; leave the rest optional with
no default — an empty optional slot emits **no tag at all**.

**Pattern C — levels as a repeating group** (e.g. the standard strategy-
parameters group 957/958/959/960, or a bespoke per-level group).
LIMITATION: the form can NOT currently edit values inside group entries or
add/remove entries interactively. Two working approaches:

- **C1 (fixed presets):** hard-code the group in the fragment with `set` ops:

  ```json
  {
    "op": "group",
    "countTag": 957,
    "mode": "replace",
    "entries": [
      [
        { "op": "set", "tag": 958, "value": "Style" },
        { "op": "set", "tag": 959, "value": "1" },
        { "op": "set", "tag": 960, "value": "TWAP" }
      ],
      [
        { "op": "set", "tag": 958, "value": "MaxPct" },
        { "op": "set", "tag": 959, "value": "6" },
        { "op": "set", "tag": 960, "value": "25" }
      ]
    ]
  }
  ```

- **C2 (one flow option per level count):** define `algo-2-level` and
  `algo-3-level` as separate dimension options, each a fragment with the
  right number of preset entries and/or distinct-tag slots. The user picks
  the variant instead of adding rows.

Prefer B; fall back to C1/C2 for true repeating groups.

### Conditionally-required parameters (GTD expiry and similar)

When an enum choice implies extra fields (the classic case: TimeInForce
`59=6` "Good Till Date" needs `ExpireDate(432)` or `ExpireTime(126)`), give
the flow the dependent slots as OPTIONAL fields so the user can fill either:

```json
[
  { "op": "set", "tag": 59, "value": "6" },
  {
    "op": "slot",
    "tag": 432,
    "slot": {
      "tag": 432,
      "label": "Expire date (YYYYMMDD)",
      "type": "string",
      "pattern": "^\\d{8}$"
    }
  },
  {
    "op": "slot",
    "tag": 126,
    "slot": { "tag": 126, "label": "Expire time (UTC, YYYYMMDD-HH:MM:SS)", "type": "timestamp" }
  }
]
```

Prefer a dedicated flow option ("Limit GTD") that hard-sets the TIF and
carries its dependent slots, over adding rarely-used slots to every flow.
The app has a built-in `conditional-required` validation rule for the
standard 59=6 case: picking Good Till Date anywhere without 432/126 shows a
warning (mutable via the validation policy like any rule). Empty optional
slots emit no tag, so unused expiry fields never pollute the message.

### Order types in basket/list flows

In `batch` and `list` modes every slot becomes a **grid column** with
per-row overrides, and an **empty cell emits no tag at all** (an explicitly
blanked cell also suppresses the shared value). So to let one basket mix
market/limit/stop rows, make OrdType(40) a slot and its price parameters
optional slots:

```json
[
  { "op": "setGenerated", "tag": 66, "generator": "listId" },
  {
    "op": "slot",
    "tag": 54,
    "slot": {
      "tag": 54,
      "label": "Side",
      "type": "enum",
      "enumSource": { "kind": "dictionary" },
      "required": true,
      "default": "1"
    }
  },
  {
    "op": "slot",
    "tag": 38,
    "slot": { "tag": 38, "label": "Quantity", "type": "decimal", "required": true }
  },
  {
    "op": "slot",
    "tag": 40,
    "slot": {
      "tag": 40,
      "label": "Order type",
      "type": "enum",
      "enumSource": { "kind": "dictionary" },
      "required": true,
      "default": "2"
    }
  },
  { "op": "slot", "tag": 44, "slot": { "tag": 44, "label": "Limit price", "type": "decimal" } },
  { "op": "slot", "tag": 99, "slot": { "tag": 99, "label": "Stop price", "type": "decimal" } }
]
```

Usage: the shared parameter form sets the defaults (e.g. `40=2`); a market
row overrides its Order type cell to `1` and leaves the price cells empty —
no 44/99 tags are emitted for that row. TIP: for parameters that vary per
row, leave the SHARED field empty and fill only the rows that need it.

Alternative for whole-basket order types: declare a second `options`
dimension ("Order type") whose option fragments set 40 and declare the
associated slots — dimension fragments compose with the flow fragment in
declaration order. Per-row mixing still needs the slot-column approach:

```jsonc
// sketch — combine with the flow dimension from §9
{
  "id": "ordertype",
  "label": "Order type",
  "kind": "options",
  "options": [
    { "id": "limit", "label": "Limit", "fragment": "ot-limit" },
    { "id": "stop-limit", "label": "Stop limit", "fragment": "ot-stop-limit" },
  ],
}
```

---

## 7. `templates` — base message boilerplate

`templates` maps a MsgType to a fragment applied first (stage 1):

```json
"templates": { "D": "tmpl-new-order", "E:entry": "tmpl-list-entry" },
"fragments": {
  "tmpl-new-order": {
    "label": "NewOrderSingle base",
    "ops": [
      { "op": "setGenerated", "tag": 11, "generator": "clOrdId" },
      { "op": "set", "tag": 21, "value": "1" },
      { "op": "setGenerated", "tag": 60, "generator": "transactTime" }
    ]
  },
  "tmpl-list-entry": {
    "label": "List entry base",
    "ops": [
      { "op": "setGenerated", "tag": 11, "generator": "clOrdId" },
      { "op": "set", "tag": 21, "value": "1" }
    ]
  }
}
```

The special key **`E:entry`** is the per-order boilerplate used inside the
NoOrders group when building 35=E lists. Define it if the environment uses
list orders.

---

## 8. `systems` — the target-system registry

One entry per box. Example pair showing **inheritance**:

```json
"systems": [
  {
    "id": "east-uat",
    "label": "EAST-UAT",
    "fragments": ["session-east"],
    "finalFragment": "final-east-uat",
    "capabilities": ["algo-x", "lists"],
    "convention": "isin-decomposed"
  },
  {
    "id": "east-dev",
    "label": "EAST-DEV",
    "extends": "east-uat",
    "finalFragment": "final-east-dev",
    "capabilities": ["lists"]
  }
]
```

**`extends` rules (exactly one level, no chains):** a property you SET
replaces the parent's wholesale; a property you OMIT is inherited. In the
example, `east-dev` inherits `fragments` and `convention` but has its own
`finalFragment` and its own (smaller) `capabilities` list — note that
capabilities do NOT merge: list every capability the child has.

- `fragments` — session/routing fragment ids applied at stage 2. Put 49/56,
  MsgSeqNum, SendingTime, desk codes here.
- `finalFragment` — ONE fragment id applied last (stage 7). Put the enforced
  routing tags here; nothing can override them.
- `capabilities` — free-form tags (`"algo-x"`, `"lists"`, `"multileg"`,
  `"futures"`…). They exist only to be matched by `availableOn` (§9).
- `convention` — name of an identity convention (§10).
- `dictionaryOverlay` — per-box tag quirks (same format as §4).
- `validationPolicy` — per-box rule muting (§12).
- `transportHints` — optional, any JSON shape: per-system routing data for
  the internal send integration (see the repo's docs/INTERNAL-HOST.md). The
  builder never interprets it; it is handed verbatim to the internal host
  page with every send. Inherits through `extends` like other properties.

---

## 9. `dimensions` — the selector dropdowns

The target system is always the implicit first selector. Declare the rest:

```json
"dimensions": [
  {
    "id": "flow",
    "label": "Flow",
    "kind": "options",
    "required": true,
    "options": [
      { "id": "limit", "label": "Plain limit", "fragment": "flow-limit", "msgType": "D" },
      { "id": "algo-x", "label": "Algo X", "fragment": "flow-algo-x", "msgType": "D",
        "availableOn": ["cap:algo-x"] },
      { "id": "basket", "label": "Basket", "fragment": "flow-basket", "msgType": "D",
        "modes": ["batch", "list"], "availableOn": ["cap:lists"] },
      { "id": "multileg", "label": "Multileg", "fragment": "flow-multileg", "msgType": "AB",
        "modes": ["multileg"], "availableOn": ["cap:multileg"] }
    ]
  },
  { "id": "instrument", "label": "Instrument", "kind": "instrument", "required": true }
]
```

- `kind: "options"` → dropdown of the declared options.
  `kind: "instrument"` → typeahead over the instrument DB (no `options`).
- `availableOn` — array of system ids and/or `"cap:<tag>"` tokens, OR
  semantics. **Absent = available everywhere.** Unavailable options stay
  visible but selecting them produces a warning (useful for retargeting
  tests) — they are not hidden.
- `msgType` — the MsgType(35) this option builds (default `D`).
- `modes` — which build modes the option supports, first is the default:
  `"single"`, `"batch"` (N independent messages), `"list"` (one 35=E),
  `"multileg"` (one 35=AB from a strategy record).
- You may add more dimensions (e.g. a "route" or "account" dimension with
  options); each selected option's fragment applies at stage 3 in the order
  the dimensions are declared.

---

## 10. `conventions` — instrument identity

A convention maps an instrument record (§13) to FIX tags. Systems reference
one by name. A convention has `variants` tried in order; the first whose
`when` matches the record wins, so put special cases (options, futures)
FIRST and the catch-all LAST.

```json
"conventions": {
  "isin-decomposed": {
    "variants": [
      {
        "when": { "securityType": ["OPT"] },
        "emit": [
          { "role": "symbol",            "from": { "scheme": "exchangeSymbol" }, "required": true },
          { "role": "securityType",      "from": { "attr": "securityType" } },
          { "role": "maturityMonthYear", "from": { "attr": "maturityMonthYear" }, "required": true },
          { "role": "strikePrice",       "from": { "attr": "strikePrice" }, "required": true },
          { "role": "putOrCall",         "from": { "attr": "putOrCall" }, "required": true }
        ]
      },
      {
        "emit": [
          { "role": "securityId",       "from": { "scheme": "isin" }, "required": true },
          { "role": "securityIdSource", "from": { "literal": "4" } },
          { "role": "symbol",           "from": { "firstOf": [ { "scheme": "exchangeSymbol" }, { "scheme": "isin" } ] } },
          { "role": "securityExchange", "from": { "attr": "mic" } },
          { "role": "securityType",     "from": { "attr": "securityType" } }
        ],
        "altIds": [ { "from": { "scheme": "exchangeSymbol" }, "sourceCode": "8" } ]
      }
    ]
  },
  "house-composed": {
    "variants": [
      {
        "emit": [
          { "role": "securityId",       "from": { "scheme": "custom:house" }, "required": true },
          { "role": "securityIdSource", "from": { "literal": "8" } },
          { "role": "symbol",           "from": { "firstOf": [ { "scheme": "custom:house" }, { "scheme": "exchangeSymbol" } ] } }
        ]
      }
    ]
  }
}
```

**Roles** are abstract; the app maps them to the right tag for the context
(top-level order / multileg leg / underlying). Do NOT write tag numbers here:

| role               | order tag | leg tag | role                 | order tag | leg tag |
| ------------------ | --------- | ------- | -------------------- | --------- | ------- |
| `symbol`           | 55        | 600     | `maturityMonthYear`  | 200       | 610     |
| `securityId`       | 48        | 602     | `maturityDate`       | 541       | 611     |
| `securityIdSource` | 22        | 603     | `strikePrice`        | 202       | 612     |
| `securityType`     | 167       | 609     | `putOrCall`          | 201       | 1358    |
| `securityExchange` | 207       | 616     | `optAttribute`       | 206       | 613     |
| `cfiCode`          | 461       | 608     | `contractMultiplier` | 231       | 614     |
| `currency`         | 15        | 556     | `securitySubType`    | 762       | 764     |

**Sources** (`from`): `{"scheme": "isin"}` reads an identifier from the
record's `schemes` map; `{"attr": "strikePrice"}` reads a typed attribute;
`{"literal": "4"}` is a constant; `{"firstOf": [ ... ]}` is a fallback chain.
`required: true` → a missing value shows a warning (the message still
renders). `altIds` emits the SecurityAltID repeating group (454/455/456);
`sourceCode` is the SecurityAltIDSource(456) value.

Common SecurityIDSource(22) values: `1`=CUSIP, `2`=SEDOL, `4`=ISIN,
`5`=RIC, `8`=Exchange symbol, `A`=Bloomberg.

---

## 11. `renderers.json` — the downstream JSON format

If the environment has an in-house JSON representation, encode it here so
exports match it exactly:

```json
"renderers": {
  "json": {
    "gateway-format": {
      "keyStyle": "name",
      "groupKey": "countName",
      "emitCounts": false,
      "typedValues": true,
      "omitTags": [8, 9, 10, 34, 49, 52, 56],
      "envelope": { "message": { "target": "gateway" }, "messageKey": "order" }
    }
  }
}
```

| Option        | Values                                                                      | Meaning                                                                              |
| ------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `keyStyle`    | `"name"` \| `"tag"` \| `{"alias": {"38": "qty"}}`                           | Object keys: dictionary names, tag numbers, or custom map (alias falls back to name) |
| `groupKey`    | `"countName"` \| `"countTag"` \| `{"alias": {...}}`                         | Key of the array holding group entries                                               |
| `emitCounts`  | boolean                                                                     | Also emit the count field next to the array                                          |
| `typedValues` | boolean                                                                     | Numbers/booleans as JSON types where the dictionary type allows                      |
| `omitTags`    | number[]                                                                    | Tags the consumer supplies itself (headers etc.)                                     |
| `envelope`    | `{ "message": {static fields}, "messageKey": "...", "topLevelKey": "..." }` | Per-message wrapper / whole-batch wrapper                                            |

You may define several mappings; the user picks one in the UI.

---

## 12. `validationPolicy` — muting known quirks

Severities: `"error"`, `"warning"`, `"info"`, `"off"`. Rule ids:
`required-missing`, `unknown-tag`, `enum-unknown`, `type-mismatch`,
`group-count-mismatch`, `group-field-order`, `header-trailer-order`,
`duplicate-tag`.

```json
"validationPolicy": {
  "rules": { "unknown-tag": "info" },
  "overrides": [
    { "rule": "enum-unknown", "tag": 59, "severity": "off" },
    { "rule": "required-missing", "msgType": "D", "tag": 21, "severity": "off" }
  ]
}
```

A system's own `validationPolicy` (same shape) layers on top for that box
only. Use overrides to encode "yes, we know tag X is weird here". Nothing is
ever blocked either way — severities only change the badges.

---

## 13. The instrument database (separate file)

JSON form:

```json
{
  "schemaVersion": 1,
  "instruments": [
    {
      "key": "UNIQUE-KEY",
      "name": "Display Name",
      "schemes": { "isin": "…", "exchangeSymbol": "…", "custom:house": "…" },
      "attrs": { "securityType": "CS", "currency": "GBP", "mic": "XLON" }
    }
  ],
  "strategies": [
    {
      "key": "SPREAD-1",
      "name": "Calendar Spread",
      "strategyType": "CS",
      "schemes": { "custom:house": "…" },
      "attrs": { "securityType": "MLEG" },
      "legs": [
        { "instrument": "FUT-NEAR", "ratioQty": "1", "side": "1" },
        { "instrument": "FUT-FAR", "ratioQty": "1", "side": "2" }
      ]
    }
  ]
}
```

- `schemes` keys are free-form; they just have to match what the conventions
  reference (`isin`, `exchangeSymbol`, `ric`, `custom:<anything>`).
- Useful `attrs` (all string values): `securityType` (CS/FUT/OPT/MLEG…),
  `currency`, `mic`, `cfiCode`, `maturityMonthYear` (`YYYYMM`, `YYYYMMDD`,
  or weekly `YYYYMMwN`), `maturityDate`, `strikePrice`, `putOrCall`
  (`0`=put `1`=call), `optAttribute`, `contractMultiplier`, `underlying`
  (another record's key). Extra attrs are allowed.
- Strategy legs: `side` is LegSide(624): `1`=buy `2`=sell; `ratioQty` is
  LegRatioQty(623); optional `price` is LegPrice(566).

**CSV form** is also accepted (typical for reference-data exports). Header
row maps columns by prefix: `key`, `name`, `scheme:<schemeName>`,
`attr:<attrName>`:

```csv
key,name,scheme:isin,scheme:exchangeSymbol,attr:securityType,attr:currency,attr:mic
ACME,Acme Corp,GB0000000001,ACME,CS,GBP,XLON
```

(Strategies are JSON-only.)

---

## 14. Recommended build order

Work in this order; each step produces something loadable and checkable:

1. **Skeleton + one system + session fragment + finalFragment.** Load it —
   the app shows the profile card and the system dropdown.
2. **`templates.D` + generators** (clOrdId, timestamps). The app now builds a
   minimal message.
3. **One simple flow** (plain limit with Side/Qty/Price/TIF slots) in a
   `flow` dimension.
4. **`dictionaryOverlay`** for every custom tag the flows will use.
5. **Remaining flows/algos**, with `availableOn` capability gating.
6. **Remaining systems** (use `extends` for near-identical boxes; deltas
   only).
7. **Conventions + the `instrument` dimension + the instrument DB file.**
8. **`renderers.json` mapping** matched against a real sample of the
   downstream format if one is available.
9. **`validationPolicy`** last — only after seeing which findings are
   genuinely known quirks.

---

## 15. How to verify your work

1. **JSON-validate**: the repo ships JSON Schemas —
   `docs/schemas/profile.schema.json`, `instruments.schema.json`,
   `scenario.schema.json`. Add to the top of your file for IDE checking:
   `"$schema": "./docs/schemas/profile.schema.json"` (adjust the path), or
   run any JSON Schema validator.
2. **Load it in the app** (drag the file in). The Workspace panel lists
   every structural problem with a precise path like
   `/fragments/flow-x/ops/3: setGenerated op needs a generator reference`.
   An error-free load shows the profile card with name/version/system count.
3. **Build one message per flow per system** and read the Findings panel:
   - `unknown tag NNN` → you forgot a `dictionaryOverlay.fields` entry.
   - `selection 'x' does not exist` / `unknown fragment 'y'` → an id
     reference is misspelled.
   - `no value for <role>` on instruments → the record lacks a scheme/attr
     the convention requires (fix the record, or the convention, or accept
     the warning if the data is genuinely absent).
4. **Check the annotated view**: every field shows which fragment set it —
   confirm the enforced routing tags say they came from the final fragment.
5. **Check the JSON tab** against a known-good sample of the downstream
   format, byte for byte if possible.

Findings never block rendering, so a profile with warnings is still usable —
but a clean demo build should show zero findings.

---

## 16. Common mistakes (check each one before finishing)

| Mistake                                                        | Symptom                                                                                 |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Tag as string in ops (`"tag": "7001"`)                         | Load error: "op needs a numeric tag"                                                    |
| Tag as number key in overlay (`7001:` without quotes)          | Invalid JSON                                                                            |
| Numeric value not quoted (`"value": 100`)                      | Load error: "set op needs a string value"                                               |
| Custom tag used but not declared in the overlay                | "unknown tag" findings; no name in the UI                                               |
| Fragment/generator/convention id typo                          | Warning with the exact JSON path — fix the reference                                    |
| `extends` chains (A→B→C)                                       | Warning; only one level is supported                                                    |
| Expecting child `capabilities` to add to the parent's          | They replace — list the full set on the child                                           |
| Enforced routing in a flow fragment instead of `finalFragment` | User slot values can override it                                                        |
| Slot for a repeating-group member (pattern C)                  | The slot edits a top-level tag, not the group entry — use patterns B/C1/C2              |
| Tag numbers in convention `emit` roles                         | Not valid — use role names from the table in §10                                        |
| Real credentials/passwords in the profile                      | Never include them; the profile is for message CONTENT only — there is no session layer |

---

## 17. Scope and safety notes for the authoring assistant

- Output ONLY the JSON files (plus notes on anything ambiguous). Do not
  attempt to modify the FIX Message Builder app itself.
- Copy tag numbers, enum values, CompIDs, and routing values **exactly** from
  the environment documents. Do not infer or invent values. Where the
  documents are ambiguous or silent, emit the field with a `TODO` value and
  list the open question at the end instead of guessing.
- The profile describes **test message content**. It must never contain
  passwords, API keys, certificates, or production credentials of any kind.
- These files are proprietary. They belong in the private internal
  repository only.
