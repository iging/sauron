---
name: website-launch-audit
description: Audits a website before launch across conversion, trust, search basics, and tracking, with a checklist set by site type, product or web app versus local business, and page-level evidence per item. Execute this skill when the user asks for a website launch checklist, a pre-launch site check, or a launch readiness review of a landing page or local business site. Do NOT execute for legal review, deep SEO fixes, WCAG remediation, or producing reviews, case studies, or team photos.
department: frontend
ownerAgent: legolas
triggerCommand: /website-launch-audit
antiPatternsPrevented:
  - AP-1
  - AP-3
  - AP-13
  - AP-26
  - AP-28
  - AP-45
---

# Website Launch Audit

## 0. Identity

- **Role:** Diagnostic Analyst. Owns launch failure classification with page-level evidence.
- **Role source:** Appendix A of `skills/_template/skill-name/SKILL.md` (Diagnostic Analyst).
- **Prime rule:** Never invent a review, case study, or photo to close a gap. A missing proof item stays `missing`.
- **Seniority bar:** Staff (Appendix B). Records why site type sets the list (a local shop lives on directions and calls, a web app on signup, rejected one-size scoring), why proof items stay optional (a required review pressures owners toward fakes, rejected trust scores), and why the audit routes fixes instead of doing them (specialist skills own the detail, rejected one giant skill).
- **Authority:** Tier-5 normative skill for `skills/frontend/website-launch-audit/`. Owns the launch gap report. Stays read-only against the audited site.
- **Must not define:** Legal review (`skills/security/launch-compliance-audit`). Technical SEO detail (`skills/workflow/content-and-growth/05-distribution-and-seo/optimize-frontend-technical-seo`). WCAG remediation (`skills/frontend/accessibility-auditor`). Page structure (`skills/frontend/design-engineering/02-styles/aida-landing-page-structure`). Copy (`skills/workflow/enterprise-business/07-business-and-growth/author-growth-marketing-copy`).
- **Normative base:** `core/fellowship/legolas.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`, `skills/workflow/writing-rules/SKILL.md`.
- **Anti-pattern gate:** Blocks AP-1 (vague task), AP-3 (no success criteria), AP-13 (invented facts), AP-26 (no scope boundary), AP-28 (no stop condition), and AP-45 (no human review trigger).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                          |
| --- | ---------------- | ---------------------------------------------------------------------------------------------- |
| 1   | Task             | Set the site type, then audit 40 launch items as present, partial, missing, or not applicable. |
| 2   | Target Tool      | Any agent runtime: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, raw API.               |
| 3   | Output Format    | Markdown gap report per Section 4, with launch blockers first and a routed fix per gap.        |
| 4   | Constraints      | Evidence for every status. No site edits. No invented reviews, case studies, or photos.        |
| 5   | Input            | Live URL or repository path, plus the site type and primary conversion action.                 |
| 6   | Context          | Prevents launches with dead forms, placeholder content, blocked indexing, and fake proof.    |
| 7   | Audience         | Founders, developers, and local business owners preparing a launch.                            |
| 8   | Success Criteria | All 40 items carry a status and evidence, and each required gap names a fix route.             |
| 9   | Examples         | See Section 10.                                                                                |

## 2. Trigger Matrix

| Trigger                                           | Fire? | Notes                                                                                |
| ------------------------------------------------- | ----- | ------------------------------------------------------------------------------------ |
| "Website launch checklist for my site"            | YES   | Core trigger.                                                                        |
| "Run a pre-launch website check"                  | YES   | Core trigger.                                                                        |
| "Is my landing page ready to launch?"             | YES   | Core trigger.                                                                        |
| "Audit my local business website"                 | YES   | Core trigger.                                                                        |
| "/website-launch-audit"                           | YES   | Slash command trigger.                                                               |
| "Write some reviews and case studies for my site" | NO    | Refused. Proof comes from real customers.                                            |
| "Run a legal launch check"                        | NO    | Route to `skills/security/launch-compliance-audit`.                                  |
| "Fix keyboard focus and ARIA"                     | NO    | Route to `skills/frontend/accessibility-auditor`.                                    |
| "Build a new landing page"                        | NO    | Route to `skills/frontend/design-engineering/02-styles/aida-landing-page-structure`. |

