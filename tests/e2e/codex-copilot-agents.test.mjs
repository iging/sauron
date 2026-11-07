// @ts-check
import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const exec = promisify(execFile);
const CLI = path.resolve("bin/sauron.mjs");
const flags = ["--yes", "--runtimes=codex,copilot", "--skills=none"];
/** @type {string} */
let dir;
/** @param {string[]} args */
const run = (args) =>
  exec(process.execPath, [CLI, ...args], {
    cwd: dir,
    maxBuffer: 16 * 1024 * 1024,
  });
/** @param {string} relative */
const read = (relative) => fs.readFileSync(path.join(dir, relative), "utf8");
/** @param {string} relative */
const exists = (relative) => fs.existsSync(path.join(dir, relative));

describe("Codex and Copilot agent lifecycle", () => {
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-new-native-"));
  });
  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("previews both targets without writing anything", async () => {
    const { stdout } = await run(["init", ...flags, "--dry-run"]);
    assert.match(stdout, /9 into \.codex\/agents\/, 9 into \.github\/agents\//);
    assert.match(stdout, /Commands\s+: none/);
    assert.deepEqual(fs.readdirSync(dir), []);
  });

  it("installs and tracks native agents, preserves edits, repairs missing files, and uninstalls safely", async () => {
    await run(["init", ...flags]);
    for (const [folder, suffix] of [
      [".codex/agents", ".toml"],
      [".github/agents", ".agent.md"],
    ]) {
      assert.equal(
        fs
          .readdirSync(path.join(dir, folder))
          .filter((file) => file.endsWith(suffix)).length,
        9,
      );
    }
    assert.deepEqual(
      parseYaml(read("sauron.config.yaml")).init.nativeRuntimes,
      ["codex", "copilot"],
    );
    /** @type {{managedFiles: {path: string}[]}} */
    const manifest = JSON.parse(read(".sauron/manifest.json"));
    for (const file of [
      ".codex/agents/gandalf.toml",
      ".github/agents/gandalf.agent.md",
    ]) {
      assert.ok(manifest.managedFiles.some((record) => record.path === file));
    }
    const edited = [
      ".codex/agents/gandalf.toml",
      ".github/agents/gandalf.agent.md",
    ];
    fs.appendFileSync(path.join(dir, edited[0]), "\n# User setting\n");
    fs.appendFileSync(path.join(dir, edited[1]), "\nUser instruction.\n");
    const snapshots = edited.map(read);
    await run(["sync"]);
    assert.deepEqual(edited.map(read), snapshots);
    const missing = ".codex/agents/frodo.toml";
    fs.rmSync(path.join(dir, missing));
    await run(["repair", "--yes"]);
    assert.ok(exists(missing));
    assert.deepEqual(edited.map(read), snapshots);
    await run(["uninstall", "--yes"]);
    assert.deepEqual(edited.map(read), snapshots);
    assert.ok(!exists(missing));
    assert.ok(!exists(".github/agents/frodo.agent.md"));
  });

  it("keeps custom agents byte-exact and preserves Codex parent policy", async () => {
    fs.mkdirSync(path.join(dir, ".codex/agents"), { recursive: true });
    fs.mkdirSync(path.join(dir, ".github/agents"), { recursive: true });
    const original = {
      ".codex/config.toml": '# Parent policy\napproval_policy = "untrusted"\n',
      ".codex/agents/gandalf.toml":
        'name = "gandalf"\ndescription = "Mine"\ndeveloper_instructions = "Keep me"\n',
      ".github/agents/gandalf.agent.md":
        "---\ndescription: Mine\ntools: [read]\n---\nKeep me.\n",
    };
    for (const [file, content] of Object.entries(original))
      fs.writeFileSync(path.join(dir, file), content);
    await run(["init", ...flags]);
    for (const [file, content] of Object.entries(original)) {
      if (file === ".codex/config.toml")
        assert.ok(read(file).startsWith(content));
      else assert.equal(read(file), content);
    }
    assert.deepEqual(
      read(".codex/config.toml")
        .split("\n")
        .filter((line) => line && !line.startsWith("#")),
      ['approval_policy = "untrusted"'],
    );
  });

  it("sync keeps a saved empty native list, then explicit init opts in", async () => {
    await run(["init", ...flags, "--agents=none"]);
    const file = path.join(dir, "sauron.config.yaml");
    fs.writeFileSync(
      file,
      read("sauron.config.yaml")
        .replace("agents: none", "agents: fellowship")
        .replace(
          /nativeRuntimes:\s*\n\s*- codex\s*\n\s*- copilot/,
          "nativeRuntimes: []",
        ),
    );
    assert.deepEqual(
      parseYaml(read("sauron.config.yaml")).init.nativeRuntimes,
      [],
    );
    await run(["sync"]);
    assert.ok(!exists(".codex/agents/gandalf.toml"));
    assert.ok(!exists(".github/agents/gandalf.agent.md"));
    await run(["init", ...flags]);
    assert.ok(exists(".codex/agents/gandalf.toml"));
    assert.ok(exists(".github/agents/gandalf.agent.md"));
  });
});
