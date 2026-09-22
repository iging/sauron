#!/usr/bin/env node
// @ts-check

/**
 * @fileoverview Codebase Knowledge Graph Generator for Sauron.
 * Extracts symbols, functions, classes, interfaces, and module import dependencies.
 * Generates graph.json, graph-report.md, and standalone interactive graph.html.
 */

import fs from "node:fs";
import path from "node:path";

/**
 * @typedef {Object} GraphNode
 * @property {string} id - Canonical relative file path.
 * @property {string} label - File basename.
 * @property {string} category - Top-level directory category.
 * @property {number} lineCount - Lines of code in file.
 * @property {string[]} functions - Exported or declared function names.
 * @property {string[]} classes - Exported or declared class names.
 * @property {string[]} types - Interfaces or type aliases.
 * @property {number} inDegree - Number of incoming import references.
 * @property {number} outDegree - Number of outgoing imports.
 */

/**
 * @typedef {Object} GraphEdge
 * @property {string} source - Importer file relative path.
 * @property {string} target - Imported file relative path.
 * @property {string} importPath - Raw import path literal.
 */

const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  ".sauron",
  "coverage",
  ".nyc_output",
]);

const SUPPORTED_EXTENSIONS = new Set([
  // JavaScript & TypeScript
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  // Python
  ".py",
  // Go
  ".go",
  // Rust
  ".rs",
  // Java & Kotlin
  ".java",
  ".kt",
  // PHP
  ".php",
  // Ruby
  ".rb",
  // C & C++
  ".c",
  ".cpp",
  ".cc",
  ".h",
  ".hpp",
  // C#
  ".cs",
]);

/**
 * Recursively find all supported code files in target directory.
 * @param {string} directory
 * @param {string} rootDir
 * @returns {string[]}
 */
export function scanSourceFiles(directory, rootDir = directory) {
  const results = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name)) {
        results.push(
          ...scanSourceFiles(path.join(directory, entry.name), rootDir),
        );
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        results.push(path.join(directory, entry.name));
      }
    }
  }

  return results;
}

/**
 * Polyglot AST symbol & dependency extractor.
 * Supports TypeScript, JavaScript, Python, Go, Rust, Java, Kotlin, PHP, Ruby, C/C++, and C#.
 * @param {string} filePath
 * @param {string} rootDir
 * @returns {{ node: GraphNode, rawImports: string[] }}
 */
