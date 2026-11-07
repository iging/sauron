// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pickSkills, parsePickerValues, SkillPickerCancelled } from "../../dist/adapters/skill-picker.js";
import { listSkillChoices } from "../../dist/adapters/installer.js";

async function fixture(test) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-picker-unit-"));
  try {
    for (const [department, names] of [["backend", ["read", "write"]], ["frontend", ["ui", "ux"]]]) {
      for (const name of names) {
        const dir = path.join(root, "skills", department, name);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "SKILL.md"), `---\r\nname: Display ${name}\r\ndescription: >\r\n  Help with ${name}\r\n  when needed.\r\n---\r\n# Instructions\r\n`);
      }
    }
    await test(root);
    assert.ok(!fs.existsSync(path.join(root, ".sauron")), "picker must not write install state");
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}

describe("Skill picker", () => {
  it("uses path identities with frontmatter display names and folded hints", () => fixture(async (root) => {
    assert.deepEqual(listSkillChoices(root, ["backend"])[0], { value: "backend/read", label: "Display read", hint: "Help with read when needed." });
  }));

  it("checks every fresh department skill and remembers subsets when picking another department", () => fixture(async (root) => {
    let round = 0;
    const result = await pickSkills(root, ["backend", "frontend"], "none", {
      async departments(available, initial) {
        assert.deepEqual(available, ["backend", "frontend"]);
        assert.deepEqual(initial, round ? ["backend"] : []);
        return round ? ["backend", "frontend"] : ["backend"];
      },
      async skills(department, options, initial) {
        if (department === "backend") {
          assert.deepEqual(initial, round ? ["backend/read"] : ["backend/read", "backend/write"]);
          return ["backend/read"];
        }
        assert.deepEqual(initial, options.map((option) => option.value));
        return [];
      },
      async action() { return round++ === 0 ? "another" : "done"; },
    });
    assert.deepEqual(result, ["backend/read"]);
  }));

  it("returns Back to departments, preserves prior choices, and removes unchecked departments", () => fixture(async (root) => {
    let round = 0;
    const result = await pickSkills(root, ["backend", "frontend"], "none", {
      async departments(_available, initial) {
        if (round++ === 0) return ["backend", "frontend"];
        assert.deepEqual(initial, ["backend", "frontend"]);
        return ["backend"];
      },
      async skills(department, _options, initial) {
        if (department === "frontend") return "back";
        if (round === 2) assert.deepEqual(initial, ["backend/write"]);
        return ["backend/write"];
      },
      async action() { return "done"; },
    });
    assert.deepEqual(result, ["backend/write"]);
  }));

  it("restores mixed saved selections and stores explicit skill ids", () => fixture(async (root) => {
    const initial = ["backend", "frontend/ui"];
    const result = await pickSkills(root, ["backend", "frontend"], initial, {
      async departments(_available, selected) { assert.deepEqual(selected, ["backend", "frontend"]); return [...selected]; },
      async skills(department, _options, selected) {
        assert.deepEqual(selected, department === "backend" ? ["backend/read", "backend/write"] : ["frontend/ui"]);
        return [...selected];
      },
      async action() { return "done"; },
    });
    assert.deepEqual(result, ["backend/read", "backend/write", "frontend/ui"]);
    assert.deepEqual(initial, ["backend", "frontend/ui"]);
  }));

  it("keeps an intentionally empty skill selection empty when revisiting", () => fixture(async (root) => {
    let round = 0;
    const result = await pickSkills(root, ["backend"], "all", {
      async departments(_available, selected) { assert.deepEqual(selected, round ? ["backend"] : []); return ["backend"]; },
      async skills(_department, _options, initial) { assert.deepEqual(initial, round ? [] : ["backend/read", "backend/write"]); return []; },
      async action() { return round++ === 0 ? "back" : "done"; },
    });
    assert.equal(result, "none");
  }));

  it("reads metadata only for opened departments and fails closed for invalid opened metadata", () => fixture(async (root) => {
    fs.writeFileSync(path.join(root, "skills/frontend/ui/SKILL.md"), "# Missing metadata");
    const ui = {
      async departments() { return ["backend"]; },
      async skills(_department, _options, initial) { return [...initial]; },
      async action() { return "done"; },
    };
    assert.deepEqual(await pickSkills(root, ["backend", "frontend"], "none", ui), ["backend/read", "backend/write"]);
    await assert.rejects(pickSkills(root, ["backend", "frontend"], "none", { ...ui, async departments() { return ["frontend"]; } }), /Missing picker name or description/);
  }));

  it("refuses unknown UI selections and propagates cancellation without writing", () => fixture(async (root) => {
    const ui = { async departments() { return ["backend"]; }, async skills() { return ["backend/no-such-skill"]; }, async action() { return "done"; } };
    await assert.rejects(pickSkills(root, ["backend"], "none", ui), /Unknown picker selection/);
    await assert.rejects(pickSkills(root, ["backend"], "none", { ...ui, async departments() { throw new SkillPickerCancelled(); } }), SkillPickerCancelled);
  }));

  it("accepts numbers or ids and rejects invalid or mixed special inputs", () => {
    const values = ["backend/read", "backend/write"];
    assert.deepEqual(parsePickerValues("1,backend/write,1", values), values);
    assert.deepEqual(parsePickerValues("all", values), values);
    assert.deepEqual(parsePickerValues("none", values), []);
    for (const input of ["", "0", "3", "all,1", "none,2", "1,", "../read"]) assert.throws(() => parsePickerValues(input, values));
  });
});
