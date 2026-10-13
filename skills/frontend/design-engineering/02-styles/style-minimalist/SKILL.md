---
name: style-minimalist
description: Editorial-style minimalist interface architecture, warm monochrome palettes, bento grids, and muted pastels.
department: frontend
ownerAgent: aragorn
triggerCommand: /style-minimalist
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
---

# Premium Utilitarian Minimalism Architecture

## 0. Identity

- **Role:** Minimalist UI & Editorial Interface Architect.
- **Authority:** Controls warm monochrome palettes, restrained typography, and flat bento grid structures.
- **Must not define:** Heavy 3D gradients, glowing mesh cards, or noisy brutalist scanlines.
- **Normative base:** `core/fellowship/aragorn.md`, `rules/engineering/architecture-boundaries.md`, `rules/languages/typescript-strict.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`.
- **Anti-pattern gate:** Blocks AP-1, AP-4, AP-18, AP-26, AP-28, AP-44, and AP-45.

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                      |
| --- | ---------------- | ------------------------------------------------------------------------------------------ |
| 1   | Task             | Architect ultra-minimalist, document-style web interfaces with warm monochrome tones.      |
| 2   | Target Tool      | Any agent runtime: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, or raw API.        |
| 3   | Output Format    | Clean HTML/Tailwind templates with restrained typography and subtle pastel accents.        |
| 4   | Constraints      | Prohibit Inter/Roboto fonts, heavy drop shadows, neon gradients, pill buttons, and emojis. |
| 5   | Input            | Product design brief, Notion/Linear style UI request, or document interface spec.          |
| 6   | Context          | Prevents generic SaaS clutter and over-saturated AI card layouts.                          |
| 7   | Audience         | Product managers, designers, and developers building editorial web tools.                  |
| 8   | Success Criteria | Ultra-flat layout, warm off-white canvas `#F7F6F3`, serif/sans font contrast.              |
| 9   | Examples         | See Section 10.                                                                            |

## 2. Trigger Matrix

| Trigger                                                  | Fire? | Notes                          |
| -------------------------------------------------------- | ----- | ------------------------------ |
| Request for minimalist, Notion-style, or Linear-style UI | YES   | Core trigger.                  |
| Document-style web interface or editorial knowledge base | YES   | Core trigger.                  |
| Cyberpunk dark mode telemetry HUD                        | NO    | Use `industrial-brutalist-ui`. |
| $150k agency glassmorphism marketing site                | NO    | Use `high-end-visual-design`.  |

## 3. Execution Workflow

### Step 0: Set the Target Platform

- **Action:** Name the target (web, iOS, Android, cross-platform mobile, desktop app, or business system) and its toolkit. For any target other than a web page, load `../../references/foundations/platform-adaptation.md` and express every unit, size, component, and navigation choice in that platform's terms. Outside the web, follow the "On Other Platforms" section of the reference: keep the palette, type pairing, and component restraint in the platform's native components.
- **Input:** User request and the project's files.
- **Stop Condition:** Ask one question when the target cannot be inferred from the request or the codebase.
- **Validation:** Target platform and toolkit recorded before Step 1.

### Step 1: Palette & Canvas Initialization

- **Action:** Load `../../references/styles/style-minimalist.md` first and apply its rules through every later step. Establish warm bone/off-white canvas `#F7F6F3` or `#FFFFFF`. Set surface cards `#FFFFFF`.
- **Input:** Color constraints table.
- **Stop Condition:** Halt if background `#000000` or heavy primary blue color is requested.
- **Validation:** Off-white canvas and light gray borders `rgba(0,0,0,0.06)` defined.

### Step 2: Typographic Hierarchy Pairings

- **Action:** Combine geometric UI sans (Geist, SF Pro, Helvetica Neue) with editorial serif (Newsreader, Playfair, Instrument Serif) for headings.
- **Input:** Typography token rules.
- **Stop Condition:** Halt if Inter, Roboto, or Open Sans is selected.
- **Validation:** Font stack explicitly defined in Tailwind classes.

### Step 3: Flat Bento Grid & Pastel Accent Assembly

- **Action:** Build flat bento container layout using desaturated pastels (pale red `#FDEBEC`, pale blue `#E1F3FE`, pale green `#EDF3EC`).
- **Input:** Feature list and component structure.
- **Stop Condition:** Halt if heavy drop shadows (`shadow-xl`) or rounded-full containers are added.
- **Validation:** Ultra-flat card structure output without heavy drop shadows.

## 4. Output Specification

```tsx
export function MinimalistBentoCard() {
  return (
    <div className="bg-[#FFFFFF] border border-black/5 rounded-lg p-6 flex flex-col justify-between">
      <div>
        <span className="inline-block px-2.5 py-1 text-xs font-mono bg-[#E1F3FE] text-[#1F6C9F] rounded">
          Telemetry
        </span>
        <h3 className="font-serif text-2xl font-normal text-[#111111] mt-4 tracking-tight">
          Editorial Precision
        </h3>
        <p className="text-sm text-[#787774] mt-2 leading-relaxed">
          Clean structural whitespace designed for focus.
        </p>
      </div>
    </div>
  );
}
```

## 5. Validation Gate

- [ ] Target platform and toolkit recorded (Step 0).
- [ ] Depth reference `../../references/styles/style-minimalist.md` loaded before generation.
- [ ] Canvas uses warm off-white or white background.
- [ ] Banned fonts (Inter, Roboto, Arial) completely absent.
- [ ] No heavy drop shadows (`shadow-md`, `shadow-xl`) applied to cards.
- [ ] Accent tags use muted pastels instead of saturated neon colors.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Defaulting to generic white Bootstrap cards with harsh black borders.
- **Over-execution threshold:** Stripping out interactive visual cues to the point of breaking usability.
- **Calibration default:** Mandatory for productivity tools, document apps, and minimal portfolios.

## 7. Anti-Pattern Compliance

| Step | Prevents AP                  | Mechanism                                   |
| ---- | ---------------------------- | ------------------------------------------- |
| 1    | AP-1 (vague task)            | Locks palette to warm monochrome token map. |
| 2    | AP-18 (unstructured output)  | Enforces typography contrast standards.     |
| 3    | AP-4 (over-permissive agent) | Blocks banned fonts, shadows, and emojis.   |

## 8. Versioning & Changelog

- **Version:** 1.2.0
- **Changelog:**
  - `1.2.0` : Added Step 0 so the skill adapts to web, mobile, desktop, and business-system targets.
  - `1.1.0` : Linked depth reference `../../references/styles/style-minimalist.md`.
  - `1.0.0` : Enterprise standard Tier-5 creation derived from minimalist-skill.

## 9. Portability Matrix

| Runtime     | Status   | Notes                             |
| ----------- | -------- | --------------------------------- |
| Claude Code | verified | Direct minimalist UI generation.  |
| Cursor      | verified | Interactive component generation. |
| Copilot     | verified | Clean component generation.       |
| Windsurf    | verified | Cascade execution.                |
| Kiro        | verified | Minimalist UI runner.             |
| Cline       | verified | System prompt design mode.        |
| Raw API     | verified | Model-agnostic design generator.  |

## 10. Examples

**Input:** "Design a minimal document card component."
**Output:** Warm canvas defined, serif headline used, pale pastel tag attached, flat borders rendered.
