# Defensive Programming Standards

Defines patterns to eliminate null pointer bugs, memory safety issues, and runtime exceptions.

---

## 1. Input Boundary Validation

- **Parse at the Boundary:** Never validate downstream. Parse incoming network payloads, user inputs, and disk reads at system entrypoints using strict schemas.
- **Fail Early:** If an input violates schema constraints, reject immediately before initiating database transactions or invoking domain services.

---

## 2. Null Safety and Optional Handling

- **Exhaustive Null Checks:** Treat all external data as nullable until validated. Use optional chaining and nullish coalescing operators.
- **No Force Unwrapping:** Prohibit non-null assertions (for example `value!` in TypeScript or `unwrap()` in Rust) in production code without preceding explicit guard conditions.
- **Explicit Default Fallbacks:** Supply explicit fallback defaults rather than letting `undefined` propagate through state layers.

---

## 3. Resource Cleanup and Lifecycle

- **Deterministic Disposal:** Guarantee cleanup of open files, database connections, sockets, and timers via `finally` blocks or `using` declarations.
- **Idempotent Operations:** Design state-mutating operations to handle retries safely without producing duplicate side-effects.
