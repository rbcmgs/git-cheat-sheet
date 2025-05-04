# Solving Common Git Problems

*Master the art of diagnosing and fixing Git issues to recover from mistakes and keep your workflow smooth.*

---

## Understanding Git Error Messages

### Common Error Messages

Git error messages often contain valuable information for troubleshooting:

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| `fatal: not a git repository` | Command run outside of git repo | Navigate to repo directory or initialize one |
| `error: failed to push some refs` | Remote contains work you don't have locally | Pull or fetch before pushing |
| `fatal: refusing to merge unrelated histories` | Trying to merge repositories with no common ancestor | Use `--allow-unrelated-histories` flag |
| `fatal: remote origin already exists` | Attempting to add a remote that's already defined | Use `git remote set-url` instead |
| `error: Your local changes would be overwritten` | Uncommitted changes conflict with pull | Commit, stash, or discard changes first |

### Reading Git Error Output

Git errors typically follow this pattern:

```plaintext
error/fatal: <specific error message>
hint: <helpful suggestion on what to do next>
```

When troubleshooting:

1. Read the entire error message carefully
2. Look for hints that Git provides
3. Check for any file paths or refs mentioned in the error

> 💡 **Tip**: Run `git status` immediately after encountering an error for additional context about the state of your repository.

---

## Fixing Commit Mistakes

### Amending Commits

Fix the most recent commit:

```sh
# Change the commit message of the last commit
git commit --amend -m "New commit message"

# Add forgotten files to the last commit without changing the message
git add forgotten-file.txt
git commit --amend --no-edit

# Change author information for the last commit
git commit --amend --author="New Name <email@example.com>"
```

> ⚠️ **Warning**: Never amend commits that have been pushed to a shared repository unless you're absolutely sure no one has based work on them.

### Resetting Commits

Undo commits with different levels of aggressiveness:

```sh
# Soft reset - keep changes staged
git reset --soft HEAD~1       # Undo last commit, keep changes staged

# Mixed reset (default) - keep changes but unstaged
git reset HEAD~1              # Undo last commit, keep changes unstaged

# Hard reset - discard changes completely
git reset --hard HEAD~1       # ⚠️ Undo last commit AND discard changes

# Reset to a specific commit
git reset --hard 7abc123      # ⚠️ Reset to specific commit and discard changes

# Reset a single file to a previous version
git reset 7abc123 -- path/to/file.txt
```

> ⚠️ **Warning**: `--hard` permanently discards changes. However, you can still recover commits with reflog (see below).

### Reverting Commits

Create new commits that undo previous changes:

```sh
# Revert the most recent commit
git revert HEAD

# Revert a specific commit
git revert 7abc123

# Revert multiple commits
git revert 7abc123..9def456

# Revert a merge commit
git revert -m 1 merge_commit_hash
```

> 💡 **Tip**: Use revert when you need to undo changes that have already been shared with others.

### Cherry-Picking Commits

Apply specific commits from one branch to another:

```sh
# Apply a single commit to current branch
git cherry-pick 7abc123

# Cherry-pick without committing changes
git cherry-pick -n 7abc123

# Cherry-pick a range of commits
git cherry-pick 7abc123^..9def456
```

### Interactive Rebase

Modify multiple commits in sequence:

```sh
# Interactively rebase the last 3 commits
git rebase -i HEAD~3

# Rebase onto a specific commit
git rebase -i 7abc123
```

Interactive rebase commands:

- `pick` - Keep the commit as is
- `reword` - Change the commit message
- `edit` - Pause to amend the commit
- `squash` - Combine with previous commit (keeps both messages)
- `fixup` - Combine with previous commit (discard this message)
- `drop` - Remove the commit entirely

> 💡 **Tip**: Interactive rebase can solve many complex problems but use with caution on public history.

---

## Recovering Lost Work

### Using Reflog

Git keeps a log of all reference updates (reflog) for typically 90 days:

```sh
# View reflog for HEAD
git reflog

# View reflog for a specific branch
git reflog show branch-name

# Restore to a specific reflog entry
git checkout HEAD@{2}          # Go to where HEAD was 2 moves ago
git branch recovered-branch HEAD@{2}   # Create branch at that point
```

Example reflog output:

```plaintext
734713b HEAD@{0}: commit: Fix typo in README
a72f9c4 HEAD@{1}: reset: moving to HEAD~1
d29eb23 HEAD@{2}: commit: Work that was undone by reset
```

### Recovering Deleted Commits

Recover work after an accidental reset:

```sh
# Find the SHA of the deleted commit in the reflog
git reflog

# Create a new branch pointing to the lost commit
git branch recovered-work d29eb23  # SHA from reflog

# Or reset your current branch to the lost commit
git reset --hard d29eb23
```

### Recovering Deleted Branches

Restore a branch that was accidentally deleted:

```sh
# Find the SHA of the branch's last commit 
git reflog

# Recreate the branch at that commit
git branch deleted-branch d29eb23  # SHA from reflog
```

