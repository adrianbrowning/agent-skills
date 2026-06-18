# Generate PR — Reference

## 1. When to Open / Draft vs Ready

**Open as Draft when:**
- Design/approach still evolving
- Tests or docs missing
- Want CI signals or early directional feedback

**Convert to "Ready for review" only when:**
- Implementation complete for chosen scope
- All required CI checks are green (or failures explicitly called out + justified)
- Deployed to at least one non-prod env and verified (where applicable)
- Why / What / Impact / Verification filled in, JIRA linked

---

## 2. Title Format

```
JIRA-1234: Short imperative description
```

**Good examples:**
```
VIP-4913: Add Dependabot configuration and upgrade GitHub Actions versions
VIP-4935: Add Cortex repo config and Dependabot automation
VIP-4417: Remove feature flag to always track latestEnrichmentDate for visitor attributes
VIP-4854: Treat overlapped expired-live visits as historical-only to avoid duplicate processing
```

**Checklist:**
- [ ] Starts with Jira key (e.g. `VIP-xxxx`)
- [ ] Uses an action verb (Add, Remove, Fix, Treat, Configure, Migrate, Refactor)
- [ ] States what is changing, not implementation detail

---

## 3. PR Description Skeleton

```markdown
# Why
<Short business / technical motivation>
<Problems this PR solves (bullets)>
<Context: related tickets or previous fixes>

# What
<Change group 1>
  - <Specific bullet(s)>
<Change group 2>
  - <Specific bullet(s)>

# Impact / Migration
- Data:
  - <New vs existing behavior>
- Runtime behavior:
  - <Any user/customer-visible change?>
- Rollback:
  - <How to revert safely>

# Verification
- Automated tests:
  - <Which suites, key cases>
- Manual validation:
  - <Scenarios, environments>
- Dashboards / logs:
  - <Which dashboards, what you checked>

# Notes for reviewers (optional)
- <Most critical lines / logic paths>
- <Key assumptions or trade-offs>

# AI Survey
AI Tool Name: <Glean | Amazon Q | Claude | none>
AI Contribution Percentage: <0–100, only if AI used>
AI Satisfaction (1–5): <only if AI used>
```

> Omit `# Impact / Migration` if no behavior, data, or infra changes.
> Omit `# Notes for reviewers` if no non-obvious risk.

---

## 4. "Why" Section Patterns

**Repository standards / automation:**
> This PR improves repository standards for `<repo>` as part of `<JIRA>` to increase operational excellence.
> Problems being solved:
> - Manual dependency management overhead
> - Security vulnerabilities from outdated dependencies
> - Inconsistent GitHub Actions versions

**Core product behavior:**
> Business Need: `<feature>` requires `<X>` to function correctly. When `<condition>`, `<consequence>`.
> Solution: `<what this PR does>`

**Bug / correctness fix:**
> `<Component>` was `<doing wrong thing>`.
> This caused:
> - `<symptom 1>`
> - `<symptom 2>`

---

## 5. "What" Section Patterns

**Config / infra:**
```
# What
1. Added Dependabot configuration
   - Maven / Gradle / pip / Docker / Terraform / GitHub Actions
   - Monthly schedule with grouped updates
2. Upgraded GitHub Actions
   - actions/checkout@v4 → v6
```

**Feature / behavior change:**
```
# What
- Removed <flag> boolean from <context>
- Simplified <method()> to always <behavior>
- Updated all constructor signatures and call sites
- Added/updated tests to cover new behavior
```

**Refactor with behavior change:**
```
# What
- Refactored <OldMethod()> → <NewMethod()>
- Introduced <NewClass> to separate <concern A> vs <concern B>
- Moved processing responsibilities out of <OldPlace>
- Added focused tests for <scenario>
```

---

## 6. Notes for Reviewers Pattern

```
# Notes for reviewers
- Most critical logic: <ClassName.methodName()>
- Risk: <incorrect X> could cause <Y>; see new tests in <TestClass>
- Assumption: <existing condition> is true for >99% of traffic (validated on dashboard XYZ)
```

---

## 7. AI Survey

Every PR in enabled repos must include the AI Survey comment:

```
# AI Survey
AI Tool Name: <Glean | Amazon Q | Claude | none>
AI Contribution Percentage: <0–100>
AI Satisfaction (1–5): <1–5>
```

- Use `none` for all fields if no AI used
- 100% AI contribution is rare — a human should always be in the loop
- Missing survey → `AI SURVEY MISSING` label added automatically

---

## 8. Pre-Review Checklist

**Scope**
- [ ] Single clear responsibility (or justified mixed scope)

**Title**
- [ ] Starts with Jira key
- [ ] Clear verb + concise description

**Description**
- [ ] Clear Why
- [ ] Clear What (bulleted, grouped by concept)
- [ ] Impact / Migration if behavior/data/infra changes
- [ ] Notable risks, assumptions, or follow-ups mentioned
- [ ] Points reviewers to most critical lines / logic paths

**AI Survey**
- [ ] AI Tool Name filled (`none` if not used)
- [ ] Contribution % + Satisfaction if used

**Tests / Risk**
- [ ] Relevant tests added/updated and passing (or failures explained + tied to JIRA)
- [ ] Coverage drop understood and acceptable (or mitigated)
- [ ] Risky files / Size:Large acknowledged and justified
- [ ] Change deployed to at least one non-prod env and verified (where applicable)

**State**
- [ ] PR moved from Draft to Ready for review only when all above are true

---

## 9. Merge Strategy

- **Default: squash merge** — keeps trunk history linear, supports GitHub Hygiene scorecard
- **Exception:** long-lived feature branches may use classic merge to preserve full commit history
  - Rebase the feature branch onto default regularly
  - Avoid merging default branch back into feature branch (creates noisy history)
