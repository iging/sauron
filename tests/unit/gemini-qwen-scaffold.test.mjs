// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { GeminiAdapter } from "../../dist/adapters/gemini.js";
import { QwenAdapter } from "../../dist/adapters/qwen.js";

/** @type {any} */
const context = {
  projectName: "demo",
  projectDescription: "Demo",
  version: "0.0.0",
  rules: ["rule"],
  fellowship: [{ name: "Gandalf", role: "Planner", slashCommand: "/gandalf" }],
  antiPatterns: ["ap"],
  skills: [],
};

describe("Gemini + Qwen scaffold", () => {
  it("Gemini emits GEMINI.md, settings.json, and README", () => {
    const adapter = new GeminiAdapter();
    const out = adapter.transpile(context);
    const paths = out.map((o) => o.relativePath);
    assert.deepEqual(paths, [
      "GEMINI.md",
      ".gemini/settings.json",
      ".gemini/README.md",
    ]);
    assert.deepEqual(adapter.targetFiles, paths);
    assert.deepEqual(JSON.parse(out[1].content), {
      context: { fileName: ["GEMINI.md", "AGENTS.md"] },
    });
    assert.match(out[2].content, /\.agents\/skills/);
    assert.match(out[2].content, /Antigravity/);
  });

  it("Qwen emits QWEN.md and skills README, not legacy system.md", () => {
    const adapter = new QwenAdapter();
    const out = adapter.transpile(context);
    const paths = out.map((o) => o.relativePath);
    assert.deepEqual(paths, ["QWEN.md", ".qwen/skills/README.md"]);
    assert.deepEqual(adapter.targetFiles, paths);
    assert.match(out[1].content, /unverified/);
  });
});
