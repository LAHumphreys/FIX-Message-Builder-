# Internal host page — setup guide

This guide is **self-contained** and written so an AI assistant (or a human)
can stand up the internal transport integration without reading the app's
source code. Expected effort: copy two files, fill three marked TODO blocks.

> Deploying for the first time? Follow the ordered checklist in
> [internal-host/QUICKSTART.md](internal-host/QUICKSTART.md) — it sequences
> these steps, ships parse-clean starter configs, and calls out the common
> time sinks. This document is the reference behind it.

## 1. What this is

The FIX Message Builder is a static app that **never makes network
requests** — that is a hard guarantee of the public build. Internal message
delivery therefore uses an **embedded host page**: a single HTML file that
lives in YOUR private repo / intranet, embeds the builder in an iframe, and
talks to it with `window.postMessage` (inter-window messaging, not network):

```
┌─ fix-builder-host.html (yours, intranet) ─────────────────┐
│  · loads work.profile.json + instruments.json             │
│  · deliver(request)  ←— YOUR fetch() to YOUR endpoint     │
│  ┌─ iframe: FIX Message Builder (public app) ───────────┐ │
│  │  builds messages · Send button · Transport log       │ │
│  └───────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

Why this shape: colleagues open **one bookmarkable URL** and get the profile,
instruments and a Send button with zero setup; your sender JavaScript is a
real file in your repo (proper editor, code review, git history); and the
public app keeps its zero-network privacy model intact.

## 2. Files to deploy

Copy the skeleton from the public repo and place it next to your config:

```
internal-tools/                       (any static file server)
├── fix-builder-host.html             ← docs/internal-host/fix-builder-host.html
├── work.profile.json                 ← your private profile
├── instruments.json                  ← your instrument DB (.json or .csv)
└── builder/                          ← recommended: a pinned copy of the app
    └── (contents of the app's built dist/)
```

The `builder/` copy is recommended (supply-chain hygiene, version pinning);
pointing `BUILDER_URL` at the public site also works if network policy
allows.

## 3. The three TODO blocks in the skeleton

1. **`BUILDER_URL`** — where the app is served (`'./builder/'` by default).
2. **`PROFILE_URL` / `INSTRUMENTS_URL` / `STARTER_SCENARIO_URL`** — paths of
   your config files. Any set to `null` is skipped; drag-drop inside the
   builder still works as a fallback.
3. **`deliver(request)`** — the only real code: make your HTTP call and
   return `{ ok, status, body }`. A commented `fetch` example is inline.
   Whatever you return (or throw) is displayed verbatim in the builder's
   Transport panel — include anything useful for debugging.

Everything else (handshake, config injection, response routing, origin
checks, error handling) is already written. **The skeleton works before any
TODO is filled**: sends fail with a clear "TODO: implement deliver()"
response, which proves the plumbing end-to-end.

## 4. The `deliver(request)` contract

The builder posts this for every send:

| Field                                           | Meaning                                                                            |
| ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| `requestId`                                     | Correlate the response (the skeleton handles this for you)                         |
| `system`                                        | System id selected in the builder (e.g. `"uat-east-2"`)                            |
| `systemLabel`                                   | Display label of that system                                                       |
| `transportHints`                                | The profile system's `transportHints` value, verbatim — put your routing keys here |
| `fixVersion`, `msgType`, `mode`, `scenarioName` | Context about what was built                                                       |
| `messages[]`                                    | One entry per message (a batch sends several)                                      |
| `messages[i].json`                              | The message rendered through the profile's JSON mapping                            |
| `messages[i].wire`                              | The same message as pipe-delimited tag=value (for eyeballing)                      |

Return value → Transport panel display:

```js
return { ok: true, status: 202, body: anythingJsonSerialisable };
// or signal failure:
return { ok: false, status: 500, body: errorDetails };
// or just throw — the error message is shown in red.
```

### Per-system routing

Give each system in the profile a `transportHints` object (any shape you
like — the builder never interprets it, and it inherits through `extends`):

```json
{
  "id": "uat-east-2",
  "label": "UAT East 2",
  "transportHints": { "route": "east-2", "queue": "uat" }
}
```

Then `deliver()` switches on `request.transportHints` (or `request.system`).
One host page handles every target server.

## 5. Testing checklist

1. Open the host page with the TODOs **unfilled**: the header should say
   "profile injected · ready" (or a clear config-load error), the builder
   should show your profile without any drag-drop, and pressing **Send**
   should produce a red "TODO: implement deliver()" entry in the Transport
   panel. That validates hosting, injection, and the bridge.
2. Fill `deliver()`; send again; the response body from your endpoint should
   appear in the Transport panel with status and timing.
3. Public reference of the whole flow with a fake echo endpoint:
   `<app-url>/host-demo.html` on the demo site — useful to compare against
   when something misbehaves.

## 6. Troubleshooting

| Symptom                              | Likely cause                                                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Header stuck on "starting…"          | `BUILDER_URL` wrong, or the app failed to load — check the iframe in devtools                                              |
| Builder loads but no profile appears | Config fetch failed (see header message): wrong `PROFILE_URL`, or your server doesn't serve JSON                           |
| Send button missing                  | The builder only shows the Transport panel when embedded in an iframe                                                      |
| Send button disabled                 | No host message received yet (handshake failed — check the browser console) or nothing built yet                           |
| Response never arrives               | `deliver()` neither resolved nor threw — add a timeout in your fetch                                                       |
| CORS errors in the console           | Your endpoint must allow the host page's origin (this is between your page and your endpoint; the builder is not involved) |

## 7. Security notes

- The builder only accepts messages from its embedding parent and pins the
  first origin that contacts it; the skeleton likewise checks the builder's
  origin. Keep both pages on trusted internal origins.
- The host page's own CSP/network policy governs `deliver()` — the builder's
  zero-network CSP applies only inside the iframe.
- Never put credentials in the profile; if your endpoint needs auth, handle
  it in the host page (e.g. same-origin session cookies).
