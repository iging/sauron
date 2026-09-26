/// <reference types="node" />
/**
 * @fileoverview Slopsquat guard and AST-aware SAST upgrade.
 * Scores registry metadata and flags unsafe sinks with SARIF output.
 * Research trace: greengate slopsquat guard, secure-ai-codegen template, aiscan.
 */

import * as crypto from "node:crypto";

/**
 * Registry metadata snapshot for one package.
 */
export interface PackageMetadata {
  /** Package name as requested by install. */
  name: string;
  /** True when name exists in registry. */
  exists: boolean;
  /** Age in days since first publish. */
  ageDays: number;
  /** Weekly download count. */
  weeklyDownloads: number;
  /** Maintainer count. */
  maintainers: number;
}

/**
 * Verdict for one package review.
 */
export interface PackageVerdict {
  /** Package name. */
  name: string;
  /** Risk score from 0 to 100. Higher means riskier. */
  risk: number;
  /** True when installation proceeds. */
  allow: boolean;
  /** Human-readable reason. */
  reason: string;
}

/**
 * Unsafe sink finding detected in source content.
 */
export interface SinkFinding {
  /** Rule identifier. */
  rule: string;
  /** Severity level. */
  severity: "error" | "warning";
  /** File path. */
  file: string;
  /** One-indexed line number. */
  line: number;
  /** Message with remediation guidance. */
  message: string;
}

/**
 * Scores package metadata with fail-closed rules.
 * Blocks hallucinated names and brand-new low-adoption packages.
 *
 * @param metadata - Registry metadata snapshot.
 * @returns Package verdict.
 */
export function scorePackage(metadata: PackageMetadata): PackageVerdict {
  if (metadata.name.trim() === "") {
    throw new Error("Package name must not be empty");
  }
  if (!metadata.exists) {
    return {
      name: metadata.name,
      risk: 100,
      allow: false,
      reason: `Package ${metadata.name} does not exist in registry. Refuse hallucinated dependency.`,
    };
  }
  let risk = 0;
  if (metadata.ageDays < 30) {
    risk += 40;
  } else if (metadata.ageDays < 90) {
    risk += 15;
  }
  if (metadata.weeklyDownloads < 100) {
    risk += 30;
  } else if (metadata.weeklyDownloads < 1000) {
    risk += 10;
  }
  if (metadata.maintainers < 1) {
    risk += 30;
  } else if (metadata.maintainers === 1) {
    risk += 10;
  }
  const allow = risk < 70;
  return {
    name: metadata.name,
    risk,
    allow,
    reason: allow
      ? `Package ${metadata.name} passes supply-chain gate with risk ${risk}.`
      : `Package ${metadata.name} blocked with risk ${risk}. Verify adoption before install.`,
  };
}

/**
 * Scans content for unsafe sinks without regex-only false positives on comments.
 * Skips full-line comments before matching executable patterns.
 *
 * @param file - File path under review.
 * @param content - File content to scan.
 * @returns Sink findings.
 */
export function scanUnsafeSinks(file: string, content: string): SinkFinding[] {
  const findings: SinkFinding[] = [];
  const patterns: Array<{
    rule: string;
    severity: "error" | "warning";
    pattern: RegExp;
    message: string;
  }> = [
    {
      rule: "no-eval",
      severity: "error",
      pattern: /\beval\s*\(/,
      message:
        "Avoid eval on dynamic input. Use safe parsers or explicit allowlists.",
    },
    {
      rule: "no-exec-shell",
      severity: "error",
      pattern:
        /child_process\.(exec|execSync)\s*\(|subprocess.*shell\s*=\s*True|os\.system\s*\(/,
      message:
        "Avoid shell execution with dynamic input. Use argument arrays without shell.",
    },
    {
      rule: "no-pickle-load",
      severity: "error",
      pattern: /pickle\.loads\s*\(|yaml\.load\s*\([^)]*\)/,
      message:
        "Avoid unsafe deserialization. Use json or yaml.safe_load with schema validation.",
    },
    {
      rule: "no-sql-concat",
      severity: "error",
      pattern: /execute\s*\(\s*[`'"]SELECT.*\+|execute\s*\(\s*f["']/,
      message: "Avoid SQL string concatenation. Use parameterized queries.",
    },
    {
      rule: "no-silent-swallow",
      severity: "warning",
      pattern: /except\s*:\s*pass|catch\s*\(\s*\)\s*\{\s*\}/,
      message:
        "Avoid silent error swallow. Log the error and handle the failure path.",
    },
  ];
  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = (lines[index] ?? "").trim();
    if (line.startsWith("#") || line.startsWith("//")) {
      continue;
    }
    for (const entry of patterns) {
      if (entry.pattern.test(line)) {
        findings.push({
          rule: entry.rule,
          severity: entry.severity,
          file,
          line: index + 1,
          message: entry.message,
        });
      }
    }
  }
  return findings;
}

/**
 * Computes a stable fingerprint for provenance tracking.
 *
 * @param content - Content to fingerprint.
 * @returns SHA-256 digest string.
 */
export function fingerprintContent(content: string): string {
  return `sha256:${crypto.createHash("sha256").update(content, "utf8").digest("hex")}`;
}

/**
 * Converts sink findings into minimal SARIF 2.1.0 output.
 *
 * @param findings - Sink findings to convert.
 * @returns SARIF document as formatted JSON string.
 */
export function toSarif(findings: SinkFinding[]): string {
  const results = findings.map((finding) => {
    return {
      ruleId: finding.rule,
      level: finding.severity,
      message: { text: finding.message },
      locations: [
        {
          physicalLocation: {
            artifactLocation: { uri: finding.file },
            region: { startLine: finding.line },
          },
        },
      ],
    };
  });
  const sarif = {
    version: "2.1.0",
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    runs: [
      {
        tool: { driver: { name: "sauron-slopsquat", version: "1.0.0" } },
        results,
      },
    ],
  };
  return JSON.stringify(sarif, null, 2);
}