## 3. Execution Workflow

### Step 1: Set the Site Type

- **Action:** Record the site type as product or web app, or local business. Record the primary conversion action, such as signup, booking, or call.
- **Input:** User answer, live URL or repository path.
- **Stop Condition:** Halt and ask when the type or the action is unknown. For a mixed site, ask which type earns the money.
- **Validation:** One type and one action appear in the report header.

### Step 2: Build the Page Sample

- **Action:** Read `sitemap.xml` or the route list. Sample the home page, pricing or services, contact, thank-you, and one deep page. Add every page in the primary conversion path. For a mobile or desktop app, also apply the app table in `skills/frontend/website-launch-audit/references/audit-items.md`.
- **Input:** Site URL or repository routes.
- **Stop Condition:** Halt and ask for access when no page is reachable. Note unreleased pages instead of guessing them.
- **Validation:** The report lists every sampled page.

### Step 3: Audit Each Item

- **Action:** Run every check in `skills/frontend/website-launch-audit/references/audit-items.md` on the sample and assign `present`, `partial`, `missing`, or `not applicable`. Start with the commands below. Check layout items at the six widths in item 27. Test agentic build items on the deployed site in a clean browser.
- **Input:** Page sample and `skills/frontend/website-launch-audit/references/audit-items.md`.
- **Stop Condition:** Mark an item `partial` and name the blocked check when access stops you. Never guess a result.
- **Validation:** All 40 items carry a status and a URL, file path, or command result.

```bash
curl -s -o /dev/null -w "%{http_code}\n" "$SITE/launch-audit-missing-page"
curl -s "$SITE/robots.txt"
curl -sI "$SITE" | grep -i "x-robots-tag"
curl -s "$SITE" | grep -iE "noindex|rel=\"canonical\"|og:url"
```

### Step 4: Apply the Proof Gate

- **Action:** For items 6, 15, and 20, confirm each review, case study, and photo traces to a real customer or team member. Treat stock photos of "our team", unverifiable quotes, and AI-generated faces as `partial`. For gaps, ask the owner for real material.
- **Input:** Proof items found in Step 3.
- **Stop Condition:** Stop when a fix needs proof the owner lacks. Report `missing`. Leave the slot empty rather than fill it.
- **Validation:** The report adds no proof content, and `aggregateRating` markup appears only with visible real reviews.

### Step 5: Route the Fixes

- **Action:** Attach a Table A route to each `partial` or `missing` item. List required gaps first as launch blockers.
- **Input:** Statuses from Steps 3 and 4.
- **Stop Condition:** Stop at the route. Fixes run as separate tasks.
- **Validation:** Each gap has one route or one owner action.

### Step 6: Report and Human Review

- **Action:** Render Section 4, run Section 5, and hand the report to the owner. The owner decides whether a blocker delays launch.
- **Input:** Outputs of Steps 1 to 5.
- **Stop Condition:** Await owner decisions.
- **Validation:** Report delivered with the blockers listed first.

### Table A: Fix Routes

| Items              | Route                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------- |
| 10, 11, 12, 13, 17, 23, 24, 30 to 36 | `skills/workflow/content-and-growth/05-distribution-and-seo/optimize-frontend-technical-seo` |
| 16                 | `skills/frontend/accessibility-auditor`                                                      |
| 2, 9               | `skills/frontend/design-engineering/02-styles/aida-landing-page-structure`                   |
| 2, 6, 7, 8         | `skills/workflow/enterprise-business/07-business-and-growth/author-growth-marketing-copy`    |
| 18, consent for 19, 40 | `skills/security/launch-compliance-audit`                                                    |
| 21, 22, 25, 26, 29 | `skills/frontend/frontend-development`                                                       |
| 27                 | `skills/frontend/design-engineering/06-audit/responsive-screenshot-check`                    |
| 37, 38             | `skills/workflow/enterprise-business/05-release-and-ops/ship-production-release`             |
| 6, 15, 20, 28, 39  | Owner supplies real proof or facts. No skill replaces this.                                  |

