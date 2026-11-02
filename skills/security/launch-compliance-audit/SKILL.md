---
name: launch-compliance-audit
description: Audits a product before launch for legal and trust gaps, covering privacy policy, terms, refunds, cookie consent, dark patterns, hidden fees, fake reviews, accessibility basics, and data deletion, with file or URL evidence per item. Execute this skill when the user asks for a legal launch check, a launch compliance audit, or a pre-launch policy review. Do NOT execute for legal advice, final policy writing, code vulnerability audits, or dependency license audits.
department: security
ownerAgent: boromir
triggerCommand: /launch-compliance-audit
antiPatternsPrevented:
  - AP-1
  - AP-3
  - AP-13
  - AP-26
  - AP-28
  - AP-45
---

# Launch Compliance Audit

## 0. Identity

- **Role:** Compliance Mapper. Owns item-to-evidence traceability for pre-launch legal and trust checks.
- **Role source:** Appendix A of `skills/_template/skill-name/SKILL.md` (Compliance Mapper).
- **Prime rule:** Never mark an item present without file or URL evidence, and never call a product compliant.
- **Seniority bar:** Staff (Appendix B). Records why classification precedes checks (a brochure site and a paid app owe different items, rejected one-size checklists), why evidence beats self-report (a footer link proves a page exists, rejected owner attestation), and why a gap report beats generated policy text (boilerplate describes a business the product is not, rejected template pasting).
- **Authority:** Tier-5 normative skill for `skills/security/launch-compliance-audit/`. Owns the launch gap report. Stays read-only against the audited product.
- **Legal boundary:** This audit is not legal advice. It records what the auditor observed. A lawyer reviews all legal text before launch.
- **Must not define:** Legal conclusions or final policy text. Code vulnerability findings (`skills/security/security-auditor`). Dependency license findings (`skills/workflow/license-compliance-checker`). WCAG remediation (`skills/frontend/accessibility-auditor`). Site conversion and SEO checks (`skills/frontend/website-launch-audit`).
- **Normative base:** `core/fellowship/boromir.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`, `skills/workflow/writing-rules/SKILL.md`.
- **Anti-pattern gate:** Blocks AP-1 (vague task), AP-3 (no success criteria), AP-13 (invented facts), AP-26 (no scope boundary), AP-28 (no stop condition), and AP-45 (no human review trigger).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                           |
| --- | ---------------- | ----------------------------------------------------------------------------------------------- |
| 1   | Task             | Classify a product, then audit 44 launch items as present, partial, missing, or not applicable. |
| 2   | Target Tool      | Any agent runtime: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, raw API.                |
| 3   | Output Format    | Markdown gap report per Section 4, with a lawyer review list and an SDK inventory.              |
| 4   | Constraints      | Evidence for every status. No product edits. No legal conclusions. No invented policies.        |
| 5   | Input            | Live URL, repository path, or app build, plus owner answers to the ten classification checks.   |
| 6   | Context          | Prevents launches with absent policies, undisclosed SDKs, and policy text the product breaks.   |
| 7   | Audience         | Founders and developers preparing a launch, and the lawyer who reviews the legal text.          |
| 8   | Success Criteria | All 44 items carry a status and evidence, and the report names what a lawyer must review.       |
| 9   | Examples         | See Section 10.                                                                                 |

## 2. Trigger Matrix

| Trigger                                         | Fire? | Notes                                                  |
| ----------------------------------------------- | ----- | ------------------------------------------------------ |
| "Run a legal launch check on my app"            | YES   | Core trigger.                                          |
| "Launch compliance audit before we go live"     | YES   | Core trigger.                                          |
| "Legal checklist for launching my website"      | YES   | Core trigger.                                          |
| "Do we have the policies and consents we need?" | YES   | Core trigger.                                          |
| "/launch-compliance-audit"                      | YES   | Slash command trigger.                                 |
| "Confirm we are legally compliant"              | NO    | Refused. A lawyer gives legal conclusions.             |
| "Write my privacy policy and mark it done"      | NO    | Refused. See the draft rule in Step 3.                 |
| "Audit dependency licenses"                     | NO    | Route to `skills/workflow/license-compliance-checker`. |
| "Scan the code for vulnerabilities"             | NO    | Route to `skills/security/security-auditor`.           |
| "Check SEO and conversion before launch"        | NO    | Route to `skills/frontend/website-launch-audit`.       |

## 3. Execution Workflow

