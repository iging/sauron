// @ts-check
import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import childProcess from "node:child_process";
import vm from "node:vm";
import { inspectEyeBuffer } from "../../dist/adapters/eye-core.js";
import { ADVANCED_EYE_PARSERS } from "../../dist/adapters/eye-advanced.js";
import { EYE_LIMITS } from "../../dist/adapters/eye-types.js";

/** @param {Buffer} b @param {number} at @param {number} n */
const u16 = (b, at, n) => b.writeUInt16LE(n, at);
/** @param {Buffer} b @param {number} at @param {number} n */
const u32 = (b, at, n) => b.writeUInt32LE(n, at);
/** @param {Buffer} b @param {number} at @param {number} n */
const be = (b, at, n) => b.writeUInt32BE(n, at);
/** @param {Buffer} data @param {string} [name] */
const inspect = (data, name = "fixture.bin") =>
  inspectEyeBuffer(data, name, ADVANCED_EYE_PARSERS);
/** @param {import("../../dist/adapters/eye-types.js").EyeReport} report @param {string} kind @param {import("../../dist/adapters/eye-types.js").EyeEvidence["status"]} [status] */
const has = (report, kind, status = "observed") =>
  report.evidence.some((e) => e.kind === kind && e.status === status);
/** @param {Buffer} bytes @param {(copy: Buffer) => unknown} fn */
const changed = (bytes, fn) => {
  const copy = Buffer.from(bytes);
  fn(copy);
  return copy;
};
/** @param {number} n */
const leb = (n) => {
  const out = [];
  do {
    const byte = n & 127;
    n >>>= 7;
    out.push(byte | (n ? 128 : 0));
  } while (n);
  return Buffer.from(out);
};
/** @param {string} s */
const nameBytes = (s) =>
  Buffer.concat([leb(Buffer.byteLength(s)), Buffer.from(s)]);
/** @param {number} id @param {Buffer} bytes */
const section = (id, bytes) =>
  Buffer.concat([Buffer.from([id]), leb(bytes.length), bytes]);
