---
name: kubernetes-operator-deployment
description: Kubernetes Custom Resource Definitions (CRDs), controller reconciler loops, status subresources, and leader election.
department: devops
ownerAgent: samwise
triggerCommand: /kubernetes-operator-deployment
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
  - AP-26
---

# Kubernetes Operator Deployment

## 0. Identity

- **Role:** Cloud-Native Orchestration Engineer. Manages custom resource lifecycles, controller reconciler logic, and state convergence.
- **Authority:** Normative specification under `skills/devops/kubernetes-operator-deployment/`.
- **Must not define:** Application-layer domain logic.
- **Normative base:** `core/fellowship/samwise.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`.

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                   |
| --- | ---------------- | --------------------------------------------------------------------------------------- |
| 1   | Task             | Architect, package, and deploy Kubernetes operators with custom controllers.            |
| 2   | Target Tool      | Operator SDK, Kubebuilder, Go controller-runtime, Helm.                                 |
| 3   | Output Format    | CRD manifests (OpenAPI v3), controller deployment specs, RBAC role bindings.            |
| 4   | Constraints      | Controllers must be strictly idempotent. Spec changes separate from Status subresource. |
| 5   | Input            | Target cluster version, custom resource specifications, reconciliation objectives.      |
| 6   | Context          | Prevents cluster state drift, controller crash loops, and cascading pod evictions.      |
| 7   | Audience         | SREs, platform engineers, and Kubernetes operators.                                     |
| 8   | Success Criteria | Clean reconciliation without infinite loop thrashing, seamless CRD version migrations.  |
| 9   | Examples         | See Section 5.                                                                          |

## 2. Controller Design Directives

1. **Idempotent Reconciler:** Ensure `Reconcile()` produces deterministic cluster state regardless of execution count.
2. **Status Subresource Decoupling:** Always modify spec and status independently to prevent unwanted object version conflicts.
3. **Finalizers for Cleanup:** Attach explicit finalizers for external resource de-provisioning before allowing object deletion.
4. **Leader Election:** Enable leader election in controller manager deployments to prevent split-brain conflicts across replicas.

## 3. CRD Definition Pattern

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: databases.platform.sauron.io
spec:
  group: platform.sauron.io
  names:
    kind: Database
    plural: databases
    singular: database
  scope: Namespaced
  versions:
    - name: v1alpha1
      served: true
      storage: true
      subresources:
        status: {}
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              required: ["storageGb", "replicas"]
              properties:
                storageGb:
                  type: integer
                replicas:
                  type: integer
                  minimum: 1
            status:
              type: object
              properties:
                ready:
                  type: boolean
                endpoint:
                  type: string
```
