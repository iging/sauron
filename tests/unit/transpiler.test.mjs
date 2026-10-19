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
      ".cursor/rules/sauron.mdc",
      ".cursor/rules/README.md",
      ".cursor/skills/README.md",
      ".windsurfrules",
      ".windsurf/rules/sauron.md",
      ".windsurf/workflows/README.md",
      ".windsurf/skills/README.md",
      ".github/copilot-instructions.md",
      ".cline/rules/sauron.md",
      ".cline/README.md",
      ".cline/workflows/README.md",
      ".cline/skills/README.md",
      ".cline/hooks/README.md",
      ".traerules",
      ".zed/settings.json",
      ".zed/prompts/sauron.md",
      ".codex/config.toml",
      ".codex/README.md",
      ".vscode/settings.json",
      ".github/instructions/sauron.instructions.md",
      ".github/instructions/README.md",
      ".github/prompts/README.md",
      ".github/agents/README.md",
      ".github/skills/README.md",
      "GEMINI.md",
      "AGENTS.md",
      ".agents/skills/README.md",
      ".agents/anti-patterns.md",
      ".qwen/system.md",
      ".gemini/README.md",
      "QWEN.md",
      ".qwen/skills/README.md",
      ".kimi/prompt.md",
      ".kiro/steering/sauron.md",
      ".kiro/skills/README.md",
      ".hermesrules",
      ".openclaw/config.json",
      ".opencode/agents/README.md",
      ".opencode/commands/README.md",
      ".opencode/skills/README.md",
      ".pirules",
      ".adalrules",
      ".codebuddy/rules.md",
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
  });

  it("emits Cline scaffold without colliding with a legacy .clinerules file", () => {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-cline-"));
    try {
      fs.writeFileSync(path.join(ws, ".clinerules"), "legacy user rules\n");
      const transpiler = new Transpiler({
        workspaceRoot: ws,
        sauronRoot: SAURON_ROOT,
        dryRun: false,
      });
      transpiler.transpileAll({ dryRun: false });
      for (const rel of [
        ".cline/rules/sauron.md",
        ".cline/README.md",
        ".cline/workflows/README.md",
        ".cline/skills/README.md",
        ".cline/hooks/README.md",
      ]) {
        assert.ok(fs.existsSync(path.join(ws, rel)), `Missing ${rel}`);
      }
      assert.equal(
        fs.readFileSync(path.join(ws, ".clinerules"), "utf8"),
        "legacy user rules\n",
        "Legacy .clinerules file must be left untouched",
      );
    } finally {
      fs.rmSync(ws, { recursive: true, force: true });
    }
  });
});
