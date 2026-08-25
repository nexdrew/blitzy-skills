---
name: blitzy-init
description: Set up or repair a Blitzy workspace. Use when the user wants to get started with Blitzy, initialize or bootstrap a repo for Blitzy, create a parent repo with submodules for Blitzy ingestion, set up .blitzyignore, install the blitzy CLI or gh CLI, or create the shared .blitzy memory directory that the other blitzy-* skills depend on. Run this before any other blitzy-* skill in a workspace that has no .blitzy directory.
license: MIT
compatibility: Requires git. Uses the blitzy-cli and gh command-line tools when available, falling back to the Blitzy web UI otherwise.
metadata:
  author: nexdrew
  version: "0.3.0" # x-release-please-version
---

# blitzy-init — bootstrap a Blitzy workspace

Sets up everything the other `blitzy-*` skills assume: the workspace repo, the
`.blitzy/` shared memory, `.blitzyignore`, the `blitzy` CLI, and `gh`. Also safe to
re-run on an existing workspace — it fills gaps and never overwrites user content.

Read `references/_shared/blitzy-lifecycle.md` first if you're not already familiar with
the lifecycle these skills implement; read `references/_shared/blitzy-memory.md` for the
memory layout this skill creates.

## Workflow

Work through the steps in order, skipping anything already in place. Report what exists,
what you created, and what still needs a human action at the end.

### 1. Identify the workspace repo

The workspace repo is the repo Blitzy will ingest. Confirm with the user which of these
applies:

- **Existing single repo** — use it as-is.
- **Multiple repos** — Blitzy treats multi-repo codebases as one parent repo with git
  submodules. If a parent repo already exists, use it; otherwise offer to create one
  (a nearly-empty repo whose content is submodule pointers + a README). Submodule rules
  that matter (from Blitzy's docs):
  - `.gitmodules` must use **absolute HTTPS URLs** (never SSH) and should pin
    `branch = <name>` for each submodule.
  - Run `git submodule update --init --recursive`, commit, and push — un-initialized
    submodules ingest as empty directories.
  - Blitzy needs access granted to **every** submodule repo individually — access is
    not inherited from the parent. When in doubt, grant access to all repos.
  - Mark read-only submodules (context-only): Blitzy can read them but must never be
    asked to change them (its push would fail mid-run).
- **No repo yet (greenfield)** — create the repo first; Blitzy cannot create
  repositories.

**Branch**: run Blitzy against the mainline development branch (`main`, `master`, or
`develop`) — do NOT create a dedicated `blitzy` branch. Tell the user this deliberately
diverges from Blitzy's docs (see `references/_shared/blitzy-lifecycle.md`, workflow
position 1) and that the rule that still applies is: **never push to the branch while a
Blitzy generation is in progress.**

### 2. Scaffold `.blitzy/`

If a `.blitzy/` directory exists (walk up from cwd), verify it has the full layout and
fill only what's missing. Otherwise create it at the workspace repo root from this
skill's bundled templates:

```
.blitzy/README.md        <- assets/blitzy-dir/README.md (verbatim)
.blitzy/workspace.md     <- assets/blitzy-dir/workspace.md (fill in the placeholders)
.blitzy/conventions.md   <- assets/blitzy-dir/conventions.md (fill via step 3)
.blitzy/.gitignore       <- assets/blitzy-dir/gitignore
.blitzy/projects/  .blitzy/prompts/  .blitzy/reviews/  .blitzy/artifacts/
```

Add a `.gitkeep` to the empty directories so they commit. Keep
`assets/blitzy-dir/project-template.md` in mind — other skills copy it when creating
project files; you don't instantiate it here.

Fill `workspace.md` from what you learned in step 1 (repo, branch, submodule table with
access + read-only flags) and steps 4–5 (tooling).

### 3. Interview for `conventions.md`

Fill the template's sections by asking the user — one short question per section, offer
the template's defaults as the recommended answer:

1. **Merge authority & review passes** — who merges, how many passes. Default: humans
   only, 2 passes (agent review + Blitzy refine cycles, then engineers who know the
   codebase), squash-merge in GitHub.
2. **Review routing** — default refine-first (findings go to a Refine PR before human
   PR comments).
3. **Do-not-fix register** — any deliberately-preserved quirks/bug-compatible behavior?
   Usually "none yet" for new workspaces.
4. **Disclosure constraints** — is this engagement evaluated/graded such that refine
   prompts should stay minimal? Usually none.
5. **Comms style** — team defaults for PR comments/emails.
6. **CI expectations** — required checks; who fixes trivial CI breaks on Blitzy PR
   branches.

### 4. `.blitzyignore` (one per repo)

