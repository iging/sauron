// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CursorAdapter } from "../../dist/adapters/cursor.js";

const context = /** @type {any} */ ({
  projectName: "demo",
  version: "0.0.0",
  rules: ["Rule one"],
  fellowship: [{ name: "Gandalf", role: "Planner", slashCommand: "/gandalf" }],
  antiPatterns: ["No barrels"],
  skills: [{ triggerCommand: "/x", name: "X", department: "core" }],
});

describe("CursorAdapter scaffold", () => {
  const outputs = new CursorAdapter().transpile(context);
  const paths = outputs.map((o) => o.relativePath);

  it("emits the .cursor scaffold and no legacy .cursorrules", () => {
    assert.deepEqual(paths, [
      ".cursor/rules/sauron.mdc",
      ".cursor/rules/README.md",
      ".cursor/skills/README.md",
    ]);
    assert.deepEqual(new CursorAdapter().targetFiles, paths);
  });

  it("writes valid MDC frontmatter with alwaysApply true", () => {
    const mdc = outputs[0].content;
    const fm = mdc.split("---")[1];
    assert.ok(mdc.startsWith("---\n"));
    assert.match(fm, /^description: .+$/m);
    assert.match(fm, /^globs:\s*$/m);
    assert.match(fm, /^alwaysApply: true$/m);
    assert.ok(mdc.includes("Gandalf") && mdc.includes("No barrels"));
  });

  it("READMEs link official docs", () => {
    assert.ok(outputs[1].content.includes("https://cursor.com/docs/context/rules"));
    assert.ok(outputs[2].content.includes("https://cursor.com/docs/skills"));
  });
});
