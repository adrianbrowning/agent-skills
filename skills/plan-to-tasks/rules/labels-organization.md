# Labels for Organization and Discovery

Use labels for human filtering and grouping (replaces parent_id):

## Feature Grouping

```jsonl
{"id":"bd-a3f8.1","labels":["feature:auth","api","jwt"]}
{"id":"bd-a3f8.2","labels":["feature:auth","middleware","redis"]}
```

Query: `jq -r 'select(.labels[]? == "feature:auth")' plan/issues.jsonl`

## TDD Phases

- `tdd-red` - Write failing test
- `tdd-green` - Make test pass
- `tdd-refactor` - Improve code quality

## Stack/Domain

- Stack: backend, frontend, database, infrastructure
- Language: typescript, python, rust, go
- Framework: react, express, nestjs, django
- Area: auth, payments, search, notifications
- Skill: security, performance, accessibility, i18n

## Query Examples

```bash
# Find all auth feature tasks
jq -r 'select(.labels[]? == "feature:auth") | .id + ": " + .title' plan/issues.jsonl

# Find TDD red phase tasks
jq -r 'select(.labels[]? == "tdd-red") | .id + ": " + .title' plan/issues.jsonl

# Find backend security tasks
jq -r 'select(.labels[]? == "backend" and .labels[]? == "security") | .id + ": " + .title' plan/issues.jsonl
```
