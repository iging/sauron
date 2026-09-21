# Architecture Boundaries and Domain Isolation

Enforces architectural cleanliness, modular encapsulation, and hexagonal layering across all systems.

---

## 1. Domain Layering and Isolation

- **Inward Dependencies:** Outer layers (HTTP controllers, CLI entrypoints, database adapters) depend inward on domain entities. Domain business entities never depend on outer delivery mechanisms.
- **Isolated Domain Modules:** Sibling domains must communicate through explicit public interfaces or events, never through internal private classes.
- **Single Responsibility:** Each class, module, or component must have exactly one reason to change.

---

## 2. Interface Contracts and Decoupling

- **Program to Interfaces:** High-level policy must depend on abstract interfaces, allowing storage or messaging providers to swap without touching business logic.
- **No Leaky Abstractions:** Database entity models must not leak into HTTP responses. Map domain models to dedicated Data Transfer Objects (DTOs) before sending over the wire.
- **Zero Circular Dependencies:** Circular imports signal flawed responsibility boundaries and must be refactored immediately.
