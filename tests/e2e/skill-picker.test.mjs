// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify, stripVTControlCharacters } from "node:util";
import { parseConfig } from "../../dist/adapters/config.js";
import { listSkills, listSkillChoices, listDepartments } from "../../dist/adapters/installer.js";

const ROOT = path.resolve(".");
const CLI = path.join(ROOT, "bin/sauron.mjs");
const flags = ["--runtimes=cursor", "--agents=none", "--no-commands", "--caveman=off"];
const runFile = promisify(execFile);
async function sandbox(test) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-picker-e2e-"));
  try { await test(dir); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
function interactive(dir, input) {
  return new Promise((resolve, reject) => {
    const child = execFile(process.execPath, [CLI, "init", "--interactive", ...flags], { cwd: dir, timeout: 20000, maxBuffer: 16 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) reject(error); else resolve({ stdout, stderr });
    });
    child.stdin?.end(input);
  });
}

describe("Numbered per-skill picker", () => {
  it("picks another department while retaining a subset and installs only checked skill ids", () => sandbox(async (dir) => {
    const first = listSkillChoices(ROOT, ["backend"])[0];
    assert.ok(first);
    const { stdout } = await interactive(dir, "2\npick\nbackend\n1\n1\nbackend,frontend\n\nnone\n2\ny\n");
    assert.ok(stdout.includes(first.label));
    assert.ok(stdout.includes(first.hint));
    assert.match(stdout, /Pick another department/);
    const config = parseConfig(fs.readFileSync(path.join(dir, "sauron.config.yaml"), "utf8"));
    assert.deepEqual(config.skills, [first.value]);
    const expected = first.value.split("/")[1];
    assert.ok(fs.existsSync(path.join(dir, `.agents/skills/${expected}/SKILL.md`)));
    const installed = fs.readdirSync(path.join(dir, ".agents/skills"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    assert.deepEqual(installed, [expected]);
  }));

  it("goes back from skill selection, changes departments, and previews without writes", () => sandbox(async (dir) => {
    const { stdout } = await interactive(dir, "2\npick\nbackend\nback\nworkflow\nnone\n2\nn\n");
    assert.match(stdout, /Skills in backend/);
    assert.match(stdout, /Skills in workflow/);
    assert.match(stdout, /ABORTED/);
    assert.deepEqual(fs.readdirSync(dir), []);
  }));

  it("cancels inside the picker before configuration or runtime files exist", () => sandbox(async (dir) => {
    const { stdout } = await interactive(dir, "2\npick\nbackend\ncancel\n");
    assert.match(stdout, /Setup cancelled/);
    assert.deepEqual(fs.readdirSync(dir), []);
  }));

  it("reopens a saved subset without widening it and saves an empty selection as none", () => sandbox(async (dir) => {
    const first = listSkillChoices(ROOT, ["backend"])[0];
    assert.ok(first);
    await interactive(dir, "2\npick\nbackend\n1\n2\ny\n");
    const { stdout } = await interactive(dir, "2\npick\n\n\n2\nn\n");
    assert.match(stdout, /Skills in backend.*\[1\]/);
    assert.deepEqual(parseConfig(fs.readFileSync(path.join(dir, "sauron.config.yaml"), "utf8")).skills, [first.value]);
    const other = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-picker-empty-"));
    try {
      await interactive(other, "2\npick\nbackend\nnone\n2\ny\n");
      assert.equal(parseConfig(fs.readFileSync(path.join(other, "sauron.config.yaml"), "utf8")).skills, "none");
    } finally { fs.rmSync(other, { recursive: true, force: true }); }
  }));

  it("accepts mixed department and individual skill flags and rejects unknown skills", () => sandbox(async (dir) => {
    const skill = listSkills(ROOT, ["backend"])[0];
    assert.ok(skill);
    await runFile(process.execPath, [CLI, "init", "--yes", ...flags, `--skills=workflow,backend/${skill.name}`], { cwd: dir, maxBuffer: 16 * 1024 * 1024 });
    assert.ok(fs.existsSync(path.join(dir, `.agents/skills/${skill.name}/SKILL.md`)));
    assert.ok(fs.existsSync(path.join(dir, ".agents/skills/caveman/SKILL.md")));
    const other = listSkills(ROOT, ["backend"]).find((entry) => entry.name !== skill.name);
    assert.ok(other);
    assert.ok(!fs.existsSync(path.join(dir, `.agents/skills/${other.name}`)));
    const before = fs.readFileSync(path.join(dir, "sauron.config.yaml"), "utf8");
    await assert.rejects(runFile(process.execPath, [CLI, "init", "--yes", ...flags, "--skills=backend/not-real"], { cwd: dir }));
    assert.equal(fs.readFileSync(path.join(dir, "sauron.config.yaml"), "utf8"), before);
  }));
});


// A scripted stream checks Clack wiring. Real terminals still need a separate manual check.
describe("Scripted arrow picker", () => {
  it("returns with Backspace, selects a subset, and exits after writing", () => sandbox(async (dir) => {
    const choices = listSkillChoices(ROOT, ["backend"]);
    const backendIndex = listDepartments(ROOT).indexOf("backend");
    assert.ok(choices.length > 1 && backendIndex >= 0);
    const down = "\u001b[B";
    const steps = [
      ["How do you want to set up Sauron?", down + "\r"],
      ["Which skills?", down + "\r"],
      ["Pick departments", down.repeat(backendIndex) + " \r"],
      ["Pick skills in backend", "\u007f"],
      ["Pick departments", "\r"],
      ["Pick skills in backend", (down + " ").repeat(choices.length - 1) + "\r"],
      ["Continue skill selection?", "\r"],
      ["Write these files?", "\r"],
    ];
    const preload = 'Object.defineProperty(process.stdin,"isTTY",{value:true});Object.defineProperty(process.stdout,"isTTY",{value:true});process.stdout.columns=100;process.stdout.rows=40;process.stdin.setRawMode=function(value){this.isRaw=value;return this;};';
    let index = 0;
    const { stdout } = await new Promise((resolve, reject) => {
      const child = execFile(process.execPath, ["--import", "data:text/javascript," + encodeURIComponent(preload), CLI, "init", ...flags], { cwd: dir, timeout: 20000, maxBuffer: 16 * 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) reject(Object.assign(error, { stderr, completedSteps: index }));
        else resolve({ stdout, stderr });
      });
      let buffer = "";
      let sending = false;
      child.stdout?.on("data", (data) => {
        buffer += stripVTControlCharacters(data.toString());
        if (!sending && index < steps.length && buffer.includes(steps[index][0])) {
          sending = true;
          setTimeout(() => { const keys = steps[index][1]; index += 1; buffer = ""; sending = false; child.stdin?.write(keys); }, 50);
        }
      });
    });
    assert.equal(index, steps.length);
    assert.match(stripVTControlCharacters(stdout), /COMPLETE/);
    const config = parseConfig(fs.readFileSync(path.join(dir, "sauron.config.yaml"), "utf8"));
    assert.deepEqual(config.skills, [choices[0].value]);
  }));
});
