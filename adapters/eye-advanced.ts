/** Additive static language signals and Mach-O signature containers. */
import { BYTECODE_PARSERS } from "./eye-bytecode.js";
import { CONTAINER_PARSERS } from "./eye-containers.js";
import {
  EyeParseError,
  eyeRange as range,
  eyeU32 as u32,
  eyeHash,
  type EyeFormatParser,
} from "./eye-types.js";

/** Classify embedded Go/Rust markers as forgeable language signals, not provenance. */
const languages: EyeFormatParser = {
  format: "Language signals",
  detect: (d) =>
    d.includes(Buffer.from("\xff Go buildinf:", "binary")) ||
    d.includes(Buffer.from("rust_eh_personality")) ||
    d.includes(Buffer.from("/rustc/")),
  parse(d, c) {
    const go = d.indexOf(Buffer.from("\xff Go buildinf:", "binary"));

    if (go >= 0) {
      const header = range(d, go, 32);
      const pointerSize = header[14]!;
      const flags = header[15]!;

      if (![4, 8].includes(pointerSize) || flags > 3)
        throw new EyeParseError("go-header");

      const id = c.observe(
        "go.buildinfo",
        "Go build-information marker",
        { pointerSize, flags },
        go,
        32,
      );
      c.infer(
        "language.go",
        "Go toolchain signal",
        "The target contains a Go build-information header.",
        [id],
      );
      if (flags & 2) {
        let p = go + 32;
        let len = 0;
        let shift = 0;

        for (let i = 0; i < 5; i++) {
          const b = range(d, p++, 1)[0]!;
          len += (b & 127) * 2 ** shift;
          shift += 7;
          if (!(b & 128)) break;
          if (i === 4) throw new EyeParseError("go-varint");
        }
        const value = range(d, p, len).subarray(0, 80).toString("ascii");

        if (/^go\d+\.\d+(?:\.\d+)?(?:[a-z]+\d*)?$/.test(value))
          c.observe("go.version", "Embedded toolchain version", value, p, len);
      }
      c.unknown(
        "go.provenance",
        "Build information can be forged; pointer-based metadata and module settings are not followed.",
      );
    }

    const marker = d.indexOf(Buffer.from("rust_eh_personality"));
    const rustc = d.indexOf(Buffer.from("/rustc/"));

    if (marker >= 0 || rustc >= 0) {
      const at = marker >= 0 ? marker : rustc;
      const id = c.observe(
        "rust.marker",
        "Rust compiler/runtime marker",
        { marker: marker >= 0 ? "rust_eh_personality" : "/rustc/" },
        at,
      );
      c.infer(
        "language.rust",
        "Rust toolchain signal",
        "An embedded runtime/compiler marker suggests Rust; it does not prove authorship.",
        [id],
      );
      c.unknown(
        "rust.provenance",
        "Compiler identity, crate versions and source paths are not reconstructed.",
      );
    }
  },
};

/** Read Mach-O signature slot boundaries without claiming identity or notarization. */
const machoSignature: EyeFormatParser = {
  format: "Mach-O signature",
  detect: (d) =>
    ["cefaedfe", "cffaedfe", "feedface", "feedfacf"].includes(
      d.subarray(0, 4).toString("hex"),
    ),
  parse(d, c) {
    const magic = d.subarray(0, 4).toString("hex");
    const le = magic.endsWith("edfe");
    const wide = magic === "cffaedfe" || magic === "feedfacf";
    const header = wide ? 32 : 28;
    const n = u32(d, 16, le);
    const bytes = u32(d, 20, le);

    if (n > 2000) throw new EyeParseError("macho-count");
    range(d, header, bytes);
    let p = header;
    let found = false;

    for (let i = 0; i < n; i++) {
      const cmd = u32(d, p, le);
      const size = u32(d, p + 4, le);

      if (size < 8 || p + size > header + bytes)
        throw new EyeParseError("macho-command");
      if (cmd === 0x1d) {
        found = true;
        if (size < 16) throw new EyeParseError("macho-signature");

        const off = u32(d, p + 8, le);
        const len = u32(d, p + 12, le);
        const blob = range(d, off, len);

        if (u32(blob, 0, false) !== 0xfade0cc0 || u32(blob, 4, false) !== len)
          throw new EyeParseError("signature-superblob");

        const count = u32(blob, 8, false);

        if (count > 128) throw new EyeParseError("signature-count");
        range(blob, 12, count * 8);
        for (let j = 0; j < count; j++) {
          const type = u32(blob, 12 + j * 8, false);
          const child = u32(blob, 16 + j * 8, false);
          const length = u32(blob, child + 4, false);

          if (length < 8) throw new EyeParseError("signature-length");

          const data = range(blob, child, length);
          c.observe(
            "signature.blob",
            "Mach-O embedded signature slot",
            {
              type,
              magic: "0x" + u32(data, 0, false).toString(16),
              bytes: length,
              sha256: eyeHash(data),
            },
            off + child,
            length,
          );
        }
      }
      p += size;
    }
    if (!found)
      c.observe(
        "signature.container",
        "No Mach-O code-signature command declared",
      );
    else
      c.unknown(
        "signature.trust",
        "Signature blob presence does not establish code hashes, signer identity, notarization or certificate trust.",
      );
  },
};

/** Combine additive parsers without replacing the base container/native evidence. */
export const ADVANCED_EYE_PARSERS: readonly EyeFormatParser[] = [
  ...BYTECODE_PARSERS,
  ...CONTAINER_PARSERS,
  languages,
  machoSignature,
];
