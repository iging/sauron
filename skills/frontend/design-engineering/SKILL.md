---
name: design-engineering
description: Index and router for the design engineering suite, covering web, mobile, desktop apps, and business systems. Maps a design request to the right skill across foundations, styles, brand, motion, image-to-code, and audit, and names the foundation references every UI build loads.
department: frontend
ownerAgent: aragorn
triggerCommand: /design-engineering
antiPatternsPrevented:
  - AP-1
  - AP-4
  - AP-18
  - AP-26
  - AP-28
---

# Design Engineering Suite Router (v2.0.0)

## 0. Identity

- **Role:** System Architect. Owns design system routing shape with explicit dispatch maps to stage sub-skills.
- **Role source:** Appendix A of `skills/_template/skill-name/SKILL.md` (System Architect).
- **Seniority bar:** Staff (Appendix B). Records why staged dispatch beats monolithic design prompts (each stage owns its quality bar, rejected god-prompts) and why routers never implement (separation keeps dispatch auditable, rejected executing routers).
- **Authority:** Normative root router for `skills/frontend/design-engineering/`.
- **Must not define:** Direct frontend code implementation, routing hands off to specialized stage sub-skills.
- **Normative base:** `core/fellowship/aragorn.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`, `context/core-domains/design-system.md`.
- **Anti-pattern gate:** Blocks AP-1, AP-4, AP-18, AP-26, AP-28, AP-44, and AP-45.

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                               |
| --- | ---------------- | ----------------------------------------------------------------------------------- |
| 1   | Task             | Classify design requests into 6 lifecycle stages and dispatch to sub-skills.        |
| 2   | Target Tool      | Any agent runtime: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, or raw API. |
| 3   | Output Format    | Structured routing decision and target skill execution handoff.                     |
| 4   | Constraints      | No direct UI code generation in router. Zero em-dashes.                             |
| 5   | Input            | User UI prompt, feature design idea, image comp, animation audit, or redesign.      |
| 6   | Context          | Prevents templated AI design output and unguided aesthetic selection.               |
| 7   | Audience         | Autonomous agents and developers building user interfaces.                          |
| 8   | Success Criteria | Exactly one target design skill resolved and executed deterministically.            |
| 9   | Examples         | See Section 10.                                                                     |

## 2. Trigger Matrix

Find what you want to do in the first column. Load the file in the second.

### 01 Foundations: decide and set up

| I want to | Load |
| --- | --- |
| Score a design and list its biggest problems | `skills/frontend/design-engineering/01-foundations/design-critique-scorecard/SKILL.md` |
| Create a visual identity and tokens for a product | `skills/frontend/design-engineering/01-foundations/visual-identity-builder/SKILL.md` |
| Pick a UI library for a specific need | `skills/frontend/design-engineering/01-foundations/ui-library-picker/SKILL.md` |
| Export the design as a `DESIGN.md` spec | `skills/frontend/design-engineering/01-foundations/design-md-exporter/SKILL.md` |
| Build several versions of a UI piece to compare | `skills/frontend/design-engineering/01-foundations/ui-variant-prototyper/SKILL.md` |

### 02 Styles: build a page in a chosen look

| I want to | Load |
| --- | --- |
| Build a page, app screen, or desktop view that does not look machine-made | `skills/frontend/design-engineering/02-styles/anti-slop-ui-builder/SKILL.md` |
| Structure a landing page as Attention, Interest, Desire, Action | `skills/frontend/design-engineering/02-styles/aida-landing-page-structure/SKILL.md` |
| Dark glass, premium agency look | `skills/frontend/design-engineering/02-styles/style-glass-agency/SKILL.md` |
| Clean, warm, minimal look | `skills/frontend/design-engineering/02-styles/style-minimalist/SKILL.md` |
| Raw industrial or terminal look | `skills/frontend/design-engineering/02-styles/style-brutalist/SKILL.md` |

### 03 Brand: borrow or define a brand look

| I want to | Load |
| --- | --- |
| Write image prompts for a brand moodboard | `skills/frontend/design-engineering/03-brand/brand-moodboard-prompts/SKILL.md` |

### 04 Motion: add, plan, and review animation

