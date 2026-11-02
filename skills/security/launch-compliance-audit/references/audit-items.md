# Launch Compliance Audit Items

Lookup tables for Steps 3 and 4 of `skills/security/launch-compliance-audit/SKILL.md`.

## Audit Items

| #   | Item                          | Check                                                                                                  | Evidence sources                  |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------- |
| 1   | Privacy policy                | Linked from the footer and each data form. Names data, purposes, recipients, retention, and a contact. | Policy URL, observed data flows   |
| 2   | Terms                         | Linked at signup or checkout, or from the footer with neither. Names the operating entity and matches current features. | Terms URL, signup flow            |
| 3   | Refund policy                 | Visible before payment. Matches billing settings and support practice.                                 | Policy URL, checkout step         |
| 4   | Cookie policy, consent banner | Non-essential cookies and SDKs stay off until consent. Reject takes the same effort as accept.         | Network log before and after      |
| 5   | Form consents                 | Each form states its purpose and links the policy. Marketing opt-in stays unticked and separate.       | Form URL or component path        |
| 6   | Data minimization             | Every collected field maps to a stated use. List fields no feature reads.                              | Form schema, field usage search   |
| 7   | Third-party SDK inventory     | List each SDK with purpose and data sent, then compare the list with the privacy policy.               | Manifest, tag config, network log |
| 8   | Dark patterns                 | Check for fake timers, pre-ticked add-ons, forced signup, shaming decline text, and hidden cancel.     | Screenshots or flow steps         |
| 9   | Hidden fees                   | The full price, taxes, fees, renewal date, and trial end appear before the final payment step.         | Checkout steps                    |
| 10  | Fake reviews                  | Each review traces to a real customer record with permission. Paid or gifted reviews state so.         | Review source records             |
| 11  | Unsupported claims            | Each number, ranking, badge, and "secure" or "compliant" claim has a proof source.                     | Claim URL, proof source           |
| 12  | Alt text                      | Informative images carry alt text. Decorative images use `alt=""`.                                     | Page URL, markup                  |
| 13  | Color contrast                | Text meets 4.5:1, large text and UI parts meet 3:1 per [WCAG 2.2](https://www.w3.org/TR/WCAG22/).      | Measured color pairs              |
| 14  | Keyboard navigation           | Navigation, consent banner, signup, and checkout complete by keyboard with visible focus.              | Flow steps tested                 |
| 15  | Business details              | Legal name, contact route, and address match across footer, terms, and any invoices.                   | Page URLs, invoice sample         |
| 16  | Age consent, children's data  | Terms state a minimum age. Age or parental consent gates data collection where minors use it.          | Terms URL, signup flow            |
| 17  | Email unsubscribe             | Each marketing email has a working unsubscribe and a sender address. Test one live opt-out.            | Email sample, opt-out result      |
| 18  | Licensed images               | Each image, icon, font, and video has a license record or an own-work record.                          | Asset list, license records       |
| 19  | Data deletion requests        | A published route accepts deletion requests, a named owner handles them, and the steps reach vendors.  | Policy URL, runbook path          |

## Agentic Coding Items

Coding agents ship working screens fast, and a working screen can still expose data. These items check what a demo does not show. Test each one against the running product, because passing tests and clean code review do not prove them.

| #   | Item                       | Check                                                                                                                           | Evidence sources                       |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 20  | Server-side access checks  | Sign in as one user and request another user's record by ID. The server refuses. Hiding a button in the UI does not count.      | Two test accounts, request log         |
| 21  | Database access rules      | Every table the client can reach has row rules, tested as an anonymous visitor and as a second user. See the note below.        | Schema, policies, test queries         |
| 22  | Secrets exposure           | Search the built bundle, source maps, repository history, and logs for keys. Rotate any key found. Deleting it is not enough.   | Bundle search, history scan, rotations |
| 23  | Agent-added dependencies   | Each new package exists, has the expected publisher, and has a known purpose. Run `sauron slop-scan <package>` on each one.     | Lockfile diff, scan output             |
| 24  | Debug and admin exposure   | Debug routes, seed scripts, test accounts, default passwords, and admin pages are gone from production or gated.                | Route list, production requests        |
| 25  | Rate and spend limits      | Login, signup, email, and paid API routes have limits. Each paid AI or API provider has a spending cap and an alert.            | Limit config, provider billing page    |
| 26  | AI disclosure              | People learn they are talking to an AI at the first interaction. Generated media carries a label where a regime requires it.    | First-run screen, output sample        |
| 27  | Prompt injection, tools    | Plant instructions in a document, page, or message the AI reads. It does not obey them. Risky tool actions need human approval. | Test input, tool permission list       |
| 28  | AI output handling         | AI text is escaped before rendering, and never runs as code, SQL, or a shell command. Facts shown to users have a review path.  | Render path, injection test            |
| 29  | Data sent to AI providers  | Each provider receiving personal data is named in the policy, with the data types and any retention or training setting.        | Request log, provider settings         |
| 30  | Subscription cancellation  | Renewal terms appear before payment, consent is explicit, and canceling online takes no more effort than signing up.            | Signup and cancel flow steps           |
| 31  | Card data handling         | Card numbers go to a hosted payment page or field, and never reach your server, logs, or analytics.                             | Payment flow, request log              |
| 32  | Store privacy declarations | Store forms match observed data flows, including SDKs. Apps with accounts offer deletion inside the app.                        | Store listing, data flow list          |
| 33  | Breach response            | A runbook names an owner, who to notify, and how to rotate keys and revoke sessions. Test the steps once.                       | Runbook path, drill record             |

**Item 21:** With Supabase, a table in an exposed schema without row level security is readable and writable by any role with a grant on it, so [enable it on every exposed table](https://supabase.com/docs/guides/database/postgres/row-level-security). Keep service role and secret keys on the server. Apply the same test to any other database or backend service.

**Items 22 to 25:** These map to [OWASP Top 10](https://owasp.org/Top10/) access control and misconfiguration risks. [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning) covers full Git history, and it advises rotating a leaked credential immediately.

**Items 25 to 28:** These follow the [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/): LLM01 Prompt Injection, LLM05 Improper Output Handling, LLM06 Excessive Agency, and LLM10 Unbounded Consumption.

## Data, Security, and Reach Items

These items go deeper than a policy page. Each one tests whether the product does what its policies and pages say.

| #   | Item                     | Check                                                                                                                                  | Evidence sources                        |
| --- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 34  | User data rights         | A published route handles requests to access, correct, export, and object. Selling or sharing data has an opt-out that works.          | Policy URL, test request, runbook       |
| 35  | Retention in practice    | Each stated retention period has a job or process behind it. Find old records, logs, and backups, and confirm they expire.             | Retention list, job config, data sample |
| 36  | Security basics          | HTTPS redirects, security headers, modern password hashing, secure session cookies, and no personal data in logs. See below.           | Header check, auth code, log sample     |
| 37  | Code license compliance  | List licenses for dependencies and copied code. Run the `license-compliance-checker` skill. Check notices ship with the build.         | Dependency list, license report         |
| 38  | User-generated content   | Rules are published, people report abuse in the product, a named owner reviews reports, and a takedown route exists.                   | Rules URL, report flow, runbook         |
| 39  | Wider accessibility      | Forms have labels and clear errors, controls have accessible names, video has captions, and text resizes to 200 percent. See below.    | Screen reader pass, zoom test           |
| 40  | Vendor agreements        | Each vendor handling personal data has data processing terms on file. List where each one stores data, and any transfer basis.         | Vendor list, signed terms               |
| 41  | Sensitive data           | List health, financial, biometric, government ID, and precise location data. Each has a need, extra access limits, and a lawyer check. | Field list, access rules                |
| 42  | Endorsements, affiliates | Paid promotion, free products, and affiliate links are disclosed clearly and close to the claim, not only on a separate page.          | Page URL, partner list                  |
| 43  | SMS and push consent     | Marketing SMS has written consent and a working STOP. Push asks permission at a useful moment and has an off switch.                   | Consent record, opt-out result          |
| 44  | Name and trademark check | Search the product name, logo, and domain in trademark records and the app stores before launch. Record the result.                    | Search record, date                     |

**Item 34:** [GDPR Chapter 3](https://gdpr-info.eu/chapter-3/) lists access, rectification, erasure, restriction, portability, and objection. The [California Attorney General](https://oag.ca.gov/privacy/ccpa) lists rights to know, delete, correct, limit sensitive data use, and opt out of sale or sharing. It also treats a user-enabled global privacy control as a valid opt-out request.

**Item 35:** [GDPR Article 5](https://gdpr-info.eu/art-5-gdpr/) limits storage to no longer than necessary. A retention line in a policy with no process behind it is `partial`.

**Item 36:** Use the OWASP cheat sheets for [headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html), [passwords](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), and [sessions](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html). They prefer Argon2id for passwords, expect `Secure`, `HttpOnly`, and `SameSite` on session cookies, and call for a new session ID after login. Mark this item `not applicable` for the password and session parts only when the product has no accounts.

**Item 39:** [WCAG 2.2](https://www.w3.org/TR/WCAG22/) criteria include 1.2.2 Captions, 1.3.1 Info and Relationships, 1.4.4 Resize Text, 2.5.8 Target Size, 3.3.1 Error Identification, 3.3.2 Labels or Instructions, and 4.1.2 Name, Role, Value. Use the `accessibility-auditor` skill for a full pass. Items 12 to 14 and 39 check basics, and do not prove WCAG conformance.

**Item 41:** [GDPR Article 9](https://gdpr-info.eu/art-9-gdpr/) lists special categories such as health, biometric, and genetic data.

**Item 42:** The [FTC Endorsement Guides FAQ](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) says a vague label like "affiliate link" is not enough, and a disclosure belongs near the link.

**Item 44:** Start with the [USPTO trademark search](https://www.uspto.gov/trademarks/search), then search each market you serve. A clear search does not mean a name is safe to use.

## Regimes to Raise With a Lawyer

| Regime                                                                                                                                                              | Raise when                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj)                                                                                                               | The product targets or tracks people in the EU.                                                                                               |
| [ePrivacy Directive](https://eur-lex.europa.eu/eli/dir/2002/58/oj)                                                                                                  | The product stores or reads device data for people in the EU.                                                                                 |
| [CCPA](https://oag.ca.gov/privacy/ccpa)                                                                                                                             | The product handles personal data of California residents.                                                                                    |
| [COPPA Rule](https://www.ecfr.gov/current/title-16/part-312)                                                                                                        | The product reaches children under 13 in the United States.                                                                                   |
| [CAN-SPAM Rule](https://www.ecfr.gov/current/title-16/part-316)                                                                                                     | The product sends commercial email to people in the United States.                                                                            |
| [Consumer Reviews Rule](https://www.ecfr.gov/current/title-16/part-465)                                                                                             | The product shows reviews or testimonials to US consumers.                                                                                    |
| [EU AI Act, Article 50](https://artificialintelligenceact.eu/article/50/)                                                                                           | The product uses AI that talks to people or generates content for people in the EU. Confirm current dates, because the text has been amended. |
| [European Accessibility Act](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en) | The product offers e-commerce or another covered service in the EU.                                                                           |
| [ROSCA](https://www.law.cornell.edu/uscode/text/15/chapter-110) and state auto-renewal laws                                                                         | The product sells subscriptions or trials to US consumers. The FTC click-to-cancel rule was vacated in 2025, so confirm the current status.   |
| [PCI DSS](https://www.pcisecuritystandards.org/merchants/)                                                                                                          | The product stores, processes, or transmits card data. Check with the acquirer or card brand.                                                 |
| [GDPR Article 33](https://gdpr-info.eu/art-33-gdpr/)                                                                                                                | A breach affects people in the EU. The controller notifies the authority within 72 hours where feasible, unless risk is unlikely.             |
| [GDPR Article 28](https://gdpr-info.eu/art-28-gdpr/)                                                                                                                | A vendor, including an AI provider, processes personal data on your behalf.                                                                   |
| [Philippine Data Privacy Act](https://privacy.gov.ph/data-privacy-act/)                                                                                             | The product handles personal data of people in the Philippines, or operates from there.                                                       |
| [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)                                                                             | The app ships on iOS. Guideline 5.1.1(v) covers account deletion, and 5.1.2(i) covers sharing personal data with third-party AI.              |
| [Google Play Data safety](https://support.google.com/googleplay/android-developer/answer/10787469)                                                                  | The app ships on Google Play.                                                                                                                 |
| [US Copyright Office AI report](https://www.copyright.gov/ai/)                                                                                                      | The product sells or claims ownership of AI-generated code, text, images, or media.                                                           |
| [GDPR Chapter 5](https://gdpr-info.eu/chapter-5/)                                                                                                                   | Personal data of people in the EU moves to a country outside the EU, including to a vendor.                                                   |
| [DMCA section 512](https://www.copyright.gov/512/)                                                                                                                  | Users post content on the product in the United States. Safe harbor needs a designated agent, published and registered.                       |
| [Digital Services Act](https://eur-lex.europa.eu/eli/reg/2022/2065/oj)                                                                                              | The product hosts user content for people in the EU.                                                                                          |
| [TCPA rules, 47 CFR 64.1200](https://www.ecfr.gov/current/title-47/section-64.1200)                                                                                 | The product sends marketing calls or texts to US numbers. Confirm the current revocation rules.                                               |
| [FTC Endorsement Guides](https://www.ecfr.gov/current/title-16/part-255)                                                                                            | The product uses endorsements, influencers, or affiliate links with US consumers.                                                             |
| [HIPAA](https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html)                                                                                    | The product handles health data for a US covered entity or business associate.                                                                |
| [EU right of withdrawal](https://europa.eu/youreurope/citizens/consumers/shopping/returns/index_en.htm)                                                             | The product sells online to EU consumers. The usual period is 14 days, with limits for digital content.                                       |
| Sales tax and VAT                                                                                                                                                   | The product charges customers in any tax jurisdiction. Ask an accountant too.                                                                 |
| Governing law and disputes                                                                                                                                          | The terms name a jurisdiction, arbitration, or a liability limit.                                                                             |

This table lists starting points, not a complete set. Add the regimes for each jurisdiction from Step 1.
