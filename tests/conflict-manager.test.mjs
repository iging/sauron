// @ts-check
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { ConflictManager } from "../dist/adapters/conflict-manager.js";

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

  it("creates file when it does not previously exist", () => {
    const result = manager.safeWrite(
      "CLAUDE.md",
      "New Claude Content",
      "claude",
      false,
    );
    assert.equal(result.action, "created");
    assert.equal(result.backupPath, null);

    const content = fs.readFileSync(
      path.join(tempWorkspace, "CLAUDE.md"),
      "utf8",
    );
    assert.equal(content, "New Claude Content");
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

  it("creates timestamped backup when content differs to prevent destructive overwrite", () => {
    const originalContent = "New Claude Content";
    const conflictingContent = "Updated Claude Content With Sauron Rules";

    const result = manager.safeWrite(
      "CLAUDE.md",
      conflictingContent,
      "claude",
      false,
    );
    assert.equal(result.action, "updated");
    assert.ok(result.backupPath !== null, "Backup path must be defined");

    // Verify backup file exists and contains the original content
    const fullBackupPath = path.join(tempWorkspace, result.backupPath);
    assert.ok(fs.existsSync(fullBackupPath), "Backup file must exist on disk");
    const preservedContent = fs.readFileSync(fullBackupPath, "utf8");
    assert.equal(
      preservedContent,
      originalContent,
      "Original content must be preserved intact in backup",
    );

    // Verify current file contains updated content
    const updatedContent = fs.readFileSync(
      path.join(tempWorkspace, "CLAUDE.md"),
      "utf8",
    );
    assert.equal(updatedContent, conflictingContent);
  });

  it("manifest records state correctly", () => {
    const manifest = manager.loadManifest();
    assert.ok(manifest.managedFiles.length > 0);
    const record = manifest.managedFiles.find((f) => f.path === "CLAUDE.md");
    assert.ok(record !== undefined);
    assert.equal(record.runtime, "claude");
    assert.ok(record.backupPath !== null);
  });
});
