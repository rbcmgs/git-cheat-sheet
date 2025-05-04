# Automating Tasks with GitHub Actions

*Master the art of automating workflows, tests, and deployments using GitHub's powerful CI/CD platform.*

---

## Understanding GitHub Actions

### Core Concepts

GitHub Actions is an automation platform built directly into GitHub repositories:

```plaintext
┌─────────────────┐
│ GitHub Actions  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐        ┌─────────────────┐
│    Workflow     │────────▶  Jobs & Steps   │
└────────┬────────┘        └─────────────────┘
         │                          │
         ▼                          ▼
┌─────────────────┐        ┌─────────────────┐
│    Triggers     │        │     Actions     │
└─────────────────┘        └─────────────────┘
```

- **Workflow**: A configurable automated process made up of jobs
- **Job**: A set of steps that execute on the same runner
- **Step**: An individual task that runs commands or actions
- **Action**: A reusable unit of code
- **Runner**: A server that runs your workflows
- **Event**: A specific activity that triggers a workflow

### When to Use GitHub Actions

Ideal scenarios for implementing GitHub Actions:

- Running tests on pull requests before merging
- Deploying applications when new releases are created
- Publishing packages to registries
- Automating code quality checks and linting
- Handling issue and pull request maintenance

### Workflow Structure

GitHub Actions workflows are defined in YAML files:

```yaml
name: Workflow Name

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - name: Step name
        run: echo "Hello World"
```

---

## Creating Your First Workflow

### Directory Structure

Workflows are stored in a specific directory structure:

```plaintext
your-repo/
├── .github/
│   └── workflows/
│       ├── main-workflow.yml
│       └── deployment.yml
├── src/
└── ...
```

Create the workflows directory with:

```sh
mkdir -p .github/workflows
```

### Basic Workflow Example

A simple workflow to run tests on push:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
```

Save this as `.github/workflows/ci.yml` to enable it.

### Manual Workflow Triggers

Create workflows that can be triggered manually:

```yaml
name: Manual workflow

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to environment
        run: echo "Deploying to ${{ github.event.inputs.environment }}"
```

> 💡 **Tip**: Manual workflows appear under the "Actions" tab in your repository, where you can select inputs and run them on demand.

---

## Essential Workflow Components

### Triggers (Events)

Common events that can trigger workflows:

```yaml
# On push to specific branches
on:
  push:
    branches: [ main, dev ]
    paths:
      - 'src/**'
      - '!**.md'

# On schedule (cron syntax)
on:
  schedule:
    - cron: '0 0 * * *'  # Midnight every day

# On pull request
on:
  pull_request:
    types: [opened, synchronize, reopened]

# On release
on:
  release:
    types: [published]
```

### Jobs and Steps

Structuring work with jobs and steps:

```yaml
jobs:
  build:
    name: Build job
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Run a shell command
        run: echo "This is a command"
        shell: bash
        
  test:
    name: Test job
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Run tests
        run: |
          echo "Running tests"
          echo "Multi-line commands are supported"
```

### Actions

Using and referencing actions:

```yaml
steps:
  # Use an action from the GitHub Marketplace
  - name: Setup Node.js
    uses: actions/setup-node@v3
    with:
      node-version: '16'
      
  # Use a Docker container action
  - name: Run in Docker
    uses: docker://alpine:3.14
    with:
      args: /bin/sh -c "echo hello"
      
  # Use a local action
  - name: Local Action
    uses: ./.github/actions/my-custom-action
```

### Runners

Different environments for running workflows:

```yaml
jobs:
  linux-job:
    runs-on: ubuntu-latest
    
  windows-job:
    runs-on: windows-latest
    
  mac-job:
    runs-on: macos-latest
    
  # Use specific versions
  ubuntu-specific:
    runs-on: ubuntu-20.04
    
  # Use self-hosted runners
  custom-job:
    runs-on: self-hosted
```

---

## Secrets and Environment Variables

### Using Repository Secrets

Store and use sensitive information securely:

```yaml
jobs:
  deploy:
    steps:
      - name: Deploy with secret
        run: ./deploy.sh
        env:
          API_TOKEN: ${{ secrets.API_TOKEN }}
```

To add a secret, navigate to:

1. Repository → Settings → Secrets → Actions
2. Click "New repository secret"
3. Add name (e.g., `API_TOKEN`) and value

### Environment Variables

Setting and using environment variables:

```yaml
jobs:
  build:
    env:
      # Job level variables
      NODE_ENV: production
      
    steps:
      - name: Step with environment variables
        env:
          # Step level variables
          DB_HOST: localhost
          DB_USER: root
        run: |
          echo "NODE_ENV: $NODE_ENV"
          echo "DB_HOST: $DB_HOST"
