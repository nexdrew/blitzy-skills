# .blitzy/ — Blitzy workspace memory

This directory is the shared, git-committed memory for this workspace's
[Blitzy](https://blitzy.com) projects. It is created and maintained by the
[blitzy-skills](https://github.com/nexdrew/blitzy-skills) agent skills, and it exists so
that Blitzy project state survives across AI-agent sessions and transfers between
engineers.

- `workspace.md` — repo map (parent + submodules), tooling state, org facts.
- `conventions.md` — this team's conventions; agents read it before acting.
- `projects/<slug>.md` — one file per Blitzy project: YAML frontmatter with decision
  state (stage, verdicts, refine rounds, next action) plus a dated decision log.
- `prompts/` — authored artifacts: scope docs, ingestion/generation/refine prompts.
- `reviews/` — review reports and findings files.
- `artifacts/` — downloaded Blitzy artifacts (AAP, Project Guide, tech spec); gitignored
  because they're large and reproducible via `blitzy download`.

Two rules keep this trustworthy:

1. **Store decisions, derive facts.** These files record decisions and verdicts — things
   the Blitzy platform cannot know. Live platform state (run status, PR states) is always
   fetched fresh via `blitzy-cli`/`gh`, never trusted from here.
2. **This directory is excluded from ingestion** via the repo's `.blitzyignore`, so it
   never counts toward quota and internal review notes never leak into Blitzy's
   generation context. Keep it that way.

Humans are welcome to edit anything here — especially `conventions.md`.
