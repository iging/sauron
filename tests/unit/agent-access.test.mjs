// @ts-check
/**
 * @fileoverview Unit tests for agent toolsets, shell intents, model tiers, and their rendering.
 */

import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import {
  DEFAULT_MODELS,
  LEAST_ACCESS,
  accessNote,
  claudeAccessLines,
  detectShellCommands,
  modelsFromConfig,
  ompAccessLines,
  opencodeAccessLines,
  readAgentAccess,
} from "../../dist/adapters/agent-access.js";
import { buildInstallOutputs } from "../../dist/adapters/installer.js";
import { resolvePlan } from "../../dist/adapters/init-plan.js";

const ROOT = path.resolve(".");

/** @param {string} folder */
const specs = (folder) =>
  fs
    .readdirSync(path.join(ROOT, "core", folder))
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const text = fs.readFileSync(path.join(ROOT, "core", folder, f), "utf8");
      const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
      return { file: f, data: parseYaml(match?.[1] ?? "") };
    });

describe("Agent access specs", () => {
  it("gives all 78 agents a valid toolset, shell list, and model tier", () => {
    const all = [...specs("fellowship"), ...specs("agents")];
    assert.equal(all.length, 78);
    for (const { file, data } of all) {
      assert.ok("toolset" in data && "shell" in data && "model" in data, file);
      readAgentAccess(data, file);
    }
  });

  it("matches the approved Fellowship table", () => {
    const fellowship = Object.fromEntries(
      specs("fellowship").map(({ data }) => [
        data.id,
        `${data.toolset} ${data.shell.join(",")} ${data.model}`,
      ]),
    );
    assert.deepEqual(fellowship, {
      aragorn: "planner git-read deep",
      boromir: "reviewer audit,git-read deep",
      frodo: "builder test,build,lint,typecheck balanced",
      gandalf: "planner git-read deep",
      gimli: "builder test,typecheck balanced",
      legolas: "reviewer lint,typecheck,git-read balanced",
      merry: "tester test balanced",
      pippin: "tester test balanced",
      samwise: "git git-read,git-write fast",
    });
  });

  it("gives a spec with no fields the least access and rejects bad fields", () => {
    assert.deepEqual(readAgentAccess({}, "x"), { ...LEAST_ACCESS, shell: [] });
    assert.throws(() => readAgentAccess({ toolset: "root" }, "x"), /toolset/);
    assert.throws(() => readAgentAccess({ model: "huge" }, "x"), /model tier/);
    assert.throws(() => readAgentAccess({ shell: ["rm"] }, "x"), /shell/);
  });
});

describe("Shell command detection", () => {
  /** @type {string} */
  let dir;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-access-"));
  });
  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("uses the lockfile's package manager and only existing scripts", () => {
    fs.writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify({ scripts: { test: "x", build: "y" } }),
    );
    fs.writeFileSync(path.join(dir, "pnpm-lock.yaml"), "");
    const commands = detectShellCommands(dir);
    assert.deepEqual(commands.test, ["pnpm test"]);
    assert.deepEqual(commands.build, ["pnpm run build"]);
    assert.equal(commands.lint, undefined);
    assert.deepEqual(commands["git-write"], ["git add", "git commit"]);
  });

  it("falls back to Python tools, and to git only for an empty folder", () => {
    assert.equal(detectShellCommands(dir).test, undefined);
    fs.writeFileSync(path.join(dir, "pyproject.toml"), "");
    assert.deepEqual(detectShellCommands(dir).test, ["pytest"]);
  });
});

describe("Runtime rendering", () => {
  const reviewer = readAgentAccess(
    { toolset: "reviewer", shell: ["lint"], model: "deep" },
    "r",
  );
  const git = readAgentAccess(
    { toolset: "git", shell: ["git-read", "git-write"], model: "fast" },
    "g",
  );
  const commands = {
    lint: ["npm run lint"],
    "git-read": ["git status"],
    "git-write": ["git commit"],
  };

  it("Claude Code gets bare tool names and the model alias", () => {
    assert.deepEqual(claudeAccessLines(reviewer, DEFAULT_MODELS), [
      "tools: Read, Grep, Glob, Bash",
      "model: opus",
    ]);
  });

  it("OpenCode denies edits for reviewers, asks for shell, and allows listed commands", () => {
    const lines = opencodeAccessLines(reviewer, commands, DEFAULT_MODELS).join(
      "\n",
    );
    assert.match(lines, /action: edit, resource: "\*", effect: deny/);
    assert.match(lines, /action: shell, resource: "\*", effect: ask/);
    assert.match(
      lines,
      /action: shell, resource: "npm run lint \*", effect: allow/,
    );
    assert.doesNotMatch(lines, /^model:/m);
  });

  it("the git toolset can never push in OpenCode", () => {
    const lines = opencodeAccessLines(git, commands, DEFAULT_MODELS);
    assert.equal(
      lines.at(-1),
      '  - { action: shell, resource: "git push *", effect: deny }',
    );
    assert.match(accessNote(git, commands), /Never push/);
  });

  it("omp limits tools only for read-only agents", () => {
    const readOnly = readAgentAccess({ toolset: "reviewer", shell: [] }, "x");
    assert.deepEqual(ompAccessLines(readOnly, DEFAULT_MODELS), [
      "tools: [read, grep, glob]",
    ]);
    assert.deepEqual(ompAccessLines(reviewer, DEFAULT_MODELS), []);
  });

  it("config models override the defaults per runtime and tier", () => {
    const models = modelsFromConfig({
      agents: {
        models: {
          claude: { deep: "claude-opus-5-5" },
          opencode: { fast: "anthropic/x" },
        },
      },
    });
    assert.deepEqual(
      claudeAccessLines(reviewer, models).at(-1),
      "model: claude-opus-5-5",
    );
    assert.equal(models["claude"]?.fast, "haiku");
    assert.equal(models["opencode"]?.fast, "anthropic/x");
  });

  it("installed agents carry their access note", () => {
    const outputs = buildInstallOutputs(
      ROOT,
      resolvePlan({
        runtimes: ["claude"],
        agents: "fellowship",
        skills: "none",
      }),
      { commands, models: DEFAULT_MODELS },
    );
    const samwise = outputs.find(
      (o) => o.relativePath === ".claude/agents/samwise.md",
    );
    assert.match(
      samwise?.content ?? "",
      /tools: Read, Grep, Glob, Edit, Write, Bash\nmodel: haiku/,
    );
    assert.match(samwise?.content ?? "", /## Access\n\n- Toolset: git\./);
  });
});
