// @ts-check
/**
 * @fileoverview Unit tests for native subagent and command install across runtimes.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import {
  buildInstallOutputs,
  NATIVE_TARGETS,
  listDepartments,
  listSkills,
  commandRetirements,
} from "../../dist/adapters/installer.js";
import {
  NATIVE_RUNTIMES,
  nativeRuntimesFor,
  planFromConfig,
  resolvePlan,
} from "../../dist/adapters/init-plan.js";

const ROOT = path.resolve(".");
const FELLOWSHIP = 9;
const BUNDLED_COMMANDS = 114;

/** @param {string[]} runtimes @param {object} [extra] */
const outputs = (runtimes, extra = {}) =>
  buildInstallOutputs(
    ROOT,
    resolvePlan({ runtimes, skills: "none", ...extra }),
  );

/** @param {{ relativePath: string }[]} list @param {string} dir */
const inDir = (list, dir) =>
  list.filter((o) => o.relativePath.startsWith(`${dir}/`));

/** @param {{ relativePath: string, content: string }[]} list @param {string} rel */
const contentOf = (list, rel) =>
  list.find((o) => o.relativePath === rel)?.content ?? "";

describe("Native subagent and command install", () => {
  it("every native runtime has an install target", () => {
    assert.deepEqual(
      Object.keys(NATIVE_TARGETS).sort(),
      [...NATIVE_RUNTIMES].sort(),
    );
  });

  it("OpenCode gets the Fellowship and every command", () => {
    const list = outputs(["opencode"]);
    assert.equal(inDir(list, ".opencode/agents").length, FELLOWSHIP);
    assert.equal(
      inDir(list, ".opencode/commands").length,
      BUNDLED_COMMANDS + FELLOWSHIP,
    );
    assert.equal(inDir(list, ".claude/agents").length, 0);
  });

  it("omp gets the Fellowship and every command that no built-in shadows", () => {
    const list = outputs(["omp"]);
    const reserved = NATIVE_TARGETS.omp.reservedCommands;
    assert.equal(inDir(list, ".omp/agents").length, FELLOWSHIP);
    assert.equal(
      inDir(list, ".omp/prompts").length,
      BUNDLED_COMMANDS + FELLOWSHIP - reserved.length,
    );
    for (const name of reserved) {
      assert.equal(
        contentOf(list, `.omp/prompts/${name}.md`),
        "",
        `${name} must be left out`,
      );
      const skillNames = new Set(
        listSkills(ROOT, listDepartments(ROOT)).map((skill) => skill.name),
      );
      const command = skillNames.has(name) ? `sauron-${name}` : name;
      assert.notEqual(
        contentOf(outputs(["opencode"]), `.opencode/commands/${command}.md`),
        "",
      );
    }
  });

  it("renders the subagent format of each runtime", () => {
    const list = outputs(["claude", "opencode", "omp"]);
    assert.match(
      contentOf(list, ".claude/agents/gandalf.md"),
      /^---\nname: gandalf\ndescription: "/,
    );
    assert.match(
      contentOf(list, ".omp/agents/gandalf.md"),
      /^---\nname: gandalf\ndescription: "/,
    );
    const opencode = contentOf(list, ".opencode/agents/gandalf.md");
    assert.match(
      opencode,
      /^---\ndescription: ".*"\nmode: subagent\npermissions:\n(  - \{.*\}\n)+---\n/,
    );
    assert.doesNotMatch(opencode, /^name:/m);
  });

  it("keeps argument-hint for Claude Code only", () => {
    const list = outputs(["claude", "opencode", "omp"]);
    assert.match(
      contentOf(list, ".claude/commands/gandalf.md"),
      /argument-hint: <task>/,
    );
    for (const rel of [
      ".opencode/commands/gandalf.md",
      ".omp/prompts/gandalf.md",
    ]) {
      const content = contentOf(list, rel);
      assert.doesNotMatch(content, /argument-hint/);
      assert.match(content, /\$ARGUMENTS/);
    }
  });

  it("honors --no-commands and --agents=none for every native runtime", () => {
    const noCommands = outputs(["claude", "opencode", "omp"], {
      commands: false,
    });
    assert.equal(noCommands.length, FELLOWSHIP * 3, "only subagents remain");
    const noAgents = outputs(["claude", "opencode", "omp"], { agents: "none" });
    for (const dir of [".claude/agents", ".opencode/agents", ".omp/agents"]) {
      assert.equal(inDir(noAgents, dir).length, 0);
    }
    assert.equal(
      inDir(noAgents, ".opencode/commands").length,
      BUNDLED_COMMANDS,
      "no delegates",
    );
  });

  it("other runtimes get no subagents or commands", () => {
    assert.deepEqual(outputs(["cursor", "codex"]), []);
  });
});

