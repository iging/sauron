// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import { parse as parseYaml } from "yaml";

const versions = [
  ["18.20.8", 1], ["20.11.9", 1], ["20.12.0", 0],
  ["20.12.1", 0], ["21.0.0", 0], ["22.0.0", 0], ["24.15.0", 0],
];

describe("Install review regressions", () => {
  it("both POSIX installers enforce the Node floor at the minor-version boundary", () => {
    for (const file of ["bin/install.sh", "scripts/install/install.sh"]) {
      const source = fs.readFileSync(file, "utf8");
      const check = /node -e '([^']+)'/.exec(source)?.[1];
      assert.ok(check, file);
      assert.match(source, /Sauron requires Node\.js 20\.12\.0 or newer\./);
      assert.doesNotMatch(source, /version 18|Node\.js 18/);
      for (const [version, expected] of versions) {
        let actual;
        vm.runInNewContext(check, { process: { versions: { node: version }, exit: (/** @type {number} */ code) => { actual = code; } } });
        assert.equal(actual, expected, file + " " + version);
      }
    }
  });

  it("both PowerShell installers accept 20.12.0 and reject older minor versions before writes", () => {
    for (const file of ["bin/install.ps1", "scripts/install/install.ps1"]) {
      const source = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
      const prefix = source.split("# Step 2:")[0];
      assert.ok(prefix && prefix.length < source.length, file);
      assert.match(prefix, /Sauron requires Node\.js 20\.12\.0 or newer\./);
      assert.doesNotMatch(prefix, /version 18|Node\.js 18/);
      for (const [version, expected] of versions) {
        const script = 'function global:node { "v' + version + '" }; & {\n' + prefix + '\n}';
        const result = spawnSync("pwsh", ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", script], { encoding: "utf8", timeout: 20000 });
        assert.ifError(result.error);
        assert.equal(result.status, expected, file + " " + version + "\n" + result.stdout + result.stderr);
      }
    }
  });

  it("uses one CLI-only Compose file, a selectable user mount, a locked install, and direct Node entrypoint", () => {
    const compose = parseYaml(fs.readFileSync("docker-compose.yml", "utf8"));
    assert.deepEqual(Object.keys(compose.services), ["sauron"]);
    assert.deepEqual(compose.services.sauron.volumes, [{ type: "bind", source: '$' + '{SAURON_WORKSPACE:-.}', target: "/workspace" }]);
    assert.equal(compose.services.sauron.build.dockerfile, "docker/Dockerfile.cli");
    assert.ok(!fs.existsSync("docker/docker-compose.yml"));
    assert.ok(!fs.existsSync("docker/Dockerfile.landing"));
    const dockerfile = fs.readFileSync("docker/Dockerfile.cli", "utf8");
    assert.match(dockerfile, /COPY package\.json package-lock\.json tsconfig\.json \.\//);
    assert.match(dockerfile, /^RUN npm ci\r?$/m);
    assert.doesNotMatch(dockerfile, /npm install|\|\|/);
    assert.deepEqual(JSON.parse(/^ENTRYPOINT (.+)$/m.exec(dockerfile)?.[1] ?? "[]"), ["node", "/opt/sauron/bin/sauron.mjs"]);
  });
});
