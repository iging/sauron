---
name: zero-trust-identity-architecture
description: Mutual TLS service communication, SPIFFE/SPIRE identity attestation, and least-privilege token exchange.
department: security
ownerAgent: boromir
triggerCommand: /zero-trust-identity-architecture
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
  - AP-26
---

# Zero-Trust Identity Architecture

## 0. Identity

- **Role:** Zero-Trust Security Architect. Governs workload identities, mutual TLS authentication, and ephemeral capability grants.
- **Authority:** Normative specification under `skills/security/zero-trust-identity-architecture/`.
- **Must not define:** Application UI theme tokens.
- **Normative base:** `core/fellowship/boromir.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`, `rules/security/owasp-defensive-shield.md`, `context/core-domains/security-policies.md`.

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                                |
| --- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| 1   | Task             | Architect workload attestation, ephemeral token exchange, and mutual TLS encryption across services. |
| 2   | Target Tool      | SPIFFE / SPIRE, Istio service mesh, HashiCorp Vault, Envoy proxy.                                    |
| 3   | Output Format    | SPIFFE ID definitions, attestation policies, Envoy mTLS configuration manifests.                     |
| 4   | Constraints      | Zero implicit trust on private networks. Every packet must authenticate and authorize.               |
| 5   | Input            | Cluster topology, service mesh specs, IAM policies.                                                  |
| 6   | Context          | Prevents lateral movement after network perimeter breaches and credential replay attacks.            |
| 7   | Audience         | Infrastructure security engineers and platform architects.                                           |
| 8   | Success Criteria | 100% mTLS enforcement, short-lived X.509 SVID rotation (<1hr), zero long-lived static secrets.       |
| 9   | Examples         | See Section 5.                                                                                       |

## 2. Architecture Directives

1. **Workload Identity (SPIFFE/SPIRE):** Issue cryptographically verifiable, short-lived X.509 SVIDs to every workload instance.
2. **Mutual TLS Enforcement:** Terminate all plaintext inter-service communication; require mTLS validation on every RPC call.
3. **No Network Perimeter Trust:** Assume network compromise at all times; every request must authenticate and authorize individually.
4. **Least-Privilege Scoping:** Scope tokens to exact target audience and method verbs using ephemeral OIDC tokens.

## 3. Envoy mTLS Configuration Pattern

```yaml
static_resources:
  listeners:
    - name: service_listener
      address:
        socket_address: { address: 0.0.0.0, port_value: 8443 }
      filter_chains:
        - transport_socket:
            name: envoy.transport_sockets.tls
            typed_config:
              "@type": type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.DownstreamTlsContext
              common_tls_context:
                tls_certificate_sds_secret_configs:
                  - name: "spiffe://sauron.io/ns/prod/sa/order-service"
                validation_context_sds_secret_config:
                  name: "spiffe://sauron.io/trust-domain"
                require_client_certificate: true
```
