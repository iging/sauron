// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  WindsurfAdapter,
  WINDSURF_RULE_CHAR_LIMIT,
} from "../../dist/adapters/windsurf.js";

/** @param {number} skillCount */
function makeContext(skillCount) {
  return /** @type {any} */ ({
    projectName: "demo",
    version: "0.0.0",
    rules: ["Use ESM"],
    fellowship: [{ name: "Gandalf", role: "Planner", slashCommand: "/gandalf" }],
    antiPatterns: ["No barrels"],
    skills: Array.from({ length: skillCount }, (_, i) => ({
      name: `skill-${i}-with-a-reasonably-long-name`,
      triggerCommand: `/skill-${i}`,
    })),
  });
}

describe("WindsurfAdapter", () => {
  it("emits the .windsurf scaffold and no legacy .windsurfrules", () => {
    const adapter = new WindsurfAdapter();
    const paths = adapter.transpile(makeContext(3)).map((o) => o.relativePath);
    assert.deepEqual(paths, [
      ".windsurf/rules/sauron.md",
      ".windsurf/workflows/README.md",
      ".windsurf/skills/README.md",
    ]);
    assert.deepEqual([...adapter.targetFiles], paths);
  });

  it("rule uses trigger: always_on and stays within 12000 chars", () => {
    for (const count of [3, 2000]) {
      const [rule] = new WindsurfAdapter().transpile(makeContext(count));
      assert.ok(rule.content.startsWith("---\ntrigger: always_on\n---\n"));
      assert.ok(
        rule.content.length <= WINDSURF_RULE_CHAR_LIMIT,
        `rule is ${rule.content.length} chars`,
      );
      assert.equal(WINDSURF_RULE_CHAR_LIMIT, 12000);
    }
  });

  it("folder READMEs point to the preferred .devin/ path", () => {
    const outputs = new WindsurfAdapter().transpile(makeContext(1));
    for (const o of outputs.slice(1)) {
      assert.ok(o.content.includes(".devin/"), o.relativePath);
    }
  });
});
