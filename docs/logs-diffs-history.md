# Viewing Project History and Comparing Changes

*Master the art of exploring Git history and analyzing differences between commits, branches, and files.*

---

## Git History Basics

### Understanding Git's History Model

Git stores project history as a series of snapshots (commits) linked to form a directed acyclic graph (DAG):

- Each commit contains a pointer to its parent commit(s)
- Commits are identified by their SHA-1 hash
- Branches and tags are simply pointers to specific commits
- History can diverge and merge back together

### The Commit Graph

A typical commit graph might look like:

```plaintext
  A---B---C feature
 /         \
D---E---F---G main
     \
      H---I topic
```

Where each letter represents a commit, and lines show parent-child relationships.

---

## Viewing Commit History

### Basic Log Commands

View commit history with `git log`:

```sh
# Basic commit history
git log

# Show history with short single-line summaries
git log --oneline

# Show difference introduced in each commit
git log -p

# Show statistics about what changed in each commit
git log --stat
```

### Formatting Log Output

Customize log output format:

```sh
# Customize the output format
git log --pretty=format:"%h - %an, %ar : %s"

# Common format placeholders:
# %h  - abbreviated commit hash
# %an - author name
# %ar - author date, relative
# %s  - subject (commit message)
# %d  - ref names (branches, tags)

# Show with both date and relative time
git log --pretty=format:"%h - %an [%ad] (%ar): %s" --date=short
```

> 💡 **Tip**: Create aliases for your favorite log formats to save typing.

### Limiting Log Output

Control how many commits to display:

```sh
# Show only the last n commits
git log -n 5

# Show commits since a specific date
git log --since="2023-01-01"
git log --after="2023-01-01"

# Show commits until a specific date
git log --until="2023-01-01"
git log --before="2023-01-01"

# Show commits between dates
git log --since="2023-01-01" --until="2023-02-01"
```

### Filtering Log Output

Filter the commit history:

```sh
# Filter by author
git log --author="John Doe"

# Filter by committer
git log --committer="Jane Smith"

# Filter by commit message
git log --grep="bugfix"

# Filter by content changes
git log -S"function_name"  # Search for added/removed string
git log -G"regex_pattern"  # Search for added/removed pattern

# Filter by file
git log -- path/to/file.txt

# Filter by changes to a specific function
git log -L :function_name:path/to/file.c
```

### Graphical Log Views

Visualize branching history:

```sh
# Show textual graph of commits
git log --graph

# Combine with oneline format
git log --graph --oneline

# Decorative graph showing branches and tags
git log --graph --oneline --decorate

# Show all branches
git log --graph --oneline --decorate --all
```

Example advanced graph log alias:

```sh
git config --global alias.logline "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
# Use as: git logline
```

---

## Examining Changes

### Basic Diff Usage

The `git diff` command shows differences between various states:

```sh
# Show unstaged changes (working directory vs staging area)
git diff

# Show staged changes (staging area vs last commit)
git diff --staged
# or
git diff --cached
```

### Comparing Working Directory and Staging Area

View differences between your current files and what's staged:

```sh
# Specific file differences
git diff [file]

# Show only names of changed files
git diff --name-only

# Show changed files with status
git diff --name-status
```

### Comparing with Repository State

Compare working directory or staging area with a committed version:

```sh
# Compare working directory with last commit
git diff HEAD

# Compare working directory with specific commit
git diff 7d9a5b2

# Compare staging area with specific commit
git diff --staged 7d9a5b2
```

### Comparing Commits

Compare any two commits:

```sh
# Compare two commits
git diff 7d9a5b2 af92c7d

# Compare with ancestor using ^
git diff 7d9a5b2^ 7d9a5b2

# Compare with ancestor using ~
git diff HEAD~3 HEAD
```

### Comparing Branches

Compare branches or other references:

```sh
# Compare two branches
git diff main feature-branch

# Compare branch with current branch
git diff feature-branch

# Compare the tips of two branches
git diff main..feature-branch

# Show what's in feature-branch that's not in main
git diff main...feature-branch
```

> ⚠️ **Note**: The difference between `..` and `...` is subtle but important. Double dots (`..`) compare exactly two points, while triple dots (`...`) compare the third reference with the merge base of the first two references.

### Comparing Specific Files

Limit diff output to specific files:

```sh
# Compare specific file across branches
git diff main feature-branch -- path/to/file.txt

# Compare file with specific commit
git diff 7d9a5b2 -- path/to/file.txt

# Multiple files
git diff main feature-branch -- file1.txt file2.js
```

### Diff Formatting Options

Control diff output format:

```sh
# Show word differences instead of line
git diff --word-diff

# Context lines (default is 3)
git diff -U5  # Show 5 lines of context

# Generate patch file
git diff > changes.patch

# Show stats summary
git diff --stat

# Show changes in color
git diff --color
```

---

## Advanced History Inspection

### Blame: Finding Who Changed What

Track who changed each line of a file and when:

```sh
# See who changed each line in a file
git blame path/to/file.txt

# Only show specific lines
git blame -L 10,20 path/to/file.txt

# Ignore whitespace changes
git blame -w path/to/file.txt

# Show the filename and line number in original commit
git blame -C path/to/file.txt
```

### Show: Examining Specific Commits

