/** Read-only database, capture, crash and firmware structure inspection. */
import {
  EyeParseError,
  eyeRange as range,
  eyeU16 as u16,
  eyeU32 as u32,
  eyeHash,
  type EyeFormatParser,
} from "./eye-types.js";
const cap = (n: number, max = 2000) => {
  if (n > max) throw new EyeParseError("count-limit");
  return n;
};
const sqlite: EyeFormatParser = {
  format: "SQLite",
  detect: (d) => d.subarray(0, 16).toString("binary") === "SQLite format 3\0",
  parse(d, c) {
    range(d, 0, 100);
    const raw = u16(d, 16, false),
      pageSize = raw === 1 ? 65536 : raw;
    if (
      pageSize < 512 ||
      pageSize > 65536 ||
      pageSize & (pageSize - 1) ||
      d.length % pageSize
    )
      throw new EyeParseError("sqlite-page");
    const pages = d.length / pageSize,
      declared = u32(d, 28, false);
    if (declared > pages) throw new EyeParseError("sqlite-size");
    c.observe(
      "sqlite.header",
      "SQLite database header",
      {
        pageSize,
        pages,
        declaredPages: declared,
        encoding: u32(d, 56, false),
        userVersion: u32(d, 60, false),
        applicationId: u32(d, 68, false),
      },
      0,
      100,
    );
    const first = 100,
      type = range(d, first, 1)[0]!;
    if (![2, 5, 10, 13].includes(type)) throw new EyeParseError("sqlite-btree");
    const cells = u16(d, first + 3, false),
      header = type === 2 || type === 5 ? 12 : 8;
    range(d, first, header + cells * 2);
    if (first + header + cells * 2 > pageSize)
      throw new EyeParseError("sqlite-cells");
    for (let i = 0; i < cells; i++) {
      const off = u16(d, first + header + i * 2, false);
      if (off < first + header + cells * 2 || off >= pageSize)
        throw new EyeParseError("sqlite-cell");
    }
    c.observe(
      "sqlite.btree",
      "First page B-tree",
      { type, cells },
      first,
      header,
    );
    c.unknown(
      "sqlite.contents",
      "No SQL engine runs; row contents, WAL recovery and subsequent B-trees are not decoded.",
    );
  },
};
const pcapMagic = new Set(["d4c3b2a1", "a1b2c3d4", "4d3cb2a1", "a1b23c4d"]);
const pcap: EyeFormatParser = {
  format: "PCAP",
  detect: (d) => pcapMagic.has(d.subarray(0, 4).toString("hex")),
  parse(d, c) {
    range(d, 0, 24);
    const magic = d.subarray(0, 4).toString("hex"),
      le = magic === "d4c3b2a1" || magic === "4d3cb2a1";
    if (u16(d, 4, le) !== 2 || u16(d, 6, le) !== 4)
      throw new EyeParseError("pcap-version");
    const snap = u32(d, 16, le),
      link = u32(d, 20, le);
    if (!snap || snap > 16 * 1024 * 1024) throw new EyeParseError("pcap-snap");
    c.observe(
      "pcap.header",
      "Packet capture metadata",
      {
        linkType: link,
        snapshotBytes: snap,
        nanoseconds: magic === "4d3cb2a1" || magic === "a1b23c4d",
      },
      0,
      24,
    );
    let off = 24,
      n = 0,
      total = 0;
    while (off < d.length) {
      cap(++n);
      const size = u32(d, off + 8, le),
        original = u32(d, off + 12, le);
      if (size > snap || size > original)
        throw new EyeParseError("pcap-record");
      range(d, off + 16, size);
      total += size;
      off += 16 + size;
    }
    c.observe("pcap.records", "Bounded packet records", {
      packets: n,
      capturedBytes: total,
    });
    c.unknown(
      "pcap.payload",
      "Packet payloads, addresses and credentials are deliberately omitted; no replay or capture occurs.",
    );
  },
};
const pcapng: EyeFormatParser = {
  format: "PCAPNG",
  detect: (d) => d.subarray(0, 4).toString("hex") === "0a0d0d0a",
  parse(d, c) {
    let off = 0,
      n = 0,
      le = true,
      interfaces = 0,
      packets = 0;
    while (off < d.length) {
      cap(++n);
      if (d.subarray(off, off + 4).toString("hex") === "0a0d0d0a") {
        const bom = d.subarray(off + 8, off + 12).toString("hex");
        if (!["4d3c2b1a", "1a2b3c4d"].includes(bom))
          throw new EyeParseError("pcapng-bom");
        le = bom === "4d3c2b1a";
        interfaces = 0;
      }
      const type = u32(d, off, le),
        size = u32(d, off + 4, le);
      if (size < 12 || size % 4) throw new EyeParseError("pcapng-block");
      const b = range(d, off, size);
      if (u32(b, size - 4, le) !== size)
        throw new EyeParseError("pcapng-trailer");
      if (type === 0x0a0d0d0a) {
        if (size < 28 || u16(b, 12, le) !== 1)
          throw new EyeParseError("pcapng-section");
      } else if (type === 1) {
        if (size < 20) throw new EyeParseError("pcapng-interface");
        cap(++interfaces, 128);
        c.observe("pcapng.interface", "Capture interface", {
          linkType: u16(b, 8, le),
          snapshotBytes: u32(b, 12, le),
        });
      } else if (type === 6) {
        if (size < 32 || u32(b, 8, le) >= interfaces)
          throw new EyeParseError("pcapng-packet");
        const bytes = u32(b, 20, le);
        if (bytes > u32(b, 24, le) || 28 + Math.ceil(bytes / 4) * 4 > size - 4)
          throw new EyeParseError("pcapng-packet");
        packets++;
      }
      off += size;
    }
    c.observe("pcapng.records", "Capture blocks", { blocks: n, packets });
    c.unknown(
      "pcapng.payload",
      "Only block, interface and enhanced-packet metadata are decoded; other blocks and payloads remain unknown.",
    );
  },
};
const minidump: EyeFormatParser = {
  format: "Minidump",
  detect: (d) => d.subarray(0, 4).toString() === "MDMP",
  parse(d, c) {
    range(d, 0, 32);
    if (u16(d, 4) !== 0xa793) throw new EyeParseError("minidump-version");
    const n = cap(u32(d, 8)),
      dir = u32(d, 12);
    range(d, dir, n * 12);
    c.observe(
      "crash.header",
      "Windows minidump directory",
      { streams: n },
      0,
      32,
    );
    for (let i = 0; i < n; i++) {
      const at = dir + i * 12,
        type = u32(d, at),
        size = u32(d, at + 4),
        off = u32(d, at + 8);
      const b = range(d, off, size);
      c.observe("crash.stream", "Minidump stream", { type, size }, off, size);
      if (type === 7) {
        range(b, 0, 56);
        c.observe("crash.system", "Dump system metadata", {
          architecture: u16(b, 0),
          major: u32(b, 8),
          minor: u32(b, 12),
          build: u32(b, 16),
        });
      }
      if (type === 6) {
        range(b, 0, 168);
        c.observe("crash.exception", "Recorded exception", {
          threadId: u32(b, 0),
          code: u32(b, 8),
          address: "0x" + range(b, 24, 8).readBigUInt64LE().toString(16),
        });
      }
      if (type === 3) {
        const threads = cap(u32(b, 0));
        range(b, 4, threads * 48);
        c.observe("crash.threads", "Recorded thread count", threads);
      }
    }
    c.unknown(
      "crash.stack",
      "No stack unwinding, memory reconstruction or crash-cause claim is performed.",
    );
  },
};
const elfCore: EyeFormatParser = {
  format: "ELF core",
  detect: (d) =>
    d.subarray(0, 4).toString("hex") === "7f454c46" &&
    d.length >= 18 &&
    u16(d, 16, d[5] !== 2) === 4,
  parse(d, c) {
    if (![1, 2].includes(d[4]!) || ![1, 2].includes(d[5]!) || d[6] !== 1)
      throw new EyeParseError("elf-core-header");
    range(d, 0, d[4] === 2 ? 64 : 52);
    c.observe("crash.elf", "ELF declares a core dump");
    c.unknown("crash.stack", "ELF notes and stacks are not unwound.");
  },
};
const uf2: EyeFormatParser = {
  format: "UF2 firmware",
  detect: (d) => d.subarray(0, 8).toString("hex") === "5546320a57515d9e",
  parse(d, c) {
    if (d.length % 512) throw new EyeParseError("uf2-size");
    const blocks = cap(d.length / 512),
      seen = new Set<number>();
    let total: number | undefined;
    for (let i = 0; i < blocks; i++) {
      const b = range(d, i * 512, 512);
      if (
        u32(b, 0) !== 0x0a324655 ||
        u32(b, 4) !== 0x9e5d5157 ||
        u32(b, 508) !== 0x0ab16f30
      )
        throw new EyeParseError("uf2-magic");
      const size = u32(b, 16),
        index = u32(b, 20),
        declared = u32(b, 24);
      if (
        size > 476 ||
        !declared ||
        index >= declared ||
        seen.has(index) ||
        (total !== undefined && total !== declared)
      )
        throw new EyeParseError("uf2-block");
      seen.add(index);
      total = declared;
      c.observe(
        "firmware.block",
        "UF2 block metadata",
        {
          index,
          total: declared,
          flags: u32(b, 8),
          address: u32(b, 12),
          payloadBytes: size,
          familyOrFileSize: u32(b, 28),
        },
        i * 512,
        512,
      );
    }
    if (total !== blocks)
      c.unknown("firmware.incomplete", "Declared blocks are missing.");
    c.unknown(
      "firmware.execution",
      "Payloads are not flashed, run or instruction-decoded.",
    );
  },
};
const uimage: EyeFormatParser = {
  format: "U-Boot uImage",
  detect: (d) => d.subarray(0, 4).toString("hex") === "27051956",
  parse(d, c, child) {
    range(d, 0, 64);
    const size = u32(d, 12, false),
      payload = range(d, 64, size);
    c.observe(
      "firmware.header",
      "Legacy U-Boot image metadata",
      {
        payloadBytes: size,
        load: u32(d, 16, false),
        entry: u32(d, 20, false),
        os: d[28]!,
        architecture: d[29]!,
        type: d[30]!,
        compression: d[31]!,
        payloadSha256: eyeHash(payload),
      },
      0,
      64,
    );
    if (d[31] === 0)
      child(payload, "firmware-payload", c.fork("firmware-payload"));
    else
      c.unknown(
        "firmware.compression",
        "Compressed payload is not expanded by this parser.",
      );
    c.unknown(
      "firmware.integrity",
      "Legacy header/data CRC and execution behavior are not validated.",
    );
  },
};
const fit: EyeFormatParser = {
  format: "FIT/Device Tree",
  detect: (d) => d.subarray(0, 4).toString("hex") === "d00dfeed",
  parse(d, c) {
    range(d, 0, 40);
    const total = u32(d, 4, false),
      so = u32(d, 8, false),
      st = u32(d, 12, false),
      ss = u32(d, 36, false),
      ns = u32(d, 32, false);
    if (total !== d.length || u32(d, 20, false) < 17)
      throw new EyeParseError("fit-header");
    const structure = range(d, so, ss),
      names = range(d, st, ns);
    let p = 0,
      tokens = 0,
      depth = 0,
      ended = false;
    while (p < structure.length) {
      cap(++tokens);
      const token = u32(structure, p, false);
      p += 4;
      if (token === 1) {
        let end = structure.indexOf(0, p);
        if (end < 0 || end - p > 160) throw new EyeParseError("fit-node");
        const name = structure.subarray(p, end).toString("utf8");
        p = Math.ceil((end + 1) / 4) * 4;
        cap(++depth, 64);
        c.observe("firmware.node", "Device tree node", name);
      } else if (token === 2) {
        if (--depth < 0) throw new EyeParseError("fit-depth");
      } else if (token === 3) {
        const len = u32(structure, p, false),
          nameAt = u32(structure, p + 4, false);
        p += 8;
        const value = range(structure, p, len);
        p += Math.ceil(len / 4) * 4;
        range(names, nameAt, 1);
        const end = names.indexOf(0, nameAt);
        if (end < 0 || end - nameAt > 80) throw new EyeParseError("fit-name");
        const name = names.subarray(nameAt, end).toString("ascii");
        if (name === "data")
          c.observe("firmware.payload", "Embedded image bytes", {
            bytes: len,
            sha256: eyeHash(value),
          });
        else if (/^(arch|os|type|compression|algo)$/.test(name)) {
          const text = value
            .subarray(0, 80)
            .toString("ascii")
            .replace(/\0+$/, "");
          if (/^[\w,+.-]*$/.test(text))
            c.observe("firmware.property", "Device tree property", {
              name,
              value: text,
            });
        }
      } else if (token === 4) continue;
      else if (token === 9) {
        if (depth !== 0) throw new EyeParseError("fit-depth");
        ended = true;
        break;
      } else throw new EyeParseError("fit-token");
    }
    if (!ended) throw new EyeParseError("fit-end");
    c.unknown(
      "firmware.signature",
      "Device tree structure does not establish image authenticity or successful boot.",
    );
  },
};
const ihex: EyeFormatParser = {
  format: "Intel HEX",
  detect: (d, n) => /\.hex$/i.test(n) && d[0] === 58,
  parse(d, c) {
    let records = 0,
      bytes = 0,
      eof = false,
      base = 0;
    for (const line of d.toString("ascii").split(/\r?\n/)) {
      if (!line.trim()) continue;
      cap(++records);
      if (eof || !/^:[0-9a-f]+$/i.test(line) || line.length % 2 !== 1)
        throw new EyeParseError("hex-record");
      const b = Buffer.from(line.slice(1), "hex"),
        n = b[0];
      if (
        n === undefined ||
        b.length !== n + 5 ||
        b.reduce((a, x) => a + x, 0) % 256
      )
        throw new EyeParseError("hex-checksum");
      const type = b[3]!,
        address = u16(b, 1, false);
      if (type === 0) {
        if (base + address + n > 0x100000000)
          throw new EyeParseError("hex-address");
        bytes += n;
      } else if (type === 1) {
        if (n || address) throw new EyeParseError("hex-eof");
        eof = true;
      } else if (type === 2 || type === 4) {
        if (n !== 2 || address) throw new EyeParseError("hex-base");
        base = u16(b, 4, false) * (type === 2 ? 16 : 65536);
      } else if (type === 3 || type === 5) {
        if (n !== 4) throw new EyeParseError("hex-entry");
      } else throw new EyeParseError("hex-type");
    }
    if (!eof) throw new EyeParseError("hex-eof");
    c.observe("firmware.hex", "Validated Intel HEX records", {
      records,
      dataBytes: bytes,
    });
    c.unknown(
      "firmware.execution",
      "Records are not materialized, flashed or executed.",
    );
  },
};
export const CONTAINER_PARSERS: readonly EyeFormatParser[] = [
  sqlite,
  pcap,
  pcapng,
  minidump,
  elfCore,
  uf2,
  uimage,
  fit,
  ihex,
];
