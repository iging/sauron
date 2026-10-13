# Language Idioms Reference

> **Purpose:** States how each selection result is expressed in ten major languages. Used by Step 3 and Step 4 of `skills/architecture/design-patterns/SKILL.md`.
> **Evidence labels:** Rows marked `[sourced]` rest on a document in `research-sources.md`. Rows marked `[general]` state widely documented language features that this research pass did not fetch. Confirm a `[general]` row against the official language documentation before quoting it as fact.

---

## 1. First-choice construct per language

| Language               | Vary behavior (in place of Strategy)                                                                         | Share one instance (in place of Singleton)                                         | Reuse without subclassing                                                    | Closed set of variants                             | Evidence                                               |
| :--------------------- | :----------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- | :------------------------------------------------- | :----------------------------------------------------- |
| TypeScript, JavaScript | Function value, or a `Record` from key to function                                                           | Module-level export                                                                | Object composition, function wrappers                                        | Discriminated union with exhaustive `switch`       | `[general]`                                            |
| Python                 | Function or callable passed as an argument                                                                   | Module-level object. The classic Singleton is rarely written (S09)                 | Composition. Adapter, Bridge, and Decorator over subclass growth (S10)       | `enum`, or `match` over dataclasses                | `[sourced]` for columns 2 and 3, `[general]` otherwise |
| Java                   | Lambda against a functional interface                                                                        | Instance provided by the injection container, or an `enum` with one element        | Composition with interfaces                                                  | Sealed interface with records and pattern matching | `[general]`                                            |
| C#                     | Delegate or lambda (`Func`, `Action`)                                                                        | Service registered with singleton lifetime in the built-in container               | Composition with interfaces                                                  | Records with `switch` expressions                  | `[general]`                                            |
| Go                     | Function value, or a one-method interface. A function type can satisfy an interface by having a method (S12) | Package-level variable, or a value passed from `main`                              | Struct embedding and small interfaces satisfied implicitly (S12)             | Interface with a type switch                       | `[sourced]` for columns 1 and 3, `[general]` otherwise |
| Rust                   | Closure, or a trait with generic or `dyn` dispatch                                                           | Value passed by reference, or a lazily initialized static                          | Traits and struct composition. The language has no class inheritance         | `enum` with exhaustive `match`                     | `[general]`                                            |
| Kotlin                 | Lambda or function reference                                                                                 | `object` declaration, or an injected instance                                      | Interface delegation with `by`, which generates the forwarding methods (S14) | Sealed class or interface with `when`              | `[sourced]` for column 3, `[general]` otherwise        |
| Swift                  | Closure, or a protocol                                                                                       | Static constant, or an injected instance                                           | Protocols with extensions, and composition                                   | `enum` with associated values                      | `[general]`                                            |
| PHP                    | Callable or first-class callable syntax                                                                      | Service from the framework container                                               | Composition, interfaces, and traits                                          | Backed `enum` with `match`                         | `[general]`                                            |
| C++                    | `std::function`, lambda, or a template parameter                                                             | Instance passed by reference. Function-local static when global access is required | Composition, and templates for static polymorphism                           | `std::variant` with `std::visit`                   | `[general]`                                            |

## 2. Pattern expression notes

| Pattern              | Languages with first-class functions and closures                        | Languages where a class is still the common form                               |
| :------------------- | :----------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| Strategy             | Pass a function                                                          | An interface with small classes when the strategy holds state                  |
| Command              | Store a closure. Add a struct or class only when undo data is needed     | Class with `execute` and `undo`                                                |
| Template Method      | Higher-order function that takes the varying steps                       | Abstract base class when subclasses share protected state                      |
| Observer             | Callback list, or the event or reactive facility of the platform         | Listener interface                                                             |
| Iterator             | Generator or the built-in iteration protocol                             | Implement the standard iterator interface of the language                      |
| Decorator            | Function wrapper, or decorator syntax where the language has it          | Class that wraps the same interface                                            |
| Builder              | Named and default arguments, or an options object                        | Builder class when construction has ordering rules or validation between steps |
| Factory Method       | A function that returns the interface type                               | Static factory method                                                          |
| Visitor              | Pattern matching over a sum type                                         | Visitor interface with double dispatch                                         |
| Adapter              | A function or thin struct that converts the call                         | Class that implements the target interface                                     |
| Dependency injection | Pass collaborators as parameters. Start with constructor injection (S03) | Constructor injection, with a container only when wiring grows large           |

## 3. Port warnings

| Do not                                                                                  | Reason                                                                                                                                |
| :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| Port a class hierarchy into Go or Rust with embedded structs that imitate inheritance   | Embedding forwards methods to the inner value. The receiver stays the inner type (S12), so overriding does not behave like a subclass |
| Write a Java-style Singleton class in Python, JavaScript, or Go                         | A module-level or package-level value does the same job with less code (S09)                                                          |
| Add an interface per class in a language with implicit or structural interfaces         | Define the interface at the consumer, when a second implementation or a test double exists                                            |
| Add a Strategy class hierarchy where handlers hold no state                             | A function value carries the behavior (S02)                                                                                           |
| Copy a pattern from a tutorial in another language without checking the idiom row above | Canonical implementations applied rigidly produce more code than the problem needs (S02)                                              |

Source identifiers refer to `skills/architecture/design-patterns/references/research-sources.md`.
