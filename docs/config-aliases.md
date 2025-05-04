# Git Configuration and Command Shortcuts

*Master the art of customizing Git to match your workflow with configuration settings and powerful aliases.*

---

## Understanding Git Configuration

### Configuration Levels

Git uses a hierarchical configuration system with three levels:

```plaintext
┌─────────────────┐
│ Repository      │ (Highest priority - .git/config)
├─────────────────┤
│ User (Global)   │ (~/.gitconfig)
├─────────────────┤
│ System          │ (Lowest priority - /etc/gitconfig)
└─────────────────┘
```

Settings from higher levels override lower levels.

```sh
# Set configuration at different levels
git config --system <key> <value>   # System level
git config --global <key> <value>   # User level
git config <key> <value>            # Repository level
```

### Configuration Files

Git stores configuration in plain text files:

```sh
# Show location and contents of config files
git config --list --show-origin

# Edit configuration files directly
git config --global --edit
git config --local --edit
```

### Viewing Current Configuration

Inspect your current Git configuration:

```sh
# List all configurations
git config --list

# Get a specific config value
git config user.name
git config user.email

# Show configuration with origin
git config --list --show-origin
```

---

## Essential Configuration Settings

### User Identity

Configure your identity for commits:

```sh
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set repository-specific identity
git config user.name "Work Name"
git config user.email "work.email@company.com"
```

### Editor Settings

Configure which editor Git uses for messages:

```sh
# Set default editor
git config --global core.editor "code --wait"    # VS Code
git config --global core.editor "vim"            # Vim
git config --global core.editor "nano"           # Nano
git config --global core.editor "'C:/Program Files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin" # Notepad++ on Windows
```

### Default Branch

Set the default branch name for new repositories:

```sh
# Set main as the default branch name (Git 2.28+)
git config --global init.defaultBranch main

# Other common options: master, trunk, development
```

### Line Endings

Configure line ending behavior to prevent cross-platform issues:

```sh
# For Windows
git config --global core.autocrlf true

# For macOS/Linux
git config --global core.autocrlf input

# Use consistent line endings in the repo
git config --global core.eol lf
```

### Color Settings

Customize colorized output to improve readability:

```sh
# Enable colored output
git config --global color.ui auto

# Set specific colors
git config --global color.status.changed "blue"
git config --global color.status.untracked "red"
git config --global color.branch.current "yellow reverse"
```

### Credentials Storage

Configure how Git stores your credentials:

```sh
# Cache credentials in memory (15 min by default)
git config --global credential.helper cache

# Set custom timeout (in seconds)
git config --global credential.helper 'cache --timeout=3600'

# Store credentials permanently
git config --global credential.helper store

# Use OS-specific credential managers
git config --global credential.helper manager-core  # Windows
git config --global credential.helper osxkeychain   # macOS
```

> ⚠️ **Warning**: Using `credential.helper store` saves credentials in plaintext. Consider using OS-specific managers for better security.

---

## Creating and Using Aliases

### Basic Alias Syntax

Create shortcuts for Git commands:

```sh
# Basic alias syntax
git config --global alias.<alias-name> '<git-command>'

# Example: 'git co' instead of 'git checkout'
git config --global alias.co checkout
```

### Essential Git Aliases

Common, time-saving aliases:

```sh
# Basic command shortcuts
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
```

### Advanced Aliases

More powerful aliases for complex commands:

```sh
# Enhanced log outputs
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config --global alias.hist "log --pretty=format:'%C(yellow)[%ad]%C(reset) %C(green)[%h]%C(reset) | %C(red)%s %C(bold red){{%an}}%C(reset) %C(blue)%d%C(reset)' --graph --date=short"

# Show all branches with last commit info
git config --global alias.branches 'branch -a -v'

# Show a list of tags with annotations
git config --global alias.tags 'tag -l -n1'

# Show modified files in working directory
git config --global alias.mods 'diff --name-only --diff-filter=M'
```

### Function-Like Aliases

Create aliases that accept parameters:

```sh
# Find commits by commit message
git config --global alias.find '!f() { git log --pretty=format:"%h %ad | %s%d [%an]" --date=short --all --grep="$1"; }; f'

# Show the diff of the last commit
git config --global alias.difflast '!f() { git diff HEAD~1 HEAD; }; f'

# Create and switch to a new branch
git config --global alias.cnb '!f() { git checkout -b $1 && git push -u origin $1; }; f'
```

> 💡 **Tip**: The `!` prefix allows you to run shell commands in aliases.

### Managing Aliases

View, edit, and remove aliases:

```sh
# List all aliases
git config --get-regexp alias

# Remove an alias
git config --global --unset alias.co
```

---

## Customizing the Git Environment

### Output Formatting

Adjust how Git displays information:

```sh
# Always show colors
git config --global color.ui true

# Set pager behavior
git config --global core.pager 'less -FRX'

# Use unicode in paths
git config --global core.quotePath false
```

### Diff and Merge Tools

Configure external tools for diff and merge operations:

```sh
# Set up meld as difftool
git config --global diff.tool meld
git config --global difftool.meld.path "/path/to/meld"
git config --global difftool.prompt false

# Set up kdiff3 as mergetool
git config --global merge.tool kdiff3
git config --global mergetool.kdiff3.path "/path/to/kdiff3"
git config --global mergetool.keepBackup false

# Setup VSCode as difftool
git config --global diff.tool vscode
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'
```

### Ignoring Files Globally

Set up a global ignore file for all repositories:

```sh
# Create a global gitignore file
git config --global core.excludesFile '~/.gitignore_global'

# Common content for global gitignore
# OS specific files
# .DS_Store
# Thumbs.db
# Editor files
# .vscode/
# .idea/
```

