# 🚀 Dev Dashboard

> "Because even CLI ninjas deserve a quick visual of what’s running."

**Dev Dashboard** is a language-agnostic control-panel that wraps your project’s most common tasks — start servers, run tests, build containers, monitor ports — in one browser tab.

## ✨ Features (α)

| ✅  |  Description                                  |
|----|-----------------------------------------------|
| 1  | One-line global installer (`curl … | bash`)   |
| 2  | Reads `.dev-dashboard.yaml` to discover workflows |
| 3  | Streams command output live over WebSocket    |
| 4  | Remembers last workflow/run in IndexedDB      |
| 5  | Adapter system (Node, Python, Go, generic sh) |

## 🔧 Quick Start

```bash
npm install --save-dev dev-dashboard
cd /your/project
npx dev-dashboard
```

## Initializing a Project

To get started quickly, you can use the `--init` command to generate a `.dev-dashboard.yaml` file from a template. 

To see available templates run:
```bash
npx dev-dashboard --init
```

To generate a file from a specific template run:
```bash
npx dev-dashboard --init <template_name>
```

For example:
```bash
npx dev-dashboard --init python
```

The UI now auto-generates buttons from `.dev-dashboard.yaml`.

🗺 Folder Layout
```text
dashboard/   – static UI + Node server
adapters/    – hooks per language
templates/   – ready-made YAML workflows
scripts/     – installer & misc utilities
docs/        – mkdocs / white-paper sources
examples/    – sample projects using the dashboard
```

🛣 Roadmap

| Phase | Goal | Deadline |
|-------|------|----------|
| 0 | Scaffold, installer, minimal UI | **Tonight – Jul 20** |
| 1 | PronunCo YAML + `dev.sh -cp` | **Jul 21** |
| 2 | Port ping + IndexedDB state | Jul 22 |
| 3 | Adapter plugin system | Jul 23 |
| 4 | Docs site + white-paper draft | Jul 24 |

Docs folder outline
```text
docs/
├── index.md          # landing; links to below
├── overview.md       # narrative intro
├── architecture.md   # diagrams, adapter spec
└── whitepaper.md     # problem, solution, roadmap, community
```

Eventually wire this into MkDocs or Docusaurus & host on GitHub Pages.
