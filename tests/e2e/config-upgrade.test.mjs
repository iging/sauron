// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { stringify } from "yaml";
import { parseConfig } from "../../dist/adapters/config.js";
import { listSkills } from "../../dist/adapters/installer.js";

const ROOT = path.resolve(".");
const CLI = path.join(ROOT, "bin/sauron.mjs");
const runFile = promisify(execFile);
const run = (dir, ...args) => runFile(process.execPath, [CLI, ...args], { cwd: dir, timeout: 15000, maxBuffer: 16 * 1024 * 1024 });
const base = () => ({ version: "2.0.0", project: { name: "demo" }, runtimes: { cursor: true, claude: false }, skills: "none", init: { agents: "none", commands: false, nativeRuntimes: [] }, caveman: { default_mode: "ultra" } });
const legacy = "# User project note\nversion: '1.0.0'\nproject:\n  name: demo\nruntimes:\n  claude: true\n  cursor: true\ninit:\n  runtimes: [cursor]\n  agents: none\n  skills: none\n  commands: false\n";
async function sandbox(test) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-config-e2e-"));
  try { await test(dir); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
function interactive(dir, input, extra = []) {
  return new Promise((resolve, reject) => {
    const child = execFile(process.execPath, [CLI, "init", "--interactive", ...extra], { cwd: dir, timeout: 15000, maxBuffer: 16 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) reject(error); else resolve({ stdout, stderr });
    });
    child.stdin?.end(input);
  });
}

