# Advanced Git Techniques

*Elevate your Git mastery with powerful advanced techniques that enhance productivity and provide deeper insight into your repositories.*

---

## Git Hooks and Automation

Git hooks are scripts that automatically run before or after specific Git events like commit, push, or merge.

### Client-side Hooks

Client-side hooks run on your local machine:

```sh
# Common client-side hooks and locations (.git/hooks/)
pre-commit       # Run before a commit is finalized
prepare-commit-msg  # Edit default commit message
commit-msg      # Validate commit messages
post-commit     # Run after a commit is completed
pre-rebase      # Run before rebasing
post-checkout   # Run after checkout or switch
pre-push        # Run before pushing changes
```

Example `pre-commit` hook to check for trailing whitespace:

```bash
#!/bin/sh
# .git/hooks/pre-commit

git diff --cached --name-only --diff-filter=ACM | while read file; do
    # Check for trailing whitespace
    if grep -q '[[:blank:]]$' "$file"; then
        echo "Error: Trailing whitespace found in $file"
        exit 1
    fi
done
```

### Server-side Hooks

Server-side hooks run on remote repositories:

```sh
# Common server-side hooks (.git/hooks/ on server)
pre-receive       # Run before refs are updated
update            # Per-branch security check
post-receive      # Run after entire push completes
```

Example `post-receive` hook to trigger CI/CD:

```bash
#!/bin/bash
# .git/hooks/post-receive

while read oldrev newrev ref
do
    branch=$(echo $ref | cut -d'/' -f3)
    if [ "$branch" = "main" ]; then
        echo "Deploying main branch..."
        # Deployment script logic here
        /path/to/deploy_script.sh
    fi
done
```

### Creating Custom Hooks

1. Create a script in `.git/hooks/` with the appropriate name
2. Make it executable
3. Write the script in any language (bash, Python, Ruby, etc.)

```sh
# Create and make executable
touch .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Sharing Hooks

Hooks aren't cloned with repositories, but can be shared using:

```sh
# Set a shared hooks directory
git config core.hooksPath '/path/to/shared/hooks'

# Initialize templates with hooks
git config --global init.templateDir '~/.git-templates'
mkdir -p ~/.git-templates/hooks
# Add your hooks to this directory
```

> 💡 **Tip**: Consider using tools like [Husky](https://github.com/typicode/husky) or [pre-commit](https://pre-commit.com/) for more manageable Git hooks.

---

## Git Internals

Understanding Git's internal data model helps you leverage its full power.

### Object Types

Git stores four types of objects:

```plaintext
┌─────────┬───────────────────────────┐
│ Object  │ Description               │
├─────────┼───────────────────────────┤
│ blob    │ File content              │
│ tree    │ Directory listing         │
│ commit  │ Commit metadata and tree  │
│ tag     │ Named reference to object │
└─────────┴───────────────────────────┘
```

### References

References are pointers to commits:

```sh
# Examine references
git show-ref           # Show all references
git symbolic-ref HEAD  # Show what HEAD points to
```

Core references:

- HEAD: Current active reference
- refs/heads/: Local branches
- refs/remotes/: Remote branches
- refs/tags/: Tags

### The Git Database

Git stores objects in `.git/objects`:

```sh
# List all objects
find .git/objects -type f | sort

# Create and view raw objects
echo 'test content' | git hash-object -w --stdin
# Returns a hash like: a8a940627d132695a9769df4f5c48254c6b310f5

# View the content of an object
git cat-file -p a8a940627d132695a9769df4f5c48254c6b310f5
```

### Packfiles

Git optimizes storage by packing objects:

```sh
# Force Git to create a packfile
git gc

# List packed objects
git verify-pack -v .git/objects/pack/pack-*.idx

# See where an object is stored
git rev-list --objects --all | grep a8a940
```

### Inspecting Git Objects

Examine Git's internal data:

```sh
# Display commits with their trees
git log --pretty=raw

# Display a specific tree
git ls-tree HEAD

