/// <reference types="node" />
/**
 * @fileoverview Type definitions for Sauron transpiler, adapters, and intermediate representations.
 * Strictly adheres to sauron typescript-standards. No barrel files.
 *
 * This module defines the architectural contracts used across all 17 runtime adapters,
 * the conflict manager, and the CLI transpiler pipeline.
 */

/**
 * Audit record tracking a single managed configuration or instruction file.
 *
 * Persisted within `.sauron/manifest.json` to allow idempotent synchronization
 * and rollback verification across multi-agent environments.
 */
export interface ManagedFileRecord {
  /** Relative workspace path to the managed configuration file. */
  path: string;
  /** Unique identifier of the AI runtime adapter that generated this file. */
  runtime: string;
  /** Relative path to the most recent timestamped backup if an existing file was replaced. */
  backupPath: string | null;
  /** Cryptographic SHA-256 digest of the managed file contents at sync time. */
  checksum: string;
  /** ISO-8601 UTC timestamp recording when this record was written or updated. */
  lastUpdated: string;
}

/**
 * Manifest state document stored in `.sauron/manifest.json`.
 *
 * Provides a tamper-evident catalog of all files created or modified by Sauron,
 * preventing unbacked destructive overwrites across multi-agent sessions.
 */
export interface SauronManifest {
  /** ISO-8601 timestamp of the initial Sauron harness initialization. */
  installedAt: string;
  /** Schema and engine semantic version of Sauron that generated the manifest. */
  version: string;
  /** Complete list of configuration files actively tracked under Sauron governance. */
  managedFiles: ManagedFileRecord[];
}

/**
 * Result report generated after attempting a safe file write via ConflictManager.
 */
export interface WriteFileResult {
  /** Workspace-relative destination path of the file. */
  filePath: string;
  /** Runtime adapter identifier responsible for the output. */
  runtime: string;
  /**
   * Action taken by ConflictManager during write:
   * - `created`: New file created; no prior collision.
   * - `updated`: Pre-existing file content differed; backup was generated before overwrite.
   * - `unchanged`: Pre-existing file matched SHA-256 hash exactly; disk write skipped.
   * - `simulated`: Dry-run mode active; no disk mutations performed.
   */
  action: "created" | "updated" | "unchanged" | "simulated";
  /** Path to the timestamped backup file if an existing file was updated, or null. */
  backupPath: string | null;
}

/**
 * Authority boundaries restricting which areas of the codebase a sub-agent may modify.
 */
export interface AgentAuthority {
  /** Glob patterns or directory paths this agent has explicit permission to edit. */
  canModify: string[];
  /** Glob patterns or directory paths strictly off-limits to this agent. */
  mustNotModify: string[];
}

/**
 * Intermediate Representation (IR) of a Fellowship sub-agent persona.
 *
 * Decouples agent definitions in `core/fellowship/*.md` from specific runtime
 * configuration formats (such as Claude Code commands, Cursor rules, or Cline instructions).
 */
export interface FellowshipAgentIR {
  /** Canonical slug identifier (e.g., 'gandalf', 'aragorn'). */
  id: string;
  /** Display name of the agent. */
  name: string;
  /** Primary operational role and functional mandate. */
  role: string;
  /** Department assigned within the harness governance matrix. */
  department: string;
  /** User-invoked slash command shortcut (e.g., '/gandalf'). */
  slashCommand: string;
  /** Short mnemonic tag used in prompt prefixes and context headers. */
  tag: string;
  /** Path-level boundary permissions. */
  authority: AgentAuthority;
  /** List of Linux Foundation Anti-Pattern IDs this agent is configured to actively prevent. */
  preventedAntiPatterns: string[];
}

/**
 * Intermediate Representation (IR) of a modular capability skill.
 */
export interface SkillIR {
  /** Unique skill identifier matching the directory or file slug. */
  id: string;
  /** Human-readable name of the skill suite. */
  name: string;
  /** Functional department owning the skill (e.g., 'frontend', 'security', 'devops'). */
  department: string;
  /** Persona or fellowship member assigned as primary owner. */
  ownerAgent: string;
  /** Slash command trigger associated with this capability. */
  triggerCommand: string;
  /** Dense one-line summary explaining the skill's purpose and scope. */
  summary: string;
}

/**
 * Master context supplied to every runtime adapter during the transpilation phase.
 *
 * Contains aggregated project facts, active fellowship agents, skill suites,
 * shared engineering rules, and credit-saving anti-pattern constraints.
 */
export interface TranspileContext {
  /** Name of the active repository or target project. */
  projectName: string;
  /** Brief description of the project architecture and domain. */
  projectDescription: string;
  /** Semantic version of the Sauron harness. */
  version: string;
  /** Array of parsed Fellowship sub-agent definitions. */
  fellowship: FellowshipAgentIR[];
  /** Array of active engineering skills across all 7 departments. */
  skills: SkillIR[];
  /** Universal normative coding and communication rules enforced across all agents. */
  rules: string[];
  /** Linux Foundation anti-patterns actively guarded against. */
  antiPatterns: string[];
}

/**
 * Single transpilation output artifact ready to be committed or dry-run evaluated.
 */
export interface TranspileOutput {
  /** Relative destination path within the workspace root (e.g., '.cursorrules', 'CLAUDE.md'). */
  relativePath: string;
  /** Fully rendered text content tailored to the specific AI coding tool. */
  content: string;
  /** Structural format of the emitted output. */
  format: "markdown" | "json" | "yaml" | "text";
}

/**
 * Pluggable adapter contract for compiling the intermediate representation into
 * tool-specific prompt files, rules, or configuration settings.
 */
export interface RuntimeAdapter {
  /** Unique machine identifier for this adapter (e.g., 'claude', 'copilot', 'cursor'). */
  readonly id: string;
  /** Human-readable display name of the target AI runtime. */
  readonly name: string;
  /** List of relative file paths managed or generated by this adapter. */
  readonly targetFiles: string[];
  /**
   * Transforms universal intermediate context into one or more tool-specific output files.
   *
   * @param context - The unified TranspileContext containing agents, skills, and rules.
   * @returns Array of TranspileOutput objects ready to be safely committed to disk.
   */
  transpile(context: TranspileContext): TranspileOutput[];
}

/**
 * Standard Token Optimization (Caveman Mode) instruction block.
 * Shared across all runtime adapters for 100% behavioral parity.
 *
 * @param headingLevel - Markdown heading level ('##' or '###').
 * @returns Array of markdown lines specifying Caveman mode directives.
 */
export function formatCavemanSection(
  headingLevel: "##" | "###" = "##",
): string[] {
  return [
    `${headingLevel} Token Optimization & Caveman Mode`,
    "",
    "- When contributor triggers `/caveman` (or `lite`, `ultra`), enforce terse, spartan communication.",
    "- Drop conversational pleasantries, filler phrases, and tool narration overhead.",
    "- Never alter or compress code blocks, diffs, file paths, or commands.",
    "- Restore normal conversational style immediately when requested with `/caveman off`.",
    "",
  ];
}
