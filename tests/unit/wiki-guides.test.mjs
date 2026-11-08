// @ts-check
import { it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Transpiler } from "../../dist/adapters/transpiler.js";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
it("shared and Claude guides mention llm-wiki only for its selected install output", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-wiki-guide-"));
  try {
    const engine = new Transpiler({ workspaceRoot: temp, sauronRoot: root });
    engine.transpileAll({ targetRuntimes: ["claude"] });
    for (const name of ["AGENTS.md", "CLAUDE.md"])
      assert.doesNotMatch(
        fs.readFileSync(path.join(temp, name), "utf8"),
        /Knowledge wiki:/,
      );
    const content = fs.readFileSync(
      path.join(root, "skills/workflow/llm-wiki/SKILL.md"),
      "utf8",
    );
    engine.transpileAll({
      targetRuntimes: ["claude"],
      extras: [
        {
          relativePath: ".agents/skills/llm-wiki/SKILL.md",
          content,
          raw: true,
        },
      ],
    });
    for (const name of ["AGENTS.md", "CLAUDE.md"])
      assert.match(
        fs.readFileSync(path.join(temp, name), "utf8"),
        /Knowledge wiki:.*\.agents\/skills\/llm-wiki\/SKILL\.md/,
      );
    assert.ok(
      fs.existsSync(path.join(temp, ".agents/skills/llm-wiki/SKILL.md")),
    );
    engine.transpileAll({ targetRuntimes: ["claude"], extras: [] });
    for (const name of ["AGENTS.md", "CLAUDE.md"])
      assert.doesNotMatch(
        fs.readFileSync(path.join(temp, name), "utf8"),
        /Knowledge wiki:/,
      );
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
