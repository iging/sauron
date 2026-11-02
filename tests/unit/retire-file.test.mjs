// @ts-check
/**
 * @fileoverview Unit tests for removing files that older Sauron versions emitted.
 */

import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ConflictManager } from "../../dist/adapters/conflict-manager.js";
import { OmpAdapter } from "../../dist/adapters/omp.js";
import { OpenCodeAdapter } from "../../dist/adapters/opencode.js";

const FILE = ".opencode/agents/README.md";

describe("ConflictManager.retireFile", () => {
  /** @type {string} */
  let dir;
  /** @type {ConflictManager} */
  let manager;
  const target = () => path.join(dir, FILE);
  const tracked = () =>
    manager.loadManifest().managedFiles.some((f) => f.path === FILE);

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-retire-"));
    manager = new ConflictManager(dir);
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("removes a file Sauron still owns, keeps a backup, and drops the record", () => {
    manager.safeWrite(FILE, "# Note", "opencode");
    const result = manager.retireFile(FILE, "opencode");
    assert.equal(result?.action, "removed");
    assert.ok(!fs.existsSync(target()));
    assert.ok(!tracked());
    assert.ok(result?.backupPath);
    assert.ok(fs.existsSync(path.join(dir, result.backupPath)));
  });

  it("keeps a file the user edited", () => {
    manager.safeWrite(FILE, "# Note", "opencode");
    fs.appendFileSync(target(), "\nMine.\n");
    assert.equal(manager.retireFile(FILE, "opencode")?.action, "skipped");
    assert.match(fs.readFileSync(target(), "utf8"), /Mine\./);
    assert.ok(tracked());
  });

  it("keeps a user file Sauron merged into", () => {
    fs.mkdirSync(path.dirname(target()), { recursive: true });
    fs.writeFileSync(target(), "# User file\n");
    manager.safeWrite(FILE, "# Note", "opencode");
    assert.equal(manager.retireFile(FILE, "opencode")?.action, "skipped");
    assert.ok(fs.existsSync(target()));
  });

  it("keeps a file Sauron never tracked", () => {
    fs.mkdirSync(path.dirname(target()), { recursive: true });
    fs.writeFileSync(target(), "# Unknown\n");
    assert.equal(manager.retireFile(FILE, "opencode")?.action, "skipped");
    assert.ok(fs.existsSync(target()));
  });

  it("changes nothing on a dry run", () => {
    manager.safeWrite(FILE, "# Note", "opencode");
    assert.equal(manager.retireFile(FILE, "opencode", true)?.action, "simulated");
    assert.ok(fs.existsSync(target()));
    assert.ok(tracked());
  });

  it("returns null when the file is already gone", () => {
    assert.equal(manager.retireFile(FILE, "opencode"), null);
  });
});

describe("Scanned folders stay free of README files", () => {
  /** @type {any} */
  const ctx = {
    projectName: "demo",
    version: "0.0.0",
    rules: [],
    fellowship: [],
    antiPatterns: [],
  };

  for (const Adapter of [OpenCodeAdapter, OmpAdapter]) {
    it(`${Adapter.name} retires its old folder READMEs`, () => {
      const adapter = new Adapter();
      const emitted = adapter.transpile(ctx).map((o) => o.relativePath);
      assert.equal(adapter.retiredFiles.length, 3);
      for (const retired of adapter.retiredFiles) {
        assert.match(retired, /\/README\.md$/);
        assert.ok(!emitted.includes(retired), `${retired} must not be emitted`);
      }
    });
  }
});
