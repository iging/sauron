// @ts-check
/**
 * @fileoverview Unit tests for install profiles, runtime support tiers, and the Claude Code plugin.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import {
  INSTALL_PROFILES,
  InitPlanError,
  PRESET_RECOMMENDED,
  RUNTIME_IDS,
  RUNTIME_SUPPORT,
  parseProfile,
  readProfileFlag,
  resolvePlan,
} from "../../dist/adapters/init-plan.js";
import { listDepartments } from "../../dist/adapters/installer.js";
import {
  MARKETPLACE_NAME,
  PLUGIN_NAME,
  buildClaudePlugin,
} from "../../dist/adapters/plugin.js";

const ROOT = path.resolve(".");

describe("Install profiles", () => {
  it("offers five named profiles, with recommended equal to the preset", () => {
    assert.deepEqual(Object.keys(INSTALL_PROFILES), [
      "minimal",
      "recommended",
      "frontend",
      "backend",
      "full",
    ]);
    assert.equal(INSTALL_PROFILES["recommended"], PRESET_RECOMMENDED);
  });

  it("uses only real departments and runtimes", () => {
    const departments = listDepartments(ROOT);
    for (const [name, plan] of Object.entries(INSTALL_PROFILES)) {
      if (Array.isArray(plan.skills)) {
        for (const dept of plan.skills)
          assert.ok(departments.includes(dept), `${name}: ${dept}`);
      }
      for (const id of plan.runtimes)
        assert.ok(RUNTIME_IDS.includes(id), `${name}: ${id}`);
    }
  });

  it("parses the flag and rejects unknown names", () => {
    assert.equal(
      readProfileFlag(["--profile=Frontend"]),
      INSTALL_PROFILES["frontend"],
    );
    assert.equal(readProfileFlag(["--yes"]), undefined);
    assert.throws(() => parseProfile("huge"), InitPlanError);
  });

  it("lets explicit flags override a profile field", () => {
    const plan = resolvePlan({ runtimes: ["cursor"] }, parseProfile("backend"));
    assert.deepEqual(plan.runtimes, ["cursor"]);
    assert.deepEqual(plan.skills, [
      "backend",
      "database",
      "devops",
      "security",
    ]);
    assert.deepEqual(plan.nativeRuntimes, []);
  });
});

describe("Runtime support tiers", () => {
  it("gives every runtime a tier and evidence", () => {
    assert.deepEqual(
      Object.keys(RUNTIME_SUPPORT).sort(),
      [...RUNTIME_IDS].sort(),
    );
    for (const [id, support] of Object.entries(RUNTIME_SUPPORT)) {
      assert.ok(
        ["stable", "beta", "instruction-only"].includes(support.tier),
        id,
      );
      assert.ok(support.evidence.length > 20, id);
    }
  });

  it("keeps runtimes with no official source out of beta and stable", () => {
    for (const id of ["trae", "kimi", "hermes", "openclaw", "adal"]) {
      assert.equal(RUNTIME_SUPPORT[id]?.tier, "instruction-only", id);
    }
  });
});

describe("Claude Code plugin", () => {
  const files = buildClaudePlugin(ROOT, "9.9.9");
  /** @param {string} rel */
  const find = (rel) => files.find((f) => f.relativePath === rel);

  it("writes a manifest and a marketplace that agree on the plugin name", () => {
    const manifest = JSON.parse(
      find(`${PLUGIN_NAME}/.claude-plugin/plugin.json`)?.content ?? "{}",
    );
    const market = JSON.parse(
      find(".claude-plugin/marketplace.json")?.content ?? "{}",
    );
    assert.equal(manifest.name, PLUGIN_NAME);
    assert.equal(manifest.version, "9.9.9");
    assert.equal(market.name, MARKETPLACE_NAME);
    assert.equal(market.plugins[0].name, manifest.name);
    assert.equal(market.plugins[0].source, `./${PLUGIN_NAME}`);
  });

  it("ships agents, commands, skills, and a README at the plugin root", () => {
    const under = (/** @type {string} */ dir) =>
      files.filter((f) => f.relativePath.startsWith(`${PLUGIN_NAME}/${dir}/`))
        .length;
    assert.ok(find(`${PLUGIN_NAME}/agents/gandalf.md`));
    assert.ok(find(`${PLUGIN_NAME}/README.md`));
    assert.ok(under("commands") > 0);
    assert.ok(under("skills") > 0);
    assert.ok(
      files.every(
        (f) =>
          !f.relativePath.startsWith(".claude/") &&
          !f.relativePath.includes("/.claude/"),
      ),
    );
  });

  it("gives every command a description", () => {
    for (const file of files.filter((f) =>
      f.relativePath.startsWith(`${PLUGIN_NAME}/commands/`),
    )) {
      assert.match(
        file.content,
        /^---\r?\n[\s\S]*?description:/,
        file.relativePath,
      );
    }
  });
});