function wasm() {
  return Buffer.concat([
    Buffer.from("0061736d01000000", "hex"),
    section(1, Buffer.from([1, 0x60, 0, 0])),
    section(
      2,
      Buffer.concat([
        leb(1),
        nameBytes("env"),
        nameBytes("log"),
        Buffer.from([0, 0]),
      ]),
    ),
    section(7, Buffer.concat([leb(1), nameBytes("run"), Buffer.from([0, 0])])),
  ]);
}
function dex() {
  const text = Buffer.from("Ldemo/Main;\0"),
    b = Buffer.alloc(121 + text.length);
  b.write("dex\n035\0", 0, "binary");
  u32(b, 32, b.length);
  u32(b, 36, 112);
  u32(b, 40, 0x12345678);
  u32(b, 56, 1);
  u32(b, 60, 112);
  u32(b, 64, 1);
  u32(b, 68, 116);
  u32(b, 112, 120);
  b[120] = 11;
  text.copy(b, 121);
  return b;
}
function android() {
  const strings = ["manifest", "package", "com.example.app"];
  const encoded = strings.map((s) =>
    Buffer.concat([
      Buffer.from([s.length, s.length]),
      Buffer.from(s),
      Buffer.from([0]),
    ]),
  );
  const pool = Buffer.alloc(
    28 + strings.length * 4 + encoded.reduce((n, b) => n + b.length, 0),
  );
  u16(pool, 0, 1);
  u16(pool, 2, 28);
  u32(pool, 4, pool.length);
  u32(pool, 8, strings.length);
  u32(pool, 16, 256);
  u32(pool, 20, 40);
  let off = 0;
  encoded.forEach((b, i) => {
    u32(pool, 28 + i * 4, off);
    b.copy(pool, 40 + off);
    off += b.length;
  });
  const node = Buffer.alloc(56);
  u16(node, 0, 0x102);
  u16(node, 2, 16);
  u32(node, 4, 56);
  u32(node, 16, 0xffffffff);
  u32(node, 20, 0);
  u16(node, 24, 20);
  u16(node, 26, 20);
  u16(node, 28, 1);
  u32(node, 36, 0xffffffff);
  u32(node, 40, 1);
  u32(node, 44, 2);
  u16(node, 48, 8);
  node[51] = 3;
  u32(node, 52, 2);
  const end = Buffer.alloc(24);
  u16(end, 0, 0x103);
  u16(end, 2, 16);
  u32(end, 4, 24);
  u32(end, 16, 0xffffffff);
  u32(end, 20, 0);
  const b = Buffer.concat([Buffer.alloc(8), pool, node, end]);
  u16(b, 0, 3);
  u16(b, 2, 8);
  u32(b, 4, b.length);
  return b;
}
function pe() {
  const b = Buffer.alloc(1024);
  b.write("MZ");
  u32(b, 60, 64);
  b.write("PE\0\0", 64, "binary");
  u16(b, 68, 0x14c);
  u16(b, 84, 224);
  const opt = 88;
  u16(b, opt, 0x10b);
  u32(b, opt + 60, 1024);
  u32(b, opt + 92, 16);
  return b;
}
function dotnet() {
  const b = pe(),
    opt = 88;
  u32(b, opt + 96 + 14 * 8, 512);
  u32(b, opt + 96 + 14 * 8 + 4, 72);
  u32(b, 512, 72);
  u16(b, 516, 2);
  u16(b, 518, 5);
  u32(b, 520, 600);
  u32(b, 524, 80);
  be(b, 600, 0x42534a42);
  u32(b, 612, 4);
  b.write("v4\0\0", 616, "binary");
  u16(b, 622, 1);
  u32(b, 624, 40);
  u32(b, 628, 4);
  b.write("#~\0", 632, "binary");
  return b;
}
function peSigned(count = 1) {
  const b = Buffer.concat([pe(), Buffer.alloc(count * 8)]);
  u32(b, 88 + 96 + 4 * 8, 1024);
  u32(b, 88 + 96 + 4 * 8 + 4, count * 8);
  for (let i = 0; i < count; i++) {
    u32(b, 1024 + i * 8, 8);
    u16(b, 1028 + i * 8, 0x200);
    u16(b, 1030 + i * 8, 2);
  }
  return b;
}
function macho(count = 1) {
  const b = Buffer.alloc(44 + 12 + count * 8 + count * 8);
  b.write("cefaedfe", 0, "hex");
  u32(b, 4, 7);
  u32(b, 12, 2);
  u32(b, 16, 1);
  u32(b, 20, 16);
  u32(b, 28, 0x1d);
  u32(b, 32, 16);
  u32(b, 36, 44);
  u32(b, 40, b.length - 44);
  be(b, 44, 0xfade0cc0);
  be(b, 48, b.length - 44);
  be(b, 52, count);
  for (let i = 0; i < count; i++) {
    be(b, 56 + i * 8, i);
    be(b, 60 + i * 8, 12 + count * 8 + i * 8);
    be(b, 44 + 12 + count * 8 + i * 8, 0xfade0c02);
    be(b, 48 + 12 + count * 8 + i * 8, 8);
  }
  return b;
}
function go() {
  const b = Buffer.alloc(32);
  Buffer.from("ff20476f206275696c64696e663a", "hex").copy(b);
  b[14] = 8;
  b[15] = 2;
  return Buffer.concat([b, nameBytes("go1.23.0")]);
}
function pyc() {
  const b = Buffer.alloc(20);
  u16(b, 0, 3495);
  b[2] = 13;
  b[3] = 10;
  u32(b, 8, 1700000000);
  u32(b, 12, 100);
  return b;
}
function sqlite() {
  const b = Buffer.alloc(512);
  b.write("SQLite format 3\0", 0, "binary");
  b.writeUInt16BE(512, 16);
  b[18] = 1;
  b[19] = 1;
  be(b, 28, 1);
  be(b, 56, 1);
  b[100] = 13;
  b.writeUInt16BE(512, 105);
  return b;
}
function pcap(count = 1) {
  const b = Buffer.alloc(24 + count * 16);
  b.write("d4c3b2a1", 0, "hex");
  u16(b, 4, 2);
  u16(b, 6, 4);
  u32(b, 16, 65535);
  u32(b, 20, 1);
  return b;
}
/** @param {number} type @param {number} size */
function ngBlock(type, size) {
  const b = Buffer.alloc(size);
  u32(b, 0, type);
  u32(b, 4, size);
  u32(b, size - 4, size);
  return b;
}
function pcapng(interfaces = 1) {
  const sh = ngBlock(0x0a0d0d0a, 28);
  u32(sh, 8, 0x1a2b3c4d);
  u16(sh, 12, 1);
  sh.fill(255, 16, 24);
  const id = ngBlock(1, 20);
  u16(id, 8, 1);
  u32(id, 12, 65535);
  const packet = ngBlock(6, 32);
  return Buffer.concat([
    sh,
    ...Array.from({ length: interfaces }, () => id),
    packet,
  ]);
}
function dump() {
  const b = Buffer.alloc(100);
  b.write("MDMP");
  u16(b, 4, 0xa793);
  u32(b, 8, 1);
  u32(b, 12, 32);
  u32(b, 32, 7);
  u32(b, 36, 56);
  u32(b, 40, 44);
  u16(b, 44, 9);
  u32(b, 52, 10);
  u32(b, 60, 22621);
  return b;
}
function core() {
  const b = Buffer.alloc(64);
  b.write("7f454c46", 0, "hex");
  b[4] = 2;
  b[5] = 1;
  b[6] = 1;
  u16(b, 16, 4);
  u16(b, 18, 62);
  u32(b, 20, 1);
  u16(b, 52, 64);
  u16(b, 54, 56);
  u16(b, 58, 64);
  return b;
}
function uf2(count = 1) {
  const b = Buffer.alloc(512 * count);
  for (let i = 0; i < count; i++) {
    const at = i * 512;
    u32(b, at, 0x0a324655);
    u32(b, at + 4, 0x9e5d5157);
    u32(b, at + 16, 4);
    u32(b, at + 20, i);
    u32(b, at + 24, count);
    u32(b, at + 508, 0x0ab16f30);
  }
  return b;
}
function uimage() {
  const b = Buffer.alloc(68);
  be(b, 0, 0x27051956);
  be(b, 12, 4);
  b[28] = 5;
  b[29] = 2;
  b[30] = 2;
  b[31] = 1;
  return b;
}
/** @param {Buffer} [tokens] */
function fit(tokens) {
  const tree = tokens ?? Buffer.from("00000001000000000000000200000009", "hex");
  const b = Buffer.alloc(40 + tree.length + 5);
  be(b, 0, 0xd00dfeed);
  be(b, 4, b.length);
  be(b, 8, 40);
  be(b, 12, 40 + tree.length);
  be(b, 20, 17);
  be(b, 24, 16);
  be(b, 32, 5);
  be(b, 36, tree.length);
  tree.copy(b, 40);
  b.write("arch\0", 40 + tree.length, "binary");
  return b;
}
/** @param {number} type @param {Buffer} [payload] @param {number} [address] */
function hexRecord(type, payload = Buffer.alloc(0), address = 0) {
  const b = Buffer.alloc(payload.length + 5);
  b[0] = payload.length;
  b.writeUInt16BE(address, 1);
  b[3] = type;
  payload.copy(b, 4);
  b[b.length - 1] = -b.reduce((n, x) => n + x, 0) & 255;
  return ":" + b.toString("hex").toUpperCase();
}
const ihex = () =>
  Buffer.from(
    hexRecord(0, Buffer.from([1, 2, 3, 4])) + "\n" + hexRecord(1) + "\n",
  );

