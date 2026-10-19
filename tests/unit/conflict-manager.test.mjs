// @ts-check
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { ConflictManager } from "../../dist/adapters/conflict-manager.js";

const START = "<!-- sauron:start (managed by Sauron; edit outside this block) -->";
const END = "<!-- sauron:end -->";

/** @param {string} body */
const block = (body) => `${START}\n${body}\n${END}\n`;

describe("Conflict Manager Zero-Destructive Overwrites (Milestone 6.3)", () => {
  /** @type {string} */
  let tempWorkspace;
  /** @type {ConflictManager} */
  let manager;

  before(() => {
    tempWorkspace = fs.mkdtempSync(
      path.join(os.tmpdir(), "sauron-conflict-test-"),
    );
    manager = new ConflictManager(tempWorkspace);
  });

  after(() => {
    if (fs.existsSync(tempWorkspace)) {
      fs.rmSync(tempWorkspace, { recursive: true, force: true });
    }
  });

  /** @param {string} rel */
  const read = (rel) => fs.readFileSync(path.join(tempWorkspace, rel), "utf8");

  it("creates file when it does not previously exist", () => {
    const result = manager.safeWrite(
      "CLAUDE.md",
      "New Claude Content",
      "claude",
      false,
    );
    assert.equal(result.action, "created");
    assert.equal(result.backupPath, null);
    assert.equal(read("CLAUDE.md"), block("New Claude Content"));
  });

  it("detects identical content and leaves file unchanged without backup", () => {
    const result = manager.safeWrite(
      "CLAUDE.md",
      "New Claude Content",
      "claude",
      false,
    );
    assert.equal(result.action, "unchanged");
    assert.equal(result.backupPath, null);
  });

  it("replaces a file Sauron owns and backs up the previous version", () => {
    const conflictingContent = "Updated Claude Content With Sauron Rules";

    const result = manager.safeWrite(
      "CLAUDE.md",
      conflictingContent,
      "claude",
      false,
    );
    assert.equal(result.action, "updated");
    assert.ok(result.backupPath !== null, "Backup path must be defined");

    const fullBackupPath = path.join(tempWorkspace, result.backupPath);
    assert.ok(fs.existsSync(fullBackupPath), "Backup file must exist on disk");
    assert.equal(
      fs.readFileSync(fullBackupPath, "utf8"),
      block("New Claude Content"),
      "Original content must be preserved intact in backup",
    );
    assert.equal(read("CLAUDE.md"), block(conflictingContent));
  });

  it("manifest records state correctly", () => {
    const manifest = manager.loadManifest();
    assert.ok(manifest.managedFiles.length > 0);
    const record = manifest.managedFiles.find((f) => f.path === "CLAUDE.md");
    assert.ok(record !== undefined);
    assert.equal(record.runtime, "claude");
    assert.ok(record.backupPath !== null);
  });

  it("keeps user text and appends a managed block to a pre-existing user file", () => {
    const rel = "AGENTS.md";
    const userText = "# My Team Rules\n\nUse tabs.\n";
    fs.writeFileSync(path.join(tempWorkspace, rel), userText);

    const first = manager.safeWrite(rel, "Sauron rules v1", "agents-md", false);
    assert.equal(first.action, "merged");
    assert.ok(first.backupPath !== null);
    const merged = read(rel);
    assert.ok(merged.startsWith(userText));
    assert.ok(merged.includes("Sauron rules v1"));

    // User edits outside the block survive a Sauron update.
    fs.writeFileSync(path.join(tempWorkspace, rel), `${merged}\nMore user notes.\n`);
    const second = manager.safeWrite(rel, "Sauron rules v2", "agents-md", false);
    assert.equal(second.action, "merged");
    const updated = read(rel);
    assert.ok(updated.includes("Use tabs.") && updated.includes("More user notes."));
    assert.ok(updated.includes("Sauron rules v2"));
    assert.ok(!updated.includes("Sauron rules v1"));

    // Re-running with the same content is idempotent.
    const third = manager.safeWrite(rel, "Sauron rules v2", "agents-md", false);
    assert.equal(third.action, "unchanged");
  });

  it("keeps frontmatter first when wrapping new content", () => {
    const rel = ".cursor/rules/x.mdc";
    manager.safeWrite(rel, "---\nalwaysApply: true\n---\nBody", "cursor", false);
    assert.equal(read(rel), `---\nalwaysApply: true\n---\n${block("Body")}`);
  });

  it("uses hash-comment markers for TOML files", () => {
    const rel = ".codex/config.toml";
    manager.safeWrite(rel, '# model = "x"', "codex", false);
    assert.ok(read(rel).startsWith("# sauron:start"));
  });

  it("deep-merges JSON so user keys and values win", () => {
    const rel = ".claude/settings.json";
    fs.mkdirSync(path.join(tempWorkspace, ".claude"), { recursive: true });
    fs.writeFileSync(
      path.join(tempWorkspace, rel),
      JSON.stringify({ model: "opus", permissions: { allow: ["Bash(ls)"] } }),
    );
    const result = manager.safeWrite(
      rel,
      JSON.stringify({ $schema: "s", model: "sonnet", permissions: { deny: [] } }),
      "claude",
      false,
    );
    assert.equal(result.action, "merged");
    assert.deepEqual(JSON.parse(read(rel)), {
      $schema: "s",
      model: "opus",
      permissions: { deny: [], allow: ["Bash(ls)"] },
    });
  });

  it("leaves unparseable user JSON untouched", () => {
    const rel = "broken.json";
    fs.writeFileSync(path.join(tempWorkspace, rel), "{ not json");
    const result = manager.safeWrite(rel, "{}", "test", false);
    assert.equal(result.action, "skipped");
    assert.equal(read(rel), "{ not json");
  });
});
