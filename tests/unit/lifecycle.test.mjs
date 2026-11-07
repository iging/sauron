// @ts-check
/**
 * @fileoverview Unit tests for install inspection, doctor findings, and the uninstall plan.
 */

import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { ConflictManager } from "../../dist/adapters/conflict-manager.js";
import {
  applyUninstall,
  compareVersions,
  doctorFindings,
  inspectInstall,
  isInsideWorkspace,
  planUninstall,
} from "../../dist/adapters/lifecycle.js";

describe("Install lifecycle", () => {
  /** @type {string} */
  let dir;
  /** @param {string} rel */
  const read = (rel) => fs.readFileSync(path.join(dir, rel), "utf8");
  /** @param {string} rel @param {string} text */
  const write = (rel, text) => {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text);
  };
  /** @param {string} rel */
  const exists = (rel) => fs.existsSync(path.join(dir, rel));

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-lifecycle-"));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  /** Installs one owned file, one edited file, one merged file, and one missing file. */
  const installSample = () => {
    const manager = new ConflictManager(dir);
    manager.safeWrite(".claude/agents/frodo.md", "# Frodo\n", "claude", false, {
      raw: true,
    });
    manager.safeWrite(".claude/agents/gimli.md", "# Gimli\n", "claude", false, {
      raw: true,
    });
    write(".claude/agents/gimli.md", "# Gimli, edited by me\n");
    write("CLAUDE.md", "# My notes\n");
    manager.safeWrite("CLAUDE.md", "Sauron rules", "claude");
    manager.safeWrite(".claude/commands/gone.md", "x\n", "claude", false, {
      raw: true,
    });
    fs.rmSync(path.join(dir, ".claude/commands/gone.md"));
  };

  it("reports each file state from the manifest", () => {
    installSample();
    const states = Object.fromEntries(
      inspectInstall(dir).files.map((f) => [f.path, f.state]),
    );
    assert.deepEqual(states, {
      ".claude/agents/frodo.md": "clean",
      ".claude/agents/gimli.md": "edited",
      ".claude/commands/gone.md": "missing",
      "CLAUDE.md": "merged",
    });
  });

  it("tells a missing manifest apart from a damaged one", () => {
    assert.equal(inspectInstall(dir).manifest, "missing");
    write(".sauron/manifest.json", "{ not json");
    assert.equal(inspectInstall(dir).manifest, "invalid");
  });

  it("marks paths outside the workspace unsafe and never plans to touch them", () => {
    write(
      ".sauron/manifest.json",
      JSON.stringify({
        installedAt: "x",
        version: "1.0.0",
        managedFiles: [
          {
            path: "../outside.md",
            runtime: "claude",
            backupPath: null,
            checksum: "sha256:0",
            lastUpdated: "x",
          },
        ],
      }),
    );
    const inspection = inspectInstall(dir);
    assert.equal(inspection.files[0]?.state, "unsafe");
    assert.equal(planUninstall(inspection)[0]?.action, "keep-unsafe");
    assert.equal(isInsideWorkspace(dir, "../outside.md"), false);
    assert.equal(isInsideWorkspace(dir, ".claude/a.md"), true);
  });

  it("doctor flags old Node, config v1, and missing files", () => {
    installSample();
    const findings = doctorFindings(inspectInstall(dir), {
      nodeVersion: "18.20.0",
      configVersion: "1.0.0",
    });
    assert.equal(findings[0]?.level, "error");
    assert.match(findings[0]?.message ?? "", /Node 18\.20\.0/);
    assert.ok(findings.some((f) => /sauron upgrade/.test(f.message)));
    assert.ok(
      findings.some((f) =>
        /Missing: \.claude\/commands\/gone\.md/.test(f.message),
      ),
    );
    assert.ok(
      findings.some((f) => f.level === "info" && /1 file/.test(f.message)),
    );
  });

  it("doctor is quiet on a healthy install", () => {
    new ConflictManager(dir).safeWrite("AGENTS.md", "core", "agents-md");
    assert.deepEqual(
      doctorFindings(inspectInstall(dir), {
        nodeVersion: "20.12.0",
        configVersion: "2.0.0",
      }),
      [],
    );
  });

  it("uninstall preview changes nothing", () => {
    installSample();
    const before = read(".sauron/manifest.json");
    applyUninstall(dir, planUninstall(inspectInstall(dir)), true);
    assert.ok(exists(".claude/agents/frodo.md"));
    assert.equal(read(".sauron/manifest.json"), before);
  });

  it("uninstall removes owned files, strips blocks, and keeps edits and config", () => {
    installSample();
    new ConflictManager(dir).safeWrite(
      "sauron.config.yaml",
      "version: 2.0.0\n",
      "config",
      false,
      { raw: true },
    );
    const plan = planUninstall(inspectInstall(dir));
    assert.deepEqual(Object.fromEntries(plan.map((s) => [s.path, s.action])), {
      ".claude/agents/frodo.md": "remove",
      ".claude/agents/gimli.md": "keep-edited",
      ".claude/commands/gone.md": "forget",
      "CLAUDE.md": "strip-block",
      "sauron.config.yaml": "keep-protected",
    });

    const { removedDirs } = applyUninstall(dir, plan, false);
    assert.equal(exists(".claude/agents/frodo.md"), false);
    assert.equal(read(".claude/agents/gimli.md"), "# Gimli, edited by me\n");
    assert.equal(read("CLAUDE.md"), "# My notes\n");
    assert.ok(exists("sauron.config.yaml"));
    assert.ok(removedDirs.includes(path.join(".claude", "commands")) === false);
    assert.ok(fs.readdirSync(path.join(dir, ".sauron", "backups")).length >= 2);

    const left = inspectInstall(dir)
      .files.map((f) => f.path)
      .sort();
    assert.deepEqual(left, [".claude/agents/gimli.md", "sauron.config.yaml"]);
  });

  it("uninstall removes folders it emptied", () => {
    new ConflictManager(dir).safeWrite(
      ".omp/agents/frodo.md",
      "x\n",
      "omp",
      false,
      { raw: true },
    );
    const { removedDirs } = applyUninstall(
      dir,
      planUninstall(inspectInstall(dir)),
      false,
    );
    assert.deepEqual(removedDirs, [path.join(".omp", "agents"), ".omp"]);
    assert.equal(exists(".omp"), false);
  });

  it("uninstall keeps a file changed after planning", () => {
    new ConflictManager(dir).safeWrite(
      ".claude/agents/a.md",
      "x\n",
      "claude",
      false,
      {
        raw: true,
      },
    );
    const plan = planUninstall(inspectInstall(dir));
    write(".claude/agents/a.md", "changed\n");
    const { outcomes } = applyUninstall(dir, plan, false);
    assert.equal(outcomes[0]?.result, "skipped");
    assert.equal(read(".claude/agents/a.md"), "changed\n");
  });

  it("compares versions numerically", () => {
    assert.ok(compareVersions("20.12.0", "20.9.9") > 0);
    assert.ok(compareVersions("v18.20.4", "20.12.0") < 0);
    assert.equal(compareVersions("22.0", "22.0.0"), 0);
  });
});
