/** Bounded bytecode metadata. Target code is never loaded. */
import {
  EyeParseError,
  eyeRange as range,
  eyeU16 as u16,
  eyeU32 as u32,
  eyeCString,
  type EyeFormatParser,
} from "./eye-types.js";
function count(n: number, max = 2000): number {
  if (n > max) throw new EyeParseError("count-limit");
  return n;
}
function leb(d: Buffer, p: { n: number }): number {
  let v = 0;
  for (let i = 0; i < 5; i++) {
    const b = range(d, p.n++, 1)[0]!;
    if (i === 4 && b > 15) throw new EyeParseError("leb");
    v += (b & 127) * 2 ** (i * 7);
    if (!(b & 128)) return v;
  }
  throw new EyeParseError("leb");
}
function wasmName(d: Buffer, p: { n: number }): string {
  const size = leb(d, p);
  const text = range(d, p.n, size).subarray(0, 160).toString("utf8");
  p.n += size;
  return text;
}
function limits(d: Buffer, p: { n: number }): void {
  const flags = leb(d, p);
  if (flags > 3) throw new EyeParseError("wasm-limits");
  leb(d, p);
  if (flags & 1) leb(d, p);
}
const wasm: EyeFormatParser = {
  format: "WebAssembly",
  detect: (d) => d.subarray(0, 4).equals(Buffer.from([0, 97, 115, 109])),
  parse(d, c) {
    if (u32(d, 4) !== 1) throw new EyeParseError("wasm-version");
    let off = 8,
      sections = 0;
    while (off < d.length) {
      count(++sections);
      const p = { n: off };
      const id = range(d, p.n++, 1)[0]!;
      const size = leb(d, p);
      const body = range(d, p.n, size);
      off = p.n + size;
      c.observe("wasm.section", "WebAssembly section", { id, size }, p.n, size);
      const q = { n: 0 };
      if (id === 2) {
        const n = count(leb(body, q), 512);
        for (let i = 0; i < n; i++) {
          const module = wasmName(body, q),
            name = wasmName(body, q),
            kind = range(body, q.n++, 1)[0]!;
          if (kind === 0) leb(body, q);
          else if (kind === 1) {
            range(body, q.n++, 1);
            limits(body, q);
          } else if (kind === 2) limits(body, q);
          else if (kind === 3) {
            range(body, q.n, 2);
            q.n += 2;
          } else if (kind === 4) {
            leb(body, q);
            leb(body, q);
          } else throw new EyeParseError("wasm-import");
          c.observe("wasm.import", "Declared import", { module, name, kind });
        }
      }
      if (id === 7) {
        const n = count(leb(body, q), 512);
        for (let i = 0; i < n; i++) {
          const name = wasmName(body, q),
            kind = range(body, q.n++, 1)[0]!,
            index = leb(body, q);
          c.observe("wasm.export", "Declared export", { name, kind, index });
        }
      }
    }
    c.unknown(
      "wasm.execution",
      "Code sections are not interpreted or instantiated.",
    );
  },
};
const dex: EyeFormatParser = {
  format: "DEX",
  detect: (d) => d.subarray(0, 4).toString("ascii") === "dex\n",
  parse(d, c) {
    range(d, 0, 112);
    if (d[7] !== 0 || !/^\d{3}$/.test(d.subarray(4, 7).toString()))
      throw new EyeParseError("dex-magic");
    const endian = u32(d, 40);
    if (endian !== 0x12345678 && endian !== 0x78563412)
      throw new EyeParseError("dex-endian");
    const le = endian === 0x12345678;
    const size = u32(d, 32, le),
      header = u32(d, 36, le);
    if (size !== d.length || ![112, 136].includes(header))
      throw new EyeParseError("dex-size");
    range(d, 0, header);
    const tables = [
      ["strings", 56, 4],
      ["types", 64, 4],
      ["prototypes", 72, 12],
      ["fields", 80, 8],
      ["methods", 88, 8],
      ["classes", 96, 32],
    ] as const;
    for (const [name, at, stride] of tables) {
      const n = count(u32(d, at, le)),
        off = u32(d, at + 4, le);
      if (n) range(d, off, n * stride);
      c.observe("dex.table", "DEX identifier table", {
        name,
        count: n,
        offset: off,
      });
    }
    const strings = u32(d, 60, le),
      stringCount = u32(d, 56, le),
      types = u32(d, 68, le),
      typeCount = u32(d, 64, le);
    for (let i = 0; i < Math.min(typeCount, 128); i++) {
      const idx = u32(d, types + i * 4, le);
      if (idx >= stringCount) throw new EyeParseError("dex-index");
      const p = { n: u32(d, strings + idx * 4, le) };
      leb(d, p);
      const descriptor = eyeCString(d, p.n);
      if (/^[\[LZBSCIJFDV][\w/$;[\].-]{0,159}$/.test(descriptor))
        c.observe("dex.type", "Declared type descriptor", descriptor);
    }
    c.unknown(
      "dex.code",
      "Instruction bodies, checksums and runtime behavior are not validated.",
    );
  },
};
const pyc: EyeFormatParser = {
  format: "Python bytecode",
  detect: (d, n) =>
    /\.pyc$/i.test(n) ||
    (d[2] === 13 &&
      d[3] === 10 &&
      d.length >= 4 &&
      u16(d, 0) >= 3390 &&
      u16(d, 0) < 4000),
  parse(d, c) {
    range(d, 0, 16);
    const magic = u16(d, 0);
    if (d[2] !== 13 || d[3] !== 10 || magic < 3390 || magic >= 4000)
      throw new EyeParseError("pyc-version");
    const flags = u32(d, 4);
    if (flags > 3 || flags === 2) throw new EyeParseError("pyc-flags");
    c.observe(
      "python.header",
      "PEP 552 bytecode header",
      {
        magic,
        flags,
        mode: flags & 1 ? "hash" : "timestamp",
        ...(flags & 1
          ? { sourceHash: range(d, 8, 8).toString("hex") }
          : { timestamp: u32(d, 8), sourceSize: u32(d, 12) }),
      },
      0,
      16,
    );
    c.unknown(
      "python.code",
      "Marshal data is not loaded; magic alone does not establish the exact interpreter.",
    );
  },
};
function androidStrings(d: Buffer): string[] {
  const header = u16(d, 2),
    total = u32(d, 4),
    n = count(u32(d, 8)),
    styles = count(u32(d, 12)),
    flags = u32(d, 16),
    start = u32(d, 20);
  if (header < 28 || total !== d.length) throw new EyeParseError("xml-pool");
  range(d, header, (n + styles) * 4);
  const result: string[] = [];
  for (let i = 0; i < n; i++) {
    let off = start + u32(d, header + i * 4);
    const read8 = () => {
      const b = range(d, off++, 1)[0]!;
      return b & 128 ? ((b & 127) << 8) | range(d, off++, 1)[0]! : b;
    };
    const read16 = () => {
      const b = u16(d, off);
      off += 2;
      if (!(b & 0x8000)) return b;
      const x = u16(d, off);
      off += 2;
      return (b & 0x7fff) * 65536 + x;
    };
    if (flags & 256) {
      read8();
      const bytes = read8();
      const raw = range(d, off, bytes);
      if (range(d, off + bytes, 1)[0] !== 0)
        throw new EyeParseError("xml-string");
      result.push(raw.subarray(0, 160).toString("utf8"));
    } else {
      const units = read16();
      const raw = range(d, off, units * 2);
      if (u16(d, off + units * 2) !== 0) throw new EyeParseError("xml-string");
      result.push(raw.subarray(0, 320).toString("utf16le"));
    }
  }
  return result;
}
const android: EyeFormatParser = {
  format: "Android binary XML",
  detect: (d, n) =>
    /AndroidManifest\.xml$/i.test(n) && d.length >= 2 && u16(d, 0) === 3,
  parse(d, c) {
    if (u16(d, 2) !== 8 || u32(d, 4) !== d.length)
      throw new EyeParseError("xml-size");
    let off = 8,
      chunks = 0,
      strings: string[] = [];
    const str = (i: number) => {
      if (i === 0xffffffff) return "";
      if (i >= strings.length) throw new EyeParseError("xml-index");
      return strings[i]!;
    };
    while (off < d.length) {
      count(++chunks);
      const type = u16(d, off),
        head = u16(d, off + 2),
        size = u32(d, off + 4);
      if (head < 8 || size < head) throw new EyeParseError("xml-chunk");
      const b = range(d, off, size);
      if (type === 1) strings = androidStrings(b);
      if (type === 0x102) {
        if (head !== 16) throw new EyeParseError("xml-node");
        const element = str(u32(b, 20)),
          start = 16 + u16(b, 24),
          stride = u16(b, 26),
          n = count(u16(b, 28), 256);
        if (stride < 20) throw new EyeParseError("xml-attribute");
        range(b, start, n * stride);
        const attrs: { [key: string]: string | number } = {};
        for (let i = 0; i < n; i++) {
          const a = start + i * stride,
            name = str(u32(b, a + 4)),
            raw = u32(b, a + 8),
            t = range(b, a + 15, 1)[0]!,
            v = u32(b, a + 16);
          if (
            /^(package|minSdkVersion|targetSdkVersion|name|versionName|versionCode|exported|permission)$/.test(
              name,
            )
          ) {
            const value =
              raw !== 0xffffffff ? str(raw) : t === 3 ? str(v) : String(v);
            if (/^[\w.$:/-]{0,160}$/.test(value)) attrs[name] = value;
          }
        }
        c.observe(
          "android.element",
          "Manifest element",
          { element, attributes: attrs },
          off,
          size,
        );
      }
      off += size;
    }
    c.unknown(
      "android.resources",
      "Resource references and compiled application behavior are not resolved.",
    );
  },
};
function peDirectory(
  d: Buffer,
  index: number,
):
  | { offset: number; size: number; map: (rva: number, size: number) => number }
  | undefined {
  if (d.length < 64 || d.subarray(0, 2).toString() !== "MZ") return;
  const pe = u32(d, 60);
  if (range(d, pe, 4).toString("binary") !== "PE\0\0")
    throw new EyeParseError("pe");
  const n = count(u16(d, pe + 6), 512),
    opt = pe + 24,
    optSize = u16(d, pe + 20),
    magic = u16(d, opt);
  const base = magic === 0x10b ? 96 : magic === 0x20b ? 112 : 0;
  if (!base) throw new EyeParseError("pe-optional");
  const optional = range(d, opt, optSize);
  if (
    u32(optional, base - 4) <= index ||
    optional.length < base + (index + 1) * 8
  )
    return;
  const sections = opt + optSize;
  range(d, sections, n * 40);
  const map = (rva: number, size: number) => {
    if (rva < u32(optional, 60)) {
      range(d, rva, size);
      return rva;
    }
    for (let i = 0; i < n; i++) {
      const s = sections + i * 40,
        va = u32(d, s + 12),
        raw = u32(d, s + 16);
      if (rva >= va && rva - va < raw && size <= raw - (rva - va)) {
        const at = u32(d, s + 20) + rva - va;
        range(d, at, size);
        return at;
      }
    }
    throw new EyeParseError("pe-rva");
  };
  return {
    offset: u32(optional, base + index * 8),
    size: u32(optional, base + index * 8 + 4),
    map,
  };
}
const managed: EyeFormatParser = {
  format: ".NET metadata",
  detect: (d) => d.subarray(0, 2).toString() === "MZ",
  parse(d, c) {
    const dir = peDirectory(d, 14);
    if (!dir?.offset || !dir.size) return;
    const at = dir.map(dir.offset, dir.size),
      cli = range(d, at, dir.size);
    if (cli.length < 72 || u32(cli, 0) < 72)
      throw new EyeParseError("cli-header");
    const root = range(d, dir.map(u32(cli, 8), u32(cli, 12)), u32(cli, 12));
    if (u32(root, 0) !== 0x424a5342) throw new EyeParseError("metadata-root");
    const vlen = count(u32(root, 12), 256);
    range(root, 16, vlen);
    let p = (16 + vlen + 3) & ~3;
    const n = count(u16(root, p + 2), 64);
    p += 4;
    c.observe(
      "dotnet.runtime",
      "CLI runtime metadata",
      { major: u16(cli, 4), minor: u16(cli, 6), metadataBytes: root.length },
      at,
      dir.size,
    );
    for (let i = 0; i < n; i++) {
      const off = u32(root, p),
        size = u32(root, p + 4);
      let end = p + 8;
      while (end < root.length && end < p + 40 && root[end] !== 0) end++;
      if (end === root.length || end === p + 40)
        throw new EyeParseError("stream-name");
      const name = range(root, p + 8, end - p - 8).toString("ascii");
      p = (end + 4) & ~3;
      range(root, off, size);
      c.observe("dotnet.stream", "CLI metadata stream", {
        name: /^#(?:~|-|Strings|Blob|US|GUID)$/.test(name) ? name : "other",
        size,
      });
    }
    c.unknown(
      "dotnet.code",
      "Metadata stream boundaries are checked; IL, heap values and assembly trust are not evaluated.",
    );
  },
};
const peSignature: EyeFormatParser = {
  format: "PE signature",
  detect: (d) => d.subarray(0, 2).toString() === "MZ",
  parse(d, c) {
    const dir = peDirectory(d, 4);
    if (!dir?.offset || !dir.size) {
      c.observe("signature.container", "No PE certificate table declared");
      return;
    }
    const table = range(d, dir.offset, dir.size);
    let p = 0,
      n = 0;
    while (p < table.length) {
      count(++n, 128);
      const len = u32(table, p);
      if (len < 8) throw new EyeParseError("certificate-length");
      range(table, p, len);
      c.observe(
        "signature.certificate",
        "WIN_CERTIFICATE container",
        { revision: u16(table, p + 4), type: u16(table, p + 6), bytes: len },
        dir.offset + p,
        len,
      );
      const next = p + Math.ceil(len / 8) * 8;
      if (next > table.length && p + len !== table.length)
        throw new EyeParseError("certificate-padding");
      p = next;
    }
    c.unknown(
      "signature.trust",
      "Certificate presence is not signature verification, signer identity or a trust-chain result.",
    );
  },
};
export const BYTECODE_PARSERS: readonly EyeFormatParser[] = [
  wasm,
  dex,
  pyc,
  android,
  managed,
  peSignature,
];
