# FIX Message Builder

A fully client-side, static web application for composing [FIX protocol](https://www.fixtrading.org/) test messages. Instead of maintaining hundreds of hand-written message files, you select composable building blocks (instrument, flow type, route, session…), fill in parameter slots, and render the result in one of several output formats.

> **Status:** early development. See [docs/BRIEF.md](docs/BRIEF.md) for the full project brief and [Roadmap](#roadmap) below.

## Privacy model

**No data ever leaves your machine.** This is a hard design constraint, not a best effort:

- **Zero network activity after page load.** No analytics, no telemetry, no CDN resources, no font fetches — everything is bundled.
- Enforced by a strict **Content-Security-Policy** (`connect-src 'none'`) baked into the page, so the browser itself blocks any request the app could attempt.
- Enforced again in **CI**: every build is scanned for `fetch`/`XMLHttpRequest`/`sendBeacon`/WebSocket usage and external URLs (`npm run check:privacy`). Any hit fails the build.
- Profiles, instrument databases, and scenarios are loaded via file picker or drag-and-drop, and exported via file download or clipboard. On Chromium, an optional workspace mode uses the File System Access API for read/write access to a local directory — per-origin, per-directory, by explicit user gesture, and purely local.
- Optional convenience caching in IndexedDB is **off by default**, clearly labelled "stored in this browser only", with a one-click "clear all local data" action.

The public repository contains a generic engine and UI with **no knowledge of any specific trading environment**. All environment-specific detail lives in a _profile_ — a config bundle you load locally at runtime and keep in your own private version control. This repo ships a fictional demo profile only.

## Architecture

Two layers, with the boundary enforced by lint rules:

- **`src/engine/`** — pure TypeScript, zero DOM/browser dependencies, zero runtime dependencies. Canonical message representation, dictionaries, profile resolution, fragment merge, generators, validation, renderers, scenario (de)serialization.
- **`src/ui/`** — React components over the engine. Thin: no business logic.

Stack: TypeScript (strict), Vite, React, Vitest, ESLint + Prettier. GitHub Actions runs typecheck, lint, tests, and the bundle privacy check on every push.

### Branches and deployment

GitHub Pages serves two channels from the one site this repo gets:

| Branch | URL                                     | Purpose                                      |
| ------ | --------------------------------------- | -------------------------------------------- |
| `main` | `https://<owner>.github.io/<repo>/`     | Stable                                       |
| `dev`  | `https://<owner>.github.io/<repo>/dev/` | Rapid iteration; merge to `main` when stable |

A push to either branch rebuilds and redeploys both (a Pages deployment always replaces the whole site), each with the privacy check applied.

## Development

```sh
npm ci            # install
npm run dev       # dev server
npm run test      # unit tests (npm run test:watch / test:coverage)
npm run verify    # everything CI runs: typecheck, lint, format, test, build, privacy check
```

## Roadmap

1. **Engine core** — canonical representation, dictionary load (FIX 4.4 first), tag=value renderer with checksum/bodylength
2. **Composition** — profile schema, dictionary overlay, fragment merge with provenance, slots, generators, validation
3. **Builder UI** — dimension selectors, slot form, annotated view, copy/export
4. **Groups** — batch grid, shared generators, 35=E list mode
5. **JSON renderer + scenarios** — mapping config, scenario save/load, FIX 4.2 and 5.0 SP2 dictionaries
6. **Workspace mode** — File System Access integration, in-place save with conflict detection
7. **Data editing** — in-app CRUD for instruments and target systems
8. **Ship** — demo profile, JSON Schemas, Pages deployment, polish

The full brief, including the domain model (fragments, profiles, target systems, instrument identity conventions) and acceptance criteria, is in [docs/BRIEF.md](docs/BRIEF.md).

## License

Not yet chosen.