/** @type {Array<[label: string, fixture: () => Buffer, name: string, kind: string]>} */
const formats = [
  ["Android XML", android, "AndroidManifest.xml", "android.element"],
  ["DEX", dex, "classes.dex", "dex.type"],
  [".NET in PE", dotnet, "app.exe", "dotnet.stream"],
  ["Wasm", wasm, "module.wasm", "wasm.import"],
  ["Go", go, "go.bin", "go.version"],
  [
    "Rust",
    () => Buffer.from("rust_eh_personality\0/rustc/demo\0"),
    "rust.bin",
    "rust.marker",
  ],
  ["Python", pyc, "module.pyc", "python.header"],
  ["SQLite", sqlite, "database.sqlite", "sqlite.btree"],
  ["PCAP", pcap, "traffic.pcap", "pcap.records"],
  ["PCAPNG", pcapng, "traffic.pcapng", "pcapng.records"],
  ["Minidump", dump, "crash.dmp", "crash.system"],
  ["ELF core", core, "core", "crash.elf"],
  ["UF2", uf2, "firmware.uf2", "firmware.block"],
  ["uImage", uimage, "firmware.img", "firmware.header"],
  ["FIT", fit, "firmware.itb", "firmware.node"],
  ["Intel HEX", ihex, "firmware.hex", "firmware.hex"],
  ["PE signature", peSigned, "signed.exe", "signature.certificate"],
  ["Mach-O signature", macho, "signed.macho", "signature.blob"],
];

