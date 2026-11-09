/// <reference types="node" />
/** @fileoverview Bounded, read-only discovery for project agent configuration. Never execute or fetch. */
import * as fs from "node:fs";
import * as path from "node:path";
import { analyzeAgentFile, type ScanIssue } from "./scan-rules.js";
import { toSarif, type SinkFinding } from "./slopsquat.js";

export const SCAN_LIMITS = Object.freeze({
  files: 2000,
  entries: 8000,
  depth: 8,
  fileBytes: 1024 * 1024,
  totalBytes: 16 * 1024 * 1024,
});

export const SCAN_FILES: readonly string[] = [
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  "QWEN.md",
  "CODEBUDDY.md",
  ".cursorrules",
  ".clinerules",
  ".windsurfrules",
  ".rules",
  ".mcp.json",
  ".mcp.yaml",
  ".mcp.yml",
  "opencode.json",
  "opencode.jsonc",
  ".claude/settings.json",
  ".claude/settings.local.json",
  ".codex/config.toml",
  ".codex/hooks.json",
  ".cursor/mcp.json",
  ".cursor/hooks.json",
  ".vscode/mcp.json",
  ".vscode/settings.json",
  ".gemini/settings.json",
  ".omp/mcp.json",
  ".pi/settings.json",
];

export const SCAN_DIRECTORIES: readonly string[] = [
  ".claude/agents",
  ".claude/commands",
  ".claude/rules",
  ".claude/hooks",
  ".claude/skills",
  ".agents/skills",
  ".github/agents",
  ".github/prompts",
  ".github/instructions",
  ".github/hooks",
  ".github/skills",
  ".codex/agents",
  ".codex/prompts",
  ".cursor/rules",
  ".cursor/commands",
  ".cursor/hooks",
  ".opencode/agents",
  ".opencode/commands",
  ".opencode/plugins",
  ".omp/agents",
  ".omp/prompts",
  ".omp/hooks",
  ".gemini/commands",
  ".gemini/hooks",
  ".pi/prompts",
  ".windsurf/rules",
  ".cline/rules",
];

const EXCLUDED = new Set([
  ".git",
  ".sauron",
  "node_modules",
  "worktrees",
  ".obsidian",
  "auth.json",
  "credentials.json",
  "secrets.json",
]);

const EXTENSIONS = new Set([
  "md",
  "mdc",
  "json",
  "jsonc",
  "yaml",
  "yml",
  "toml",
  "sh",
  "ps1",
  "js",
  "mjs",
  "ts",
  "py",
  "cmd",
  "bat",
]);

export interface ScanReport {
  version: 1;
  complete: boolean;
  scannedFiles: string[];
  heuristicFiles: string[];
  skippedFiles: number;
  findings: SinkFinding[];
  diagnostics: ScanIssue[];
  limitations: readonly string[];
}