function parseFileSymbols(filePath, rootDir) {
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, "/");
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const lineCount = lines.length;
  const ext = path.extname(filePath).toLowerCase();

  /** @type {string[]} */
  const rawImports = [];
  /** @type {string[]} */
  const functions = [];
  /** @type {string[]} */
  const classes = [];
  /** @type {string[]} */
  const types = [];

  let match;

  if ([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].includes(ext)) {
    // === JavaScript & TypeScript ===
    const importRegex =
      /(?:import\s+(?:[\s\S]*?from\s+)?|export\s+(?:[\s\S]*?from\s+))["']([^"']+)["']/g;
    while ((match = importRegex.exec(content)) !== null) {
      if (match[1]) rawImports.push(match[1]);
    }
    const dynamicImportRegex = /import\s*\(\s*["']([^"']+)["']\s*\)/g;
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      if (match[1]) rawImports.push(match[1]);
    }
    const requireRegex = /require\s*\(\s*["']([^"']+)["']\s*\)/g;
    while ((match = requireRegex.exec(content)) !== null) {
      if (match[1]) rawImports.push(match[1]);
    }
    const functionRegex =
      /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(/g;
    while ((match = functionRegex.exec(content)) !== null) {
      if (match[1]) functions.push(match[1]);
    }
    const arrowFuncRegex =
      /(?:export\s+)?(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>/g;
    while ((match = arrowFuncRegex.exec(content)) !== null) {
      if (match[1]) functions.push(match[1]);
    }
    const classRegex =
      /(?:export\s+)?(?:abstract\s+)?class\s+([a-zA-Z0-9_$]+)/g;
    while ((match = classRegex.exec(content)) !== null) {
      if (match[1]) classes.push(match[1]);
    }
    const interfaceRegex = /(?:export\s+)?interface\s+([a-zA-Z0-9_$]+)/g;
    while ((match = interfaceRegex.exec(content)) !== null) {
      if (match[1]) types.push(match[1]);
    }
    const typeRegex = /(?:export\s+)?type\s+([a-zA-Z0-9_$]+)\s*=/g;
    while ((match = typeRegex.exec(content)) !== null) {
      if (match[1]) types.push(match[1]);
    }
  } else if (ext === ".py") {
    // === Python ===
    const pyImportRegex =
      /^(?:from\s+([a-zA-Z0-9_.]+)\s+import|import\s+([a-zA-Z0-9_.]+))/gm;
    while ((match = pyImportRegex.exec(content)) !== null) {
      const mod = match[1] || match[2];
      if (mod) rawImports.push(mod);
    }
    const pyDefRegex = /^\s*(?:async\s+)?def\s+([a-zA-Z0-9_]+)\s*\(/gm;
    while ((match = pyDefRegex.exec(content)) !== null) {
      if (match[1]) functions.push(match[1]);
    }
    const pyClassRegex = /^\s*class\s+([a-zA-Z0-9_]+)(?:\s*\(|\s*:)/gm;
    while ((match = pyClassRegex.exec(content)) !== null) {
      if (match[1]) classes.push(match[1]);
    }
  } else if (ext === ".go") {
    // === Go ===
    const goImportRegex = /import\s+(?:\(\s*([\s\S]*?)\s*\)|"([^"]+)")/g;
    while ((match = goImportRegex.exec(content)) !== null) {
      if (match[2]) {
        rawImports.push(match[2]);
      } else if (match[1]) {
        const lines = match[1].split("\n");
        for (const line of lines) {
          const m = line.match(/"([^"]+)"/);
          if (m && m[1]) rawImports.push(m[1]);
        }
      }
    }
    const goFuncRegex = /^func\s+(?:\([^)]+\)\s+)?([a-zA-Z0-9_]+)\s*\(/gm;
    while ((match = goFuncRegex.exec(content)) !== null) {
      if (match[1]) functions.push(match[1]);
    }
    const goTypeRegex = /^type\s+([a-zA-Z0-9_]+)\s+(?:struct|interface)/gm;
    while ((match = goTypeRegex.exec(content)) !== null) {
      if (match[1]) types.push(match[1]);
    }
  } else if (ext === ".rs") {
    // === Rust ===
    const rsUseRegex = /^\s*use\s+([a-zA-Z0-9_:]+)/gm;
    while ((match = rsUseRegex.exec(content)) !== null) {
      if (match[1]) rawImports.push(match[1]);
    }
    const rsFnRegex = /^\s*(?:pub\s+)?(?:async\s+)?fn\s+([a-zA-Z0-9_]+)/gm;
    while ((match = rsFnRegex.exec(content)) !== null) {
      if (match[1]) functions.push(match[1]);
    }
    const rsStructRegex = /^\s*(?:pub\s+)?(?:struct|enum)\s+([a-zA-Z0-9_]+)/gm;
    while ((match = rsStructRegex.exec(content)) !== null) {
      if (match[1]) classes.push(match[1]);
    }
    const rsTraitRegex = /^\s*(?:pub\s+)?trait\s+([a-zA-Z0-9_]+)/gm;
    while ((match = rsTraitRegex.exec(content)) !== null) {
      if (match[1]) types.push(match[1]);
    }
  } else if (ext === ".java" || ext === ".kt" || ext === ".cs") {
    // === Java / Kotlin / C# ===
    const javaImportRegex = /^\s*(?:import|using)\s+([a-zA-Z0-9_.]+);?/gm;
    while ((match = javaImportRegex.exec(content)) !== null) {
      if (match[1]) rawImports.push(match[1]);
    }
    const javaClassRegex =
      /(?:public\s+|private\s+|protected\s+)?(?:class|interface|record|enum)\s+([a-zA-Z0-9_]+)/g;
    while ((match = javaClassRegex.exec(content)) !== null) {
      if (match[1]) classes.push(match[1]);
    }
    const javaMethodRegex =
      /(?:public|private|protected|static|\s)+[\w<>\[\]]+\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/g;
    while ((match = javaMethodRegex.exec(content)) !== null) {
      if (
        match[1] &&
        !["if", "for", "while", "switch", "catch"].includes(match[1])
      ) {
        functions.push(match[1]);
      }
    }
  } else if (ext === ".php") {
    // === PHP ===
    const phpUseRegex = /^\s*use\s+([a-zA-Z0-9_\\]+);/gm;
    while ((match = phpUseRegex.exec(content)) !== null) {
      if (match[1]) rawImports.push(match[1]);
    }
    const phpClassRegex = /(?:class|trait|interface)\s+([a-zA-Z0-9_]+)/g;
    while ((match = phpClassRegex.exec(content)) !== null) {
      if (match[1]) classes.push(match[1]);
    }
    const phpFuncRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
    while ((match = phpFuncRegex.exec(content)) !== null) {
      if (match[1]) functions.push(match[1]);
    }
  } else if ([".c", ".cpp", ".cc", ".h", ".hpp"].includes(ext)) {
    // === C & C++ ===
    const cIncludeRegex = /#include\s+["<]([^">]+)[">]/g;
    while ((match = cIncludeRegex.exec(content)) !== null) {
      if (match[1]) rawImports.push(match[1]);
    }
    const cClassRegex = /(?:class|struct)\s+([a-zA-Z0-9_]+)\s*[{:]/g;
    while ((match = cClassRegex.exec(content)) !== null) {
      if (match[1]) classes.push(match[1]);
    }
    const cFuncRegex =
      /^\s*(?:[a-zA-Z0-9_*&<>]+\s+)+([a-zA-Z0-9_]+)\s*\([^;{)]*\)\s*\{/gm;
    while ((match = cFuncRegex.exec(content)) !== null) {
      if (match[1] && !["if", "for", "while", "switch"].includes(match[1])) {
        functions.push(match[1]);
      }
    }
  } else if (ext === ".rb") {
    // === Ruby ===
    const rbRequireRegex =
      /^\s*(?:require|require_relative)\s+["']([^"']+)["']/gm;
    while ((match = rbRequireRegex.exec(content)) !== null) {
      if (match[1]) rawImports.push(match[1]);
    }
    const rbDefRegex = /^\s*def\s+([a-zA-Z0-9_!?]+)/gm;
    while ((match = rbDefRegex.exec(content)) !== null) {
      if (match[1]) functions.push(match[1]);
    }
    const rbClassRegex = /^\s*(?:class|module)\s+([a-zA-Z0-9_:]+)/gm;
    while ((match = rbClassRegex.exec(content)) !== null) {
      if (match[1]) classes.push(match[1]);
    }
  }

  const parts = relativePath.split("/");
  const category = parts.length > 1 ? parts[0] : "root";

  return {
    node: {
      id: relativePath,
      label: path.basename(relativePath),
      category,
      lineCount,
      functions: [...new Set(functions)],
      classes: [...new Set(classes)],
      types: [...new Set(types)],
      inDegree: 0,
      outDegree: 0,
    },
    rawImports: [...new Set(rawImports)],
  };
}

/**
 * Resolve relative import paths to known node IDs.
 * @param {string} sourceId
 * @param {string} importLiteral
 * @param {Map<string, GraphNode>} nodeMap
 * @param {string} rootDir
 * @returns {string | null}
 */
function resolveImport(sourceId, importLiteral, nodeMap, rootDir) {
  if (!importLiteral.startsWith(".")) {
    return null; // External npm package or core node module
  }

  const sourceAbsDir = path.dirname(path.join(rootDir, sourceId));
  const candidateBase = path.resolve(sourceAbsDir, importLiteral);

  const candidateExtensions = [
    "",
    ".ts",
    ".js",
    ".mjs",
    ".cjs",
    ".tsx",
    ".jsx",
    ".py",
    ".go",
    ".rs",
    ".java",
    ".kt",
    ".php",
    ".rb",
    ".c",
    ".cpp",
    ".h",
    ".hpp",
    ".cs",
    "/index.ts",
    "/index.js",
    "/__init__.py",
    "/mod.rs",
  ];

  for (const ext of candidateExtensions) {
    let checkPath = candidateBase + ext;
    // Replace .js with .ts if source is TypeScript
    if (ext === "" && candidateBase.endsWith(".js")) {
      const tsAlt = candidateBase.slice(0, -3) + ".ts";
      const relTsAlt = path.relative(rootDir, tsAlt).replace(/\\/g, "/");
      if (nodeMap.has(relTsAlt)) return relTsAlt;
    }
    const relPath = path.relative(rootDir, checkPath).replace(/\\/g, "/");
    if (nodeMap.has(relPath)) {
      return relPath;
    }
  }

  // Also resolve internal Python dot modules (e.g. app.services.auth)
  if (!importLiteral.startsWith(".") && importLiteral.includes(".")) {
    const pyPathCandidate = importLiteral.replace(/\./g, "/") + ".py";
    if (nodeMap.has(pyPathCandidate)) {
      return pyPathCandidate;
    }
  }

  return null;
}

/**
 * Detect cycles in graph edges using DFS.
 * @param {Map<string, GraphNode>} nodeMap
 * @param {GraphEdge[]} edges
 * @returns {string[][]}
 */
function detectCycles(nodeMap, edges) {
  const adj = new Map();
  for (const id of nodeMap.keys()) {
    adj.set(id, []);
  }
  for (const edge of edges) {
    adj.get(edge.source)?.push(edge.target);
  }

  const visited = new Set();
  const recStack = new Set();
  /** @type {string[][]} */
  const cycles = [];

  /**
   * @param {string} current
   * @param {string[]} pathStack
   */
  function dfs(current, pathStack) {
    visited.add(current);
    recStack.add(current);
    pathStack.push(current);

    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, pathStack);
      } else if (recStack.has(neighbor)) {
        const cycleStartIndex = pathStack.indexOf(neighbor);
        if (cycleStartIndex !== -1) {
          cycles.push(pathStack.slice(cycleStartIndex).concat(neighbor));
        }
      }
    }

    pathStack.pop();
    recStack.delete(current);
  }

  for (const id of nodeMap.keys()) {
    if (!visited.has(id)) {
      dfs(id, []);
    }
  }

  return cycles;
}

