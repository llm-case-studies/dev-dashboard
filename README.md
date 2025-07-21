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
curl -sSL dev-dashboard.tools/install | bash   # add bin + PATH
cd /your/project
./dev.sh -cp                                   # or: dev-dashboard --project-root .
```

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

| Phase | Goal | ETA |
|------|-----------------------------|--------|
| 0 | MVP for PronunCo | Aug 2025 |
| 1 | Adapter plugins + hot-reload | Sep 2025 |
| 2 | VS Code webview extension | Oct 2025 |
| 3 | Public 1.0 & brew/npm installers | Q1-2026 |

Docs folder outline
```text
docs/
├── index.md          # landing; links to below
├── overview.md       # narrative intro
├── architecture.md   # diagrams, adapter spec
└── whitepaper.md     # problem, solution, roadmap, community
```

Eventually wire this into MkDocs or Docusaurus & host on GitHub Pages.
