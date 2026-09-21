#!/usr/bin/env node
// @ts-check

/**
 * @fileoverview Documentation Gate Validator for Sauron.
 * Enforces documentation-first discipline via pre-commit and pre-push lifecycle checks.
 *
 * Directives:
 * 1. Pre-commit: If critical code (adapters, skills, bin, core) is modified,
 *    verifies that either a documentation file or sauron/docs/pending-docs.md is also staged.
 * 2. Pre-push: Prevents pushing or merging to the main branch if sauron/docs/pending-docs.md
 *    contains unresolved documentation debt.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Root of sauron package is two levels up: scripts/hooks -> sauron root
const SAURON_ROOT = path.resolve(__dirname, "..", "..");
const PENDING_DOCS_PATH = path.join(SAURON_ROOT, "docs", "pending-docs.md");

/**
 * Critical directories requiring documentation when modified.
 * @type {readonly string[]}
 */
const CRITICAL_DIRECTORIES = Object.freeze([
  "adapters/",
  "skills/",
  "bin/",
  "core/",
]);

/**
 * Executes a git command safely and returns standard output trimmed.
 *
 * @param {string} command - Git command string to execute.
 * @returns {string} Standard output or empty string on error.
 */
function runGit(command) {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

/**
 * Extracts active bullet items from pending-docs.md, ignoring markdown headers and HTML comments.
 *
 * @param {string} filePath - Path to the pending-docs.md file.
 * @returns {string[]} List of pending documentation task strings.
 */
function parsePendingItems(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf8");
  // Strip multi-line HTML comments (<!-- ... -->)
  const stripped = raw.replace(/<!--[\s\S]*?-->/g, "");
  const lines = stripped.split(/\r?\n/);

  /** @type {string[]} */
  const pendingItems = [];
  for (const line of lines) {
    const trimmed = line.trim();
    // Match markdown list items that contain actual description content
    if (
      trimmed.startsWith("- [ ]") ||
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ")
    ) {
      const content = trimmed.replace(/^[-*]\s*(\[\s*\])?\s*/, "").trim();
      if (content.length > 0) {
        pendingItems.push(content);
      }
    }
  }

  return pendingItems;
}

/**
 * Validates pre-commit stage: requires docs or pending debt entry when code changes.
 *
 * @returns {void}
 */
function handlePreCommit() {
  // Allow explicit bypass for emergency patches or minor typos via environment variable.
  if (process.env.SKIP_DOCS === "1" || process.env.SKIP_DOCS === "true") {
    console.log("[DOC GATE] SKIP_DOCS detected. Documentation gate bypassed.");
    process.exit(0);
  }

  // Get list of currently staged files in git
  const stagedOutput = runGit("git diff --cached --name-only");
  if (!stagedOutput) {
    // Nothing staged or not a git repository
    process.exit(0);
  }

  const stagedFiles = stagedOutput.split(/\r?\n/).filter(Boolean);

  // Filter staged files to see if any touch critical code directories
  const criticalModified = stagedFiles.filter((file) => {
    // Normalize path to handle both root and sauron-prefixed paths
    const relative = file.startsWith("sauron/") ? file.slice(7) : file;
    return CRITICAL_DIRECTORIES.some((dir) => relative.startsWith(dir));
  });

  if (criticalModified.length === 0) {
    // Only non-critical files (tests, config, chore) modified; pass immediately.
    process.exit(0);
  }

  // Check if any documentation file was also staged
  const hasDocStaged = stagedFiles.some((file) => {
    const lower = file.toLowerCase();
    return (
      lower.includes("docs/") ||
      lower.endsWith("pending-docs.md") ||
      lower.endsWith("skill.md") ||
      lower.endsWith("readme.md") ||
      lower.endsWith("agents.md") ||
      lower.endsWith("claude.md") ||
      lower.endsWith("gemini.md")
    );
  });

  if (!hasDocStaged) {
    console.error(
      "\n===================================================================",
    );
    console.error(
      "              SAURON DOC GATE : PRE-COMMIT FAILED                  ",
    );
    console.error(
      "===================================================================",
    );
    console.error(
      "Critical code files were modified without accompanying documentation:\n",
    );
    for (const file of criticalModified) {
      console.error(`  - ${file}`);
    }
    console.error(
      "\nTo resolve this check, choose one of the following actions:",
    );
    console.error(
      "  1. Stage updated documentation in sauron/docs/ or the appropriate SKILL.md.",
    );
    console.error(
      "  2. Record the item in sauron/docs/pending-docs.md to complete before merging.",
    );
    console.error(
      "  3. For trivial changes, bypass by setting: SKIP_DOCS=1 git commit\n",
    );
    process.exit(1);
  }

  console.log(
    "[DOC GATE] Pre-commit validation passed. Documentation accounted for.",
  );
}

/**
 * Validates pre-push stage: blocks push to main if pending-docs.md has unresolved entries.
 *
 * @returns {void}
 */
function handlePrePush() {
  // Determine target or current branch
  const currentBranch =
    process.env.GITHUB_REF_NAME || runGit("git rev-parse --abbrev-ref HEAD");

  const pendingItems = parsePendingItems(PENDING_DOCS_PATH);

  // If pushing or merging to main, pending-docs must be completely empty.
  const isMainBranch = currentBranch === "main" || currentBranch === "master";

  if (isMainBranch && pendingItems.length > 0) {
    console.error(
      "\n===================================================================",
    );
    console.error(
      "              SAURON DOC GATE : PRE-PUSH BLOCKED                   ",
    );
    console.error(
      "===================================================================",
    );
    console.error(
      `Cannot push or merge to '${currentBranch}' with unresolved documentation debt!\n`,
    );
    console.error("Pending items found in sauron/docs/pending-docs.md:\n");
    for (const item of pendingItems) {
      console.error(`  [PENDING] ${item}`);
    }
    console.error(
      "\nPlease write clean documentation in sauron/docs/ and clear",
    );
    console.error(
      "sauron/docs/pending-docs.md before pushing to the main branch.\n",
    );
    process.exit(1);
  }

  if (pendingItems.length > 0) {
    console.log(
      `[DOC GATE] Notice: ${pendingItems.length} pending documentation item(s) on feature branch '${currentBranch}'.`,
    );
  } else {
    console.log(
      "[DOC GATE] Pre-push validation passed. Zero documentation debt detected.",
    );
  }
}

/**
 * CLI dispatcher for doc gate checks.
 */
function main() {
  const args = process.argv.slice(2);
  const isPrePush = args.includes("--pre-push");
  const isPreCommit = args.includes("--pre-commit");

  if (isPrePush) {
    handlePrePush();
  } else if (isPreCommit) {
    handlePreCommit();
  } else {
    // Default: run both checks
    handlePreCommit();
    handlePrePush();
  }
}

main();
