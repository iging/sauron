// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AgentsMdAdapter } from "../../dist/adapters/agents-md.js";
import { Transpiler } from "../../dist/adapters/transpiler.js";

const SAURON_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

describe("AgentsMdAdapter", () => {
  it("emits AGENTS.md, skills README, and anti-patterns doc", () => {
    const t = new Transpiler({
      workspaceRoot: SAURON_ROOT,
      sauronRoot: SAURON_ROOT,
      dryRun: true,
    });
    const ctx = t.buildContext();
    assert.ok(ctx.antiPatternsDoc && ctx.antiPatternsDoc.length > 0);
    const out = new AgentsMdAdapter().transpile(ctx);
    assert.deepEqual(
      out.map((o) => o.relativePath),
      ["AGENTS.md", ".agents/skills/README.md", ".agents/anti-patterns.md"],
    );
    const agents = out[0].content;
    assert.match(
      agents,
      /Codex, Cursor, GitHub Copilot, Windsurf, Cline, OpenCode, Kiro, Zed, CodeBuddy, and Pi/,
    );
    assert.match(agents, /Caveman Mode/);
    assert.match(agents, /\/gandalf/);
    assert.match(out[1].content, /<name>\/SKILL\.md/);
    assert.match(out[1].content, /sauron add <skill>/);
    assert.ok(out[2].content.endsWith(ctx.antiPatternsDoc));
    assert.match(out[2].content, /Managed by Sauron/);
  });

  it("omits anti-patterns doc when reference is missing (fail-closed)", () => {
    const empty = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-agentsmd-"));
    try {
      const t = new Transpiler({
        workspaceRoot: empty,
        sauronRoot: empty,
        dryRun: true,
      });
      const ctx = t.buildContext();
      assert.equal(ctx.antiPatternsDoc, undefined);
      assert.deepEqual(
        new AgentsMdAdapter().transpile(ctx).map((o) => o.relativePath),
        ["AGENTS.md", ".agents/skills/README.md"],
      );
    } finally {
      fs.rmSync(empty, { recursive: true, force: true });
    }
  });
});
