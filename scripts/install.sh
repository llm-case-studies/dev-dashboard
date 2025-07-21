#!/usr/bin/env bash
set -e
ROOT="$HOME/.dev-dashboard"
REPO="https://github.com/llm-case-studies/dev-dashboard.git"
mkdir -p "$ROOT"
# clone or pull
if [ -d "$ROOT/.git" ]; then
  git -C "$ROOT" pull --quiet
else
  git clone --depth 1 "$REPO" "$ROOT"
fi
# wrapper
mkdir -p "$ROOT/bin"
cat > "$ROOT/bin/dev-dashboard" <<'EOS'
#!/usr/bin/env bash
node "$HOME/.dev-dashboard/dashboard/server.js" "$@"
EOS
chmod +x "$ROOT/bin/dev-dashboard"
# PATH injection (bash / zsh)
if ! echo "$PATH" | grep -q "$ROOT/bin"; then
  SHELL_RC="$HOME/.bashrc"
  if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
  fi
  echo 'export PATH="$PATH:$HOME/.dev-dashboard/bin"' >> "$SHELL_RC"
  echo "Added dev-dashboard to PATH. Please restart your shell." >&2
fi