Create or update `.blitzyignore` at the root of the workspace repo — and offer one for
each writable submodule repo. Standard `.gitignore` syntax; excluded files don't count
toward Blitzy usage quota and are excluded from analysis. Propose (tailored to what's
actually in the repo — inspect it):

```
.blitzy/            # workspace memory — never ingest (quota + internal notes)
node_modules/  vendor/  packages/   # vendored/3rd-party dependency dirs
dist/  build/  out/  bin/  obj/     # build output
*.min.js  *.map                     # generated bundles
package-lock.json  yarn.lock  bun.lock  *.lock   # lockfiles
*.png *.jpg *.gif *.pdf *.zip *.dll *.exe        # binaries/media (keep docs PDFs if useful)
```

`.blitzy/` is mandatory; everything else is a suggestion to review with the user.
Committed `.blitzyignore` = team-wide consistency.

### 5. Install the `blitzy` CLI

Check `blitzy --version` first. If missing, tell the user which channels the machine
supports and get their explicit confirmation before installing anything:

- **Homebrew** (macOS/Linux; installs a standalone binary, no Node needed):
  `brew install nexdrew/tap/blitzy-cli`
- **Scoop** (Windows; installs a standalone binary, no Node needed):
  `scoop bucket add nexdrew https://github.com/nexdrew/scoop-bucket` then
  `scoop install nexdrew/blitzy-cli`
- **npm** (Node ≥ 20, any OS): `npm install -g blitzy-cli` — or skip installing and
  use `npx blitzy-cli <command>` per invocation.

Then **verify the installed artifact before first use**. Every release is built and
published by blitzy-cli's public release workflow
([release.yml](https://github.com/nexdrew/blitzy-cli/blob/main/.github/workflows/release.yml)),
and each channel is independently checkable:

- Homebrew: `gh attestation verify "$(command -v blitzy)" --repo nexdrew/blitzy-cli`
  (`command -v` resolves the brew symlink; robust across brew prefixes)
- Scoop (PowerShell; on arm64 verify `blitzy-windows-arm64.exe`):
  `gh attestation verify "$(scoop prefix blitzy-cli)\blitzy-windows-x64.exe" --repo nexdrew/blitzy-cli`
- npm: `npm audit signatures` is project-scoped (it rejects `-g`), so audit a scratch
  install of the same registry artifact:
  `cd "$(mktemp -d)" && npm install blitzy-cli --no-fund && npm audit signatures`

The attestation checks need the `gh` CLI (step 6) — if it isn't installed and
authenticated yet, do step 6 first and come back. If verification fails, stop:
report it to the user and do not run the binary.

If the machine has none of brew, scoop, or Node, stop here — do NOT download
standalone binaries, run installer scripts, or install a package manager itself
(including Scoop) on the user's behalf. Ask the user to install Homebrew, Scoop, or
Node (or to obtain and verify the CLI by whatever means they trust), and continue
once `blitzy --version` works.

Then authentication: `blitzy login` is interactive (password prompt) — the user must run
it themselves. In Claude Code, suggest they type `! blitzy login` to run it inside the
session. SSO accounts use `blitzy login --token <workos-access-token>` (token from the
browser session). Verify afterwards with `blitzy auth --json` (exit 0 = good; see
`references/_shared/blitzy-cli.md`).

### 6. Install `gh` (GitHub CLI)

`gh` powers submodule-PR discovery and PR review flows. Check `gh --version` and
`gh auth status`. If missing: `brew install gh` (macOS), `scoop install gh` (Windows),
the OS package manager, or https://cli.github.com. `gh auth login` is interactive —
the user runs it (same `!` trick applies).

### 7. Wrap up

- Update `.blitzy/workspace.md` with the final tooling/versions/accounts.
- Commit `.blitzy/` and `.blitzyignore` to the workspace repo (a normal commit on the
  mainline branch is fine — but never while a generation is running).
- Tell the user what's next: `blitzy-ingest` if this repo has never been ingested,
  otherwise `blitzy-scope` to plan the next project. Print a short status table of what
  was set up vs skipped.

## Gotchas

- **Never write real secret values** into `.blitzy/` or anywhere in the repo —
  environment secrets live only in Blitzy's Settings UI.
- `.blitzy/` MUST be in `.blitzyignore`; if you find a workspace where it isn't, fix
  that before anything else (it leaks review strategy into generation context and burns
  quota).
- An agent cannot complete `blitzy login` or `gh auth login` — don't try; hand these to
  the user and verify afterward.
- Re-running this skill must be safe: never overwrite an existing `conventions.md`,
  `workspace.md`, or project files — only append/fill gaps after telling the user.
- Rebasing or force-pushing an already-ingested branch makes Blitzy re-count lines
  (quota) — warn if the team's workflow rewrites mainline history.
