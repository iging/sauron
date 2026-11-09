# Adapter contributor notes

Source adapters remain readable TypeScript. Bundle optimization belongs in build artifacts.

## Layout

- Keep imports together, then separate types, constants, helpers and exported entry points.
- Separate methods and parsing stages with blank lines.
- Use one declaration per statement in binary parsers so offsets and bounds checks are visible.
- Keep indentation and wrapping consistent with the existing formatted adapters.
- Preserve prompt text, output strings, regular expressions and public names during style work.

## Comments

Document contracts, safety limits, units and decisions which a caller cannot infer from a name.
For binary formats, explain offset bases, byte order, cursor advancement and bounded traversal.
For public APIs, state important side effects, partial results and failure conditions.

Keep original comments and source references. Avoid comments that only repeat an assignment.
Do not claim full validation, signature trust or runtime behavior from passive metadata.

## Boundaries

Runtime adapters implement RuntimeAdapter and return TranspileOutput values. The transpiler
registers them and routes project writes through ConflictManager. Local imports use explicit
.js suffixes. Shared types live in adapters/types.ts.

Eye helpers share one evidence ledger and nested-resource budget. Recognizers do not execute
targets. Unknown or unsupported details remain explicit rather than becoming implied guarantees.

Windows packaging helpers collect allowlisted assets and render drafts. Build/injection outputs
stay separate from user projects. The package root depends on the npm entry point or real SEA
executable path, not the working directory.

## Review

Keep readability edits separate from intended behavior changes in the diff. Check syntax,
build/typecheck and existing tests. Compare generated instructions and report values when
formatting touches code that produces user-facing text.
