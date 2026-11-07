/// <reference types="node" />
/**
 * @fileoverview Install lifecycle checks built on `.sauron/manifest.json`.
 * Read-only inspection for `list-installed` and `doctor`, and the removal plan for `uninstall`.
 * Disk changes always go through ConflictManager. No barrel files.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { ConflictManager } from "./conflict-manager.js";
import type { ManagedFileRecord, WriteFileResult } from "./types.js";

/** Lowest Node.js version Sauron supports, matching `engines.node`. */
export const MIN_NODE_VERSION = "20.12.0";

/**
 * State of one manifest record on disk:
 * - `clean`: Sauron wrote the whole file and nobody changed it.
 * - `edited`: Sauron wrote the whole file and someone changed it since.
 * - `merged`: Sauron content lives in a user file (a managed block, or merged JSON keys).
 * - `missing`: the file is gone.
 * - `unsafe`: the recorded path points outside the workspace. It is never touched.
 */
export type FileState = "clean" | "edited" | "merged" | "missing" | "unsafe";

/** One manifest record with its observed state. */
export interface InstalledFile {
  path: string;
  runtime: string;
  state: FileState;
  /** For `merged` text files: true when the managed block is still present. */
  blockPresent?: boolean;
}

/** Whether the manifest could be read. */
export type ManifestStatus = "ok" | "missing" | "invalid";

/** Result of reading the manifest and checking every record. */
export interface InstallInspection {
  manifest: ManifestStatus;
  files: InstalledFile[];
}

/** One doctor finding. Errors make `doctor` exit non-zero. */
export interface DoctorFinding {
  level: "error" | "warn" | "info";
  message: string;
}

/** What `uninstall` does with one record. */
export type UninstallAction =
  | "remove"
  | "strip-block"
  | "forget"
  | "keep-edited"
  | "keep-merged"
  | "keep-protected"
  | "keep-unsafe";

/** One step of the uninstall plan. */
export interface UninstallStep {
  path: string;
  runtime: string;
  action: UninstallAction;
}

/** Paths uninstall never removes: user choices and Sauron's own records and backups. */
function isProtected(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, "/");
  return (
    normalized === "sauron.config.yaml" || normalized.startsWith(".sauron/")
  );
}

/** True when a manifest path stays inside the workspace and names a file below it. */
export function isInsideWorkspace(root: string, relativePath: string): boolean {
  if (relativePath.length === 0 || path.isAbsolute(relativePath)) {
    return false;
  }
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(path.resolve(root), resolved);
  return (
    relative.length > 0 &&
    !relative.startsWith("..") &&
    !path.isAbsolute(relative)
  );
}

/** Reads the manifest records, telling a missing manifest apart from a broken one. */
function readRecords(root: string): {
  status: ManifestStatus;
  records: ManagedFileRecord[];
} {
  const manifestPath = path.join(root, ".sauron", "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    return { status: "missing", records: [] };
  }
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const files =
      parsed && typeof parsed === "object"
        ? (parsed as { managedFiles?: unknown }).managedFiles
        : undefined;
    if (!Array.isArray(files)) {
      return { status: "invalid", records: [] };
    }
    const records = files.filter(
      (f): f is ManagedFileRecord =>
        typeof f === "object" &&
        f !== null &&
        typeof (f as ManagedFileRecord).path === "string" &&
        typeof (f as ManagedFileRecord).checksum === "string",
    );
    return {
      status: records.length === files.length ? "ok" : "invalid",
      records,
    };
  } catch {
    return { status: "invalid", records: [] };
  }
}

/** True when a text file still holds a complete Sauron managed block. */
function hasManagedBlock(content: string): boolean {
  const start = content.indexOf("sauron:start");
  return start >= 0 && content.indexOf("sauron:end", start) >= 0;
}

/**
 * Reads the manifest and checks each record against disk. Writes nothing.
 *
 * @param root - Workspace root.
 * @returns Manifest status and one entry per record, sorted by path.
 */
export function inspectInstall(root: string): InstallInspection {
  const manager = new ConflictManager(root);
  const { status, records } = readRecords(root);
  const files = records.map((record): InstalledFile => {
    const base = { path: record.path, runtime: record.runtime ?? "unknown" };
    if (!isInsideWorkspace(root, record.path)) {
      return { ...base, state: "unsafe" };
    }
    const target = path.join(root, record.path);
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      return { ...base, state: "missing" };
    }
    const content = fs.readFileSync(target, "utf8");
    if (record.merged === true) {
      return record.path.toLowerCase().endsWith(".json")
        ? { ...base, state: "merged" }
        : { ...base, state: "merged", blockPresent: hasManagedBlock(content) };
    }
    return {
      ...base,
      state:
        manager.computeChecksum(content) === record.checksum
          ? "clean"
          : "edited",
    };
  });
  files.sort((a, b) => a.path.localeCompare(b.path));
  return { manifest: status, files };
}

