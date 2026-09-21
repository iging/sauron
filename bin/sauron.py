#!/usr/bin/env python3
"""
CLI wrapper for sauron Python package.
"""
import sys
from pathlib import Path

# Add parent directory to sys.path to import sauron module
sauron_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(sauron_dir))

from sauron import main

if __name__ == "__main__":
    main()