| I want to | Load |
| --- | --- |
| Find the right name for an animation | `skills/frontend/design-engineering/04-motion/motion-term-finder/SKILL.md` |
| Find places that need animation and have none | `skills/frontend/design-engineering/04-motion/motion-gap-scanner/SKILL.md` |
| Survey existing animation and write a refactor plan | `skills/frontend/design-engineering/04-motion/motion-refactor-planner/SKILL.md` |
| Polish the motion of one component | `skills/frontend/design-engineering/04-motion/motion-component-polish/SKILL.md` |
| Apply Apple-style physical motion | `skills/frontend/design-engineering/04-motion/apple-style-motion/SKILL.md` |
| Approve or block the animation in a pull request | `skills/frontend/design-engineering/04-motion/motion-pr-review/SKILL.md` |

### 05 Image to code: design with generated images first

| I want to | Load |
| --- | --- |
| Write image prompts for desktop page sections | `skills/frontend/design-engineering/05-image-to-code/web-page-image-prompts/SKILL.md` |
| Write image prompts for phone, tablet, or desktop app screens | `skills/frontend/design-engineering/05-image-to-code/app-screen-image-prompts/SKILL.md` |
| Turn a design image into matching code | `skills/frontend/design-engineering/05-image-to-code/image-to-code-builder/SKILL.md` |

### 06 Audit: check and fix what is built

| I want to | Load |
| --- | --- |
| Check a built page at 320, 375, 425, 768, 1024, 1440 | `skills/frontend/design-engineering/06-audit/responsive-screenshot-check/SKILL.md` |
| Fix a layout that breaks at any of those six widths | `skills/frontend/design-engineering/06-audit/responsive-layout-fixer/SKILL.md` |
| Lint UI code and get file and line findings | `skills/frontend/design-engineering/06-audit/ui-code-linter/SKILL.md` |
| Audit one component and get corrected code | `skills/frontend/design-engineering/06-audit/component-audit-and-fix/SKILL.md` |
| Upgrade an existing UI that looks generic | `skills/frontend/design-engineering/06-audit/visual-redesign-upgrade/SKILL.md` |
| Force complete code output with no placeholders | `skills/frontend/design-engineering/06-audit/complete-code-enforcer/SKILL.md` |
| Run the original v1 taste workflow | `skills/frontend/design-engineering/06-audit/legacy-taste-v1/SKILL.md` |

### Always-on foundations

Load these for any UI build, whichever skill runs. They are the house defaults. Start with the folder's own index: `skills/frontend/design-engineering/references/foundations/README.md`.

| Topic | Load |
| --- | --- |
| Every default token in one copy-ready block | `skills/frontend/design-engineering/references/foundations/design-tokens-sheet.md` |
| Visual hierarchy, spacing, grid, flex and grid use, breakpoints, the six check widths | `skills/frontend/design-engineering/references/foundations/layout-and-spacing-system.md` |
| Type scale, fluid `clamp()` sizes, weights, line height, line clamping | `skills/frontend/design-engineering/references/foundations/type-system.md` |
| Colour ramps, semantic roles, dark theme, contrast proof | `skills/frontend/design-engineering/references/foundations/colour-system.md` |
| Border radius, borders, shadows, elevation, overlays, focus rings | `skills/frontend/design-engineering/references/foundations/surface-and-depth-system.md` |
| Icon sizes and rules, image ratios, formats, alt text | `skills/frontend/design-engineering/references/foundations/icon-and-image-system.md` |
| Component anatomy, sizes, states, and native equivalents | `skills/frontend/design-engineering/references/foundations/component-specs.md` |
| Duration and easing tokens, what to animate, reduced motion | `skills/frontend/design-engineering/references/foundations/motion-basics.md` |
| Headlines, buttons, errors, empty states | `skills/frontend/design-engineering/references/foundations/ux-copy-guide.md` |
| The twelve accessibility requirements on one page | `skills/frontend/design-engineering/references/foundations/accessibility-baseline.md` |
| Translating all of the above to iOS, Android, desktop apps, and business systems | `skills/frontend/design-engineering/references/foundations/platform-adaptation.md` |
| The same tokens written in CSS, SwiftUI, Compose, Flutter, and XAML | `skills/frontend/design-engineering/references/foundations/platform-code-examples.md` |
| Motion mapped to each platform's animation API | `skills/frontend/design-engineering/references/motion/motion-across-platforms.md` |