describe("Config v2 CLI", () => {
  it("blocks v1 sync and init before any output, including dry runs", () => sandbox(async (dir) => {
    const file = path.join(dir, "sauron.config.yaml");
    fs.writeFileSync(file, legacy);
    for (const command of ["sync", "init"]) {
      await assert.rejects(run(dir, command, "--dry-run", "--yes"), /Run sauron upgrade/);
      assert.equal(fs.readFileSync(file, "utf8"), legacy);
      assert.deepEqual(fs.readdirSync(dir), ["sauron.config.yaml"]);
    }
  }));

  it("previews, migrates with a byte-exact backup and report, and round-trips config versions", () => sandbox(async (dir) => {
    const file = path.join(dir, "sauron.config.yaml");
    fs.writeFileSync(file, legacy);
    await run(dir, "upgrade", "--dry-run");
    assert.equal(fs.readFileSync(file, "utf8"), legacy);
    assert.ok(!fs.existsSync(path.join(dir, ".sauron")));
    const { stdout } = await run(dir, "upgrade");
    assert.match(stdout, /Backup:/);
    assert.match(stdout, /Report:/);
    const reports = path.join(dir, ".sauron/upgrade-reports");
    const reportNames = fs.readdirSync(reports);
    assert.equal(reportNames.length, 1);
    const report = JSON.parse(fs.readFileSync(path.join(reports, reportNames[0]), "utf8"));
    assert.equal(fs.readFileSync(path.join(dir, report.backup), "utf8"), legacy);
    assert.equal(report.from, "1.0.0");
    assert.equal(report.to, "2.0.0");
    assert.ok(!fs.existsSync(path.join(dir, ".cursor")));
    const upgraded = fs.readFileSync(file, "utf8");
    await run(dir, "upgrade");
    assert.equal(fs.readFileSync(file, "utf8"), upgraded);
    assert.equal(fs.readdirSync(reports).length, 1);
    await run(dir, "sync");
    assert.ok(fs.existsSync(path.join(dir, ".cursor/rules/sauron.mdc")));
    assert.ok(!fs.existsSync(path.join(dir, ".claude")));
    await run(dir, "upgrade", "--to=1");
    assert.equal(parseConfig(fs.readFileSync(file, "utf8")).version, "1.0.0");
    await run(dir, "upgrade", "--to=2");
    assert.equal(parseConfig(fs.readFileSync(file, "utf8")).version, "2.0.0");
  }));

  it("honors runtime edits, supports no enabled runtimes, and previews without mutations", () => sandbox(async (dir) => {
    const file = path.join(dir, "sauron.config.yaml");
    fs.writeFileSync(file, stringify({ ...base(), runtimes: { cursor: false } }));
    const before = fs.readFileSync(file, "utf8");
    await run(dir, "sync", "--dry-run");
    assert.equal(fs.readFileSync(file, "utf8"), before);
    assert.ok(!fs.existsSync(path.join(dir, ".sauron")));
    await run(dir, "sync");
    assert.ok(fs.existsSync(path.join(dir, "AGENTS.md")));
    assert.ok(!fs.existsSync(path.join(dir, ".cursor")));
    assert.ok(!fs.existsSync(path.join(dir, ".claude")));
    const updated = parseConfig(fs.readFileSync(file, "utf8"));
    updated.runtimes = { cursor: true, claude: false };
    fs.writeFileSync(file, stringify(updated));
    await run(dir, "sync");
    assert.ok(fs.existsSync(path.join(dir, ".cursor/rules/sauron.mdc")));
    assert.ok(!fs.existsSync(path.join(dir, ".claude")));
  }));

  it("defaults an interactive rerun to saved choices and preserves settings and comments", () => sandbox(async (dir) => {
    const file = path.join(dir, "sauron.config.yaml");
    const config = { ...base(), security: { protect_credentials: true } };
    fs.writeFileSync(file, stringify(config) + "# User note survives\n");
    const { stdout } = await interactive(dir, "\n\n");
    assert.match(stdout, /Saved/);
    assert.match(stdout, /Setup \[3\]/);
    assert.ok(!fs.existsSync(path.join(dir, ".claude")));
    const after = fs.readFileSync(file, "utf8");
    assert.match(after, /User note survives/);
    assert.deepEqual(parseConfig(after).security, config.security);
    assert.equal(parseConfig(after).caveman.default_mode, "ultra");
    assert.ok(fs.existsSync(path.join(dir, ".cursor/rules/sauron.mdc")));
  }));

  it("uses saved defaults in custom prompts and leaves a declined plan untouched", () => sandbox(async (dir) => {
    const file = path.join(dir, "sauron.config.yaml");
    const original = stringify(base());
    fs.writeFileSync(file, original);
    const { stdout } = await interactive(dir, "2\n\n\n\nn\n");
    assert.match(stdout, /Runtimes.*\[cursor\]/);
    assert.match(stdout, /Skills \[none\]/);
    assert.match(stdout, /Caveman tier \[ultra\]/);
    assert.equal(fs.readFileSync(file, "utf8"), original);
    assert.ok(!fs.existsSync(path.join(dir, ".sauron")));
  }));

  it("installs a saved individual skill selection without unrelated skills", () => sandbox(async (dir) => {
    const file = path.join(dir, "sauron.config.yaml");
    const skill = listSkills(ROOT, ["backend"])[0];
    assert.ok(skill);
    fs.writeFileSync(file, stringify({ ...base(), skills: [`backend/${skill.name}`] }));
    await run(dir, "sync");
    assert.ok(fs.existsSync(path.join(dir, `.agents/skills/${skill.name}/SKILL.md`)));
    assert.ok(!fs.existsSync(path.join(dir, ".agents/skills/caveman")));
  }));

  it("refuses to overwrite a config edited while the confirmation prompt is open", () => sandbox(async (dir) => {
    const file = path.join(dir, "sauron.config.yaml");
    const original = stringify(base());
    fs.writeFileSync(file, original);
    const changed = original + "# External edit while prompting\n";
    let edited = false;
    const result = await new Promise((resolve) => {
      const child = execFile(process.execPath, [CLI, "init", "--interactive"], { cwd: dir, timeout: 15000, maxBuffer: 16 * 1024 * 1024 }, (error, stdout, stderr) => resolve({ error, stdout, stderr }));
      let output = "";
      child.stdout?.on("data", (data) => {
        output += data.toString();
        if (!edited && output.includes("Write these files")) {
          edited = true;
          fs.writeFileSync(file, changed);
          child.stdin?.end("y\n");
        }
      });
      child.stdin?.write("\n");
    });
    assert.equal(edited, true);
    assert.ok(result.error);
    assert.match(result.stderr, /File changes after it is read/);
    assert.equal(fs.readFileSync(file, "utf8"), changed);
    assert.ok(!fs.existsSync(path.join(dir, ".sauron")));
    assert.ok(!fs.existsSync(path.join(dir, ".cursor")));
  }));

  it("fails closed for invalid YAML, invalid flags, unknown config keys, and unknown skills", () => sandbox(async (dir) => {
    const file = path.join(dir, "sauron.config.yaml");
    for (const raw of ["[", stringify({ ...base(), runtimes: { bogus: true } }), stringify({ ...base(), skills: ["backend/not-real"] }), stringify({ ...base(), extra: true })]) {
      fs.writeFileSync(file, raw);
      await assert.rejects(run(dir, "sync"));
      await assert.rejects(run(dir, "upgrade"));
      assert.equal(fs.readFileSync(file, "utf8"), raw);
      assert.ok(!fs.existsSync(path.join(dir, ".sauron")));
    }
    fs.writeFileSync(file, legacy);
    await assert.rejects(run(dir, "upgrade", "--to=9"), /Use upgrade/);
    assert.equal(fs.readFileSync(file, "utf8"), legacy);
    assert.ok(!fs.existsSync(path.join(dir, ".sauron")));
  }));
});
