/// <reference types="node" />
/**
 * @fileoverview Versioned skills lockfile with drift detection.
 * Provides deterministic installs modeled on PSPM and metahub patterns.
 * Research trace: pspm.dev lockfile, metahub pinned commits, instruct-sync status/diff.
 */

import * as crypto from "node:crypto";

/**
 * Single pinned skill entry stored in the lockfile.
 */
export interface SkillLockEntry {
  /** Canonical skill name matching SKILL.md frontmatter. */
  name: string;
  /** Exact installed semantic version. */
  version: string;
  /** Resolved source URL or local path. */
  resolved: string;
  /** Integrity hash in sha512 hex format. */
  integrity: string;
  /** ISO-8601 install timestamp. */
  installedAt: string;
}

/**
 * Deterministic lockfile document.
 */
export interface SkillsLockfile {
  /** Lockfile schema version. */
  version: string;
  /** Pinned skills keyed by skill name. */
  skills: Record<string, SkillLockEntry>;
}

/**
 * Drift report comparing lockfile state against workspace state.
 */
export interface DriftReport {
  /** Skills present in lockfile but missing on disk. */
  missing: string[];
  /** Skills on disk with checksum mismatch. */
  changed: string[];
  /** Skills on disk with no lockfile entry. */
  untracked: string[];
  /** Skills with newer version available. */
  outdated: string[];
}

/**
 * Computes sha512 integrity digest for skill content.
 *
 * @param content - Raw skill file content.
 * @returns Hex digest string prefixed with sha512 identifier.
 */
export function computeIntegrity(content: string): string {
  return `sha512:${crypto.createHash("sha512").update(content, "utf8").digest("hex")}`;
}

/**
 * Parses and validates a lockfile document with fail-closed rules.
 *
 * @param raw - Unknown JSON input.
 * @returns Validated SkillsLockfile.
 * @throws Error when input violates schema.
 */
export function parseLockfile(raw: unknown): SkillsLockfile {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Lockfile must be an object");
  }
  const record = raw as Record<string, unknown>;
  if (record["version"] !== "1.0.0") {
    throw new Error("Unsupported lockfile version");
  }
  const skillsRaw = record["skills"];
  if (typeof skillsRaw !== "object" || skillsRaw === null) {
    throw new Error("Lockfile skills must be an object");
  }
  const skills: Record<string, SkillLockEntry> = {};
  for (const [key, value] of Object.entries(
    skillsRaw as Record<string, unknown>,
  )) {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid entry for skill ${key}`);
    }
    const entry = value as Record<string, unknown>;
    if (
      typeof entry["name"] !== "string" ||
      typeof entry["version"] !== "string" ||
      typeof entry["resolved"] !== "string" ||
      typeof entry["integrity"] !== "string" ||
      typeof entry["installedAt"] !== "string"
    ) {
      throw new Error(`Malformed lockfile entry for skill ${key}`);
    }
    if (!/^\d+\.\d+\.\d+$/.test(entry["version"] as string)) {
      throw new Error(`Invalid semver for skill ${key}`);
    }
    skills[key] = {
      name: entry["name"] as string,
      version: entry["version"] as string,
      resolved: entry["resolved"] as string,
      integrity: entry["integrity"] as string,
      installedAt: entry["installedAt"] as string,
    };
  }
  return { version: "1.0.0", skills };
}

/**
 * Resolves whether a candidate version satisfies a semver range.
 * Supports exact, caret, tilde, and wildcard ranges.
 *
 * @param range - Requested range such as ^1.2.0 or 1.2.3.
 * @param candidate - Candidate exact version.
 * @returns True when candidate satisfies range.
 */
export function satisfiesRange(range: string, candidate: string): boolean {
  const cleanRange = range.trim();
  if (cleanRange === "*" || cleanRange === "latest") {
    return true;
  }
  const parse = (input: string): [number, number, number] | null => {
    const match = input.match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (
      match === null ||
      match[1] === undefined ||
      match[2] === undefined ||
      match[3] === undefined
    ) {
      return null;
    }
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  };
  if (cleanRange.startsWith("^")) {
    const base = parse(cleanRange.slice(1));
    const cand = parse(candidate);
    if (base === null || cand === null) {
      return false;
    }
    if (cand[0] !== base[0]) {
      return false;
    }
    if (cand[1] < base[1]) {
      return false;
    }
    if (cand[1] === base[1] && cand[2] < base[2]) {
      return false;
    }
    return true;
  }
  if (cleanRange.startsWith("~")) {
    const base = parse(cleanRange.slice(1));
    const cand = parse(candidate);
    if (base === null || cand === null) {
      return false;
    }
    return cand[0] === base[0] && cand[1] === base[1] && cand[2] >= base[2];
  }
  return cleanRange === candidate;
}

/**
 * Detects drift between lockfile pins and current workspace checksums.
 *
 * @param lockfile - Validated lockfile state.
 * @param currentChecksums - Map of skill name to current sha512 digest.
 * @param availableVersions - Map of skill name to latest known version.
 * @returns Drift report with explicit categories.
 */
export function detectDrift(
  lockfile: SkillsLockfile,
  currentChecksums: Record<string, string>,
  availableVersions: Record<string, string>,
): DriftReport {
  const missing: string[] = [];
  const changed: string[] = [];
  const outdated: string[] = [];
  for (const [name, entry] of Object.entries(lockfile.skills)) {
    const current = currentChecksums[name];
    if (current === undefined) {
      missing.push(name);
      continue;
    }
    if (current !== entry.integrity) {
      changed.push(name);
    }
    const available = availableVersions[name];
    if (available !== undefined && available !== entry.version) {
      outdated.push(name);
    }
  }
  const untracked = Object.keys(currentChecksums).filter(
    (name) => lockfile.skills[name] === undefined,
  );
  missing.sort();
  changed.sort();
  untracked.sort();
  outdated.sort();
  return { missing, changed, untracked, outdated };
}

/**
 * Formats a human-readable status summary for CLI output.
 *
 * @param report - Drift report to render.
 * @returns Multiline status text.
 */
export function formatDriftReport(report: DriftReport): string {
  const lines: string[] = [];
  lines.push(
    `missing=${report.missing.length} changed=${report.changed.length} untracked=${report.untracked.length} outdated=${report.outdated.length}`,
  );
  for (const name of report.missing) {
    lines.push(`  [MISSING] ${name}`);
  }
  for (const name of report.changed) {
    lines.push(`  [CHANGED] ${name}`);
  }
  for (const name of report.untracked) {
    lines.push(`  [UNTRACKED] ${name}`);
  }
  for (const name of report.outdated) {
    lines.push(`  [OUTDATED] ${name}`);
  }
  return lines.join("\n");
}
