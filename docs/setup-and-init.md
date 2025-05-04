# Setting up Git and Initializing Repositories

*A guide to getting started with Git, from installation to creating your first repository.*

---

## Installing Git

### Windows

#### Official Installer

Download from <a href="https://git-scm.com/download/win" target="_blank">https://git-scm.com/download/win</a> and run the installer with default options.

#### Using Winget

```sh
winget install --id Git.Git
```

#### Using Chocolatey

```sh
choco install git
```

### macOS

#### Using Homebrew

```sh
brew install git
```

#### Using the official installer

Download from <a href="https://git-scm.com/download/mac" target="_blank">https://git-scm.com/download/mac</a> and follow installation instructions.

### Linux

#### Debian/Ubuntu

```sh
sudo apt-get update
```

```sh
sudo apt-get install git
```

#### Fedora

```sh
sudo dnf install git
```

#### RHEL/CentOS

```sh
sudo yum install git
```

#### Arch Linux

```sh
sudo pacman -S git
```

#### Verify installation

```sh
git --version
```

---

## Initial Configuration

### Setting Your Identity

Git requires knowing who you are for commit attribution:

#### Set your name

```sh
git config --global user.name "Your Name"
```

#### Set your email

```sh
git config --global user.email "your.email@example.com"
```

> 💡 **Tip**: Use the same email address you use for your remote Git hosting service (GitHub, GitLab, etc.).

### Configuring Your Editor

Set your preferred text editor for commit messages:

#### For VS Code

```sh
git config --global core.editor "code --wait"
```

#### For Vim

```sh
git config --global core.editor "vim"
```

#### For Notepad++ (Windows)

```sh
git config --global core.editor "'C:/Program Files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"
```

#### For Sublime Text

```sh
git config --global core.editor "'subl' -w"
```

### Checking Your Settings

Review all your settings:

#### List all settings

```sh
git config --list
```

#### Check a specific setting

```sh
git config user.name
```

```sh
git config user.email
```

### Configuration Levels

Git configurations can be applied at three levels:

#### System level

Applies to all users:

```sh
git config --system ...
```

#### Global level

Applies to all repositories of current user:

```sh
git config --global ...
```

#### Local level

Applies only to current repository:

```sh
git config --local ...
```

> 📌 **Note**: Local settings override global settings, which override system settings.

---

## Creating Repositories

### Initializing a New Repository

Turn an existing directory into a Git repository:

#### Navigate to your project directory

```sh
cd path/to/your/project
```

#### Initialize the repository

```sh
git init
```

After initializing, you'll see a `.git` directory which contains all the Git metadata.

### Cloning an Existing Repository

Copy a repository from a remote server:

#### Clone via HTTPS

```sh
git clone https://github.com/username/repository.git
```

#### Clone via SSH

Requires setup of SSH keys:

```sh
git clone git@github.com:username/repository.git
```

#### Clone to a specific directory

```sh
git clone https://github.com/username/repository.git my-project
```

#### Clone a specific branch

```sh
git clone -b branch-name https://github.com/username/repository.git
```

#### Clone with limited history

Shallow clone:

```sh
git clone --depth=1 https://github.com/username/repository.git
```

### Understanding the .git Directory

The `.git` directory contains all the data and configuration for your repository:

```plaintext
.git/
├── HEAD          # Points to the current branch
├── config        # Repository-specific configuration
├── description   # Description of the repository (only used by GitWeb)
├── hooks/        # Client or server-side hook scripts
├── index         # Staging area information
├── objects/      # Git's object database (commits, trees, blobs)
└── refs/         # Pointers to commit objects (branches, tags)
```

> ⚠️ **Warning**: Never manually modify files in the `.git` directory unless you know what you're doing.

---

## First-time Repository Setup

### Standard Project Files

When creating a new repository, consider adding these standard files:

#### Create a README file

```sh
echo "# Project Name" > README.md
```

#### Create a license file

Example: MIT

```sh
curl -o LICENSE https://opensource.org/licenses/MIT
```

#### Create a .gitignore file

Discussed below:

```sh
touch .gitignore
```

### Creating a .gitignore File

The `.gitignore` file specifies intentionally untracked files that Git should ignore:

```sh
touch .gitignore
```

Sample `.gitignore` content for various project types:

#### Node.js

```plaintext
node_modules/
npm-debug.log
.env
```

#### Python

```plaintext
__pycache__/
*.py[cod]
*$py.class
venv/
.env
```

#### Java

```plaintext
*.class
*.jar
target/
.idea/
```

> 💡 **Tip**: Use <a href="https://www.toptal.com/developers/gitignore" target="_blank">gitignore.io</a> to generate `.gitignore` files for your specific tech stack.

---

## Command Summary

| Operation | Command | Description |
|-----------|---------|-------------|
| Check version | `git --version` | Verify Git installation |
| Set username | `git config --global user.name "Your Name"` | Set your identity name |
| Set email | `git config --global user.email "your.email@example.com"` | Set your identity email |
| Set editor (VS Code) | `git config --global core.editor "code --wait"` | Configure default editor |
| Set editor (Vim) | `git config --global core.editor "vim"` | Configure default editor |
| Set editor (Notepad++) | `git config --global core.editor "'C:/Program Files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"` | Configure default editor |
| Set editor (Sublime) | `git config --global core.editor "'subl' -w"` | Configure default editor |
| List all settings | `git config --list` | Display all configurations |
| Check specific setting | `git config user.name` | View a specific config value |
| System config | `git config --system ...` | Set config for all users |
| Global config | `git config --global ...` | Set config for current user |
| Local config | `git config --local ...` | Set config for current repository |
| Initialize repository | `git init` | Create a new Git repository |
| Clone via HTTPS | `git clone https://github.com/username/repository.git` | Copy a repository from remote server |
| Clone via SSH | `git clone git@github.com:username/repository.git` | Clone using SSH protocol |
| Clone to directory | `git clone https://github.com/username/repository.git my-project` | Clone to specific folder |
| Clone specific branch | `git clone -b branch-name https://github.com/username/repository.git` | Clone only one branch |
| Shallow clone | `git clone --depth=1 https://github.com/username/repository.git` | Clone with limited history |
| Create gitignore | `touch .gitignore` | Create file to specify ignored files |

---

## Related Topics

- [Basic Git Usage](basic-usage.md)
- [Branch Management](branching.md)
- [Remote Operations](remote-operations.md)
- [Merging and Rebasing](merging-rebasing.md)
- [Stash and Clean](stash-clean.md)
