// @ts-check
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { scanDirectory } from "../../scripts/security/security-scan.mjs";

describe("Zero-Trust Security & Static SAST Shield (Agent Guard)", () => {
  /** @type {string} */
  let tempWorkspace;

  before(() => {
    tempWorkspace = fs.mkdtempSync(
      path.join(os.tmpdir(), "sauron-security-test-"),
    );

    // 1. Clean compliant file
    fs.mkdirSync(path.join(tempWorkspace, "clean"), { recursive: true });
    fs.writeFileSync(
      path.join(tempWorkspace, "clean", "safe-service.ts"),
      `export function calculateSum(a: number, b: number): number {
  return a + b;
}
`,
      "utf8",
    );

    // 2. Secret leak files
    fs.mkdirSync(path.join(tempWorkspace, "leaks"), { recursive: true });
    fs.writeFileSync(
      path.join(tempWorkspace, "leaks", "aws-leak.ts"),
      `const awsKey = "AKIA1234567890ABCDEF";\n`,
      "utf8",
    );
    fs.writeFileSync(
      path.join(tempWorkspace, "leaks", "private-key.pem"),
      `-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----\n`,
      "utf8",
    );

    // 3. Unsafe sinks file
    fs.mkdirSync(path.join(tempWorkspace, "sinks"), { recursive: true });
    fs.writeFileSync(
      path.join(tempWorkspace, "sinks", "dangerous-eval.js"),
      `function runUserCode(code) {
  return eval(code);
}
`,
      "utf8",
    );
  });

  after(() => {
    if (fs.existsSync(tempWorkspace)) {
      fs.rmSync(tempWorkspace, { recursive: true, force: true });
    }
  });

  it("passes cleanly when scanning zero-violation codebases", async () => {
    const findings = await scanDirectory(path.join(tempWorkspace, "clean"));
    assert.equal(
      findings.length,
      0,
      "Clean directory must produce zero security findings",
    );
  });

  it("flags CRITICAL severity on hardcoded AWS access keys and private key blocks", async () => {
    const findings = await scanDirectory(path.join(tempWorkspace, "leaks"));
    assert.ok(findings.length >= 2, "Must detect both secrets");

    const awsFinding = findings.find((f) => f.rule.includes("AWS"));
    assert.ok(awsFinding, "Must find AWS Access Key violation");
    assert.equal(awsFinding.severity, "CRITICAL");

    const keyFinding = findings.find((f) => f.rule.includes("Private Key"));
    assert.ok(keyFinding, "Must find Private Key Block violation");
    assert.equal(keyFinding.severity, "CRITICAL");
  });

  it("flags HIGH severity on dangerous dynamic execution sinks (eval)", async () => {
    const findings = await scanDirectory(path.join(tempWorkspace, "sinks"));
    const evalFinding = findings.find((f) => f.rule.includes("eval"));
    assert.ok(evalFinding, "Must flag eval() call");
    assert.equal(evalFinding.severity, "HIGH");
  });
});
