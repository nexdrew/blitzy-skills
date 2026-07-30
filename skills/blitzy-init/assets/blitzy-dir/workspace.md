# Workspace

<!-- Maintained by blitzy-init; update when repos or tooling change. -->

## Blitzy workspace repo

- **Repo**: <org/name of the repo Blitzy ingests>
- **Branch Blitzy runs against**: <main | master | develop>
  (mainline by design — do not create a dedicated `blitzy` branch; never push to this
  branch while a Blitzy generation is in progress)
- **First ingested**: <date> (ingestion prompt: prompts/<file>.md)
- **Tech Spec last synced**: <date>

## Submodules

<!-- One row per submodule. Blitzy needs explicit access to EACH submodule repo
     (access is not inherited). Read-only submodules are ingested for context but
     Blitzy cannot push to them — never ask Blitzy to change one. -->

| Path | Repo | Branch | Blitzy access | Notes |
|---|---|---|---|---|
| <path> | <org/name> | <branch> | read-write \| read-only | |

## Tooling

- **blitzy-cli**: <version, install method> — login account: <email>
- **gh**: <version> — authenticated as: <user>

## Org facts

<!-- Anything an agent should know about the Blitzy org setup: environment names and
     ids, rule register location, quota notes, who administers Settings. -->

- Environments: see `blitzy envs`; conventions for authoring in conventions.md
- Rules: see `blitzy rules`
- Quota notes: <e.g. "usage checked monthly; delta ingestion only — avoid rebases of
  ingested branches (they re-count lines)">
