# Strict TypeScript Engineering Standards

Enforces TypeScript 7+ strict-mode discipline, branded types, and schema validation.

---

## 1. Compiler and Type Discipline

- **Strict Mode Enforced:** Enable `strict: true`, `noImplicitAny: true`, and `exactOptionalPropertyTypes: true` in `tsconfig.json`.
- **Zero `any` Permitted:** The `any` type is strictly prohibited in production code. Use `unknown` with narrowing type guards if type cannot be known in advance.
- **Branded Primitives:** Brand sensitive identifiers (for example `UserId = string & { readonly __brand: unique symbol }`) to prevent passing arbitrary strings across entity boundaries.

---

## 2. Runtime Schema Parsing

- **Zod Schema Ingestion:** Parse all external network, disk, and user payloads through Zod schemas.
- **Type Derivation:** Derive TypeScript types directly from schemas using `z.infer<typeof Schema>` to keep runtime validation and static types synchronized.
- **No Unsafe Type Assertions:** Avoid `as Type` casts unless working with low-level DOM APIs where runtime guards have already confirmed the type.
