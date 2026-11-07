// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { buildInstallOutputs } from "../../dist/adapters/installer.js";
import {
  codexAccessLines,
  copilotAccessLines,
  DEFAULT_MODELS,
  modelsFromConfig,
  readAgentAccess,
} from "../../dist/adapters/agent-access.js";
import { planFromConfig, resolvePlan } from "../../dist/adapters/init-plan.js";

const ROOT = path.resolve(".");
/** @param {string} content */
const frontmatter = (content) =>
  parseYaml(/^---\n([\s\S]*?)\n---/.exec(content)?.[1] ?? "");
/** @param {string} content @param {string} key */
const scalar = (content, key) =>
  JSON.parse(
    content
      .split("\n")
      .find((line) => line.startsWith(key + " = "))
      ?.slice(key.length + 3) ?? '""',
  );

describe("Codex and Copilot native agents", () => {
  it("installs each requested set with the native suffix and no command files", () => {
    for (const [agents, expected] of [
      ["fellowship", 9],
      ["core", 69],
      ["both", 78],
      ["none", 0],
    ]) {
      const plan = resolvePlan({
        runtimes: ["codex", "copilot"],
        agents:
          /** @type {import('../../dist/adapters/init-plan.js').AgentSet} */ (
            agents
          ),
        skills: "none",
      });
      const outputs = buildInstallOutputs(ROOT, plan);
      assert.equal(outputs.length, Number(expected) * 2);
      assert.equal(
        new Set(outputs.map((file) => file.relativePath)).size,
        outputs.length,
      );
      assert.ok(outputs.every((file) => file.raw));
      assert.equal(
        outputs.filter((file) =>
          /^\.codex\/agents\/[\w-]+\.toml$/.test(file.relativePath),
        ).length,
        expected,
      );
      assert.equal(
        outputs.filter((file) =>
          /^\.github\/agents\/[\w-]+\.agent\.md$/.test(file.relativePath),
        ).length,
        expected,
      );
      assert.deepEqual(
        buildInstallOutputs(ROOT, { ...plan, commands: false }),
        outputs,
      );
    }
  });

  it("renders model overrides, instructions, and only documented fields", () => {
    const models = modelsFromConfig({
      agents: {
        models: {
          codex: { deep: "custom-codex", fast: "small-codex" },
          copilot: { deep: "custom-copilot", fast: "small-copilot" },
        },
      },
    });
    const outputs = buildInstallOutputs(
      ROOT,
      resolvePlan({ runtimes: ["codex", "copilot"], skills: "none" }),
      {
        commands: { "git-read": ["git status"], "git-write": ["git commit"] },
        models,
      },
    );
    const codex =
      outputs.find((file) => file.relativePath === ".codex/agents/gandalf.toml")
        ?.content ?? "";
    assert.equal(scalar(codex, "name"), "gandalf");
    assert.equal(scalar(codex, "model"), "custom-codex");
    assert.match(scalar(codex, "description"), /Master Planner/);
    assert.match(
      scalar(codex, "developer_instructions"),
      /## Access\n\n- Toolset: planner/,
    );
    assert.match(scalar(codex, "developer_instructions"), /git status/);
    assert.doesNotMatch(
      codex,
      /^(sandbox_mode|approval_policy|tools|permissions|model_provider|mcp_servers)\s*[=:]/m,
    );
    const copilot = frontmatter(
      outputs.find(
        (file) => file.relativePath === ".github/agents/boromir.agent.md",
      )?.content ?? "",
    );
    assert.deepEqual(copilot.tools, ["read", "search", "execute"]);
    assert.equal(copilot.model, "custom-copilot");
    const samwise =
      outputs.find(
        (file) => file.relativePath === ".github/agents/samwise.agent.md",
      )?.content ?? "";
    assert.equal(frontmatter(samwise).model, "small-copilot");
    assert.match(samwise, /Never push, force push, or delete branches/);
  });

  it("restricts Copilot reviewer tools and disables Codex shell only for no-shell specs", () => {
    const reviewer = readAgentAccess({}, "reviewer");
    assert.deepEqual(copilotAccessLines(reviewer, DEFAULT_MODELS), [
      'tools: ["read","search"]',
    ]);
    assert.deepEqual(codexAccessLines(reviewer, DEFAULT_MODELS), [
      "features.shell_tool = false",
    ]);
    const builder = readAgentAccess(
      { toolset: "builder", shell: ["test"] },
      "builder",
    );
    assert.deepEqual(copilotAccessLines(builder, DEFAULT_MODELS), [
      'tools: ["read","search","edit","execute"]',
    ]);
    assert.deepEqual(codexAccessLines(builder, DEFAULT_MODELS), []);
  });

  it("keeps both config schemas aligned with native runtime and model choices", () => {
    const primary = JSON.parse(
      fs.readFileSync(path.join(ROOT, "schema/sauron.schema.json"), "utf8"),
    );
    const bundled = JSON.parse(
      fs.readFileSync(
        path.join(ROOT, "config/schema/sauron.schema.json"),
        "utf8",
      ),
    );
    assert.deepEqual(primary, bundled);
    for (const runtime of ["codex", "copilot"]) {
      assert.ok(
        primary.properties.init.properties.nativeRuntimes.items.enum.includes(
          runtime,
        ),
      );
      assert.deepEqual(
        Object.keys(
          primary.properties.agents.properties.models.properties[runtime]
            .properties,
        ),
        ["fast", "balanced", "deep"],
      );
    }
  });

  it("keeps saved native choices and requires explicit opt-in for the new targets", () => {
    const old = {
      version: "2.0.0",
      runtimes: { claude: true, codex: true, copilot: true },
      skills: "none",
      init: { agents: "fellowship", commands: false },
    };
    assert.deepEqual(planFromConfig(old, [])?.nativeRuntimes, ["claude"]);
    const saved = planFromConfig(
      { ...old, init: { ...old.init, nativeRuntimes: [] } },
      [],
    );
    assert.ok(saved);
    assert.deepEqual(resolvePlan({}, saved).nativeRuntimes, []);
    assert.deepEqual(
      resolvePlan({ runtimes: ["codex", "copilot"] }, saved).nativeRuntimes,
      ["codex", "copilot"],
    );
    assert.deepEqual(
      planFromConfig(
        { ...old, init: { ...old.init, nativeRuntimes: ["codex", "copilot"] } },
        [],
      )?.nativeRuntimes,
      ["codex", "copilot"],
    );
  });

  it("escapes quotes, backslashes, multiline prompts, and model names without field injection", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-agent-escape-"));
    try {
      fs.mkdirSync(path.join(root, "core/fellowship"), { recursive: true });
      const body =
        '# Agent "quoted"\n\nPath C:\\project\nTriple """ and Unicode: \u2603\n';
      fs.writeFileSync(
        path.join(root, "core/fellowship/custom.md"),
        '---\nname: "Quoted agent"\ntitle: Quoted title\n---\n' + body,
      );
      const models = modelsFromConfig({
        agents: {
          models: {
            codex: { balanced: 'model"\nname = "injected' },
            copilot: { balanced: 'model"\nname: injected' },
          },
        },
      });
      const outputs = buildInstallOutputs(
        root,
        resolvePlan({
          runtimes: ["codex", "copilot"],
          skills: "none",
          commands: false,
        }),
        { commands: {}, models },
      );
      const codex = outputs[0]?.content ?? "";
      assert.equal(scalar(codex, "name"), "custom");
      assert.ok(
        scalar(codex, "developer_instructions").startsWith(body.trimEnd()),
      );
      assert.equal(scalar(codex, "model"), 'model"\nname = "injected');
      assert.equal(
        codex.split("\n").filter((line) => line.startsWith("name = ")).length,
        1,
      );
      assert.equal(
        frontmatter(outputs[1]?.content ?? "").model,
        'model"\nname: injected',
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