```

### Context Access

Access to GitHub context variables:

```yaml
jobs:
  context-example:
    runs-on: ubuntu-latest
    steps:
      - name: Dump GitHub context
        run: |
          echo "Repository: ${{ github.repository }}"
          echo "Ref: ${{ github.ref }}"
          echo "SHA: ${{ github.sha }}"
          echo "Actor: ${{ github.actor }}"
          echo "Workflow: ${{ github.workflow }}"
```

> 💡 **Tip**: Use `${{ toJSON(github) }}` to print the entire context for debugging.

---

## Common GitHub Actions Use Cases

### Continuous Integration

Set up continuous integration for your project:

```yaml
name: CI

on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Test
        run: npm test
        
      - name: Build
        run: npm run build
```

### Automated Testing

Run tests across multiple environments:

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [14.x, 16.x, 18.x]
        
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

### Deployments

Automate deployments to different environments:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build
        run: npm ci && npm run build
        
      - name: Deploy to production
        uses: some-deployment-action@v1
        with:
          server: ${{ secrets.PRODUCTION_SERVER }}
          token: ${{ secrets.DEPLOY_TOKEN }}
          folder: ./dist
```

### Code Quality Checks

Enforce code quality standards:

```yaml
name: Code Quality

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Check formatting
        run: npm run format:check
        
      - name: Run SonarQube scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

---

## Working with Artifacts and Dependencies

### Uploading and Downloading Artifacts

Share files between jobs and preserve outputs:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build
        run: npm run build
      
      # Upload build artifacts
      - name: Upload build output
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      # Download build artifacts
      - name: Download build output
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
      
      - name: Deploy
        run: ./deploy.sh
```

### Caching Dependencies

Speed up workflows with dependency caching:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Cache npm dependencies
      - name: Cache node modules
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
      
      - name: Install dependencies
        run: npm ci
```

### Sharing Data Between Jobs

Pass data between jobs:

```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    outputs:
      output1: ${{ steps.step1.outputs.test }}
    steps:
      - id: step1
        run: echo "test=hello" >> $GITHUB_OUTPUT
  
  job2:
    needs: job1
    runs-on: ubuntu-latest
    steps:
      - run: echo ${{ needs.job1.outputs.output1 }}
```

---

## Advanced GitHub Actions Techniques

### Matrix Builds

Run jobs with multiple variants:

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node: [14, 16, 18]
        include:
          # Add additional variables for specific combinations
          - os: ubuntu-latest
            node: 16
            npm: 8
        exclude:
          # Exclude specific combinations
          - os: windows-latest
            node: 14
    
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

### Reusable Workflows

Create and use reusable workflows:

```yaml
# In .github/workflows/reusable.yml
name: Reusable workflow

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      token:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ${{ inputs.environment }}
        run: ./deploy.sh
        env:
          TOKEN: ${{ secrets.token }}
```

Using the reusable workflow:

```yaml
# In .github/workflows/caller.yml
name: Production deploy

on:
  push:
    branches: [main]

jobs:
  call-reusable:
    uses: ./.github/workflows/reusable.yml
    with:
      environment: production
    secrets:
      token: ${{ secrets.DEPLOY_TOKEN }}
```

### Workflow Concurrency

Managing concurrent workflow runs:

```yaml
name: Build

on: pull_request

# Cancel in-progress runs when PR is updated
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm build
```

### Composite Actions

Create reusable composite actions:

```yaml
# In .github/actions/setup-build-env/action.yml
name: 'Setup Build Environment'
description: 'Sets up the build environment with Node.js and dependencies'
inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '16'
runs:
  using: "composite"
  steps:
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ inputs.node-version }}
    
    - name: Cache node modules
      uses: actions/cache@v3
      with:
        path: ~/.npm
        key: npm-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
    
    - name: Install dependencies
      run: npm ci
      shell: bash
```

Using the composite action:

```yaml
jobs:
  build:
    steps:
      - uses: actions/checkout@v3
      - uses: ./.github/actions/setup-build-env
        with:
          node-version: '18'
