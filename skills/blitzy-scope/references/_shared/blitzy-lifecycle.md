# The Blitzy project lifecycle

<!-- Shared reference. Source of truth: /shared/blitzy-lifecycle.md — edit there, then run scripts/sync-shared.mjs. -->

Blitzy is an autonomous software-development platform: you connect a git repo, write a
**generation prompt**, review the plan it produces, and it generates code as GitHub PRs.
This is the lifecycle these skills support, stage by stage, with the skill that covers each.

| # | Stage | Artifact / action | Skill |
|---|---|---|---|
| 0 | Workspace setup | repo(s), `.blitzyignore`, `.blitzy/` memory, CLI | `blitzy-init` |
| 1 | Ingestion (first time only) | ingestion prompt → **Technical Specification** | `blitzy-ingest` |
| 2 | Tech Spec review | verify the spec against the actual source | `blitzy-review-spec` |
| 3 | Scoping | "what's next" → right-sized project definitions | `blitzy-scope` |
| 4 | Generation prompt | the prompt Blitzy builds from (+ envs, rules, build type) | `blitzy-prompt` (+ `blitzy-env`, `blitzy-rule`) |
| 5 | AAP review | **Agent Action Plan** — the primary control point | `blitzy-review-aap` |
| 6 | Code generation | Blitzy generates code, validates it, opens PR(s) | (Blitzy runs; watch with `blitzy-status`) |
| 7 | Code review | Project Guide + AAP + PR diff → verified findings | `blitzy-review-code` |
| 8 | Refinement | findings → **Refine PR** prompt | `blitzy-refine` |
| 9 | Merge | human merges in GitHub after two review passes | (human action; see below) |
| 10 | Sync | **Sync tech spec**, then loop back to stage 3 | `blitzy-status` prompts this |

Official terminology (use it): *Ingestion*, *Technical Specification* (Tech Spec),
*Generation Prompt* (the UI's button is "Build" — say "generation prompt", not "build
prompt"), *Agent Action Plan (AAP)*, *Project Guide*, *Refine PR*, *Rules*, *Environments*.

## Workflow positions these skills take

These are recommended practice baked into every skill. Two deliberately diverge from
Blitzy's published docs — flag the divergence to users when it comes up.

1. **Run Blitzy against the mainline development branch** (`main`/`master`/`develop`),
   not a dedicated `blitzy` branch. *Diverges from Blitzy's docs*, which recommend a
   `blitzy` branch as a "stable reference point" — in practice the extra branch creates
   sync busywork, and a parent repo's pinned submodule SHAs already provide stability.
   Keep the part that matters: **never push to the branch while a generation is in
   progress.**
2. **Ingestion prompts are only for repos Blitzy has never seen.** For a new project on
   the same repo/branch, write NO ingestion prompt — Blitzy delta-ingests far more
   efficiently and updates the existing Tech Spec. Use the **Sync tech spec** action at
   the end of a project before starting the next one on the same repo/branch. Adding new
   submodules to an existing parent repo also needs no ingestion prompt. *Diverges from
   Blitzy's docs* ("include a minimal ingestion prompt every time"); this guidance came
   from Blitzy technical support and avoids full re-ingests that rewrite the spec.
   **AAP preservation caveat**: running Sync tech spec through a project REPLACES that
   project's downloadable AAP (the `target_tech_spec` document) with the synced Tech
   Spec, unrecoverably. Download and save the project's AAP (to `.blitzy/prompts/`)
   BEFORE syncing through it — and whenever refreshing a saved AAP, verify the download
   still opens as an Agent Action Plan (§0.1 Intent Clarification), not a Tech Spec.
3. **Review is the product.** The AAP is the primary control point ("what the AAP says
   is what the code does" — Blitzy does not improvise beyond the plan). Reviews here are
   source-grounded and adversarial by default; a `quick` mode exists for low-risk work.
4. **Two review passes before merge.** Pass 1 = agent-assisted review plus Blitzy Refine
   PR cycles (route fixable findings back through Blitzy first — it authored the code).
   Pass 2 = engineers familiar with the codebase. Merging is always a **human**
   decision and action.
5. **Merge in GitHub, not the Blitzy UI.** GitHub gives you squash-merge (linear
   history, Conventional Commits, automated versioning/changelogs) and merge-order
   freedom; Blitzy's Merge button offers no merge-strategy choice. Use GitHub for what
   GitHub does best; use Blitzy for what only Blitzy can do. Exception: Blitzy's
   **Fix Merge Conflicts** action is still the right tool for conflicts on Blitzy PRs.
6. **Submodule PRs and refine cycles**: complete all Refine PR cycles before merging
   or closing ANY submodule PR — refine jobs read from submodule branches, and touching
   one mid-cycle breaks the job (official warning, can require manual recovery). Once
   refine cycles are done, the merge order of parent vs submodule PRs is the team's
   choice — record it in `conventions.md` — with the submodule pointers in the parent
   updated at the end either way.

## Right-sizing (what Blitzy is for)

Good fits: epics of a few weeks to a few months of effort, broken into sequential
dependent stories; work with clear, defined scope. Poor fits: tiny tasks (under half a
day — just do those directly), mixed unrelated features in one project, vague
requirements. One Blitzy project = one coherent scope.
