#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/.dev-dashboard"
REPO="https://github.com/llm-case-studies/dev-dashboard.git"

echo "📥  Installing Dev Dashboard into $ROOT"
mkdir -p "$ROOT"

if [[ -d "$ROOT/.git" ]]; then
  git -C "$ROOT" pull --quiet
else
  git clone --depth 1 "$REPO" "$ROOT"
fi

# Install production Node deps
cd "$ROOT"
if [[ -f package.json ]]; then
  npm install --omit=dev --silent
fi

# Create wrapper
mkdir -p "$ROOT/bin"
cat > "$ROOT/bin/dev-dashboard" <<'EOS'
#!/usr/bin/env bash
node "$HOME/.dev-dashboard/dashboard/server.js" "$@"
EOS
chmod +x "$ROOT/bin/dev-dashboard"

# Ensure PATH (bash & zsh)
SHELL_RC="$HOME/.bashrc"
[[ "$SHELL" == */zsh ]] && SHELL_RC="$HOME/.zshrc"

if ! grep -q "$ROOT/bin" "$SHELL_RC"; then
  echo "export PATH=\"$ROOT/bin:\$PATH\"" >> "$SHELL_RC"
  export PATH="$ROOT/bin:$PATH"
fi

echo "✅  Dev Dashboard installed. Run: dev-dashboard"