### Auto-Correcting Command Typos

Enable Git's auto-correction feature:

```sh
# Enable auto-correction with 0.1s delay
git config --global help.autocorrect 1

# Set higher delay (e.g., 5 seconds = 50)
git config --global help.autocorrect 50
```

### Commit Template

Create a template for commit messages:

```sh
# Set up a commit message template
git config --global commit.template ~/.gitmessage.txt

# Create the template file with recommended structure:
# Subject line (50 chars)
#
# Body (72 chars per line)
#
# Issue: #123
```

---

## Configuration for Common Workflows

### Pull Strategy Configuration

Control how Git handles pulling changes:

```sh
# Set default pull strategy to rebase
git config --global pull.rebase true

# Set default pull strategy to merge
git config --global pull.rebase false

# Force fast-forward only pulls
git config --global pull.ff only
```

### Push Default Behavior

Configure your default push behavior:

```sh
# Push only the current branch to its tracked branch
git config --global push.default simple

# Push all branches that have matching names
git config --global push.default matching

# Push to a branch with the same name
git config --global push.default current

# Push to the upstream branch
git config --global push.default upstream
```

### Auto-Setup Remote Branches

Configure Git to automatically create/track branches:

```sh
# Auto-create remote branches on push
git config --global push.autoSetupRemote true

# Auto-setup remote tracking
git config --global branch.autoSetupMerge always
```

### Rebase Configuration

Fine-tune your rebase operations:

```sh
# Automatically stash changes before rebasing
git config --global rebase.autoStash true

# Show more information during rebase
git config --global rebase.stat true

# Allow empty commits during rebase
git config --global rebase.allowEmpty true
```

### Branch Management Configuration

Set up branch management preferences:

```sh
# Always rebase when pulling into master/main
git config branch.master.rebase true
git config branch.main.rebase true

# Sort branches by most recently used
git config --global branch.sort -committerdate
```

---

## Advanced Configuration Options

### Git Hooks Configuration

Configure Git hooks behavior:

```sh
# Set a custom hooks path
git config --global core.hooksPath ~/.git-hooks

# Enable template hooks for all repos
git config --global init.templateDir ~/.git-templates
```

### Performance Tuning

Adjust settings for large repositories:

```sh
# Speed up status on large repos
git config --global feature.manyFiles true

# Increase packed memory
git config --global pack.windowMemory 256m
git config --global pack.packSizeLimit 256m

# Improve delta compression
git config --global core.preloadIndex true
git config --global core.fsmonitor true
```

### GitHub/GitLab Specific Settings

Configure settings specific to GitHub or GitLab:

```sh
# Set default GitHub CLI protocol
git config --global hub.protocol https

# Set GitLab token
git config --global gitlab.token "your-token"

# Github CLI configuration
git config --global gh.editor vim
```

### Conditional Configuration

Apply configuration based on conditions:

```sh
# Include work config only in work directory
git config --global includeIf.gitdir:~/work/.path ~/.gitconfig-work

# Include personal config only in personal directory
git config --global includeIf.gitdir:~/personal/.path ~/.gitconfig-personal
```

### Core Configuration Options

Additional important core settings:

```sh
# Set default permissions
git config --global core.fileMode false

# Set trusted file modes
git config --global core.sharedRepository group

# Set log display defaults
git config --global log.date iso

# Default ignorecase setting
git config --global core.ignorecase false
```

---

## Managing Multiple Git Configurations

### Conditional Includes

Include different configurations based on location:

```sh
# In your ~/.gitconfig file
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work
[includeIf "gitdir:~/personal/"]
    path = ~/.gitconfig-personal
```

Example work config (`~/.gitconfig-work`):

```plaintext
[user]
    name = Work Name
    email = work@company.com
[core]
    sshCommand = "ssh -i ~/.ssh/work_id_rsa"
```

### Directory-Specific Configurations

Create separate Git configurations for different directories:

```sh
# Create a directory-specific configuration
cd ~/project
git config user.name "Project Specific Name"
git config user.email "project@example.com"
```

### Profile Switching

Use tools or scripts to switch between Git profiles:

```sh
# Example bash function in .bashrc/.zshrc
git-profile() {
    if [ "$1" = "personal" ]; then
        git config --global user.name "Personal Name"
        git config --global user.email "personal@example.com"
        echo "Git profile set to personal"
    elif [ "$1" = "work" ]; then
        git config --global user.name "Work Name"
        git config --global user.email "work@company.com"
        echo "Git profile set to work"
    else
        echo "Usage: git-profile [personal|work]"
    fi
}
```

---

## Command Summary

| Operation | Command | Description |
|-----------|---------|-------------|
| View Config | `git config --list` | Show all settings |
| Set Global | `git config --global <key> <value>` | Set global setting |
| Set Local | `git config <key> <value>` | Set repo setting |
| Edit Config | `git config --edit` | Open config file |
| Create Alias | `git config --global alias.<name> <command>` | Create command shortcut |
| List Aliases | `git config --get-regexp alias` | Show all aliases |
| Remove Setting | `git config --unset <key>` | Remove a setting |
| Identity | `git config --global user.name "Name"` | Set username |
| Default Editor | `git config --global core.editor <editor>` | Set default editor |
| Default Branch | `git config --global init.defaultBranch main` | Set default branch |
| Multiple Configs | `includeIf.gitdir:<path>` | Use path-specific config |

---

## Related Topics

- [Setting up Git and initializing repositories](01-setup-and-init.md)
- [Essential everyday Git commands and workflows](02-basic-usage.md)
- [Solving common Git problems](10-troubleshooting.md)
- [Advanced Git techniques and features](11-advanced-topics.md)

---

*Next: [Solving common Git problems](10-troubleshooting.md)*
