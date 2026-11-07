// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { stringify } from "yaml";
import { ConfigError, parseConfig, configPlan, configWithPlan, migrateConfig } from "../../dist/adapters/config.js";
import { ConflictManager } from "../../dist/adapters/conflict-manager.js";
import { listSkills, listDepartments, buildInstallOutputs } from "../../dist/adapters/installer.js";
import { resolvePlan } from "../../dist/adapters/init-plan.js";

const ROOT = path.resolve(".");
const base = () => ({ version: "2.0.0", project: { name: "demo" }, runtimes: { cursor: true, claude: false }, skills: "none", init: { agents: "none", commands: false, nativeRuntimes: [] } });
const legacy = `# Keep this project note\nversion: "1.0.0"\nproject:\n  name: demo # Keep this name note\nruntimes:\n  claude: true\n  cursor: true\n  omp: true\ninit:\n  runtimes: [cursor, omp]\n  agents: none\n  skills: [workflow]\n  commands: false\n  nativeRuntimes: []\ncaveman:\n  default_mode: ultra\nsecurity:\n  protect_credentials: true # Keep this security note\n`;

describe("Config v2", () => {
  it("keeps both schema copies identical and accepts both v2 templates", () => {
    assert.equal(fs.readFileSync("schema/sauron.schema.json", "utf8"), fs.readFileSync("config/schema/sauron.schema.json", "utf8"));
    for (const file of ["sauron.config.yaml", "config/sauron.config.yaml"]) {
      const plan = configPlan(parseConfig(fs.readFileSync(file, "utf8")), ROOT);
      assert.deepEqual(plan.runtimes, ["claude"]);
      assert.equal(plan.skills, "all");
    }
  });

  it("uses top-level toggles and permits a shared-core-only plan", () => {
    assert.deepEqual(configPlan(base(), ROOT).runtimes, ["cursor"]);
    assert.deepEqual(configPlan({ ...base(), runtimes: { cursor: false } }, ROOT).runtimes, []);
  });

  it("validates and installs mixed department and individual selections without duplicates", () => {
    const catalog = listSkills(ROOT, listDepartments(ROOT));
    const backend = catalog.find((skill) => skill.department === "backend");
    assert.ok(backend);
    const plan = configPlan({ ...base(), skills: ["workflow", `backend/${backend.name}`] }, ROOT);
    const outputs = buildInstallOutputs(ROOT, plan);
    assert.ok(outputs.some((file) => file.relativePath === `.agents/skills/${backend.name}/SKILL.md`));
    assert.ok(outputs.some((file) => file.relativePath === ".agents/skills/caveman/SKILL.md"));
    const other = catalog.find((skill) => skill.department === "backend" && skill.name !== backend.name);
    assert.ok(other);
    assert.ok(!outputs.some((file) => file.relativePath.startsWith(`.agents/skills/${other.name}/`)));
    const overlap = buildInstallOutputs(ROOT, configPlan({ ...base(), skills: ["backend", `backend/${backend.name}`] }, ROOT));
    assert.equal(overlap.filter((file) => file.relativePath === `.agents/skills/${backend.name}/SKILL.md`).length, 1);
  });

  it("rejects malformed YAML, duplicate keys, unknown tags, and non-mapping input", () => {
    for (const raw of ["runtimes: [", "version: 2\nversion: 2", "[]", "!!not-a-supported-tag value"]) {
      assert.throws(() => parseConfig(raw), ConfigError);
    }
  });

  it("rejects unknown fields, wrong types, old choice locations, and unknown skill names", () => {
    for (const config of [
      { ...base(), version: "9.0.0" }, { ...base(), extra: true },
      { ...base(), runtimes: { unknown: true } }, { ...base(), runtimes: { cursor: "false" } },
      { ...base(), skills: ["backend/no-such-skill"] }, { ...base(), skills: ["../workflow"] },
      { ...base(), skills: ["all"] }, { ...base(), skills: [] },
      { ...base(), skills: ["workflow", "workflow"] },
      { ...base(), init: { runtimes: ["claude"] } }, { ...base(), init: { skills: "all" } },
      { ...base(), init: { commands: "false" } }, { ...base(), security: { protect_credentials: "false" } },
    ]) assert.throws(() => configPlan(config, ROOT));
  });

  it("preserves comments and settings while saving a new plan", () => {
    const raw = stringify({ ...base(), security: { protect_credentials: true } }) + "# Keep my trailing note\n";
    const updated = configWithPlan(raw, resolvePlan({ runtimes: ["omp"], agents: "none", skills: ["workflow"], commands: false, caveman: "lite", nativeRuntimes: [] }));
    assert.match(updated, /Keep my trailing note/);
    const data = parseConfig(updated);
    assert.deepEqual(data.security, { protect_credentials: true });
    const plan = configPlan(data, ROOT);
    assert.deepEqual(plan.runtimes, ["omp"]);
    assert.deepEqual(plan.nativeRuntimes, []);
    assert.equal(plan.caveman, "lite");
  });
});

