// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ClaudeAdapter } from "../../dist/adapters/claude.js";

const FOLDERS = ["rules", "skills", "agents", "workflows", "output-styles", "agent-memory", "docs"];

describe("ClaudeAdapter scaffold", () => {
  const adapter = new ClaudeAdapter();
  const outputs = adapter.transpile(
    /** @type {any} */ ({ version: "0.0.0", projectDescription: "", rules: [], fellowship: [], skills: [] }),
  );
  const paths = outputs.map((o) => o.relativePath);

  it("emits CLAUDE.md, .claude/README.md, settings.json and folder READMEs", () => {
    const expected = [
      "CLAUDE.md",
      ".claude/README.md",
      ".claude/settings.json",
      ...FOLDERS.map((f) => `.claude/${f}/README.md`),
    ];
    assert.deepEqual([...paths].sort(), [...expected].sort());
    assert.deepEqual([...adapter.targetFiles].sort(), [...expected].sort());
  });

  it("emits valid settings.json with schema", () => {
    const settings = outputs.find((o) => o.relativePath === ".claude/settings.json");
    assert.deepEqual(JSON.parse(settings?.content ?? ""), {
      $schema: "https://json.schemastore.org/claude-code-settings.json",
    });
  });

  it("READMEs link the official docs and root notes commands/ is legacy", () => {
    for (const o of outputs.filter((x) => x.relativePath.startsWith(".claude/") && x.relativePath.endsWith("README.md"))) {
      assert.match(o.content, /https:\/\/code\.claude\.com\/docs\/en\/claude-directory/);
    }
    const root = outputs.find((o) => o.relativePath === ".claude/README.md");
    assert.match(root?.content ?? "", /commands\/` is legacy/);
  });
});