describe("Advanced Eye static format fixtures", () => {
  for (const [label, fixture, name, kind] of formats) {
    it(label + " records checked metadata from a hand-written fixture", () => {
      const bytes = fixture(),
        original = Buffer.from(bytes),
        report = inspect(bytes, name);
      assert.ok(has(report, kind), JSON.stringify(report));
      assert.deepEqual(bytes, original);
      assert.ok(report.evidence.every((e) => e.source === name));
    });
    it(label + " obeys the global input byte limit before parsing", () => {
      const bytes = Buffer.alloc(EYE_LIMITS.inputBytes + 1);
      fixture().copy(bytes);
      const report = inspect(bytes, name);
      assert.ok(report.diagnostics.some((d) => d.code === "input-limit"));
      assert.equal(report.evidence.length, 0);
    });
  }
  it("Wasm exposes both import and export names without instantiation", () => {
    const report = inspect(wasm(), "m.wasm");
    assert.ok(has(report, "wasm.export"));
    assert.ok(has(report, "wasm.execution", "unknown"));
    assert.deepEqual(
      JSON.parse(
        JSON.stringify(
          report.evidence.find((e) => e.kind === "wasm.import")?.value,
        ),
      ),
      { module: "env", name: "log", kind: 0 },
    );
  });
  it("Android XML decodes pool names and the package attribute", () => {
    assert.deepEqual(
      JSON.parse(
        JSON.stringify(
          inspect(android(), "AndroidManifest.xml").evidence.find(
            (e) => e.kind === "android.element",
          )?.value,
        ),
      ),
      { element: "manifest", attributes: { package: "com.example.app" } },
    );
  });
  it("both signature containers keep cryptographic trust unknown", () => {
    for (const bytes of [peSigned(), macho()]) {
      const report = inspect(bytes);
      assert.ok(has(report, "signature.trust", "unknown"));
      assert.equal(
        report.evidence.some(
          (e) => e.kind === "signature.trust" && e.status !== "unknown",
        ),
        false,
      );
    }
  });
});

