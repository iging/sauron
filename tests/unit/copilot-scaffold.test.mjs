// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CopilotAdapter } from "../../dist/adapters/copilot.js";
import { VSCodeAdapter } from "../../dist/adapters/vscode.js";

/** @type {any} */
const context = {
  projectName: "demo",
  version: "0.0.0",
  rules: ["Rule one"],
  fellowship: [],
  skills: [],
  antiPatterns: [],
};

describe("Copilot and VS Code scaffold", () => {
  it("emits the official .github customization scaffold matching targetFiles", () => {
    const adapter = new CopilotAdapter();
    const outputs = adapter.transpile(context);
    const paths = outputs.map((o) => o.relativePath).sort();
    assert.deepEqual(paths, [...adapter.targetFiles].sort());
    for (const folder of ["instructions", "prompts", "agents", "skills"]) {
      const readme = outputs.find((o) => o.relativePath === `.github/${folder}/README.md`);
      assert.ok(readme, `missing README for ${folder}`);
      assert.match(readme.content, /code\.visualstudio\.com\/docs\/copilot/);
    }
    const sample = outputs.find((o) => o.relativePath === ".github/instructions/sauron.instructions.md");
    assert.ok(sample);
    assert.match(sample.content, /^---\napplyTo: "\*\*"\n/);
    assert.match(sample.content, /- Rule one/);
  });

  it("VS Code adapter no longer duplicates instructions under .vscode", () => {
    const adapter = new VSCodeAdapter();
    const paths = adapter.transpile(context).map((o) => o.relativePath);
    assert.deepEqual(paths, [".vscode/settings.json"]);
  });
});
