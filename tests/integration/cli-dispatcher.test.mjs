// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const CLI_PATH = path.resolve("bin", "sauron.mjs");
import { listDepartments, listSkills } from "../../dist/adapters/installer.js";

describe("Sauron CLI Command Dispatcher", () => {
  it("executes 'status' and outputs fellowship agents and runtimes", async () => {
    const { stdout } = await execFileAsync("node", [CLI_PATH, "status"]);
    assert.ok(
      stdout.includes("The 20 Runtimes Bound by sauron"),
      "Status header must be present",
    );
    assert.ok(
      stdout.includes("Gandalf") && stdout.includes("Aragorn"),
      "Must list Fellowship agents",
    );
    const departments = listDepartments(path.resolve("."));
    const skills = listSkills(path.resolve("."), departments);
    assert.ok(stdout.includes(`${skills.length} ECC-standard skills across ${departments.length} domains`));
  });

  it("executes 'list-skills' and catalogs skills across departments", async () => {
    const { stdout } = await execFileAsync("node", [CLI_PATH, "list-skills"]);
    assert.ok(
      stdout.includes("Listing all registered skills:"),
      "Must output skill catalog header",
    );
    assert.ok(
      stdout.includes("define-core-domains") && stdout.includes("caveman"),
      "Must list core skills",
    );
    const listed = stdout.split(/\r?\n/).filter((line) => line.startsWith("  - ")).map((line) => line.slice(4));
    const installed = listSkills(path.resolve("."), listDepartments(path.resolve("."))).map((skill) => skill.name);
    assert.deepEqual(listed.sort(), installed.sort());
    assert.ok(!listed.includes("_template"));
  });

  it("executes 'graph --help' or 'help graph' with usage instructions", async () => {
    const { stdout } = await execFileAsync("node", [CLI_PATH, "--help"]);
    assert.ok(
      stdout.includes("graph"),
      "Help menu must document graph command",
    );
  });

  it("fails gracefully with exit code 1 when invoking an unknown command", async () => {
    try {
      await execFileAsync("node", [CLI_PATH, "invalid-unknown-command-xyz"]);
      assert.fail("Should have thrown error on unknown command");
    } catch (err) {
      const error = /** @type {any} */ (err);
      assert.ok(
        error.code === 1 || error.status === 1 || error.stderr || error.stdout,
        "Must exit with error",
      );
    }
  });
});
