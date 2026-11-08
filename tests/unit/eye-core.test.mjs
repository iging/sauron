import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { deflateRawSync } from "node:zlib";
import {
  inspectEyeBuffer,
  inspectEyeFile,
} from "../../dist/adapters/eye-core.js";
import { EYE_LIMITS, eyeRange, eyeU64 } from "../../dist/adapters/eye-types.js";
/** @param {Buffer|string} data @param {string} [name] */
const inspect = (data, name) =>
  inspectEyeBuffer(Buffer.isBuffer(data) ? data : Buffer.from(data), name);
/** @param {Buffer} data */
function crc32(data) {
  let crc = 0xffffffff;
  for (const b of data) {
    crc ^= b;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
/** @param {string} name @param {Buffer} body @param {{declared?:number,flags?:number,method?:number}} [options] */
function zip(
  name,
  body,
  { declared = body.length, flags = 0, method = 8 } = {},
) {
  const raw = Buffer.from(name);
  const encoded = method === 8 ? deflateRawSync(body) : body;
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50);
  local.writeUInt16LE(flags, 6);
  local.writeUInt16LE(method, 8);
  local.writeUInt32LE(crc32(body), 14);
  local.writeUInt32LE(encoded.length, 18);
  local.writeUInt32LE(declared, 22);
  local.writeUInt16LE(raw.length, 26);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50);
  central.writeUInt16LE(flags, 8);
  central.writeUInt16LE(method, 10);
  central.writeUInt32LE(crc32(body), 16);
  central.writeUInt32LE(encoded.length, 20);
  central.writeUInt32LE(declared, 24);
  central.writeUInt16LE(raw.length, 28);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50);
  end.writeUInt16LE(1, 8);
  end.writeUInt16LE(1, 10);
  end.writeUInt32LE(46 + raw.length, 12);
  end.writeUInt32LE(30 + raw.length + encoded.length, 16);
  return Buffer.concat([local, raw, encoded, central, raw, end]);
}
test("HAR excludes all credentials and private endpoint segments", () => {
  const secret = "canaryPrivateCredentialValue";
  const result = inspect(
    JSON.stringify({
      log: {
        entries: [
          {
            request: {
              method: "GET",
              url:
                "https://user:" +
                secret +
                "@example.com/api/" +
                secret +
                "?token=" +
                secret,
              headers: [{ name: "Authorization", value: secret }],
              cookies: [{ name: "session", value: secret }],
              postData: { text: secret },
            },
            response: { status: 200, content: { text: secret } },
          },
        ],
      },
    }),
    "capture.har",
  );
  assert.equal(result.format, "har");
  assert.ok(result.evidence.some((x) => x.kind === "har.request"));
  assert.ok(!JSON.stringify(result).includes(secret));
  assert.ok(JSON.stringify(result).includes("[redacted]"));
});
test("target JavaScript remains inert while static signals are reported", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "eye-inert-"));
  try {
    const marker = path.join(dir, "executed");
    const source =
      "require('node:fs').writeFileSync(" +
      JSON.stringify(marker) +
      ",'bad'); ipcRenderer.invoke('hello'); const x='https://example.com/api/private?key=bad'";
    const file = path.join(dir, "target.js");
    fs.writeFileSync(file, source);
    const result = inspectEyeFile(file);
    assert.ok(result.evidence.some((x) => x.kind === "js.ipc"));
    assert.equal(fs.existsSync(marker), false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
test("checked bounds, large integers, malformed and oversized targets fail partial", () => {
  assert.throws(() => eyeRange(Buffer.alloc(4), -1, 1));
  assert.throws(() => eyeRange(Buffer.alloc(4), 3, 2));
  assert.throws(() => eyeU64(Buffer.alloc(8, 255), 0));
  assert.equal(inspect("{bad", "bad.har").partial, true);
  assert.ok(
    inspect(Buffer.alloc(EYE_LIMITS.inputBytes + 1), "huge").diagnostics.some(
      (x) => x.code === "input-limit",
    ),
  );
  assert.ok(
    inspectEyeFile("missing-eye-target").diagnostics.some(
      (x) => x.code === "target-read",
    ),
  );
});
test("ZIP decodes in memory and delegates child signals", () => {
  const result = inspect(
    zip("app.js", Buffer.from("ipcMain.handle('read')")),
    "a.apk",
  );
  assert.equal(result.format, "zip");
  assert.ok(result.evidence.some((x) => x.kind === "zip.entry"));
  assert.ok(result.evidence.some((x) => x.kind === "js.ipc"));
  assert.equal(result.diagnostics.length, 0);
});
test("ZIP blocks traversal encrypted entries inflation bombs and invalid CRC", () => {
  assert.ok(
    inspect(zip("../app.js", Buffer.from("safe")), "a.zip").diagnostics.some(
      (x) => x.code === "archive-path",
    ),
  );
  assert.ok(
    inspect(
      zip("app.js", Buffer.from("safe"), { flags: 1 }),
      "a.zip",
    ).evidence.some((x) => x.kind === "zip.encrypted"),
  );
  assert.ok(
    inspect(
      zip("app.js", Buffer.alloc(16), { declared: EYE_LIMITS.entryBytes + 1 }),
      "a.zip",
    ).diagnostics.some((x) => x.code === "inflate-limit"),
  );
  const bad = zip("app.js", Buffer.from("safe"));
  bad[14] ^= 1;
  assert.ok(inspect(bad, "a.zip").partial);
  assert.ok(inspect(Buffer.from("PK"), "bad.zip").partial);
});
test("ASAR inspects packed files and refuses external members", () => {
  const source = Buffer.from("ipcRenderer.send('channel')");
  const json = Buffer.from(
    JSON.stringify({
      files: {
        "app.js": { offset: "0", size: source.length },
        outside: { unpacked: true, size: 1 },
      },
    }),
  );
  const headerSize = 8 + json.length + ((4 - (json.length % 4)) % 4);
  const header = Buffer.alloc(8 + headerSize);
  header.writeUInt32LE(4);
  header.writeUInt32LE(headerSize, 4);
  header.writeUInt32LE(headerSize - 4, 8);
  header.writeUInt32LE(json.length, 12);
  json.copy(header, 16);
  const result = inspect(Buffer.concat([header, source]), "app.asar");
  assert.ok(result.evidence.some((x) => x.kind === "js.ipc"));
  assert.ok(result.evidence.some((x) => x.kind === "asar.external"));
});
test("PE ELF and Mach-O checked headers and truncation stay partial", () => {
  const pe = Buffer.alloc(512);
  pe.write("MZ");
  pe.writeUInt32LE(64, 60);
  pe.writeUInt32LE(0x4550, 64);
  pe.writeUInt16LE(0x8664, 68);
  pe.writeUInt16LE(240, 84);
  pe.writeUInt16LE(0x20b, 88);
  pe.writeUInt32LE(512, 148);
  const p = inspect(pe, "a.exe");
  assert.equal(p.format, "pe");
  assert.ok(p.evidence.some((x) => x.kind === "pe.header"));
  const elf = Buffer.alloc(64);
  Buffer.from([127, 69, 76, 70, 2, 1, 1]).copy(elf);
  elf.writeUInt16LE(64, 58);
  const e = inspect(elf, "a");
  assert.equal(e.format, "elf");
  assert.ok(e.evidence.some((x) => x.kind === "elf.header"));
  const mach = Buffer.alloc(32);
  mach.writeUInt32LE(0xfeedfacf);
  assert.ok(inspect(mach, "a").evidence.some((x) => x.kind === "macho.header"));
  for (const bytes of [
    pe.subarray(0, 70),
    elf.subarray(0, 20),
    mach.subarray(0, 12),
  ])
    assert.equal(inspect(bytes, "a").partial, true);
});
test("extra parsers augment both native inputs and archive children", () => {
  /** @type {import("../../dist/adapters/eye-types.js").EyeFormatParser} */
  const extension = {
    format: "extra",
    detect: () => true,
    parse: (data, ctx) =>
      ctx.observe(
        "extra",
        "Extra bounded parser sees inert bytes.",
        data.length,
      ),
  };
  const result = inspectEyeBuffer(
    zip("child.js", Buffer.from("hello")),
    "a.zip",
    [extension],
  );
  assert.equal(result.format, "zip");
  assert.equal(result.evidence.filter((x) => x.kind === "extra").length, 2);
});
test("byte fixtures across every native truncation boundary never throw", () => {
  const fixtures = [
    Buffer.from("MZ"),
    Buffer.from([127, 69, 76, 70]),
    Buffer.from([0xcf, 0xfa, 0xed, 0xfe]),
    Buffer.from([0xca, 0xfe, 0xba, 0xbe]),
  ];
  for (const prefix of fixtures)
    for (let size = prefix.length; size < 160; size++) {
      const data = Buffer.alloc(size);
      prefix.copy(data);
      assert.doesNotThrow(() => inspect(data, "fixture"));
    }
});

test("PE checked RVA tables expose declared library imports and named exports", () => {
  const b = Buffer.alloc(1024);
  b.write("MZ");
  b.writeUInt32LE(64, 60);
  b.writeUInt32LE(0x4550, 64);
  b.writeUInt16LE(240, 84);
  const o = 88;
  b.writeUInt16LE(0x20b, o);
  b.writeUInt32LE(1024, o + 60);
  b.writeUInt32LE(16, o + 108);
  b.writeUInt32LE(600, o + 112);
  b.writeUInt32LE(40, o + 116);
  b.writeUInt32LE(400, o + 120);
  b.writeUInt32LE(40, o + 124);
  b.writeUInt32LE(460, 400);
  b.writeUInt32LE(450, 412);
  b.writeUInt32LE(460, 416);
  b.write("KERNEL32.dll\0", 450);
  b.writeBigUInt64LE(500n, 460);
  b.write("ExitProcess\0", 502);
  b.writeUInt32LE(1, 616);
  b.writeUInt32LE(1, 624);
  b.writeUInt32LE(650, 632);
  b.writeUInt32LE(660, 636);
  b.writeUInt32LE(680, 650);
  b.write("PublicEntry\0", 680);
  const report = inspect(b, "a.exe");
  assert.ok(
    report.evidence.some(
      (x) =>
        x.kind === "pe.import" &&
        x.value !== null &&
        typeof x.value === "object" &&
        !Array.isArray(x.value) &&
        x.value.name === "ExitProcess",
    ),
  );
  assert.ok(
    report.evidence.some(
      (x) =>
        x.kind === "pe.export" &&
        x.value !== null &&
        typeof x.value === "object" &&
        !Array.isArray(x.value) &&
        x.value.name === "PublicEntry",
    ),
  );
});
test("ELF dynamic section resolves DT_NEEDED from its checked linked string table", () => {
  const b = Buffer.alloc(384);
  Buffer.from([127, 69, 76, 70, 2, 1, 1]).copy(b);
  b.writeBigUInt64LE(64n, 40);
  b.writeUInt16LE(64, 58);
  b.writeUInt16LE(3, 60);
  const strings = 128;
  b.writeUInt32LE(3, strings + 4);
  b.writeBigUInt64LE(256n, strings + 24);
  b.writeBigUInt64LE(32n, strings + 32);
  b.write("\0libfixture.so\0", 256);
  const dynamic = 192;
  b.writeUInt32LE(6, dynamic + 4);
  b.writeBigUInt64LE(320n, dynamic + 24);
  b.writeBigUInt64LE(32n, dynamic + 32);
  b.writeUInt32LE(1, dynamic + 40);
  b.writeBigUInt64LE(16n, dynamic + 56);
  b.writeBigUInt64LE(1n, 320);
  b.writeBigUInt64LE(1n, 328);
  const result = inspect(b, "a");
  assert.ok(
    result.evidence.some(
      (x) => x.kind === "elf.import-library" && x.value === "libfixture.so",
    ),
  );
});
test("Mach-O bounds dylib load command name to the command payload", () => {
  const b = Buffer.alloc(80);
  b.writeUInt32LE(0xfeedfacf);
  b.writeUInt32LE(1, 16);
  b.writeUInt32LE(48, 20);
  b.writeUInt32LE(12, 32);
  b.writeUInt32LE(48, 36);
  b.writeUInt32LE(24, 40);
  b.write("libfixture.dylib\0", 56);
  const result = inspect(b, "a");
  assert.ok(
    result.evidence.some(
      (x) =>
        x.kind === "macho.import-library" && x.value === "libfixture.dylib",
    ),
  );
  b.writeUInt32LE(100, 40);
  assert.ok(inspect(b, "a").diagnostics.some((x) => x.code === "macho-name"));
});
