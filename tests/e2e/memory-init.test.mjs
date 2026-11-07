// @ts-check
import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const CLI = path.resolve("bin/sauron.mjs");
/** @type {string} */
let dir;
/** @param {string[]} args */
const run = (args) =>
  exec(process.execPath, [CLI, ...args], {
    cwd: dir,
    maxBuffer: 16 * 1024 * 1024,
  });

describe("sauron memory init", () => {
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-memory-cli-"));
  });
  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("previews without mutation and creates a standalone default vault", async () => {
    assert.match(
      (await run(["memory", "init", "--dry-run"])).stdout,
      /would create 12 notes/,
    );
    assert.deepEqual(fs.readdirSync(dir), []);
    assert.match((await run(["memory", "init"])).stdout, /Created 12 notes/);
    assert.ok(fs.existsSync(path.join(dir, "docs/second-brain/index.md")));
    assert.ok(fs.existsSync(path.join(dir, "docs/second-brain/claude.md")));
    assert.ok(!fs.existsSync(path.join(dir, ".sauron")));
    assert.ok(!fs.existsSync(path.join(dir, "sauron.config.yaml")));
  });

  it("supports custom paths with spaces and keeps existing history on rerun", async () => {
    await run(["memory", "init", "--path", "docs/my project brain"]);
    const file = path.join(dir, "docs/my project brain/log.md");
    fs.appendFileSync(file, "\n## [2026-11-07] session | Keep my history\n");
    const before = fs.readFileSync(file);
    assert.match(
      (await run(["memory", "init", "--path=docs/my project brain"])).stdout,
      /Existing path kept/,
    );
    assert.deepEqual(fs.readFileSync(file), before);
  });

  it("rejects invalid commands and options before creating any files", async () => {
    for (const args of [
      [],
      ["unknown"],
      ["init", "--path"],
      ["init", "--path="],
      ["init", "--force"],
      ["init", "extra"],
      ["init", "--path=one", "--path=two"],
      ["init", "--path=../outside"],
    ]) {
      await assert.rejects(
        run(["memory", ...args]),
        (/** @type {Error & {code?: number}} */ error) => error.code === 1,
      );
      assert.deepEqual(fs.readdirSync(dir), []);
    }
  });

  it("lets concurrent callers reserve one vault without mixing or replacing notes", async () => {
    const results = await Promise.all([
      run(["memory", "init"]),
      run(["memory", "init"]),
    ]);
    assert.equal(
      results.filter((result) => result.stdout.includes("Created 12 notes"))
        .length,
      1,
    );
    assert.equal(
      results.filter((result) => result.stdout.includes("Existing path kept"))
        .length,
      1,
    );
    assert.match(
      fs.readFileSync(path.join(dir, "docs/second-brain/log.md"), "utf8"),
      /Create second brain/,
    );
  });

  it("preserves the vault through normal init, repair, and uninstall", async () => {
    await run(["memory", "init"]);
    const log = path.join(dir, "docs/second-brain/log.md");
    const before = fs.readFileSync(log);
    await run(["init", "--profile=minimal", "--yes"]);
    const manifest = JSON.parse(
      fs.readFileSync(path.join(dir, ".sauron/manifest.json"), "utf8"),
    );
    assert.ok(
      !manifest.managedFiles.some((/** @type {{path: string}} */ file) =>
        file.path.startsWith("docs/second-brain/"),
      ),
    );
    await run(["repair"]);
    await run(["uninstall", "--yes"]);
    assert.deepEqual(fs.readFileSync(log), before);
    assert.ok(fs.existsSync(path.join(dir, "docs/second-brain/claude.md")));
    assert.ok(
      fs.existsSync(path.join(dir, "docs/second-brain/project/status.md")),
    );
  });
});
