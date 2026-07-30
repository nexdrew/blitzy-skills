# Prompt skeletons per build type

Blitzy publishes prompt templates ("not required but highly recommended") whose section
skeletons are listed here. Pick by build type, then draft each section using the Golden
Rules (references/golden-rules.md). Full template bodies live at docs.blitzy.com under
Templates.

| Build type (UI) | Official template family | Skeleton |
|---|---|---|
| BUILD > Add feature | New Feature | PROJECT OVERVIEW · SYSTEM BOUNDARIES · TECHNICAL IMPLEMENTATION · TESTING REQUIREMENTS · PRIVATE DEPENDENCIES + RUNNING THE CODE · Minimal Change Clause |
| BUILD > Add feature (frontend) | New Frontend Feature | FRONTEND OVERVIEW · DESIGN SYSTEM & COMPONENTS · API INTEGRATION & DATA FLOW · SYSTEM BOUNDARIES · Minimal Change Clause |
| BUILD > Refactor codebase | Refactor | CORE OBJECTIVES · TARGET STATE DESCRIPTION · TECHNICAL IMPLEMENTATION DETAILS · SYSTEM BOUNDARIES & CONSTRAINTS · NON-FUNCTIONAL REQUIREMENTS · PRIVATE DEPENDENCIES + RUNNING THE CODE · Minimal Change Clause |
| MAINTAIN > Fix bugs | Bug Fix | PROBLEM STATEMENT · BUG REPRODUCTION & EVIDENCE · SYSTEM BOUNDARIES |
| MAINTAIN > Add testing | Add Testing | TESTING SCOPE & OBJECTIVES · SYSTEM BOUNDARIES · TECHNICAL IMPLEMENTATION · TEST COVERAGE STRATEGY · TESTING INTEGRATION & WORKFLOW · QUALITY ASSURANCE · Minimal Change Clause |
| MAINTAIN > Remediate vulnerabilities | Fix Security Vulnerabilities | VULNERABILITY ASSESSMENT · SYSTEM BOUNDARIES · TECHNICAL IMPLEMENTATION · TESTING & VALIDATION REQUIREMENTS · RISK MANAGEMENT · Minimal Change Clause |
| PLAN > Document code | Document Code | MODULE-LEVEL DOCUMENTATION · INLINE COMMENTS · SYSTEM BOUNDARIES · MINIMAL CHANGE CLAUSE |
| BUILD > Custom | (new product / other) | WHY - VISION & PURPOSE · WHAT - CORE REQUIREMENTS · HOW - PLANNING & IMPLEMENTATION · BUSINESS REQUIREMENTS (greenfield); otherwise compose from the nearest family |

Ingestion prompts have their own skeleton — see the blitzy-ingest skill.

## The Minimal Change Clause (use verbatim, adapted to the noun)

Blitzy's templates mark this "Recommended for most X":

> IMPORTANT: Make only the changes that are absolutely necessary to implement this
> feature. Do not refactor, optimize, or modify existing code unless it is directly
> required for the new feature to work. Your goal is to add functionality with minimal
> disruption to the existing system.

Named variants exist per template ("MINIMAL CHANGE CLAUSE & REFACTOR DISCIPLINE
GUIDELINES", "& TESTING DISCIPLINE GUIDELINES", "& SECURITY DISCIPLINE GUIDELINES") —
swap "feature" for the relevant noun. Omit only when the project is intentionally broad
(e.g. a whole-codebase refactor where disruption IS the job).

## Precision vocabulary for requirements

When writing user stories or acceptance criteria into a prompt, Blitzy's user-story
template bans these terms as unverifiable: *approximately, several, various, adequate,
appropriate, properly, correctly, efficiently, quickly, easily, user-friendly,
reasonable, sufficient.* Replace each with a number, a named standard, or a testable
behavior.
