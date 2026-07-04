# Development workflow

How code moves from an idea to the published site.

## Branch model

```
feature fiddling ──push──▶ dev ──PR (merge commit)──▶ main
                            │                          │
                            ▼                          ▼
                    …github.io/<repo>/dev/     …github.io/<repo>/
                    (preview channel)          (stable channel)
```

- **`dev`** — the working branch. Push to it freely and directly; every push
  redeploys the preview channel. Force pushes are acceptable here (nothing
  consumes its history; the deploy always builds the tip).
- **`main`** — the stable branch. Protected: changes arrive only via pull
  request from `dev`, with CI green. Never push to it directly.
- Feature branches off `dev` are optional, for changes too risky even for the
  preview channel; CI runs on their PRs too.

### Merge policy: merge commits, not squash

PRs from `dev` to `main` are merged with a **merge commit**. Squash-merging
would give `main` a commit that `dev` doesn't have, forcing a reset/force-push
of `dev` after every merge. With merge commits the branches stay convergent
and the steady state needs no force pushes.

## Deployment

One GitHub Pages site serves both channels (`.github/workflows/deploy.yml`).
A push to either branch rebuilds **both** branch tips — each with its own
base path and a bundle privacy check — and uploads them as a single artifact,
because a Pages deployment always replaces the entire site. `main`'s build
lands at the site root, `dev`'s under `/dev/`.

CI (`.github/workflows/ci.yml`) runs the full `npm run verify` pipeline —
typecheck, lint, format check, tests with coverage, build, privacy check — on
pushes to `main`/`dev` and on all pull requests.

## One-time repository settings

Everything below lives in the GitHub UI and cannot be configured from a clone.

### Pages and default branch

1. **Settings → Pages → Source:** "GitHub Actions".
2. **Settings → General → Default branch:** `main`.

### Branch protection for `main`

**Settings → Rules → Rulesets → New ruleset → New branch ruleset:**

1. Name: `protect-main`; Enforcement status: **Active**.
2. Target branches: add target → **Include by pattern** → `main`.
3. Enable:
   - **Restrict deletions**
   - **Require a pull request before merging** — required approvals `0`
     (solo repo; the gate is CI, not review)
   - **Require status checks to pass** — add the **`verify`** check (the CI
     job; it appears in the picker once CI has run at least once)
   - **Block force pushes**
4. Leave "Require branches to be up to date before merging" off — with a
   single integration branch it only adds friction.

### Pull request merge settings

**Settings → General → Pull Requests:**

- **Allow merge commits: on** — the only method the workflow needs.
- **Allow squash merging: off** and **Allow rebase merging: off** — removes
  the risk of accidentally diverging `dev` (see merge policy above).
- **Automatically delete head branches: OFF.** This matters: `dev` is
  long-lived, and auto-delete would remove it after every merged PR.

## Development environments

- **Local:** `npm ci && npm run dev` — no backend, no secrets, nothing else
  to set up. Needed for testing workspace mode (File System Access API)
  against real local directories.
- **GitHub Codespaces:** the repo ships a devcontainer
  (`.devcontainer/devcontainer.json`), so "Code → Codespaces → create on
  `dev`" yields a ready environment: dependencies installed, Vite port
  forwarded, ESLint/Prettier/Vitest wired up. This is the phone/tablet path.
- **github.dev** (press `.` in the repo): quick single-file edits with no
  terminal; commit to `dev` and use the preview channel as the feedback loop.
- **Claude Code:** conversational development; sessions push to `dev` and
  open PRs to `main` like any other contributor.

Before pushing, `npm run verify` reproduces exactly what CI will do.
