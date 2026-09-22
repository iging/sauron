// @ts-check
/**
 * @fileoverview End-to-End tests for the complete Knowledge Graph CLI workflow.
 * Adheres strictly to testing-principles:
 * - End-to-end verification of output artifacts (.sauron/graph/).
 * - Multi-language codebase simulation.
 * - Non-empty, structurally valid outputs (JSON, Markdown, HTML).
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const CLI_PATH = path.resolve("bin", "sauron.mjs");

describe("E2E: Codebase Knowledge Graph Workflow (graph-workflow)", () => {
  /** @type {string} */
  let tempWorkspace;

  before(() => {
    // Arrange: Create realistic multi-language workspace
    tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-e2e-graph-"));

    const srcDir = path.join(tempWorkspace, "src");
    fs.mkdirSync(srcDir, { recursive: true });

    // TypeScript entry point
    fs.writeFileSync(
      path.join(srcDir, "app.ts"),
      `export class Application {
  public start(): void {}
}
`,
      "utf8",
    );

    // Python background worker
    fs.writeFileSync(
      path.join(srcDir, "worker.py"),
      `class BackgroundWorker:
    def process_jobs(self):
        pass
`,
      "utf8",
    );
  });

  after(() => {
    // Teardown: Clean up isolated workspace
    if (fs.existsSync(tempWorkspace)) {
      fs.rmSync(tempWorkspace, { recursive: true, force: true });
    }
  });

  it("executes 'sauron graph .' and generates all 3 knowledge graph artifacts", async () => {
    // Act: Run sauron graph command
    const { stdout } = await execFileAsync("node", [CLI_PATH, "graph", "."], {
      cwd: tempWorkspace,
    });

    // Assert: Verify execution completion
    assert.ok(
      stdout.includes("[COMPLETE]"),
      "Must log graph generation completion",
    );
    assert.ok(stdout.includes("graph.json"), "Must mention graph.json");
    assert.ok(
      stdout.includes("graph-report.md"),
      "Must mention graph-report.md",
    );
    assert.ok(stdout.includes("graph.html"), "Must mention graph.html");

    const graphDir = path.join(tempWorkspace, ".sauron", "graph");
    const jsonPath = path.join(graphDir, "graph.json");
    const reportPath = path.join(graphDir, "graph-report.md");
    const htmlPath = path.join(graphDir, "graph.html");

    // Assert: Verify physical files exist on disk
    assert.ok(fs.existsSync(jsonPath), "graph.json must exist on disk");
    assert.ok(fs.existsSync(reportPath), "graph-report.md must exist on disk");
    assert.ok(fs.existsSync(htmlPath), "graph.html must exist on disk");

    // Assert: Validate JSON payload integrity
    const graphData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    assert.ok(graphData.nodes.length >= 2, "Must contain at least 2 AST nodes");

    const appNode = graphData.nodes.find((/** @type {any} */ n) =>
      n.id.includes("app.ts"),
    );
    assert.ok(
      appNode && appNode.classes.includes("Application"),
      "Must detect Application class in app.ts",
    );

    const workerNode = graphData.nodes.find((/** @type {any} */ n) =>
      n.id.includes("worker.py"),
    );
    assert.ok(
      workerNode && workerNode.classes.includes("BackgroundWorker"),
      "Must detect BackgroundWorker class in worker.py",
    );

    // Assert: Validate HTML document format and accessible controls
    const htmlContent = fs.readFileSync(htmlPath, "utf8");
    assert.ok(
      htmlContent.includes("<!DOCTYPE html>"),
      "Must be a valid HTML document",
    );
    assert.ok(
      htmlContent.includes("vis-network"),
      "Must embed vis-network library",
    );
    assert.ok(
      htmlContent.includes("Fit View"),
      "Must have accessible control buttons",
    );
  });
});
