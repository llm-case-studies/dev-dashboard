#!/usr/bin/env bash
set -euo pipefail

WRAPPER="$HOME/.dev-dashboard/bin/dev-dashboard"
INSTALLER_PATH="$(dirname "$0")/../scripts/install.sh"   # repo-relative

install_if_needed () {
  if [[ ! -x "$WRAPPER" ]]; then
    echo "ℹ️  Dev Dashboard not found. Run installer now? [Y/n] "
    read -r reply
    if [[ "$reply" =~ ^[Yy]?$ ]]; then
      echo "📥  Installing Dev Dashboard..."
      bash "$INSTALLER_PATH"
      # shell re-source to get PATH immediately
      . "$HOME/.bashrc" 2>/dev/null || true
      . "$HOME/.zshrc"  2>/dev/null || true
    else
      echo "❌  Aborted; dashboard not installed."
      exit 1
    fi
  fi
}

usage() {
  echo "Usage: $0 [-p] [-cp]"
  echo "  -p    git pull origin main"
  echo "  -cp   launch Dev Dashboard (auto-installs if missing)"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -p)
      echo "📥  Pulling latest…"
      git pull origin main
      exit 0
      ;;
    -cp)
      install_if_needed
      echo "🚀  Opening dashboard…"
      dev-dashboard --project-root "$(pwd)" &
      sleep 1
      python3 - <<'PY'
import time, webbrowser; time.sleep(2); webbrowser.open("http://localhost:3333")
PY
      wait
      exit 0
      ;;
    -h|--help) usage; exit 0 ;;
    *) usage; exit 1 ;;
  esac
done

usage

