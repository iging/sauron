---
name: pact-contract-testing
description: Consumer-driven API contract verification, pact broker publishing, and verification gates across microservice boundaries.
department: quality
ownerAgent: merry
triggerCommand: /pact-contract-testing
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
  - AP-26
---

# Pact Contract Testing

## 0. Identity

- **Role:** API Contract Quality Engineer. Governs consumer-driven contract testing between independent service deployments.
- **Authority:** Normative specification under `skills/quality/pact-contract-testing/`.
- **Must not define:** Internal service unit test implementations.
- **Normative base:** `core/fellowship/merry.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`, `context/core-domains/api-contracts.md`.

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                        |
| --- | ---------------- | -------------------------------------------------------------------------------------------- |
| 1   | Task             | Define consumer expectations, generate pact contracts, and verify provider implementations.  |
| 2   | Target Tool      | Pact-JS, Pact-JVM, Pact Broker, Can-I-Deploy CLI.                                            |
| 3   | Output Format    | Contract JSON files (Pact specifications), provider state handlers, verification reports.    |
| 4   | Constraints      | Consumers dictate expectations. Providers verify against contracts before releasing.         |
| 5   | Input            | API endpoints, mock interactions, provider states.                                           |
| 6   | Context          | Prevents breaking API changes across independent microservices without expensive E2E suites. |
| 7   | Audience         | Backend engineers, integration teams, and platform architects.                               |
| 8   | Success Criteria | `can-i-deploy` returns success for all participating service versions in pipeline.           |
| 9   | Examples         | See Section 5.                                                                               |

## 2. Contract Lifecycle Directives

1. **Consumer-Driven Definition:** Consumers define strict expectations of provider response structures and status codes.
2. **Pact Broker Synchronization:** Publish verified pacts to a centralized Pact Broker with git commit SHA tagging.
3. **Can-I-Deploy Gate:** Block production deployments unless provider verification matrix confirms 100% compatibility.
4. **Provider State Mocking:** Providers inject necessary database fixtures dynamically via state handler callbacks.

## 3. Consumer Test Example

```typescript
import { PactV3, MatchersV3 } from "@pact-foundation/pact";

const provider = new PactV3({
  consumer: "FrontendClient",
  provider: "UserService",
});

test("fetches user by ID contract", async () => {
  provider
    .given("user with id 123 exists")
    .uponReceiving("a request for user 123")
    .withRequest({ method: "GET", path: "/users/123" })
    .willRespondWith({
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        id: MatchersV3.string("123"),
        email: MatchersV3.email(),
        active: MatchersV3.boolean(true),
      },
    });

  await provider.executeTest(async (mockServer) => {
    const res = await fetch(`${mockServer.url}/users/123`);
    const data = await res.json();
    expect(data.id).toBe("123");
  });
});
```
