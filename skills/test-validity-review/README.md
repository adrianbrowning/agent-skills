# test-validity-review

Reusable agent skill for strict test-suite validity audits.

Invoke explicitly with `/test-validity-review` and optionally add a target path or review scope.

Structure:

- `SKILL.md`: concise workflow loaded on invocation
- `references/REVIEW_CHECKLIST.md`: detailed review heuristics
- `references/EXAMPLES.md`: rewrite patterns and report example
- `scripts/discover-test-surface.mjs`: deterministic JavaScript/TypeScript repo discovery helper
