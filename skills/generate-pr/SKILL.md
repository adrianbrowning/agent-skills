---
name: generate-pr
description: Generates high-quality PR titles and descriptions by analyzing git diff and commits. Produces structured Why/What/Impact/Verification/Notes-for-reviewers body with correct title format "JIRA-1234: Short imperative verb description". Includes AI survey fields. Use when user wants to create, write, or generate a PR description, open a pull request, or asks for help writing PR content.
---

# Generate PR

## Workflow

1. **Gather context** (run in parallel):
   - `git diff main...HEAD` — understand what changed
   - `git log main...HEAD --oneline` — understand commit history
   - `git diff --stat main...HEAD` — file scope / size signal

2. **Ask for missing info** (if not already provided):
   - JIRA ticket key (e.g. `VIP-1234`) — required for title
   - Is this draft or ready-for-review?
   - Any deployment / verification steps already done?
   - AI tools used? (name, contribution %, satisfaction 1–5)

3. **Generate title** — format: `JIRA-1234: Short imperative description`
   - Starts with JIRA key
   - Action verb (Add, Remove, Fix, Refactor, Migrate, Configure, Treat)
   - States *what* changes, not implementation detail
   - See [REFERENCE.md](REFERENCE.md) for examples

4. **Generate description** using the skeleton in [REFERENCE.md](REFERENCE.md):
   - `# Why` — motivation, business value, problems solved
   - `# What` — bulleted changes grouped by concept
   - `# Impact / Migration` — only if behavior/data/infra changes
   - `# Verification` — tests run, manual steps, dashboards checked
   - `# Notes for reviewers` (optional) — 5–10 critical lines/paths, trade-offs, assumptions
   - `# AI Survey` — always include, even if `none`

5. **Draft vs Ready check** — remind user of ready-for-review criteria (see REFERENCE.md §1)

6. **Output** — present title + description as a copyable markdown block, then ask if they want to open the PR via `gh pr create`

## Rules
- No "Why" or "What" = BAD PR QUALITY label — always fill both
- Title without JIRA key = BAD PR QUALITY label
- Tests are part of the PR, not "coming later" (unless explicitly justified + linked JIRA)
- Prefer squash merges; note if long-lived feature branch warrants classic merge
