# Team conventions

<!-- Agents: read this file before acting on any Blitzy project and honor it.
     Humans: edit freely — this is the file that tunes the blitzy-* skills to your team.
     Defaults shown are the recommended workflow; change what doesn't fit. -->

## Merge authority & review passes

- Merging a Blitzy PR is always a **human** decision and action — agents never merge.
- Required review passes before merge: **2**
  1. Agent-assisted review (`blitzy-review-code`) + Blitzy Refine PR cycles
  2. Engineers familiar with the codebase
- Who may merge: <names/roles>
- Merge mechanics: merge in **GitHub** (not the Blitzy UI), using **squash-merge** for
  linear history and Conventional Commits. Use Blitzy's "Fix Merge Conflicts" for
  conflicts on Blitzy PRs.
- Submodule PR merge order: <your choice — e.g. submodule PRs first, then the parent
  PR, then update the parent's submodule refs; or parent first. The one fixed rule:
  never merge/close a submodule PR while a Refine PR cycle is active.>

## Review routing

- **refine-first** (default): findings that Blitzy can fix go into a Refine PR prompt
  (validate-or-defend framing) BEFORE posting human-facing PR review comments. Blitzy
  authored the code; give it the first chance to fix or defend it.
- Committed audit/report files (e.g. a `PR_BODY.md` Blitzy committed into the repo):
  flag on every review — remove via refine and fold the content into the PR description.

## Do-not-fix register

<!-- Known quirks that must NOT be fixed opportunistically, even when a review flags
     them (e.g. deliberately bug-compatible legacy behavior). Point to an authoritative
     doc if one exists. Reviews must check findings against this list. -->

- <none yet>

## Disclosure constraints

<!-- e.g. "This engagement is evaluated/graded: keep refine prompts minimal — state the
     defect and the acceptance criterion, not the investigation that found it." -->

- <none>

## Comms style

<!-- How PR comments and team emails should read: voice, sign-off, what to include. -->

- <team defaults>

## CI expectations

- Checks that must pass before merge: <list>
- Trivial CI fixes on Blitzy PR branches: <who handles — note Blitzy cannot see CI
  results after the PR is opened; trivial breaks are usually faster to fix directly
  on the PR branch than through a refine cycle>
