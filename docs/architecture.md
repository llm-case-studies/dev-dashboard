# Architecture

```
CLI Wrapper -> Node server -> Adapters -> Project
```

The CLI wrapper launches a small Node.js server that serves the dashboard UI. The server communicates with language-specific adapters to run workflows defined in YAML files.
