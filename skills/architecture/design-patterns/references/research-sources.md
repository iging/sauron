# Research Source Index

> **Purpose:** Records every external source read for `skills/architecture/design-patterns/`, what failed to load, and what is therefore unverified.
> **Method:** Batch research pass, 20 target URLs in 2 cohorts, fetched and read on 2026-10-05. A source that failed to load is listed as unverified and supports no claim.

---

## 1. Verified sources

| ID  | Source                                                                                                                  | Author or publisher                           | Link                                                                     | Supports                                                             |
| :-- | :---------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------- | :----------------------------------------------------------------------- | :------------------------------------------------------------------- |
| S01 | Design Patterns (book summary: authors, 1994, two core principles, 23 patterns in 3 groups, later remarks on Singleton) | Wikipedia, on Gamma, Helm, Johnson, Vlissides | https://en.wikipedia.org/wiki/Design_Patterns                            | Core principles, catalog size, Singleton caution                     |
| S02 | Criticism of patterns                                                                                                   | Refactoring.Guru                              | https://refactoring.guru/design-patterns/criticism                       | Language-feature-first rule, rigid use warning                       |
| S03 | Inversion of Control Containers and the Dependency Injection pattern                                                    | Martin Fowler                                 | https://martinfowler.com/articles/injection.html                         | Constructor injection default, Service Locator trade-off             |
| S04 | The Wrong Abstraction                                                                                                   | Sandi Metz                                    | https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction               | Inline-back removal path                                             |
| S05 | Yagni                                                                                                                   | Martin Fowler                                 | https://martinfowler.com/bliki/Yagni.html                                | Four costs of presumptive features, exemption for changeability work |
| S06 | Beck Design Rules                                                                                                       | Martin Fowler, on Kent Beck                   | https://martinfowler.com/bliki/BeckDesignRules.html                      | Simple design priority order                                         |
| S07 | Singleton chapter, Game Programming Patterns                                                                            | Robert Nystrom                                | https://gameprogrammingpatterns.com/singleton.html                       | Singleton risks and alternatives                                     |
| S08 | Code Smells                                                                                                             | Refactoring.Guru                              | https://refactoring.guru/refactoring/smells                              | Smell names and groups, Speculative Generality, Middle Man           |
| S09 | The Singleton Pattern, Python Design Patterns                                                                           | Brandon Rhodes                                | https://python-patterns.guide/gang-of-four/singleton/                    | Module-level object in Python                                        |
| S10 | The Composition Over Inheritance Principle                                                                              | Brandon Rhodes                                | https://python-patterns.guide/gang-of-four/composition-over-inheritance/ | Subclass growth, Adapter, Bridge, Decorator                          |
| S11 | Cloud Design Patterns                                                                                                   | Microsoft Azure Architecture Center           | https://learn.microsoft.com/en-us/azure/architecture/patterns/           | Choose from the problem. Boundary with distributed patterns          |
| S12 | Effective Go                                                                                                            | The Go Authors                                | https://go.dev/doc/effective_go                                          | Small interfaces, implicit satisfaction, embedding, function types   |
| S13 | CQRS                                                                                                                    | Martin Fowler                                 | https://martinfowler.com/bliki/CQRS.html                                 | CQRS caution                                                         |
| S14 | Delegation                                                                                                              | Kotlin documentation                          | https://kotlinlang.org/docs/delegation.html                              | `by` delegation                                                      |
| S15 | Catalog of Design Patterns                                                                                              | Refactoring.Guru                              | https://refactoring.guru/design-patterns/catalog                         | Pattern names by group                                               |
| S16 | Catalog of Patterns of Enterprise Application Architecture                                                              | Martin Fowler                                 | https://martinfowler.com/eaaCatalog/                                     | Repository, Unit of Work, Value Object, Data Transfer Object names   |

## 2. Unverified sources, not cited

| Target                                             | Result                                  | Effect                                                                                                                                 |
| :------------------------------------------------- | :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| Peter Norvig, Design Patterns in Dynamic Languages | Page returned title and file links only | The figure of 16 of 23 patterns simplified in Lisp or Dylan appears in S01 as a secondary report. The skill does not state it as fact. |
| Rust Design Patterns book, first address           | HTTP 404                                | Not cited                                                                                                                              |
| Rust Design Patterns book, second address          | Introduction only, no pattern list      | Rust rows are labeled `[general]`                                                                                                      |
| Python Design Patterns home page                   | Table of contents only                  | Replaced by S09 and S10                                                                                                                |

## 3. Coverage gaps

- No fetched source covers Java, C#, Swift, PHP, C++, TypeScript, or Rust idioms. Their rows in `language-idioms.md` are labeled `[general]`.
- S01 is an encyclopedia summary of the book, not the book. Quotations of the two principles are taken from that summary.
- This skill did not run through the three research sub-skills named by `batch-site-research-scaffolder`. Pages were fetched and read directly.
