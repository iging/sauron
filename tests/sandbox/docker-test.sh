#!/usr/bin/env bash
# ===================================================================
# Docker Sandbox Verification Test Runner
# Verifies zero-side-effect isolation and complete 17-runtime file creation
# ===================================================================

set -euo pipefail

IMAGE_NAME="sauron-sandbox-test:latest"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAURON_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "==================================================================="
echo "              SAURON DOCKER SANDBOX VERIFICATION"
echo "==================================================================="

if ! command -v docker >/dev/null 2>&1; then
  echo "[WARN] Docker is not installed or available in PATH. Skipping container execution."
  exit 0
fi

echo "[1/2] Building isolated sandbox image..."
docker build -t "${IMAGE_NAME}" -f "${SCRIPT_DIR}/Dockerfile" "${SAURON_ROOT}"

echo "[2/2] Running container verification test..."
docker run --rm "${IMAGE_NAME}"

echo "[SUCCESS] Docker sandbox verification passed cleanly."
