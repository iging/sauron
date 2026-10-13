---
name: find-skill
description: "Use when a task arrives and the right skill is not already named, when the user asks which skill fits a task, or before reading several skill files to choose one. Ranks local skills with the `sauron find-skill` command and loads only the best match. Excludes creating, editing, or installing skills."
department: workflow
ownerAgent: gandalf
triggerCommand: /find-skill
antiPatternsPrevented:
  - AP-1
  - AP-16
  - AP-31
  - AP-48
  - AP-53
---

# Find Skill

## 0. Identity

- **Role:** Context Steward. Owns the context budget spent on choosing a skill, by replacing catalog reads with one ranked lookup.
- **Role source:** Appendix A of `skills/_template/skill-name/SKILL.md` (Context Steward).
- **Seniority bar:** Staff (Appendix B). Records why a ranked lookup beats reading the catalog (the catalog grows with every skill, the lookup result stays a few lines) and why the search is keyword-based with no model call (it is deterministic, runs offline, and costs no tokens to produce).
- **Authority:** Owns skill selection for one task. The selected skill owns the task.
- **Must not define:** Skill content (see `skills/workflow/create-skill`), skill installation (see `sauron add`), or the wording style of prompts.
- **Normative base:** `core/fellowship/gandalf.md`, `rules/engineering/architecture-boundaries.md`, `references/anti-patterns.md`, and `adapters/skill-finder.ts`.
- **Anti-pattern gate:** Blocks AP-1 (vague task verb), AP-16 (context dumping), AP-31 (pasting entire codebase), AP-48 (retry without correction), and AP-53 (tool trust without validation).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                                                                           |
| --- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Task             | Select one skill for one task by running the ranked search and confirming the match against that skill's Trigger Matrix.                        |
| 2   | Target Tool      | Any agent runtime with shell access: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline.                                                       |
| 3   | Output Format    | One selection line: skill name, path, and the reason it matches.                                                                                |
| 4   | Constraints      | At most two searches per task. At most two `SKILL.md` files read during selection. Never read the catalog to choose. Never invent a skill path. |
| 5   | Input            | The task in plain language.                                                                                                                     |
| 6   | Context          | The skill catalog holds hundreds of files. Reading them to choose one fills the context window before work starts.                              |
| 7   | Audience         | The agent that needs a skill and the user who sees which one was chosen.                                                                        |
| 8   | Success Criteria | A skill is selected whose Trigger Matrix marks the task YES, or the agent reports that no skill fits.                                           |
| 9   | Examples         | See Section 10.                                                                                                                                 |

## 2. Trigger Matrix

| Trigger                                           | Fire? | Notes                                    |
| ------------------------------------------------- | ----- | ---------------------------------------- |
| A task arrives and no skill is named              | YES   | Core trigger.                            |
| "Which skill should I use for this?"              | YES   | Core trigger.                            |
| "Find a skill for [task]"                         | YES   | Core trigger.                            |
| "/find-skill"                                     | YES   | Slash command trigger.                   |
| The user names a skill or types its slash command | NO    | Load the named skill directly.           |
| "Create a new skill"                              | NO    | Route to `skills/workflow/create-skill`. |
| "List every skill"                                | NO    | Run `sauron list-skills`.                |

## 3. Execution Workflow

### Step 1: State the Task

- **Action:** Write the task as one sentence with its verb and its object, in the words the user used. Keep technology names.
- **Input:** User prompt.
- **Stop Condition:** Halt and ask when the request holds no concrete task.
- **Validation:** One sentence, at least one verb and one noun.

### Step 2: Run the Search

- **Action:** Run `node bin/sauron.mjs find-skill "<task sentence>" --limit 5`. In an installed project, run `npx sauron-ai find-skill "<task sentence>" --limit 5`.
- **Input:** Task sentence.
- **Stop Condition:** If the command fails, report the error text and stop. Do not fall back to reading the catalog.
- **Validation:** The command exits with code 0 and prints ranked results or a no-match line.

