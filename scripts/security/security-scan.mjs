#!/usr/bin/env node

/**
 * Sauron Static Application Security Testing (SAST) & Secret Scanner
 * Implements directives from skills/security/sast-static-code-scanner/SKILL.md
 * and skills/security/agent-guard/SKILL.md.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT_DIR = process.cwd();

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "coverage",
  ".sauron",
  ".turbo",
]);

const SECRET_PATTERNS = [
  {
    name: "Private Key Block",
    regex: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
    severity: "CRITICAL",
  },
  {
    name: "AWS Access Key ID",
    regex: /AKIA[0-9A-Z]{16}/,
    severity: "CRITICAL",
  },
  {
    name: "Generic Secret / API Key Assignment",
    regex:
      /(api_key|apikey|secret_key|auth_token|client_secret)\s*[:=]\s*["'][a-zA-Z0-9_\-]{20,}["']/i,
    severity: "HIGH",
  },
  {
    name: "Hardcoded Bearer Token",
    regex: /Bearer\s+[a-zA-Z0-9_\-\.]{25,}/,
    severity: "HIGH",
  },
];

const UNSAFE_SINK_PATTERNS = [
  {
    name: "Dynamic Code Evaluation (eval)",
    regex: /\beval\s*\(/,
    severity: "HIGH",
    extensions: [".js", ".mjs", ".ts", ".tsx"],
  },
  {
    name: "Dynamic Function Constructor",
    regex: /\bnew\s+Function\s*\(/,
    severity: "HIGH",
    extensions: [".js", ".mjs", ".ts", ".tsx"],
  },
];

async function scanDirectory(dir, findings = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relPath = relative(ROOT_DIR, fullPath);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        await scanDirectory(fullPath, findings);
      }
      continue;
    }

    // Skip lockfiles and compiled binaries
    if (
      entry.name.endsWith(".lock") ||
      entry.name.endsWith(".lockb") ||
      entry.name.endsWith(".tsbuildinfo")
    ) {
      continue;
    }

    try {
      const content = await readFile(fullPath, "utf-8");
      const lines = content.split(/\r?\n/);

      // 1. Scan for Secrets
      for (const pattern of SECRET_PATTERNS) {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (pattern.regex.test(line)) {
            // Ignore if in documentation or rule examples explicitly talking about patterns
            if (
              relPath.includes("references") ||
              relPath.includes("anti-patterns") ||
              line.includes("// nosec")
            ) {
              continue;
            }
            findings.push({
              file: relPath,
              line: i + 1,
              rule: pattern.name,
              severity: pattern.severity,
              preview: line.trim().slice(0, 100),
            });
          }
        }
      }

      // 2. Scan for Unsafe Sinks (only in code files)
      for (const pattern of UNSAFE_SINK_PATTERNS) {
        if (pattern.extensions.some((ext) => fullPath.endsWith(ext))) {
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (pattern.regex.test(line)) {
              if (line.includes("// nosec") || relPath.includes("tests/")) {
                continue;
              }
              findings.push({
                file: relPath,
                line: i + 1,
                rule: pattern.name,
                severity: pattern.severity,
                preview: line.trim().slice(0, 100),
              });
            }
          }
        }
      }
    } catch {
      // Ignore binary files or unreadable encodings
    }
  }

  return findings;
}

async function runSecurityAudit() {
  console.log(
    "===================================================================",
  );
  console.log(
    "      S A U R O N   S E C U R I T Y   A U D I T O R   (Boromir)",
  );
  console.log(
    "   Auditing codebase for hardcoded secrets, unsafe sinks & RCE   ",
  );
  console.log(
    "===================================================================\n",
  );

  const findings = await scanDirectory(ROOT_DIR);

  if (findings.length === 0) {
    console.log(
      "✅ [PASSED] Zero hardcoded credentials or critical unsafe sinks detected.",
    );
    console.log(
      "🛡️ [VERIFIED] All scanned files comply with Sauron Security Standards.",
    );
    process.exit(0);
  } else {
    console.error(
      `❌ [FAILED] Found ${findings.length} security violation(s):\n`,
    );
    for (const f of findings) {
      console.error(` [${f.severity}] ${f.file}:${f.line} -> ${f.rule}`);
      console.error(`   Preview: ${f.preview}\n`);
    }
    process.exit(1);
  }
}

runSecurityAudit().catch((err) => {
  console.error("Security audit failed to execute:", err);
  process.exit(1);
});