# Show a specific commit's metadata
git cat-file -p HEAD

# Display a specific file's blob object
git hash-object path/to/file
git cat-file -p $(git hash-object path/to/file)
```

> 💡 **Tip**: Understanding Git's object model helps with advanced operations like history rewriting and recovery.

---

## Submodules and Subtrees

Manage external dependencies within your Git repository.

### Working with Submodules

Submodules are repositories nested within a repository:

```sh
# Add a submodule
git submodule add https://github.com/username/repo path/to/submodule

# Clone a repository with submodules
git clone --recurse-submodules https://github.com/username/main-repo

# Initialize submodules in an existing checkout
git submodule init
git submodule update

# Combined update and init
git submodule update --init --recursive

# Update all submodules to latest
git submodule update --remote

# Execute a command in each submodule
git submodule foreach 'git checkout main && git pull'
```

### Working with Subtrees

Subtrees merge external repositories into a subdirectory:

```sh
# Add a subtree
git subtree add --prefix=path/to/subtree https://github.com/username/repo main --squash

# Update a subtree
git subtree pull --prefix=path/to/subtree https://github.com/username/repo main --squash

# Push changes back to subtree remote
git subtree push --prefix=path/to/subtree https://github.com/username/repo main
```

### Choosing Between Submodules and Subtrees

| Feature | Submodules | Subtrees |
|---------|------------|----------|
| Workflow | External repositories remain separate | External code merged into your repo |
| Tracking | Points to a specific commit | Full history can be included |
| Updates | Manual update required | Can pull upstream changes |
| Learning curve | Steeper | Simpler for users |
| Best for | Fixed dependencies | Libraries you might modify |

> ⚠️ **Warning**: Submodules point to specific commits. If the remote repository is deleted or commits are garbage collected, you might lose access to the code.

---

## Bisect and Blame

Find where and when specific changes were introduced.

### Using Git Bisect

Binary search through history to find bug-introducing commits:

```sh
# Start a bisect session
git bisect start

# Mark the current version as bad (has the bug)
git bisect bad

# Mark a known good commit (no bug)
git bisect good v1.0

# Git checks out a middle commit
# Test the application, then mark the commit
git bisect good  # If this commit doesn't have the bug
# OR
git bisect bad   # If this commit has the bug

# Continue until Git identifies the first bad commit
# When done, reset to your original state
git bisect reset
```

Automate the process with a test script:

```sh
# Automate the bisect process
git bisect start HEAD v1.0
git bisect run ./test_script.sh
```

### Using Git Blame

Track changes to specific lines:

```sh
# Show who changed each line in a file
git blame path/to/file

# Limit to specific line range
git blame -L 10,20 path/to/file

# Ignore whitespace changes
git blame -w path/to/file

# Show the boundary commits
git blame -b path/to/file

# Move lines within a file detection
git blame -M path/to/file

# Move lines between files detection
git blame -C path/to/file
```

### Advanced Annotation Techniques

More ways to trace changes:

```sh
# Combine log and diff for deeper investigation
git log -p path/to/file

# See all commits affecting a specific line range
git log -L 10,20:path/to/file

# Track a specific function's history
git log -L :functionName:path/to/file

# Find who changed a line that no longer exists
git log -S "deleted text" -- path/to/file
```

> 💡 **Tip**: Combine bisect and blame when investigating complex bugs: use bisect to find when the bug was introduced, then blame to see who wrote the code.

---

## Advanced History Rewriting

Modify your Git history for cleaner commits and better project organization.

### Interactive Rebase

Fine-grained control over commit history:

```sh
# Interactive rebase for the last 5 commits
git rebase -i HEAD~5

# Interactive rebase from a specific commit
git rebase -i 7abc123^
```

Interactive rebase commands:

- `pick` - Keep the commit
- `reword` - Change commit message
- `edit` - Pause for changes
- `squash` - Combine with previous commit (keep both messages)
- `fixup` - Combine with previous commit (discard message)
- `drop` - Remove the commit
- `exec` - Run a command after each step

Advanced rebase options:

```sh
# Automatically squash/fixup commits marked as such
git rebase -i --autosquash HEAD~5