/**
 * Generate interactive HTML visualization using vis-network (Graphify-style).
 * @param {GraphNode[]} nodes
 * @param {GraphEdge[]} edges
 * @returns {string}
 */
/**
 * Generate interactive HTML visualization using vis-network adhering to Linear brand preset & High-Craft principles.
 * @param {GraphNode[]} nodes
 * @param {GraphEdge[]} edges
 * @returns {string}
 */
function generateHtmlVisualizer(nodes, edges) {
  // Linear-preset semantic node palette: intentional, restrained, software-craft aesthetic
  /** @type {Record<string, { bg: string, border: string, highlight: string }>} */
  const categoryColors = {
    adapters: { bg: "#5e6ad2", border: "#828fff", highlight: "#a5b4fc" }, // Signature Linear Lavender/Indigo
    core: { bg: "#27a644", border: "#4ade80", highlight: "#86efac" }, // Linear Semantic Success Green
    skills: { bg: "#38bdf8", border: "#7dd3fc", highlight: "#bae6fd" }, // Technical Cyan
    scripts: { bg: "#a855f7", border: "#c084fc", highlight: "#e9d5ff" }, // Runtime Purple
    tests: { bg: "#f59e0b", border: "#fbbf24", highlight: "#fef3c7" }, // Test Gold
    commands: { bg: "#f43f5e", border: "#fb7185", highlight: "#ffe4e6" }, // Command Coral
    bin: { bg: "#e11d48", border: "#f43f5e", highlight: "#fda4af" }, // Bin Crimson
    root: { bg: "#62666d", border: "#8a8f98", highlight: "#d0d6e0" }, // Linear Muted Slate
  };

  const visNodes = nodes.map((n) => {
    const col = categoryColors[n.category] ??
      categoryColors["root"] ?? {
        bg: "#62666d",
        border: "#8a8f98",
        highlight: "#d0d6e0",
      };
    const degree = n.inDegree + n.outDegree;
    const size = Math.max(14, Math.min(36, 12 + degree * 1.8));
    return {
      id: n.id,
      label: n.label,
      title: `${n.id}\nLines: ${n.lineCount} | In: ${n.inDegree} | Out: ${n.outDegree}`,
      category: n.category,
      value: degree + 1,
      size,
      color: {
        background: col.bg,
        border: col.border,
        highlight: {
          background: col.highlight,
          border: "#ffffff",
        },
      },
      font: {
        color: "#d0d6e0",
        size: 11,
        face: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      },
      raw: n,
    };
  });

  const visEdges = edges.map((e, idx) => ({
    id: `e-${idx}`,
    from: e.source,
    to: e.target,
    arrows: { to: { enabled: true, scaleFactor: 0.5 } },
    color: { color: "#23252a", highlight: "#828fff", opacity: 0.8 },
    smooth: { type: "continuous", roundness: 0.15 },
    width: 1.2,
  }));

  const dataPayload = JSON.stringify({ nodes: visNodes, edges: visEdges });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sauron — Codebase Knowledge Graph</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/vis-network/styles/vis-network.min.css" />
  <script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
  <style>
    /* Linear Brand Preset Tokens */
    :root {
      --canvas: #010102;
      --surface-1: #0f1011;
      --surface-2: #141516;
      --surface-3: #18191a;
      --hairline: #23252a;
      --hairline-strong: #34343a;
      --primary: #5e6ad2;
      --primary-hover: #828fff;
      --ink: #f7f8f8;
      --ink-muted: #d0d6e0;
      --ink-subtle: #8a8f98;
      --ink-tertiary: #62666d;
      --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
      --sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--canvas);
      color: var(--ink-muted);
      font-family: var(--sans);
      height: 100vh;
      overflow: hidden;
      display: flex;
      -webkit-font-smoothing: antialiased;
    }

    /* Subdued grid background canvas */
    #network-canvas {
      flex: 1;
      height: 100vh;
      outline: none;
      background-image: radial-gradient(var(--hairline) 1px, transparent 1px);
      background-size: 32px 32px;
    }

    /* Linear Engineering Sidebar */
    #sidebar {
      width: 380px;
      height: 100vh;
      background: var(--surface-1);
      border-right: 1px solid var(--hairline);
      display: flex;
      flex-direction: column;
      z-index: 10;
    }

    .panel-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--hairline);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-mark {
      width: 24px;
      height: 24px;
      background: var(--primary);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 16px rgba(94, 106, 210, 0.3);
    }

    .brand-mark svg {
      width: 14px;
      height: 14px;
      fill: #fff;
    }

    .brand-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--ink);
      letter-spacing: -0.4px;
    }

    .badge-linear {
      font-size: 0.65rem;
      font-weight: 500;
      font-family: var(--mono);
      background: var(--surface-2);
      border: 1px solid var(--hairline);
      color: var(--ink-subtle);
      padding: 3px 8px;
      border-radius: 9999px;
      letter-spacing: 0.02em;
    }

    .panel-content {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Linear-Style Search Input */
    .search-wrapper {
      position: relative;
    }

    .search-input {
      width: 100%;
      background: var(--surface-2);
      border: 1px solid var(--hairline);
      border-radius: 8px;
      padding: 10px 14px 10px 36px;
      color: var(--ink);
      font-family: var(--sans);
      font-size: 0.82rem;
      outline: none;
      transition: border-color 160ms var(--ease-out), box-shadow 160ms var(--ease-out);
    }

    .search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(94, 106, 210, 0.25);
    }

    .search-wrapper svg {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 14px;
      height: 14px;
      fill: var(--ink-tertiary);
    }

    /* Metric Counters */
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .metric-card {
      background: var(--surface-2);
      border: 1px solid var(--hairline);
      border-radius: 8px;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric-num {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--ink);
      font-family: var(--mono);
      letter-spacing: -0.5px;
    }

    .metric-label {
      font-size: 0.72rem;
      font-weight: 500;
      color: var(--ink-subtle);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* Category Clusters */
    .section-title {
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--ink-subtle);
      margin-bottom: 12px;
    }

    .cluster-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .cluster-chip {
      background: var(--surface-2);
      border: 1px solid var(--hairline);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--ink-muted);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      transition: transform 160ms var(--ease-out), border-color 160ms var(--ease-out);
    }

    .cluster-chip:hover {
      border-color: var(--hairline-strong);
      color: var(--ink);
    }

    .cluster-chip:active {
      transform: scale(0.97);
    }

    .chip-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    /* AST Node Inspector Panel */
    .inspector-card {
      background: var(--surface-2);
      border: 1px solid var(--hairline);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .node-header {
      font-family: var(--mono);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--ink);
      word-break: break-all;
      line-height: 1.4;
    }

    .node-meta-row {
      display: flex;
      gap: 16px;
      font-size: 0.75rem;
      color: var(--ink-subtle);
      border-bottom: 1px solid var(--hairline);
      padding-bottom: 12px;
    }

    .meta-item strong {
      color: var(--ink);
      font-family: var(--mono);
      font-weight: 500;
    }

    .symbol-category-label {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ink-subtle);
      margin-bottom: 6px;
    }

    .symbol-tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .symbol-tag {
      background: var(--surface-3);
      border: 1px solid var(--hairline);
      padding: 3px 8px;
      border-radius: 4px;
      font-family: var(--mono);
      font-size: 0.72rem;
      color: var(--ink-muted);
    }

    .symbol-tag.class {
      border-color: rgba(94, 106, 210, 0.4);
      color: var(--primary-hover);
    }

    .symbol-tag.type {
      border-color: rgba(168, 85, 247, 0.4);
      color: #d8b4fe;
    }

    /* Floating Canvas Command Bar (Linear / Raycast Style) */
    .canvas-viewport {
      flex: 1;
      position: relative;
      height: 100vh;
      overflow: hidden;
    }

    #network-canvas {
      width: 100%;
      height: 100%;
      outline: none;
      background-image: radial-gradient(var(--hairline) 1px, transparent 1px);
      background-size: 32px 32px;
    }

    .floating-toolbar {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 16, 17, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--hairline-strong);
      border-radius: 9999px;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
      z-index: 50;
      transition: transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out);
    }

    .toolbar-divider {
      width: 1px;
      height: 20px;
      background: var(--hairline-strong);
      margin: 0 2px;
    }

    .btn-tool {
      background: transparent;
      border: 1px solid transparent;
      color: var(--ink-muted);
      padding: 8px 14px;
      height: 36px;
      border-radius: 9999px;
      font-family: var(--sans);
      font-size: 0.78rem;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      user-select: none;
      transition: all 160ms var(--ease-out);
    }

    .btn-tool:hover {
      background: var(--surface-3);
      color: var(--ink);
      border-color: var(--hairline);
    }

    .btn-tool:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    .btn-tool:active {
      transform: scale(0.96);
    }

    .btn-tool.primary {
      background: var(--primary);
      color: #ffffff;
    }

    .btn-tool.primary:hover {
      background: var(--primary-hover);
      color: #ffffff;
    }

    /* Active toggle state in pill bar */
    .btn-tool[aria-pressed="true"] {
      background: rgba(94, 106, 210, 0.2);
      border-color: rgba(94, 106, 210, 0.5);
      color: var(--ink);
    }

    .btn-tool[aria-pressed="false"] {
      color: var(--ink-subtle);
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--ink-tertiary);
      transition: background-color 160ms var(--ease-out), box-shadow 160ms var(--ease-out);
    }

    .btn-tool[aria-pressed="true"] .status-dot {
      background: #27a644;
      box-shadow: 0 0 8px rgba(39, 166, 68, 0.8);
    }

    .btn-tool[aria-pressed="false"] .status-dot {
      background: var(--ink-tertiary);
    }

    .kbd-shortcut {
      font-family: var(--mono);
      font-size: 0.65rem;
      background: var(--surface-3);
      border: 1px solid var(--hairline);
      padding: 1px 5px;
      border-radius: 4px;
      color: var(--ink-subtle);
    }
  </style>
