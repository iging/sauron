---
name: skill-first-protocol
description: "Use at the start of every session and before the first action on any new task, including clarifying questions and quick fixes under time pressure. Checks whether a skill covers the task, sets the order of authority between user instructions and skills, and loads the match. Excludes choosing skill content and running the task itself."
department: workflow
ownerAgent: gandalf
triggerCommand: /skill-first
antiPatternsPrevented:
  - AP-8
  - AP-16
  - AP-32
  - AP-47
  - AP-50
---

# Skill-First Protocol

## 0. Identity

- **Role:** Context Steward. Owns which instructions enter the session and in what order of authority.
- **Prime rule:** Before the first action on any task, check whether a skill covers it.
- **Role source:** Appendix A of `skills/_template/skill-name/SKILL.md` (Context Steward).
- **Seniority bar:** Staff (Appendix B). Records why the check comes before the first action (a skill read after work has started gets bent to fit the work already done) and why the rule is restated after compaction (a rule that leaves the context window stops being followed without any visible error).
- **Authority:** Owns skill activation order for a session. Each loaded skill owns its own task.
- **Must not define:** Task execution, skill content (see `08-meta-and-bootstrap/writing-skills`), or skill ranking logic (see `skills/workflow/find-skill`).
- **Normative base:** `core/fellowship/gandalf.md`, `rules/engineering/architecture-boundaries.md`, `references/anti-patterns.md`, `scripts/hooks/session-bootstrap.mjs`, and `skills/workflow/find-skill/SKILL.md`.
- **Anti-pattern gate:** Blocks AP-8 (conflicting instructions), AP-16 (context dumping), AP-32 (god agent), AP-47 (context rot on long sessions), and AP-50 (handoff ping-pong).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value |
| --- | ---------------- | ----- |
| 1   | Task             | For each new task, find the covering skill, load it, and apply the order of authority. |
| 2   | Target Tool      | Any agent runtime: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, raw API. |
| 3   | Output Format    | One line naming the skill in force, or stating that none applies. |
| 4   | Constraints      | One search per task, two at most. Never load the catalog. Never let a skill override an explicit user instruction. |
| 5   | Input            | The user's task and the session bootstrap text. |
| 6   | Context          | Skills that are present and never loaded change nothing. The session hook restates this protocol at startup and after compaction. |
| 7   | Audience         | Every agent working in a repository that carries Sauron skills. |
| 8   | Success Criteria | Each task begins with a skill named or with "none" stated. No explicit user instruction is overridden by a skill. |
| 9   | Examples         | See Section 10. |

## 2. Trigger Matrix

| Trigger | Fire? | Notes |
| ------- | ----- | ----- |
| Session start or resume after compaction | YES | Delivered by the `SessionStart` hook. |
| A new task arrives | YES | Core trigger. Applies before clarifying questions. |
| "Quick, fix this now" | YES | Time pressure does not waive the check. |
| "/skill-first" | YES | Slash command trigger. |
| The user says not to use skills for this task | NO | User instruction outranks this protocol. |
| A subagent received a complete brief from a coordinator | NO | The coordinator already selected the skill. |
| A follow-up message inside a task that has a skill in force | NO | Keep the skill in force. |

## 3. Execution Workflow

### Step 1: Check for a Named Skill

- **Action:** If the user named a skill or typed a slash command, load that skill and skip Step 2.
- **Input:** User message.
- **Stop Condition:** None.
- **Validation:** Named skill loaded, or none was named.

### Step 2: Search

- **Action:** Follow `skills/workflow/find-skill/SKILL.md`: run `node bin/sauron.mjs find-skill "<task in one sentence>"` and confirm the top result against its Trigger Matrix.
- **Input:** Task sentence.
- **Stop Condition:** Stop after two searches. If the command is unavailable, say so and continue without a skill.
- **Validation:** One skill confirmed, or "none" stated.