### By platform

The suite applies to web, mobile, desktop, and business systems. State the target first, then add the matching stack file.

| Target | Also load |
| --- | --- |
| Web (HTML, React, Vue, Svelte, Astro, Next.js) | The matching file in `skills/frontend/design-engineering/references/ui-design/stacks/` |
| iOS, iPadOS, macOS | `skills/frontend/design-engineering/references/ui-design/stacks/swiftui.md` and `skills/frontend/design-engineering/references/motion/apple-guidelines.md` |
| Android | `skills/frontend/design-engineering/references/ui-design/stacks/jetpack-compose.md` |
| Flutter, React Native | `skills/frontend/design-engineering/references/ui-design/stacks/flutter.md`, `skills/frontend/design-engineering/references/ui-design/stacks/react-native.md` |
| Windows desktop | `skills/frontend/design-engineering/references/ui-design/stacks/winui.md`, `skills/frontend/design-engineering/references/ui-design/stacks/wpf.md` |
| Cross-platform desktop | `skills/frontend/design-engineering/references/ui-design/stacks/avalonia.md`, `skills/frontend/design-engineering/references/ui-design/stacks/javafx.md` |
| Admin, point of sale, kiosk, internal tools | `skills/frontend/design-engineering/references/foundations/platform-adaptation.md`, Section 9 |

Every sub-skill starts with Step 0, which names the target platform and loads the adaptation file. Two skills stay web-specific by nature: `aida-landing-page-structure` and `web-page-image-prompts`. `legacy-taste-v1` is web only and kept for compatibility. For app screens use `anti-slop-ui-builder`, `visual-identity-builder`, and `app-screen-image-prompts`.

### Ready-made looks

| I want | Load |
| --- | --- |
| The look of a specific company (74 presets) | `skills/frontend/brand-presets/` |
| A named style with fixed tokens (15 packs) | `skills/frontend/design-engineering/references/styles/token-packs/` |
| The broad catalogue of 84 styles | `skills/frontend/design-engineering/references/ui-design/tokens/styles.md` |

### Related skills outside this suite

| I want to | Load |
| --- | --- |
| Audit and fix accessibility to WCAG 2.2 AA | `skills/frontend/accessibility-auditor/SKILL.md` |
| Engineer forms and validation | `skills/frontend/forms-validation/SKILL.md` |
| Support multiple languages and right-to-left layouts | `skills/frontend/i18n-localization/SKILL.md` |
| Apply general UI and UX writing principles | `skills/frontend/ui-ux-principles/SKILL.md` |
| Plan a three-tier token system | `skills/quality/design-tokens/SKILL.md` |
| Set up visual regression tests | `skills/quality/playwright-visual-testing-fixtures/SKILL.md` |

### Lane Map

Several skills audit or review. They differ by scope and by whether they change code. Use this table when a request could fit more than one.

| Request shape | Scope | Changes code | Skill |
| --- | --- | --- | --- |
| Prove the layout holds at six widths | Built page | No | `responsive-screenshot-check` |
| Repair layout defects until all six widths pass | Built page and its code | Yes, layout only | `responsive-layout-fixer` |
| Score a design against heuristics and name the top issues | Surface | No | `design-critique-scorecard` |
| Line-level findings with rule IDs | Named files | No | `ui-code-linter` |
| Audit one component and return corrected code | Component | Yes | `component-audit-and-fix` |
| Existing UI looks generic, upgrade the visuals | Codebase | Yes | `visual-redesign-upgrade` |
| Rewrite one component's motion to the craft bar | Component | Yes | `motion-component-polish` |
| Find places that lack motion and need it | Codebase | No | `motion-gap-scanner` |
| Survey existing motion and write refactor plans | Codebase | No, writes plans | `motion-refactor-planner` |
| Approve or block the motion in a diff | Pull request | No | `motion-pr-review` |

### Default order for a new page or screen

1. State the target platform and load the always-on foundations.
2. Pick a look: a brand preset, a token pack, or a 02 Styles skill.
3. Build with `anti-slop-ui-builder` or the chosen style skill.
4. Run `ui-code-linter` on the files.
5. Run `responsive-screenshot-check` on the served page. If it fails, run `responsive-layout-fixer`.
6. Report what was verified and what was not.

