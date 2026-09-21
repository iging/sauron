#!/usr/bin/env bash
# ===================================================================
# Sauron Universal POSIX Installer
# "One Harness to rule them all..."
# Installs sauron CLI to ~/.local/bin or /usr/local/bin
# ===================================================================

set -euo pipefail

VERSION="1.0.0"
INSTALL_DIR="${HOME}/.local/bin"
SAURON_HOME="${HOME}/.sauron"

echo "==================================================================="
echo "                       S A U R O N"
echo "  One Harness to rule them all, One Harness to prompt them,"
echo "  One Harness to sync them all, and in your codebase bind them."
echo "==================================================================="
echo ""
echo "[INSTALLER] Installing sauron v${VERSION} for POSIX systems..."

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

# Step 2: Create installation directories
mkdir -p "${INSTALL_DIR}"
mkdir -p "${SAURON_HOME}"

# Step 3: Global npm link or binary launcher creation
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAURON_MJS="${SCRIPT_DIR}/../../bin/sauron.mjs"

if [ -f "${SAURON_MJS}" ]; then
  # Local repository installation mode
  TARGET_BIN="${INSTALL_DIR}/sauron"
  cat <<EOF > "${TARGET_BIN}"
#!/usr/bin/env bash
exec node "${SAURON_MJS}" "\$@"
EOF
  chmod +x "${TARGET_BIN}"
  echo "[SUCCESS] Installed local launcher to ${TARGET_BIN}"
else
  # Remote curl installation fallback via npm
  echo "[INSTALLER] Installing sauron-ai globally via npm..."
  npm install -g sauron-ai
fi

# Step 4: PATH Verification
case ":${PATH}:" in
  *:"${INSTALL_DIR}":*) ;;
  *)
    echo ""
    echo "[NOTICE] ${INSTALL_DIR} is not currently in your PATH."
    echo "Add the following line to your ~/.bashrc or ~/.zshrc:"
    echo "  export PATH=\"${INSTALL_DIR}:\$PATH\""
    ;;
esac

echo ""
echo "[COMPLETE] sauron v${VERSION} installed successfully."
echo "Run 'sauron status' to verify your installation."
