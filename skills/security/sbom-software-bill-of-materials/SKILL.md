---
name: sbom-software-bill-of-materials
description: CycloneDX and SPDX software bill of materials generation, supply chain integrity, and automated CVE alerting.
department: security
ownerAgent: boromir
triggerCommand: /sbom-software-bill-of-materials
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
  - AP-26
---

# SBOM Software Bill of Materials

## 0. Identity

- **Role:** Supply Chain Security Engineer. Generates deterministic SBOMs, verifies package cryptographic hashes, and flags CVE vulnerabilities.
- **Authority:** Normative specification under `skills/security/sbom-software-bill-of-materials/`.
- **Must not define:** Application layout or UX features.
- **Normative base:** `core/fellowship/boromir.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`, `rules/security/supply-chain-integrity.md`, `context/core-domains/dependency-governance.md`.

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                            |
| --- | ---------------- | ------------------------------------------------------------------------------------------------ |
| 1   | Task             | Produce signed, machine-readable Software Bill of Materials during build pipelines.              |
| 2   | Target Tool      | Syft, Grype, CycloneDX CLI, Cosign, Trivy.                                                       |
| 3   | Output Format    | CycloneDX 1.5 JSON or SPDX 2.3 JSON artifacts with cryptographic signatures.                     |
| 4   | Constraints      | SBOM must accompany every release container image and binary. Signed with Sigstore.              |
| 5   | Input            | Project lockfiles, compiled binaries, container filesystem layers.                               |
| 6   | Context          | Prevents supply chain attacks, undetected vulnerable dependencies, and licensing non-compliance. |
| 7   | Audience         | Enterprise security officers, compliance auditors, and DevOps leads.                             |
| 8   | Success Criteria | 100% dependency capture including transitive trees, valid cryptographic signature attached.      |
| 9   | Examples         | See Section 5.                                                                                   |

## 2. Supply Chain Directives

1. **Standardized Artifacts:** Generate CycloneDX v1.5 JSON or SPDX v2.3 compliant SBOM artifacts during build pipelines.
2. **Cryptographic Provenance:** Verify digital signatures of all third-party dependencies using Sigstore / Cosign.
3. **Automated Vulnerability Mapping:** Cross-reference package hashes against the National Vulnerability Database (NVD) in real time.
4. **License Compliance Gate:** Flag any GPL/AGPL dependencies in proprietary closed-source applications.

## 3. SBOM Generation Script Example

```bash
#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAG="sauron/core-engine:1.0.0"

echo "[SBOM] Generating CycloneDX SBOM for ${IMAGE_TAG}..."
syft "${IMAGE_TAG}" -o cyclonedx-json=./dist/sbom.cyclonedx.json

echo "[SBOM] Scanning SBOM for known CVE vulnerabilities..."
grype sbom:./dist/sbom.cyclonedx.json --fail-on high

echo "[SBOM] Signing SBOM artifact with Cosign..."
cosign sign-blob --key env://COSIGN_PRIVATE_KEY ./dist/sbom.cyclonedx.json --output-signature ./dist/sbom.sig
```
