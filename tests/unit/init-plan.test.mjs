// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  InitPlanError,
  PRESET_RECOMMENDED,
  RUNTIME_IDS,
  parseInitFlags,
  planFromConfig,
  resolvePlan,
} from "../../dist/adapters/init-plan.js";

const DEPTS = ["frontend", "workflow"];

describe("init plan resolution", () => {
  it("Recommended preset is shared core + Claude Code + all skills + Fellowship", () => {
    assert.deepEqual(resolvePlan({}), {
      runtimes: ["claude"],
      agents: "fellowship",
      skills: "all",
      caveman: "full",
      commands: true,
    });
    assert.ok(Object.isFrozen(PRESET_RECOMMENDED));
  });

  it("parses every flag and fills the rest from the preset", () => {
    const flags = parseInitFlags(
      ["--runtimes=claude,cursor", "--agents=both", "--skills=workflow", "--caveman=ultra", "--no-commands"],
      DEPTS,
    );
    assert.deepEqual(resolvePlan(flags), {
      runtimes: ["claude", "cursor"],
      agents: "both",
      skills: ["workflow"],
      caveman: "ultra",
      commands: false,
    });
  });

  it("expands --runtimes=all to every runtime", () => {
    assert.deepEqual(parseInitFlags(["--runtimes=all"], DEPTS).runtimes, [...RUNTIME_IDS]);
  });

  it("rejects unknown values with InitPlanError", () => {
    assert.throws(() => parseInitFlags(["--runtimes=nope"], DEPTS), InitPlanError);
    assert.throws(() => parseInitFlags(["--agents=all"], DEPTS), InitPlanError);
    assert.throws(() => parseInitFlags(["--skills=backend"], DEPTS), InitPlanError);
    assert.throws(() => parseInitFlags(["--caveman=mega"], DEPTS), InitPlanError);
  });

  it("restores a saved plan and ignores an invalid one", () => {
    const saved = planFromConfig(
      { runtimes: ["cursor"], agents: "none", skills: ["frontend"], commands: false },
      DEPTS,
    );
    assert.deepEqual(saved?.runtimes, ["cursor"]);
    assert.equal(saved?.agents, "none");
    assert.deepEqual(saved?.skills, ["frontend"]);
    assert.equal(planFromConfig({ runtimes: ["bogus"] }, DEPTS), undefined);
    assert.equal(planFromConfig(undefined, DEPTS), undefined);
  });
});