## 3. Execution Workflow

### Step 1: Analyze Design Intent

- **Action:** Inspect user prompt, aesthetic descriptors, stack requirements, and task boundaries.
- **Input:** User prompt text.
- **Stop Condition:** Stop and ask user if aesthetic target is ambiguous.
- **Validation:** User intent matches a row in the Trigger Matrix.

### Step 2: Resolve Target Skill Path

- **Action:** Select exact skill path corresponding to the identified visual design goal.
- **Input:** Trigger Matrix table.
- **Stop Condition:** Decline execution if no design skill matches.
- **Validation:** Target file exists at the path given in the Trigger Matrix.

### Step 3: Handoff Execution

- **Action:** Invoke target sub-skill with contextual parameters.
- **Input:** Resolved skill path.
- **Stop Condition:** Handoff transfers control to sub-skill.
- **Validation:** Sub-skill executes internal workflow.

## 4. Output Specification

```json
{
  "design_category": "anti-slop-ui-builder",
  "target_skill": "skills/frontend/design-engineering/02-styles/anti-slop-ui-builder/SKILL.md",
  "reasoning": "Selected based on anti-slop landing page request."
}
```

## 5. Validation Gate

- [ ] User design intent mapped to exactly one sub-skill.
- [ ] Target skill file exists on disk.
- [ ] Router executes no code or CSS modifications directly.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Failing to route leads to generic AI boilerplate UI.
- **Over-execution threshold:** Routing simple CSS bug fixes to full design engines.
- **Calibration default:** Route structured UI requests, execute trivial bug fixes directly.

## 7. Anti-Pattern Compliance

| Step | Prevents AP                  | Mechanism                                         |
| ---- | ---------------------------- | ------------------------------------------------- |
| 1    | AP-1 (vague task)            | Demands explicit design read before dispatching.  |
| 2    | AP-26 (no scope boundary)    | Limits design execution to designated sub-skills. |
| 3    | AP-4 (over-permissive agent) | Router cannot modify code directly.               |

## 8. Versioning & Changelog

- **Version:** 3.4.0
- **Changelog:**
  - `3.4.0` : Added `responsive-layout-fixer` and its playbook.
  - `3.3.0` : Completed the foundations folder: surface and depth, icons and images, motion basics, accessibility baseline, a single tokens sheet, and a folder index.
  - `3.2.0` : Every sub-skill now starts with a platform step. Added native code examples and cross-platform motion mapping. Renamed `anti-slop-ui-builder` and `app-screen-image-prompts` to drop web-only and mobile-only wording.
  - `3.1.0` : Made the suite platform-neutral: added `platform-adaptation.md`, a By platform table, native rules in the linter, and app size sets in the responsive check.
  - `3.0.0` : Reorganised into six plainly named stages. Renamed every sub-skill to a short kebab-case name that says what it does. Grouped references into foundations, styles, motion, image-to-code, audit, design-practice, and prototyping. Added layout, colour, component, and copy foundations and `responsive-screenshot-check`. Linked related skills outside the suite.
  - `2.2.0` : Added Lane Map, style token packs, and depth references for Stage 2 and Stage 5. Brand presets consolidated at `skills/frontend/brand-presets/`.
  - `2.1.0` : Added Stage 6 `ui-code-linter` and its rule catalogue reference.
  - `2.0.0` : Re-architected into 6 lifecycle stages with reverse-engineered domain-driven file naming and zero-loss migration of 60+ brand presets.
  - `1.0.0` : Initial root router creation for `skills/frontend/design-engineering/`.

## 9. Portability Matrix

| Runtime     | Status   | Notes                         |
| ----------- | -------- | ----------------------------- |
| Claude Code | verified | Direct sub-skill invocation.  |
| Cursor      | verified | Rules integration.            |
| Copilot     | verified | Custom instructions.          |
| Windsurf    | verified | Directive integration.        |
| Kiro        | verified | Skill runner.                 |
| Cline       | verified | System prompt loading.        |
| Raw API     | verified | Model-agnostic design router. |

## 10. Examples

**Input:** "Build a modern anti-slop landing page for a developer tool."
**Output:** Target `skills/frontend/design-engineering/02-styles/anti-slop-ui-builder/SKILL.md`.
