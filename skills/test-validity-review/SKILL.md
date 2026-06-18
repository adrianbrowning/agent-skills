---
name: test-validity-review
description: Audit existing tests for real behavioural confidence, invalid assertions, over-mocking, missing coverage, flakiness, async mistakes, fixture risk, UI test quality, and TypeScript honesty. Use when asked to review, validate, improve, critique, or run a strict audit on tests, specs, mocks, snapshots, fixtures, or test strategy in JavaScript or TypeScript projects, including Vitest, Jest, Testing Library, Playwright, Cypress, Node, and React.
disable-model-invocation: true
---

# Test Validity Review

Review tests like production confidence depends on them.

Do not ask only: **do tests pass?**
Ask: **would tests fail for right bug, right reason?**

## Workflow

1. Discover repo test surface.
   - Read `package.json`, test config, setup files, CI config, relevant source.
   - Run `node scripts/discover-test-surface.mjs [repo-root]` when useful.
   - Do not invent scripts. Use repo commands when available.
2. Map confidence.
   - Identify unit, integration, contract, component, E2E, type-level coverage.
   - Note critical behaviour covered only by mocks or missing entirely.
3. Review target tests.
   - Prefer public API or user-visible behaviour.
   - Mentally mutate source: wrong value, removed validation, inverted branch, missing `await`, swallowed error, wrong request.
   - Ask whether test fails after real bug but survives harmless refactor.
4. Check risk areas.
   - Mocks: boundary aid or confidence destroyer?
   - Async: awaited, deterministic, race-safe?
   - Fixtures: realistic, local enough, mutation-safe?
   - UI: user-centred queries and actions?
   - TypeScript: casts, `any`, predicates, validators, overloads, type-level negatives?
   - Failures: actionable from test name and output?
   - Vacuous / always-green: tautological assertions (`expect(true).toBe(true)`, `expect(x).toBeDefined()` on always-defined values), type-only checks (`expect(typeof x).toBe("object")`), over-mocked tests that only verify mock wiring, existence checks with no value validation, async tests missing `expect.assertions()` that silently skip, disabled linter rules hiding dead tests, tests that pass regardless of production code mutation.
5. Run available checks when permitted.
   - Typecheck, targeted tests, full suite, coverage.
   - Repeat runs or random order when flake risk exists.
   - Mutation testing on focused surface when tooling exists.
6. Report highest-value findings first.

## Verdict scale

- **Strong**: meaningful confidence; minor cleanup only.
- **Mostly good**: sound direction; notable gaps.
- **Risky**: green suite hides meaningful risk.
- **Weak/invalid**: tests prove little or wrong thing.

## Finding format

For each issue give:

- Severity: `Blocker`, `High`, `Medium`, `Low`
- Location: file and test name
- Problem
- Escaping bug
- Fix

Say directly when true:

- `This test should be rewritten.`
- `This assertion is too weak.`
- `This mock removes behaviour under test.`
- `This tests implementation path, not outcome.`
- `This snapshot is too broad to be useful.`
- `This assertion is tautological — it cannot fail.`
- `This test only checks existence, not correctness.`
- `This test is vacuous — it would pass with any implementation.`

## Core rules

- Behaviour-sensitive. Structure-insensitive.
- Mock boundaries, not behaviour needing confidence.
- Use cheapest test level that catches realistic bug.
- Prefer fewer high-signal tests over generated noise.
- Treat large green suites as untrusted until challenged.
- Keep criticism strict on design, not author.

## Load deeper guidance only when needed

- Read [references/REVIEW_CHECKLIST.md](references/REVIEW_CHECKLIST.md) for detailed heuristics, red flags, portfolio trade-offs, and mutation prompts.
- Read [references/EXAMPLES.md](references/EXAMPLES.md) before proposing rewrites or reviewing UI, async, validator, or type-level tests.