</head>
<body>

  <aside id="sidebar" aria-label="Graph Navigation Sidebar">
    <div class="panel-header">
      <div class="brand-group">
        <div class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <h1 class="brand-title" style="margin: 0; font-size: 0.95rem;">Sauron Graph</h1>
      </div>
      <span class="badge-linear">Linear Craft</span>
    </div>

    <div class="panel-content">
      <div class="search-wrapper">
        <label for="search-input" class="visually-hidden" style="position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0);">Search Codebase Modules</label>
        <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M10.68 11.74a6 6 0 0 1-7.922-8.98 6 6 0 0 1 8.98 7.922l3.255 3.254a.75.75 0 1 1-1.06 1.06l-3.253-3.256zM11 7a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"/></svg>
        <input type="search" id="search-input" class="search-input" placeholder="Search module, function, or class..." autocomplete="off" />
      </div>

      <div class="metric-grid">
        <div class="metric-card">
          <span class="metric-num">${nodes.length}</span>
          <span class="metric-label">Source Nodes</span>
        </div>
        <div class="metric-card">
          <span class="metric-num">${edges.length}</span>
          <span class="metric-label">Dependencies</span>
        </div>
      </div>

      <div>
        <h2 class="section-title">Department Clusters</h2>
        <div class="cluster-chips" id="legend-container" role="toolbar" aria-label="Department Clusters"></div>
      </div>

      <section class="inspector-card" id="inspector" aria-live="polite" aria-label="AST Inspector">
        <h2 class="section-title" style="margin-bottom:0;">AST Inspector</h2>
        <div id="inspector-body" style="color: var(--ink-subtle); font-size: 0.8rem; line-height: 1.5;">
          Click any module node or directional edge in the canvas to inspect its AST declarations, fan-in, and fan-out.
        </div>
      </section>
    </div>
  </aside>

  <div class="canvas-viewport">
    <main id="network-canvas" aria-label="Interactive Codebase Graph Canvas"></main>

    <!-- Linear / Raycast Floating Command Bar -->
    <nav class="floating-toolbar" role="toolbar" aria-label="Graph Canvas Controls">
      <button type="button" class="btn-tool primary" id="btn-fit" aria-label="Fit View to Screen">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        <span>Fit View</span>
      </button>

      <button type="button" class="btn-tool" id="btn-physics" aria-pressed="true" aria-label="Toggle Physics Simulation">
        <span class="status-dot" aria-hidden="true"></span>
        <span id="physics-label">Physics Active</span>
      </button>

      <div class="toolbar-divider" aria-hidden="true"></div>

      <button type="button" class="btn-tool" id="btn-reset" aria-label="Reset Selection and Zoom">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
        <span>Reset</span>
        <span class="kbd-shortcut" aria-hidden="true">ESC</span>
      </button>
    </nav>
  </div>

  <script>
    const payload = ${dataPayload};
    const nodes = new vis.DataSet(payload.nodes);
    const edges = new vis.DataSet(payload.edges);
    const container = document.getElementById("network-canvas");

    const options = {
      nodes: {
        shape: "dot",
        borderWidth: 1.5,
        shadow: {
          enabled: true,
          color: "rgba(0, 0, 0, 0.7)",
          size: 8,
          x: 2,
          y: 3
        }
      },
      edges: {
        arrows: { to: { enabled: true, scaleFactor: 0.5 } },
        color: { color: "#23252a", highlight: "#828fff" },
        smooth: { type: "continuous", roundness: 0.15 }
      },
      physics: {
        enabled: true,
        solver: "forceAtlas2Based",
        forceAtlas2Based: {
          gravitationalConstant: -75,
          centralGravity: 0.015,
          springLength: 90,
          springConstant: 0.08,
          damping: 0.85,
          avoidOverlap: 0.85
        },
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        hideEdgesOnDrag: false,
        navigationButtons: false,
        zoomView: true
      }
    };

    const network = new vis.Network(container, { nodes, edges }, options);

    // Render Clean Cluster Chips with Keyboard Operability
    const categories = [...new Set(payload.nodes.map(n => n.category))];
    const legendContainer = document.getElementById("legend-container");
    categories.forEach(cat => {
      const sample = payload.nodes.find(n => n.category === cat);
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "cluster-chip";
      chip.setAttribute("aria-label", "Filter by " + cat);
      chip.innerHTML = \`<span class="chip-dot" style="background:\${sample.color.background}" aria-hidden="true"></span>\${cat}\`;
      chip.onclick = () => {
        const matchingIds = payload.nodes.filter(n => n.category === cat).map(n => n.id);
        network.selectNodes(matchingIds);
      };
      legendContainer.appendChild(chip);
    });

    // Inspector Click Handler
    network.on("click", (params) => {
      const body = document.getElementById("inspector-body");
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const item = payload.nodes.find(n => n.id === nodeId);
        if (!item) return;
        const raw = item.raw;

        body.innerHTML = \`
          <div class="node-header">\${item.id}</div>
          <div class="node-meta-row">
            <span class="meta-item">Lines: <strong>\${raw.lineCount}</strong></span>
            <span class="meta-item">Inbound: <strong>\${raw.inDegree}</strong></span>
            <span class="meta-item">Outbound: <strong>\${raw.outDegree}</strong></span>
          </div>

          <div>
            <div class="symbol-category-label">Classes (\${raw.classes.length})</div>
            <div class="symbol-tag-list">
              \${raw.classes.map(c => \`<span class="symbol-tag class">\${c}</span>\`).join("") || "<span style='color:var(--ink-tertiary); font-size:0.75rem;'>None</span>"}
            </div>
          </div>

          <div>
            <div class="symbol-category-label">Functions (\${raw.functions.length})</div>
            <div class="symbol-tag-list">
              \${raw.functions.slice(0, 8).map(f => \`<span class="symbol-tag">\${f}</span>\`).join("") || "<span style='color:var(--ink-tertiary); font-size:0.75rem;'>None</span>"}
              \${raw.functions.length > 8 ? \`<span style='color:var(--ink-tertiary); font-size:0.72rem; align-self:center;'>+\${raw.functions.length - 8} more</span>\` : ""}
            </div>
          </div>

          <div>
            <div class="symbol-category-label">Types & Interfaces (\${raw.types.length})</div>
            <div class="symbol-tag-list">
              \${raw.types.map(t => \`<span class="symbol-tag type">\${t}</span>\`).join("") || "<span style='color:var(--ink-tertiary); font-size:0.75rem;'>None</span>"}
            </div>
          </div>
        \`;
      } else {
        body.innerHTML = "Click any module node or directional edge in the canvas to inspect its AST declarations, fan-in, and fan-out.";
      }
    });

    // Live Search with Defensive Input Debouncing
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        network.unselectAll();
        return;
      }
      const match = payload.nodes.filter(n =>
        n.id.toLowerCase().includes(q) ||
        n.label.toLowerCase().includes(q) ||
        n.raw.functions.some(f => f.toLowerCase().includes(q)) ||
        n.raw.classes.some(c => c.toLowerCase().includes(q))
      );
      if (match.length > 0) {
        network.selectNodes(match.map(n => n.id));
        network.focus(match[0].id, { scale: 1.15, animation: { duration: 400, easingFunction: "easeInOutQuad" } });
      }
    });

    // Control Buttons: Fit View
    document.getElementById("btn-fit").onclick = () => {
      network.fit({ animation: { duration: 500, easingFunction: "easeOutQuad" } });
    };

    // Toggle Physics with Explicit Accessible Active State
    let isPhysicsActive = true;
    const physicsBtn = document.getElementById("btn-physics");
    const physicsLabel = document.getElementById("physics-label");

    physicsBtn.onclick = () => {
      isPhysicsActive = !isPhysicsActive;
      network.setOptions({ physics: { enabled: isPhysicsActive } });
      physicsBtn.setAttribute("aria-pressed", isPhysicsActive ? "true" : "false");
      physicsLabel.textContent = isPhysicsActive ? "Physics Active" : "Physics Paused";
    };

    // Reset View & Form
    document.getElementById("btn-reset").onclick = () => {
      network.unselectAll();
      network.fit({ animation: { duration: 400, easingFunction: "easeOutQuad" } });
      searchInput.value = "";
      document.getElementById("inspector-body").innerHTML = "Click any module node or directional edge in the canvas to inspect its AST declarations, fan-in, and fan-out.";
    };

    // Keyboard Accessibility: Escape key clears selection
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        network.unselectAll();
        searchInput.value = "";
        searchInput.blur();
        document.getElementById("inspector-body").innerHTML = "Click any module node or directional edge in the canvas to inspect its AST declarations, fan-in, and fan-out.";
      }
    });
  </script>
</body>
</html>
`;
}

/**
 * Generate Markdown report summary.
 * @param {GraphNode[]} nodes
 * @param {GraphEdge[]} edges
 * @param {string[][]} cycles
 * @returns {string}
 */
function generateMarkdownReport(nodes, edges, cycles) {
  const sortedByDegree = [...nodes].sort(
    (a, b) => b.inDegree + b.outDegree - (a.inDegree + a.outDegree),
  );

  const topHubs = sortedByDegree.slice(0, 10);
  const isolated = nodes.filter((n) => n.inDegree === 0 && n.outDegree === 0);

  const totalLines = nodes.reduce((sum, n) => sum + n.lineCount, 0);

  return `# Codebase Knowledge Graph Report

> Generated by Sauron AI Knowledge Graph Engine.
> Timestamp: ${new Date().toISOString()}

## System Overview

- **Total Analyzed Files (Nodes)**: ${nodes.length}
- **Total Dependencies (Edges)**: ${edges.length}
- **Total Lines of Code**: ${totalLines}
- **Detected Cycles**: ${cycles.length}
- **Isolated Modules**: ${isolated.length}

---

## High-Connectivity Hub Nodes (Top 10)

Files with the highest fan-in and fan-out:

| Module Path | Category | Inbound | Outbound | Total Degree | Lines |
| :--- | :--- | :--- | :--- | :--- | :--- |
${topHubs
  .map(
    (n) =>
      `| \`${n.id}\` | ${n.category} | ${n.inDegree} | ${n.outDegree} | **${n.inDegree + n.outDegree}** | ${n.lineCount} |`,
  )
  .join("\n")}

