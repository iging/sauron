// @ts-check
import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  buildMemoryVault,
  initMemory,
  DEFAULT_MEMORY_PATH,
} from "../../dist/adapters/memory.js";
import { ConflictManager } from "../../dist/adapters/conflict-manager.js";

describe("Memory starter content", () => {
  it("provides a small, fully linked startup set and a parseable initial log", () => {
    const files = buildMemoryVault("2026-11-07");
    assert.equal(files.length, 12);
    const names = new Set(
      files.map((file) => path.basename(file.relativePath, ".md")),
    );
    assert.equal(names.size, files.length);
    for (const file of files) {
      assert.ok(file.content.endsWith("\n"));
      assert.ok(file.content.split("\n").length < 80, file.relativePath);
      assert.doesNotMatch(file.content, /\r/);
      for (const match of file.content.matchAll(/\[\[([^\]]+)\]\]/g))
        assert.ok(names.has(match[1]), match[1]);
    }
    const content = (/** @type {string} */ file) =>
      files.find((entry) => entry.relativePath === file)?.content ?? "";
    assert.match(
      content("claude.md"),
      /Read \[\[index\]\], then \[\[resume-brief\]\]/,
    );
    assert.match(
      content("log.md"),
      /^## \[2026-11-07\] init \| Create second brain$/m,
    );
    assert.match(content("log.md"), /Never rewrite old entries/);
    assert.match(content("project/status.md"), /not verified yet/);
  });

  it("rejects malformed and impossible dates before building note names", () => {
    for (const date of [
      "2026-02-30",
      "2026-13-01",
      "../escape",
      "bad",
      "2026-1-1",
    ])
      assert.throws(() => buildMemoryVault(date), /real YYYY-MM-DD/);
    assert.ok(
      buildMemoryVault("2024-02-29").some((file) =>
        file.relativePath.includes("2024-02-29"),
      ),
    );
  });
});

describe("Create-only memory storage", () => {
  /** @type {string} */
  let dir;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-memory-"));
  });
  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("creates all notes as user knowledge without touching an install manifest or config", () => {
    const result = initMemory(dir);
    assert.equal(result.action, "created");
    assert.equal(result.directory, DEFAULT_MEMORY_PATH);
    for (const file of result.files)
      assert.equal(
        fs.readFileSync(
          path.join(dir, result.directory, file.relativePath),
          "utf8",
        ),
        file.content,
      );
    assert.deepEqual(fs.readdirSync(dir), ["docs"]);
  });

  it("keeps edited, missing, and additional notes intact on rerun", () => {
    initMemory(dir);
    const root = path.join(dir, DEFAULT_MEMORY_PATH);
    fs.appendFileSync(path.join(root, "log.md"), "\nUser history.\n");
    fs.rmSync(path.join(root, "project/status.md"));
    fs.writeFileSync(path.join(root, "mine.md"), "My own note.\n");
    const log = fs.readFileSync(path.join(root, "log.md"));
    assert.equal(initMemory(dir).action, "skipped");
    assert.deepEqual(fs.readFileSync(path.join(root, "log.md")), log);
    assert.equal(
      fs.readFileSync(path.join(root, "mine.md"), "utf8"),
      "My own note.\n",
    );
    assert.ok(!fs.existsSync(path.join(root, "project/status.md")));
  });

  it("keeps existing empty directories and files, and dry-run creates no parents", () => {
    assert.equal(initMemory(dir, "notes/vault", true).action, "simulated");
    assert.deepEqual(fs.readdirSync(dir), []);
    fs.mkdirSync(path.join(dir, "empty"));
    fs.writeFileSync(path.join(dir, "file"), "Mine");
    assert.equal(initMemory(dir, "empty").action, "skipped");
    assert.deepEqual(fs.readdirSync(path.join(dir, "empty")), []);
    assert.equal(initMemory(dir, "file").action, "skipped");
    assert.equal(fs.readFileSync(path.join(dir, "file"), "utf8"), "Mine");
  });

  it("ignores even a malformed existing install manifest without changing it", () => {
    fs.mkdirSync(path.join(dir, ".sauron"));
    fs.writeFileSync(
      path.join(dir, ".sauron/manifest.json"),
      "User bytes, not JSON",
    );
    assert.equal(initMemory(dir, "knowledge").action, "created");
    assert.equal(
      fs.readFileSync(path.join(dir, ".sauron/manifest.json"), "utf8"),
      "User bytes, not JSON",
    );
  });

  it("rejects outside, root, protected, and aliased protected destinations without mutations", () => {
    for (const value of [
      "../outside",
      ".",
      "/tmp/brain",
      "C:\\brain",
      "docs/../../outside",
      ".git/brain",
      ".git./brain",
      ".sauron/memory",
      ".vscode/brain",
      "docs/.CODEX/brain",
      ".agents/brain",
      "node_modules/brain",
    ])
      assert.throws(() => initMemory(dir, value));
    assert.deepEqual(fs.readdirSync(dir), []);
  });

  it("refuses symlink parents and symlink destinations", () => {
    const outside = fs.mkdtempSync(
      path.join(os.tmpdir(), "sauron-memory-link-"),
    );
    try {
      fs.symlinkSync(
        outside,
        path.join(dir, "linked"),
        process.platform === "win32" ? "junction" : "dir",
      );
      assert.throws(() => initMemory(dir, "linked/brain"), /real directory/);
      assert.throws(() => initMemory(dir, "linked"), /symbolic link/);
      assert.deepEqual(fs.readdirSync(outside), []);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  it("validates every tree path and file/directory collision before reserving a folder", () => {
    const manager = new ConflictManager(dir);
    for (const files of [
      [{ relativePath: "../escape", content: "x" }],
      [
        { relativePath: "a", content: "x" },
        { relativePath: "a", content: "y" },
      ],
      [
        { relativePath: "a", content: "x" },
        { relativePath: "a/b", content: "y" },
      ],
    ])
      assert.throws(() => manager.createOnlyTree("vault", files));
    assert.deepEqual(fs.readdirSync(dir), []);
  });
});