```

---

## Debugging and Troubleshooting

### Viewing Workflow Runs

Navigate to the Actions tab in your repository to:

- See all workflow runs
- Filter by workflow, branch, or event
- View detailed logs for each step
- Re-run workflows or specific jobs

### Enabling Debug Logging

Enable detailed logs for troubleshooting:

```yaml
# Enable step debug logging
# Set repository secret ACTIONS_STEP_DEBUG=true

# Enable runner debug logging
# Set repository secret ACTIONS_RUNNER_DEBUG=true
```

You can also enable debug logging for a single workflow run by clicking "Run workflow" and checking "Enable debug logging."

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Workflow not running | Check the trigger events and branch filters |
| Action fails with exit code | Check error logs and command syntax |
| Secret not working | Verify secret name and ensure it's set correctly |
| Timeout issues | Break jobs into smaller parts or increase timeout-minutes |
| Permission errors | Check the `permissions` field in your workflow |

Example of setting timeout for a job:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v3
      - name: Long-running process
        run: ./slow_script.sh
```

---

## GitHub Actions for Git Operations

### Automated Versioning

Automatically manage version numbers:

```yaml
name: Version Bump

on:
  push:
    branches: [main]

jobs:
  versioning:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Fetch all history and tags
          
      - name: Bump version
        id: bump
        uses: phips28/gh-action-bump-version@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Output new version
        run: echo "New version is ${{ steps.bump.outputs.newTag }}"
```

### Release Management

Create automated releases:

```yaml
name: Create Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build
        run: npm ci && npm run build
        
      - name: Create Release
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
          
      - name: Upload Release Asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./dist/app.zip
          asset_name: app.zip
          asset_content_type: application/zip
```

### Pull Request Automation

Automate pull request processes:

```yaml
name: PR Automation

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Lint Code
        uses: github/super-linter@v4
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          
  auto-approve:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
      - uses: hmarr/auto-approve-action@v3
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

---

## Best Practices

### Performance Optimization

Optimize GitHub Actions workflow performance:

```yaml
jobs:
  optimize:
    runs-on: ubuntu-latest
    steps:
      # Only checkout what's necessary
      - uses: actions/checkout@v3
        with:
          fetch-depth: 1
      
      # Use dependency caching
      - uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
      # Run jobs in parallel when possible
      # Use task concurrency
      # Avoid unnecessary steps
```

### Security Considerations

Secure your GitHub Actions workflows:

```yaml
name: Secure Workflow

on:
  push:
    branches: [main]

# Set minimum permissions needed
permissions:
  contents: read
  issues: write

jobs:
  secure-job:
    runs-on: ubuntu-latest
    steps:
      # Pin actions to full length commit SHA
      - uses: actions/checkout@a12a3943b4bdde767164f792f33f40b04645d846
      
      # Scan code for vulnerabilities
      - name: Security scan
        uses: github/codeql-action/analyze@v2
```

### Workflow Organization

Structure complex workflows for maintainability:

```plaintext
.github/
├── workflows/
│   ├── ci.yml             # Testing & validation
│   ├── cd.yml             # Deployment
│   ├── cron-jobs.yml      # Scheduled tasks
│   └── utilities.yml      # Helper workflows
├── actions/
│   ├── setup/             # Custom setup actions
│   └── deployment/        # Custom deployment actions
└── config/
    └── labeler.yml        # PR labeler configuration
```

For complex repositories, divide workflows by purpose and reuse common steps with composite actions.

---

## Command Summary

| Operation | Command/Action | Description |
|-----------|---------------|-------------|
| Create workflow | Create `.github/workflows/name.yml` file | Define GitHub Actions workflow |
| Manually trigger | Use `workflow_dispatch` event | Create manually triggered workflow |
| Run in matrix | `strategy: matrix:` config | Run job with variations |
| Cache dependencies | `actions/cache@v3` | Speed up builds with caching |
| Upload artifacts | `actions/upload-artifact@v3` | Share files between jobs |
| Composite action | Create `action.yml` with steps | Make reusable action |
| Debug workflow | Set `ACTIONS_STEP_DEBUG` secret | Enable detailed logging |
| PR automation | Use event `pull_request` | Automate PR processes |
| Scheduled run | Use `schedule: - cron:` syntax | Run workflows on schedule |
| Secure secrets | Use `secrets.<name>` syntax | Use encrypted secrets |

---

## Related Topics

- [Established Git workflows for teams](12-development-workflows.md)
- [Working with remote repositories](05-remote-operations.md)
- [Marking release points and version management](07-tags-releases.md)
- [Advanced Git techniques and features](11-advanced-topics.md)

---

*Next: [Resources and Further Reading](resources.md)*
