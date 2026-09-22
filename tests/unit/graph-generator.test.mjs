// @ts-check
/**
 * @fileoverview Unit tests for AST Knowledge Graph generator and cycle detection.
 * Adheres strictly to testing-principles:
 * - 70/20/10 Testing Pyramid: In-memory isolated unit tests.
 * - Arrange-Act-Assert (AAA) pattern.
 * - Deterministic assertions with zero arbitrary sleep/timeouts.
 * - Isolated workspace lifecycle per suite.
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { buildCodebaseGraph } from "../../scripts/graph/generate-graph.mjs";

describe("Unit: Knowledge Graph Engine (Polyglot AST & Cycles)", () => {
  /** @type {string} */
  let tempWorkspace;
  /** @type {string} */
  let outputDir;

  before(() => {
    // Arrange: Create isolated scratch test directory
    tempWorkspace = fs.mkdtempSync(
      path.join(os.tmpdir(), "sauron-graph-unit-"),
    );
    outputDir = path.join(tempWorkspace, ".sauron", "graph");

    const srcDir = path.join(tempWorkspace, "src");
    fs.mkdirSync(srcDir, { recursive: true });

    // 1. Module A (TS) -> imports B
    fs.writeFileSync(
      path.join(srcDir, "service-a.ts"),
      `import { helperFunction } from "./service-b.js";
export class ServiceA {
  public execute(): void {
    helperFunction();
  }
}
export function runServiceA(): void {}
`,
      "utf8",
    );

    // 2. Module B (TS) -> imports A (cyclic dependency)
    fs.writeFileSync(
      path.join(srcDir, "service-b.ts"),
      `import { runServiceA } from "./service-a.js";
export function helperFunction(): string {
  runServiceA();
  return "ok";
}
export interface ConfigOptions {
  timeout: number;
}
`,
      "utf8",
    );

    // 3. Python module
    fs.writeFileSync(
      path.join(srcDir, "pipeline.py"),
      `class DataPipeline:
    def process(self):
        pass

def calculate_metrics():
    return 42
`,
      "utf8",
    );

    // 4. Go module
    fs.writeFileSync(
      path.join(srcDir, "server.go"),
      `package main
type ServerConfig struct {}
func StartServer() {}
`,
      "utf8",
    );

    // 5. Rust module
    fs.writeFileSync(
      path.join(srcDir, "engine.rs"),
      `pub struct ComputeEngine;
pub fn compute() {}
`,
      "utf8",
    );
  });

  after(() => {
    // Teardown: Clean up isolated workspace to prevent state pollution
    if (fs.existsSync(tempWorkspace)) {
      fs.rmSync(tempWorkspace, { recursive: true, force: true });
    }
  });

  it("extracts polyglot AST nodes and symbols across TS, Python, Go, and Rust", () => {
    // Act: Run static AST analysis
    const result = buildCodebaseGraph(tempWorkspace, { outputDir });

    // Assert: Verify symbol extraction accuracy per language
    assert.ok(result.nodes.length >= 5, "Should find at least 5 source files");

    // TypeScript assertions
    const nodeA = result.nodes.find((n) => n.id.includes("service-a.ts"));
    assert.ok(nodeA, "service-a.ts node must exist");
    assert.ok(
      nodeA.classes.includes("ServiceA"),
      "Must extract ServiceA class",
    );
    assert.ok(
      nodeA.functions.includes("runServiceA"),
      "Must extract runServiceA function",
    );

    // Python assertions
    const nodePy = result.nodes.find((n) => n.id.includes("pipeline.py"));
    assert.ok(nodePy, "pipeline.py node must exist");
    assert.ok(
      nodePy.classes.includes("DataPipeline"),
      "Must extract DataPipeline class",
    );
    assert.ok(
      nodePy.functions.includes("calculate_metrics"),
      "Must extract calculate_metrics function",
    );

    // Go assertions
    const nodeGo = result.nodes.find((n) => n.id.includes("server.go"));
    assert.ok(nodeGo, "server.go node must exist");
    assert.ok(
      nodeGo.functions.includes("StartServer"),
      "Must extract StartServer func",
    );
    assert.ok(
      nodeGo.types.includes("ServerConfig"),
      "Must extract ServerConfig type",
    );

    // Rust assertions
    const nodeRs = result.nodes.find((n) => n.id.includes("engine.rs"));
    assert.ok(nodeRs, "engine.rs node must exist");
    assert.ok(nodeRs.functions.includes("compute"), "Must extract compute fn");
    assert.ok(
      nodeRs.classes.includes("ComputeEngine"),
      "Must extract ComputeEngine struct",
    );
  });

  it("detects circular import dependency cycles deterministically", () => {
    // Act
    const result = buildCodebaseGraph(tempWorkspace, { outputDir });

    // Assert
    assert.ok(result.cycles.length > 0, "Must detect circular cycle");
    const cycle = result.cycles[0];
    const hasServiceA = cycle.some((file) => file.includes("service-a.ts"));
    const hasServiceB = cycle.some((file) => file.includes("service-b.ts"));
    assert.ok(
      hasServiceA && hasServiceB,
      "Cycle must record both interdependent modules",
    );
  });

  it("generates graph artifacts adhering strictly to lowercase kebab-case naming standard", () => {
    // Act
    buildCodebaseGraph(tempWorkspace, { outputDir });

    // Assert
    const jsonPath = path.join(outputDir, "graph.json");
    const reportPath = path.join(outputDir, "graph-report.md");
    const htmlPath = path.join(outputDir, "graph.html");

    assert.ok(fs.existsSync(jsonPath), "graph.json must exist");
    assert.ok(fs.existsSync(reportPath), "graph-report.md must exist");
    assert.ok(fs.existsSync(htmlPath), "graph.html must exist");

    // Inspect JSON payload
    const parsedJson = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    assert.ok(Array.isArray(parsedJson.nodes), "JSON nodes must be an array");
    assert.ok(Array.isArray(parsedJson.edges), "JSON edges must be an array");
    assert.ok(Array.isArray(parsedJson.cycles), "JSON cycles must be an array");

    // Inspect visualizer
    const htmlContent = fs.readFileSync(htmlPath, "utf8");
    assert.ok(
      htmlContent.includes("vis-network"),
      "HTML visualizer must bundle vis-network",
    );
    assert.ok(
      htmlContent.includes("#010102"),
      "HTML visualizer must enforce Linear dark theme",
    );
    assert.ok(
      htmlContent.includes("Physics Active"),
      "HTML visualizer must feature physics toggle",
    );
  });
});
