# Established Git Workflows for Teams

*Master proven Git collaboration strategies to enhance team productivity, code quality, and release management.*

---

## Understanding Git Workflows

### What is a Git Workflow?

A Git workflow is a recipe or recommendation for how to use Git to accomplish work in a consistent and productive manner. Workflows are guidelines rather than concrete rules, designed to:

- Coordinate team collaboration
- Ensure code quality and stability
- Streamline development and release processes
- Prevent conflicts during integration
- Maintain a clean, logical project history

### Choosing the Right Workflow

When selecting a workflow, consider:

1. Team size and experience with Git
2. Project complexity and release frequency
3. Deployment requirements
4. Integration with existing processes (CI/CD, reviews, etc.)
5. Need for supporting multiple production versions

### Core Workflow Elements

Most Git workflows share these core elements:

```plaintext
┌───────────────┐      ┌────────────────┐      ┌────────────────┐
│  Branch Model │  ──▶ │ Integration    │  ──▶ │ Release        │
│  How code     │      │ Strategy       │      │ Process        │
│  changes flow │      │ How changes    │      │ How to deploy  │
└───────────────┘      │ are combined   │      │ and version    │
                       └────────────────┘      └────────────────┘
```

---

## Centralized Workflow

### Overview and Use Cases

The Centralized Workflow uses a single `main` branch as the central repository for all changes, similar to traditional version control systems like SVN.

**Best suited for:**

- Teams transitioning from SVN or other centralized VCS
- Small teams with simple projects
- Projects with minimal parallel development

**Visual representation:**

```plaintext
main: A---B---C---D---E---F---G
                      ↑     ↑
                 Alice's   Bob's
                 change   change
```

### Implementation Steps

**Create/clone the central repository:**

```sh
# Initialize central repo (once)
git init --bare central-project.git

# Each developer clones the repo
git clone central-project.git
```

**Make local changes:**

```sh
# Edit files locally
git add changed-files
git commit -m "Description of changes"
```

**Synchronize with central repository:**

```sh
# Get latest changes
git pull origin main

# Push local commits
git push origin main
```

**Resolve conflicts if necessary:**

```sh
# When pull fails due to conflicts
git pull origin main
# Resolve conflicts manually
git add resolved-files
git commit -m "Merge and resolve conflicts"
git push origin main
```

### Advantages and Limitations

**Advantages:**

- Simplest workflow to understand and implement
- Minimal branch management overhead
- Linear history is easy to follow

**Limitations:**

- No isolated environments for feature development
- Higher chance of merge conflicts
- Lack of formal code review mechanism
- Harder to maintain stable production code

### Best Practices

- Pull frequently to minimize merge conflicts
- Communicate with team members before making significant changes
- Consider using feature branches for larger changes
- Add good commit messages to maintain a usable history

---

## Feature Branch Workflow

### Overview and Use Cases for Feature Branch Workflow

The Feature Branch Workflow extends the Centralized Workflow by developing all features in dedicated branches instead of directly on `main`. This isolates new development, enabling pull requests and code reviews.

**Best suited for:**

- Most professional teams
- Projects with multiple developers working in parallel
- Codebases requiring code reviews before integration

**Visual representation:**

```plaintext
main:     A---B---C------------D---F
                  \            /   /
feature-1:         D---E------/   /
                                 /
feature-2:             G---H----/
```

### Implementation Steps for Feature Branch Workflow

**Create a feature branch:**

```sh
# Update main first
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/user-authentication
```

**Work on the feature:**

```sh
# Make changes
git add changed-files
git commit -m "Implement login form"

# Continue development with multiple commits
git add more-files
git commit -m "Add password validation"
```

**Push feature branch to remote:**

```sh
git push -u origin feature/user-authentication
```

**Create pull request** (via GitHub/GitLab/etc.)

**Review and merge:**

```sh
# After approval, merge to main 
git checkout main
git pull origin main
git merge feature/user-authentication
git push origin main

# Or use the platform's merge button
```

**Cleanup:**

```sh
# Delete the local branch
git branch -d feature/user-authentication

# Delete the remote branch
git push origin --delete feature/user-authentication
```

### Branch Naming Conventions

Consistent branch naming improves workflow clarity:

```plaintext
<type>/<description>
```

Common types:

- `feature/` - New functionality
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes for production
- `release/` - Release preparation
- `refactor/` - Code improvements without feature changes
- `docs/` - Documentation changes
- `test/` - Test additions or corrections

