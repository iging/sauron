# Sample Folder Structures

Reference trees for each pattern in [the decision matrix](decision-matrix.md). Use them to show a
reader what a pattern looks like, then shape the real proposal from the project's own evidence.
Never paste a sample as the answer. Drop every directory the project has no current use for.

Sections 1 to 8 follow the eight patterns in
[Folder Structure Best Practices for Expo Apps](https://www.applighter.com/blog/folder-structure-best-practices),
with the same folder names and placement. The article targets Expo and React Native. The
platform samples after them are Sauron additions.

Some samples use `index.ts` as a module's public entry, as the article does. When a project
forbids barrel files, use an explicit contract file such as `contracts.ts` in the same place.

## 1. Feature-based

Fits a product where work arrives as business domains. Each feature owns its own parts.

```text
src/
  features/
    auth/
      components/
      hooks/
      api/
      state/
      index.ts         # What other features may import
    profile/
    marketplace/
  shared/              # Only code that several domains use
```

Rule: if deleting a folder removes something users can do, it is a real feature. Keep `shared/`
small so it does not become a junk drawer.

## 2. Layer-based

Fits a small MVP or prototype, where changes touch the technical layers together.

```text
src/
  components/
  hooks/
  services/
  utils/
  types/
  constants/
  config/
```

Warning sign: one business change edits most of these folders. Move to feature-based.

## 3. Screaming or use-case

Fits flow-heavy products. The top-level names say what the product does. Two examples:

```text
product-browsing/
cart/
checkout/
  hooks/
    useCheckoutSession.ts
order-history/
```

```text
onboarding/
workspace/
billing/
settings-access/
```

Name folders after user tasks. Keep shared business rules in one place, not copied per flow.

## 4. Monorepo workspaces

Fits more than one app surface, or real code shared between apps.

```text
apps/
  mobile/
  web/
packages/
  ui/
  types/
services/
  api/
```

Move code into `packages/` only after two consumers exist. Each workspace gets a README, an owner,
and enforced import boundaries.

## 5. Modular with public APIs

Fits a team project where modules must not reach into each other's internals.

```text
auth/
  index.ts             # Public surface, for example AuthProvider and useAuth
  internal/
    session/
      refresh-token.ts # Private. Other modules never import this path
```

Import `auth` from its root, never from `auth/internal/`. Enforce the rule with lint or an import
check, because folder names alone do not stop deep imports.

## 6. Flat with progressive nesting

Fits a solo developer or an early MVP. Start shallow and nest only when a folder gets noisy.

```text
components/
hooks/
services/
types/
config/
inbox/                 # Temporary or agent-generated fragments to sort later
zzz/                   # Deprecated or dormant code kept out of the way
```

Empty `inbox/` and `zzz/` on a schedule, so they do not become permanent storage.

## 7. Shared types

Fits full-stack TypeScript. Group types by domain in one central place.

```text
src/
  types/
    user.types.ts
    billing.schema.ts
    workspace-contracts.ts
```

In a monorepo, the same files live in `packages/types/`. Avoid one giant `types.ts`.

## 8. Configuration by environment

Fits apps that ship to more than one environment, such as dev, staging, and production.

```text
config/                # Some projects name this env/
  env.ts               # Reads and validates environment variables
  features.ts          # Feature flags
  api.ts               # Endpoints per environment
  analytics.ts         # Analytics keys and switches
```

All settings flow through this one place. Keep secrets out of source.

## Samples by platform (Sauron additions)

### Web: Next.js App Router, feature-based

```text
web-app/
  app/                 # Routes only: pages, layouts, and route handlers
    (marketing)/
    dashboard/
  src/
    features/
      auth/
      projects/
    shared/
      ui/
  tests/
```

### API: Node service, layered domain inside features

```text
api/
  src/
    orders/
      domain/          # Entities and rules, no framework imports
      application/     # Use cases
      infrastructure/  # Database and HTTP adapters
      contracts.ts
    main.ts
  tests/
```

### Mobile: Expo, feature-based

```text
mobile-app/
  app/                 # Expo Router screens
  src/
    features/
      onboarding/
      workspace/
    shared/
      ui/
  assets/
```

### Desktop: Electron, split by process

```text
desktop-app/
  src/
    main/              # Main process: windows, menus, file access
    preload/           # The only bridge between main and renderer
    renderer/          # UI, organized by feature
      features/
    shared/            # Types both processes use
```

### Business system: modular monolith

```text
erp/
  src/
    modules/
      inventory/
        contracts.ts
        internal/
      purchasing/
        contracts.ts
        internal/
      accounting/
        contracts.ts
        internal/
    platform/          # Auth, audit log, and other cross-cutting services
    app/
  tests/
```

Each module owns its data. Other modules call its contract, never its tables.

### Python service, feature-based

```text
service/
  src/
    service_name/
      orders/
        models.py
        services.py
        api.py
      shared/
  tests/
  pyproject.toml
```

## Depth and naming rules

- Keep three or four levels of folders where you can. Deeper trees are hard to scan.
- Use lowercase kebab-case for folders unless the stack expects another case, such as Python
  packages in snake_case.
- Feature folders use domain nouns, such as `profile`. Use-case folders use tasks, such as
  `edit-profile`.
- Add a folder only when real files need it. Empty placeholder folders are not allowed.
- For an existing repository, change one boundary at a time, for example auth first, then billing.