/** @type {Array<[label: string, fixture: () => Buffer, name: string, code: string]>} */
const malformed = [
  [
    "Android pool count",
    () => changed(android(), (b) => u32(b, 16, 2001)),
    "AndroidManifest.xml",
    "count-limit",
  ],
  [
    "Android attribute stride",
    () => changed(android(), (b) => u16(b, b.length - 80 + 26, 0)),
    "AndroidManifest.xml",
    "xml-attribute",
  ],
  [
    "DEX table count",
    () => changed(dex(), (b) => u32(b, 56, 2001)),
    "bad.dex",
    "count-limit",
  ],
  [
    "DEX type index",
    () => changed(dex(), (b) => u32(b, 116, 1)),
    "bad.dex",
    "dex-index",
  ],
  [
    ".NET stream count",
    () => changed(dotnet(), (b) => u16(b, 622, 65)),
    "bad.exe",
    "count-limit",
  ],
  [
    ".NET root size",
    () => changed(dotnet(), (b) => u32(b, 524, 0xffffffff)),
    "bad.exe",
    "bounds",
  ],
  [
    "Wasm import count",
    () =>
      Buffer.concat([
        Buffer.from("0061736d01000000", "hex"),
        section(2, leb(513)),
      ]),
    "bad.wasm",
    "count-limit",
  ],
  [
    "Wasm truncated body",
    () => Buffer.from("0061736d0100000002ff7f", "hex"),
    "bad.wasm",
    "bounds",
  ],
  [
    "Go pointer size",
    () => changed(go(), (b) => (b[14] = 3)),
    "bad-go",
    "go-header",
  ],
  [
    "Go overlong varint",
    () => Buffer.concat([go().subarray(0, 32), Buffer.alloc(5, 255)]),
    "bad-go",
    "go-varint",
  ],
  [
    "Python invalid flags",
    () => changed(pyc(), (b) => u32(b, 4, 2)),
    "bad.pyc",
    "pyc-flags",
  ],
  ["Python short header", () => pyc().subarray(0, 8), "bad.pyc", "bounds"],
  [
    "SQLite bad page size",
    () => changed(sqlite(), (b) => b.writeUInt16BE(513, 16)),
    "bad.sqlite",
    "sqlite-page",
  ],
  [
    "SQLite cell pointer count",
    () => changed(sqlite(), (b) => b.writeUInt16BE(300, 103)),
    "bad.sqlite",
    "bounds",
  ],
  ["PCAP record count", () => pcap(2001), "bad.pcap", "count-limit"],
  [
    "PCAP oversized snapshot",
    () => changed(pcap(), (b) => u32(b, 16, 0xffffffff)),
    "bad.pcap",
    "pcap-snap",
  ],
  ["PCAPNG interface count", () => pcapng(129), "bad.pcapng", "count-limit"],
  [
    "PCAPNG block trailer",
    () => changed(pcapng(), (b) => u32(b, 24, 12)),
    "bad.pcapng",
    "pcapng-trailer",
  ],
  [
    "Minidump stream count",
    () => changed(dump(), (b) => u32(b, 8, 2001)),
    "bad.dmp",
    "count-limit",
  ],
  [
    "Minidump oversized stream",
    () => changed(dump(), (b) => u32(b, 36, 0xffffffff)),
    "bad.dmp",
    "bounds",
  ],
  ["UF2 block count", () => uf2(2001), "bad.uf2", "count-limit"],
  [
    "UF2 payload size",
    () => changed(uf2(), (b) => u32(b, 16, 477)),
    "bad.uf2",
    "uf2-block",
  ],
  [
    "uImage oversized payload",
    () => changed(uimage(), (b) => be(b, 12, 0xffffffff)),
    "bad.img",
    "bounds",
  ],
  ["uImage short header", () => uimage().subarray(0, 16), "bad.img", "bounds"],
  [
    "FIT token count",
    () =>
      fit(
        Buffer.concat([
          Buffer.alloc(8000, 0).map((_, i) => (i % 4 === 3 ? 4 : 0)),
          Buffer.from("00000009", "hex"),
        ]),
      ),
    "bad.itb",
    "count-limit",
  ],
  [
    "FIT structure range",
    () => changed(fit(), (b) => be(b, 36, 0xffffffff)),
    "bad.itb",
    "bounds",
  ],
  [
    "Intel HEX record count",
    () => Buffer.from((hexRecord(0) + "\n").repeat(2001) + hexRecord(1)),
    "bad.hex",
    "count-limit",
  ],
  [
    "Intel HEX checksum",
    () => Buffer.from(":040000000102030400\n:00000001FF\n"),
    "bad.hex",
    "hex-checksum",
  ],
  ["PE certificate count", () => peSigned(129), "bad.exe", "count-limit"],
  [
    "PE oversized certificate",
    () => changed(peSigned(), (b) => u32(b, 1024, 0xffffffff)),
    "bad.exe",
    "bounds",
  ],
  ["Mach-O slot count", () => macho(129), "bad.macho", "signature-count"],
  [
    "Mach-O oversized child",
    () => changed(macho(), (b) => be(b, 68, 0xffffffff)),
    "bad.macho",
    "bounds",
  ],
];
describe("Advanced Eye malformed and count limits", () => {
  for (const [label, fixture, name, code] of malformed)
    it(label + " fails closed", () => {
      const report = inspect(fixture(), name);
      assert.ok(report.partial);
      assert.ok(
        report.diagnostics.some((d) => d.code === code),
        JSON.stringify(report.diagnostics),
      );
    });
  it("Rust is only an inferred language signal and never an authenticity claim", () => {
    const report = inspect(Buffer.from("rust_eh_personality"));
    assert.ok(has(report, "language.rust", "inferred"));
    assert.ok(has(report, "rust.provenance", "unknown"));
  });
  it("partial Rust markers do not establish a language", () => {
    const report = inspect(Buffer.from("rust_eh_personalit /rust"));
    assert.equal(has(report, "rust.marker"), false);
    assert.equal(has(report, "language.rust", "inferred"), false);
  });
  it("truncated ELF core cannot establish a valid core image", () => {
    const report = inspect(core().subarray(0, 18));
    assert.ok(report.diagnostics.length > 0);
    assert.equal(has(report, "crash.elf"), false);
  });
  it("all fixtures remain inert with process, filesystem and runtime execution blocked", () => {
    /** @type {string[]} */
    const calls = [];
    /** @param {string} name */
    const deny = (name) => () => {
      calls.push(name);
      throw new Error("Forbidden target side effect: " + name);
    };
    try {
      for (const name of /** @type {const} */ ([
        "exec",
        "execSync",
        "execFile",
        "execFileSync",
        "spawn",
        "spawnSync",
        "fork",
      ]))
        mock.method(childProcess, name, deny(name));
      for (const name of /** @type {const} */ ([
        "writeFileSync",
        "appendFileSync",
        "unlinkSync",
        "renameSync",
        "mkdirSync",
        "openSync",
        "readFileSync",
      ]))
        mock.method(fs, name, deny(name));
      mock.method(WebAssembly, "instantiate", deny("instantiate"));
      mock.method(WebAssembly, "compile", deny("compile"));
      mock.method(vm, "runInNewContext", deny("runInNewContext"));
      mock.method(vm, "runInThisContext", deny("runInThisContext"));
      mock.method(globalThis, "fetch", deny("fetch"));
      for (const [, fixture, name, kind] of formats)
        assert.ok(has(inspect(fixture(), name), kind));
      assert.deepEqual(calls, []);
    } finally {
      mock.restoreAll();
    }
  });
});
