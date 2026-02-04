# JSONL Query Examples with jq

## Basic Queries

```bash
# Count by type
jq -s 'group_by(.issue_type) | map({type: .[0].issue_type, count: length})' plan/issues.jsonl

# Get all ready tasks (no blockers, status=ready)
jq -r 'select(.status == "ready" and .issue_type == "task") | .id + ": " + .title' plan/issues.jsonl

# Find issues by priority
jq -r 'select(.priority == 1) | .id + " [" + .status + "]: " + .title' plan/issues.jsonl

# Count issues by status
jq -s 'group_by(.status) | map({status: .[0].status, count: length})' plan/issues.jsonl
```

## Dependency Queries

```bash
# Find what blocks a specific task
jq -r --arg id "bd-a3f8.1.1" 'select(.id == $id) | .dependencies[] | select(.type == "blocks") | "Blocked by: " + .depends_on_id' plan/issues.jsonl

# List dependencies for specific issue
jq -r --arg id "bd-a3f8.1.4" 'select(.id == $id) | .dependencies[] | "- " + .type + ": " + .depends_on_id' plan/issues.jsonl

# Find all tasks blocking others
jq -r 'select(.dependencies | length > 0) | .dependencies[] | select(.type == "blocks") | "⛔ " + .depends_on_id + " blocks " + .issue_id' plan/issues.jsonl

# Find blocked tasks
jq -r 'select(.dependencies[]?.type == "blocks" and .status == "blocked") | .id + ": " + .title' plan/issues.jsonl

# Find issues with no dependencies (leaf nodes)
jq -r 'select(.dependencies | length == 0) | .id + ": " + .title' plan/issues.jsonl
```

## Hierarchy Queries

```bash
# Get epic with all children
EPIC="bd-a3f8"
jq -r --arg epic "$EPIC" 'select(.parent_id == $epic or .id == $epic)' plan/issues.jsonl

# Get issue by id with dependency details
ID="bd-a3f8.1.1"
jq -s --arg id "$ID" 'map(select(.id == $id)) + map(select(.id == any((map(select(.id == $id))[0].dependencies[]?.depends_on_id); .)))' plan/issues.jsonl

# Get all children of a task
PARENT="bd-a3f8.1"
jq -r --arg parent "$PARENT" 'select(.parent_id == $parent)' plan/issues.jsonl
```

## Label Queries

```bash
# Find issues by label
jq -r 'select(.labels[]? == "testing") | .id + ": " + .title' plan/issues.jsonl

# List all unique labels
jq -s '[.[].labels[]?] | unique | .[]' plan/issues.jsonl

# Find issues with multiple labels
jq -r 'select(.labels[]? == "backend" and .labels[]? == "security") | .id + ": " + .title' plan/issues.jsonl
```

## Status & Progress Queries

```bash
# Get all in-progress tasks
jq -r 'select(.status == "in_progress") | .id + ": " + .title' plan/issues.jsonl

# Get closed issues with reason
jq -r 'select(.status == "closed") | .id + ": " + .title + " [" + .close_reason + "]"' plan/issues.jsonl

# Issues by status and priority
jq -s 'group_by(.status) | map({status: .[0].status, tasks: [.[] | {id, title, priority}]})' plan/issues.jsonl

# Find high priority tasks
jq -r 'select(.priority <= 1) | .id + ": " + .title' plan/issues.jsonl

# Count by status
jq -s 'group_by(.status) | map({status: .[0].status, count: length})' plan/issues.jsonl

# Check dependencies for task
jq -r --arg id "bd-a3f8.1.1" 'select(.id == $id) | .dependencies[]' plan/issues.jsonl
```