---

## Architectural Health & Circular Dependencies

${
  cycles.length === 0
    ? "- **Circular Dependencies**: 0 cycles detected. Clean acyclic hierarchy."
    : `### Detected Cycles (${cycles.length})\n\n` +
      cycles
        .map((c, i) => `${i + 1}. ${c.map((p) => `\`${p}\``).join(" -> ")}`)
        .join("\n")
}

---

## Interactive Visualization

Open the visual graph interface in any browser:

\`\`\`bash
# Open directly in browser
start .sauron/graph/graph.html
\`\`\`
`;
}

/**
 * Main execution routine for generating codebase knowledge graph.
 * @param {string} targetDir
 * @param {Object} options
 * @param {string} [options.outputDir]
 * @returns {{ nodes: GraphNode[], edges: GraphEdge[], cycles: string[][] }}
 */
export function buildCodebaseGraph(targetDir, options = {}) {
  const rootDir = path.resolve(targetDir);
  const outputDirectory = options.outputDir
    ? path.resolve(options.outputDir)
    : path.join(rootDir, ".sauron", "graph");

  const filePaths = scanSourceFiles(rootDir, rootDir);

  const nodeMap = new Map();
  const parsedFiles = [];

  for (const filePath of filePaths) {
    const parsed = parseFileSymbols(filePath, rootDir);
    nodeMap.set(parsed.node.id, parsed.node);
    parsedFiles.push(parsed);
  }

  const edges = [];

  for (const { node, rawImports } of parsedFiles) {
    for (const rawImport of rawImports) {
      const resolvedTarget = resolveImport(
        node.id,
        rawImport,
        nodeMap,
        rootDir,
      );
      if (resolvedTarget && resolvedTarget !== node.id) {
        edges.push({
          source: node.id,
          target: resolvedTarget,
          importPath: rawImport,
        });

        node.outDegree += 1;
        const targetNode = nodeMap.get(resolvedTarget);
        if (targetNode) {
          targetNode.inDegree += 1;
        }
      }
    }
  }

  const nodes = Array.from(nodeMap.values());
  const cycles = detectCycles(nodeMap, edges);

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  // 1. graph.json
  const graphJsonPath = path.join(outputDirectory, "graph.json");
  fs.writeFileSync(
    graphJsonPath,
    JSON.stringify(
      { nodes, edges, cycles, timestamp: new Date().toISOString() },
      null,
      2,
    ),
    "utf8",
  );

  // 2. graph-report.md
  const graphReportPath = path.join(outputDirectory, "graph-report.md");
  fs.writeFileSync(
    graphReportPath,
    generateMarkdownReport(nodes, edges, cycles),
    "utf8",
  );

  // 3. graph.html
  const graphHtmlPath = path.join(outputDirectory, "graph.html");
  fs.writeFileSync(graphHtmlPath, generateHtmlVisualizer(nodes, edges), "utf8");

  return { nodes, edges, cycles };
}
