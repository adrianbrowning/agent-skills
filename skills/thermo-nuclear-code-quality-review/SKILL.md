---
name: thermo-nuclear-code-quality-review
description: Strict maintainability review for code structure, DRYness, code-judo simplification, vertical slices, testing boundaries, abstraction quality, ownership, file shape, async orchestration, atomicity, and future testability. Use only when user asks for strict, harsh, maintainability-focused, architectural, DRY, testability, tracer-bullet, or thermo-nuclear review. For ordinary code review, use lighter review unless code has obvious structural risk.
---

# Thermo-Nuclear Code Quality Review

## Quick start

1. Read PR description, commit messages, inline comments first.
2. Flag deferred-debt justifications with no issue number as findings.
3. Run lenses (inline or via sub-agents — see below).
4. Output findings in the format below. Append final verdict.

## Mission

Not: **does it work?**
Ask: **does this make next change easier?**

Delete accidental complexity. Preserve domain boundaries, correctness, auditability, observability, security, failure handling, real invariants.

Review as if responsible for next six months of changes. Best finding: "this whole path disappears if we model state directly."

## Core questions (ask every time)

* Can this be deleted?
* Can this be simpler?
* Is this accidental or essential complexity?
* Can branch become model?
* Can duplicate become one source of truth?
* Is vertical slice clear: input → domain → side effect → output → test?
* Does feature have clean owner, or leak everywhere?
* Are tests proving behaviour, not implementation?
* Did file cross 1000 lines or become harder to scan?
* Can related updates be atomic?

See [REFERENCE.md](REFERENCE.md) for all 8 review lenses and presumptive blocker/serious lists.

## Sub-agent mode

If parallel agents available:

* **Agent A** — code judo + DRY
* **Agent B** — vertical slice + ownership
* **Agent C** — tests + future testability
* **Agent D** — file shape + orchestration

Parent merges findings. Deduplicate. Keep strongest root causes only. If sub-agents unavailable, simulate lenses sequentially.

## Finding format

```
Summary

#: 1
Severity: Blocker | High | Medium | Low
Finding: One-line description — concrete file/function/branch evidence — recommended fix
────────────────────────────────────────
#: 2
...

Verdict: Block | Request changes | Approve with concerns | Approve
```

Severity: blocker → Blocker, serious → High, consider → Medium or Low. Be specific. No generic findings.

## Verdict rules

* **Block** — any Blocker finding
* **Request changes** — High findings that should fix before merge
* **Approve with concerns** — real concerns but acceptable
* **Approve** — structure sound, slice clear, tests protect useful seams

Approve only when: code got simpler or stayed simple, complexity deleted not moved, vertical slice clear, boundaries clean, file shape maintainable.