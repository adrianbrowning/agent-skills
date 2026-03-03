# Zsh Completion Convention

Reference guide for building zsh tab completions for CLI tools. Based on patterns proven in the `split-tunnel` CLI.

## File Structure

```
project/
  completions/
    _my-tool          # completion file (underscore prefix is zsh convention)
  scripts/
    install.sh        # copies completion to site-functions on install
  my-tool             # CLI wrapper with `completions` subcommand
```

### Installed location

```
/usr/local/share/zsh/site-functions/_my-tool
```

Zsh automatically discovers completions in `site-functions/` — no `.zshrc` edits required. Users just need `rehash` or a new shell after install.

### Dev-mode loading (no install)

Add a `completions` subcommand to your CLI wrapper that emits an eval-able snippet:

```bash
# In your wrapper script
completions)
  cat <<COMP
source "$COMPLETIONS_FILE"
compdef _my_tool my-tool ./my-tool
COMP
  ;;
```

Users activate with:

```bash
eval "$(./my-tool completions)"
```

## Skeleton

```zsh
#compdef my-tool ./my-tool

_my-tool() {
  local -a commands
  commands=(
    'start:Start the service'
    'stop:Stop the service'
    'status:Show service status'
    'help:Show help message'
  )

  _arguments -C \
    '1:command:->cmd' \
    '*:: :->args'

  case "$state" in
    cmd)
      _describe -t commands 'my-tool command' commands
      ;;
    args)
      case "$words[1]" in
        start)
          # subcommand-specific completions here
          ;;
      esac
      ;;
  esac
}

_my-tool "$@"
```

## Key Conventions

### 1. Use `_describe` for everything (not nested `_arguments`)

Nested `_arguments` calls inside the `args` state conflict with the outer `_arguments -C` context. Use `_describe` instead — it works reliably at every level.

```zsh
# WRONG — nested _arguments breaks inside args state
args)
  case "$words[1]" in
    install)
      _arguments -S \
        '--force[Skip prompts]' \
        '--help[Show help]'
      ;;
  esac

# RIGHT — _describe works at any depth
args)
  case "$words[1]" in
    install)
      local -a flags
      flags=('--force:Skip prompts' '--help:Show help')
      _describe -t flags 'flag' flags
      ;;
  esac
```

### 2. Use tag name `flags` (not `options`)

`options` is a reserved zsh completion tag used internally by `_arguments`. Using it with `_describe` causes silent conflicts. Use `flags` instead.

```zsh
# WRONG — "options" is a reserved tag, completions may not appear
_describe -t options 'option' my_flags

# RIGHT
_describe -t flags 'flag' my_flags
```

### 3. Only show long-form flags

Omit short forms (`-f`, `-h`) from completions. This lets zsh auto-insert the common `--` prefix on tab, then show the menu. Short forms still work when typed manually.

```zsh
# For a command with --force and --help:
# Hitting <tab> auto-inserts "--", then shows:
#   --force  -- Skip confirmation prompts
#   --help   -- Show help message

local -a flags
flags=(
  '--force:Skip confirmation prompts'
  '--help:Show help message'
)
_describe -t flags 'flag' flags
```

### 4. Gate positional completions with `CURRENT == 2`

In the `args` state, `CURRENT` is relative to the subcommand. Position 2 is the first argument after the subcommand name. Without gating, positional completions repeat forever.

```zsh
add)
  # Only show format examples for the first positional arg
  if (( CURRENT == 2 )); then
    local -a formats
    formats=(
      'myapp.internal.com:hostname'
      '10.0.0.0/16:CIDR block'
    )
    _describe -t formats 'accepted format' formats
  fi
  # Flags always available (no gate)
  _describe -t flags 'flag' force_help_flags
  ;;
```

### 5. Combine multiple `_describe` calls for mixed completions

Call `_describe` multiple times with different tags to show positional args and flags together. Zsh merges them into one menu.

