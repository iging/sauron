/** Eye report presentation, static comparisons and validated report reuse. */
import * as fs from "node:fs";
import * as path from "node:path";
import { inspectEyeFile } from "./eye-core.js";
import { ADVANCED_EYE_PARSERS } from "./eye-advanced.js";
import { EYE_LIMITS, type EyeReport, type EyeEvidence } from "./eye-types.js";
export function inspectEye(target: string): EyeReport {
  return inspectEyeFile(target, ADVANCED_EYE_PARSERS);
}
function key(item: EyeEvidence): string {
  return JSON.stringify([
    item.status,
    item.kind,
    item.summary,
    item.value,
    item.source.includes("!")
      ? item.source.slice(item.source.indexOf("!"))
      : "",
    item.reason ?? "",
  ]);
}
export function diffEye(
  beforePath: string,
  afterPath: string,
): {
  schemaVersion: 1;
  mode: "diff";
  before: EyeReport;
  after: EyeReport;
  added: { side: "after"; id: string }[];
  removed: { side: "before"; id: string }[];
  limitations: string[];
} {
  const before = inspectEye(beforePath),
    after = inspectEye(afterPath);
  const subtract = (a: EyeEvidence[], b: EyeEvidence[]) => {
    const counts = new Map<string, number>();
    for (const item of b)
      counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
    return a.filter((item) => {
      const k = key(item),
        n = counts.get(k) ?? 0;
      if (n) {
        counts.set(k, n - 1);
        return false;
      }
      return true;
    });
  };
  return {
    schemaVersion: 1,
    mode: "diff",
    before,
    after,
    added: subtract(after.evidence, before.evidence).map((item) => ({
      side: "after",
      id: item.id,
    })),
    removed: subtract(before.evidence, after.evidence).map((item) => ({
      side: "before",
      id: item.id,
    })),
    limitations: [
      "Only bounded static evidence is compared. Runtime behavior, authenticity and uninspected data can differ.",
    ],
  };
}
export function reuseEye(reportPath: string, target: string): EyeReport {
  const full = path.resolve(reportPath),
    parsed = path.parse(full);
  let prefix = parsed.root;
  for (const part of full.slice(parsed.root.length).split(path.sep)) {
    prefix = path.join(prefix, part);
    if (fs.lstatSync(prefix).isSymbolicLink())
      throw new Error("Report links are not accepted.");
  }
  const info = fs.lstatSync(full);
  if (!info.isFile() || info.size > 8 * 1024 * 1024)
    throw new Error("Report exceeds reuse limit.");
  const descriptor = fs.openSync(
    full,
    fs.constants.O_RDONLY |
      (fs.constants.O_NOFOLLOW ?? 0) |
      (fs.constants.O_NONBLOCK ?? 0),
  );
  let raw: string;
  try {
    const stat = fs.fstatSync(descriptor);
    if (
      !stat.isFile() ||
      stat.ino !== info.ino ||
      stat.dev !== info.dev ||
      stat.size !== info.size
    )
      throw new Error("Report changes while opening.");
    const data = Buffer.alloc(stat.size + 1);
    let n = 0;
    while (n < data.length) {
      const read = fs.readSync(descriptor, data, n, data.length - n, null);
      if (!read) break;
      n += read;
    }
    const after = fs.fstatSync(descriptor);
    if (
      n !== stat.size ||
      after.size !== stat.size ||
      after.mtimeMs !== stat.mtimeMs
    )
      throw new Error("Report changes while reading.");
    raw = data.subarray(0, n).toString("utf8");
  } finally {
    fs.closeSync(descriptor);
  }
  const cached: unknown = JSON.parse(raw);
  const fresh = inspectEye(target);
  // Fresh inspection is authoritative. Imported evidence is never printed or trusted.
  if (
    !cached ||
    typeof cached !== "object" ||
    !("schemaVersion" in cached) ||
    cached.schemaVersion !== 1 ||
    !("target" in cached) ||
    !cached.target ||
    typeof cached.target !== "object" ||
    !("sha256" in cached.target) ||
    cached.target.sha256 !== fresh.target.sha256 ||
    !/^[a-f0-9]{64}$/.test(fresh.target.sha256) ||
    !("evidence" in cached) ||
    !Array.isArray(cached.evidence) ||
    cached.evidence.length > EYE_LIMITS.evidence
  )
    throw new Error("Report does not match the inspected target.");
  const imported = cached.evidence.map((item: unknown) => {
    if (
      !item ||
      typeof item !== "object" ||
      !("id" in item) ||
      typeof item.id !== "string"
    )
      throw new Error("Invalid imported evidence.");
    return item;
  });
  if (JSON.stringify(imported) !== JSON.stringify(fresh.evidence))
    throw new Error("Cached evidence does not match fresh inspection.");
  return fresh;
}
export function eyeTextReport(report: EyeReport): string {
  const lines = [
    "SAURON EYE: bounded static inspection",
    "Target: " + report.target.name,
    "SHA-256: " + report.target.sha256,
    "Format: " + report.format,
    "Partial: " + report.partial,
    "",
  ];
  for (const item of report.evidence)
    lines.push(
      "[" +
        item.id +
        "] " +
        item.status +
        " " +
        item.kind +
        ": " +
        item.summary +
        (item.value === null ? "" : " " + JSON.stringify(item.value)) +
        (item.reason ? " Reason: " + item.reason : "") +
        " (" +
        item.source +
        (item.offset === undefined ? "" : ":" + item.offset) +
        ")",
    );
  for (const item of report.diagnostics)
    lines.push("Diagnostic " + item.code + ": " + item.message);
  for (const limitation of report.limitations)
    lines.push("Limit: " + limitation);
  return lines.join("\n") + "\n";
}
export function eyeWorkspacePath(root: string, target: string): string {
  if (
    !target.trim() ||
    path.isAbsolute(target) ||
    path.win32.isAbsolute(target) ||
    target.split(/[\\/]/).includes("..") ||
    /[\x00-\x1f]/.test(target)
  )
    throw new Error("Eye MCP paths must be workspace-relative.");
  const full = path.resolve(root, target);
  const rel = path.relative(root, full);
  if (!rel || rel.startsWith(".." + path.sep) || path.isAbsolute(rel))
    throw new Error("Eye target escapes workspace.");
  let at = root;
  for (const part of rel.split(path.sep)) {
    at = path.join(at, part);
    if (fs.lstatSync(at).isSymbolicLink())
      throw new Error("Eye MCP does not follow links.");
  }
  return full;
}
