# The 7 Blitzy UI build types

When you create a project in the Blitzy UI, the "Build" flow asks you to choose a
build type from three groups (PLAN / BUILD / MAINTAIN). **These seven types are
observed from the Blitzy UI — they are not documented in Blitzy's public docs.** The
UI's own one-line meanings are reproduced verbatim below. The public docs instead
publish *prompt templates* (docs.blitzy.com/templates) and *use cases*; the last
column maps each UI build type to its official template family so `blitzy-prompt`
can start from the right template.

| Build type (verbatim) | UI meaning (verbatim) | Official prompt-template family |
|---|---|---|
| `PLAN > Document code` | Auto-generate inline comments and module-level readme guides | Document Code (`/templates/documentation-onboarding/document-code`) |
| `BUILD > Add feature` | Build new functionality and extend app capabilities | New Feature (`/templates/feature-product-development/new-feature`); use New Frontend Feature for UI-layer work, Figma to Code for design-to-code |
| `BUILD > Refactor codebase` | Upgrade versions, migrate languages, or restructure architecture | Refactor (`/templates/code-quality-maintenance/refactor`) |
| `BUILD > Custom` | Describe your specific development needs tailored to your project | Anything else — no single template; structure the prompt with Objective / System Boundaries / Success Criteria |
| `MAINTAIN > Remediate vulnerabilities` | Remediate CVEs and strengthen application security | Fix Security Vulnerabilities (`/templates/code-quality-maintenance/fix-security-vulnerabilities`) |
| `MAINTAIN > Fix bugs` | Identify and resolve errors, crashes, or unexpected behavior | Bug Fix (`/templates/code-quality-maintenance/bug-fix`) |
| `MAINTAIN > Add testing` | Add tests to improve coverage | Add Testing (`/templates/code-quality-maintenance/add-testing`) |

## Selection guidance

- Pick the type by the project's **dominant intent**, not by incidental work it
  includes (a feature that adds its own tests is still `BUILD > Add feature`; a
  dedicated coverage push is `MAINTAIN > Add testing`).
- Version upgrades, language migrations/ports, and architectural restructuring all go
  under `BUILD > Refactor codebase` — including dependency-modernization work that
  might read as "maintenance".
- `MAINTAIN > Remediate vulnerabilities` vs `MAINTAIN > Fix bugs`: choose by whether
  the driver is a security finding (CVE, audit, pen-test result) or a functional
  defect.
- `BUILD > Custom` is the fallback, not the default — reach for it only when none of
  the other six fits (e.g. greenfield "New Product" builds, cross-cutting pattern
  migrations that aren't refactors, CI/tooling work).
- If you cannot pick one type for a project, the project is mixing intents — split it
  (see SKILL.md step 3) rather than forcing a type.

## Bookkeeping

- Record the **verbatim string** (e.g. `MAINTAIN > Add testing`) in the scope doc and
  in the project file's `buildType` frontmatter field — `blitzy-status` and humans
  grep for these exact values.
- The build type chosen here tells `blitzy-prompt` which official template family to
  start the generation prompt from; note both in the scope doc if the mapping is
  non-obvious (e.g. Custom).