```zsh
diagnose)
  if (( CURRENT == 2 )); then
    local -a sections
    sections=(
      'system:System info'
      'daemon:Daemon status'
    )
    _describe -t sections 'section' sections
  fi
  _describe -t flags 'flag' help_flags
  ;;
```

Result at `diagnose <tab>`:
```
-- section --
system  -- System info
daemon  -- Daemon status
-- flag --
--help  -- Show help message
```

### 6. Dynamic completions from config files

For commands like `rm` that operate on existing entries, read from config files at completion time:

```zsh
_my_tool_entries() {
  local -a entries
  local conf="/usr/local/etc/my-tool.conf"

  if [[ -r "$conf" ]]; then
    while IFS= read -r line; do
      line="${line%%#*}"   # strip inline comments
      line="${line// /}"   # strip whitespace
      [[ -z "$line" ]] && continue
      entries+=("$line")
    done < "$conf"
  fi

  if (( ${#entries} )); then
    _describe -t entries 'entry' entries
  fi
}
```

### 7. Multi-level subcommands

For commands with their own subcommands (e.g., `my-tool test rm <section> <entry>`), use `CURRENT` to determine depth:

```zsh
test)
  if (( CURRENT == 2 )); then
    # First level: show subcommands/sections
    local -a test_cmds
    test_cmds=(
      'rm:Remove a target'
      'tunnel:Targets that SHOULD use VPN'
    )
    _describe -t test-commands 'subcommand or section' test_cmds
  elif (( CURRENT == 3 )); then
    # Second level: context-dependent
    if [[ "$words[2]" == "rm" ]]; then
      _describe -t sections 'section' sections
    else
      _message 'entry value'
    fi
  elif (( CURRENT == 4 )); then
    # Third level
    _message 'entry value'
  fi
  ;;
```

### 8. Use `_message` for free-form input hints

When there's nothing selectable to offer (user must type a custom value), `_message` shows a hint in the zsh status area. Only use this as a last resort — `_describe` with examples is more visible.

```zsh
# Less visible — hint appears in status bar only
_message 'entry (hostname, IP, or CIDR)'

# More visible — examples appear in completion menu
formats=('myapp.internal.com:hostname' '10.0.0.0/16:CIDR block')
_describe -t formats 'accepted format' formats
```

## Installation & Lifecycle

### Install

Copy the completion file during your tool's install step:

```bash
sudo mkdir -p /usr/local/share/zsh/site-functions
sudo cp completions/_my-tool /usr/local/share/zsh/site-functions/_my-tool
sudo chmod 644 /usr/local/share/zsh/site-functions/_my-tool
```

### Uninstall

Remove it during uninstall:

```bash
sudo rm -f /usr/local/share/zsh/site-functions/_my-tool
```

### Update without restarting shell

After copying an updated file:

```bash
unfunction _my_tool 2>/dev/null; autoload -Uz _my_tool
```

### New command available in PATH

After installing a new binary to `/usr/local/bin/`:

```bash
rehash
```

## `#compdef` Line

The first line registers which command names trigger this completion:

```zsh
#compdef my-tool ./my-tool
```

- `my-tool` — matches the command when installed to PATH
- `./my-tool` — matches when run from the project directory

## Checklist for New CLIs

- [ ] Create `completions/_my-tool` with `#compdef` header
- [ ] Use `_arguments -C` at top level for command dispatch only
- [ ] Use `_describe` (not nested `_arguments`) for all subcommand completions
- [ ] Tag flags as `flags`, not `options`
- [ ] Only offer long-form flags (`--force`, not `-f`)
- [ ] Gate positional completions with `CURRENT == 2`
- [ ] Add `completions` subcommand to CLI wrapper for dev-mode loading
- [ ] Install to `/usr/local/share/zsh/site-functions/` on `install`
- [ ] Remove on `uninstall`
- [ ] Update on `update`