describe("Saved native runtimes", () => {
  const DEPTS = ["workflow"];

  it("explicit runtimes opt in, and Recommended stays Claude-only", () => {
    assert.deepEqual(nativeRuntimesFor(["cursor", "omp", "claude"]), [
      "omp",
      "claude",
    ]);
    assert.deepEqual(resolvePlan({}).nativeRuntimes, ["claude"]);
    assert.deepEqual(
      resolvePlan({ runtimes: ["cursor", "opencode"] }).nativeRuntimes,
      ["opencode"],
    );
  });

  it("a config saved before 3.2.0 keeps the Claude-only install", () => {
    const plan = planFromConfig(
      {
        runtimes: ["claude", "opencode", "omp"],
        agents: "fellowship",
        skills: "none",
        commands: true,
      },
      DEPTS,
    );
    assert.deepEqual(plan?.nativeRuntimes, ["claude"]);
    const noClaude = planFromConfig(
      { runtimes: ["opencode"], agents: "fellowship" },
      DEPTS,
    );
    assert.deepEqual(noClaude?.nativeRuntimes, []);
  });

  it("a saved list is reused, keeping only selected native runtimes", () => {
    const plan = planFromConfig(
      {
        runtimes: ["claude", "omp"],
        nativeRuntimes: ["omp", "opencode", "cursor"],
      },
      DEPTS,
    );
    assert.deepEqual(plan?.nativeRuntimes, ["omp"]);
  });

  it("flags without --runtimes keep the saved list", () => {
    const saved = planFromConfig(
      { runtimes: ["opencode", "omp"], nativeRuntimes: ["omp"] },
      DEPTS,
    );
    assert.ok(saved);
    assert.deepEqual(resolvePlan({ agents: "core" }, saved).nativeRuntimes, [
      "omp",
    ]);
    assert.deepEqual(
      resolvePlan({ runtimes: ["opencode"] }, saved).nativeRuntimes,
      ["opencode"],
    );
  });
});

describe("Skill and command name collisions", () => {
  it("fails closed when an alias already belongs to a bundled command", () => {
    const root = fs.mkdtempSync(
      path.join(os.tmpdir(), "sauron-alias-collision-"),
    );
    try {
      fs.mkdirSync(path.join(root, "commands"), { recursive: true });
      fs.mkdirSync(path.join(root, "skills/workflow/caveman"), {
        recursive: true,
      });
      fs.writeFileSync(
        path.join(root, "skills/workflow/caveman/SKILL.md"),
        "# Skill",
      );
      fs.writeFileSync(path.join(root, "commands/caveman.md"), "/caveman");
      fs.writeFileSync(
        path.join(root, "commands/sauron-caveman.md"),
        "# Already taken",
      );
      assert.throws(
        () => buildInstallOutputs(root, resolvePlan({ skills: "none" })),
        /Command alias collides/,
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
  it("keeps skills and provides distinct command wrapper aliases in every native runtime", () => {
    const skillNames = new Set(
      listSkills(ROOT, listDepartments(ROOT)).map((skill) => skill.name),
    );
    for (const runtime of NATIVE_RUNTIMES) {
      const target = NATIVE_TARGETS[runtime];
      const list = outputs([runtime], { skills: "all" });
      const commands = inDir(list, target.commandsDir);
      assert.equal(
        new Set(commands.map((command) => command.relativePath)).size,
        commands.length,
      );
      for (const command of commands) {
        assert.ok(
          !skillNames.has(path.basename(command.relativePath, ".md")),
          command.relativePath,
        );
      }
      const caveman = contentOf(
        list,
        `${target.commandsDir}/sauron-caveman.md`,
      );
      assert.match(caveman, /\/sauron-caveman/);
      assert.doesNotMatch(caveman, /\/caveman\b/);
      assert.ok(
        list.some(
          (file) => file.relativePath === ".agents/skills/caveman/SKILL.md",
        ),
      );
      const plan = resolvePlan({ runtimes: [runtime] });
      assert.ok(
        commandRetirements(ROOT, plan).some(
          (file) => file.relativePath === `${target.commandsDir}/caveman.md`,
        ),
      );
      assert.deepEqual(
        commandRetirements(ROOT, { ...plan, commands: false }),
        [],
      );
    }
  });
});
