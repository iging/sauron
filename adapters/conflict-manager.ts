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
   * Writes content to a destination file with zero-destructive overwrite protection.
   *
   * Evaluation lifecycle:
   * 1. If target file does not exist: creates target file and registers in manifest.
   * 2. If target exists and checksum matches: returns 'unchanged' without disk write.
   * 3. If target exists and checksum differs:
   *    - In dryRun mode: returns 'simulated' without altering filesystem.
   *    - In execution mode: creates timestamped backup in `.sauron/backups/`,
   *      writes new content, and records new checksum and backup path in manifest.
   *
   * @param relativePath - Target file path relative to workspace root (e.g., '.cursorrules').
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
    const newChecksum = this.computeChecksum(content);

    if (fs.existsSync(targetPath)) {
      const existingContent = fs.readFileSync(targetPath, "utf8");
      const existingChecksum = this.computeChecksum(existingContent);

      // Idempotency check: avoid unnecessary disk write if file already has identical content.
      if (existingChecksum === newChecksum) {
        return {
          filePath: relativePath,
          runtime,
          action: "unchanged",
          backupPath: null,
        };
      }

      // Dry-run simulation: abort before generating backups or writing files.
      if (dryRun) {
        return {
          filePath: relativePath,
          runtime,
          action: "simulated",
          backupPath: null,
        };
      }

      // Existing file differs from incoming content.
      // Sanitize delimiters (slashes, colons, dots) so backup filename is valid across Windows, Linux, and macOS.
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const safeRelativeBackup = `${relativePath.replace(/[\/\\]/g, "_")}.${timestamp}.bak`;
      const fullBackupPath = path.join(this.backupDir, safeRelativeBackup);

      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
      }

      // Copy existing user file safely before writing new content.
      fs.copyFileSync(targetPath, fullBackupPath);

      // Ensure directory hierarchy exists for nested outputs (e.g., .github/hooks/ or .zed/)
      const parentDir = path.dirname(targetPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(targetPath, content, "utf8");

      this.recordInManifest(relativePath, runtime, fullBackupPath, newChecksum);

      return {
        filePath: relativePath,
        runtime,
        action: "updated",
        backupPath: path.relative(this.workspaceRoot, fullBackupPath),
      };
    }

    if (dryRun) {
      return {
        filePath: relativePath,
        runtime,
        action: "simulated",
        backupPath: null,
      };
    }

    // Target does not exist yet: create directory hierarchy and write file directly.
    const parentDir = path.dirname(targetPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(targetPath, content, "utf8");

    this.recordInManifest(relativePath, runtime, null, newChecksum);

    return {
      filePath: relativePath,
      runtime,
      action: "created",
      backupPath: null,
    };
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
   */
  private recordInManifest(
    relPath: string,
    runtime: string,
    backupPath: string | null,
    checksum: string,
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
    };

    if (existingIndex >= 0) {
      manifest.managedFiles[existingIndex] = record;
    } else {
      manifest.managedFiles.push(record);
    }

    this.saveManifest(manifest);
  }
}