# Continue after resolving conflicts
git rebase --continue

# Skip the current commit during rebase
git rebase --skip

# Abort the entire rebase operation
git rebase --abort
```

### Filter-branch

Rewrite large sections of history:

```sh
# Remove a specific file from all commits
git filter-branch --tree-filter 'rm -f path/to/large-file' HEAD

# Remove a file only from past history, not recent commits
git filter-branch --index-filter 'git rm --cached --ignore-unmatch path/to/file' HEAD

# Change author info globally
git filter-branch --env-filter '
    if [ "$GIT_AUTHOR_EMAIL" = "old@example.com" ]; then
        export GIT_AUTHOR_EMAIL="new@example.com"
        export GIT_AUTHOR_NAME="New Name"
    fi
    if [ "$GIT_COMMITTER_EMAIL" = "old@example.com" ]; then
        export GIT_COMMITTER_EMAIL="new@example.com"
        export GIT_COMMITTER_NAME="New Name"
    fi
' --tag-name-filter cat -- --all
```

> ⚠️ **Warning**: `filter-branch` is powerful but slow. Modern Git recommends `git filter-repo` instead.

### Git Filter-repo

A faster, more powerful alternative to filter-branch:

```sh
# First, install git-filter-repo

# Remove a specific file from history
git filter-repo --path path/to/large-file --invert-paths

# Replace email addresses
git filter-repo --email-callback 'return email.replace(b"old@example.com", b"new@example.com")'

# Set a mailmap
git filter-repo --mailmap ../mailmap.txt
```

### Rewriting Author Information

Change commit authorship:

```sh
# Amend the last commit with new author info
git commit --amend --author="New Author <email@example.com>"

# Change author info during interactive rebase
# Mark a commit for edit, then:
git commit --amend --author="New Author <email@example.com>" --no-edit
git rebase --continue

# Use git-filter-repo for bulk changes
git filter-repo --name-callback 'return name.replace(b"Old Name", b"New Name")'
```

> ⚠️ **Warning**: Rewriting history changes commit IDs. Never rewrite history that's been shared with others unless you've coordinated with them.

---

## Patches and Bundles

Git provides tools for exchanging changes outside of typical remote workflows.

### Creating and Applying Patches

Share changes via patch files:

```sh
# Create a patch from the last commit
git format-patch -1

# Create patches for all commits not in main
git format-patch main

# Create a patch series with cover letter
git format-patch -n master --cover-letter

# Apply a patch
git apply path/to/patch.patch  # Without committing
git am path/to/patch.patch     # Apply and create commit

