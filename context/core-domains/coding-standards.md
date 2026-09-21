# CODING-STANDARDS — Coding Conventions & Style Rules

> **Purpose:** Non-negotiable language-specific coding standards, typing discipline, linting rules, formatting requirements, and structural hygiene across all modules. Tier-3 template — customize for your project.

_Last updated: [DATE]_

---

## 1. Universal Language Conventions

- **Language Standard:** TypeScript 7+ executing in strict ECMAScript Module (`"type": "module"`) mode.
- **Explicit Imports:** All relative imports must include explicit file extensions (`.js`) to adhere to native ESM loading without runtime resolution overhead.
- **Zero Barrel Exports:** Do not create or import from `index.ts` files that re-export sibling modules. Direct source file imports are mandatory.
- **Explicit Return Types:** All public functions, methods, and exported service boundaries must explicitly declare their return types. Compiler inference is permitted only for internal local variables.

---

## 2. Typing & Data Immutability Discipline

1. **Strict Nullability:** Never access optional properties without explicit optional chaining (`user?.profile?.avatar`) or narrowing assertions.
2. **Branded Types for IDs:** Sensitive entity IDs must be branded to prevent accidental string transposition (e.g. passing an `AccountId` where a `UserId` was expected).
3. **Immutable Collections:** Annotate function arguments and data configurations with `readonly` modifiers (`ReadonlyArray<T>`, `Readonly<T>`). Pure business logic must treat input state as immutable.
4. **No Magic Numbers or Strings:** Extract numeric thresholds, timeout durations, and string constants into scoped enum objects or `const` assertions.

---

## 3. Function & Class Design

- **Cognitive Complexity Ceiling:** Functions must not exceed a cognitive complexity score of `15`. Decompose nested logic into pure private helpers.
- **Line Count Guidelines:** Single-purpose functions should ideally remain under 40 lines. Files exceeding 300 lines should be audited for separation of concerns.
- **Early Return Guards:** Validate preconditions and permissions at the beginning of function bodies, returning or throwing immediately to eliminate deep nesting.

```typescript
// Good: Guard clauses with early exits
export function publishArticle(
  article: Article,
  user: User,
): Result<ArticleId, PublishError> {
  if (!user.hasPermission("article:publish")) {
    return Result.err(new UnauthorizedError("Insufficient permissions"));
  }
  if (article.status !== "approved") {
    return Result.err(
      new InvalidStateError("Article must be approved before publish"),
    );
  }

  // Pure state mutation
  return Result.ok(article.transitionToPublished(clock.now()));
}
```

---

## 4. Linting, Formatting & Tooling Rules

- **Linter & Formatter:** Enforced via Biome (`biome.json`) or ESLint with Prettier integration.
- **Tab Width & Indentation:** 2 spaces, zero hard tabs.
- **Line Length:** Soft limit of 100 characters; hard wrap at 120 characters.
- **Semicolons:** Semicolons are required at statement terminations in TypeScript/JavaScript to prevent Automatic Semicolon Insertion (ASI) bugs.
