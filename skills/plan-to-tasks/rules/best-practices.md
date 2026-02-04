# Best Practices

## Three-Level Hierarchy

Identify three levels:
- **Stories (Epics)**: Major features/components → Type: `epic`
- **Tasks**: Implementation work → Type: `task`
- **SubTasks**: Granular actions → Type: `task`

## Output Structure

After conversion, output to single file:

```
└── plan/issues.jsonl  # One issue per line, dependencies embedded
```

Each line in `plan/issues.jsonl` is a complete JSON object following the Issue type schema.

## Important Notes

- **IDs are hierarchical** (`bd-a3f8`, `bd-a3f8.1`, `bd-a3f8.1.1`)
- **One issue per line** in JSONL format
- **Dependencies embedded** in each issue's dependencies array
- **Parent-child relationships** via `parent_id` field + parent-child dependency
- **Priority scale**: 0=critical, 1=important, 2=normal, 3=nice-to-have, 4=low
- **Status values**: ready, blocked, in_progress, closed
- **ISO timestamps** for all date fields
- **Labels are optional** but recommended for filtering
- **Use jq** for all queries and analysis
- **🔴🟢🔵 TDD is mandatory for features/bugs** - Use `/tdd-integration` skill during implementation
- **Structure SubTasks for TDD** - RED (test) → GREEN (implement) → REFACTOR (improve)

## Expected Output Format

### 1. Summary Table

```
Created Issues:
┌─────────────┬──────┬──────────────────────────────────────┬──────────┬────────────────────────┐
│ ID          │ Type │ Title                                │ Priority │ Labels                 │
├─────────────┼──────┼──────────────────────────────────────┼──────────┼────────────────────────┤
│ bd-a3f8     │ epic │ User Authentication System           │ P1       │ auth,backend,security  │
│ bd-a3f8.1   │ task │ Implement login endpoint w/ rate lim │ P1       │ api,jwt,rate-limiting  │
└─────────────┴──────┴──────────────────────────────────────┴──────────┴────────────────────────┘
```

### 2. Dependency Tree

```
bd-a3f8 [epic] User Authentication System
└── bd-a3f8.1 [task] Implement login endpoint with rate limiting
    ├── bd-a3f8.1.5 [task] Add refresh_tokens column to users (BLOCKER)
    │   └── Must complete before: bd-a3f8.1.1, bd-a3f8.1.3
    ├── bd-a3f8.1.1 [task] Create login API endpoint handler
    │   └── Blocked by: bd-a3f8.1.5
```

### 3. Ready Work (Prioritized)

```
Ready to start immediately (no blockers):
1. bd-a3f8.1.5 [P1]: Add refresh_tokens column to users
   Labels: database, migration, postgresql
   Blocks: 2 other tasks
```

### 4. Context Summary

```
Project Overview:
- Story: bd-a3f8 "User Authentication System"
- Tasks: 1 (login endpoint)
- SubTasks: 5 (endpoint, rate limit, service, tests, DB migration)
- Total work items: 6
- Ready to start: 2 (bd-a3f8.1.5, bd-a3f8.1.2)
- Blocked: 3 (waiting on DB migration)

Critical Path:
bd-a3f8.1.5 (DB) → bd-a3f8.1.3 (Service) → bd-a3f8.1.1 (Controller) → bd-a3f8.1.4 (Tests)

Tech Stack Required:
- Backend: Express.js, TypeScript, Node.js
- Database: PostgreSQL with Knex migrations
```

### 5. Query Commands

```
To query the JSONL:

1. View ready work:
   jq -r 'select(.status == "ready") | .id + ": " + .title' plan/issues.jsonl

2. Find blocked tasks:
   jq -r 'select(.status == "blocked") | .id + ": " + .title' plan/issues.jsonl
```

## Final Reminder

**STOP ONCE JSONL IS CREATED!**
**DO NOT IMPLEMENT OR TEST ANYTHING YET!**
**The goal is complete task definition with TDD-ready structure, not implementation.**
