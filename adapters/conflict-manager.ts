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
  /** In-memory manifest while a batch is open; saved once by `endBatch()`. */
  private batchManifest: SauronManifest | undefined;
  /** True when the batch manifest has unsaved changes. */
  private batchDirty = false;

  /**
   * Starts a batch: manifest updates stay in memory until `endBatch()`.
   * Avoids rewriting the manifest once per file when installing thousands of files.
   */
  public beginBatch(): void {
    this.batchManifest = this.loadManifest();
    this.batchDirty = false;
  }

  /** Ends a batch and saves the manifest once if anything changed. */
  public endBatch(): void {
    const manifest = this.batchManifest;
    const dirty = this.batchDirty;
    this.batchManifest = undefined;
    this.batchDirty = false;
    if (manifest && dirty) {
      this.saveManifest(manifest);
    }
  }

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
    if (this.batchManifest) {
      return this.batchManifest;
    }
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
   * Creates a new user-owned tree without installation tracking. Existing destinations
   * are kept, including empty folders. The directory reservation and file writes are
   * exclusive. Persistent knowledge must survive runtime repair and uninstall.
   */
  public createOnlyTree(
    relativePath: string,
    files: readonly { relativePath: string; content: string }[],
    dryRun: boolean = false,
  ): "created" | "skipped" | "simulated" {
    const inside = (base: string, name: string): string => {
      if (
        !name.trim() ||
        path.isAbsolute(name) ||
        path.win32.isAbsolute(name) ||
        name.split(/[\\/]/).includes("..") ||
        /[\x00-\x1f]/.test(name)
      )
        throw new Error("New tree paths must stay inside the workspace.");
      const target = path.resolve(base, name.replace(/[\\/]/g, path.sep));
      const relative = path.relative(base, target);
      if (
        !relative ||
        relative.startsWith(".." + path.sep) ||
        path.isAbsolute(relative)
      )
        throw new Error("New tree paths must stay inside the workspace.");
      return target;
    };
    const stat = (target: string): fs.Stats | undefined => {
      try {
        return fs.lstatSync(target);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "ENOENT"
        )
          return undefined;
        throw error;
      }
    };
    const parents = (target: string): void => {
      let current = this.workspaceRoot;
      for (const part of [
        "",
        ...path
          .relative(this.workspaceRoot, path.dirname(target))
          .split(path.sep),
      ]) {
        current = path.join(current, part);
        const info = stat(current);
        if (info && (info.isSymbolicLink() || !info.isDirectory()))
          throw new Error(
            "New tree parent must be a real directory: " + current,
          );
      }
    };
    const destination = inside(this.workspaceRoot, relativePath);
    const targets = files.map((file) => ({
      ...file,
      target: inside(destination, file.relativePath),
    }));
    const keys = targets.map(({ target }) =>
      process.platform === "win32" ? target.toLowerCase() : target,
    );
    if (
      keys.length === 0 ||
      new Set(keys).size !== keys.length ||
      keys.some((file) =>
        keys.some((other) => other.startsWith(file + path.sep)),
      )
    )
      throw new Error(
        "New tree must contain unique file paths without file/directory collisions.",
      );
    parents(destination);
    const existing = stat(destination);
    if (existing?.isSymbolicLink())
      throw new Error("New tree destination cannot be a symbolic link.");
    if (existing) return "skipped";
    if (dryRun) return "simulated";
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    try {
      fs.mkdirSync(destination);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "EEXIST")
        return "skipped";
      throw error;
    }
    for (const file of targets) {
      parents(file.target);
      fs.mkdirSync(path.dirname(file.target), { recursive: true });
      fs.writeFileSync(file.target, file.content, {
        encoding: "utf8",
        flag: "wx",
      });
    }
    return "created";
  }

  /**
   * Writes a single user-owned report exclusively, without installation state.
   * Only existing real parent directories are accepted; no overwrite or links.
   */
  public createOnlyFile(relativePath: string, content: string): void {
    if (
      !relativePath.trim() ||
      path.isAbsolute(relativePath) ||
      path.win32.isAbsolute(relativePath) ||
      relativePath.split(/[\\/]/).includes("..") ||
      /[\x00-\x1f:]/.test(relativePath)
    )
      throw new Error("Report path must stay inside the workspace.");
    const target = path.resolve(this.workspaceRoot, relativePath);
    const rel = path.relative(this.workspaceRoot, target);
    if (!rel || rel.startsWith(".." + path.sep) || path.isAbsolute(rel))
      throw new Error("Report path must stay inside the workspace.");
    let current = this.workspaceRoot;
    for (const part of [
      "",
      ...path
        .relative(this.workspaceRoot, path.dirname(target))
        .split(path.sep),
    ]) {
      current = path.join(current, part);
      const stat = fs.lstatSync(current);
      if (!stat.isDirectory() || stat.isSymbolicLink())
        throw new Error("Report parent must be a real directory.");
    }
    fs.writeFileSync(target, content, { encoding: "utf8", flag: "wx" });
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
   * @param options - `raw: true` copies the content verbatim (no managed block) and
   *   skips the file when the user has changed it.
   *   `expectedChecksum` authorizes an intentional replacement of a reviewed snapshot.
   *   A missing or changed snapshot fails before writing. Replacements keep a backup.
   * @returns Detailed WriteFileResult summarizing action taken and backup location.
   */
  public safeWrite(
    relativePath: string,
    content: string,
    runtime: string,
    dryRun: boolean = false,
    options: { raw?: boolean; expectedChecksum?: string } = {},
  ): WriteFileResult {
    const targetPath = path.join(this.workspaceRoot, relativePath);
    const raw = options.raw === true;
    const isJson = !raw && relativePath.toLowerCase().endsWith(".json");
    const rendered =
      raw || isJson ? content : wrapManagedBlock(relativePath, content);
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
      if (options.expectedChecksum !== undefined) {
        throw new Error(`File no longer exists: ${relativePath}`);
      }
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
    if (
      options.expectedChecksum !== undefined &&
      options.expectedChecksum !== this.computeChecksum(existing)
    ) {
      throw new Error(`File changes after it is read: ${relativePath}`);
    }
    if (existing === rendered) {
      return result("unchanged");
    }

    // Sauron owns the file only if it wrote the whole file (never merged into
    // a user file) and nobody has edited it since. An explicit reviewed checksum
    // also authorizes replacement after the snapshot check above.
    const record = this.loadManifest().managedFiles.find(
      (f) => f.path === relativePath,
    );
    const ownedByUs =
      options.expectedChecksum !== undefined ||
      (record !== undefined &&
        record.merged !== true &&
        record.checksum === this.computeChecksum(existing));

    let next: string;
    let action: WriteFileResult["action"];
    if (ownedByUs) {
      next = rendered;
      action = "updated";
    } else if (raw) {
      // Verbatim assets (skills, agents, commands) the user changed are kept as is.
      return result("skipped");
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

    const fullBackupPath = this.backupFile(relativePath, targetPath);
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
   * Removes a file an older Sauron version emitted, only while Sauron still owns it.
   * A file the user edited, a user file Sauron merged into, and an untracked file all
   * stay on disk and report `skipped`. A removal keeps a copy in `.sauron/backups/`.
   *
   * @param relativePath - Target file path relative to workspace root.
   * @param runtime - Identifier of the AI runtime that retired the file.
   * @param dryRun - When true, evaluates the removal without modifying disk.
   * @returns The result, or null when the file does not exist.
   */
  public retireFile(
    relativePath: string,
    runtime: string,
    dryRun: boolean = false,
  ): WriteFileResult | null {
    const targetPath = path.join(this.workspaceRoot, relativePath);
    if (!fs.existsSync(targetPath)) {
      return null;
    }
    const result = (
      action: WriteFileResult["action"],
      backupPath: string | null = null,
    ): WriteFileResult => ({
      filePath: relativePath,
      runtime,
      action,
      backupPath,
    });

    const manifest = this.loadManifest();
    const record = manifest.managedFiles.find((f) => f.path === relativePath);
    const ownedByUs =
      record !== undefined &&
      record.merged !== true &&
      record.checksum ===
        this.computeChecksum(fs.readFileSync(targetPath, "utf8"));
    if (!ownedByUs) {
      return result("skipped");
    }
    if (dryRun) {
      return result("simulated");
    }

    const fullBackupPath = this.backupFile(relativePath, targetPath);
    fs.rmSync(targetPath);
    manifest.managedFiles = manifest.managedFiles.filter(
      (f) => f.path !== relativePath,
    );
    if (this.batchManifest) {
      this.batchDirty = true;
    } else {
      this.saveManifest(manifest);
    }
    return result("removed", path.relative(this.workspaceRoot, fullBackupPath));
  }

  /**
   * Takes the managed block out of a user file Sauron merged into, keeping every user line.
   * A file with no complete block is left alone and reports `skipped`.
   * The change keeps a copy in `.sauron/backups/`, and the manifest record is dropped.
   *
   * @param relativePath - Target file path relative to workspace root.
   * @param runtime - Identifier of the runtime that owned the block.
   * @param dryRun - When true, evaluates the removal without modifying disk.
   * @returns The result, or null when the file does not exist.
   */
  public removeManagedBlock(
    relativePath: string,
    runtime: string,
    dryRun: boolean = false,
  ): WriteFileResult | null {
    const targetPath = path.join(this.workspaceRoot, relativePath);
    if (!fs.existsSync(targetPath)) {
      return null;
    }
    const result = (
      action: WriteFileResult["action"],
      backupPath: string | null = null,
    ): WriteFileResult => ({
      filePath: relativePath,
      runtime,
      action,
      backupPath,
    });

    const existing = fs.readFileSync(targetPath, "utf8");
    const { start, end } = markersFor(relativePath);
    const startIndex = existing.indexOf(start);
    const endIndex = startIndex >= 0 ? existing.indexOf(end, startIndex) : -1;
    if (startIndex < 0 || endIndex < 0) {
      return result("skipped");
    }
    let after = endIndex + end.length;
    if (existing[after] === "\r") after += 1;
    if (existing[after] === "\n") after += 1;
    const next = (
      existing.slice(0, startIndex).replace(/\s+$/, "") +
      "\n" +
      existing.slice(after).replace(/^\s+/, "")
    ).replace(/^\n$/, "");
    if (dryRun) {
      return result("simulated");
    }

    const fullBackupPath = this.backupFile(relativePath, targetPath);
    fs.writeFileSync(targetPath, next, "utf8");
    this.forgetFile(relativePath);
    return result("removed", path.relative(this.workspaceRoot, fullBackupPath));
  }

  /**
   * Drops a file from the manifest without touching disk.
   *
   * @param relativePath - Target file path relative to workspace root.
   * @returns True when a record was removed.
   */
  public forgetFile(relativePath: string): boolean {
    const manifest = this.loadManifest();
    const before = manifest.managedFiles.length;
    manifest.managedFiles = manifest.managedFiles.filter(
      (f) => f.path !== relativePath,
    );
    if (manifest.managedFiles.length === before) {
      return false;
    }
    if (this.batchManifest) {
      this.batchDirty = true;
    } else {
      this.saveManifest(manifest);
    }
    return true;
  }

  /**
   * Removes the empty folders left above a removed file, stopping at the workspace root
   * or at the first folder that still holds anything.
   *
   * @param relativePath - Path of the removed file, relative to workspace root.
   * @returns Workspace-relative folders that were removed.
   */
  public pruneEmptyParents(relativePath: string): string[] {
    const removed: string[] = [];
    let dir = path.dirname(path.join(this.workspaceRoot, relativePath));
    while (
      dir !== this.workspaceRoot &&
      dir.startsWith(this.workspaceRoot + path.sep) &&
      fs.existsSync(dir) &&
      fs.readdirSync(dir).length === 0
    ) {
      fs.rmdirSync(dir);
      removed.push(path.relative(this.workspaceRoot, dir));
      dir = path.dirname(dir);
    }
    return removed;
  }

  /** Copies a file to `.sauron/backups/` and returns the absolute backup path. */
  private backupFile(relativePath: string, targetPath: string): string {
    // Sanitize delimiters (slashes, colons, dots) so backup filename is valid across Windows, Linux, and macOS.
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeRelativeBackup = `${relativePath.replace(/[\/\\]/g, "_")}.${timestamp}.bak`;
    const fullBackupPath = path.join(this.backupDir, safeRelativeBackup);
    fs.mkdirSync(this.backupDir, { recursive: true });
    fs.copyFileSync(targetPath, fullBackupPath);
    return fullBackupPath;
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

    if (this.batchManifest) {
      this.batchDirty = true;
      return;
    }
    this.saveManifest(manifest);
  }
}