### Step 1: Classify the Product

- **Action:** Answer C1 to C10 in Table A with a yes or no and a source. Record where the business operates and where its users live.
- **Input:** Owner answers, live URL, repository path, or app build.
- **Stop Condition:** Halt and ask when an answer is unknown. Never default an unknown to no.
- **Validation:** Ten answers and the jurisdictions appear in the report header.

### Step 2: Collect Evidence Sources

- **Action:** List footer links, signup, checkout, cancellation, forms, sent email samples, package manifests, tag manager config, and a network log of a first visit. For mobile and desktop apps, also list onboarding screens, settings, and store listings. For products built with coding agents, also list the built client bundle, database policies, route list, and AI provider settings. Also list response headers, retention jobs, vendor agreements, and the abuse report flow.
- **Input:** Classification from Step 1.
- **Stop Condition:** Halt and ask for access when neither a live product nor a repository is reachable.
- **Validation:** Each applicable audit item has a named place to inspect.

### Step 3: Audit Each Item

- **Action:** Run every check in `skills/security/launch-compliance-audit/references/audit-items.md` and assign one status from Table B. Compare stated text with observed behavior, because a policy the product contradicts is a gap. Keep every draft out of the status count: draft policy text only on explicit request, label it `DRAFT FOR LAWYER REVIEW`, and leave the item `missing` until a reviewed page ships.
- **Input:** Sources from Step 2 and `skills/security/launch-compliance-audit/references/audit-items.md`.
- **Stop Condition:** Mark an item `partial` and name the blocked check when access stops you. Never guess a result.
- **Validation:** All 44 items carry a status, and every `not applicable` cites a classification code or the places searched.

### Step 4: Build the Lawyer Review List

- **Action:** Use the regime table in `skills/security/launch-compliance-audit/references/audit-items.md` to name each regime a lawyer should assess, given the jurisdictions from Step 1. Add every legal page, each `partial` or `missing` legal item, and any regime the user's jurisdiction adds.
- **Input:** Statuses from Step 3.
- **Stop Condition:** Stop short of any statement on whether a regime applies or whether the product meets it.
- **Validation:** The list names items and reasons, and contains no legal conclusion.

### Step 5: Report and Human Review

- **Action:** Render Section 4, run Section 5, and hand the report to the owner.
- **Input:** Outputs of Steps 1 to 4.
- **Stop Condition:** Await owner decisions. Fixes run as separate tasks.
- **Validation:** The report opens with the legal boundary statement.

### Table A: Classification

| Code | Question                                                              | Switches on                             |
| ---- | --------------------------------------------------------------------- | --------------------------------------- |
| C1   | Does it sell anything, including subscriptions and trials?            | 3, 9, 30, 31                            |
| C2   | Does it collect personal data through forms, accounts, or logs?       | 1, 5, 6, 19, 20, 21, 25, 33, 34, 35, 40 |
| C3   | Does it send email, SMS, or push messages?                            | 17, 43                                  |
| C4   | Does it set cookies or similar storage beyond what the service needs? | 1, 4                                    |
| C5   | Does it serve minors, or do minors plausibly use it?                  | 16                                      |
| C6   | Does it load third-party SDKs for analytics, ads, chat, or payments?  | 1, 4, 7                                 |
| C7   | Does it include AI features that users reach?                         | 25, 26, 27, 28, 29                      |
| C8   | Does it ship through an app store?                                    | 32                                      |
| C9   | Can users post content that other people see?                         | 38                                      |
| C10  | Does it handle health, financial, biometric, or ID data?              | 41                                      |

Items 2, 8, 11, 12, 13, 14, 15, 18, 22, 23, 24, 36, 37, 39, and 44 always apply. Item 10 applies when the product shows reviews or testimonials. Item 42 applies when it uses paid promotion, free products for reviewers, or affiliate links.

### Table B: Status Rules

| Status           | Use when                                                                     |
| ---------------- | ---------------------------------------------------------------------------- |
| `present`        | Evidence shows the item exists and matches observed behavior.                |
| `partial`        | The item exists with a gap, or access blocked part of the check.             |
| `missing`        | You searched the named places and the item is absent.                        |
| `not applicable` | A Table A answer or the Item 10 or 42 condition removes it, or the product lacks the surface the item checks, such as forms. Cite the answer or the places searched. |

`present` records existence and consistency. It never means legally adequate.

## 4. Output Specification