Examples:

- `feature/user-authentication`
- `bugfix/login-validation`
- `hotfix/security-vulnerability`
- `release/v1.2.0`

### Pull Request Process

A typical pull request workflow:

1. Developer creates PR with description of changes
2. CI runs automated tests
3. Team members review code and provide feedback
4. Developer addresses feedback with follow-up commits
5. PR is approved by required reviewers
6. PR is merged (merge, squash, or rebase)

### Code Review Guidelines

Effective code reviews focus on:

- Code correctness and edge cases
- Test coverage
- Performance implications
- Security considerations
- Adherence to project style and standards
- Documentation completeness

> 💡 **Tip**: Aim for small, focused PRs to make reviews more manageable and effective.

---

## Gitflow Workflow

### Overview and Use Cases for Gitflow Workflow

Gitflow is a robust framework for managing larger projects with scheduled releases. It uses dedicated branches for features, releases, and hotfixes with strict conventions about how changes flow between them.

**Best suited for:**

- Larger teams with formal release processes
- Projects with multiple versions in production
- Software with scheduled release cycles

**Visual representation:**

```plaintext
         hotfix/1.0.1
            |
            v
main:     A-------M------P------T
           \       \      \      \
develop:    B---C---N---O--Q---R--U
                /         /\
feature/1:    D---E---F--/  \
                           \  \
feature/2:                 G---H
                              \
release/1.0:                  I---J---K
```

### Branch Types and Purposes

Gitflow defines specific branches with different roles:

| Branch Type | Base Branch | Naming | Merges Into | Purpose |
|-------------|-------------|--------|------------|---------|
| `main` | - | `main` | - | Production-ready code |
| `develop` | `main` | `develop` | - | Integration branch for features |
| `feature` | `develop` | `feature/*` | `develop` | New functionality development |
| `release` | `develop` | `release/*` | `main` & `develop` | Release preparation & stabilization |
| `hotfix` | `main` | `hotfix/*` | `main` & `develop` | Emergency production fixes |

### Implementation Steps for Gitflow Workflow

**Setup Gitflow:**

```sh
# Initialize repository with Gitflow
git flow init -d

# Or manually create required branches
git branch develop
git push -u origin develop
```

**Start a feature:**

```sh
# Using gitflow extension
git flow feature start user-authentication

# Or manually
git checkout develop
git checkout -b feature/user-authentication
```

**Finish a feature:**

```sh
# Using gitflow extension
git flow feature finish user-authentication

# Or manually
git checkout develop
git merge --no-ff feature/user-authentication
git branch -d feature/user-authentication
```

**Start a release:**

```sh
# Using gitflow extension
git flow release start 1.2.0

# Or manually
git checkout develop
git checkout -b release/1.2.0
```

**Finish a release:**

```sh
# Using gitflow extension
git flow release finish 1.2.0

# Or manually
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Version 1.2.0"
git checkout develop
git merge --no-ff release/1.2.0
git branch -d release/1.2.0
```

**Create and finish a hotfix:**

```sh
# Using gitflow extension
git flow hotfix start 1.2.1

# Or manually
git checkout main
git checkout -b hotfix/1.2.1

# When finished with gitflow
git flow hotfix finish 1.2.1

# Or manually
git checkout main
git merge --no-ff hotfix/1.2.1
git tag -a v1.2.1 -m "Version 1.2.1"
git checkout develop
git merge --no-ff hotfix/1.2.1
git branch -d hotfix/1.2.1
```

### Release Process

The release process in Gitflow:

1. Create a release branch from `develop`
2. Make release-specific changes (version numbers, etc.)
3. Bug fixes for the release go directly to release branch
4. When stable, merge into `main` and tag with version number
5. Also merge back into `develop` to incorporate release fixes
6. Delete the release branch

### Hotfix Process

The hotfix process in Gitflow:

1. Create hotfix branch from `main`
2. Fix the critical issue
3. Merge into both `main` and `develop` (or active release branch)
4. Tag the `main` merge with updated version number
5. Delete the hotfix branch

### GitFlow Tools and Extensions

The Gitflow workflow can be implemented manually or using dedicated tools:

```sh
# Install the gitflow extension
# macOS
brew install git-flow-avh

# Windows (with Git for Windows)
# Already included

# Linux
apt-get install git-flow
```

Common gitflow commands:

