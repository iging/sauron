---
name: terraform-immutable-infrastructure
description: Declarative cloud infrastructure modules, remote state locking, drift detection, and canary rollouts.
department: devops
ownerAgent: samwise
triggerCommand: /terraform-immutable-infrastructure
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
  - AP-26
---

# Terraform Immutable Infrastructure

## 0. Identity

- **Role:** Infrastructure as Code Specialist. Enforces deterministic cloud provisioning, blast radius constraints, and state safety.
- **Authority:** Normative specification under `skills/devops/terraform-immutable-infrastructure/`.
- **Must not define:** Application container runtime code.
- **Normative base:** `core/fellowship/samwise.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`.

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                     |
| --- | ---------------- | ----------------------------------------------------------------------------------------- |
| 1   | Task             | Provision reproducible, immutable cloud infrastructure via declarative Terraform modules. |
| 2   | Target Tool      | Terraform CLI, OpenTofu, AWS/GCP/Azure providers, Terraform Cloud.                        |
| 3   | Output Format    | Modular `.tf` manifests, plan output artifacts, lock files (`.terraform.lock.hcl`).       |
| 4   | Constraints      | Ban local state files. Never hardcode credentials in source. Pin provider versions.       |
| 5   | Input            | Cloud architecture specifications, networking topologies, compliance policies.            |
| 6   | Context          | Prevents configuration drift, accidental resource destruction, and security exposure.     |
| 7   | Audience         | Cloud architects, DevOps engineers, and security auditors.                                |
| 8   | Success Criteria | Clean plan generation without unexpected recreation, deterministic state file locking.    |
| 9   | Examples         | See Section 5.                                                                            |

## 2. IaC Integrity Directives

1. **Remote State Locking:** Store state files in encrypted object stores with distributed locking (such as DynamoDB / S3 or GCS).
2. **Strict Module Pinning:** Pin exact semantic versions for all providers and external registry modules.
3. **Automated Drift Enforcement:** Run daily continuous integration plan checks to detect out-of-band manual cloud modifications.
4. **Lifecycle Protection:** Attach `lifecycle { prevent_destroy = true }` to all stateful resources (databases, persistent disks).

## 3. Terraform Module Pattern

```hcl
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30.0"
    }
  }
  backend "s3" {
    bucket         = "sauron-terraform-state-prod"
    key            = "platform/vpc/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "sauron-tf-locks"
    encrypt        = true
  }
}

resource "aws_db_instance" "primary" {
  identifier           = "sauron-core-db"
  allocated_storage    = 100
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.r6g.xlarge"
  deletion_protection  = true

  lifecycle {
    prevent_destroy = true
  }
}
```