describe("Config migration", () => {
  it("round-trips a saved v1 plan through v2 and preserves unrelated values and comments", () => {
    const forward = migrateConfig(legacy, ROOT, "workspace");
    const v2 = configPlan(parseConfig(forward.content), ROOT);
    assert.deepEqual(v2.runtimes, ["cursor", "omp"]);
    assert.deepEqual(v2.skills, ["workflow"]);
    assert.equal(v2.commands, false);
    assert.equal(v2.caveman, "ultra");
    assert.deepEqual(v2.nativeRuntimes, []);
    for (const note of ["Keep this project note", "Keep this name note", "Keep this security note"]) assert.ok(forward.content.includes(note));
    const again = migrateConfig(forward.content, ROOT, "workspace");
    assert.equal(again.changed, false);
    assert.equal(again.content, forward.content);
    const backward = migrateConfig(forward.content, ROOT, "workspace", "1.0.0");
    const old = parseConfig(backward.content);
    assert.equal(old.version, "1.0.0");
    assert.equal(old.skills, undefined);
    assert.deepEqual(old.init, { runtimes: ["cursor", "omp"], agents: "none", skills: ["workflow"], commands: false, nativeRuntimes: [] });
    assert.deepEqual(configPlan(parseConfig(migrateConfig(backward.content, ROOT, "workspace").content), ROOT), v2);
  });

  it("keeps legacy native-runtime opt-in and does not add assets without saved init choices", () => {
    const pre32 = "init:\n  runtimes: [opencode, omp]\n  skills: none\n  agents: fellowship\n  commands: true\n";
    assert.deepEqual(configPlan(parseConfig(migrateConfig(pre32, ROOT, "demo").content), ROOT).nativeRuntimes, []);
    const unsaved = "version: '1.0.0'\nproject:\n  name: demo\nruntimes:\n  cursor: true\n  claude: false\n";
    const plan = configPlan(parseConfig(migrateConfig(unsaved, ROOT, "demo").content), ROOT);
    assert.deepEqual(plan.runtimes, ["cursor"]);
    assert.equal(plan.skills, "none");
    assert.equal(plan.agents, "none");
    assert.equal(plan.commands, false);
  });

  it("rejects lossy downgrades and invalid legacy settings", () => {
    assert.throws(() => migrateConfig(stringify({ ...base(), runtimes: {} }), ROOT, "demo", "1.0.0"), /empty runtime list/);
    assert.throws(() => configWithPlan(stringify(base()), resolvePlan({ runtimes: ["bogus"] })), /unknown runtime ids/);
    const skill = listSkills(ROOT, ["backend"])[0];
    assert.ok(skill);
    assert.throws(() => migrateConfig(stringify({ ...base(), skills: [`backend/${skill.name}`] }), ROOT, "demo", "1.0.0"), /cannot represent individual skills/);
    for (const value of ["init:\n  commands: maybe\n", "init:\n  nativeRuntimes: [bogus]\n", "runtimes:\n  cursor: 'yes'\n"]) {
      assert.throws(() => migrateConfig(value, ROOT, "demo"));
    }
  });

  it("preserves CRLF during migration", () => {
    const migration = migrateConfig(legacy.replace(/\n/g, "\r\n"), ROOT, "demo");
    assert.ok(!/(?<!\r)\n/.test(migration.content));
  });
});

describe("Checked configuration replacement", () => {
  it("backs an intentional user config rewrite and rejects a stale snapshot", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-config-write-"));
    try {
      const file = path.join(dir, "sauron.config.yaml");
      fs.writeFileSync(file, legacy);
      const manager = new ConflictManager(dir);
      const expectedChecksum = manager.computeChecksum(legacy);
      const migrated = migrateConfig(legacy, ROOT, "demo").content;
      manager.safeWrite("sauron.config.yaml", migrated, "config", true, { raw: true, expectedChecksum });
      assert.equal(fs.readFileSync(file, "utf8"), legacy);
      assert.ok(!fs.existsSync(path.join(dir, ".sauron")));
      const result = manager.safeWrite("sauron.config.yaml", migrated, "config", false, { raw: true, expectedChecksum });
      assert.equal(result.action, "updated");
      assert.ok(result.backupPath);
      assert.equal(fs.readFileSync(path.join(dir, result.backupPath), "utf8"), legacy);
      assert.throws(() => manager.safeWrite("sauron.config.yaml", "replacement", "config", false, { raw: true, expectedChecksum }), /changes after/);
      assert.equal(fs.readFileSync(file, "utf8"), migrated);
      assert.throws(() => manager.safeWrite("missing.yaml", "replacement", "config", false, { raw: true, expectedChecksum }), /no longer exists/);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
});
