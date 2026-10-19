#!/usr/bin/env bash
# ===================================================================
# Sauron Universal POSIX Installer
# "One Harness to rule them all..."
# Local clone: creates a `sauron` launcher in ~/.local/bin.
# Remote (curl | bash): installs sauron-ai globally with pnpm or npm.
# ===================================================================

set -euo pipefail

INSTALL_DIR="${HOME}/.local/bin"

echo "==================================================================="
echo "                       S A U R O N"
echo "  One Harness to rule them all, One Harness to prompt them,"
echo "  One Harness to sync them all, and in your codebase bind them."
echo "==================================================================="
echo ""

# Step 1: Verify prerequisites
if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js is required but not found in PATH."
  echo "Please install Node.js (version 18 or newer) before installing sauron."
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/^v//' | cut -d. -f1)
if [ "${NODE_VERSION}" -lt 18 ]; then
  echo "[ERROR] Detected Node.js v${NODE_VERSION}. Sauron requires Node.js 18 or newer."
  exit 1
fi

# Step 2: Local clone (this script lives in <repo>/bin) or remote install.
SCRIPT_DIR=""
if [ -n "${BASH_SOURCE[0]:-}" ] && [ -f "${BASH_SOURCE[0]}" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi
SAURON_MJS="${SCRIPT_DIR}/sauron.mjs"
REPO_ROOT="${SCRIPT_DIR}/.."

if [ -n "${SCRIPT_DIR}" ] && [ -f "${SAURON_MJS}" ]; then
  VERSION=$(node -p "require('${REPO_ROOT}/package.json').version")
  echo "[INSTALLER] Installing sauron v${VERSION} from local clone..."

  # The CLI imports the compiled engine from dist/, so build it when missing.
  if [ ! -f "${REPO_ROOT}/dist/adapters/transpiler.js" ]; then
    echo "[INSTALLER] Building the engine (npm install && npm run build)..."
    (cd "${REPO_ROOT}" && npm install --no-audit --no-fund && npm run build)
  fi

  mkdir -p "${INSTALL_DIR}"
  TARGET_BIN="${INSTALL_DIR}/sauron"
  cat <<EOF > "${TARGET_BIN}"
#!/usr/bin/env bash
exec node "${SAURON_MJS}" "\$@"
EOF
  chmod +x "${TARGET_BIN}"
  echo "[SUCCESS] Installed local launcher to ${TARGET_BIN}"

  case ":${PATH}:" in
    *:"${INSTALL_DIR}":*) ;;
    *)
      echo ""
      echo "[NOTICE] ${INSTALL_DIR} is not currently in your PATH."
      echo "Add the following line to your ~/.bashrc or ~/.zshrc:"
      echo "  export PATH=\"${INSTALL_DIR}:\$PATH\""
      ;;
  esac
else
  if command -v pnpm >/dev/null 2>&1; then
    echo "[INSTALLER] Installing sauron-ai globally via pnpm..."
    pnpm add -g sauron-ai
  else
    echo "[INSTALLER] Installing sauron-ai globally via npm..."
    npm install -g sauron-ai
  fi
fi

echo ""
echo "[COMPLETE] sauron installed."
echo "Run 'sauron init' inside your project (or without installing: npx sauron-ai init / pnpm dlx sauron-ai init)."
