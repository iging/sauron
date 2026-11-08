/// <reference types="node" />
/** @fileoverview Checked native image metadata. Never loads a target library.
 * https://learn.microsoft.com/en-us/windows/win32/debug/pe-format
 * https://raw.githubusercontent.com/bminor/glibc/master/elf/elf.h
 * https://raw.githubusercontent.com/apple-oss-distributions/xnu/main/EXTERNAL_HEADERS/mach-o/loader.h
 */
import {
  EYE_LIMITS,
  EyeContext,
  EyeParseError,
  eyeRange,
  eyeU16,
  eyeU32,
  eyeU64,
  eyeCString,
  eyeText,
  type EyeChildInspector,
  type EyeFormatParser,
} from "./eye-types.js";
function bounded(count: number, ctx: EyeContext, maximum = 1024): number {
  if (count > maximum)
    ctx.diagnostic(
      "table-limit",
      "Additional native table records exceed the inspection limit.",
    );
  return Math.min(count, maximum);
}
export function eyeNativeStrings(data: Buffer, ctx: EyeContext): void {
  let start = 0;
  let count = 0;
  for (let offset = 0; offset <= data.length; offset++) {
    const byte = data[offset];
    if (byte !== undefined && byte >= 32 && byte <= 126) continue;
    const size = offset - start;
    if (size >= 4) {
      const text = data
        .subarray(start, Math.min(offset, start + EYE_LIMITS.stringBytes))
        .toString("ascii");
      if (!/password|token|secret|authorization|cookie|private.key/i.test(text))
        ctx.observe(
          "native.string",
          "Printable byte string, not evidence of executed behavior.",
          eyeText(text),
          start,
          Math.min(size, EYE_LIMITS.stringBytes),
        );
      if (++count >= EYE_LIMITS.strings) {
        ctx.diagnostic(
          "string-limit",
          "Additional printable strings exceed the display limit.",
        );
        break;
      }
    }
    start = offset + 1;
  }
}
function parsePe(data: Buffer, ctx: EyeContext): void {
  const pe = eyeU32(data, 0x3c);
  if (eyeU32(data, pe) !== 0x00004550) throw new EyeParseError("pe-signature");
  const coff = pe + 4;
  const sectionCount = eyeU16(data, coff + 2);
  const optionalSize = eyeU16(data, coff + 16);
  const optional = coff + 20;
  const header = eyeRange(data, optional, optionalSize);
  const magic = eyeU16(header, 0);
  if (magic !== 0x10b && magic !== 0x20b)
    throw new EyeParseError("pe-optional");
  const wide = magic === 0x20b;
  const directories = wide ? 112 : 96;
  const directoryCount = eyeU32(header, wide ? 108 : 92);
  ctx.observe(
    "pe.header",
    "PE COFF and optional header fields.",
    {
      machine: eyeU16(data, coff),
      sections: sectionCount,
      bits: wide ? 64 : 32,
      entryRva: eyeU32(header, 16),
      characteristics: eyeU16(data, coff + 18),
    },
    pe,
    24 + optionalSize,
  );
  const sections: {
    rva: number;
    virtual: number;
    offset: number;
    size: number;
  }[] = [];
  for (let index = 0; index < bounded(sectionCount, ctx, 256); index++) {
    const offset = optional + optionalSize + index * 40;
    const section = eyeRange(data, offset, 40);
    const entry = {
      rva: eyeU32(section, 12),
      virtual: eyeU32(section, 8),
      offset: eyeU32(section, 20),
      size: eyeU32(section, 16),
    };
    eyeRange(data, entry.offset, entry.size);
    sections.push(entry);
    ctx.observe(
      "pe.section",
      "PE section declaration.",
      {
        name: section.subarray(0, 8).toString("ascii").replace(/\0.*$/, ""),
        ...entry,
        flags: eyeU32(section, 36),
      },
      offset,
      40,
    );
  }
  const rva = (address: number, length = 1): number => {
    const headers = eyeU32(header, 60);
    if (address < headers && length <= headers - address) {
      eyeRange(data, address, length);
      return address;
    }
    const found = sections.find(
      (section) =>
        address >= section.rva &&
        address - section.rva <= section.size &&
        length <= section.size - (address - section.rva),
    );
    if (!found) throw new EyeParseError("pe-rva");
    const result = found.offset + address - found.rva;
    eyeRange(data, result, length);
    return result;
  };
  const directory = (index: number): [number, number] =>
    index < directoryCount && directories + index * 8 + 8 <= header.length
      ? [
          eyeU32(header, directories + index * 8),
          eyeU32(header, directories + index * 8 + 4),
        ]
      : [0, 0];
  const [imports, importBytes] = directory(1);
  if (imports && importBytes) {
    const base = rva(imports, importBytes);
    for (
      let index = 0;
      index < bounded(Math.floor(importBytes / 20), ctx, 256);
      index++
    ) {
      const offset = base + index * 20;
      const lookup = eyeU32(data, offset);
      const name = eyeU32(data, offset + 12);
      const address = eyeU32(data, offset + 16);
      if (!lookup && !name && !address) break;
      const library = eyeCString(data, rva(name));
      ctx.observe(
        "pe.import-library",
        "Declared import library name.",
        library,
        offset,
        20,
      );
      const table = lookup || address;
      for (let symbol = 0; symbol < 512; symbol++) {
        const slot = rva(table + symbol * (wide ? 8 : 4), wide ? 8 : 4);
        const value = wide
          ? eyeRange(data, slot, 8).readBigUInt64LE()
          : BigInt(eyeU32(data, slot));
        if (value === 0n) break;
        const ordinalBit = wide ? 0x8000000000000000n : 0x80000000n;
        if (value & ordinalBit)
          ctx.observe(
            "pe.import",
            "Ordinal import declaration.",
            { library, ordinal: Number(value & 0xffffn) },
            slot,
          );
        else {
          if (value > BigInt(Number.MAX_SAFE_INTEGER))
            throw new EyeParseError("pe-rva");
          ctx.observe(
            "pe.import",
            "Named import declaration.",
            { library, name: eyeCString(data, rva(Number(value), 3) + 2) },
            slot,
          );
        }
        if (symbol === 511)
          ctx.diagnostic(
            "table-limit",
            "Further import symbols exceed the inspection limit.",
          );
      }
    }
  }
  const [exports, exportBytes] = directory(0);
  if (exports && exportBytes) {
    const base = rva(exports, 40);
    const names = eyeU32(data, base + 24);
    const table = eyeU32(data, base + 32);
    const ordinals = eyeU32(data, base + 36);
    for (let index = 0; index < bounded(names, ctx); index++)
      ctx.observe("pe.export", "Named export declaration.", {
        name: eyeCString(data, rva(eyeU32(data, rva(table + index * 4, 4)))),
        ordinal:
          eyeU32(data, base + 16) + eyeU16(data, rva(ordinals + index * 2, 2)),
      });
  }
  const [certificate, certificateBytes] = directory(4);
  if (certificate && certificateBytes) {
    eyeRange(data, certificate, certificateBytes);
    ctx.observe(
      "pe.certificate-table",
      "Certificate table file range is present. Trust is not verified.",
      { offset: certificate, bytes: certificateBytes },
    );
  }
  ctx.unknown(
    "native.behavior",
    "Imports, exports and strings do not establish executed behavior, and packed or dynamic code is not reconstructed.",
  );
  eyeNativeStrings(data, ctx);
}
function parseElf(data: Buffer, ctx: EyeContext): void {
  const bits = data[4];
  const encoding = data[5];
  if (![1, 2].includes(bits ?? 0) || ![1, 2].includes(encoding ?? 0))
    throw new EyeParseError("elf-header");
  const wide = bits === 2;
  const little = encoding === 1;
  const u16 = (offset: number) => eyeU16(data, offset, little);
  const u32 = (offset: number) => eyeU32(data, offset, little);
  const word = (offset: number) =>
    wide ? eyeU64(data, offset, little) : u32(offset);
  eyeRange(data, 0, wide ? 64 : 52);
  const start = word(wide ? 40 : 32);
  const entrySize = u16(wide ? 58 : 46);
  const count = u16(wide ? 60 : 48);
  const namesIndex = u16(wide ? 62 : 50);
  ctx.observe("elf.header", "ELF identification and file header.", {
    bits: wide ? 64 : 32,
    byteOrder: little ? "little" : "big",
    type: u16(16),
    machine: u16(18),
    entry: word(24),
    sections: count,
  });
  if (!count && start) {
    ctx.unknown("elf.extended", "Extended section counts are unsupported.");
    return;
  }
  if (count && entrySize < (wide ? 64 : 40))
    throw new EyeParseError("elf-section-size");
  const sections: {
    name: number;
    type: number;
    offset: number;
    size: number;
    link: number;
    entry: number;
  }[] = [];
  for (let index = 0; index < bounded(count, ctx); index++) {
    const offset = start + index * entrySize;
    eyeRange(data, offset, entrySize);
    const type = u32(offset + 4);
    const item = {
      name: u32(offset),
      type,
      offset: word(offset + (wide ? 24 : 16)),
      size: word(offset + (wide ? 32 : 20)),
      link: u32(offset + (wide ? 40 : 24)),
      entry: word(offset + (wide ? 56 : 36)),
    };
    if (type !== 8) eyeRange(data, item.offset, item.size);
    sections.push(item);
  }
  const names = namesIndex ? sections[namesIndex] : undefined;
  const string = (table: typeof names, index: number) => {
    if (!table || index >= table.size) throw new EyeParseError("elf-string");
    return eyeCString(eyeRange(data, table.offset, table.size), index);
  };
  for (const section of sections) {
    ctx.observe("elf.section", "ELF section declaration.", {
      name: names ? string(names, section.name) : "",
      type: section.type,
      offset: section.offset,
      bytes: section.size,
    });
    if (section.type === 6) {
      const stride = wide ? 16 : 8;
      const strings = sections[section.link];
      for (
        let index = 0;
        index < bounded(Math.floor(section.size / stride), ctx, 512);
        index++
      ) {
        const offset = section.offset + index * stride;
        const tag = word(offset);
        if (!tag) break;
        if (tag === 1)
          ctx.observe(
            "elf.import-library",
            "DT_NEEDED dynamic dependency.",
            string(strings, word(offset + (wide ? 8 : 4))),
            offset,
            stride,
          );
      }
    }
    if (section.type === 11) {
      const minimum = wide ? 24 : 16;
      if (section.entry < minimum) throw new EyeParseError("elf-symbol-size");
      const strings = sections[section.link];
      for (
        let index = 0;
        index < bounded(Math.floor(section.size / section.entry), ctx);
        index++
      ) {
        const offset = section.offset + index * section.entry;
        const name = u32(offset);
        const info = data[offset + (wide ? 4 : 12)] ?? 0;
        const sectionIndex = u16(offset + (wide ? 6 : 14));
        if (name && info >>> 4 !== 0)
          ctx.observe(
            sectionIndex ? "elf.export" : "elf.import",
            "Dynamic symbol table declaration.",
            {
              name: string(strings, name),
              binding: info >>> 4,
              type: info & 15,
            },
            offset,
            minimum,
          );
      }
    }
  }
  ctx.unknown(
    "native.behavior",
    "Dynamic symbols and strings do not establish executed behavior. Relocations and packed code are not reconstructed.",
  );
  eyeNativeStrings(data, ctx);
}
function parseMach(
  data: Buffer,
  ctx: EyeContext,
  inspect: EyeChildInspector,
): void {
  const magic = eyeU32(data, 0, false);
  if (
    magic === 0xcafebabe ||
    magic === 0xbebafeca ||
    magic === 0xcafebabf ||
    magic === 0xbfbafeca
  ) {
    const little = magic === 0xbebafeca || magic === 0xbfbafeca;
    const wide = magic === 0xcafebabf || magic === 0xbfbafeca;
    const count = eyeU32(data, 4, little);
    ctx.observe("macho.fat", "Universal Mach-O architecture table.", {
      architectures: count,
    });
    for (let index = 0; index < bounded(count, ctx, 64); index++) {
      const entry = 8 + index * (wide ? 32 : 20);
      const offset = wide
        ? eyeU64(data, entry + 8, little)
        : eyeU32(data, entry + 8, little);
      const size = wide
        ? eyeU64(data, entry + 16, little)
        : eyeU32(data, entry + 12, little);
      ctx.observe("macho.architecture", "Universal image slice declaration.", {
        cpu: eyeU32(data, entry, little),
        offset,
        bytes: size,
      });
      inspect(
        eyeRange(data, offset, size),
        "architecture-" + index,
        ctx.fork("architecture-" + index),
      );
    }
    return;
  }
  const little = magic === 0xcefaedfe || magic === 0xcffaedfe;
  const wide = magic === 0xfeedfacf || magic === 0xcffaedfe;
  const header = wide ? 32 : 28;
  eyeRange(data, 0, header);
  const u32 = (offset: number) => eyeU32(data, offset, little);
  const commands = u32(16);
  const commandBytes = u32(20);
  eyeRange(data, header, commandBytes);
  ctx.observe("macho.header", "Mach-O header declarations.", {
    bits: wide ? 64 : 32,
    cpu: u32(4),
    type: u32(12),
    commands,
  });
  let offset = header;
  for (let index = 0; index < bounded(commands, ctx); index++) {
    const command = u32(offset);
    const size = u32(offset + 4);
    if (size < 8 || size > header + commandBytes - offset)
      throw new EyeParseError("macho-command");
    const bytes = eyeRange(data, offset, size);
    if ([0xc, 0x18, 0x1f, 0x20, 0x80000018, 0x8000001f].includes(command)) {
      const name = eyeU32(bytes, 8, little);
      if (name >= size) throw new EyeParseError("macho-name");
      ctx.observe(
        "macho.import-library",
        "Dylib load command declaration.",
        eyeCString(bytes, name),
        offset,
        size,
      );
    }
    if (command === 1 || command === 0x19) {
      const segmentWide = command === 0x19;
      const count = eyeU32(bytes, segmentWide ? 64 : 48, little);
      const base = segmentWide ? 72 : 56;
      const stride = segmentWide ? 80 : 68;
      for (let section = 0; section < bounded(count, ctx, 256); section++) {
        const at = base + section * stride;
        const item = eyeRange(bytes, at, stride);
        const fileOffset = eyeU32(item, segmentWide ? 48 : 40, little);
        const sectionSize = segmentWide
          ? eyeU64(item, 40, little)
          : eyeU32(item, 36, little);
        const type = eyeU32(item, segmentWide ? 64 : 56, little) & 255;
        if (![1, 12, 18].includes(type))
          eyeRange(data, fileOffset, sectionSize);
        ctx.observe(
          "macho.section",
          "Mach-O section declaration.",
          {
            name: item.subarray(0, 16).toString("ascii").replace(/\0.*$/, ""),
            segment: item
              .subarray(16, 32)
              .toString("ascii")
              .replace(/\0.*$/, ""),
            offset: fileOffset,
            bytes: sectionSize,
          },
          offset + at,
          stride,
        );
      }
    }
    if (command === 2) {
      const symbolOffset = eyeU32(bytes, 8, little);
      const count = eyeU32(bytes, 12, little);
      const strings = eyeRange(
        data,
        eyeU32(bytes, 16, little),
        eyeU32(bytes, 20, little),
      );
      for (let symbol = 0; symbol < bounded(count, ctx); symbol++) {
        const entry = eyeRange(
          data,
          symbolOffset + symbol * (wide ? 16 : 12),
          wide ? 16 : 12,
        );
        const name = eyeU32(entry, 0, little);
        const type = entry[4] ?? 0;
        if (name && !(type & 0xe0) && type & 1)
          ctx.observe(
            (type & 0xe) === 0 ? "macho.import" : "macho.export",
            "External symbol table declaration.",
            eyeCString(strings, name),
          );
      }
    }
    offset += size;
  }
  if (offset !== header + commandBytes)
    ctx.diagnostic(
      "macho-command-size",
      "Load command byte count does not match parsed commands.",
    );
  ctx.unknown(
    "native.behavior",
    "Load commands, symbols and strings do not establish runtime behavior. Chained imports and code signatures are not verified here.",
  );
  eyeNativeStrings(data, ctx);
}
export const eyeNativeParsers: readonly EyeFormatParser[] = [
  {
    format: "pe",
    detect: (data) => data.length >= 2 && data[0] === 0x4d && data[1] === 0x5a,
    parse: parsePe,
  },
  {
    format: "elf",
    detect: (data) =>
      data.length >= 4 &&
      data.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])),
    parse: parseElf,
  },
  {
    format: "macho",
    detect: (data) =>
      data.length >= 4 &&
      [
        0xfeedface, 0xcefaedfe, 0xfeedfacf, 0xcffaedfe, 0xcafebabe, 0xbebafeca,
        0xcafebabf, 0xbfbafeca,
      ].includes(eyeU32(data, 0, false)),
    parse: parseMach,
  },
];
