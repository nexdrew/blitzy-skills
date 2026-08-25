# blitzy-skills

[![skills.sh](https://skills.sh/b/nexdrew/blitzy-skills)](https://skills.sh/nexdrew/blitzy-skills)

Agent Skills for working with the [Blitzy](https://blitzy.com) autonomous software
development platform — a complete, opinionated project lifecycle for AI coding agents
(built for [Claude Code](https://claude.com/claude-code), compatible with any
[Agent Skills](https://agentskills.io) client).

These skills encode Blitzy's official best practices (Golden Rules, AAP review
framework, merge decision matrix, Refine PR format) plus field-tested workflow
knowledge from running many production Blitzy projects: source-grounded plan reviews,
concurrency fencing, wiring verification, refine-first finding routing, and a shared
git-committed memory (`.blitzy/`) that carries project state across sessions and
engineers.

> Unofficial. Not affiliated with Blitzy. Built by a Blitzy customer.

## Install

```sh
# pick skills interactively
npx skills add https://github.com/nexdrew/blitzy-skills

# install all 11 skills
npx skills add https://github.com/nexdrew/blitzy-skills --skill '*'

# install just the `blitzy-review-code` skill
npx skills add https://github.com/nexdrew/blitzy-skills --skill blitzy-review-code
```

Recommended companions: [`blitzy-cli`](https://github.com/nexdrew/blitzy-cli) (v1.1+;
the skills use it when present and fall back to the Blitzy UI when not — install via
`brew install nexdrew/tap/blitzy-cli`, `npm i -g blitzy-cli`, or on Windows
`scoop bucket add nexdrew https://github.com/nexdrew/scoop-bucket` +
`scoop install nexdrew/blitzy-cli`) and the [`gh`](https://cli.github.com) CLI.
`blitzy-init` optionally installs both for you.

## The skills

One skill per lifecycle stage:

| Stage | Skill | What it does |
|---|---|---|
| 0. Setup | **blitzy-init** | Bootstrap the workspace: repo/submodules, `.blitzy/` memory, `.blitzyignore`, CLI installs, team conventions interview |
| — | **blitzy-env** | Author and inspect Blitzy Environments (natural-language setup instructions, variables vs secrets, merge priority, Test Setup) |
| — | **blitzy-rule** | Author and inspect Blitzy Rules (verifiable validation gates, rule-vs-prompt boundary, AAP rules-verification check) |
| 1. Ingest | **blitzy-ingest** | First-time ingestion only: repo prep checklist + ingestion prompt (and routing away from unnecessary re-ingests) |
| 2. Spec | **blitzy-review-spec** | Verify the generated Technical Specification against the actual source |
| 3. Scope | **blitzy-scope** | "What's next" → right-sized, sequenced, concurrency-fenced project definitions |
| 4. Prompt | **blitzy-prompt** | Author the generation prompt: 10 Golden Rules, official template skeletons, Minimal Change Clause, wiring/CI success criteria |
| 5. Plan | **blitzy-review-aap** | Source-grounded, adversarial review of the Agent Action Plan — the primary control point |
| 6–7. Code | **blitzy-review-code** | Three-layer PR review (plan conformance, dynamic validation, code-level) → verified findings + merge/refine/close verdict |
| 8. Refine | **blitzy-refine** | Findings → a disciplined Refine PR prompt (atomic CRITICAL Directives, batching, wiring verification, sibling-pattern scanning) |
| ∞. Track | **blitzy-status** | Cross-session dashboard: reconciles committed memory with live platform/PR state, tells you the next action per project |

## The shared memory (`.blitzy/`)

`blitzy-init` creates a committed `.blitzy/` directory at the workspace-repo root:
project files (decision state + dated logs), authored prompts, review reports, and a
`conventions.md` that tunes every skill to your team (merge policy, review routing,
do-not-fix register, disclosure constraints). The rule all skills follow: **store
decisions, derive facts** — platform/PR state is always fetched live, never trusted
from a file. `.blitzy/` goes in `.blitzyignore`, so it costs no ingestion quota and
never leaks into generation context.

## Opinions (and two deliberate divergences from Blitzy's docs)

- Run Blitzy against your **mainline branch**, not a dedicated `blitzy` branch
  (diverges from the docs; the never-push-during-generation rule still applies).
- **Ingestion prompts only for never-seen repos** — repeat projects on the same
  repo/branch delta-ingest with no prompt; use *Sync tech spec* between projects
  (per Blitzy technical support; diverges from the docs' "minimal prompt every time").
- Review heavily at the **AAP stage** — plan defects cost minutes there and hours in
  the diff. Reviews are source-grounded by default (`quick` mode exists).
- **Refine first**: Blitzy authored the code; route fixable findings through a Refine
  PR before human review comments.
- **Humans merge, in GitHub** (squash-merge, Conventional Commits), after two review
  passes. Skills never merge anything.

## Development

```sh
# propagate shared/ references into every skill
node scripts/sync-shared.mjs

# CI drift check
node scripts/sync-shared.mjs --check

# verify installer discovery
npx skills add ./ --list

# validate against the Agent Skills spec:
#   uvx --from git+https://github.com/agentskills/agentskills#subdirectory=skills-ref \
#     skills-ref validate skills/<name>
```

Each skill is self-contained (shared references are synced copies under
`references/_shared/`), so single-skill installs work.

## License

MIT © [Andrew Goode](https://github.com/nexdrew)
