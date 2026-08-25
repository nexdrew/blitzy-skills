---
name: blitzy-refine
description: Turn review findings into a well-formed Blitzy Refine PR prompt. Use when the user wants to refine a Blitzy PR, request fixes from Blitzy, write CRITICAL Directives, or package code-review findings, human PR comments, or CI failures into a refinement request. Enforces atomic directives, batching, wiring verification, sibling-pattern scanning, and scope discipline.
license: MIT
compatibility: Requires git. Uses the blitzy-cli and gh command-line tools when available, falling back to the Blitzy web UI otherwise.
metadata:
  author: nexdrew
  version: "0.4.0"
---

# blitzy-refine — findings in, Refine PR prompt out

Refine PR is Blitzy's mechanism for fixing its own PR. The input can be a
`blitzy-review-code` findings file, a human teammate's review comments, or CI
failures — this skill compiles any of them into directives Blitzy executes reliably.
Directive quality determines refine quality: vague directives produce vague fixes.

Read `references/_shared/blitzy-memory.md` for memory/conventions;
`references/_shared/blitzy-lifecycle.md` for where refinement sits in the workflow.

## Workflow

### 1. Collect and filter findings

- Sources, in whatever combination exists: `.blitzy/reviews/<slug>-code-review-r<N>.md`,
  PR review comments (`gh pr view <n> --comments`), CI failures (`gh pr checks <n>`).
- Read `.blitzy/conventions.md` and filter:
  - **Do-not-fix register**: drop findings that match deliberately-preserved behavior;
    note the drops.
  - **Scope discipline** (official rule): changes outside the original request's scope
    do NOT go in a refine — they belong in a separate project. Split those out and
    route them to `blitzy-scope`.
  - **Disclosure constraints**: when active, directives state the defect and the
    acceptance criterion only — no investigation narrative, no review-strategy detail.
- Dependency check: a Refine PR **cannot add dependencies that were missing when
  Blitzy started** — findings whose fix needs a new dependency must go to a new
  project instead.

### 2. Compile directives

Official format: a list of `CRITICAL Directive:` items separated by `---`, opened by a
scope guard and closed by an escape hatch. Discipline rules (each exists because its
absence caused real refine failures):

- **Header**: `OBJECTIVE: <measurable outcome that defines done>` plus a metadata line
  `[N directives | M files | ~L LoC delta]` so the executor gauges scope at a glance.
- **Scope guard first**: "CRITICAL Directive: Change only what these directives
  specify. Do not refactor, restructure, or modify unrelated code."
- **Atomic**: one finding = one numbered directive with binary pass/fail. Sub-items
  (12a/12b/12c) are prohibited — split them into their own directives.
- **Anatomy of each directive**: imperative verb + file path and line range + current
  behavior + required behavior + acceptance criterion. Reference an existing in-repo
  pattern by path when one exists ("match the retry pattern in src/net/Retry.cs").
- **Wiring verification**: any directive that creates or fixes a component MUST state
  where that component is invoked, and require reachability from a real entry point —
  not just compilation or an isolated unit test. (Created-but-never-wired is the
  dominant failure mode of refinement passes.)
- **Sibling-pattern scanning**: for any pattern-class fix, append "Apply this fix to
  ALL call sites exhibiting this pattern" and name the pattern precisely. Generic
  instructions ("fix all failing checks") reliably miss identical violations at
  sibling locations.
- **Validate-or-defend framing** for discrepancies: when your review disagrees with a
  choice Blitzy made, don't assert — direct: "Validate that <behavior X> is correct.
  If correct, document the rationale in the PR description. If not, change it to
  <behavior Y>. Acceptance: <criterion either way>." Blitzy authored the code; give it
  the chance to defend intentional behavior instead of breaking it.
- **Mechanical-fixes consolidation**: trivial fixes (≤ ~3 LoC, no new logic) get
  grouped into ONE checklist-style "Mechanical fixes" directive so they don't consume
  directive budget.
- **Committed audit files**: when the PR contains Blitzy-committed report files (e.g.
  `PR_BODY.md`), add a directive to `git rm` them and fold their content into the PR
  description.
- **Dependency annotations** between directives: `[Shares file with Directive N]`,
  `[Depends on: Directive N]` — prevents conflicting edits.
- **Self-verification last**: "CRITICAL Directive: Execute verification — run all
  pass/fail criteria from Directives 1–N and report results before declaring
  completion."
- **Escape hatch** (official): "If architectural changes are needed beyond these
  directives, close the PR and create a new request with revised scope."

### 3. Batch when large

- ≤ 8 substantive directives per refine request. 9–12 is tolerable with a note; above
  12, partition into ordered batches of ≤ 8 (group by file/dependency so batches don't
  collide), submit batch 1 only, and hold the rest until batch 1 lands and re-reviews
  clean.
- Record the batch plan in the project file so a later session (or another engineer)
  knows batch 2 exists.

### 4. Submit and track

- Save the prompt to `.blitzy/prompts/<slug>-refine-r<N>.md`.
- UI steps for the user: open the Blitzy PR view → **Refine PR** from the PR dropdown →
  paste the directive list → submit.
- **Submodule warning**: refine jobs read from submodule branches — do not merge or
  close ANY submodule PR while a refine cycle is pending or running (it breaks the job
  and can require manual recovery).
- Update the project file: stage `refining`, increment `refineRound`, nextAction
  "re-review refine round N delta when the PR updates".
- When the refine lands: route back to `blitzy-review-code` to verify the delta
  directive-by-directive (each directive's acceptance criterion is the checklist) and
  re-run the smoke test.

## Output template

```markdown
OBJECTIVE: <measurable outcome>  [<N> directives | <M> files | ~<L> LoC delta]

CRITICAL Directive: Change only what these directives specify. Do not refactor,
restructure, or modify unrelated code.
---
CRITICAL Directive: <imperative fix> in <path>:<lines>. Current behavior: <X>.
Required behavior: <Y>. Acceptance: <binary criterion>. [Depends on: Directive N]
---
CRITICAL Directive: Mechanical fixes — apply each: (1) <path>: <1-line fix>;
(2) <path>: <1-line fix>. Acceptance: all items applied verbatim.
---
CRITICAL Directive: Execute verification — run all pass/fail criteria from
Directives 1–N and report results before declaring completion.
---
CRITICAL Directive: If architectural changes are needed beyond these directives,
close the PR and create a new request with revised scope.
```

## Gotchas

- Never expand scope inside a refine — the official rule is separate run, and mixed
  scopes produce unreviewable diffs.
- Refine cannot fix what needs a dependency that wasn't present at generation start.
- A finding that traces to the AAP (Blitzy correctly executed a wrong plan) usually
  wants a prompt fix and possibly a Close, not a refine — check before compiling.
- Count refine rounds honestly (project file `refineRound`): the official close
  heuristic is "would require 3+ iterations" — if you're compiling round 3, question
  the approach.
- Directives are executed literally — anything you leave ambiguous, Blitzy decides.
