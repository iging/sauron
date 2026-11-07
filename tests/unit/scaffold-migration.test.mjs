// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ConflictManager } from "../../dist/adapters/conflict-manager.js";
import { Transpiler } from "../../dist/adapters/transpiler.js";
import { ClaudeAdapter } from "../../dist/adapters/claude.js";
import { CursorAdapter } from "../../dist/adapters/cursor.js";
import { WindsurfAdapter } from "../../dist/adapters/windsurf.js";
import { ClineAdapter } from "../../dist/adapters/cline.js";
import { PiAdapter } from "../../dist/adapters/pi.js";
import { listDepartments, listSkills } from "../../dist/adapters/installer.js";

const ROOT = path.resolve(".");

describe("Scaffold note migration", () => {
  for (const Adapter of [ClaudeAdapter, CursorAdapter, WindsurfAdapter, ClineAdapter, PiAdapter]) {
    it(`${Adapter.name} retires owned notes, preserves edits, and simulates a dry run`, () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-scaffold-migration-"));
      try {
        const adapter = new Adapter();
        const [owned, edited] = adapter.retiredFiles;
        assert.ok(owned && edited);
        const manager = new ConflictManager(dir);
        manager.safeWrite(owned, "# Old note", adapter.id);
        manager.safeWrite(edited, "# Old note", adapter.id);
        fs.appendFileSync(path.join(dir, edited), "\nUser edit.\n");
        const transpiler = new Transpiler({ workspaceRoot: dir, sauronRoot: ROOT });
        const dry = transpiler.transpileAll({ dryRun: true, targetRuntimes: [adapter.id] });
        assert.equal(dry.files.find((file) => file.filePath === owned)?.action, "simulated");
        assert.ok(fs.existsSync(path.join(dir, owned)));
        assert.ok(!fs.existsSync(path.join(dir, `.${adapter.id}/README.md`)));
        const report = transpiler.transpileAll({ targetRuntimes: [adapter.id] });
        assert.equal(report.files.find((file) => file.filePath === owned)?.action, "removed");
        assert.equal(report.files.find((file) => file.filePath === edited)?.action, "skipped");
        assert.ok(!fs.existsSync(path.join(dir, owned)));
        assert.match(fs.readFileSync(path.join(dir, edited), "utf8"), /User edit/);
        assert.ok(fs.existsSync(path.join(dir, `.${adapter.id}/README.md`)));
        const again = transpiler.transpileAll({ targetRuntimes: [adapter.id] });
        assert.ok(!again.files.some((file) => file.action === "removed"));
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });
  }

  it("uses the installable catalog for generated skill references", () => {
    const transpiler = new Transpiler({ workspaceRoot: ROOT, sauronRoot: ROOT });
    const installed = listSkills(ROOT, listDepartments(ROOT));
    assert.deepEqual(transpiler.loadSkills().map((skill) => skill.id), installed.map((skill) => skill.name));
  });
});
