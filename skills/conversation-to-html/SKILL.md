---
name: conversation-to-html
description: Generates a styled .html file capturing conversation context — summary, code diffs, key decisions, or any mix. Written to /tmp/ and opened in browser. Use when user says "save this to html", "export conversation", "write html report", "snapshot this", "export diff to html", "document this session", or "html summary".
---

# conversation-to-html

## Quick start

1. Infer content type from context:
   - Recent code changes / git diff → **diff** view
   - Discussion / decisions / explanation → **summary** view
   - Mix of both → **mixed** view

2. Determine title from topic (e.g. "<ticket>: <name>")

3. Read the template: `~/.claude/skills/conversation-to-html/template.html`

4. Build `{{BODY}}` HTML (see Content Sections below)

5. Replace all placeholders and write to `/tmp/cc-<slug>-<timestamp>.html`

6. Open: `open /tmp/cc-<slug>-<timestamp>.html`

## Placeholders

| Placeholder | Value |
|-------------|-------|
| `{{TITLE}}` | Inferred or user-provided title |
| `{{DATE}}` | Current date/time |
| `{{PROJECT}}` | CWD project name or branch |
| `{{TYPE}}` | `Summary` / `Diff` / `Mixed` |
| `{{BADGE_CLASS}}` | `badge-summary` / `badge-diff` / `badge-mixed` |
| `{{BODY}}` | Generated HTML content sections |

## Content Sections

### Summary content
```html
<section>
  <h2>Overview</h2>
  <p>...</p>
</section>
<section>
  <h2>Key Points</h2>
  <ul><li>...</li></ul>
</section>
<section>
  <h2>Decisions</h2>
  <div class="card">...</div>
</section>
```

### Diff content
```html
<section>
  <h2>Changes</h2>
  <div class="diff-file">
    <div class="diff-filename">path/to/file.ts</div>
    <div class="diff-line diff-hunk">@@ -10,6 +10,8 @@</div>
    <div class="diff-line diff-ctx"> unchanged line</div>
    <div class="diff-line diff-del">-removed line</div>
    <div class="diff-line diff-add">+added line</div>
  </div>
</section>
```

### Code blocks
```html
<pre><code>// code here</code></pre>
```

### Tags / metadata
```html
<div><span class="tag">label</span><span class="tag">label2</span></div>
```

## Rules

- Always `Read` the template first — never inline CSS/HTML from memory
- Escape HTML special chars in diff lines (`&lt;` `&gt;` `&amp;`)
- Slug = title lowercased, spaces→hyphens, strip special chars
- Timestamp = `Date.now()` equivalent (use `date +%s` via Bash)
- Always `open` the file after writing — confirm path to user
- Max fidelity: prefer real diff lines from `git diff` over paraphrasing