#!/usr/bin/env node

/**
 * Sauron Session Bootstrap: SessionStart hook.
 * Strictly implements skills/workflow/autonomous-dev/08-meta-and-bootstrap/skill-first-protocol/SKILL.md
 *
 * Prints a short reminder that the runtime adds to the session context at
 * startup and again after context compaction, so the skill-first rule survives
 * long sessions. Reads nothing, writes nothing, and always exits 0 so a hook
 * failure never blocks a session.
 */

const BOOTSTRAP = [
  "Sauron skill-first protocol is active in this repository.",
  "",
  "Prime rule: before the first action on any task, check whether a skill covers it.",
  "",
  '1. If the user named a skill or typed a slash command, load that skill.',
  '2. Otherwise run: node bin/sauron.mjs find-skill "<task in one sentence>"',
  "3. Read the top result's SKILL.md. Follow it from Step 1 if its Trigger Matrix covers the task.",
  "4. If nothing fits, say so in one line and continue without a skill.",
  "",
  "Order of authority: user instruction, then process skills (design, planning, debugging, testing, verification), then domain skills.",
  "The search takes under a second. Time pressure is not a reason to skip it.",
  "Full protocol: skills/workflow/autonomous-dev/08-meta-and-bootstrap/skill-first-protocol/SKILL.md",
].join("\n");

try {
  process.stdout.write(`${BOOTSTRAP}\n`);
} catch {
  // A closed stdout must not fail the session.
}
process.exit(0);
