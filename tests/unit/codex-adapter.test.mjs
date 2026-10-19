// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CodexAdapter } from "../../dist/adapters/codex.js";

describe("CodexAdapter scaffold", () => {
  it("emits .codex/config.toml and .codex/README.md, not instructions.md", () => {
    const adapter = new CodexAdapter();
    const out = adapter.transpile(
      /** @type {any} */ ({
        projectName: "demo",
        version: "0.0.0",
        rules: [],
        fellowship: [],
        antiPatterns: [],
      }),
    );
    const paths = out.map((o) => o.relativePath);
    assert.deepEqual(paths, [".codex/config.toml", ".codex/README.md"]);
    assert.deepEqual([...adapter.targetFiles], paths);
    const readme = out[1].content;
    assert.ok(readme.includes("AGENTS.md"));
    assert.ok(readme.includes(".agents/skills"));
    assert.ok(readme.includes("<!-- unverified:"));
    assert.ok(out[0].content.includes("[mcp_servers"));
  });
});
