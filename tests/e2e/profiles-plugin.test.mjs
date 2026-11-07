// @ts-check
/**
 * @fileoverview E2E tests for `init --profile`, `status` tiers, and the `plugin` command.
 */

import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const CLI_PATH = path.resolve("bin", "sauron.mjs");

describe("E2E: profiles, tiers, and plugin", () => {
  /** @type {string} */
  let dir;
  /** @param {string} rel */
  const exists = (rel) => fs.existsSync(path.join(dir, rel));
  /** @param {string[]} args */
  const run = (args) =>
    execFileAsync("node", [CLI_PATH, ...args], {
      cwd: dir,
      maxBuffer: 16 * 1024 * 1024,
    });

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-e2e-profile-"));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("init --profile=minimal installs no agents, skills, or commands", async () => {
    await run(["init", "--profile=minimal"]);
    assert.ok(exists("AGENTS.md"));
    assert.ok(exists("CLAUDE.md"));
    assert.equal(exists(".claude/agents/gandalf.md"), false);
    const skillsDir = path.join(dir, ".agents/skills");
    const installed = fs.existsSync(skillsDir)
      ? fs
          .readdirSync(skillsDir, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
      : [];
    assert.deepEqual(installed, []);
    const config = fs.readFileSync(
      path.join(dir, "sauron.config.yaml"),
      "utf8",
    );
    assert.match(config, /agents: none/);
    assert.match(config, /commands: false/);
  });

  it("init rejects an unknown profile", async () => {
    await assert.rejects(
      run(["init", "--profile=huge"]),
      /Unknown profile 'huge'/,
    );
  });

  it("status shows support tiers", async () => {
    const { stdout } = await run(["status"]);
    assert.match(stdout, /\[STABLE\s*\] OpenCode/);
    assert.match(stdout, /\[INSTRUCTION-ONLY\] Trae/);
  });

  it("plugin writes a marketplace and plugin, and refuses paths outside the folder", async () => {
    const { stdout } = await run(["plugin", "--out", "out"]);
    assert.match(stdout, /\/plugin install sauron@sauron-local/);
    assert.ok(exists("out/.claude-plugin/marketplace.json"));
    assert.ok(exists("out/sauron/.claude-plugin/plugin.json"));
    assert.ok(exists("out/sauron/agents/frodo.md"));
    await assert.rejects(
      run(["plugin", "--out", "../x"]),
      /inside the current folder/,
    );
  });
});
