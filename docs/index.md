# Git Cheats

*A categorized compendium of the most useful, commonly referenced git commands, workflows, and tips for daily use and troubleshooting.*

Hand-crafted with ❤️ for rapid reference.

Not intended as a replacement for the [official git documentation](https://git-scm.com/doc)

---

## Quick Command Reference

### Setup & Configuration

#### Check Git Version

Verify your Git installation

```bash
git --version
```

#### Set Identity

Configure your name for commits

```bash
git config --global user.name "Your Name"
```

Configure your email for commits

```bash
git config --global user.email "your.email@example.com"
```

#### Editor Configuration

Set VS Code as default editor

```bash
git config --global core.editor "code --wait"
```

Set Vim as default editor

```bash
git config --global core.editor "vim"
```

Set Notepad++ as default editor

```bash
git config --global core.editor "'C:/Program Files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"
```

Set Sublime Text as default editor

```bash
git config --global core.editor "'subl' -w"
```

#### View Configuration

Display all configurations

```bash
git config --list
```

View a specific config value

```bash
git config user.name
```

#### Configuration Scopes

System-wide configuration (all users)

```bash
git config --system <key> <value>
```

User configuration (current user)

```bash
git config --global <key> <value>
```

Repository configuration (current repo only)

```bash
git config --local <key> <value>
```

### Repository Operations

#### Create New Repository

Initialize a new Git repository in current directory

```bash
git init
```

#### Clone Existing Repository

Clone via HTTPS

```bash
git clone https://github.com/username/repository.git
```

Clone via SSH

```bash
git clone git@github.com:username/repository.git
```

Clone to specific directory

```bash
git clone https://github.com/username/repository.git my-project
```

Clone specific branch

```bash
git clone -b branch-name https://github.com/username/repository.git
```

Clone with limited history (shallow clone)

```bash
git clone --depth=1 https://github.com/username/repository.git
```

#### Ignore Files

Create gitignore file to specify ignored files

```bash
touch .gitignore
```

### Basic Workflow

#### Check Status

View repository status

```bash
git status
```

View condensed status output

```bash
git status -s
```

#### Stage Changes

Stage a specific file

```bash
git add filename.txt
```

Stage all changes

```bash
git add .
```

Stage all changes (including deleted files)

```bash
git add -A
```

Stage changes interactively

```bash
git add -p
```

#### Commit Changes

Commit with a message

```bash
git commit -m "Description of changes"
```

Add tracked files and commit in one step

```bash
git commit -am "Description of changes"
```

Amend the previous commit

```bash
git commit --amend
```

#### View Changes

Show unstaged changes

```bash
git diff
```

Show staged changes

```bash
git diff --staged
```

Show changes by filename only

```bash
git diff --name-only
```

#### Undo Changes

Restore file from HEAD

```bash
git restore filename.txt
```

Unstage changes (keep in working directory)

```bash
git restore --staged filename.txt
```

Restore file from a specific commit

```bash
git restore --source=HEAD~1 filename.txt
```

#### File Operations

Remove files from Git and filesystem

```bash
git rm filename.txt
```

Remove files from Git but keep in filesystem

```bash
git rm --cached filename.txt
```

Remove directory recursively

```bash
git rm -r directory
```

Move or rename files

```bash
git mv oldname.txt newname.txt
```

### Branching & Merging

#### Branch Management

Create a new branch

```bash
git branch branch-name
```

Create and switch to new branch

```bash
git checkout -b branch-name
```

Alternative to create and switch to new branch (Git 2.23+)

```bash
git switch -c branch-name
```

List local branches

```bash
git branch
```

List all branches (local and remote)

```bash
git branch -a
```

Switch to an existing branch

```bash
git checkout branch-name
```

Alternative to switch branches (Git 2.23+)

```bash
git switch branch-name
```

Delete a branch (safe, prevents deletion of unmerged branches)

```bash
git branch -d branch-name
```

Force delete a branch

```bash
git branch -D branch-name
```

Rename current branch

```bash
git branch -m new-name
```

Rename specific branch

```bash
git branch -m old-name new-name
```

Push and track branch

```bash
git push -u origin branch-name
```

Compare branches

```bash
git diff branch1..branch2
```

#### Merging

Merge a branch into current branch

```bash
git merge branch-name
```

Merge with no fast-forward (always creates merge commit)

```bash
git merge --no-ff branch-name
```

Merge and squash commits into a single one

```bash
git merge --squash branch-name
```

Abort an in-progress merge

```bash
git merge --abort
```

#### Rebasing

Rebase current branch onto another

```bash
git rebase branch-name
```

Interactive rebase for editing commits

```bash
git rebase -i commit-hash
```

Continue rebase after resolving conflicts

```bash
git rebase --continue
```

#### Cherry-picking

Apply a specific commit to current branch

```bash
git cherry-pick commit-hash
```

#### Handle Conflicts

Get a specific file from another branch

```bash
git checkout branch-name -- filename
```

List conflicting files

```bash
git diff --name-only --diff-filter=U
```

### Remote Operations

#### Remote Management

Add a remote repository

```bash
git remote add origin https://github.com/username/repo.git
```

List all remotes with URLs

```bash
git remote -v
```

#### Sync with Remotes

Download remote data without merging

```bash
git fetch origin
```

Download and merge from remote

```bash
git pull origin branch-name
```

Download and rebase instead of merging

```bash
git pull --rebase origin branch-name
```

Upload local commits to remote

```bash
git push origin branch-name
```

Push and set up tracking

```bash
git push -u origin branch-name
```

Delete a remote branch

```bash
git push origin --delete branch-name
```

List remote branches

```bash
git branch -r
```

### Stash & Clean

#### Stash Management

Save working changes temporarily

```bash
git stash
```

List all stashes

```bash
git stash list
```

Show stash details

```bash
git stash show -p
```

Apply stash without removing it

```bash
git stash apply
```

Apply and remove stash

```bash
git stash pop
```

Remove a stash

```bash
git stash drop
```

Remove all stashes

```bash
git stash clear
```

Stash specific files only

```bash
git stash push file1.txt file2.txt
```

Stash with a descriptive message

```bash
git stash push -m "Work in progress on feature X"
```

#### Working Directory Cleanup

Preview what would be removed

```bash
git clean -n
```

Remove untracked files

```bash
git clean -f
```

Remove untracked files and directories

```bash
git clean -fd
```

### History & Inspection

#### View History

Show commit history

```bash
git log
```

Show compact history

```bash
git log --oneline
```

Show history with branch graph

```bash
git log --graph --oneline
```

Show history for a specific file

```bash
git log -- filename.txt
```

Show history with changes

```bash
git log -p
```

#### Inspect Changes

See who changed each line in a file

```bash
git blame filename.txt
```

Show changes between working directory and HEAD

```bash
git diff
```

Show changes between staged and HEAD

```bash
git diff --staged
```

Compare two commits

```bash
git diff commit1 commit2
```

Compare two branches

```bash
git diff branch1 branch2
```

Show details of a specific commit

```bash
git show commit-hash
```

Search for specific content in history

```bash
git log -S"search string"
```

### Tags & Releases

#### Tag Management

Create a lightweight tag

```bash
git tag v1.0.0
```

Create an annotated tag

```bash
git tag -a v1.0.0 -m "Version 1.0.0"
```

List all tags

```bash
git tag
```

Show tag details

```bash
git show v1.0.0
```

Push specific tag to remote

```bash
git push origin v1.0.0
```

Push all tags to remote

```bash
git push --tags
```

Delete a local tag

```bash
git tag -d v1.0.0
```

Delete a remote tag

```bash
git push origin --delete v1.0.0
```

Checkout a tagged version

```bash
git checkout v1.0.0
```

Create a tag for a previous commit

```bash
git tag v0.9.0 commit-hash
```

### Troubleshooting

#### Fix Mistakes

Modify the last commit

```bash
git commit --amend
```

Undo last commit but keep changes staged

```bash
git reset --soft HEAD~1
```

Undo last commit and unstage changes

```bash
git reset HEAD~1
```

Discard all local changes

```bash
git reset --hard HEAD
```

View reference history log

```bash
git reflog
```

Recover deleted work from reflog

```bash
git branch recover-branch HEAD@{1}
```

Cancel current merge operation

```bash
git merge --abort
```

Create branch when in detached HEAD state

```bash
git checkout -b new-branch
```

Force push with safety mechanism

```bash
git push --force-with-lease
```

Optimize repository

```bash
git gc --aggressive
```

### Advanced Usage

#### Git Hooks

Path to pre-commit hook

```bash
.git/hooks/pre-commit
```

#### Object Inspection

Examine Git objects

```bash
git cat-file -p HEAD
```

#### External Repositories

Add a submodule

```bash
git submodule add https://github.com/user/repo
```

Add a subtree

```bash
git subtree add --prefix=lib https://github.com/user/repo main
```

#### Debugging

Find the commit that introduced a bug

```bash
git bisect start
git bisect bad  # Mark current commit as bad
git bisect good v1.0  # Mark a known good commit
```

#### History Rewriting

Interactive history editing

```bash
git rebase -i HEAD~5
```

Rewrite complete history

```bash
git filter-repo --path path/to/remove --invert-paths
```

#### Patch Management

Create a patch file

```bash
git format-patch -1 HEAD
```

Apply a patch file

```bash
git am < patch-file.patch
```

#### Repository Management

Create a portable repository bundle

```bash
git bundle create repo.bundle --all
```

Search code in repository

```bash
git grep -n "TODO"
```

Create additional working directory

```bash
git worktree add ../feature feature-branch
```

Partial repository checkout

```bash
git sparse-checkout set path/to/dir
```

### Development Workflows

#### Feature Development

Start a new feature branch

```bash
git checkout -b feature/new-feature
```

Push new feature branch to remote

```bash
git push -u origin feature/new-feature
```

#### Working with Forks

Add original repository as upstream

```bash
git remote add upstream https://github.com/original/repo.git
```

Sync fork with original repository

```bash
git fetch upstream && git merge upstream/main
```

#### GitFlow Operations

Start a new feature using GitFlow

```bash
git flow feature start feature-name
```

Finish a feature using GitFlow

```bash
git flow feature finish feature-name
```

Start a new release using GitFlow

```bash
git flow release start 1.0.0
```

Finish a release using GitFlow

```bash
git flow release finish 1.0.0
```

Create a hotfix using GitFlow

```bash
git flow hotfix start 1.0.1
```

---

## Exploring Git Topics

**Git Fundamentals**

- [Setting up Git and initializing repositories](setup-and-init.md)
- [Essential everyday Git commands and workflows](basic-usage.md)

**Branch Management**

- [Creating, managing, and navigating branches](branching.md)
- [Combining branches with merge and rebase operations](merging-rebasing.md)

**Remote Collaboration**

- [Working with remote repositories (push, pull, fetch)](remote-operations.md)
- [Temporarily storing changes and cleaning working directory](stash-clean.md)

**Project History & Versions**

- [Marking release points and version management](tags-releases.md)
- [Viewing project history and comparing changes](logs-diffs-history.md)

**Customization & Troubleshooting**

- [Git configuration and command shortcuts](config-aliases.md)
- [Solving common Git problems](troubleshooting.md)

**Advanced Usage**

- [Advanced Git techniques and features](advanced-topics.md)
- [Established Git workflows for teams](development-workflows.md)
- [Automating tasks with GitHub Actions](github-actions.md)
- [Additional Git learning resources and references](resources.md)
