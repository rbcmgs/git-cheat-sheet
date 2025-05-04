# 🧰 Git Cheat Sheet

[![docs](https://img.shields.io/badge/docs-%F0%9F%93%9A-green?style=flat-square)](https://rbcmgs.github.io/git-cheats/)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Last Updated](https://img.shields.io/badge/Last%20Updated-May%202025-blue)](https://github.com/rbcmgs/git-cheats)

<!-- markdownlint-disable MD013 -->
*A categorized, personal compendium of the most useful, commonly referenced git commands, workflows, and tips for daily use and troubleshooting.*
<!-- markdownlint-enable MD013 -->

<!-- markdownlint-disable MD013 -->
Hand-crafted with ❤️ for rapid reference. Not indended as a replacement for the [official git documentation](https://git-scm.com/doc).
<!-- markdownlint-enable MD013 -->

---

<!-- INTRO -->
<!-- markdownlint-disable MD013 -->
Whether you're initializing a new repository or unraveling a hairy merge, this cheat sheet offers easy navigation to the essentials. Each section links to a focused, copy-paste ready markdown file.
<!-- markdownlint-enable MD013 -->
  
## About This Repository

This repository contains a comprehensive Git cheat sheet designed to help
developers quickly find the right Git commands for their daily workflows.

The content is available in two forms:

1. GitHub Pages documentation at [https://rbcmgs.github.io/git-cheats/](https://rbcmgs.github.io/git-cheats/)
2. Individual markdown files in this repository

The documentation is organized by topics to make it easy to find specific
Git operations and workflows.

## 📚 Content Overview

- **🔧 Git Fundamentals**
  - [Setting up Git and initializing repositories](docs/setup-and-init.md)
  - [Essential everyday Git commands and workflows](docs/basic-usage.md)

- **🌿 Branch Management**
  - [Creating, managing, and navigating branches](docs/branching.md)
  - [Combining branches with merge and rebase operations](docs/merging-rebasing.md)

- **🔄 Remote Collaboration**
  - [Working with remote repositories (push, pull, fetch)](docs/remote-operations.md)
  - [Temporarily storing changes and cleaning working directory](docs/stash-clean.md)

- **📊 Project History & Versions**
  - [Marking release points and version management](docs/tags-releases.md)
  - [Viewing project history and comparing changes](docs/logs-diffs-history.md)

- **⚙️ Customization & Troubleshooting**
  - [Git configuration and command shortcuts](docs/config-aliases.md)
  - [Solving common Git problems](docs/troubleshooting.md)

- **🔥 Advanced Usage**
  - [Advanced Git techniques and features](docs/advanced-topics.md)
  - [Established Git workflows for teams](docs/development-workflows.md)
  - [Automating tasks with GitHub Actions](docs/github-actions.md)
  - [Additional Git learning resources and references](docs/resources.md)

---

## 🏗️ Project Structure

```plaintext
git-cheats/
├── docs/
│   ├── advanced-topics.md
│   ├── basic-usage.md
│   ├── branching.md
│   ├── config-aliases.md
│   ├── development-workflows.md
│   ├── github-actions.md
│   ├── index.md
│   ├── logs-diffs-history.md
│   ├── merging-rebasing.md
│   ├── remote-operations.md
│   ├── resources.md
│   ├── setup-and-init.md
│   ├── stash-clean.md
│   ├── tags-releases.md
│   └── troubleshooting.md
│
├── LICENSE
├── mkdocs.yml
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! If you have a useful git command, workflow or tip
that should be included:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/add-new-tip`)
3. Commit your changes (`git commit -m 'Add new tip about XYZ'`)
4. Push to the branch (`git push origin feature/add-new-tip`)
5. Open a Pull Request

---

## 📄 License

Copyright © 2025 Robert B. Cummings. All rights reserved.

See [LICENSE](LICENSE) for details.
