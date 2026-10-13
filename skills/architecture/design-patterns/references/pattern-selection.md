# Pattern Selection Reference

> **Purpose:** Maps a code smell and its force to the cheapest construct that removes it. Used by Step 2 and Step 3 of `skills/architecture/design-patterns/SKILL.md`.
> **Rule:** Read the row for the smell you found. Never scan this file for a pattern to apply.

---

## 1. Principles that outrank any pattern

| Principle                                         | Meaning for a decision                                                                                                                         | Source   |
| :------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| Program to an interface, not an implementation    | Callers depend on what a collaborator does, not on its concrete type.                                                                          | S01      |
| Favor composition over inheritance                | Combine small objects or functions at runtime before adding a subclass.                                                                        | S01, S10 |
| Simple design, in priority order                  | Passes the tests. Reveals intention. No duplication. Fewest elements.                                                                          | S06      |
| Build for the known need                          | A capability built for a presumed future feature carries build, delay, carry, and repair costs. Work that keeps code easy to change is exempt. | S05      |
| Duplication costs less than the wrong abstraction | When an abstraction collects flags and conditionals, inline it back into callers and start again.                                              | S04      |
| Choose from the problem                           | A pattern fits when its problem statement matches the challenge and its trade-offs are acceptable.                                             | S11      |
| Patterns often cover a missing language feature   | Check the target language for a built-in construct first.                                                                                      | S02, S10 |

## 2. Smell to construct

Evaluate columns left to right. Stop at the first one that removes the smell.

| Smell                                                         | Force behind it                                            | Try first                                                              | Pattern if the first is not enough                                     | Do not use when                                                                     |
| :------------------------------------------------------------ | :--------------------------------------------------------- | :--------------------------------------------------------------------- | :--------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| Switch or if-chain on a type code, repeated in several places | Behavior varies by kind, and kinds get added               | Lookup map of functions, or a sum type with exhaustive matching        | Strategy, or State when the kind changes at runtime                    | The chain exists in one place and kinds are stable                                  |
| Subclass count multiplies along two axes                      | Two independent dimensions of variation                    | Pass one dimension in as a collaborator                                | Bridge, or Decorator when behaviors stack                              | Only one axis varies                                                                |
| Constructor with many optional parameters                     | Many valid configurations                                  | Named or default arguments, or an options object                       | Builder                                                                | The language has named and default arguments and construction has no ordering rules |
| Callers use `new` on concrete types they should not know      | Creation logic varies or is costly                         | A plain function that returns the interface type                       | Factory Method, or Abstract Factory for families that must match       | One concrete type exists                                                            |
| Class reaches for a global instance                           | Shared access to one resource                              | Pass the instance as a parameter or inject it through the constructor  | Module-level object where the language supports it                     | Tests need isolated instances                                                       |
| Third-party or legacy interface leaks into callers            | An interface you do not own differs from the one you need  | A thin wrapper function                                                | Adapter, or Facade for a whole subsystem                               | You own both sides and can change one                                               |
| Many objects must react when one changes                      | One-to-many notification with unknown receivers            | Callback parameter, or the event facility of the language or framework | Observer                                                               | There is one receiver, known at compile time                                        |
| Operation must be queued, logged, undone, or retried          | A request needs a life beyond the call                     | A closure stored in a queue                                            | Command                                                                | The call runs once, immediately                                                     |
| Algorithm skeleton repeats with small differing steps         | Fixed sequence, variable steps                             | Higher-order function taking the steps                                 | Template Method                                                        | Steps differ in order, not only in content                                          |
| Cross-cutting behavior wraps many calls                       | Same before and after logic around different operations    | Function wrapper or language decorator syntax                          | Decorator, or Proxy for access control and lazy loading                | The behavior applies to one call site                                               |
| Tree where leaves and groups are treated alike                | Recursive part-whole structure                             | Recursive sum type                                                     | Composite                                                              | The structure is flat                                                               |
| Traversal logic is duplicated across collection types         | Callers need sequential access without knowing the storage | The iterator or generator protocol of the language                     | Iterator                                                               | The standard collection already iterates                                            |
| Many operations over a closed set of node types               | Operations grow, node types stay fixed                     | Pattern matching over a sum type                                       | Visitor                                                                | Node types change more often than operations                                        |
| Objects talk to many peers directly                           | Many-to-many communication                                 | A coordinating function                                                | Mediator                                                               | Two peers only                                                                      |
| Request passes through ordered optional handlers              | Handlers vary and order matters                            | A list of functions run in order, or framework middleware              | Chain of Responsibility                                                | Exactly one handler always runs                                                     |
| Persistence calls spread through business logic               | Storage details vary from business rules                   | A module of query functions                                            | Repository, with Unit of Work when several writes must commit together | The app is a thin layer over one table set and the ORM already isolates it          |
| Primitive values carry rules, such as money or email          | A value has validation and behavior                        | A small immutable type                                                 | Value Object                                                           | The value has no rule                                                               |
| Abstraction with flags and branches per caller                | An earlier abstraction no longer fits                      | Inline into callers, delete what each caller does not use              | A new abstraction only after duplication shows the real shape          | Callers still share one behavior                                                    |

## 3. Patterns that need extra justification

| Pattern                                    | Risk                                                                                                                                                                                  | Required evidence before use                                                                                     |
| :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------- |
| Singleton                                  | Hidden global state, coupling between unrelated modules, concurrency problems, and no path to a second instance (S07). One of the original authors later said he would drop it (S01). | A written reason why passing or injecting the instance does not work                                             |
| Abstract Factory                           | A second layer of indirection                                                                                                                                                         | Two or more product families that must not mix                                                                   |
| Visitor                                    | Hard to read and to extend with new node types                                                                                                                                        | A closed set of node types and at least three operations                                                         |
| Service Locator                            | Dependencies become invisible at the call site (S03)                                                                                                                                  | A written reason why constructor injection does not work                                                         |
| CQRS                                       | Large added complexity for most systems (S13)                                                                                                                                         | A bounded context where read and write models have diverged. Route to `skills/architecture/domain-driven-design` |
| Any pattern added for possible future need | Speculative Generality is a code smell (S08)                                                                                                                                          | A scheduled change, with its ticket or date                                                                      |

## 4. Removal signals

Recommend removing a pattern when any row applies.

| Signal                                                         | Action                               |
| :------------------------------------------------------------- | :----------------------------------- |
| An interface has one implementation and no test double uses it | Inline the interface                 |
| A factory returns one concrete type                            | Replace with direct construction     |
| A wrapper forwards every call unchanged                        | Delete the wrapper (Middle Man, S08) |
| A shared helper takes a flag per caller                        | Inline into callers (S04)            |
| A class holds no state and has one method                      | Replace with a function              |

Source identifiers refer to `skills/architecture/design-patterns/references/research-sources.md`.
