---
name: writing-rules
description: Sauron's single source of writing rules for any reader-facing prose, including skills, docs, UI copy, commit and PR text, and messages. Covers writing style, banned-word tiers, the truth protocol, and citation format. Use when writing or reviewing text a person will read, and when verifying a skill before contributing it.
department: workflow
ownerAgent: legolas
triggerCommand: /writing-rules
antiPatternsPrevented:
  - AP-16
  - AP-29
  - AP-57
---

# Writing Rules

> **Purpose:** The writing rules every Sauron skill, document, and agent output follows. Apply them to articles, UI copy, emails, documentation, skill files, commit messages, PR descriptions, and user-visible messages. Reference this file instead of copying these rules elsewhere.

**How to use this skill:**

- **Writing:** apply every section below while drafting.
- **Reviewing:** check the text against the Review Checklist at the end, fix each failure, then check again.
- **Contributing a skill:** run the Review Checklist on the new `SKILL.md` before opening a pull request.

The rules govern prose only. They do not apply to code, commands, file paths, dependency names, or technical identifiers.

---

## 1. Writing Style

Apply these rules to every string the reader sees.

- Use clear, simple language.
- Be spartan and informative.
- Use short, impactful sentences.
- Use active voice. Avoid passive voice.
- Write in present tense (for example "Returns the response" instead of "Will return the response").
- Focus on practical, actionable content.
- Use "you" and "your" to address the reader directly.
- Support claims with evidence or examples when possible.
- Avoid em dashes anywhere. Use commas or periods. To connect ideas, use a period. Never use an em dash.
- Avoid Latin abbreviations in prose (such as `e.g.`, `i.e.`, `etc.`). Spell them out (for example use "for example" instead of "e.g.", "that is" instead of "i.e.", "and so on" instead of "etc.").
- Avoid constructions like "not just this, but also this."
- Avoid metaphors and cliches.
- Avoid generalizations without supporting evidence.
- Avoid setup phrases such as "in conclusion," "in closing," or "in summary."
- Avoid unnecessary adjectives and adverbs.
- Avoid hashtags.
- Avoid semicolons in prose (allowed in code).
- Avoid markdown syntax inside plain-text string values.
- Avoid asterisks in prose.
- Avoid warnings, disclaimers, or meta-notes in the output. Return only the requested content.
- Match the formality register of the target language in localized output. The direct "you" belongs to informal English and does not transfer to formal-register locales such as German Sie-form or Japanese honorific speech.

**Rework example.** Before: `This groundbreaking tool utilizes innovative algorithms to seamlessly unlock powerful insights.` After: This tool applies proven matching algorithms and returns ranked results in under one second.

---

## 2. Banned Words

Do not use banned words in reader-facing prose. These lists do not apply to code, commands, dependency names, or technical identifiers.

### Always Banned

delve, embark, esteemed, shed light, craft, crafting, imagine, remarkable, it remains to be seen, glimpse, unlock, discover, skyrocket, abyss, not alone, innovative, revolutionary, customize, disruptive, utilize, utilizing, illuminate, unveil, pivotal, intricate, elucidate, paradigm, however, harness, exciting, groundbreaking, skyrocketing, opened up, powerful, inquiring, exploration, testament, in summary, in conclusion, most importantly, really, literally, actually, basically, very, just, probably.

### Scoped Bans

Apply these bans by grammatical role rather than by string match.

- **that**: Banned as filler or a vague demonstrative ("that was great", "I know that feeling"). Allowed as a relative pronoun or complementizer ("the file that owns routing", "verify that tests pass").

### Extended Tier

Ban these marketing and filler terms in reader-facing prose.

tapestry, beacon, beacon of, multifaceted, synergy, synergistic, pivot, leverage, holistic, robust, seamless, game-changer, supercharge, elevate, curate, paradigm shift, herculean, panacea, linchpin, quintessential, cornerstone, bedrock, testament to.

### Use Sparingly

Banned in marketing-style or filler sentences. Allowed in instructional or technical contexts.

- **can**: Allowed in "You can verify this by running the test suite." Banned in "This tool can revolutionize your workflow."
- **may**: Allowed in "The build may fail if dependencies are missing." Banned in "This approach may be the key to success."
- **could**: Same rule as "can" and "may."
- **maybe**: Prefer a concrete statement or a specific condition.

### Enforcement

- **Doctrine:** this file governs every string an agent writes for readers, in full.
- **Review:** Sauron has no automated word checker yet. Enforce the rules with the Review Checklist below, with `/spec-reviewer` for skills and specifications, and with `/delete-ai-words` for general prose.
- **Exempt content:** quoted source text, code, commands, identifiers, and the word lists in this file.

---

## 3. Truth Protocol

Apply this protocol to any prompt that produces factual claims, technical statements, or data.

### You should

- Tell the truth. Never speculate or guess.
- Base statements on verifiable, factual, current sources.
- Cite sources as inline links placed directly beside each claim they support. One link per claim. Prefer primary sources over commentary.
- State "I cannot confirm this" when something cannot be verified.
- Prioritize accuracy over speed. Verify before writing.
- Stay objective and free of bias unless the user requests a viewpoint.
- Use interpretation only from credible, reputable sources.
- Explain reasoning step by step when accuracy is in question.
- Show how computed figures (reading time, word count, and so on) are calculated.
- Present information so the reader can verify it independently.

### You must avoid

- Fabricating facts, quotes, or data.
- Using outdated or unreliable sources.
- Omitting source details.
- Presenting speculation, rumor, or assumptions as fact.
- Using fake or AI-generated citations.
- Writing without disclosing uncertainty.
- Making confident claims without proof.
- Using filler to hide missing information.
- Giving partial truths that omit context.
- Prioritizing style over correctness.

### Failsafe

Before writing each factual claim, ask: "Is this statement verifiable, credible, free of fabrication, and transparently cited?" If not, revise it until it is, or remove it.

---

## 4. Review Checklist

Run this on any text before it ships. A single failure means the text is not done.

- [ ] No em dashes.
- [ ] No Latin abbreviations in prose.
- [ ] No word from the Always Banned or Extended Tier lists in prose.
- [ ] "that", "can", "may", "could", and "maybe" used only in their allowed roles.
- [ ] Active voice and present tense.
- [ ] No semicolons, hashtags, or asterisks in prose.
- [ ] No setup phrases, disclaimers, or meta-notes.
- [ ] Every factual claim is verifiable, and cited when it comes from outside the repository.
- [ ] Uncertainty is stated, not hidden.

---

## 5. Changelog

- **v1.2.0** (2026-10-17): Adopted as Sauron's single writing standard in this skill, with rules carried over from the user's agent-spec repository at its v1.2.0. Replaced the mechanical-enforcement note, which named a script Sauron does not have, with the review path Sauron uses. Added the Review Checklist. The copies under `define-core-domains` and `spec-reviewer` now point here.
- **v1.2.0** (2026-08-27, agent-spec): Banned Latin abbreviations in prose in favor of spelled-out equivalents. Added the present-tense constraint.
- **v1.1.0** (2026-08-23, agent-spec): Removed three self-inflicted em dashes. Deduplicated "embark". Moved "that" from absolute ban to scoped ban by grammatical role. Added the Extended Tier, the Enforcement Tiers section, a rework example, a localization register rule, and an inline citation format.
- **v1.0.0** (original): Initial style rules, banned-word list, and truth protocol.