/** No source values, exception text, or absolute workspace paths enter the report. */
export function scanWorkspace(workspaceRoot: string): ScanReport {
  const report: ScanReport = {
    version: 1,
    complete: true,
    scannedFiles: [],
    heuristicFiles: [],
    skippedFiles: 0,
    findings: [],
    diagnostics: [],
    limitations: [
      "Static review hints only. No effective permission or runtime behavior is evaluated.",
      "Only selected project paths are inspected. No automatic home/global or other-worktree discovery.",
      "TOML is heuristic, not a full syntax or schema validation. JSON/YAML declarations use file-level line 1.",
      "Source values and snippets are omitted. No network, execution, repair, or report files are created.",
      "Link and identity checks are not an OS sandbox against concurrent parent-path replacement.",
    ],
  };
  const issue = (file: string, code: string, message: string) => {
    report.complete = false;
    if (
      !report.diagnostics.some(
        (entry) => entry.file === file && entry.code === code,
      )
    )
      report.diagnostics.push({ file, code, message });
  };
  let root: string;
  try {
    if (fs.lstatSync(workspaceRoot).isSymbolicLink())
      throw new Error("linked root");
    root = fs.realpathSync(workspaceRoot);
    if (!fs.statSync(root).isDirectory()) throw new Error("not a directory");
  } catch {
    issue(".", "scan-root", "Target directory cannot be inspected.");

    return report;
  }
  const metadata = (
    relative: string,
  ): { full: string; stat: fs.Stats } | undefined => {
    let full = root;
    const parts = relative.split("/");

    for (let index = 0; index < parts.length; index++) {
      full = path.join(full, parts[index] ?? "");
      let stat: fs.Stats;
      try {
        stat = fs.lstatSync(full);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "ENOENT"
        )
          return undefined;
        issue(relative, "scan-read", "Selected path cannot be inspected.");

        return undefined;
      }
      if (stat.isSymbolicLink()) {
        issue(
          relative,
          "scan-link",
          "Selected symlink or junction is not followed.",
        );

        return undefined;
      }
      if (index < parts.length - 1 && !stat.isDirectory()) {
        issue(relative, "scan-read", "Selected parent is not a directory.");

        return undefined;
      }
      if (index === parts.length - 1) return { full, stat };
    }

    return undefined;
  };
  const files = new Map<string, { full: string; stat: fs.Stats }>();
  let entries = 0;
  let capped = false;
  const visit = (relative: string, depth: number): void => {
    if (capped) return;

    const info = metadata(relative);

    if (!info) return;
    if (info.stat.isDirectory()) {
      if (depth > SCAN_LIMITS.depth) {
        issue(relative, "scan-depth", "Selected tree exceeds the depth limit.");

        return;
      }

      let directory: fs.Dir | undefined;
      try {
        directory = fs.opendirSync(info.full);
        for (;;) {
          const entry = directory.readSync();

          if (!entry) break;
          if (++entries > SCAN_LIMITS.entries) {
            capped = true;
            issue(
              relative,
              "scan-limit",
              "Selected trees exceed the entry limit.",
            );
            break;
          }
          if (
            EXCLUDED.has(entry.name.toLowerCase()) ||
            entry.name.startsWith(".env")
          ) {
            report.skippedFiles++;
            continue;
          }
          if (
            entry.isDirectory() ||
            entry.isSymbolicLink() ||
            EXTENSIONS.has(entry.name.split(".").pop()?.toLowerCase() ?? "") ||
            relative.includes("/hooks")
          )
            visit(relative + "/" + entry.name, depth + 1);
          else report.skippedFiles++;
          if (capped) break;
        }
      } catch {
        issue(
          relative,
          "scan-read",
          "Selected directory cannot be fully inspected.",
        );
      } finally {
        if (directory) {
          try {
            directory.closeSync();
          } catch {
            issue(
              relative,
              "scan-read",
              "Selected directory cannot be closed after inspection.",
            );
          }
        }
      }
    } else if (info.stat.isFile()) {
      if (files.size >= SCAN_LIMITS.files) {
        capped = true;
        issue(relative, "scan-limit", "Selected files exceed the file limit.");

        return;
      }
      files.set(relative, info);
    } else
      issue(relative, "scan-special", "Selected special file is not opened.");
  };

  for (const relative of [...SCAN_FILES, ...SCAN_DIRECTORIES])
    visit(relative, 0);
  let total = 0;

  for (const [relative, info] of [...files].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (info.stat.size > SCAN_LIMITS.fileBytes) {
      issue(
        relative,
        "scan-size",
        "Selected file exceeds the per-file byte limit.",
      );
      continue;
    }
    if (total + info.stat.size > SCAN_LIMITS.totalBytes) {
      issue(
        relative,
        "scan-size",
        "Selected files exceed the total byte limit.",
      );
      break;
    }

    let fd: number | undefined;
    try {
      if (!metadata(relative)) continue;
      fd = fs.openSync(
        info.full,
        fs.constants.O_RDONLY |
          (fs.constants.O_NOFOLLOW ?? 0) |
          (fs.constants.O_NONBLOCK ?? 0),
      );
      const before = fs.fstatSync(fd);

      if (
        !before.isFile() ||
        before.ino !== info.stat.ino ||
        before.dev !== info.stat.dev ||
        before.size > SCAN_LIMITS.fileBytes ||
        before.size !== info.stat.size ||
        before.mtimeMs !== info.stat.mtimeMs
      ) {
        issue(
          relative,
          "scan-changed",
          "Selected file changes during inspection.",
        );
        continue;
      }

      const buffer = Buffer.alloc(
        Math.min(before.size + 1, SCAN_LIMITS.fileBytes + 1),
      );
      let bytes = 0;

      while (bytes < buffer.length) {
        const count = fs.readSync(
          fd,
          buffer,
          bytes,
          buffer.length - bytes,
          null,
        );

        if (count === 0) break;
        bytes += count;
      }
      const after = fs.fstatSync(fd);

      if (
        bytes > SCAN_LIMITS.fileBytes ||
        bytes !== after.size ||
        before.size !== after.size ||
        before.mtimeMs !== after.mtimeMs
      ) {
        issue(
          relative,
          "scan-changed",
          "Selected file changes or exceeds limits during inspection.",
        );
        continue;
      }
      total += bytes;
      const text = new TextDecoder("utf-8", { fatal: true }).decode(
        buffer.subarray(0, bytes),
      );

      if (text.includes("\0")) {
        issue(relative, "scan-binary", "Selected file is not supported text.");
        continue;
      }

      const analysis = analyzeAgentFile(relative, text);
      report.scannedFiles.push(relative);
      if (analysis.heuristic) report.heuristicFiles.push(relative);
      report.findings.push(...analysis.findings);
      for (const diagnostic of analysis.issues)
        issue(diagnostic.file, diagnostic.code, diagnostic.message);
    } catch {
      issue(
        relative,
        "scan-read",
        "Selected file cannot be read as bounded UTF-8 text.",
      );
    } finally {
      if (fd !== undefined) {
        try {
          fs.closeSync(fd);
        } catch {
          issue(
            relative,
            "scan-read",
            "Selected file cannot be closed after inspection.",
          );
        }
      }
    }
  }
  report.findings.sort(
    (a, b) =>
      a.file.localeCompare(b.file) ||
      a.line - b.line ||
      a.rule.localeCompare(b.rule),
  );
  report.diagnostics.sort(
    (a, b) => a.file.localeCompare(b.file) || a.code.localeCompare(b.code),
  );

  return report;
}

/** Incomplete scans always fail, even when findings are configured as advisory. */
export function scanExitCode(
  report: ScanReport,
  failOn: "error" | "warning" | "none" = "error",
): number {
  if (!report.complete) return 2;

  return failOn !== "none" &&
    report.findings.some(
      (finding) => failOn === "warning" || finding.severity === "error",
    )
    ? 1
    : 0;
}

/** Reuses the slop-scan SARIF representation, including incomplete-scan diagnostics. */
export function scanSarif(report: ScanReport): string {
  const results: SinkFinding[] = [
    ...report.findings,
    ...report.diagnostics.map((entry) => ({
      rule: entry.code,
      severity: "error" as const,
      file: entry.file,
      line: 1,
      message: entry.message,
    })),
  ];

  return toSarif(
    results.map((entry) => ({
      ...entry,
      file: entry.file.split("/").map(encodeURIComponent).join("/"),
    })),
    "sauron-scan",
  );
}
