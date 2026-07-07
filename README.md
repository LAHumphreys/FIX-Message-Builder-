# internal-dist — ready-to-deploy bundle

Prebuilt FIX Message Builder deployment bundle: no Node, no npm, no build
step. Copy this directory's contents to a static web server and follow
[QUICKSTART.md](QUICKSTART.md) (start at step 2 — step 1 is already done).

| | |
| --- | --- |
| Built from | `05b0405` on `dev` |
| Layout | `index.html` (host page, fill its 3 TODOs) + `starter.*.json` + `builder/` (the app, relative paths — serves from any subdirectory) |
| Docs included | QUICKSTART.md, INTERNAL-HOST.md, PROFILE-AUTHORING.md, PROFILE-WORKSPACE.md, schemas/ (JSON Schemas for IDE completion) |
| Config tool | `fixb.mjs` — profile-workspace CLI (`node fixb.mjs init profile-src`, then `build`); needs Node ≥ 14.18 only, no npm. See PROFILE-WORKSPACE.md §0 |

This branch is a build artifact, refreshed manually from `dev` — do not
edit it directly or merge it anywhere.
