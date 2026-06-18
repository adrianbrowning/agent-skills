---
name: generate-do-work
description: Generates a repo-specific "do-work" skill for the current repository by auto-detecting package manager, test/lint commands, monorepo packages, and commit conventions, then writing .claude/skills/do-work/SKILL.md. Use when the user wants to set up, scaffold, or regenerate a do-work workflow skill in a repo, or says "generate do-work", "make a do-work skill", or "set up the work workflow here".
---

# Generate Do-Work

Scaffolds a customised `do-work` skill into the current repo from `templates/do-work.template.md` (relative to this skill).

## Workflow

### 1. Auto-detect repo specifics

Run detection, do NOT ask user for anything inferable. Gather:

| Field | How to detect |
|-------|---------------|
| `REPO_NAME` | basename of git toplevel (`git rev-parse --show-toplevel`) |
| pkg manager | lockfile: `pnpm-lock.yaml`→pnpm, `yarn.lock`→yarn, `package-lock.json`→npm, `bun.lockb`→bun |
| monorepo packages | `pnpm-workspace.yaml` / `package.json#workspaces` → list package dirs + names |
| lint / type-check / test cmds | `package.json#scripts` — grep keys for `lint`, `lint:ts`/`typecheck`, `test` |
| language rules | `tsconfig.json` (strict, ESM via `type:module`), presence of `.ts` |
| data sink | scan for queue/db usage (prisma, sqs, kafka) → set `{{SINK}}`; default "DB/queue" |
| commit hook | `.husky/commit-msg`, `commitlint.config.*`, `.commitlintrc*` |

Use **one** `git`/file batch, not many Read calls. Prefer reading `package.json`, lockfile names, workspace config, and any husky/commitlint files.

### 2. Resolve commit-message section (important)

Two cases:

- **Husky + commitlint present** (e.g. `.husky/commit-msg` runs `commitlint` and auto-prepends a Jira ticket from the branch name):
  - Emit **Conventional Commits** body only.
  - Set `COMMIT_HOOK_NOTE` = ` — the commit-msg hook prepends the Jira ticket from the branch name automatically, so do NOT add it manually`.
  - Set `COMMIT_RULES_EXTRA` = `- Ticket key is added by the husky hook from the branch name; if branch has no ticket, prepend \`JIRA-1234: \` manually.`
- **No hook**: emit Conventional Commits, and add a rule that the user should prepend the Jira key manually (`JIRA-1234: <type>(<scope>): ...`) if their team uses Jira-first history. Detect Jira-first by sampling `git log --oneline -30` for a `^[A-Z]+-\d+` prefix.

### 3. Fill placeholders

Replace every `{{...}}` token in the template:

- `{{REPO_NAME}}` — repo name
- `{{PACKAGES_NOUN}}` — "packages" (monorepo) or "modules/files" (single pkg)
- `{{PACKAGES_LIST}}` — ` (pkg-a, pkg-b, ...)` or empty
- `{{PACKAGE_SINGULAR}}` — "package" or "area"
- `{{PATTERNS_REF}}` — ` (see CLAUDE.md)` if a CLAUDE.md exists, else empty
- `{{LANG_RULES}}` — bullet lines for the detected language (TS strict/ESM/`workspace:*`, etc.); empty if none
- `{{SINK}}` — detected data sink or "DB/queue"
- `{{FEEDBACK_COMMANDS}}` — actual shell commands in order (type-check, lint, test) using the detected pkg manager + script names
- `{{FEEDBACK_NOTES}}` — autofix hint if a `lint:fix` script exists, else empty
- `{{COMMIT_HOOK_NOTE}}`, `{{COMMIT_RULES_EXTRA}}` — from step 2
- `{{SCOPE_HINT}}` — "package name or domain" (monorepo) or "feature/domain area"

Leave no `{{...}}` unresolved. Empty placeholders → remove the line if it becomes blank/dangling.

### 4. Confirm gaps only

If any field could NOT be inferred (e.g. no `test` script, ambiguous lint cmd), ask the user **only those** in one batched question. Never re-ask what was detected.

### 5. Write the skill

Write resolved content to `.claude/skills/do-work/SKILL.md` at repo root (create dirs). Use the Write tool — never shell redirection.

Then report: detected values table + output path. Tell user to `/do-work` (or restart session if skills are session-loaded).

## Notes

- Front-end repos: keep the front-end block, drop or de-emphasise TDD loop.
- Idempotent: regenerating overwrites the existing `do-work` skill.