```sh
git flow init                 # Set up repo for gitflow
git flow feature start        # Start a feature branch
git flow feature finish       # Finish a feature branch
git flow release start        # Start a release branch
git flow release finish       # Finish a release branch
git flow hotfix start         # Start a hotfix branch
git flow hotfix finish        # Finish a hotfix branch
```

---

## Forking Workflow

### Overview and Use Cases for Forking Workflow

The Forking Workflow is unique in that each developer has their own server-side repository. This means every developer has two Git repositories: a private local one and a public server-side one.

**Best suited for:**

- Open source projects
- Large public projects with many contributors
- Projects where contributors don't have write access to the main repository

**Visual representation:**

```plaintext
upstream (main repo):    A---B---C-----------G
                               \             /
fork (your GH repo):           C---D---E---F
                                \
local (your computer):          C---D---E---F
```

### Fork and Clone Process

**Fork the repository** (via GitHub/GitLab interface)

**Clone your fork:**

```sh
git clone https://github.com/your-username/project.git
cd project
```

**Add upstream remote:**

```sh
git remote add upstream https://github.com/original-owner/project.git
```

**Verify remotes:**

```sh
git remote -v
```

### Implementation Steps for Forking Workflow

**Create a feature branch:**

```sh
git checkout -b feature/awesome-feature
```

**Make changes and commit:**

```sh
# Make changes
git add changed-files
git commit -m "Implement awesome feature"
```

**Push to your fork:**

```sh
git push -u origin feature/awesome-feature
```

**Create pull request** (via GitHub/GitLab interface)

**Update your PR when requested:**

```sh
# Make changes based on feedback
git add changed-files
git commit -m "Address review comments"
git push origin feature/awesome-feature
```

### Synchronizing with Upstream

Keep your fork in sync with the upstream repository:

```sh
# Fetch upstream changes
git fetch upstream

# Checkout your fork's main branch
git checkout main

# Merge upstream changes
git merge upstream/main

# Update your fork on the server
git push origin main
```

### Pull Request Process for Forking Workflow

The pull request process in a Forking Workflow typically involves:

1. Developer pushes changes to their fork
2. Developer creates PR from fork to upstream repository
3. Maintainers review the code
4. Developer makes requested changes on their branch
5. Maintainers approve and merge the PR
6. Developer syncs their fork with upstream

> 💡 **Tip**: Before creating a new PR, always sync your fork with the upstream repository to avoid conflicts.

---

## Trunk-Based Development

### Overview and Use Cases for Trunk-Based Development

Trunk-Based Development is a source-control practice where developers merge small, frequent updates to a core "trunk" branch (usually `main`). It emphasizes keeping the trunk always releasable and using feature toggles instead of feature branches.

**Best suited for:**

- DevOps-oriented teams with strong CI/CD practices
- Teams practicing continuous deployment
- Organizations focused on reducing integration friction

**Visual representation:**

```plaintext
main: A---B---C---D---E---F---G---H---I
      ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑
     commits merged multiple times daily
```

### Implementation Steps for Trunk-Based Development

**Pull latest trunk:**

```sh
git checkout main
git pull origin main
```

**Create short-lived feature branch (optional):**

```sh
git checkout -b small-feature
```

**Make small, incremental changes:**

```sh
# Make changes
git add changed-files
git commit -m "Implement small part of feature"
```

**Integrate frequently (at least once daily):**

```sh
git checkout main
git pull origin main
git merge small-feature
git push origin main

# If using feature branch
git branch -d small-feature
```

### Feature Toggles

Instead of long-lived branches, Trunk-Based Development uses feature toggles:

```java
// Example feature toggle in code
if (FeatureFlags.isEnabled("new-billing-system")) {
    // New implementation
    return newBillingSystem.calculateTotal(items);
} else {
    // Old implementation
    return oldBillingSystem.calculateTotal(items);
}
```

Types of feature toggles:

- Release toggles (enable/disable functionality)
- Experiment toggles (A/B testing)
- Ops toggles (control operational aspects)
- Permission toggles (user-specific features)

### CI/CD Integration

Trunk-Based Development relies heavily on automated testing:

1. Every commit triggers a CI build
2. Automated test suite runs on each build
3. Build breaks are fixed immediately (highest priority)
4. Passing builds can be auto-deployed to staging environments

### Comparison with Feature Branches

