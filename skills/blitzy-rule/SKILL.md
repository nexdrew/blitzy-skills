---
name: blitzy-rule
description: Use when the user wants to create, review, list, inspect, apply, or verify Blitzy Rules — reusable directives / quality constraints attached to Blitzy projects and enforced across code generations ("add once, enforce everywhere"). Covers listing a team's existing rule register via the blitzy CLI, deciding rule vs inline prompt text, authoring rigorous rule definitions (name + description with Requirements / Forbidden Patterns / Validation Gate sections), adding rules in the Blitzy UI (prompting section or Settings > Rules), pointing at the 10 official rule templates, and checking that each rule's intent survived into the Agent Action Plan (AAP). Triggers include "blitzy rule", "add a rule to the project", "reusable directive", "quality constraint for generation", "rule register", "which rules do we have", and "my rule is missing from the AAP".
license: MIT
metadata:
  author: nexdrew
  version: "0.1.0"
---

# blitzy-rule — work with Blitzy Rules

Help the user list, inspect, author, attach, and verify Blitzy **Rules**: reusable
directives attached to a project on the Blitzy platform. Each rule has exactly two
fields — a **name** (concise title of what it enforces) and a **description** (the full
instruction set the AI follows during generation). Rules persist across generations,
can be shared with teams, and reused across projects and languages. Add once, enforce
everywhere.

The blitzy CLI is **read-only**: you can list and inspect rules, but creating or
attaching one happens only in the Blitzy UI. Your job is to produce a paste-ready rule
artifact and give the user exact UI steps.

## Workflow

### Step 1 — Pre-flight and memory

1. Run `blitzy auth --json`. Exit 0 = logged in; exit 2 = ask the user to run
   `blitzy login` themselves (interactive password; you cannot complete it).
   Read `references/_shared/blitzy-cli.md` when you need command details, JSON/exit-code
   contracts, or the fallback path when the CLI is not installed.
2. Locate the `.blitzy/` workspace memory (walk up from cwd). Read
   `.blitzy/conventions.md` BEFORE acting and honor it — it may carry team rule policy
   (e.g. a do-not-fix register that rules must not contradict). Read
   `references/_shared/blitzy-memory.md` when you need the directory layout, the
   project-file schema, or the store-decisions/derive-facts rule.
3. Read `references/_shared/blitzy-lifecycle.md` when you need to place rule work in
   the project lifecycle — rules attach at stage 4 (generation prompt) and are verified
   at stage 5 (AAP review).

### Step 2 — Establish current state (list and inspect)

Always start from the platform, never from local notes:

```sh
blitzy rules --json            # the team's full rule register
blitzy rules <uuid> --json     # one rule: full description + which projects use it
```

- Before authoring anything new, check whether an existing rule — possibly a versioned
  variant (teams accumulate `Rule v3`, `Rule (strict)`, etc.) — already covers the
  need. Prefer reusing or revising over duplicating.
- The platform is authoritative. Local rule-register notes (in `.blitzy/`, wikis, or
  memory files) go stale; treat them as leads, then confirm with `blitzy rules`.
- When inspecting for the user, summarize each rule as name, one-line intent, and the
  projects it's attached to. Show full description text only on request or when
  reviewing quality.

### Step 3 — Decide: rule vs inline prompt text

Apply the official test:

- **Rule** — the constraint must be enforced CONSISTENTLY across generations and/or
  projects (test-coverage standards, style enforcement, security analysis, performance
  profiling, org-wide standards).
- **Inline prompt text** — the constraint applies to a single generation only. Put it
  directly in the generation prompt instead; do not pollute the rule register with
  one-offs.

If the user asks for a rule that is really a one-generation instruction, say so and
offer to fold it into the generation prompt (the `blitzy-prompt` skill covers that).

### Step 4 — Author the rule

Start from an official template when one is close (see list below), else write from
scratch. Hold every rule — new or existing-under-review — to this quality bar:

1. **One rule, one concern.** If the draft covers testing AND style AND security,
   split it.
2. **Constraint-statement first.** Open the description with a single imperative
   sentence stating the constraint, then elaborate.
3. **RFC 2119 keywords.** Use MUST / MUST NOT / SHOULD / NEVER consistently. No
   informal hedging ("try to", "ideally", "where possible") mixed into normative text.
4. **Verifiable validation gate.** Every rule MUST end with a gate a human reviewer or
   CI check can actually verify. If nothing can verify it, it is guidance, not a rule —
   tell the user and either sharpen it or move it to prompt text.
5. **Official template structure.** Shape the description as:
   - opening constraint statement
   - `Requirements:` — bulleted MUST behaviors
   - `Forbidden Patterns:` — bulleted MUST NOT patterns
   - `Validation Gate:` — the pass/fail check, phrased as what fails review
6. **Explicit scope boundary.** Blitzy has NO documented rule-scoping mechanism (no
   path/language/project filters on the rule object), so state the scope inside the
   description text itself: which languages, paths, layers, or change types it applies
   to — and, when useful, what it does NOT apply to.
7. **Sensible density.** Roughly 5–15 rules per project. More dilutes the model's
   attention across all of them; if the project is over budget, propose merging or
   dropping the weakest rules rather than piling on.

