# Testing Pyramid Standards

Defines requirements for building deterministic, high-confidence automated test suites.

---

## 1. The Three Testing Layers

- **Unit Tests:** Test pure logic and algorithms in isolation. Execute in milliseconds with zero network or filesystem dependencies.
- **Integration Tests:** Test interactions between database queries, services, and route handlers. Use ephemeral, isolated test databases.
- **End-to-End Tests:** Verify end-to-end user journeys through the browser or public API boundary.

---

## 2. Test Determinism and Flakiness Elimination

- **Zero Hardcoded Timeouts:** Never use arbitrary `sleep` calls. Wait exclusively on observable state changes or auto-retrying assertions.
- **User-Facing Locators:** In web and UI tests, find elements using semantic accessibility roles (`getByRole`, `getByLabel`) rather than brittle CSS or XPath selectors.
- **Hermetic Test Environments:** Every test must set up its own state and clean up after execution. Tests must never depend on the execution order of other tests.
