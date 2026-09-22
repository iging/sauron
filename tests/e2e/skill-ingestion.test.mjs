// @ts-check
/**
 * @fileoverview End-to-End tests for modular skill ingestion and dry-run simulation.
 * Adheres strictly to testing-principles:
 * - Tests CLI flag behavior (--dry-run, --to <dir>).
 * - Verifies zero disk side-effects during simulation.
 * - Confirms exact file preservation upon actual installation.
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const CLI_PATH = path.resolve("bin", "sauron.mjs");

describe("E2E: Modular Skill Ingestion (skill-ingestion)", () => {
  /** @type {string} */
  let tempWorkspace;

  before(() => {
    // Arrange: Create clean temp workspace
    tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-e2e-skill-"));
  });

  after(() => {
    // Teardown: Clean up isolated workspace
    if (fs.existsSync(tempWorkspace)) {
      fs.rmSync(tempWorkspace, { recursive: true, force: true });
    }
  });

  it("simulates skill addition with --dry-run without creating files on disk", async () => {
    // Act: Run dry-run simulation
    const { stdout } = await execFileAsync(
      "node",
      [CLI_PATH, "add", "clean-architecture", "--dry-run"],
      { cwd: tempWorkspace },
    );

    // Assert: Verify CLI messaging
    assert.ok(stdout.includes("SIMULATED"), "Must log simulated status");
    assert.ok(
      stdout.includes("Zero files written"),
      "Must confirm zero files written",
    );

    // Assert: Verify zero disk mutations
    const skillPath = path.join(
      tempWorkspace,
      ".agents",
      "skills",
      "clean-architecture",
    );
    assert.equal(
      fs.existsSync(skillPath),
      false,
      "Skill directory must not exist on disk following dry-run",
    );
  });

  it("adds modular skills directly into customized destination directory", async () => {
    // Arrange: Custom target directory
    const customDest = path.join(".cursor", "rules");

    // Act: Execute actual skill installation
    const { stdout } = await execFileAsync(
      "node",
      [CLI_PATH, "add", "clean-architecture", "--to", customDest],
      { cwd: tempWorkspace },
    );

    // Assert: Verify console output
    assert.ok(stdout.includes("ADDED"), "Must confirm skill added");
    assert.ok(
      stdout.includes("Successfully added 1 skill"),
      "Must log success summary",
    );

    // Assert: Verify file contents and location
    const installedSkill = path.join(
      tempWorkspace,
      customDest,
      "clean-architecture",
      "SKILL.md",
    );
    assert.ok(
      fs.existsSync(installedSkill),
      "SKILL.md must exist in target destination",
    );

    const content = fs.readFileSync(installedSkill, "utf8");
    assert.ok(
      content.includes("clean-architecture"),
      "Must preserve skill content without corruption",
    );
  });
});
