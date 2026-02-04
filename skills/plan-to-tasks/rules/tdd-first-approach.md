# TDD-First Approach

**MANDATORY for features and bug fixes.**

When creating tasks for:
- New features → `/tdd-integration` skill (Red→Green→Refactor)
- Bug fixes → `/tdd-integration` skill (test reproduces bug → fix → refactor)
- Infrastructure/config → TDD optional (use judgment)

Structure tasks to support TDD:
1. Test SubTask (RED phase) - write failing test
2. Implementation SubTask (GREEN phase) - minimal code to pass
3. Refactor SubTask (REFACTOR phase) - improve quality

**Default behavior: Plan assumes TDD unless explicitly noted.**

## TDD Task Structure

**For features/bugs, structure SubTasks for Red→Green→Refactor:**

```jsonl
{"id":"bd-a3f8.1.1","title":"Write failing test for login endpoint","description":"Test: POST /api/auth/login with valid/invalid credentials, rate limiting, email verification. Expected: test fails (no implementation yet)","status":"ready","labels":["tdd-red","testing"]}
{"id":"bd-a3f8.1.2","title":"Implement login endpoint (minimal)","description":"Minimal code to pass tests. Just enough to make green.","status":"blocked","dependencies":[{"issue_id":"bd-a3f8.1.2","depends_on_id":"bd-a3f8.1.1","type":"blocks"}],"labels":["tdd-green","implementation"]}
{"id":"bd-a3f8.1.3","title":"Refactor login implementation","description":"Improve code quality, remove duplication, enhance readability. Tests must still pass.","status":"blocked","dependencies":[{"issue_id":"bd-a3f8.1.3","depends_on_id":"bd-a3f8.1.2","type":"blocks"}],"labels":["tdd-refactor","quality"]}
```

**Implementation uses `/tdd-integration` skill which handles Red→Green→Refactor automatically.**

Labels for TDD phases:
- `tdd-red` - Write failing test
- `tdd-green` - Make test pass
- `tdd-refactor` - Improve code quality