# Apply a mailbox of patches
git am path/to/patches/*.patch

# Handle patch application conflicts
git am --abort     # Abort the patch application
git am --skip      # Skip the current patch
git am --continue  # Continue after resolving conflicts
```

### Working with Git Bundles

Transport commits without a remote server:

```sh
# Create a bundle of all commits
git bundle create repo.bundle --all

# Create a bundle of commits not in a remote
git bundle create commits.bundle origin/main..HEAD

# Verify a bundle
git bundle verify commits.bundle

# List commits in a bundle
git bundle list-heads commits.bundle

# Clone from a bundle
git clone -b main commits.bundle new-repo

# Pull from a bundle
git pull commits.bundle main
```

### Email-based Workflows

Send and receive changes via email:

```sh
# Configure Git for email
git config --global sendemail.smtpserver smtp.example.com
git config --global sendemail.smtpuser username

# Send patches via email
git format-patch -1 --stdout | git send-email --to=recipient@example.com

# Send a patch series
git send-email *.patch --cover-letter --annotate

# Apply emailed patches
git am < received-patch.patch
```

> 💡 **Tip**: Patches and bundles are useful for offline collaboration or when working with contributors who don't have direct repository access.

---

## Advanced Searching and Filtering

Find specific changes and code in large repositories.

### Advanced Log Filtering

Filter commit history with precision:

```sh
# Show commits matching a pattern
git log --grep="bug fix"

# Case-insensitive search
git log --grep="feature" --regexp-ignore-case

# Filter by author
git log --author="Jane Smith"

# Filter by committer
git log --committer="John Doe"

# Filter by date range
git log --since="2023-01-01" --until="2023-01-31"

# Filter by file
git log -- path/to/file.js

# Filter by content changes
git log -S"function getName" --patch

# Show only merge commits
git log --merges

# Show commits that added or removed a specific string
git log -p -S"SearchString"
```

### Git Grep

Search the working directory:

```sh
# Search for a pattern in tracked files
git grep "TODO"

# Show line numbers
git grep -n "TODO"

# Search only specific files
git grep "function" -- "*.js"

# Case-insensitive search
git grep -i "error"

# Show context lines around matches
git grep -A 2 -B 2 "important function"

# Search across all branches
git grep "TODO" $(git show-ref --heads)
```

### Searching Commit Content

Find when a specific code pattern was introduced:

```sh
# Search through commit diffs
git log -p -S"function getUserData" --all

# Search using regex
git log -p -G"user[A-Z][a-z]+Data" --all

# Find when a specific line was changed
git log -L '/function start/,/function end/':file.js
```

### Pickaxe Search

Track the evolution of specific code:

```sh
# Find when a string was added or removed
git log -S"importantString" --oneline

# Find commits that changed the number of occurrences of a string
git log -G"pattern" --patch

# Combine with author filter
git log -S"SecurityFix" --author="Security Team" --patch
```

> 💡 **Tip**: For complex searches, combine multiple search flags to narrow down results.

---

## Git Attributes and Features

Configure special handling for different file types.

### Setting Attributes

Git attributes control how Git handles specific files:

```sh
# Create a .gitattributes file
touch .gitattributes

# Common .gitattributes entries
*.txt text
*.png binary
*.jpg binary
*.sh text eol=lf
*.bat text eol=crlf
```

### Keyword Expansion

Set up RCS-style keyword expansion:

```sh
# In .gitattributes
*.txt ident

# In the text file, use:
# $Id$
# $Date$
```

Enabling ident filter:

```sh
git config --global filter.indent.clean "sed -e 's/\$Id[^$]*\\$/\$Id\\$/'"
git config --global filter.indent.smudge "sed -e 's/\$Id\\$/\$Id: $(git describe)\\$/'"
```

### Export-ignore

Exclude files from archives:

```sh
# In .gitattributes - exclude from git archive
/tests export-ignore
/.github export-ignore
/docs export-ignore
.gitignore export-ignore
.gitattributes export-ignore
```

### Merge Strategies

Define custom merge strategies:

```sh
# In .gitattributes
database.xml merge=ours

# Configure Git to use the strategy
git config merge.ours.driver "true"
```

Common merge drivers:

- `ours` - Always keep our version
- `theirs` - Always keep their version
- `union` - Include both versions (for text files)

### Diff Drivers

Configure how Git generates diffs for special files:

```sh
# In .gitattributes
*.png diff=exif

# Configure the diff driver
git config diff.exif.textconv exiftool
```

Example diff drivers:

```sh
# Word documents
*.docx diff=word
git config diff.word.textconv "docx2txt < \"$1\""

# PDF documents
*.pdf diff=pdf
git config diff.pdf.textconv "pdftotext \"$1\" -"
```

> 💡 **Tip**: Git attributes can dramatically improve the handling of binary files and specialized file formats. They can also enforce consistent line endings across teams.

---

## Working with Monorepos

Techniques for managing large repositories with multiple projects.

### Sparse Checkouts

Check out only parts of a repository:

```sh
# Enable sparse checkout
git config core.sparseCheckout true

# Define what to check out
echo "path/to/include/" >> .git/info/sparse-checkout
echo "another/path/" >> .git/info/sparse-checkout
echo "!path/to/exclude/" >> .git/info/sparse-checkout

# Update working directory
git read-tree -mu HEAD

# Using cone mode (Git 2.25+)
git sparse-checkout init --cone
git sparse-checkout set path/to/include another/path
```

### Partial Clones

Clone only part of a repository:

```sh
# Exclude blobs (file contents) at clone time
git clone --filter=blob:none https://github.com/user/repo.git

# Exclude trees (directories) for single branch
git clone --filter=tree:0 --single-branch https://github.com/user/repo.git

# Filter with blobless option (Git 2.27+)
git clone --filter=blob:none --also-filter-submodules https://github.com/user/repo.git

# Fetch file content on demand
git rev-list --objects --all --filter=blob:limit=1m
```

### Git Extensions for Large Repos

Tools to help manage large repositories:

```sh
# Git LFS setup
git lfs install
git lfs track "*.psd"
git lfs track "*.zip"
git add .gitattributes
git add file.psd
git commit -m "Add large file"

# VFS for Git (previously GVFS) for extremely large repos
# This is a specialized system used by very large projects
```

> 💡 **Tip**: For monorepos, consider implementing project-specific hooks and CI workflows to isolate changes and testing.

---

## Custom Git Commands

Create your own Git commands for specialized workflows.

### Creating Custom Commands

Make new Git commands with aliases or scripts:

```sh
# Create an alias command
git config --global alias.new-command '!git command1 && git command2'

# Create a Git command script
# 1. Create a script file named git-custom-cmd
#!/bin/bash
# Script content here

# 2. Make it executable
chmod +x git-custom-cmd

# 3. Place it on your PATH
# Now you can use: git custom-cmd
```

### Useful Custom Commands

Example custom commands:

```sh
# Show a compact log with graph
git config --global alias.compact-log 'log --graph --pretty=format:"%C(yellow)%h%Creset %C(blue)%an%Creset:%C(red)%d%Creset %s %C(green)(%cr)%Creset" --abbrev-commit'

# Show all uncommitted changes
git config --global alias.changes '!git diff && git diff --staged'

# List all aliases
git config --global alias.aliases '!git config --get-regexp "^alias\\." | sed -e "s/^alias\\.//g" -e "s/\\ /\\ =\\ /g"'

# See last 10 commits in a pretty format
git config --global alias.recent 'log -10 --pretty=format:"%h %ad | %s%d [%an]" --graph --date=short'
```

### Extending Git

More advanced extensions:

```sh
# Create a Git extension for complex operations
cat > ~/bin/git-find-merge <<EOF
#!/bin/bash
commit=\$1
for branch in \$(git for-each-ref --format="%(refname)" refs/heads); do
    if git rev-list \$branch | grep -q "\$commit"; then
        echo \$branch
    fi
done
EOF
chmod +x ~/bin/git-find-merge

# Usage
git find-merge 7abc123
```

> 💡 **Tip**: Custom commands can greatly streamline team-specific or project-specific workflows. Share them with your team for consistent processes.

---

## Advanced Branch Management

Advanced techniques for branch organization and management.

### Orphan Branches

Create branches with no connection to existing history:

```sh
# Create an orphan branch
git checkout --orphan new-branch

# Clean the working directory
git rm -rf .

# Create new content and commit
echo "New content" > file.txt
git add file.txt
git commit -m "Initial commit in orphan branch"
```

Use cases:

- GitHub Pages branches (`gh-pages`)
- Separate documentation history
- Starting fresh without previous baggage

### Worktrees

Work on multiple branches simultaneously without switching:

```sh
# Add a new worktree
git worktree add ../path/to/worktree branch-name

# Add a new worktree with a new branch
git worktree add -b new-branch ../path/to/worktree main

# List worktrees
git worktree list

# Remove a worktree
git worktree remove ../path/to/worktree

# Prune worktree information
git worktree prune
```

### Reference Specifications

Advanced refspec usage:

```sh
# Push a local branch to a differently named remote branch
git push origin local-branch:remote-branch

# Delete a remote branch
git push origin :branch-to-delete

# Pull a remote branch to a differently named local branch
git pull origin remote-branch:local-branch

# Fetch all branches
git fetch origin '+refs/heads/*:refs/remotes/origin/*'

# Fetch pull requests from GitHub
git fetch origin '+refs/pull/*/head:refs/remotes/origin/pr/*'
```

### Namespaces

Organize refs with namespaces:

```sh
# Create a namespaced tag
git tag refs/namespaces/project/tags/v1.0

# Create a namespaced branch
git branch refs/namespaces/experiment/branches/feature

# Push namespaced refs
git push origin 'refs/namespaces/project/*:refs/namespaces/project/*'
```

> 💡 **Tip**: Worktrees are especially useful for quickly switching context, like fixing a bug while in the middle of developing a feature, without stashing changes.

---

## Performance Optimization

Techniques to make Git operations faster and more efficient.

### Repository Maintenance

Keep your repository efficient:

```sh
# Remove unnecessary files
git gc

# More aggressive optimization
git gc --aggressive

# Optimize how files are stored
git repack -a -d

# Prune unreachable objects immediately
git prune

# Verify the database integrity
git fsck

# Count objects for size information
git count-objects -v
```

### Shallow Clones and Sparse Checkouts

Optimize Git for large repositories:

```sh
# Shallow clone (only recent history)
git clone --depth=1 https://github.com/user/repo.git

# Fetch additional history later
git fetch --unshallow

# Fetch specific depth
git fetch --depth=100

# Sparse checkout (only specific directories)
git sparse-checkout set dir1/ dir2/
```

### Optimizing Git Config

Settings to improve performance:

```sh
# Faster status operations
git config --global core.untrackedCache true
git config --global core.fsmonitor true

# Parallel operations
git config --global submodule.fetchJobs 8
git config --global fetch.parallel 8

# Reuse recorded resolutions
git config --global rerere.enabled true

# Delta compression options
git config --global core.preloadIndex true
git config --global core.deltaBaseCacheLimit 2g
```

> 💡 **Tip**: Periodic maintenance (`git gc` and `git prune`) keeps your repository lean and operations fast. Schedule these as regular tasks for large repositories.

---

## Command Summary

| Command | Description | Example |
|---------|-------------|---------|
| `git hook` | Automation scripts | `.git/hooks/pre-commit` |
| `git cat-file` | Inspect Git objects | `git cat-file -p HEAD` |
| `git submodule` | Manage external repos | `git submodule add https://github.com/user/repo` |
| `git subtree` | Merge external repos | `git subtree add --prefix=lib https://github.com/user/repo main` |
| `git bisect` | Find buggy commit | `git bisect start; git bisect bad; git bisect good v1.0` |
| `git blame` | Show who changed lines | `git blame -L 10,20 file.txt` |
| `git rebase -i` | Interactive history editing | `git rebase -i HEAD~5` |
| `git filter-repo` | Rewrite history | `git filter-repo --path path/to/remove --invert-paths` |
| `git format-patch` | Create patch files | `git format-patch -1 HEAD` |
| `git am` | Apply patches | `git am < patch-file.patch` |
| `git bundle` | Create portable repos | `git bundle create repo.bundle --all` |
| `git grep` | Search code | `git grep -n "TODO"` |
| `git worktree` | Multiple working dirs | `git worktree add ../feature feature-branch` |
| `git gc` | Repository maintenance | `git gc --aggressive` |
| `git sparse-checkout` | Partial directory checkout | `git sparse-checkout set path/to/dir` |

---

## Related Topics

- [Solving common Git problems](troubleshooting.md)
- [Established Git workflows for teams](development-workflows.md)
- [Automating tasks with GitHub Actions](github-actions.md)

---

*Next: [Established Git workflows for teams](development-workflows.md)*
