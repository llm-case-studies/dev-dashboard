#!/usr/bin/env bash
set -euo pipefail

# By default, install to dev path. If --prod is passed, use standard path.
ROOT="$HOME/.dev-dashboard-dev"
if [[ "${1:-}" == "--prod" ]]; then
  ROOT="$HOME/.dev-dashboard"
fi

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
# This script is a wrapper, dynamically locating the server path
# This allows side-by-side prod/dev installs
SERVER_JS_PATH="$(dirname "$(realpath "$0")")"/../dashboard/server.js"
node "$SERVER_JS_PATH" "$@"
EOS
chmod +x "$ROOT/bin/dev-dashboard"

# Ensure PATH (bash & zsh)
SHELL_RC="$HOME/.bashrc"
[[ "$SHELL" == */zsh ]] && SHELL_RC="$HOME/.zshrc"

if ! grep -q "$ROOT/bin" "$SHELL_RC"; then
  echo "# Added by Dev-Dashboard installer" >> "$SHELL_RC"
  echo "export PATH=\"$ROOT/bin:\$PATH\"" >> "$SHELL_RC"
  export PATH="$ROOT/bin:$PATH"
fi

echo "✅  Dev Dashboard installed. Run: dev-dashboard"
echo "   To use, you may need to 'source $SHELL_RC' or open a new terminal."