/** Compares dotted version strings. Returns a negative number when `a` is lower. */
export function compareVersions(a: string, b: string): number {
  const parts = (v: string): number[] =>
    v
      .replace(/^v/, "")
      .split(".")
      .map((n) => Number.parseInt(n, 10) || 0);
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i += 1) {
    const diff = (x[i] ?? 0) - (y[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/**
 * Builds the doctor report. Writes nothing.
 *
 * @param inspection - Result of `inspectInstall`.
 * @param context - Node version and config version (`null` when there is no config,
 *   `"invalid"` when it cannot be read).
 * @returns Findings, errors first.
 */
export function doctorFindings(
  inspection: InstallInspection,
  context: { nodeVersion: string; configVersion: string | null },
): DoctorFinding[] {
  const findings: DoctorFinding[] = [];
  if (compareVersions(context.nodeVersion, MIN_NODE_VERSION) < 0) {
    findings.push({
      level: "error",
      message: `Node ${context.nodeVersion} is below ${MIN_NODE_VERSION}. Upgrade Node.js.`,
    });
  }
  if (context.configVersion === null) {
    findings.push({
      level: "warn",
      message: "No sauron.config.yaml. Run sauron init.",
    });
  } else if (context.configVersion === "invalid") {
    findings.push({
      level: "error",
      message: "sauron.config.yaml cannot be read. Fix it or restore a backup.",
    });
  } else if (context.configVersion !== "2.0.0") {
    findings.push({
      level: "warn",
      message: `Config is v${context.configVersion}. Run sauron upgrade.`,
    });
  }
  if (inspection.manifest === "missing") {
    findings.push({
      level: "warn",
      message: "No .sauron/manifest.json. Nothing is recorded as installed.",
    });
  } else if (inspection.manifest === "invalid") {
    findings.push({
      level: "error",
      message:
        ".sauron/manifest.json is damaged. Restore it from version control before repair or uninstall.",
    });
  }
  const byState = (state: FileState): InstalledFile[] =>
    inspection.files.filter((f) => f.state === state);
  for (const file of byState("unsafe")) {
    findings.push({
      level: "error",
      message: `Manifest path leaves the workspace and is ignored: ${file.path}`,
    });
  }
  for (const file of byState("missing")) {
    findings.push({
      level: "warn",
      message: `Missing: ${file.path}. Run sauron repair.`,
    });
  }
  for (const file of byState("merged").filter(
    (f) => f.blockPresent === false,
  )) {
    findings.push({
      level: "warn",
      message: `Managed block removed from ${file.path}. Run sauron repair to add it back.`,
    });
  }
  const edited = byState("edited");
  if (edited.length > 0) {
    findings.push({
      level: "info",
      message: `${edited.length} file(s) changed by you. Sauron keeps them as they are.`,
    });
  }
  const order = { error: 0, warn: 1, info: 2 };
  return findings.sort((a, b) => order[a.level] - order[b.level]);
}

/**
 * Decides what uninstall does with each record. Writes nothing.
 *
 * @param inspection - Result of `inspectInstall`.
 * @returns One step per record.
 */
export function planUninstall(inspection: InstallInspection): UninstallStep[] {
  return inspection.files.map((file): UninstallStep => {
    const base = { path: file.path, runtime: file.runtime };
    if (file.state === "unsafe") return { ...base, action: "keep-unsafe" };
    if (isProtected(file.path)) return { ...base, action: "keep-protected" };
    switch (file.state) {
      case "clean":
        return { ...base, action: "remove" };
      case "missing":
        return { ...base, action: "forget" };
      case "edited":
        return { ...base, action: "keep-edited" };
      default:
        return {
          ...base,
          action: file.blockPresent === true ? "strip-block" : "keep-merged",
        };
    }
  });
}

/** Result of applying one uninstall step. */
export interface UninstallOutcome extends UninstallStep {
  result: WriteFileResult["action"] | "forgotten" | "kept";
  backupPath: string | null;
}

/**
 * Applies an uninstall plan through ConflictManager. Every removal and change keeps a backup.
 * Files that changed after planning are kept, because ConflictManager checks ownership again.
 *
 * @param root - Workspace root.
 * @param steps - Plan from `planUninstall`.
 * @param dryRun - When true, nothing on disk changes.
 * @returns One outcome per step, and the empty folders that were removed.
 */
export function applyUninstall(
  root: string,
  steps: UninstallStep[],
  dryRun: boolean,
): { outcomes: UninstallOutcome[]; removedDirs: string[] } {
  const manager = new ConflictManager(root);
  const outcomes: UninstallOutcome[] = [];
  const removedFiles: string[] = [];
  manager.beginBatch();
  try {
    for (const step of steps) {
      if (step.action === "remove") {
        const done = manager.retireFile(step.path, step.runtime, dryRun);
        if (done?.action === "removed") removedFiles.push(step.path);
        outcomes.push({
          ...step,
          result: done?.action ?? "kept",
          backupPath: done?.backupPath ?? null,
        });
      } else if (step.action === "strip-block") {
        const done = manager.removeManagedBlock(
          step.path,
          step.runtime,
          dryRun,
        );
        outcomes.push({
          ...step,
          result: done?.action ?? "kept",
          backupPath: done?.backupPath ?? null,
        });
      } else if (step.action === "forget") {
        if (!dryRun) manager.forgetFile(step.path);
        outcomes.push({
          ...step,
          result: dryRun ? "simulated" : "forgotten",
          backupPath: null,
        });
      } else {
        outcomes.push({ ...step, result: "kept", backupPath: null });
      }
    }
  } finally {
    manager.endBatch();
  }
  const removedDirs = dryRun
    ? []
    : removedFiles.flatMap((file) => manager.pruneEmptyParents(file));
  return { outcomes, removedDirs };
}
