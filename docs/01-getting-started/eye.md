# Sauron Eye

Eye reads files as inert data and emits bounded static evidence. It never executes a target,
contacts a server, installs dependencies, extracts archives to disk, or repairs files.
Use only targets you own or are authorized to inspect. Source text remains untrusted data.

## Commands

~~~bash
sauron eye app.exe
sauron eye capture.har --json
sauron eye app.asar --json --out evidence.json
sauron eye diff old.zip new.zip --json
sauron eye export app.wasm --out evidence.json
sauron eye reuse evidence.json app.wasm --json
sauron eye mcp
~~~

Without --out, only stdout changes. --out creates exactly one new UTF-8 report inside the
current workspace, through ConflictManager. Parent directories must already exist and be
real directories. Existing files, hardlinks, symlinks and outside paths are refused.
There is no implicit manifest, backup, directory or extraction write.

Reports contain target SHA-256, format, partial flag, diagnostics and evidence IDs.
Observed describes bytes or declared metadata. Inferred cites evidence and a reason. Unknown
names a limit. A partial report is an inspection with gaps, not a safety verdict.
Invalid options/output writes exit 2. Unreadable or unsupported inputs return partial reports.
Parser exceptions and raw target bodies are never echoed.

## Implemented scope

| Family | Static evidence | Limits |
| :-- | :-- | :-- |
| HAR | Redacted domains/routes, methods/status and third-party counts | No headers, cookies, bodies or query values |
| JavaScript / Electron | Package identity, entry points, URLs and IPC signals | Patterns only, no execution/deobfuscation |
| ZIP / APK / ASAR | Checked entries, file types and nested signals | No disk extraction, encrypted/ZIP64/external ASAR access |
| PE / ELF / Mach-O | Headers, sections, imports, exports and bounded strings | No disassembly, dynamic loading or chained-fixup reconstruction |
| Android binary XML | String pool, elements and selected manifest attributes | Resource references unresolved |
| DEX | Identifier table boundaries and type descriptors | No instructions, checksum validation or decompilation |
| .NET | CLI runtime and metadata stream names/sizes | No IL or heap reconstruction |
| WebAssembly | Sections, declared imports and exports | No instantiation or code interpretation |
| Go / Rust | Runtime markers and inline Go version | Forgeable signals, no provenance guarantee |
| Python bytecode | Modern PEP 552 header and invalidation mode | No marshal loading or exact-version claim |
| SQLite | Header and first B-tree page pointers | No SQL, row values, WAL recovery or later-page traversal |
| PCAP / PCAPNG | Headers, records, interfaces and counts | Payloads/addresses omitted, no replay |
| Minidump / ELF core | Dump directory/system/exception metadata or declared core | No unwinding, reconstruction or cause claim |
| UF2 / uImage / FIT / Intel HEX | Block/image/device-tree metadata and checked HEX records | No flashing/decompression/execution, uImage CRC remains unknown |
| PE / Mach-O signatures | Certificate/embedded slot container metadata | No signer identity, code hashes, chain trust or notarization verification |

Unknown versions, unsupported encodings, truncated tables, packed/encrypted content and limits
produce explicit gaps. Native strings can remain private after token-pattern redaction.
Review reports before sharing. Generic long token-like values, including evidence digests,
can be redacted. Top-level target SHA-256 remains available for identity checks.

## Resource, comparison and reuse rules

Input: 32 MiB. Inflated entry: 4 MiB. Shared inflation: 16 MiB. Archive/HAR entries: 2,000.
Nested depth: 4. Evidence: 4,000. Diagnostics: 100. Tables add local count/length limits.
Linked ancestors and non-regular inputs are refused. Node path APIs cannot guarantee stable
parent directories against a concurrent hostile filesystem rename.

Diff compares multisets of classification, facts, values, reasons and nested source paths.
Root filenames and offsets alone do not imply a semantic change. Both full bounded reports
remain attached. Static equality does not prove equivalent behavior.

Export is the normal JSON ledger. Reuse accepts a regular report up to 8 MiB, rejects linked
ancestors, and re-inspects the target. SHA-256 and the entire fresh evidence must match.
Imported claims never become trusted findings or instructions. Reuse is not a speed promise.

## MCP stdio

MCP revision 2025-06-18 uses newline-delimited JSON-RPC on stdin/stdout. Initialize, then call
tools/list or tools/call. The sole tool sauron_eye takes one workspace-relative path.
It refuses traversal/links and returns the same ledger. No write tool or network transport.
Messages cap at 1 MiB and oversized lines recover at the next newline. Stdout is protocol only.
Launch sauron eye mcp from the authorized project root. Do not expose a workspace containing
files the caller cannot read.

~~~json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"local","version":"1"}}}
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"sauron_eye","arguments":{"path":"app.wasm"}}}
~~~

## References and verification

Public references, without copied parser source:
[Wasm](https://webassembly.github.io/spec/core/binary/modules.html),
[DEX](https://source.android.com/docs/core/runtime/dex-format),
[Android resources](https://github.com/aosp-mirror/platform_frameworks_base/blob/main/libs/androidfw/include/androidfw/ResourceTypes.h),
[ECMA-335](https://ecma-international.org/publications-and-standards/standards/ecma-335/),
[PEP 552](https://peps.python.org/pep-0552/), [Go buildinfo](https://go.dev/src/debug/buildinfo/buildinfo.go),
[SQLite](https://www.sqlite.org/fileformat.html), [UF2](https://github.com/microsoft/uf2),
[Minidump](https://learn.microsoft.com/en-us/windows/win32/api/minidumpapiset/ns-minidumpapiset-minidump_header),
[MCP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports).
PCAP/PCAPNG structures follow published IETF drafts, not full protocol validation.

Fixtures cover supported formats, malformed/oversized input, inflate limits, inert targets,
HAR secret canaries, signature unknowns and CLI/MCP output boundaries.
Real reports on Miguel's own build and svla HAR remain unverified. Miguel explicitly defers
those two checks on 2026-11-08 because the files are not available yet.