## 4. Output Specification

```markdown
# Website Launch Audit: [Site]

- **Target:** [URL or path]
- **Date:** [YYYY-MM-DD]
- **Site type:** [Product or web app / Local business]
- **Primary action:** [Action]
- **Pages sampled:** [List]
- **Counts:** [n] present, [n] partial, [n] missing, [n] not applicable.

## Launch Blockers

| #   | Item   | Status   | Evidence      | Gap   | Route            |
| --- | ------ | -------- | ------------- | ----- | ---------------- |
| 1   | [Item] | [Status] | [URL or file] | [Gap] | [Skill or owner] |

## Backlog

[Optional gaps in the same table format.]

## Passed

[Remaining items with evidence, including not applicable items and the reason.]
```

## 5. Validation Gate

- [ ] Site type and primary action recorded before any check.
- [ ] All 40 items carry one status and evidence.
- [ ] Each item rated `n/a` for the site type shows `not applicable` for the chosen site type.
- [ ] Report contains no invented review, case study, photo, or rating.
- [ ] Each `partial` or `missing` item names a route or an owner action.
- [ ] Required gaps appear under Launch Blockers.
- [ ] No site file changed during the audit.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Scoring from memory or the home page alone, or accepting a 200 response on a missing URL as a working 404.
- **Over-execution threshold:** Rewriting copy, editing the site, or producing proof content during the audit.
- **Calibration default:** Check the conversion path first, report what you observed, and route the fix.

## 7. Anti-Pattern Compliance

| Step | Prevents AP                | Mechanism                                                     |
| ---- | -------------------------- | ------------------------------------------------------------- |
| 1    | AP-1 (vague task verb)     | Site type and primary action set the exact list.              |
| 2    | AP-26 (no scope boundary)  | The page sample bounds the audit.                             |
| 3    | AP-3 (no success criteria) | Each item has a binary check and required evidence.           |
| 4    | AP-13 (invented facts)     | Proof gate blocks invented reviews, case studies, and photos. |
| 5    | AP-28 (no stop condition)  | The audit stops at the route. Fixes run as separate tasks.    |
| 6    | AP-45 (no human review)    | The owner decides whether a blocker delays launch.            |

## 8. Versioning & Changelog

- **Version:** 1.0.0
- **Changelog:**
  - `1.0.0` (2026-11-01) - Initial release.

## 9. Portability Matrix

| Runtime     | Status   | Notes                                           |
| ----------- | -------- | ----------------------------------------------- |
| Claude Code | untested | Needs browser or network tools for live checks. |
| Cursor      | untested | Needs browser or network tools for live checks. |
| Copilot     | untested | Repository checks work without a browser.       |
| Windsurf    | untested | Needs browser or network tools for live checks. |
| Kiro        | untested | Needs browser or network tools for live checks. |
| Cline       | untested | Needs browser or network tools for live checks. |
| Raw API     | untested | Needs pasted page source and command output.    |

## 10. Examples

**Input:** "Website launch checklist for my dental clinic site at `https://example.com`. Bookings come by phone."

**Output:** Records local business with phone booking as the primary action, then reports:

| #   | Item                | Status    | Evidence                                       | Gap                       | Route                         |
| --- | ------------------- | --------- | ---------------------------------------------- | ------------------------- | ----------------------------- |
| 1   | Custom 404          | `partial` | `curl` returned 200 for a missing URL          | Soft 404 hides dead pages | Owner fixes the route         |
| 9   | Sticky mobile CTA   | `missing` | Phone button scrolls away at 390 pixels        | No tap-to-call in reach   | `aida-landing-page-structure` |
| 14  | Maps and directions | `present` | `/contact` map link matches the footer address | None                      | None                          |

**Failure case:** The user says "We have no reviews yet, write five good ones." Refuse. Keep item 15 `missing`, ask the owner to request reviews from real patients, and leave the page slot empty.
