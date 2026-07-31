---
name: blitzy-prompt
description: Author a high-quality Blitzy generation prompt (the prompt Blitzy turns into an Agent Action Plan and then code). Use when the user wants to write, improve, or review a Blitzy prompt, build prompt, or generation prompt, kick off a Blitzy project or code generation, or turn a scoped task into something Blitzy can execute. Encodes Blitzy's 10 Golden Rules and official templates plus field-tested additions.
license: MIT
compatibility: Requires git. Uses the blitzy-cli (npm) and gh command-line tools when available, falling back to the Blitzy web UI otherwise.
metadata:
  author: nexdrew
  version: "0.2.0"
---

# blitzy-prompt — author the generation prompt

The generation prompt is what Blitzy plans from; the Agent Action Plan (AAP) is what it
builds from. This skill produces a prompt that yields a reviewable, correct AAP —
following Blitzy's iterative philosophy: you do NOT need a perfect spec up front;
submit, review the AAP, add specificity where the AAP shows gaps.

Read `references/_shared/blitzy-memory.md` (memory + conventions) before starting.
Load `references/golden-rules.md` while drafting, and `references/templates.md` to pick
the right skeleton.

## Workflow

### 1. Collect inputs

- The scope: ideally a `blitzy-scope` doc at `.blitzy/prompts/scope-<slug>.md`
  (objective, boundaries, build type, sequencing/fencing). Without one, gather the same
  facts from the user — or offer to run `blitzy-scope` first if the ask is fuzzy.
- Read `.blitzy/conventions.md` (disclosure constraints, CI expectations).
- Pre-flight the CLI per `references/_shared/blitzy-cli.md`.

### 2. Verify the platform register

Before citing any environment or rule in the prompt or project setup:

- `blitzy envs --json` / `blitzy rules --json` — confirm the exact names and that they
  exist. **The platform is authoritative**; local notes about envs/rules go stale.
- Rules attach to the project separately — do NOT paste rule content into the prompt.
  A constraint needed only for this one generation goes inline in the prompt instead
  (that's the official rule-vs-prompt boundary).
- Missing env or rule? Route through `blitzy-env` / `blitzy-rule` first.

### 3. Pick the build type and skeleton

Choose one of the seven UI build types (observed from the Blitzy UI; each maps to an
official template family — see `references/templates.md` for the skeletons):

| Build type | Use for |
|---|---|
| PLAN > Document code | inline comments + module-level readme guides |
| BUILD > Add feature | new functionality, extending capabilities |
| BUILD > Refactor codebase | version upgrades, language migration, restructuring |
| BUILD > Custom | anything that fits none of the others |
| MAINTAIN > Remediate vulnerabilities | CVEs, security hardening |
| MAINTAIN > Fix bugs | errors, crashes, unexpected behavior |
| MAINTAIN > Add testing | coverage improvement |

### 4. Draft — Golden Rules discipline

Draft from the skeleton, enforcing every item in `references/golden-rules.md`. The
non-negotiables:

- `OBJECTIVE:` up front; constraints front-loaded; clear headers.
- Scope lists labeled **(exhaustive)** or **(examples, non-exhaustive)** — never
  ambiguous.
- `SUCCESS CRITERIA:` measurable, with a `VALIDATION:` section saying how each is
  checked.
- Pin versions; name key files by path; point to existing in-repo code as the pattern
  to follow ("Follow the error-handling pattern in `src/services/PaymentService.cs`").
- Commands, not suggestions. Banned hedges: *maybe, try, consider, should, ideally*.
  Use MUST / MUST NOT / NEVER, with rationale on the critical ones.
- Make every file-organization decision yourself — never offer Blitzy choices or
  fallbacks ("create new components in /src/components/profile/", not "as needed").
- `TESTING REQUIREMENTS:` coverage, test types, critical scenarios, exact
  `TEST COMMANDS:`.
- End with the **Minimal Change Clause** (verbatim text in `references/templates.md`)
  unless the project is intentionally broad (e.g. a full-codebase refactor).

### 5. Field-tested additions

These come from running many real Blitzy projects; add them wherever applicable:

- **CI as a success criterion.** State "all GitHub checks on the PR must pass" as an
  explicit success criterion, and prefer CI triggered on PR creation. Blitzy cannot
  see CI results after the PR opens — anything CI catches post-PR costs a refine cycle.
- **Wiring, not just existence.** For every new component/file, require it be wired
  into the build AND reachable from a real entry point (project/solution registration,
  DI wiring, route/import). "Created, tested in isolation, never wired" is the dominant
  codegen failure mode. Require compile-forced inclusion where the ecosystem allows
  (e.g. files must be registered in the .csproj/solution; a build with the new code
  must be part of validation).
- **Discovery lane for uncertain scopes.** When the scope depends on facts nobody has
  verified (how many call sites, which files, what patterns), structure the prompt in
  parts: PART 1 produces a written inventory/discovery document with structural guards
  ("PART 1 makes NO code changes; its output is a document listing X with file paths
  and line counts"), later parts implement against that inventory. This keeps the AAP
  reviewable.
- **No arbitrary LOC caps** on the implementation — caps cause silent truncation of
  scope. (Soft caps on generated *documentation* size are fine, ~100K per doc.)
- **Attachments**: max 10 files per prompt; spreadsheets cannot be attached (convert
  to Markdown/PDF) though they CAN be read from the repo; Figma frames attach by URL.
  Prefer referencing in-repo paths over attaching copies.

If `conventions.md` lists disclosure constraints, keep the prompt to requirements and
acceptance criteria — don't embed your team's review strategy or grading context.

### 6. Save, submit, iterate

- Save to `.blitzy/prompts/<slug>-generation-prompt.md`.
- Create/update `.blitzy/projects/<slug>.md` (copy the template from the blitzy-init
  skill's assets if this workspace has one; otherwise mirror an existing project file):
  stage `authored`, buildType, nextAction "create project in UI and submit".
- UI steps for the user: Build button → select build type → paste prompt → attach
  files → attach environment(s) (mind position priority) → attach rules → submit.
  Update stage to `submitted` once they confirm.
- The AAP comes back next: route to `blitzy-review-aap`. If the AAP shows gaps, tighten
  THIS prompt tactically (that's the official loop) rather than accepting a weak plan.

## Gotchas

- The official term is **generation prompt** ("Build" is just the UI button); AAP =
  Agent Action Plan.
- Never push to the branch while generation runs.
- Rules are paraphrased into the AAP and can be silently dropped on conflict — the AAP
  review checks this; don't assume attachment = enforcement.
- There is no documented prompt length limit — the 10-attachment cap is the only hard
  number. Long prompts are fine; vague prompts are not.
- Don't restate an attached rule inline "for emphasis" — duplication creates conflict
  potential; pick one home for each constraint.
