/// <reference types="node" />
/**
 * @fileoverview Conflict detection, non-destructive backup, and state manifest manager.
 * Guarantees zero unbacked overwrites during multi-runtime synchronization.
 * Follows sauron typescript-standards. No barrel files.
 *
 * Designed to provide safety guarantees for developers running AI harnesses across
 * concurrent editors (e.g. Claude Code, Cursor, Copilot, Windsurf) without losing
 * manual customizations or accidental overwrites.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import type {
  ManagedFileRecord,
  SauronManifest,
  WriteFileResult,
} from "./types.js";
export type { ManagedFileRecord, SauronManifest, WriteFileResult };

/** Opening and closing marker text of the Sauron-managed block. */
const MARKER_START =
  "sauron:start (managed by Sauron; edit outside this block)";
const MARKER_END = "sauron:end";

/**
 * Returns comment-wrapped markers matching the file's syntax.
 * TOML and YAML use `#` comments; everything else uses HTML comments.
 */
function markersFor(relativePath: string): { start: string; end: string } {
  if (/\.(toml|ya?ml)$/i.test(relativePath)) {
    return { start: `# ${MARKER_START}`, end: `# ${MARKER_END}` };
  }
  return { start: `<!-- ${MARKER_START} -->`, end: `<!-- ${MARKER_END} -->` };
}

/** Splits leading YAML frontmatter (`---` ... `---`) from the body. */
function splitFrontmatter(content: string): {
  frontmatter: string;
  body: string;
} {
  const match = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(content);
  if (!match) {
    return { frontmatter: "", body: content };
  }
  return { frontmatter: match[0], body: content.slice(match[0].length) };
}

/** Builds the managed block for a body of Sauron content. */
function managedBlock(relativePath: string, body: string): string {
  const { start, end } = markersFor(relativePath);
  return `${start}\n${body.replace(/\s+$/, "")}\n${end}\n`;
}

/** Wraps new Sauron content in a managed block, keeping frontmatter first. */
function wrapManagedBlock(relativePath: string, content: string): string {
  const { frontmatter, body } = splitFrontmatter(content);
  return frontmatter + managedBlock(relativePath, body);
}

/**
 * Replaces the managed block inside a user file, or appends one when absent.
 * Sauron frontmatter is dropped because the user file controls its own header.
 */
function mergeManagedBlock(
  relativePath: string,
  content: string,
  existing: string,
): string {
  const { start, end } = markersFor(relativePath);
  const block = managedBlock(relativePath, splitFrontmatter(content).body);
  const startIndex = existing.indexOf(start);
  const endIndex = startIndex >= 0 ? existing.indexOf(end, startIndex) : -1;
  if (startIndex >= 0 && endIndex >= 0) {
    let after = endIndex + end.length;
    if (existing[after] === "\r") after += 1;
    if (existing[after] === "\n") after += 1;
    return existing.slice(0, startIndex) + block + existing.slice(after);
  }
  const separator =
    existing.length === 0 || existing.endsWith("\n\n")
      ? ""
      : existing.endsWith("\n")
        ? "\n"
        : "\n\n";
  return existing + separator + block;
}

/** Recursively merges plain objects; values from `user` always win. */
function deepMergeUserWins(sauron: unknown, user: unknown): unknown {
  const isPlain = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null && !Array.isArray(v);
  if (!isPlain(sauron) || !isPlain(user)) {
    return user;
  }
  const merged: Record<string, unknown> = { ...sauron };
  for (const [key, value] of Object.entries(user)) {
    merged[key] = key in sauron ? deepMergeUserWins(sauron[key], value) : value;
  }
  return merged;
}

/**
 * Merges Sauron JSON into a user JSON file, keeping every user key and value.
 * Returns null when either document is not valid JSON (the file must not be touched).
 */
function mergeJsonPreservingUser(
  content: string,
  existing: string,
): string | null {
  try {
    const merged = deepMergeUserWins(JSON.parse(content), JSON.parse(existing));
    return `${JSON.stringify(merged, null, 2)}\n`;
  } catch {
    return null;
  }
}

