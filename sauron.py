#!/usr/bin/env python3
"""
Sauron CLI (Python entry point): Universal AI Agent Harness for 20 AI coding runtimes.
One Harness to rule them all.

The engine is the Node.js CLI. This wrapper forwards every command and flag to it:
the bundled `bin/sauron.mjs` when run from a clone, otherwise `npx sauron-ai`.
Node.js 18 or newer is required.
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path
from typing import List, Optional


def _node_command(argv: List[str]) -> Optional[List[str]]:
    """Builds the command that runs the Node CLI, or None when Node is missing."""
    node = shutil.which("node")
    if node is None:
        return None

    root = Path(__file__).resolve().parent
    local_cli = root / "bin" / "sauron.mjs"
    local_engine = root / "dist" / "adapters" / "transpiler.js"
    if local_cli.is_file() and local_engine.is_file():
        return [node, str(local_cli), *argv]

    npx = shutil.which("npx")
    if npx is None:
        return None
    return [npx, "--yes", "sauron-ai", *argv]


def main(argv: Optional[List[str]] = None) -> None:
    """Forwards the command line to the Node CLI and exits with its status."""
    args = list(sys.argv[1:] if argv is None else argv)
    command = _node_command(args)
    if command is None:
        print(
            "[ERROR] Sauron needs Node.js 18 or newer (node and npx in PATH).\n"
            "Install it from https://nodejs.org, then run: npx sauron-ai init",
            file=sys.stderr,
        )
        sys.exit(1)
    try:
        completed = subprocess.run(command, check=False)
    except KeyboardInterrupt:
        sys.exit(130)
    sys.exit(completed.returncode)


if __name__ == "__main__":
    main()