### Step 3: Confirm the Match

- **Action:** Read the top result's `SKILL.md`. Check its Trigger Matrix. If the task is marked NO or is absent from the YES rows in spirit, read the second result. A high score is a hint, not proof.
- **Input:** Ranked results.
- **Stop Condition:** Stop after two files. If neither fits, run one more search with different words taken from the task's domain, then stop. Never run a third search.
- **Validation:** The chosen skill's Trigger Matrix covers the task.

### Step 4: Hand Off

- **Action:** State the selection line. Follow the selected skill from its Step 1. When nothing fits, say so, name the two closest results, and continue without a skill or ask the user.
- **Input:** Confirmed skill.
- **Stop Condition:** Never return the task to this skill after handoff.
- **Validation:** Selection line printed before work starts.

## 4. Output Specification

```markdown
**Skill:** [name] (`[path]`)
**Why:** [Trigger Matrix row or description phrase that matches the task]
```

No match:

```markdown
**Skill:** none
**Closest:** [name 1], [name 2]
**Why not:** [One line per candidate]
```

## 5. Validation Gate

- [ ] Search command was run. The catalog was not read to choose.
- [ ] At most two searches and two `SKILL.md` reads during selection.
- [ ] The chosen skill's Trigger Matrix covers the task, or "none" is reported.
- [ ] Every path in the output came from the command output.
- [ ] Selection line printed before work starts.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Picking a skill from memory, or listing the catalog and reading several files.
- **Over-execution threshold:** Repeating searches with small wording changes, or loading every result.
- **Calibration default:** One search, one file. Report "none" early.
- **Rejected alternatives:** Embedding search lost because it needs a model or a hosted index for a catalog small enough to scan in well under a second. A stored index file lost because a full scan of the catalog was measured at about 0.15 seconds on the development machine, so a cache adds a stale-data risk for no user-visible gain.

## 7. Anti-Pattern Compliance

| Step | Prevents AP                           | Mechanism                                                   |
| ---- | ------------------------------------- | ----------------------------------------------------------- |
| 1    | AP-1 (vague task verb)                | Requires a task sentence with a verb and an object.         |
| 2    | AP-16, AP-31 (context dumping)        | Replaces catalog reads with one command.                    |
| 3    | AP-53 (tool trust without validation) | Confirms the top result against its Trigger Matrix.         |
| 3    | AP-48 (retry without correction)      | Caps searches at two and requires new words for the second. |

## 8. Versioning & Changelog

- **Version:** 1.0.0
- **Changelog:**
  - `1.0.0` (2026-10-05) - Initial Tier-5 release with the `sauron find-skill` command.

## 9. Portability Matrix

| Runtime     | Status      | Notes                                                                     |
| ----------- | ----------- | ------------------------------------------------------------------------- |
| Claude Code | verified    | Command run in this workspace on 2026-10-05.                              |
| Cursor      | untested    | Needs shell access.                                                       |
| Copilot     | untested    | Needs shell access.                                                       |
| Windsurf    | untested    | Needs shell access.                                                       |
| Kiro        | untested    | Needs shell access.                                                       |
| Cline       | untested    | Needs shell access.                                                       |
| Raw API     | unsupported | No shell. Call `rankSkills` from `adapters/skill-finder.ts` in host code. |

## 10. Examples

**Input:** "Which design pattern fits this switch statement?"

**Output:** Runs `node bin/sauron.mjs find-skill "which design pattern fits this switch statement" --limit 5`. Top result is `design-patterns`. Its Trigger Matrix lists "Which design pattern fits this?" as YES.

```markdown
**Skill:** design-patterns (`skills/architecture/design-patterns/SKILL.md`)
**Why:** Trigger Matrix row "Which design pattern fits this?"
```

**Failure case:** The search for "book a flight" returns nothing. The agent reports `**Skill:** none` and does not open the catalog to look for something close.
