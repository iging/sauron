// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { OmpAdapter } from "../../dist/adapters/omp.js";

/** @type {any} */
const ctx = {
  projectName: "demo",
  version: "0.0.0",
  rules: ["Rule A"],
  fellowship: [{ name: "Gandalf", role: "Planner", slashCommand: "/gandalf" }],
  antiPatterns: ["AP1"],
};

describe("omp scaffold", () => {
  it("emits .omp/mcp.json and folder READMEs only", () => {
    const adapter = new OmpAdapter();
    const out = adapter.transpile(ctx);
    const paths = out.map((o) => o.relativePath).sort();
    assert.deepEqual(paths, [
      ".omp/agents/README.md",
      ".omp/mcp.json",
      ".omp/prompts/README.md",
      ".omp/skills/README.md",
    ]);
    assert.deepEqual([...adapter.targetFiles].sort(), paths);
    assert.ok(!paths.includes("AGENTS.md"));
  });

  it("writes an empty mcpServers object for safe JSON merge", () => {
    const out = new OmpAdapter().transpile(ctx);
    const mcp = out.find((o) => o.relativePath === ".omp/mcp.json");
    assert.equal(mcp?.format, "json");
    assert.deepEqual(JSON.parse(mcp?.content ?? ""), { mcpServers: {} });
  });

  it("documents native omp frontmatter in each README", () => {
    const out = new OmpAdapter().transpile(ctx);
    const read = (/** @type {string} */ p) => out.find((o) => o.relativePath === p)?.content ?? "";
    assert.match(read(".omp/skills/README.md"), /SKILL\.md/);
    assert.match(read(".omp/skills/README.md"), /\.agents\/skills\//);
    assert.match(read(".omp/prompts/README.md"), /\$ARGUMENTS/);
    assert.match(read(".omp/agents/README.md"), /`name` and `description`/);
    for (const o of out.filter((x) => x.format === "markdown")) {
      assert.match(o.content, /AGENTS\.md/);
      assert.match(o.content, /https:\/\/omp\.sh\/docs\//);
    }
  });
});