/**
 * Manages file mutation safety across all AI tool runtime adapters.
 *
 * Implements a write-safety protocol:
 * 1. Hashes target content using SHA-256 to avoid redundant disk I/O.
 * 2. Compares against existing on-disk content.
 * 3. Automatically backs up pre-existing differing files to `.sauron/backups/`.
 * 4. Maintains a central audit trail in `.sauron/manifest.json`.
 */
export class ConflictManager {
  /** Absolute path to the user's workspace root directory. */
  private readonly workspaceRoot: string;
  /** Internal Sauron state storage directory (`.sauron`). */
  private readonly sauronDir: string;
  /** Storage directory for timestamped backup snapshots. */
  private readonly backupDir: string;
  /** File path to the persistent state manifest. */
  private readonly manifestPath: string;

  /**
   * Initializes a new ConflictManager bound to a specific workspace root.
   *
   * @param workspaceRoot - The target project directory root path.
   */
  public constructor(workspaceRoot: string) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.sauronDir = path.join(this.workspaceRoot, ".sauron");
    this.backupDir = path.join(this.sauronDir, "backups");
    this.manifestPath = path.join(this.sauronDir, "manifest.json");
  }

  /**
   * Computes a deterministic cryptographic SHA-256 hash string for given text content.
   *
   * Using SHA-256 ensures content changes are detected accurately regardless of file
   * modification timestamps (mtime), git checkouts, or cross-platform line ending changes.
   *
   * @param content - The UTF-8 string to hash.
   * @returns Formatted hash string prefixed with algorithm identifier (e.g., 'sha256:...').
   */
  public computeChecksum(content: string): string {
    return `sha256:${crypto.createHash("sha256").update(content, "utf8").digest("hex")}`;
  }

  /**
   * Reads existing manifest from disk or initializes a clean manifest if missing or invalid.
   *
   * Fails gracefully to an empty in-memory structure to prevent crashing the CLI
   * if the user manually modified or corrupted the JSON file.
   *
   * @returns Parsed SauronManifest state object.
   */
  public loadManifest(): SauronManifest {
    if (!fs.existsSync(this.manifestPath)) {
      return {
        installedAt: new Date().toISOString(),
        version: "1.0.0",
        managedFiles: [],
      };
    }

    try {
      const raw = fs.readFileSync(this.manifestPath, "utf8");
      return JSON.parse(raw) as SauronManifest;
    } catch {
      // Fallback prevents CLI failure when manifest JSON contains syntax errors or partial writes.
      return {
        installedAt: new Date().toISOString(),
        version: "1.0.0",
        managedFiles: [],
      };
    }
  }

  /**
   * Persists the manifest audit record to `.sauron/manifest.json`.
   *
   * Automatically ensures the parent `.sauron` directory exists before writing.
   *
   * @param manifest - The complete manifest object to serialize and save.
   */
  public saveManifest(manifest: SauronManifest): void {
    if (!fs.existsSync(this.sauronDir)) {
      fs.mkdirSync(this.sauronDir, { recursive: true });
    }
    fs.writeFileSync(
      this.manifestPath,
      JSON.stringify(manifest, null, 2),
      "utf8",
    );
  }

  /**
   * Writes content to a destination file without destroying user content.
   *
   * Text files carry Sauron content inside a managed block delimited by
   * `sauron:start` / `sauron:end` markers (placed after any YAML frontmatter).
   * JSON files are deep-merged so that user keys always win.
   *
   * Evaluation lifecycle:
   * 1. Target missing: writes the rendered content and registers it in the manifest.
   * 2. Target identical to the merge result: returns 'unchanged'.
   * 3. Dry run: returns 'simulated' without touching disk.
   * 4. Target still byte-identical to what Sauron last wrote: replaced ('updated').
   * 5. Otherwise the target belongs to the user:
   *    - Text: only the managed block is replaced, or appended when absent ('merged').
   *    - JSON: Sauron keys are added, user keys and values are kept ('merged').
   *    - Unparseable JSON: left untouched ('skipped').
   *    Every replace or merge first copies the old file to `.sauron/backups/`.
   *
   * @param relativePath - Target file path relative to workspace root (for example, 'CLAUDE.md').
   * @param content - Rendered file content to write.
   * @param runtime - Identifier of the AI runtime generating the file.
   * @param dryRun - When true, evaluates changes without modifying disk. Defaults to false.
   * @returns Detailed WriteFileResult summarizing action taken and backup location.
   */
  public safeWrite(
    relativePath: string,
    content: string,
    runtime: string,
    dryRun: boolean = false,
  ): WriteFileResult {
    const targetPath = path.join(this.workspaceRoot, relativePath);
    const isJson = relativePath.toLowerCase().endsWith(".json");
    const rendered = isJson ? content : wrapManagedBlock(relativePath, content);
    const result = (
      action: WriteFileResult["action"],
      backupPath: string | null = null,
    ): WriteFileResult => ({
      filePath: relativePath,
      runtime,
      action,
      backupPath,
    });

    if (!fs.existsSync(targetPath)) {
      if (dryRun) {
        return result("simulated");
      }
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, rendered, "utf8");
      this.recordInManifest(
        relativePath,
        runtime,
        null,
        this.computeChecksum(rendered),
      );
      return result("created");
    }

    const existing = fs.readFileSync(targetPath, "utf8");
    if (existing === rendered) {
      return result("unchanged");
    }

    // Sauron owns the file only if it wrote the whole file (never merged into
    // a user file) and nobody has edited it since.
    const record = this.loadManifest().managedFiles.find(
      (f) => f.path === relativePath,
    );
    const ownedByUs =
      record !== undefined &&
      record.merged !== true &&
      record.checksum === this.computeChecksum(existing);

    let next: string;
    let action: WriteFileResult["action"];
    if (ownedByUs) {
      next = rendered;
      action = "updated";
    } else if (isJson) {
      const merged = mergeJsonPreservingUser(content, existing);
      if (merged === null) {
        return result("skipped");
      }
      next = merged;
      action = "merged";
    } else {
      next = mergeManagedBlock(relativePath, content, existing);
      action = "merged";
    }

    if (next === existing) {
      return result("unchanged");
    }
    if (dryRun) {
      return result("simulated");
    }

    // Sanitize delimiters (slashes, colons, dots) so backup filename is valid across Windows, Linux, and macOS.
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeRelativeBackup = `${relativePath.replace(/[\/\\]/g, "_")}.${timestamp}.bak`;
    const fullBackupPath = path.join(this.backupDir, safeRelativeBackup);
    fs.mkdirSync(this.backupDir, { recursive: true });
    fs.copyFileSync(targetPath, fullBackupPath);

    fs.writeFileSync(targetPath, next, "utf8");
    this.recordInManifest(
      relativePath,
      runtime,
      fullBackupPath,
      this.computeChecksum(next),
      action === "merged",
    );
    return result(action, path.relative(this.workspaceRoot, fullBackupPath));
  }

  /**
   * Updates or appends a file record in `.sauron/manifest.json`.
   *
   * Paths are normalized to relative workspace format to prevent leaking absolute machine usernames
   * or OS file paths into committed manifests.
   *
   * @param relPath - Relative file path under management.
   * @param runtime - Runtime adapter identifier.
   * @param backupPath - Absolute path to backup file, or null if newly created.
   * @param checksum - SHA-256 digest of the new file.
   * @param merged - True when Sauron content was merged into a user file.
   */
  private recordInManifest(
    relPath: string,
    runtime: string,
    backupPath: string | null,
    checksum: string,
    merged: boolean = false,
  ): void {
    const manifest = this.loadManifest();
    const existingIndex = manifest.managedFiles.findIndex(
      (f) => f.path === relPath,
    );

    const record: ManagedFileRecord = {
      path: relPath,
      runtime,
      // Store relative path to maintain portability across developer machines.
      backupPath: backupPath
        ? path.relative(this.workspaceRoot, backupPath)
        : null,
      checksum,
      lastUpdated: new Date().toISOString(),
      ...(merged ? { merged: true } : {}),
    };

    if (existingIndex >= 0) {
      manifest.managedFiles[existingIndex] = record;
    } else {
      manifest.managedFiles.push(record);
    }

    this.saveManifest(manifest);
  }
}
