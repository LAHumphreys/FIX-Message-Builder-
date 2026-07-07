# FIX Message Builder

A fully client-side static web app for composing FIX protocol test messages. The
authoritative spec is **docs/BRIEF.md** — read the relevant section before
implementing a feature; it defines the domain model, merge semantics, and
acceptance criteria in detail.

## Commands

- `npm run verify` — everything CI runs: typecheck, lint, format check, tests, build, privacy check
- `npm run test` / `npm run test:watch` / `npm run test:coverage`
- `npm run dev` — Vite dev server
- `npm run build:fixb` — bundle the profile-workspace CLI (`dist-fixb/fixb.mjs`, Node ≥14.18, no deps)

## Branch & deployment workflow

Full detail in **docs/WORKFLOW.md**. The short version:

- Development work lands on **`dev`** (direct pushes are fine and auto-deploy
  the preview channel at `…github.io/<repo>/dev/`).
- **`main`** is protected — reach it only via PR from `dev`, merged with a
  **merge commit** (never squash/rebase: it diverges `dev`). `main` deploys
  the stable channel at the Pages site root.
- Run `npm run verify` before pushing; it is exactly what CI enforces.
- One Pages site serves both channels: every deploy rebuilds both branch tips
  into a single artifact (`.github/workflows/deploy.yml`).

## Hard constraints

- **Zero network activity after page load.** Never add fetch/XHR/WebSocket/beacon
  calls, CDN resources, or external URLs anywhere in `src/`. CI scans the bundle
  (`scripts/check-privacy.mjs`) and the CSP in `index.html` sets `connect-src 'none'`.
- **Layer boundary** (lint-enforced): `src/engine/` is pure TypeScript — no DOM,
  no browser globals, no React, no imports from `src/ui/`, zero runtime
  dependencies. `src/ui/` is thin React over the engine's public surface
  (`src/engine/index.ts`) and holds no business logic.
  `src/workspace-compiler/` (the fixb config toolchain, docs/PROFILE-WORKSPACE.md)
  is pure TS over engine internals; only `cli.ts`/`cli-main.ts` touch the
  filesystem (node-only, never bundled into the app). `src/ui/` may import the
  compiler's pure modules (in-browser compile of attached fixb workspaces);
  `src/engine/` and the compiler itself must not import from `src/ui/`.
- **The tool never refuses to render.** Validation informs (error/warning/info
  badges); it must never block output — malformed messages are legitimate test
  inputs.
- **No environment-specific data in this repo.** Real server names, routing tags,
  and instrument universes live in private user profiles. Only the fictional demo
  profile ships here.
- TypeScript strict mode; keep `exactOptionalPropertyTypes` and
  `noUncheckedIndexedAccess` clean.

## Conventions

- Engine tests are table-driven (`it.each`) by default and live next to the code
  as `*.test.ts`. Engine coverage target is ≥90% lines; renderers get golden-file
  and known-answer tests (checksum/bodylength from published FIX examples).
- All field values are strings internally; typing is a dictionary/rendering concern.
- Every field carries provenance (which fragment/input set it, what it overwrote).
- Fragment merge order and collision handling are defined in BRIEF.md §3.4 — do
  not improvise precedence rules.
- **docs/PROFILE-AUTHORING.md must track the profile format.** Its JSON
  examples are parsed by the real loader in CI
  (`src/engine/profile/authoringDoc.test.ts`); when the profile, instrument-DB,
  or scenario formats change, update the guide and `docs/schemas/*` in the
  same change.
