---
description: Ranks local skills for a task and loads only the best match instead of the full catalog.
---

Find the right skill for the user task with the Sauron find-skill skill:

1. Run `node bin/sauron.mjs find-skill "$ARGUMENTS" --limit 5`.
2. Read the top result's `SKILL.md` only. Read a second result only when the first one's Trigger Matrix marks the task as NO.
3. If nothing matches, say so and run `node bin/sauron.mjs list-skills`. Never guess a skill path.
4. State which skill was chosen and why in one line, then follow that skill from its Step 1.
