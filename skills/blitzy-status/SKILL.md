---
name: blitzy-status
description: Show the live state of all Blitzy projects in this workspace and what to do next on each. Use when the user asks about Blitzy project status, what is Blitzy doing, whether generation or a PR is done, what the next step is, or wants a cross-project dashboard after time away. Reconciles the committed .blitzy memory with live platform and GitHub state.
license: MIT
metadata:
  author: nexdrew
  version: "0.1.0"
---

# blitzy-status — where everything stands, and what's next

Reads decision state from `.blitzy/projects/*.md`, fetches live platform/PR facts,
reconciles the two, and tells the user the next action per project. This skill is how
work resumes after a gap — across sessions, days, or engineers.

Read `references/_shared/blitzy-memory.md` for the memory model (store decisions,
derive facts) and `references/_shared/blitzy-cli.md` for CLI usage before starting.

## Workflow

### 1. Gather

- Locate `.blitzy/` (walk up; if absent, offer `blitzy-init` and stop).
- Parse the YAML frontmatter of every `.blitzy/projects/*.md` (id, name, stage,
  refineRound, nextAction, owner, prs, updated, lastSeen).
- Pre-flight the CLI (`blitzy auth --json`). If unavailable or unauthenticated, render
  the **degraded view** (step 4) from frontmatter + `lastSeen` only, label every
  platform column "stale as of <lastSeen.checkedAt>", and tell the user what to run to
  get live data.
- For each project with an `id`, fetch live state: `blitzy projects <id> --json`
  (status, stage, phase, run status, percent complete, PRs with submodule PRs when gh
  is authenticated — check the `gh` block in the JSON to know whether submodule data is
  trustworthy or just absent). Untracked-but-live projects: if the user asks for
  "everything", also `blitzy projects --json --limit 20` and list platform projects
  that have no `.blitzy/projects/` file (offer to create files for them).

### 2. Reconcile

For each project compare our recorded `stage` against live platform state and PR state.
Common transitions to detect (platform fact → what it means for our stage):

| Signal | Implication |
|---|---|
| AAP available (or platform stage past prompting) while our stage = submitted | AAP is ready → next action is `blitzy-review-aap` |
| Run in progress | generating → **warn: do not push to the branch** |
| PR open while our stage = generating | code is out → next action `blitzy-review-code` |
| PR updated after our last refine round | refine cycle done → re-review the delta |
| PR set partially merged (parent or submodules still open) | finish merging the set (order per conventions.md; only after refine cycles are done), then update submodule pointers |
| PR merged while our stage = team-review | stage → merged → next action **Sync tech spec** |
| Our stage = merged/synced but platform shows a new run | someone started something — investigate before acting |

Update each project file: refresh the `lastSeen` block always; advance `stage` only
when the evidence is unambiguous (e.g. PR merged ⇒ merged) and say you did; when it's
ambiguous, report the drift and ask.

### 3. Render

A compact table, then per-project next actions:

```
PROJECT                STAGE(ours)      PLATFORM             PRs                    NEXT
AloraDL Native Port    reviewing-code   GITHUB_COMPLETED     #19 open (+2 sub)      finish review pass 1 → refine
Sproc Rewrite Phase 0  generating       CODEGEN 62%          —                      wait; do NOT push to main
```

Follow with alerts, most urgent first:

- **Generation in flight** → do not push to the branch until it completes.
- **AAP awaiting review** → the AAP is the primary control point; review before it
  turns into code (`blitzy-review-aap`).
- **PR set partially merged** → finish merging the parent/submodule set (order per
  conventions.md) and update submodule pointers; never merge/close submodule PRs while
  refine cycles are still active.
- **Merged but not synced** → run **Sync tech spec** in the Blitzy UI before creating
  the next project on this repo/branch (see `references/_shared/blitzy-lifecycle.md`,
  workflow position 2).
- **Auth expiring** → `blitzy auth --json` `workosExpiresAt` within ~2h → suggest
  re-login before a long session.
- **Quota** (only when asked or when a big project is queued) → `blitzy usage --json`.

### 4. Next-action map

When a project file's `nextAction` is stale or missing, derive it from the stage:

| stage | next action |
|---|---|
| authored | create the project in the UI (prompt + envs + rules + build type), stage → submitted |
| submitted | wait for the AAP; when ready → `blitzy-review-aap` |
| aap-review | finish the review → approve / inline-edit / refine / discard |
| aap-approved / generating | wait (no pushes); when PR opens → `blitzy-review-code` |
| reviewing-code | finish pass 1 → `blitzy-refine` (findings) or advance to team-review |
| refining | when the refine PR cycle lands, re-review the delta (`blitzy-review-code`) |
| team-review | pass 2 by engineers; then a human merges in GitHub (squash) per conventions.md |
| merged | finish any remaining PRs of the set, bump submodule pointers, **Sync tech spec**, stage → synced |
| synced | `blitzy-scope` for what's next |
| closed | nothing — note why it closed in the log |

## Gotchas

- Never present `lastSeen` data as current — label staleness explicitly.
- The platform's own `stage`/`status` fields describe the run, not your workflow;
  don't overwrite our decision `stage` with platform vocabulary.
- Submodule PR data comes via `gh`; when the detail JSON's `gh.used` is false, say
  "submodule PRs unknown (gh unavailable/unauthenticated)" rather than "none".
- `blitzy projects --json` without a uuid fans out one API call per project — keep
  `--limit` modest.
- Respect `conventions.md` (merge authority, review passes) when phrasing next actions:
  never suggest that you or Blitzy merge anything.
