// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { OpenCodeAdapter } from "../../dist/adapters/opencode.js";
import { KiroAdapter } from "../../dist/adapters/kiro.js";

/** @type {any} */
const ctx = {
  projectName: "demo",
  version: "0.0.0",
  rules: ["Rule A"],
  fellowship: [{ name: "Gandalf", role: "Planner", slashCommand: "/gandalf" }],
  antiPatterns: ["AP1"],
};

describe("OpenCode + Kiro scaffold", () => {
  it("OpenCode emits opencode.json schema and folder READMEs only", () => {
    const adapter = new OpenCodeAdapter();
    const out = adapter.transpile(ctx);
    const paths = out.map((o) => o.relativePath).sort();
    assert.deepEqual(paths, [
      ".opencode/agents/README.md",
      ".opencode/commands/README.md",
      ".opencode/skills/README.md",
      "opencode.json",
    ]);
    assert.deepEqual([...adapter.targetFiles].sort(), paths);
    const json = out.find((o) => o.relativePath === "opencode.json");
    assert.deepEqual(JSON.parse(json?.content ?? ""), { $schema: "https://opencode.ai/config.json" });
    assert.ok(!paths.includes("AGENTS.md"));
  });

  it("Kiro emits always-included steering file and skills README", () => {
    const adapter = new KiroAdapter();
    const out = adapter.transpile(ctx);
    const paths = out.map((o) => o.relativePath).sort();
    assert.deepEqual(paths, [".kiro/skills/README.md", ".kiro/steering/sauron.md"]);
    assert.deepEqual([...adapter.targetFiles].sort(), paths);
    const steering = out.find((o) => o.relativePath === ".kiro/steering/sauron.md");
    assert.match(steering?.content ?? "", /^---\ninclusion: always\n---\n/);
  });
});