**Official rule templates** (starting points; browse under
`templates/rules/` on docs.blitzy.com, index at `/templates/rules-overview`):
Require Test Coverage · Enforce Code Style Patterns · Document Code Explainability ·
Preserve Backward Compatibility · Prevent Security Vulnerabilities · Annotate
Performance Impact · Assess Change Risks · Preserve User Journey Completeness ·
Document API Consumer Paths · Prevent Workflow Gaps.
Copy a template's description and adapt it; custom rules follow the same format.

### Step 5 — Deliver the artifact and UI steps

1. Write the finished rule to `.blitzy/prompts/rule-<slug>.md` using the output
   template below — name plus full description, ready to paste.
2. Give the user the adding mechanics (the CLI cannot do this):
   - **From the project's Prompting Section** — ONLY while the project is in the
     prompting phase. Open the project, go to the prompting section, add an existing
     rule or create a new one (name + description), save. Enforced on all future
     generations for that project. Past the prompting phase you can only REMOVE rules
     here.
   - **From Settings > Rules** — anytime. Settings, Rules tab, create with name +
     description, save; the rule is then available to attach to any project.
3. If the rule is project-specific, log it in `.blitzy/projects/<slug>.md` (dated log
   entry naming the rule and where the artifact lives). Org-wide rules need no project
   log entry, but note them in `.blitzy/conventions.md` if the team tracks policy there.

### Step 6 — Verify rules made it into the AAP (critical)

After the Agent Action Plan is generated, verify — do not assume — that every custom
rule survived:

- The INTENT of every custom rule should appear in the AAP. Blitzy paraphrases rules,
  so check for intent, not exact wording.
- Blitzy may also surface rules it INFERRED from the codebase — review those alongside
  the explicit ones; flag any inferred rule that contradicts team intent.
- A rule may be silently ABSENT if it conflicts with another rule, contradicts a
  codebase convention, or overlaps an existing requirement. This is expected platform
  behavior, not a bug — but it still needs a human decision.
- Procedure: fetch the project's attached rules (`blitzy rules --json` filtered to the
  project, or `blitzy projects <uuid> --json`), get the AAP
  (`blitzy download <uuid> --aap --stdout`), and compare rule-by-rule against the AAP's
  rules/requirements content. Report each rule as present-by-intent, paraphrased-weaker
  (quote both), or absent (with the likely cause).
- If a needed rule was dropped, add it back via **prompt refinement** or **inline AAP
  editing** BEFORE the user approves the AAP.

Cross-reference: the `blitzy-review-aap` skill performs this same check as part of full
AAP review; use this step standalone when the user asks specifically about rules.

## Output template

Write authored rules to `.blitzy/prompts/rule-<slug>.md` in exactly this shape:

```markdown
# Rule: <Name>

- **Status**: draft | added to platform (<date>)
- **Intended scope**: <projects / org-wide; languages/paths, restated inside the description>
- **Source**: <official template name + adaptations, or "custom">

## Name (paste into the platform's name field)

<Concise Title Of What It Enforces>

## Description (paste into the platform's description field)

<Opening constraint statement. One or two sentences, imperative, RFC 2119 keywords.
State the scope boundary here — which code/languages/paths this applies to.>

Requirements:
- <MUST behavior>
- <MUST behavior>

Forbidden Patterns:
- <MUST NOT pattern>
- <MUST NOT pattern>

Validation Gate: <The single pass/fail check a reviewer or CI can verify, phrased as
what fails review.>

## Adding it (UI steps)

1. <Prompting Section steps if the project is in the prompting phase, else Settings > Rules steps>
2. Verify it appears in the project's rules list (`blitzy rules --json`).
3. After AAP generation, verify the rule's intent appears in the AAP (Step 6).
```

## Gotchas

- **Rules get silently dropped from AAPs.** Conflict with another rule, contradiction
  with a codebase convention, or overlap with an existing requirement all cause silent
  omission by design. Always run Step 6; never assume attachment equals enforcement.
- **No scoping mechanism.** There are no per-rule path/language/project filters — a
  rule attached to a project applies to the whole generation. State scope in the
  description prose, and don't promise the user platform-level scoping.
- **Prompting-phase gate.** Adding or creating rules from a project only works while
  the project is in the prompting phase; afterwards you can only remove. Settings >
  Rules works anytime but still requires attaching before/while prompting.
- **CLI is read-only.** `blitzy rules` lists and inspects; it cannot create, edit, or
  attach. Produce the artifact, hand the user UI steps.
- **Local registers go stale.** Notes about "our rules" in `.blitzy/`, memory files, or
  docs under-count and drift. `blitzy rules --json` (the platform) is authoritative;
  reconcile local notes when you find drift.
- **Unverifiable rules are guidance.** A description with no checkable validation gate
  will not reliably shape generation or review. Sharpen it or move it to prompt text.
- **Rule sprawl.** Past roughly 15 rules on one project, each additional rule dilutes
  attention on all of them. Audit and consolidate before adding.

## Final self-check

Before reporting done, confirm:

1. Any authored artifact matches the output template and is paste-ready (name +
   description, no placeholder text left).
2. The description has all three sections and a verifiable Validation Gate, uses
   RFC 2119 keywords, and states its own scope boundary.
3. The platform register was consulted (`blitzy rules --json`) before any new rule was
   authored.
4. Project file / conventions logging done where applicable.

Final message to the user: files created (absolute paths), what the rule enforces in
one line, the exact UI steps to add it, and the reminder to re-verify it in the AAP
after generation.
