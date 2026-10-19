// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TraeAdapter } from "../../dist/adapters/trae.js";
import { PiAdapter } from "../../dist/adapters/pi.js";

const context = {
  projectName: "demo",
  version: "0.0.0",
  rules: ["rule-a"],
  fellowship: [{ name: "Gandalf", role: "Planner", slashCommand: "/gandalf" }],
  skills: [{ name: "Commit", triggerCommand: "/commit" }],
  antiPatterns: ["no-barrels"],
};

describe("Trae + Pi scaffold", () => {
  it("Trae emits .trae/rules/project_rules.md with unverified note", () => {
    const adapter = new TraeAdapter();
    const out = adapter.transpile(/** @type {any} */ (context));
    assert.deepEqual(
      out.map((o) => o.relativePath),
      [".trae/rules/project_rules.md"],
    );
    assert.deepEqual(adapter.targetFiles, [".trae/rules/project_rules.md"]);
    assert.ok(out[0].content.startsWith("<!-- unverified: https://www.trae.ai/"));
  });

  it("Pi emits prompts and skills READMEs with unverified note, no AGENTS.md", () => {
    const adapter = new PiAdapter();
    const out = adapter.transpile(/** @type {any} */ (context));
    const paths = out.map((o) => o.relativePath);
    assert.deepEqual(paths, [".pi/prompts/README.md", ".pi/skills/README.md"]);
    assert.deepEqual(adapter.targetFiles, paths);
    for (const o of out) {
      assert.ok(o.content.startsWith("<!-- unverified: https://wener.me/"));
    }
    assert.ok(out[0].content.includes("$ARGUMENTS"));
    assert.ok(out[0].content.includes("no-barrels"));
  });
});
