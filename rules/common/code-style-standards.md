# Principal Code Style Standards

Defines non-negotiable coding conventions enforced across all languages, runtimes, and agents governed by Sauron.

---

## 1. Import Rules and Module Isolation

- **Explicit File Extensions:** Always include explicit relative file extensions in imports (for example `import { helper } from "./utils.js"`).
- **Prohibition of Barrel Files:** Never author or import from `index.ts` or barrel export files. Barrel files obscure dependency trees, slow down tree-shaking, and create circular reference hazards.
- **Single Direction Dependencies:** High-level policy must never import low-level infrastructure. Enforce dependency inversion.

---

## 2. Immutability and State Management

- **Immutable by Default:** Mark data structures, configurations, and function arguments `readonly` or `const`.
- **Pure Functions:** Business logic must reside in side-effect-free functions. Isolate I/O and mutations to boundary controllers.
- **Explicit Return Types:** Declare return types on every public function and method. Do not rely on compiler inference for exported boundaries.

---

## 3. Error Handling and Diagnostics

- **Fail-Closed Strategy:** Validate inputs at entry boundaries. Reject malformed payloads immediately with typed domain errors.
- **Never Swallow Errors:** Empty `catch` blocks are strictly forbidden. Log or rethrow errors with context.
- **Contextual Wrapping:** Wrap caught third-party exceptions in domain-specific error classes with cause chains preserved.

---

## 4. Documentation and Naming Conventions

- **Active Voice and Present Tense:** Write comments and documentation in active voice (for example "Calculates total balance" instead of "Will calculate total balance").
- **Self-Documenting Identifiers:** Use precise, domain-aligned variable and function names. Avoid single-letter variables except loop counters.