| Aspect | Trunk-Based Development | Feature Branches |
|--------|-------------------------|-----------------|
| Integration Frequency | Continuous (multiple times daily) | At feature completion |
| Branch Lifetime | Hours to a day | Days to weeks |
| Merge Conflicts | Minimal due to frequent merges | Can be significant |
| Code Review | Often post-merge, or pair programming | Pre-merge via PRs |
| Feature Isolation | Via feature toggles in code | Via branches |
| Release Cadence | Continuous | Batch |
| CI/CD Integration | Essential | Helpful but not required |

---

## GitHub Flow

### Overview and Use Cases for GitHub Flow

GitHub Flow is a lightweight, branch-based workflow built around core GitHub features. It's simpler than Gitflow, focusing on frequent deployment and rapid feedback.

**Best suited for:**

- Web applications with continuous deployment
- Teams using GitHub exclusively
- Projects with simple release requirements
- Teams wanting minimal process overhead

**Visual representation:**

```plaintext
main:    A---B---C---D------F---G
                     \     /
feature:              E---/
```

### Implementation Steps for GitHub Flow

**Create a branch:**

```sh
git checkout main
git pull origin main
git checkout -b descriptive-branch-name
```

**Add commits:**

```sh
# Make changes
git add changed-files
git commit -m "Clear description of changes"

# Continue making changes
git add more-files
git commit -m "More changes"
```

**Open a Pull Request:**

```sh
git push -u origin descriptive-branch-name
```

Then create PR via GitHub interface

1. **Discuss and review:**
   - Team members review code and provide feedback
   - CI runs tests automatically
   - Make additional commits to address feedback

2. **Deploy and test:**
   - Deploy branch to staging/test environment
   - Verify functionality in a production-like environment

3. **Merge to main:**
   - Use GitHub's "Merge Pull Request" button
   - Delete the branch after merging

### Deployment Process

GitHub Flow assumes continuous deployment:

1. Merged changes to `main` trigger automatic deployment
2. Deployments can be to staging first, then production
3. Any issues found are fixed in a new branch
4. Focus on quick fixes rather than reverting

### Comparison with GitFlow

| Feature | GitHub Flow | GitFlow |
|---------|------------|---------|
| Complexity | Simple | Complex |
| Branches | One primary (main) + feature branches | Multiple permanent branches + feature/release/hotfix branches |
| Release Cycle | Continuous | Scheduled |
| Ideal For | Web apps, continuous deployment | Versioned software |
| Production Branch | `main` | `main` and release branches |
| Integration | Feature branches merge directly to main | Feature branches merge to develop |
| Multiple Versions | Not supported | Supported |
| Learning Curve | Low | Moderate |

---

## GitLab Flow

### Overview and Use Cases for GitLab Flow

GitLab Flow combines feature-driven development with issue tracking. It extends GitHub Flow with environment branches and optional release branches.

**Best suited for:**

- Teams using GitLab or similar platforms
- Projects requiring staged deployments
- Projects that need both continuous delivery and versioned releases

**Visual representation:**

```plaintext
production: ------------A------------------B--
                       /                  /
main:       C---D---E---F---G---H---I---J---K---L
                     \             \
feature:              M---N---------O
```

### Environment Branches

GitLab Flow uses environment branches as promotion stages:

```plaintext
feature → main → pre-production → production
```

For projects requiring versioned releases:

```plaintext
feature → main → release-1.0 → release-1.1
```

### Implementation Steps for GitLab Flow

**Create a feature branch:**

```sh
git checkout main
git pull origin main
git checkout -b 123-fix-login-issue
```

**Make changes and commit:**

```sh
# Make changes
git add changed-files
git commit -m "Fix login timeout issue #123"
```

**Push branch and create merge request:**

```sh
git push -u origin 123-fix-login-issue
```

Then create merge request via GitLab interface

1. **Merge to main after approval:**
   - Use GitLab's merge button
   - Main branch is automatically deployed to staging environment

2. **Promote to production:**

Either:

```sh
# For environment branches approach
git checkout production
git merge main
git push origin production
```

Or:

```sh
# For release branches approach
git checkout main
git checkout -b release-1.0
git push origin release-1.0
```

### Release Management for GitLab Flow

GitLab Flow offers two release strategies:

1. **Environment branches:**
   - Production branch represents production environment
   - Changes flow from main → pre-prod → production
   - Ideal for continuous deployment with verification stages

2. **Release branches:**
   - Each release has a dedicated long-lived branch
   - Only bug fixes are merged into release branches
   - Ideal for software that needs multiple supported versions

---

## Comparing Workflows

### Workflow Comparison Table