```markdown
# Launch Compliance Audit: [Product]

> This audit is not legal advice. It records what the auditor observed. A lawyer reviews all legal text before launch.

- **Target:** [URL, path, or build]
- **Date:** [YYYY-MM-DD]
- **Classification:** Sells [yes/no]. Personal data [yes/no]. Email [yes/no]. Cookies [yes/no]. Minors [yes/no]. SDKs [yes/no].
- **Jurisdictions:** [Business location]. Users in [locations].
- **Counts:** [n] present, [n] partial, [n] missing, [n] not applicable.

| #   | Item   | Status   | Evidence      | Gap   | Next action |
| --- | ------ | -------- | ------------- | ----- | ----------- |
| 1   | [Item] | [Status] | [File or URL] | [Gap] | [Action]    |

## SDK Inventory

| SDK   | Purpose   | Data sent | Named in privacy policy |
| ----- | --------- | --------- | ----------------------- |
| [SDK] | [Purpose] | [Data]    | [yes/no]                |

## Lawyer Review List

- [Legal page or regime]: [reason]
```

## 5. Validation Gate

- [ ] Ten classification answers and the jurisdictions recorded, with no assumed answers.
- [ ] All 44 items carry exactly one Table B status.
- [ ] Every `present`, `partial`, and `missing` cites a file, URL, or observed flow.
- [ ] Every `not applicable` cites the answer or the places searched.
- [ ] Report opens with the legal boundary statement and never says compliant.
- [ ] No draft policy counts as `present`, and every draft carries `DRAFT FOR LAWYER REVIEW`.
- [ ] No product file changed during the audit.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Marking items from a footer scan or owner statement without comparing text to behavior.
- **Over-execution threshold:** Stating legal conclusions, editing the product, or generating policies to close gaps.
- **Calibration default:** Report the observed fact, name the gap, and send the legal question to a lawyer.

## 7. Anti-Pattern Compliance

| Step | Prevents AP                | Mechanism                                                       |
| ---- | -------------------------- | --------------------------------------------------------------- |
| 1    | AP-1 (vague task verb)     | Ten classification answers set the exact item list.             |
| 2    | AP-26 (no scope boundary)  | Named evidence sources bound the audit. Product stays unedited. |
| 3    | AP-13 (invented facts)     | Status requires evidence. Blocked checks stay `partial`.        |
| 4    | AP-28 (no stop condition)  | The list stops at naming review items, before any conclusion.   |
| 5    | AP-3 (no success criteria) | Binary gate on status, evidence, and boundary statement.        |
| 5    | AP-45 (no human review)    | Owner and lawyer decide. Fixes run as separate tasks.           |

## 8. Versioning & Changelog

- **Version:** 1.0.0
- **Changelog:**
  - `1.0.0` (2026-11-01) - Initial release.

## 9. Portability Matrix

| Runtime     | Status   | Notes                                                |
| ----------- | -------- | ---------------------------------------------------- |
| Claude Code | untested | Needs browser or network tools for live checks.      |
| Cursor      | untested | Needs browser or network tools for live checks.      |
| Copilot     | untested | Repository checks work without a browser.            |
| Windsurf    | untested | Needs browser or network tools for live checks.      |
| Kiro        | untested | Needs browser or network tools for live checks.      |
| Cline       | untested | Needs browser or network tools for live checks.      |
| Raw API     | untested | Needs pasted page text, manifests, and network logs. |

## 10. Examples

**Input:** "Run a legal launch check on my paid newsletter at `https://example.com`."

**Output:** Records sells yes, personal data yes, email yes, cookies yes, minors no, SDKs yes, then reports:

| #   | Item                      | Status           | Evidence                              | Gap                             | Next action                      |
| --- | ------------------------- | ---------------- | ------------------------------------- | ------------------------------- | -------------------------------- |
| 3   | Refund policy             | `missing`        | Footer, checkout, and terms searched  | No refund terms before payment  | Owner sets terms, lawyer reviews |
| 7   | Third-party SDK inventory | `partial`        | Network log shows a chat widget       | Privacy policy omits the widget | Update policy, lawyer reviews    |
| 16  | Age consent               | `not applicable` | C5 no, owner confirmed adult audience | None                            | None                             |

**Failure case:** The user says "Write the privacy policy and mark it done." Refuse the status change. Offer a draft labeled `DRAFT FOR LAWYER REVIEW`, keep item 1 `missing`, and add the page to the Lawyer Review List.
