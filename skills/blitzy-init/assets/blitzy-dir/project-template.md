---
id: null                # Blitzy project uuid — fill in once created in the UI
name: <project name>
repo: <org/name>
branch: <branch>
buildType: <PLAN > Document code | BUILD > Add feature | BUILD > Refactor codebase | BUILD > Custom | MAINTAIN > Remediate vulnerabilities | MAINTAIN > Fix bugs | MAINTAIN > Add testing>
stage: authored         # authored | submitted | aap-review | aap-approved | generating |
                        # reviewing-code | refining | team-review | merged | synced | closed
refineRound: 0
nextAction: "<what happens next, one line>"
owner: <who>
prs: []
updated: <YYYY-MM-DD>
---

## Scope

<one-paragraph summary; link the scope doc and generation prompt in prompts/>

## Log

<!-- Newest first. One dated line per decision/action. Link artifacts in prompts/ and
     reviews/ rather than inlining them. -->

- <YYYY-MM-DD> — created from template.
