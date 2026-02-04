# Dependency Types

## Parent-Child (hierarchy)

```jsonl
{"issue_id":"bd-a3f8.1","depends_on_id":"bd-a3f8","type":"parent-child","created_at":"2026-01-23T10:01:00Z"}
```

## Blocks (hard dependency - prevents starting)

```jsonl
{"issue_id":"bd-a3f8.1.3","depends_on_id":"bd-a3f8.1.1","type":"blocks","created_at":"2026-01-23T10:03:00Z"}
```

Example: Tests block on endpoint implementation

## Related (soft connection)

```jsonl
{"issue_id":"bd-a3f8.2","depends_on_id":"bd-a3f8.1","type":"related","created_at":"2026-01-23T10:05:00Z"}
```

Example: Login and logout share session logic

## Discovered-From (found during other work)

```jsonl
{"issue_id":"bd-new123","depends_on_id":"bd-a3f8.1.1","type":"discovered-from","created_at":"2026-01-23T11:00:00Z"}
```

Example: Bug found while implementing feature

## Common Patterns

### Sequential Work
```jsonl
{"id":"bd-a3f8.1.3","dependencies":[{"issue_id":"bd-a3f8.1.3","depends_on_id":"bd-a3f8.1.5","type":"blocks","created_at":"2026-01-23T10:04:00Z"}]}
```

### Parallel Work
Both tasks have no blocking dependencies, can run independently:
```jsonl
{"id":"bd-a3f8.1","status":"ready","dependencies":[]}
{"id":"bd-a3f8.2","status":"ready","dependencies":[]}
```

### Cross-Story Dependencies
```jsonl
{"id":"bd-f14c.1","dependencies":[{"issue_id":"bd-f14c.1","depends_on_id":"bd-a3f8.1","type":"blocks","created_at":"2026-01-23T11:00:00Z"}]}
```

### Discovered Work
```jsonl
{"id":"bd-new123","title":"Fix email validation regex bug","issue_type":"bug","priority":0,"dependencies":[{"issue_id":"bd-new123","depends_on_id":"bd-a3f8.1.1","type":"discovered-from","created_at":"2026-01-23T11:00:00Z"}]}
```
