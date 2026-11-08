import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { Readable, Writable } from "node:stream";
import {
  inspectEye,
  diffEye,
  reuseEye,
  eyeWorkspacePath,
} from "../../dist/adapters/eye-features.js";
import { serveEyeMcp } from "../../dist/adapters/eye-mcp.js";
import { ConflictManager } from "../../dist/adapters/conflict-manager.js";
const cli = fileURLToPath(new URL("../../bin/sauron.mjs", import.meta.url));
/** @template T @param {(root:string)=>T} fn @returns {T} */
function fixture(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-eye-features-"));
  try {
    return fn(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}
/** @template T @param {(root:string)=>Promise<T>} fn @returns {Promise<T>} */
async function asyncFixture(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-eye-mcp-"));
  try {
    return await fn(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}
/** @param {string} root @param {...string} args */
function run(root, ...args) {
  const result = spawnSync(process.execPath, [cli, "eye", ...args], {
    cwd: root,
    encoding: "utf8",
    timeout: 15000,
    maxBuffer: 8 * 1024 * 1024,
  });
  assert.ifError(result.error);
  return result;
}
/** @param {string} root @param {string} [name] @param {string} [text] */
function target(root, name = "app.js", text = "ipcMain.handle('first')") {
  const file = path.join(root, name);
  fs.writeFileSync(file, text);
  return file;
}
/** @param {string|number|null} id @param {string} method @param {unknown} [params] */
const request = (id, method, params) =>
  JSON.stringify({
    jsonrpc: "2.0",
    id,
    method,
    ...(params === undefined ? {} : { params }),
  }) + "\n";
const initialize = request(1, "initialize", {
  protocolVersion: "2025-06-18",
  capabilities: {},
  clientInfo: { name: "test", version: "1" },
});
/** @typedef {{jsonrpc:string,id:string|number|null,result:{isError:boolean,content:{text:string}[],tools:{annotations:{readOnlyHint:boolean}}[]},error:{code:number,message:string}}} RpcResponse */
/** @param {string} root @param {(string|Buffer)[]} chunks @returns {Promise<RpcResponse[]>} */
async function mcp(root, chunks) {
  let stdout = "";
  const output = new Writable({
    write(chunk, _encoding, done) {
      stdout += chunk.toString();
      done();
    },
  });
  await serveEyeMcp(
    root,
    Readable.from(chunks.map((x) => (Buffer.isBuffer(x) ? x : Buffer.from(x)))),
    output,
  );
  const lines = stdout.split("\n").filter(Boolean);
  assert.ok(stdout === "" || stdout.endsWith("\n"));
  return lines.map((line) => {
    const parsed = /** @type {RpcResponse} */ (JSON.parse(line));
    assert.equal(parsed.jsonrpc, "2.0");
    return parsed;
  });
}

test("diff compares duplicate static evidence with side-qualified identifiers", () =>
  fixture((root) => {
    const before = target(
      root,
      "before.js",
      "ipcMain.handle('same');ipcMain.handle('same')",
    );
    const after = target(
      root,
      "after.js",
      "ipcMain.handle('same');ipcMain.handle('other')",
    );
    const report = diffEye(before, after);
    assert.equal(report.mode, "diff");
    assert.ok(report.added.length);
    assert.ok(report.removed.length);
    for (const item of report.added) {
      assert.equal(item.side, "after");
      assert.ok(report.after.evidence.some((e) => e.id === item.id));
    }
    for (const item of report.removed) {
      assert.equal(item.side, "before");
      assert.ok(report.before.evidence.some((e) => e.id === item.id));
    }
    assert.equal(diffEye(before, before).added.length, 0);
  }));
test("reuse requires fresh matching evidence and never trusts forged cache metadata", () =>
  fixture((root) => {
    const input = target(root);
    const fresh = inspectEye(input);
    const cache = path.join(root, "report.json");
    fs.writeFileSync(cache, JSON.stringify(fresh));
    assert.deepEqual(reuseEye(cache, input), fresh);
    const forged = structuredClone(fresh);
    forged.evidence[0].summary = "FORGED-CACHE-CANARY";
    fs.writeFileSync(cache, JSON.stringify(forged));
    assert.throws(() => reuseEye(cache, input), /match/);
    forged.evidence = fresh.evidence;
    forged.format = "FORGED-CACHE-CANARY";
    forged.target.name = "FORGED-CACHE-CANARY";
    fs.writeFileSync(cache, JSON.stringify(forged));
    assert.deepEqual(reuseEye(cache, input), fresh);
    forged.target.sha256 = "0".repeat(64);
    fs.writeFileSync(cache, JSON.stringify(forged));
    assert.throws(() => reuseEye(cache, input), /match/);
    fs.writeFileSync(cache, "not JSON");
    assert.throws(() => reuseEye(cache, input));
  }));
test("CLI inspect and JSON keep input bytes unchanged and create no implicit files", () =>
  fixture((root) => {
    const input = target(root);
    const before = fs.readFileSync(input);
    const listing = fs.readdirSync(root);
    const plain = run(root, "app.js");
    assert.equal(plain.status, 0, plain.stderr);
    assert.match(plain.stdout, /SAURON EYE/);
    const json = run(root, "app.js", "--json");
    assert.equal(json.status, 0, json.stderr);
    assert.equal(JSON.parse(json.stdout).format, "text");
    assert.equal(json.stderr, "");
    assert.deepEqual(fs.readdirSync(root), listing);
    assert.deepEqual(fs.readFileSync(input), before);
  }));
test("CLI export emits JSON until explicit fresh --out and refuses overwrites or input replacement", () =>
  fixture((root) => {
    const input = target(root);
    const before = fs.readFileSync(input);
    const emitted = run(root, "export", "app.js");
    assert.equal(emitted.status, 0, emitted.stderr);
    assert.equal(JSON.parse(emitted.stdout).schemaVersion, 1);
    assert.deepEqual(fs.readdirSync(root), ["app.js"]);
    const created = run(root, "export", "app.js", "--out", "report.json");
    assert.equal(created.status, 0, created.stderr);
    assert.equal(created.stdout, "");
    const reportBytes = fs.readFileSync(path.join(root, "report.json"));
    assert.equal(
      JSON.parse(reportBytes.toString("utf8")).target.name,
      "app.js",
    );
    assert.notEqual(run(root, "app.js", "--out", "report.json").status, 0);
    assert.notEqual(run(root, "app.js", "--out", "app.js").status, 0);
    assert.deepEqual(fs.readFileSync(input), before);
    assert.deepEqual(
      fs.readFileSync(path.join(root, "report.json")),
      reportBytes,
    );
    assert.equal(fs.existsSync(path.join(root, ".sauron")), false);
  }));
test("CLI rejects path escape, missing parents and invalid option combinations", () =>
  fixture((root) => {
    target(root);
    const outside = path.join(
      path.dirname(root),
      path.basename(root) + "-escape.json",
    );
    assert.equal(fs.existsSync(outside), false);
    for (const args of [
      ["app.js", "--out", outside],
      ["app.js", "--out", "missing/report.json"],
      ["app.js", "--json", "--json"],
      ["app.js", "--out"],
      ["mcp", "--json"],
      ["diff", "app.js"],
    ]) {
      const result = run(root, ...args);
      assert.notEqual(result.status, 0, JSON.stringify(args));
    }
    assert.equal(fs.existsSync(outside), false);
    assert.deepEqual(fs.readdirSync(root), ["app.js"]);
  }));
test("create-only output refuses existing hardlinks and junction parents", () =>
  fixture((root) => {
    const input = target(root);
    const original = fs.readFileSync(input);
    const hardlink = path.join(root, "hardlink.json");
    fs.linkSync(input, hardlink);
    assert.notEqual(run(root, "app.js", "--out", "hardlink.json").status, 0);
    const real = path.join(root, "real");
    fs.mkdirSync(real);
    fs.symlinkSync(
      real,
      path.join(root, "linked"),
      process.platform === "win32" ? "junction" : "dir",
    );
    const cm = new ConflictManager(root);
    assert.throws(
      () => cm.createOnlyFile("linked/report.json", "changed"),
      /real directory/,
    );
    assert.notEqual(
      run(root, "app.js", "--out", "linked/report.json").status,
      0,
    );
    assert.equal(fs.existsSync(path.join(real, "report.json")), false);
    assert.deepEqual(fs.readFileSync(input), original);
    assert.deepEqual(fs.readFileSync(hardlink), original);
  }));
test("workspace paths reject drive paths traversal root and linked ancestors", () =>
  fixture((root) => {
    target(root);
    assert.equal(eyeWorkspacePath(root, "app.js"), path.join(root, "app.js"));
    for (const name of [
      "../escape",
      "..\\escape",
      "C:\\escape",
      "/escape",
      ".",
      "",
      "bad\0name",
    ])
      assert.throws(() => eyeWorkspacePath(root, name));
    const real = path.join(root, "real");
    fs.mkdirSync(real);
    target(real);
    fs.symlinkSync(
      real,
      path.join(root, "linked"),
      process.platform === "win32" ? "junction" : "dir",
    );
    assert.throws(() => eyeWorkspacePath(root, "linked/app.js"), /links/);
    const result = run(root, "linked/app.js", "--json");
    assert.equal(result.status, 0, result.stderr);
    assert.ok(
      /** @type {import("../../dist/adapters/eye-types.js").EyeReport} */ (
        JSON.parse(result.stdout)
      ).diagnostics.some((x) => x.code === "target-link"),
    );
  }));
test("MCP fragmented UTF-8 and newline messages emit JSON-RPC only and preserve ids", async () =>
  asyncFixture(async (root) => {
    target(root, "café.js");
    const input = Buffer.from(
      initialize +
        request("café", "tools/call", {
          name: "sauron_eye",
          arguments: { path: "café.js" },
        }),
    );
    const point = input.indexOf(Buffer.from("é"));
    const replies = await mcp(root, [
      input.subarray(0, 7),
      input.subarray(7, point + 1),
      input.subarray(point + 1, point + 2),
      input.subarray(point + 2),
    ]);
    assert.equal(replies.length, 2);
    assert.equal(replies[1].id, "café");
    assert.equal(replies[1].result.isError, false);
    const report = JSON.parse(replies[1].result.content[0].text);
    assert.equal(report.target.name, "café.js");
    assert.deepEqual(fs.readdirSync(root), ["café.js"]);
  }));
test("MCP rejects uninitialized calls invalid JSON unknown methods and invalid tool arguments", async () =>
  asyncFixture(async (root) => {
    const replies = await mcp(root, [
      request(0, "tools/list") +
        "{bad}\n" +
        initialize +
        request(2, "unknown") +
        request(3, "tools/call", {
          name: "other",
          arguments: { path: "file" },
        }) +
        request(4, "tools/call", {
          name: "sauron_eye",
          arguments: { path: "file", extra: true },
        }) +
        request(5, "initialize", { protocolVersion: "2025-06-18" }),
    ]);
    assert.deepEqual(
      replies.map((x) => x.error?.code ?? null),
      [-32000, -32700, null, -32601, -32602, -32602, -32600],
    );
  }));
test("MCP lists one read-only tool and rejects escapes without leaking target contents", async () =>
  asyncFixture(async (root) => {
    target(root);
    const replies = await mcp(root, [
      initialize +
        request(2, "tools/list") +
        request(3, "tools/call", {
          name: "sauron_eye",
          arguments: { path: "../outside-secret-canary" },
        }) +
        request(4, "tools/call", {
          name: "sauron_eye",
          arguments: { path: "app.js" },
        }),
    ]);
    assert.equal(replies[1].result.tools.length, 1);
    assert.equal(replies[1].result.tools[0].annotations.readOnlyHint, true);
    assert.equal(replies[2].result.isError, true);
    assert.ok(!JSON.stringify(replies[2]).includes("outside-secret-canary"));
    assert.equal(replies[3].result.isError, false);
  }));
test("MCP rejects junction targets and never creates output or installation state", async () =>
  asyncFixture(async (root) => {
    const real = path.join(root, "real");
    fs.mkdirSync(real);
    target(real);
    fs.symlinkSync(
      real,
      path.join(root, "linked"),
      process.platform === "win32" ? "junction" : "dir",
    );
    const replies = await mcp(root, [
      initialize +
        request(2, "tools/call", {
          name: "sauron_eye",
          arguments: { path: "linked/app.js" },
        }),
    ]);
    assert.equal(replies[1].result.isError, true);
    assert.equal(fs.existsSync(path.join(root, ".sauron")), false);
    assert.deepEqual(fs.readdirSync(real), ["app.js"]);
  }));
test("MCP oversized fragmented messages fail once then recover at the next newline", async () =>
  asyncFixture(async (root) => {
    const replies = await mcp(root, [
      "x".repeat(600000),
      "x".repeat(600000),
      "\n",
      initialize,
      request(2, "ping"),
    ]);
    assert.equal(replies.length, 3);
    assert.equal(replies[0].error.code, -32600);
    assert.match(replies[0].error.message, /limit/);
    assert.deepEqual(replies[2].result, {});
    const tail = await mcp(root, [initialize.trimEnd()]);
    assert.equal(tail[0].error.code, -32600);
  }));
test("CLI MCP subprocess stdout has no banners or logs", () =>
  fixture((root) => {
    const result = spawnSync(process.execPath, [cli, "eye", "mcp"], {
      cwd: root,
      encoding: "utf8",
      input: initialize + request(2, "tools/list"),
      timeout: 15000,
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, "");
    const replies = result.stdout
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(replies.length, 2);
    assert.equal(replies[1].id, 2);
  }));

test("reuse refuses linked cache ancestors directories oversized cache and changed targets", () =>
  fixture((root) => {
    const input = target(root);
    const real = path.join(root, "real");
    fs.mkdirSync(real);
    const cache = path.join(real, "report.json");
    fs.writeFileSync(cache, JSON.stringify(inspectEye(input)));
    fs.symlinkSync(
      real,
      path.join(root, "linked"),
      process.platform === "win32" ? "junction" : "dir",
    );
    assert.throws(() =>
      reuseEye(path.join(root, "linked", "report.json"), input),
    );
    assert.throws(() => reuseEye(real, input));
    const big = path.join(root, "big.json");
    fs.writeFileSync(big, Buffer.alloc(8 * 1024 * 1024 + 1));
    assert.throws(() => reuseEye(big, input));
    fs.writeFileSync(input, "ipcMain.handle('changed')");
    assert.throws(() => reuseEye(cache, input), /match/);
  }));
