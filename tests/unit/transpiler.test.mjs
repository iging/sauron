// @ts-check
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { Transpiler } from "../../dist/adapters/transpiler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SAURON_ROOT = path.resolve(__dirname, "../..");

describe("Transpiler 17-Runtime Generation (Milestone 6.2)", () => {
  /** @type {string} */
  let tempWorkspace;

  before(() => {
    tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-test-"));
  });

  after(() => {
    if (fs.existsSync(tempWorkspace)) {
      fs.rmSync(tempWorkspace, { recursive: true, force: true });
    }
  });

  it("successfully transpiles and generates files for all 17 runtimes in isolation", () => {
    const transpiler = new Transpiler({
      workspaceRoot: tempWorkspace,
      sauronRoot: SAURON_ROOT,
      dryRun: false,
    });

    const report = transpiler.transpileAll({ dryRun: false });

    // Assert that multiple targets were generated
    assert.ok(
      report.totalGenerated >= 17,
      `Expected at least 17 generated files, got ${report.totalGenerated}`,
    );

    const expectedPaths = [
      "CLAUDE.md",
      ".cursorrules",
      ".cursor/rules/sauron.mdc",
      ".windsurfrules",
      ".github/copilot-instructions.md",
      ".clinerules",
      ".traerules",
      ".zed/settings.json",
      ".rules",
      ".codex/instructions.md",
      ".vscode/settings.json",
      ".vscode/sauron.instructions.md",
      "GEMINI.md",
      ".qwen/system.md",
      ".kimi/prompt.md",
      ".kirorules",
      ".hermesrules",
      ".openclaw/config.json",
      ".opencode/instructions.md",
      ".pirules",
      ".adalrules",
      ".codebuddy/rules/sauron.md",
      ".codebuddy/skills/README.md",
    ];

    for (const relPath of expectedPaths) {
      const fullPath = path.join(tempWorkspace, relPath);
      assert.ok(fs.existsSync(fullPath), `Target file must exist: ${relPath}`);
      const content = fs.readFileSync(fullPath, "utf8");
      assert.ok(
        content.length > 50,
        `File content should not be empty: ${relPath}`,
      );
      assert.ok(
        content.toLowerCase().includes("sauron"),
        `File should mention sauron: ${relPath}`,
      );
    }

    for (const legacy of [".codebuddy/rules.md", ".zed/prompts/sauron.md"]) {
      assert.ok(
        !fs.existsSync(path.join(tempWorkspace, legacy)),
        `Legacy file must not be generated: ${legacy}`,
      );
    }
  });
});

describe("CodeBuddy + Zed scaffold paths", () => {
  it("emits official scaffold paths and drops legacy files", async () => {
    const { CodeBuddyAdapter } = await import("../../dist/adapters/codebuddy.js");
    const { ZedAdapter } = await import("../../dist/adapters/zed.js");
    const ctx = {
      projectName: "demo",
      version: "0.0.0",
      rules: ["r"],
      antiPatterns: ["a"],
      fellowship: [],
      skills: [],
    };
    const cb = new CodeBuddyAdapter()
      .transpile(/** @type {any} */ (ctx))
      .map((o) => o.relativePath);
    assert.deepEqual(cb, [
      ".codebuddy/rules/sauron.md",
      ".codebuddy/skills/README.md",
    ]);
    const zed = new ZedAdapter()
      .transpile(/** @type {any} */ (ctx))
      .map((o) => o.relativePath);
    assert.deepEqual(zed, [".zed/settings.json", ".rules"]);
  });
});
