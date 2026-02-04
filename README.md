# adrianbrowning/agent-skills

Agent skills for the tools I use.

Install with:

```sh
pnpm dlx skills add adrianbrowning/agent-skills
```

And choose the ones you want.

## hooks

- https://github.com/anthropics/claude-code/tree/main/plugins/hookify
  - /plugin install hookify@claude-code-plugins
- https://paddo.dev/blog/claude-code-hooks-guardrails/
- https://mays.co/optimizing-claude-code#hooks-active-enforcement

Copy the files from hooks/* to your local ~/.claude or <project root>/.claude 


### UserPromptSubmit
```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node /Users/<home>/.claude/hooks/user-prompt-skill-eval.ts",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```
