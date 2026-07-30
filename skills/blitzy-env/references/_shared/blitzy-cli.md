# Using the blitzy CLI

<!-- Shared reference. Source of truth: /shared/blitzy-cli.md — edit there, then run scripts/sync-shared.mjs. -->

[`blitzy-cli`](https://github.com/nexdrew/blitzy-cli) is an unofficial, read-only CLI
for the Blitzy platform API. These skills use it when available and fall back to the
Blitzy web UI (ask the user to download/paste) when it isn't. Requires v1.1+ for the
behaviors below; check with `blitzy --version`.

## Pre-flight

```sh
blitzy auth --json    # local-only, no network; exit 0 = logged in, exit 2 = run `blitzy login`
```

If not authenticated, ask the user to run `blitzy login` themselves (it prompts for a
password interactively — an agent cannot complete it). In Claude Code they can type
`! blitzy login` to run it inside the session.

## Commands you'll use

```sh
blitzy projects --json --limit 20            # list projects (newest first)
blitzy projects <uuid> --json                # one project: status, metering, repos,
                                             #   raw runs, prs (+ submodule PRs via gh),
                                             #   gh: {enabled,available,authenticated,used,truncatedAt}
blitzy projects <uuid> --json --no-gh        # skip gh subprocess calls (faster, no submodule PRs)
blitzy envs [--json] / blitzy envs <uuid> --json     # environments (detail = full setup instructions)
blitzy rules [--json] / blitzy rules <uuid> --json   # rules (detail = full rule content)
blitzy usage --json                          # lines generated/onboarded vs quota
blitzy download <uuid> --probe --json        # which artifacts exist (no files written)
blitzy download <uuid> --aap --stdout        # one artifact's raw markdown to stdout
blitzy download <uuid> --aap --guide --out <dir>     # save artifacts as timestamped files
```

Artifact flags: `--aap` (Agent Action Plan) · `--guide` (Project Guide) · `--tech-spec`
(Markdown + PDF; Markdown only with `--stdout`) · `--build-prompt` (the generation
prompt as submitted) · `--all` (default).

## Contract for scripting

- Success output on **stdout**; errors on **stderr** (with `--json`, errors are a single
  `{"error":{message,kind,status,code}}` object).
- Exit codes: `0` ok · `1` general · `2` auth required · `3` not found · `4` network.
  On exit 2, ask the user to `blitzy login` and retry once.
- Unknown commands/flags exit 1 (strict mode) — a typo will not silently succeed.
- The CLI is **read-only**: it cannot create projects/envs/rules, approve AAPs, or
  request refinements. Those happen in the Blitzy UI — produce the artifact, then give
  the user exact UI steps.

## Fallback when the CLI is missing

Every artifact the CLI downloads is also available in the Blitzy UI (project page →
documents) — ask the user to download it and provide the path. To install the CLI,
offer `blitzy-init`, or: `npm i -g blitzy-cli` (Node ≥ 20), or download the platform
binary from https://github.com/nexdrew/blitzy-cli/releases (on macOS the downloaded
binary needs `codesign --remove-signature <bin> && codesign --force --sign - <bin> &&
xattr -cr <bin> && chmod +x <bin>` to satisfy Gatekeeper).

Do NOT try to call Blitzy's API with curl/fetch directly — the host is behind
Cloudflare bot protection and rejects non-browser HTTP clients; the CLI's transport
specifically handles this.
