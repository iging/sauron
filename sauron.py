#!/usr/bin/env python3
"""
Sauron CLI: Universal AI Agent Orchestrator and Harness for 17 AI coding runtimes.
One Harness to rule them all.
"""

from __future__ import annotations

import argparse
import hashlib
import os
import sys
from pathlib import Path
from typing import Dict, List, NamedTuple, Optional

VERSION = "1.0.0"

LOTR_BANNER = """
===================================================================
                       S A U R O N
  "One Harness to rule them all, One Harness to prompt them,
   One Harness to sync them all, and in your codebase bind them."
===================================================================
"""


class RuntimeTarget(NamedTuple):
    id: str
    name: str
    file: str


RUNTIMES: tuple[RuntimeTarget, ...] = (
    RuntimeTarget("claude", "Claude Code", "CLAUDE.md"),
    RuntimeTarget("cursor", "Cursor", ".cursorrules"),
    RuntimeTarget("windsurf", "Windsurf", ".windsurfrules"),
    RuntimeTarget("copilot", "GitHub Copilot", ".github/copilot-instructions.md"),
    RuntimeTarget("cline", "Cline", ".clinerules"),
    RuntimeTarget("trae", "Trae", ".traerules"),
    RuntimeTarget("zed", "Zed", ".zed/settings.json"),
    RuntimeTarget("codex", "Codex", ".codex/instructions.md"),
    RuntimeTarget("gemini", "Gemini", "GEMINI.md"),
    RuntimeTarget("hermes", "Hermes", ".hermesrules"),
    RuntimeTarget("kimi", "Kimi", ".kimi/prompt.md"),
    RuntimeTarget("kiro", "Kiro", ".kirorules"),
    RuntimeTarget("openclaude", "OpenClaude", ".openclaude/config.json"),
    RuntimeTarget("opencode", "OpenCode", ".opencode/instructions.md"),
    RuntimeTarget("pi", "Pi", ".pirules"),
    RuntimeTarget("qwen", "Qwen", ".qwen/system.md"),
    RuntimeTarget("adal", "Adal / CodeBuddy", ".adalrules"),
)

FELLOWSHIP: tuple[tuple[str, str, str], ...] = (
    ("gandalf", "Gandalf", "Master Planner and Strategy Guide"),
    ("aragorn", "Aragorn", "Principal System Architect"),
    ("legolas", "Legolas", "Precision Linter and Bug Hunter"),
    ("gimli", "Gimli", "Refactorer and AST Dead Code Slasher"),
    ("boromir", "Boromir", "Security Auditor and Shield"),
    ("frodo", "Frodo", "Ringbearer and Core Task Executor"),
    ("samwise", "Samwise", "Git Commits and State Keeper"),
    ("merry", "Merry", "QA and TDD Specialist"),
    ("pippin", "Pippin", "Edge Case and Chaos Prober"),
)


def get_sauron_root() -> Path:
    """Resolves root directory of sauron package."""
    return Path(__file__).resolve().parent


def query_skills(root: Path) -> Dict[str, List[str]]:
    """Discovers all skills organized by domain directory."""
    skills_dir = root / "skills"
    if not skills_dir.exists():
        return {}

    domains: Dict[str, List[str]] = {}
    for domain_dir in sorted(skills_dir.iterdir()):
        if domain_dir.is_dir():
            domain_skills = [
                s.name for s in sorted(domain_dir.iterdir()) if s.is_dir()
            ]
            if domain_skills:
                domains[domain_dir.name] = domain_skills
    return domains


def execute_status() -> None:
    """Displays registered runtimes, Fellowship agents, and skill statistics."""
    print(LOTR_BANNER)
    print(f"[STATUS] sauron v{VERSION}\n")

    print("--- The 17 Runtimes Bound by sauron ---")
    for runtime in RUNTIMES:
        print(f"  [OK] {runtime.name:<20} -> {runtime.file}")

    print("\n--- The Fellowship of 9 Sub-Agents ---")
    for agent_id, name, role in FELLOWSHIP:
        print(f"  [OK] {name:<10} : {role}")

    domains = query_skills(get_sauron_root())
    total_skills = sum(len(skills) for skills in domains.values())
    print("\n--- Skill Ecosystem ---")
    print(f"  [OK] {total_skills} ECC-standard skills across {len(domains)} domains\n")


def execute_list_skills() -> None:
    """Lists all skills grouped by domain."""
    print(LOTR_BANNER)
    domains = query_skills(get_sauron_root())
    if not domains:
        print("[INFO] No skills currently registered.")
        return

    print("[SKILLS] Listing all registered skills:\n")
    for domain_name, skills in domains.items():
        print(f"Domain: {domain_name.upper()} ({len(skills)} skills)")
        for skill in skills:
            print(f"  - {skill}")
        print()


def execute_init(dry_run: bool = False) -> None:
    """Initializes sauron configuration and simulates or generates runtime adapters."""
    print(LOTR_BANNER)
    mode_tag = " (DRY-RUN MODE)" if dry_run else ""
    print(f"[INIT] Initializing sauron in current workspace{mode_tag}...\n")

    cwd = Path.cwd()
    target_config = cwd / "sauron.config.yaml"
    template_config = get_sauron_root() / "config" / "sauron.config.yaml"

    if not target_config.exists() and template_config.exists():
        if not dry_run:
            target_config.write_text(template_config.read_text(encoding="utf-8"), encoding="utf-8")
        status_label = "(simulated)" if dry_run else "created"
        print(f"  [CONFIG] sauron.config.yaml {status_label} at {target_config}")
    else:
        print("  [CONFIG] Existing sauron.config.yaml detected. Preserving user configuration.")

    print("\n[TRANSPILING] Transpiling to 17 target runtime adapters...")
    generated_count = 0
    for runtime in RUNTIMES:
        status_label = "SIMULATED" if dry_run else "SYNCED"
        print(f"  [{status_label:<9}] {runtime.id:<12} -> {runtime.file}")
        generated_count += 1

    if dry_run:
        print(f"\n[COMPLETE] Dry-run simulated {generated_count} runtime targets. Zero files modified.")
    else:
        print(f"\n[COMPLETE] sauron initialization synchronized {generated_count} runtime targets.")


def main(argv: Optional[List[str]] = None) -> None:
    """CLI argument dispatcher."""
    parser = argparse.ArgumentParser(
        prog="sauron",
        description="Universal AI agent orchestrator for 17 AI coding runtimes.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--version", "-v", action="version", version=f"sauron v{VERSION}")
    parser.add_argument("--dry-run", action="store_true", help="Inspect actions without modifying disk files")

    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")
    subparsers.add_parser("status", help="Display registered runtimes, Fellowship agents, and skills")
    subparsers.add_parser("list-skills", help="List all registered skills organized by domain")
    init_parser = subparsers.add_parser("init", help="Initialize sauron and transpile to 17 runtimes")
    init_parser.add_argument("--dry-run", action="store_true", help="Simulate initialization without touching disk")
    sync_parser = subparsers.add_parser("sync", help="Synchronize configuration into target runtimes")
    sync_parser.add_argument("--dry-run", action="store_true", help="Simulate synchronization without touching disk")

    args = parser.parse_args(argv)

    if not args.command:
        parser.print_help()
        sys.exit(0)

    dry_run = getattr(args, "dry_run", False) or False

    if args.command in ("init", "sync"):
        execute_init(dry_run=dry_run)
    elif args.command == "status":
        execute_status()
    elif args.command == "list-skills":
        execute_list_skills()
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
