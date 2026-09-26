/**
 * @fileoverview Harness fitness functions with guides and sensors model.
 * Encodes computational checks with remediation messages in agent context.
 * Research trace: martinfowler harness engineering, OpenAI Codex custom linters.
 */

/**
 * Single fitness finding emitted by a structural check.
 */
export interface FitnessFinding {
  /** Stable rule identifier. */
  rule: string;
  /** Severity level. */
  severity: "error" | "warning";
  /** Affected file path. */
  file: string;
  /** Human-readable message with remediation guidance. */
  message: string;
}

/**
 * Layer order enforced within each business domain.
 * Code may depend forward only through this sequence.
 */
const LAYER_ORDER: readonly string[] = [
  "types",
  "config",
  "repo",
  "service",
  "runtime",
  "ui",
];

/**
 * Checks import direction between two layers with fail-closed rules.
 *
 * @param fromLayer - Layer containing the import statement.
 * @param toLayer - Layer targeted by the import.
 * @returns True when direction respects forward-only flow.
 */
export function allowsImportDirection(
  fromLayer: string,
  toLayer: string,
): boolean {
  const fromIndex = LAYER_ORDER.indexOf(fromLayer);
  const toIndex = LAYER_ORDER.indexOf(toLayer);
  if (fromIndex === -1 || toIndex === -1) {
    return false;
  }
  return toIndex >= fromIndex;
}

/**
 * Scans TypeScript or JavaScript content for disallowed layer imports.
 *
 * @param file - File path under review.
 * @param content - File content to scan.
 * @returns Fitness findings with remediation instructions.
 */
export function checkLayerImports(
  file: string,
  content: string,
): FitnessFinding[] {
  const findings: FitnessFinding[] = [];
  const importPattern = /from\s+["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = importPattern.exec(content)) !== null) {
    const specifier = match[1] ?? "";
    const parts = specifier.split("/");
    if (parts.length < 2) {
      continue;
    }
    const fromLayer = inferLayerFromFile(file);
    const toLayer = parts[parts.length - 2] ?? "";
    if (
      fromLayer !== "" &&
      toLayer !== "" &&
      !allowsImportDirection(fromLayer, toLayer)
    ) {
      findings.push({
        rule: "layer-direction",
        severity: "error",
        file,
        message: `Backward import from ${fromLayer} to ${toLayer} in ${specifier}. Route through forward layers: types to config to repo to service to runtime to ui.`,
      });
    }
  }
  return findings;
}

/**
 * Infers a layer name from a file path segment.
 *
 * @param file - File path to inspect.
 * @returns Layer name or empty string when unknown.
 */
export function inferLayerFromFile(file: string): string {
  const normalized = file.replace(/\\/g, "/").toLowerCase();
  for (const layer of LAYER_ORDER) {
    if (
      normalized.includes(`/${layer}/`) ||
      normalized.includes(`/${layer}.`)
    ) {
      return layer;
    }
  }
  return "";
}

/**
 * Detects stale documentation markers that require gardening.
 *
 * @param file - Documentation file path.
 * @param content - Documentation content.
 * @param codeUpdatedAt - ISO timestamp of last code change.
 * @param docUpdatedAt - ISO timestamp of last doc change.
 * @returns Fitness finding when doc trails code by over 30 days.
 */
export function checkDocFreshness(
  file: string,
  content: string,
  codeUpdatedAt: string,
  docUpdatedAt: string,
): FitnessFinding[] {
  const codeTime = Date.parse(codeUpdatedAt);
  const docTime = Date.parse(docUpdatedAt);
  if (Number.isNaN(codeTime) || Number.isNaN(docTime)) {
    throw new Error("Invalid timestamp supplied to doc freshness check");
  }
  const driftDays = (codeTime - docTime) / 86400000;
  if (driftDays > 30 && content.includes("TODO: update")) {
    return [
      {
        rule: "doc-gardening",
        severity: "warning",
        file,
        message: `Documentation trails code by ${Math.round(driftDays)} days and contains TODO marker. Refresh ${file} to reflect current behavior.`,
      },
    ];
  }
  return [];
}

/**
 * Formats fitness findings into CLI-readable lines.
 *
 * @param findings - Findings to render.
 * @returns Multiline report text.
 */
export function formatFitnessReport(findings: FitnessFinding[]): string {
  if (findings.length === 0) {
    return "fitness=pass findings=0";
  }
  const lines: string[] = [`fitness=review findings=${findings.length}`];
  for (const finding of findings) {
    lines.push(
      `  [${finding.severity.toUpperCase()}] ${finding.rule} ${finding.file}: ${finding.message}`,
    );
  }
  return lines.join("\n");
}
