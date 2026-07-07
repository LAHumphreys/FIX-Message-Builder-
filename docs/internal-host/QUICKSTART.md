# Internal deployment quickstart

An ordered checklist for standing up the internal FIX Message Builder on a
static web server. Everything here is generic — environment specifics
(endpoints, session IDs, instrument universes) stay in your private repo and
your head. Full background: [../INTERNAL-HOST.md](../INTERNAL-HOST.md).

**Target layout on the static server** (any subdirectory works):

```
…/fix-builder/
  index.html                ← fix-builder-host.html, renamed (the page people bookmark)
  starter.profile.json      ← placeholder config, replaced in step 4
  starter.instruments.json
  builder/                  ← the built app (index.html + assets/…)
```

## Step 0 — what you need to hand (5 min)

- [ ] Write access to a path on an internal static web server.
- [ ] The internal endpoint's URL + request shape (whatever your Ajax call
      needs). You don't need it until step 3 — steps 1–2 work without it.
- [ ] A clone of this repo.

## Step 1 — get the built app onto the server (10 min)

The app is a static bundle; no server-side anything.

- **Option A — prebuilt bundle** (no Node required): if the repo has an
  `internal-dist` branch, it contains exactly the target layout above.
  `git clone -b internal-dist --depth 1 <repo-url>`, copy the folder to the
  server, done — skip to step 2.
- **Option B — build it yourself** (needs Node 22 + npm registry access):

  ```sh
  npm ci
  npx vite build --base=./        # relative paths → works from any directory
  ```

  Copy `dist/` to `…/fix-builder/builder/`, then copy
  `docs/internal-host/fix-builder-host.html` to `…/fix-builder/index.html`
  and `docs/internal-host/starter.*.json` alongside it.

**Local preview — no web server needed.** The `internal-dist` checkout runs
as-is from your laptop: open the folder in WebStorm/IntelliJ and click the
browser icon on `index.html` (the IDE's built-in server at
`localhost:63342` serves it), or run any one-liner static server
(`python -m http.server`) in the folder. Everything below — config
injection, sends, the fixb workflow, attaching a source folder for live
preview — works identically on `localhost`; only `deliver()` may need the
real intranet origin. Plain double-click (`file://`) is the one thing that
does _not_ work: browsers block the page from fetching the profile JSON, so
the builder loads but starts empty (drag-drop still works).

## Step 2 — prove the plumbing before configuring anything (5 min)

Open `…/fix-builder/` in a browser. **Unmodified**, the page must already:

- [ ] Show the builder with the header status "profile injected · ready".
- [ ] Have the placeholder "RENAME ME — Internal Starter" profile loaded
      (workspace card, one Limit flow, two placeholder instruments).
- [ ] Compose a message: pick the Limit flow, type a quantity — tag=value
      output appears.
- [ ] **Send fails loudly and correctly**: press ⇪ Send; the Transport panel
      must log an error entry saying `TODO: implement deliver()…`.

That error is the success criterion — it proves iframe, config injection,
send, and response routing all work on your infrastructure before you've
written a line. If any box fails, fix hosting first (see troubleshooting in
[../INTERNAL-HOST.md](../INTERNAL-HOST.md)); nothing later will be easier.

## Step 3 — implement `deliver()` (15–30 min, the only code)

In your copied `index.html`, fill TODO 3: one async function that takes the
send payload and performs your Ajax call. A commented `fetch` example is in
place. Notes:

- It runs in the **host page**, so the request originates from your intranet
  origin — the builder's zero-network CSP does not apply to it.
- If the endpoint is on a **different origin** than the static server, the
  endpoint must send CORS headers (or put the page on the same origin).
  Check this early — it is the most common time sink (see below).
- Whatever you return (`{ ok, status, body }`) renders in the Transport
  panel — return the raw endpoint response while debugging.

- [ ] Send from the starter profile reaches the endpoint and the response
      shows in the Transport log (even an HTTP 4xx proves connectivity).

## Step 4 — build the real profile (the long pole — start it first thing)

This is the copilot task. Kick it off **before** doing steps 1–3 so it runs
in parallel:

- [ ] Give your internal copilot: `docs/PROFILE-AUTHORING.md` (self-contained,
      no codebase access needed), the RoE/interface documents, and
      `starter.profile.json` as the file to grow — it already parses and
      renders, so every edit can be verified immediately.
- [ ] Iterate with drag-drop: drop the work-in-progress profile onto the
      builder's Workspace panel — load errors appear with exact JSON paths;
      the message output updates live. No redeploy needed per iteration.
- [ ] When stable, copy it to the server as `work.profile.json` (+ your
      instruments file) and update TODO 2 to point at them.
- [ ] Keep both files in your **private** repo. Nothing environment-specific
      ever goes in the public one.

## Step 5 — rollout (5 min)

- [ ] Send colleagues the one URL. First visit shows the loaded profile and
      a working Send — no file-picking, nothing to install.
- [ ] Optional: preload a demo `*.scenario.json` (TODO 2) so first-timers
      land on a fully-formed example order.

## Known time sinks, pre-mitigated

| Risk                                                             | Mitigation                                                                                                                  |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| No Node/npm on office machines, or npm registry blocked by proxy | Option A prebuilt bundle — deployment is clone + copy                                                                       |
| Weak copilot producing a profile that never loads                | Starter profile that already works + CI-tested authoring guide + path-precise load errors in the UI; grow, don't greenfield |
| CORS between static server and endpoint discovered late          | Step 3 flags it; test with the starter profile's send before the real profile exists                                        |
| "Is it broken or misconfigured?" ambiguity                       | Step 2's unmodified-page checklist separates hosting problems from config problems                                          |
| Mixed content (https page → http endpoint) silently blocked      | Serve page and endpoint on the same scheme; the Transport log will show the failed request either way                       |
