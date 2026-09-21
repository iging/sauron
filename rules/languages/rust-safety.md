# Rust Safety and Reliability Standards

Defines guidelines for Rust systems covering ownership, error propagation, and memory safety.

---

## 1. Zero Unwrap Discipline

- **Forbid Panic in Production:** Production libraries and services must never call `unwrap()` or `expect()` on `Option` or `Result` types.
- **Pattern Matching:** Handle all possible variants exhaustively using `match`, `if let`, or the `?` question mark operator.
- **Custom Error Types:** Use `thiserror` or custom error enums with clear display implementations for library boundaries.

---

## 2. Memory Safety and Concurrency

- **Avoid Unsafe Blocks:** The `unsafe` keyword is strictly prohibited unless writing low-level FFI bindings audited and approved by security leads.
- **Borrow Checker Respect:** Structure data models to minimize unnecessary cloning. Prefer borrowed references where lifetimes are self-contained.