### Finding Dangling Commits

Find commits that aren't referenced by any branch or tag:

```sh
# Find dangling commits
git fsck --lost-found

# Examine a specific dangling commit
git show <sha>

# Create a branch to rescued dangling commit
git branch rescued-work <sha>
```

### Rescuing Stashed Changes

Recover stashed work:

```sh
# List all stashes
git stash list

# Recover a dropped stash (if it's still in reflog)
git fsck --no-reflog | grep commit | cut -d' ' -f3 | xargs git show --summary

# Apply a specific stash
git stash apply stash@{n}

# Create a branch from a stash
git stash branch new-branch stash@{0}
```

---

## Resolving Merge Conflicts

### Understanding Conflict Markers

When Git can't automatically merge changes, it marks conflicts in files like this:

```plaintext
  <<<<<<< HEAD
  This is the change in the current branch
  =======
  This is the incoming change from the other branch
  >>>>>>> feature-branch
```

Understanding conflict markers:

- `<<<<<<< HEAD` - Beginning of changes in your current branch
- `=======` - Separator between the conflicting changes
- `>>>>>>> feature-branch` - End of changes from the branch being merged in

### Resolving Conflicts Manually

Steps to manually resolve conflicts:

```sh
# 1. Identify conflicted files
git status

# 2. Open and edit the files to fix conflicts
# 3. Remove conflict markers and keep what you want

# 4. Mark conflicts as resolved
git add resolved-file.txt

# 5. Continue the merge
git merge --continue
# Or for older Git versions
git commit
```

### Using Merge Tools

Resolve conflicts using visual tools:

```sh
# Configure your preferred merge tool (one-time setup)
git config --global merge.tool kdiff3

# Launch configured merge tool for all conflicts
git mergetool

# Launch for specific file
git mergetool path/to/file.txt
```

Popular merge tools:

- VS Code
- KDiff3
- Meld
- Beyond Compare
- P4Merge

### Aborting a Merge

Cancel a merge in progress:

```sh
# Abort the current merge and restore pre-merge state
git merge --abort
```

### Resolving Rebase Conflicts

Handle conflicts during a rebase:

```sh
# During a rebase with conflicts:

# 1. Resolve the conflicts manually in the files

# 2. Add resolved files
git add resolved-file.txt

# 3. Continue the rebase
git rebase --continue

# Or to skip the current commit
git rebase --skip

# Or to abort the entire rebase
git rebase --abort
```

---

## Working with Large Repositories

### Git Performance Issues

Diagnose and improve Git performance:

```sh
# Check repository size
git count-objects -vH

# Run garbage collection to optimize repository
git gc

# Aggressively optimize the repository
git gc --aggressive

# Prune all unreachable objects
git prune
```

### Handling Large Files

Strategies for large files:

```sh
# Configure Git LFS (Large File Storage)
git lfs install

# Track large file patterns with LFS
git lfs track "*.psd"
git lfs track "*.zip"

# Verify tracking
git lfs ls-files

# Clone a repository with LFS objects
git lfs clone <repository-url>
```

### Reducing Repository Size

Remove large files from history:

```sh
# Find the largest objects in your repository
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort -k2nr | head -10

# Use git-filter-repo to remove large files
# First, install git-filter-repo
git filter-repo --path path/to/large/file --invert-paths --force

# Garbage collect after filtering
git gc --aggressive --prune=now
```

> ⚠️ **Warning**: Rewriting history with tools like `git filter-repo` will change all commit hashes. Only use on repositories where you can force-push and other collaborators can handle the change.

### Shallow and Partial Clones

Reduce clone size and time:

```sh
# Shallow clone with limited history
git clone --depth=1 <repository-url>

# Clone only specific branches
git clone --single-branch --branch main <repository-url>

# Fetch additional history later
git fetch --unshallow

# Partial clone (Git 2.22+)
git clone --filter=blob:none <repository-url>
```

---

## Fixing Branch Issues

### Detached HEAD State

Fix the "detached HEAD" state:

```sh
# Check if you're in detached HEAD state
git status

# Create a new branch at current position
git branch new-branch-name

# Switch to the new branch to save your work
git checkout new-branch-name

# Alternative: create and switch in one command
git checkout -b new-branch-name
```

### Repairing Broken Branches

Fix branches pointing to invalid commits:

```sh
# Reset branch to a known good commit
git checkout broken-branch
git reset --hard 7abc123

# Force update a remote branch
git push --force-with-lease origin broken-branch
```

### Recovering from Bad Merges

Undo a problematic merge:

```sh
# Revert a merge commit
git revert -m 1 <merge-commit-hash>

# Reset to before the merge (if not yet pushed)
git reset --hard HEAD~1
```

### Cleaning Up Branches

Manage obsolete branches:

```sh
# List merged branches that can be safely deleted
git branch --merged

# Delete local branches that have been merged
git branch -d branch-name

# Force delete a branch regardless of merge status
git branch -D branch-name

# Delete remote branch
git push origin --delete branch-name

# Prune tracking branches no longer on remote
git fetch --prune
```