| Workflow | Complexity | Branch Types | Best For | Release Cadence | Learning Curve |
|----------|------------|--------------|----------|-----------------|----------------|
| Centralized | Low | Single (main) | Small teams, simple projects | As needed | Very Low |
| Feature Branch | Low | Main + feature branches | Most teams | As needed | Low |
| Gitflow | High | Main, develop, feature, release, hotfix | Complex, versioned projects | Scheduled | High |
| Forking | Medium | Same as underlying workflow + fork | Open source, public projects | Varies | Medium |
| Trunk-Based | Low | Main + short-lived feature | CI/CD, DevOps teams | Continuous | Medium (technical practices) |
| GitHub Flow | Low | Main + feature branches | Web apps, continuous deployment | Continuous | Low |
| GitLab Flow | Medium | Main, environment/release + feature | Staged deployment | Continuous or scheduled | Medium |

### Selecting a Workflow

Consider these factors when choosing a workflow:

1. **Team size and geographical distribution**
2. **Release frequency and versioning requirements**
3. **Project complexity and codebase size**
4. **Contributor expertise and Git familiarity**
5. **Integration with CI/CD and deployment processes**
6. **Need for multiple supported versions**

### Customizing Workflows

Most teams adapt standard workflows to their needs:

- Combining elements from different workflows
- Adapting branch naming and management
- Integrating with organization-specific tooling
- Evolving the workflow as team needs change

> 💡 **Tip**: Document your workflow and keep the documentation updated as your process evolves.

---

## Integrating with Development Practices

### Continuous Integration (CI)

Effective Git workflows integrate with CI systems:

```yaml
# Example GitHub Actions workflow
name: Build and Test
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up environment
      run: npm install
    - name: Run tests
      run: npm test
```

Key CI best practices:

- Build and test on every commit
- Run the same CI process for branches and PRs
- Keep build times fast to enable frequent integration
- Prioritize fixing broken builds

### Code Review Strategies

Effective code reviews depend on the workflow:

- **Pre-merge reviews**: Used in Feature Branch, GitHub Flow, GitLab Flow
- **Post-merge reviews**: Sometimes used in Trunk-Based Development
- **Pair programming**: Can replace formal reviews in some teams

Review best practices:

- Focus on small, focused changes
- Use automated tools for style and basic errors
- Review for design, maintainability, and correctness
- Build review into the workflow rather than as an afterthought

### Release Management

Different workflows approach releases differently:

- **Continuous deployment**: Changes in main go directly to production
- **Environment promotion**: Changes move through staging environments
- **Release branches**: Changes are batched into scheduled releases
- **Tags and versions**: Specific commits are tagged for release

Release notes automation:

```sh
# Generate changelog from commits
git log --pretty=format:"%h - %s (%an)" v1.0.0..v1.1.0 > CHANGELOG.md
```

### Documentation Practices

Document your Git workflow:

- Branch naming conventions and purposes
- Commit message format and expectations
- PR/MR templates and requirements
- Release procedures and checklists
- Responsibility matrix for merge approvals
- Handling of critical fixes

Example PR template:

```markdown
## Description
[Description of the changes]

## Issue
Closes #123

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] CI tests passing
```

---

## Command Summary

| Operation | Command | Description |
|-----------|---------|-------------|
| Create Feature Branch | `git checkout -b feature/name` | Start new feature |
| Push New Branch | `git push -u origin feature/name` | Push branch to remote |
| Track Upstream | `git remote add upstream <url>` | Add original repo as upstream |
| Sync with Upstream | `git fetch upstream && git merge upstream/main` | Update fork from original |
| Start GitFlow Feature | `git flow feature start <name>` | Begin new feature using GitFlow |
| Finish GitFlow Feature | `git flow feature finish <name>` | Complete feature using GitFlow |
| Start Release | `git flow release start <version>` | Begin new release using GitFlow |
| Finish Release | `git flow release finish <version>` | Complete release using GitFlow |
| Create Hotfix | `git flow hotfix start <version>` | Begin new hotfix using GitFlow |

---

## Related Topics

- [Creating, managing, and navigating branches](03-branching.md)
- [Combining branches with merge and rebase operations](04-merging-rebasing.md)
- [Working with remote repositories](05-remote-operations.md)
- [Advanced Git techniques and features](11-advanced-topics.md)
- [Automating tasks with GitHub Actions](13-github-actions.md)

---

*Next: [Automating tasks with GitHub Actions](13-github-actions.md)*
