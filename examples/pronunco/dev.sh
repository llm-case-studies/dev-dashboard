#!/usr/bin/env bash
if [[ "$1" == "-cp" || "$1" == "--control-panel" ]]; then
  dev-dashboard --project-root "$(pwd)" &
  sleep 1
  python3 - <<PY
import webbrowser, time; time.sleep(2); webbrowser.open("http://localhost:3333")
PY
  wait
else
  echo "🔹 Pass -cp to open the Dev Dashboard."
fi
