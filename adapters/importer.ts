/**
 * @fileoverview AGENTS.md first-class import with dry-run preview.
 * Migrates Cursor, Copilot, Windsurf, Cline, and Claude configs into Sauron source.
 * Research trace: aitoolsync platform mapping, cursor-to-claude migration, AGENTS.md standard.
 */

/**
 * Supported source platforms for import.
 */
export type SourcePlatform =
  | "cursor"
  | "copilot"
  | "windsurf"
  | "cline"
  | "claude"
  | "codex"
  | "gemini";

/**
 * Single file migration step in an import plan.
 */
export interface ImportStep {
  /** Source platform owning the file. */
  platform: SourcePlatform;
  /** Source file path relative to workspace. */
  source: string;
  /** Destination path under Sauron source tree. */
  destination: string;
  /** Action label. */
  action: "convert" | "copy" | "merge";
}

/**
 * Detects platform signal files present in a workspace listing.
 *
 * @param files - Workspace-relative file paths.
 * @returns Detected platforms sorted alphabetically.
 */
export function detectPlatforms(files: string[]): SourcePlatform[] {
  const detected = new Set<SourcePlatform>();
  for (const file of files) {
    const normalized = file.replace(/\\/g, "/");
    if (normalized === "CLAUDE.md" || normalized.startsWith(".claude/")) {
      detected.add("claude");
    }
    if (normalized === ".cursorrules" || normalized.startsWith(".cursor/")) {
      detected.add("cursor");
    }
    if (
      normalized === ".windsurfrules" ||
      normalized.startsWith(".windsurf/")
    ) {
      detected.add("windsurf");
    }
    if (normalized === ".clinerules" || normalized.startsWith(".cline/")) {
      detected.add("cline");
    }
    if (normalized === "AGENTS.md" || normalized.startsWith(".codex/")) {
      detected.add("codex");
    }
    if (normalized === "GEMINI.md" || normalized.startsWith(".gemini/")) {
      detected.add("gemini");
    }
    if (normalized.startsWith(".github/")) {
      detected.add("copilot");
    }
  }
  return [...detected].sort();
}

/**
 * Builds a deterministic import plan from detected source files.
 * Rejects empty input with fail-closed error.
 *
 * @param files - Workspace-relative source files.
 * @returns Sorted import steps.
 * @throws Error when no convertible files exist.
 */
export function buildImportPlan(files: string[]): ImportStep[] {
  const steps: ImportStep[] = [];
  for (const file of files) {
    const normalized = file.replace(/\\/g, "/");
    if (normalized === ".cursorrules") {
      steps.push({
        platform: "cursor",
        source: file,
        destination: ".agents/rules/cursor-legacy.md",
        action: "convert",
      });
    } else if (
      normalized.startsWith(".cursor/rules/") &&
      normalized.endsWith(".mdc")
    ) {
      const base = normalized.split("/").pop() ?? "rule.mdc";
      const name = base.replace(/\.mdc$/, ".md");
      steps.push({
        platform: "cursor",
        source: file,
        destination: `.agents/rules/${name}`,
        action: "convert",
      });
    } else if (normalized === ".windsurfrules") {
      steps.push({
        platform: "windsurf",
        source: file,
        destination: ".agents/rules/windsurf.md",
        action: "copy",
      });
    } else if (normalized === ".clinerules") {
      steps.push({
        platform: "cline",
        source: file,
        destination: ".agents/rules/cline.md",
        action: "copy",
      });
    } else if (normalized === "CLAUDE.md") {
      steps.push({
        platform: "claude",
        source: file,
        destination: ".agents/AGENTS.md",
        action: "merge",
      });
    } else if (normalized === "AGENTS.md") {
      steps.push({
        platform: "codex",
        source: file,
        destination: ".agents/AGENTS.md",
        action: "merge",
      });
    } else if (normalized === ".github/copilot-instructions.md") {
      steps.push({
        platform: "copilot",
        source: file,
        destination: ".agents/rules/copilot.md",
        action: "convert",
      });
    } else if (normalized === "GEMINI.md") {
      steps.push({
        platform: "gemini",
        source: file,
        destination: ".agents/rules/gemini.md",
        action: "copy",
      });
    }
  }
  if (steps.length === 0) {
    throw new Error("No convertible platform files detected for import");
  }
  steps.sort((a, b) => a.destination.localeCompare(b.destination));
  return steps;
}

/**
 * Converts Cursor MDC frontmatter into plain Sauron markdown.
 * Preserves body while stripping tool-specific control fields.
 *
 * @param content - Raw MDC file content.
 * @returns Converted markdown content.
 */
export function convertMdcToMarkdown(content: string): string {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (match === null) {
    return content.trim();
  }
  const body = (match[2] ?? "").trim();
  if (body === "") {
    throw new Error("MDC body must not be empty");
  }
  return `${body}\n`;
}

/**
 * Formats an import plan into CLI-readable lines.
 *
 * @param steps - Import steps to render.
 * @returns Multiline plan text.
 */
export function formatImportPlan(steps: ImportStep[]): string {
  const lines: string[] = [`import-steps=${steps.length}`];
  for (const step of steps) {
    lines.push(
      `  [${step.action.toUpperCase()}] ${step.platform} ${step.source} -> ${step.destination}`,
    );
  }
  lines.push(
    "Run with --dry-run first. Existing files receive .bak backup before overwrite.",
  );
  return lines.join("\n");
}
