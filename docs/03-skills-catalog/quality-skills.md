# Quality & Testing Skills

The Quality domain houses skills that govern automated testing, test-driven development, code coverage, error handling, and technical debt reduction.

---

## Standalone Quality Skills

| Skill                    | Owner   | Command                 | Purpose                                                                                   |
| ------------------------ | ------- | ----------------------- | ----------------------------------------------------------------------------------------- |
| **write-a-test**         | Merry   | `/write-a-test`         | Scaffolds deterministic unit, integration, and E2E tests using Vitest or Playwright.      |
| **testing-principles**   | Merry   | `/testing-principles`   | Enforces testing pyramid discipline, user-centric locators, and flaky test prevention.    |
| **error-handling**       | Merry   | `/error-handling`       | Enforces structured exception hierarchies, fail-closed patterns, and error boundaries.    |
| **tech-debt-principles** | Gimli   | `/tech-debt-principles` | Identifies and refactors dead code, circular dependencies, and high-complexity functions. |
| **design-principles**    | Aragorn | `/design-principles`    | Validates SOLID principles, component encapsulation, and single responsibility rules.     |
| **design-tokens**        | Aragorn | `/design-tokens`        | Validates consistency across typography, color palettes, and spacing scales.              |

---

## Testing Pyramid Standards

Merry structures tests across three distinct layers:

1. **Unit Tests (Vitest / Jest)**:
   - Test pure business logic and helper functions in isolation.
   - Run in milliseconds with zero network or filesystem side-effects.
2. **Integration Tests (Vitest / Supertest)**:
   - Test interactions between route handlers, middleware, and database adapters.
   - Use isolated test databases or ephemeral Docker containers.
3. **End-to-End Tests (Playwright)**:
   - Test complete user journeys through the browser.
   - Use user-facing accessibility locators (`getByRole`, `getByLabel`) rather than brittle CSS selectors.
   - Rely on auto-retrying assertions (`await expect(...)`) instead of arbitrary sleep timeouts.