---

## Remote Repository Problems

### Push and Pull Errors

Handle common remote operation issues:

```sh
# Fix "non-fast-forward" push rejection
git pull --rebase origin main
git push origin main

# Force push when necessary (use with caution!)
git push --force-with-lease origin main

# Set upstream for current branch
git branch --set-upstream-to=origin/main main

# Retrieve changes without merging
git fetch origin
```

> ⚠️ **Warning**: Force pushing (`git push --force`) overwrites the remote history and can cause serious problems for collaborators. Prefer using `--force-with-lease` which fails if there are upstream changes you don't have.

### Remote Connection Issues

Diagnose and fix connection problems:

```sh
# Test SSH connection to GitHub
ssh -T git@github.com

# Test connection with verbose output
ssh -vT git@github.com

# Set higher timeout for slow connections
git config --global http.lowSpeedLimit 1000
git config --global http.lowSpeedTime 60
```

### Diverged Branches

Handle divergent branches:

```sh
# See how branches have diverged
git log --graph --oneline --all

# For diverged branches, pull with rebase
git pull --rebase

# Pull with specific strategy
git pull --strategy recursive --strategy-option theirs
```

### Fixing Remote References

Repair invalid remote settings:

```sh
# Update remote URL
git remote set-url origin https://github.com/username/repo.git

# Remove and add remote
git remote remove origin
git remote add origin https://github.com/username/repo.git

# Prune deleted remote branches
git remote prune origin

# Reset to exactly match remote branch
git fetch origin
git reset --hard origin/main
```

---

## Authentication and Access

### SSH Key Issues

Troubleshoot and fix SSH key problems:

```sh
# Verify your SSH key is being used
ssh -vT git@github.com

# Start SSH agent
eval "$(ssh-agent -s)"

# Add private key to the agent
ssh-add ~/.ssh/id_rsa

# Create a new SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key to clipboard (Linux)
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard

# Copy public key to clipboard (macOS)
cat ~/.ssh/id_ed25519.pub | pbcopy

# Windows (PowerShell)
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

### Credential Helper Problems

Fix password caching issues:

```sh
# View current credential helper
git config --global --get credential.helper

# Reset credential helper
git config --global --unset credential.helper

# Set a new credential helper
# For Windows
git config --global credential.helper manager-core

# For macOS
git config --global credential.helper osxkeychain

# For Linux
git config --global credential.helper 'cache --timeout=3600'

# For plaintext storage (not secure but simple)
git config --global credential.helper store
```

### Permissions Errors

Fix permission-related problems:

```sh
# Check your access level on a repository
ssh git@github.com info

# Fix permissions for SSH key files
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# Fix "Permission denied" errors
ssh -T git@github.com

# Switch from SSH to HTTPS temporarily
git remote set-url origin https://github.com/username/repo.git
```

---

## Fixing File Mode and Permission Issues

### Executable File Bit Problems

Handle issues with executable permission bit changes:

```sh
# Prevent Git from tracking file permission changes
git config core.fileMode false

# Fix specific file permissions
git update-index --chmod=+x script.sh   # Make executable
git update-index --chmod=-x script.sh   # Remove executable bit
```

### Line Ending Issues

Fix line ending conversion problems:

```sh
# Configure line endings appropriately
# For Windows
git config --global core.autocrlf true

# For macOS/Linux
git config --global core.autocrlf input

# Fix EOL issues for a specific file
git add --renormalize file.txt

# Renormalize the entire repo
git add --renormalize .
git commit -m "Normalize line endings"
```

### File Permission Changes

Handle permission changes showing as modifications:

```sh
# Make Git ignore permission changes
git config core.filemode false

# Reset file permissions without changing content
git checkout-index --force --all
```

---

## Command Summary

| Problem | Command | Description |
|---------|---------|-------------|
| Fix Last Commit | `git commit --amend` | Change last commit |
| Undo Last Commit | `git reset HEAD~1` | Undo commit, keep changes |
| Discard All Changes | `git reset --hard HEAD` | Remove all uncommitted changes |
| View History Log | `git reflog` | Show reference history |
| Recover Deleted Work | `git branch recover-branch HEAD@{n}` | Create branch from reflog |
| Abort Merge | `git merge --abort` | Cancel current merge |
| Fix Detached HEAD | `git checkout -b new-branch` | Create branch at current position |
| Force Push Safely | `git push --force-with-lease` | Force push with safeguard |
| Clean Repo | `git gc --aggressive` | Optimize repository |

---

## Related Topics

- [Git configuration and command shortcuts](config-aliases.md)
- [Advanced Git techniques and features](advanced-topics.md)
- [Combining branches with merge and rebase operations](merging-rebasing.md)
- [Working with remote repositories (push, pull, fetch)](remote-operations.md)

---

*Next: [Advanced Git techniques and features](advanced-topics.md)*