### Step 3: Apply the Order of Authority

- **Action:** Resolve conflicts in this order: 1. explicit user instruction, 2. process skills (design, planning, isolation, testing, debugging, verification, review), 3. domain skills (framework, language, and tool principles). When a process skill and a domain skill both apply, the process skill decides how to work and the domain skill decides what the result looks like.
- **Input:** Loaded skills and user instructions.
- **Stop Condition:** If a skill step conflicts with an explicit user instruction, follow the user and state in one line what the skill would have required.
- **Validation:** No conflict left unresolved.

### Step 4: Announce and Hand Off

- **Action:** Print the selection line and follow the skill from its Step 1.
- **Input:** Confirmed skill.
- **Stop Condition:** Never return a task to this protocol after handoff.
- **Validation:** Selection line printed before the first action.

## 4. Output Specification

```markdown
**Skill in force:** [name] (`[path]`), or none
**Because:** [Trigger Matrix row, user instruction, or "no skill covers this task"]
```

## 5. Validation Gate

- [ ] The check ran before the first action on the task.
- [ ] At most two searches. The catalog was not read.
- [ ] Explicit user instructions were followed where they conflict with a skill, and the difference was stated.
- [ ] Selection line printed.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Starting work from memory with no check, or loading a skill after the code is written.
- **Over-execution threshold:** Repeating the check on every message of a task in progress, or loading several skills to be safe.
- **Calibration default:** One check per task. One skill in force. "None" is an acceptable result.

### 6.1 Bypass Excuses

Source: pressure run on 2026-10-05.

| Excuse | Why it fails | Required action |
| ------ | ------------ | --------------- |
| "Two minutes is tight. Write the retry loop now and we iterate after the demo if needed." | The search takes under a second. Code written without the repository's conventions is the part that gets redone after the demo. | Run the search, then write. |
| "Tell me which skill handles retries so I code exactly what you want." | It hands the lookup to a user who is short on time and who installed a tool for it. | Run the search yourself. Ask only when two skills fit equally. |

## 7. Anti-Pattern Compliance

| Step | Prevents AP | Mechanism |
| ---- | ----------- | --------- |
| 2    | AP-16 (context dumping) | One ranked lookup in place of catalog reads. |
| 2    | AP-32 (god agent) | One skill in force per task. |
| 3    | AP-8 (conflicting instructions) | Fixed order of authority with the user first. |
| 4    | AP-50 (handoff ping-pong) | No return to the protocol after handoff. |
| Hook | AP-47 (context rot on long sessions) | Bootstrap text is restated after compaction. |

## 8. Versioning & Changelog

- **Version:** 2.0.0
- **Changelog:**
  - `2.0.0` (2026-10-05) - Renamed and rewritten. Added the Prime rule, the order of authority, the search step, the session hook, and Section 6.1 from a recorded pressure run.
  - `1.0.0` : Enterprise standard Tier-5 creation.

## 9. Portability Matrix

| Runtime     | Status   | Notes |
| ----------- | -------- | ----- |
| Claude Code | untested | `SessionStart` hook configured in `.claude/settings.json`. Not yet observed in a fresh session. |
| Cursor      | untested | No hook. Load through rules. |
| Copilot     | untested | No hook. Load through custom instructions. |
| Windsurf    | untested | No hook. |
| Kiro        | untested | No hook. |
| Cline       | untested | No hook. |
| Raw API     | untested | Place the bootstrap text in the system prompt. |

## 10. Examples

**Input:** "Quick, add a retry to fetchUser(). Demo starts in 2 minutes."

**Output:** Runs `node bin/sauron.mjs find-skill "add a retry to a fetch call"`, confirms the top result against its Trigger Matrix, prints the selection line, then writes the code under that skill.

**Failure case:** The user says "skip the plan, go" while `writing-plans` is in force. The agent follows the user, and states in one line that no written plan exists for review or for resuming after compaction.
