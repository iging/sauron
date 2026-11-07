// @ts-check
/**
 * @fileoverview E2E tests for list-installed, doctor, repair, and uninstall on a real init.
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

describe("E2E: install lifecycle commands", () => {
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

  before(async () => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-e2e-lifecycle-"));
    await run(["init", "--yes", "--skills=none"]);
  });

  after(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("list-installed reports the fresh install as clean", async () => {
    const { stdout } = await run(["list-installed", "--json"]);
    const inspection = JSON.parse(stdout);
    assert.equal(inspection.manifest, "ok");
    assert.ok(inspection.files.length > 0);
    assert.ok(
      inspection.files.some(
        (/** @type {{path: string, state: string}} */ f) =>
          f.path === ".claude/agents/frodo.md" && f.state === "clean",
      ),
    );
  });

  it("doctor finds no errors after init", async () => {
    const { stdout } = await run(["doctor", "--json"]);
    const findings = JSON.parse(stdout);
    assert.equal(
      findings.filter((/** @type {{level: string}} */ f) => f.level === "error")
        .length,
      0,
    );
  });

  it("repair brings back a deleted file", async () => {
    fs.rmSync(path.join(dir, ".claude/agents/frodo.md"));
    const { stdout: report } = await run(["doctor"]);
    assert.match(report, /Missing: \.claude\/agents\/frodo\.md/);
    await run(["repair"]);
    assert.ok(exists(".claude/agents/frodo.md"));
  });

  it("uninstall previews by default and keeps edited files when applied", async () => {
    const { stdout: preview } = await run(["uninstall"]);
    assert.match(preview, /Preview only/);
    assert.ok(exists(".claude/agents/frodo.md"));

    fs.writeFileSync(path.join(dir, ".claude/agents/gimli.md"), "mine\n");
    const { stdout } = await run(["uninstall", "--yes"]);
    assert.match(stdout, /Backups are in \.sauron\/backups/);
    assert.equal(exists(".claude/agents/frodo.md"), false);
    assert.equal(
      fs.readFileSync(path.join(dir, ".claude/agents/gimli.md"), "utf8"),
      "mine\n",
    );
    assert.ok(exists("sauron.config.yaml"));
    assert.ok(exists(".sauron/backups"));
  });
});
