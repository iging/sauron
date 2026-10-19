// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ClaudeAdapter } from "../../dist/adapters/claude.js";

const FOLDERS = ["rules", "skills", "agents", "workflows", "output-styles", "agent-memory", "docs"];

/** @param {string} [cavemanMode] */
const run = (cavemanMode) =>
  new ClaudeAdapter().transpile(
    /** @type {any} */ ({ version: "0.0.0", projectDescription: "", rules: [], fellowship: [], skills: [], cavemanMode }),
  );

describe("ClaudeAdapter scaffold", () => {
  const adapter = new ClaudeAdapter();
  const outputs = run();
  const paths = outputs.map((o) => o.relativePath);

  it("emits CLAUDE.md, .claude/README.md, settings.json, output style and folder READMEs", () => {
    const expected = [
      "CLAUDE.md",
      ".claude/README.md",
      ".claude/settings.json",
      ".claude/output-styles/caveman.md",
      ...FOLDERS.map((f) => `.claude/${f}/README.md`),
    ];
    assert.deepEqual([...paths].sort(), [...expected].sort());
    assert.deepEqual([...adapter.targetFiles].sort(), [...expected].sort());
  });

  it("enables the Caveman output style in settings.json by default", () => {
    const settings = outputs.find((o) => o.relativePath === ".claude/settings.json");
    assert.deepEqual(JSON.parse(settings?.content ?? ""), {
      $schema: "https://json.schemastore.org/claude-code-settings.json",
      outputStyle: "Caveman",
    });
    const style = outputs.find((o) => o.relativePath === ".claude/output-styles/caveman.md");
    assert.match(style?.content ?? "", /^---\nname: Caveman\n/);
    assert.match(style?.content ?? "", /keep-coding-instructions: true/);
  });

  it("omits the output style when Caveman is off", () => {
    const off = run("off");
    assert.ok(!off.some((o) => o.relativePath === ".claude/output-styles/caveman.md"));
    const settings = off.find((o) => o.relativePath === ".claude/settings.json");
    assert.ok(!("outputStyle" in JSON.parse(settings?.content ?? "{}")));
  });

  it("CLAUDE.md does not describe the Sauron repository itself", () => {
    const claudeMd = outputs.find((o) => o.relativePath === "CLAUDE.md")?.content ?? "";
    assert.doesNotMatch(claudeMd, /17 runtime transpilation adapters|44 ECC-standard/);
    assert.match(claudeMd, /\.claude\/skills\//);
  });

  it("READMEs link the official docs and root explains commands/", () => {
    for (const o of outputs.filter((x) => x.relativePath.startsWith(".claude/") && x.relativePath.endsWith("README.md"))) {
      assert.match(o.content, /https:\/\/code\.claude\.com\/docs\/en\/claude-directory/);
    }
    const root = outputs.find((o) => o.relativePath === ".claude/README.md");
    assert.match(root?.content ?? "", /`\.claude\/commands\/` is the older slash-command format/);
  });
});