View detailed information about commits:

```sh
# Show a specific commit
git show 7d9a5b2

# Show a specific file from a commit
git show 7d9a5b2:path/to/file.txt

# Show commits pointed to by a tag
git show v1.0.0

# Show the changes introduced by a commit
git show 7d9a5b2 --stat
```

### Rev-List: Raw History Access

List commit objects with powerful filtering:

```sh
# List commit SHAs in a range
git rev-list HEAD~10..HEAD

# Count commits
git rev-list --count main

# List commits not reachable from main
git rev-list feature-branch --not main
```

### Log with Patches

Show code changes within the log:

```sh
# Show logs with the patch/diff for each commit
git log -p

# Show logs with patch for a specific file
git log -p path/to/file.txt

# Find when a specific string was added/removed
git log -p -S"search string" path/to/file.txt
```

### Following File History

Track a file's complete history, including renames:

```sh
# Show history of a file, following renames
git log --follow path/to/file.txt

# Show diffs for each change of the file
git log --follow -p path/to/file.txt
```

---

## Searching Project History

### Finding Commits with Specific Content

Search for changes that add or remove specific text:

```sh
# Find commits that add or remove string
git log -S"search string"

# Find commits that match a regular expression
git log -G"regex pattern"

# Search with pickaxe in a specific file
git log -S"search string" -- path/to/file.txt
```

### Finding Commits by Author

Filter commits by who created them:

```sh
# Find commits by author email
git log --author="user@example.com"

# Find commits by author name
git log --author="John Doe"

# Use regular expression to match author
git log --author="John\|Jane"
```

### Finding When Something Was Introduced

Determine when a feature or bug was introduced:

```sh
# Binary search for first bad commit
git bisect start
git bisect bad    # Current commit is bad
git bisect good v1.0.0  # v1.0.0 was good
# Git will checkout commits for you to test
# For each commit, mark as good or bad
git bisect good  # or
git bisect bad
# Eventually Git will identify the first bad commit
git bisect reset  # Return to original state

# Find which commit introduced changes to specific lines
git blame -L 10,15 path/to/file.txt
```

---

## History Visualization Tools

### Command Line Visualizers

Create better visualizations in the terminal:

```sh
# Simple ASCII graph
git log --graph --oneline --all

# More detailed ASCII graph
git log --graph --abbrev-commit --decorate --date=relative --all
```

### GUI Tools

Built-in and third-party visualization tools:

```sh
# Launch built-in GUI visualizer
git gui

# Launch gitk history browser
gitk --all

# Other popular tools:
# - GitKraken
# - SourceTree
# - GitHub Desktop
# - VSCode Git Graph extension
```

### Creating Git Aliases for Custom Visualizations

Set up custom command shortcuts:

```sh
# Create a detailed log graph alias
git config --global alias.graph "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative"

# Use it with: git graph
```

---

## History Navigation Techniques

### Navigating Between Commits

Move through history without changing working directory:

```sh
# Specify a commit using its hash
git show 7d9a5b2

# Refer to ancestors
git show HEAD^    # Parent of HEAD
git show HEAD~3   # Three commits back from HEAD

# Refer to merge parents
git show HEAD^1   # First parent of a merge commit
git show HEAD^2   # Second parent of a merge commit
```

### Finding Branches Containing a Commit

Identify which branches include a specific commit:

```sh
# Show local branches containing a commit
git branch --contains 7d9a5b2

# Include remote branches
git branch -r --contains 7d9a5b2

# Show all branches (local and remote)
git branch -a --contains 7d9a5b2
```

### Finding Merge Bases

Find the common ancestor of two commits:

```sh
# Find common ancestor of two branches
git merge-base main feature-branch

# Find the best common ancestor(s)
git merge-base --all main feature-branch
```

### Identifying Important Changes

Focus on significant changes in history:

```sh
# Find commits modifying a function
git log -L :function_name:file.c

# Find when lines were added
git blame -L 10,20 path/to/file.txt

# Find changes to a specific part of code
git log -p -S"function_name" -- path/to/file.c
```

---

## Command Summary

| Operation | Command | Description |
|-----------|---------|-------------|
| Basic History | `git log` | View commit history |
| One-line History | `git log --oneline` | Compact history view |
| Graph View | `git log --graph --oneline` | Visual history tree |
| File History | `git log -- file.txt` | History for specific file |
| Show Changes | `git log -p` | Show patches with log |
| Who Changed Lines | `git blame file.txt` | See who changed each line |
| Unstaged Changes | `git diff` | View working dir changes |
| Staged Changes | `git diff --staged` | View staged changes |
| Between Commits | `git diff commit1 commit2` | Compare two commits |
| Between Branches | `git diff branch1 branch2` | Compare two branches |
| Commit Details | `git show commit-hash` | View specific commit |
| Search Content | `git log -S"string"` | Find string in history |

---

## Related Topics

- [Essential everyday Git commands and workflows](02-basic-usage.md)
- [Combining branches with merge and rebase operations](04-merging-rebasing.md)
- [Marking release points and version management](07-tags-releases.md)
- [Solving common Git problems](10-troubleshooting.md)
- [Advanced Git techniques and features](11-advanced-topics.md)

---

*Next: [Git configuration and command shortcuts](09-config-aliases.md)*
