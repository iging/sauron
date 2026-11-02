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
  it("emits .omp/mcp.json and one README outside the scanned folders", () => {
    const adapter = new OmpAdapter();
    const out = adapter.transpile(ctx);
    const paths = out.map((o) => o.relativePath).sort();
    assert.deepEqual(paths, [".omp/README.md", ".omp/mcp.json"]);
    assert.deepEqual([...adapter.targetFiles].sort(), paths);
    assert.ok(!paths.includes("AGENTS.md"));
  });

  it("writes an empty mcpServers object for safe JSON merge", () => {
    const out = new OmpAdapter().transpile(ctx);
    const mcp = out.find((o) => o.relativePath === ".omp/mcp.json");
    assert.equal(mcp?.format, "json");
    assert.deepEqual(JSON.parse(mcp?.content ?? ""), { mcpServers: {} });
  });

  it("documents native omp frontmatter in the README", () => {
    const out = new OmpAdapter().transpile(ctx);
    const readme = out.find((o) => o.relativePath === ".omp/README.md")?.content ?? "";
    assert.match(readme, /SKILL\.md/);
    assert.match(readme, /\.agents\/skills\//);
    assert.match(readme, /\$ARGUMENTS/);
    assert.match(readme, /`name` and `description`/);
    assert.match(readme, /AGENTS\.md/);
    assert.match(readme, /https:\/\/omp\.sh\/docs\//);
  });
});
