# Type Schema

```typescript
type Issue = {
    id: string;
    title: string;
    description: string;
    priority: number; // 0-4
    issue_type: "task" | "bug";
    status: "ready" | "blocked" | "in_progress" | "closed";
    created_at: string; // ISO Date
    updated_at: string; // ISO Date
    closed_at?: string; // present when status = "closed"
    close_reason?: string; // present when status = "closed"
    labels?: string[]; // e.g., ["feature:auth", "backend", "api", "tdd-red"]
    dependencies: Array<{
        issue_id: string; // this issue's id
        depends_on_id: string; // blocking issue
        type: "blocks" | "depends_on" | "related" | "discovered-from";
        created_at: string; // ISO Date
    }>;
}
```

## Task Characteristics

- Type: `task` or `bug`
- Priority: 0-4 (0=architectural, 1=integration, 2=risky, 3=standard, 4=polish)
- Description: **Complete context** - agent needs no other tasks to understand
- ID: Hierarchical (bd-a3f8.1, bd-a3f8.2) for human viewing
- Labels: feature:*, tdd-*, stack tags for human queries
- Status: `blocked` if has blocking dependencies, `ready` otherwise

## Task Completion Protocol

**MANDATORY**: When agent completes a task, must return:
```
<promise>COMPLETE</promise>
```

Ralph.sh checks for this marker. If present → task closed. If absent → stays in_progress for next iteration.

Agent should return COMPLETE only when:
- All implementation done
- Tests pass
- Types check
- No blockers remain

Partial work → DO NOT return COMPLETE. Next iteration resumes.
