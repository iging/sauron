// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { formatCavemanSection } from "../../dist/adapters/types.js";
import { Transpiler } from "../../dist/adapters/transpiler.js";

const SAURON_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

describe("Caveman default-on tier", () => {
  it("is active from the first reply unless the tier is off", () => {
    for (const mode of /** @type {const} */ (["lite", "full", "ultra"])) {
      const text = formatCavemanSection("##", mode).join("\n");
      assert.ok(text.includes(`ACTIVE at tier \`${mode}\``));
      assert.ok(text.includes("No trigger command is needed"));
    }
    const off = formatCavemanSection("##", "off").join("\n");
    assert.ok(off.includes("Default: OFF"));
    assert.ok(!off.includes("ACTIVE"));
  });

  it("reads caveman.default_mode from sauron.config.yaml", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-caveman-"));
    try {
      fs.writeFileSync(path.join(dir, "sauron.config.yaml"), 'caveman:\n  default_mode: "ultra"\n');
      const transpiler = new Transpiler({ workspaceRoot: dir, sauronRoot: SAURON_ROOT });
      transpiler.transpileAll();
      const agents = fs.readFileSync(path.join(dir, "AGENTS.md"), "utf8");
      assert.ok(agents.includes("ACTIVE at tier `ultra`"));
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("fails closed on an invalid tier", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-caveman-"));
    try {
      fs.writeFileSync(path.join(dir, "sauron.config.yaml"), 'caveman:\n  default_mode: "mega"\n');
      const transpiler = new Transpiler({ workspaceRoot: dir, sauronRoot: SAURON_ROOT });
      assert.throws(() => transpiler.transpileAll(), /Invalid caveman.default_mode/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
