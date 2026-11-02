# Website Launch Audit Items

Lookup tables for Steps 2 and 3 of `skills/frontend/website-launch-audit/SKILL.md`.

## Audit Items

`req` puts a gap on the blocker list. `opt` puts it on the backlog. `n/a` marks the item not applicable for that site type.

| #   | Item                   | Product | Local | Check                                                                                 |
| --- | ---------------------- | ------- | ----- | ------------------------------------------------------------------------------------- |
| 1   | Custom 404             | req     | req   | Missing URLs return HTTP 404 and show navigation plus a path to the primary action.   |
| 2   | Above-the-fold CTA     | req     | req   | One primary action shows without scrolling and says what happens next.                |
| 3   | Internal links         | req     | req   | No broken links. Key pages sit within three clicks. No orphan pages in the sample.    |
| 4   | Thank-you page         | req     | req   | Inquiry forms land on a page with its own URL, a receipt, and the next step. Sites with no form mark this not applicable. |
| 5   | Breadcrumbs            | opt     | opt   | Pages two or more levels deep show their path. Flat sites mark this not applicable.   |
| 6   | Case studies           | opt     | opt   | Named real work with a result the customer approved. Local sites show past jobs.      |
| 7   | FAQ                    | opt     | req   | Answers cover price, timing, coverage area, and the top objection.                    |
| 8   | Response-time promise  | opt     | req   | Contact points state a reply time the team keeps.                                     |
| 9   | Sticky mobile CTA      | opt     | req   | Stays in reach on phones without covering content. Local sites use a `tel:` link.     |
| 10  | robots.txt             | req     | req   | Returns 200, keeps no staging `Disallow: /`, and names the sitemap.                   |
| 11  | Unique titles          | req     | req   | Each sampled page has a distinct title matching its content.                          |
| 12  | Meta descriptions      | req     | req   | Each sampled page has a distinct description matching its content.                    |
| 13  | Social share images    | req     | req   | `og:image` uses an absolute URL that loads, and a share preview shows it.             |
| 14  | Maps and directions    | n/a     | req   | A map or directions link matches the listed address, with parking or transit notes.   |
| 15  | Real reviews           | opt     | opt   | Each review traces to a real customer. Local sites link to the public review profile. |
| 16  | Alt text               | req     | req   | Informative images describe their content. Decorative images use `alt=""`.            |
| 17  | Schema matched to type | req     | req   | JSON-LD parses, matches visible content, and fits the schema table below.             |
| 18  | Privacy page           | req     | req   | Reachable from the footer and each form. Route content to `launch-compliance-audit`.  |
| 19  | Analytics              | req     | req   | Pageviews and the primary action each fire once in a test run.                        |
| 20  | Real team photo        | opt     | opt   | The about or contact page shows the actual people, with their permission.             |

## Agentic Build Items

Coding agents leave a site looking finished before it works. These items catch what a screenshot hides. Test each one on the deployed site, in a clean browser.

| #   | Item                 | Product | Local | Check                                                                                            |
| --- | -------------------- | ------- | ----- | ------------------------------------------------------------------------------------------------ |
| 21  | Placeholder content  | req     | req   | No lorem ipsum, TODO text, sample logos, invented numbers, `example.com`, or framework defaults. |
| 22  | Dead interactions    | req     | req   | Every button, link, and form does what it says. Any test form reaches a real inbox.              |
| 23  | Production URLs      | req     | req   | Canonical, `og:url`, robots, sitemap, and links use the live domain, not localhost or a preview. |
| 24  | Indexing switch      | req     | req   | Live pages carry no `noindex`. Staging stays out of search through `noindex` or a password.      |
| 25  | State coverage       | req     | opt   | Empty, loading, error, and long-text states look intended. Test a slow connection once.          |
| 26  | Console and network  | req     | req   | The primary path runs with no console errors and no failed requests.                             |
| 27  | Responsive check     | req     | req   | No horizontal scroll or clipped controls at 320, 375, 425, 768, 1024, and 1440 pixels.           |
| 28  | Copy matches product | req     | req   | Run each published command. Check each price, feature, and version against the real product.     |
| 29  | Primary action works | req     | req   | A new visitor completes the primary action end to end, and the owner receives any result it sends. |

## Performance, Search, and Reliability Items

| #   | Item                   | Product | Local | Check                                                                                             |
| --- | ---------------------- | ------- | ----- | ------------------------------------------------------------------------------------------------- |
| 30  | Core Web Vitals        | req     | req   | LCP within 2.5 seconds, INP within 200 ms, and CLS within 0.1 at the 75th percentile. See below.  |
| 31  | Main image loading     | req     | req   | The largest image sits in the HTML, is never lazy-loaded, is sized correctly, and has dimensions. Text-led pages mark this not applicable. |
| 32  | Crawlable content      | req     | req   | Key content appears in the initial HTML, and navigation uses real `<a href>` links.               |
| 33  | One preferred URL      | req     | req   | `http`, `www`, and trailing slash versions redirect to one URL, and the canonical tag agrees.     |
| 34  | Sitemap                | opt     | opt   | Lists only live canonical URLs. A small, well-linked site may not need one.                       |
| 35  | Readable URLs, anchors | opt     | opt   | URLs use words, not IDs. Link text says where the link goes.                                      |
| 36  | Favicon and manifest   | opt     | opt   | Icons load, and the manifest has a name and valid paths.                                          |
| 37  | Error monitoring       | req     | opt   | Someone gets told when the site fails. Trigger one test error or outage alert.                    |
| 38  | Rollback               | req     | opt   | The owner knows how to return to the last good deployment, and has tried it once.                 |
| 39  | Listing consistency    | n/a     | req   | Name, address, phone, and hours match across the site, footer, schema, and business listings.     |
| 40  | Compliance audit       | req     | req   | Run `launch-compliance-audit`. Its findings cover legal pages, data, security, and AI risks.      |

**Item 24:** Google says [robots.txt does not keep a page out of Google](https://developers.google.com/search/docs/crawling-indexing/robots/intro). Use `noindex` or a password, and do not block that page in robots.txt, because a crawler must fetch the page to see `noindex`.

**Item 30:** Thresholds come from [web.dev Core Web Vitals](https://web.dev/articles/vitals). Prefer field data. For a new site with no field data, record a lab result and mark the item `partial`.

**Item 31:** [web.dev LCP guidance](https://web.dev/articles/optimize-lcp) says never to lazy-load the LCP image, and to use `fetchpriority="high"`.

**Item 32:** Google says [server-side rendering or prerendering is still a great idea](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), and warns about soft 404 errors in single-page apps. Confirm item 1 returns a real 404 status.

**Item 33:** Google treats [redirects as a strong canonical signal and sitemaps as a weak one](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

**Item 34:** See [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

## Schema by Site Type

| Site type          | Expected markup                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Product or web app | [`SoftwareApplication`](https://schema.org/SoftwareApplication) or [`Product`](https://schema.org/Product) with `Organization`. |
| Local business     | [`LocalBusiness`](https://schema.org/LocalBusiness) or a subtype, with the address, phone, and hours shown on the page.         |

- Structured data must [describe content visible on the page](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data). Validate it with the Rich Results Test.
- [`LocalBusiness`](https://developers.google.com/search/docs/appearance/structured-data/local-business) requires `name` and `address` in Google's guide.
- The [software app rich result](https://developers.google.com/search/docs/appearance/structured-data/software-app) needs `name`, `offers.price`, and real ratings or reviews. Without them, the markup stays valid but earns no rich result. Never invent a rating to qualify.
- Google [stopped showing FAQ rich results](https://developers.google.com/search/docs/appearance/structured-data/faqpage) in May 2026. Keep FAQs for readers, not for search appearance.
- Open Graph [requires](https://ogp.me/) `og:title`, `og:type`, `og:image`, and `og:url`.

## Mobile and Desktop Apps

Run the audit on the marketing site as usual. For the app itself, translate these items and skip the rest.

| Site item                   | Mobile app                                             | Desktop app                                       |
| --------------------------- | ------------------------------------------------------ | ------------------------------------------------- |
| Custom 404                  | Error screen for dead deep links and offline state     | Error view for dead deep links and failed updates |
| Above-the-fold CTA          | One primary action on the first screen                 | One primary action in the first window            |
| Internal links, breadcrumbs | Deep links and the back stack return to a known screen | Sidebar or title bar shows the current location   |
| Thank-you page              | Confirmation screen with the next step                 | Confirmation view with the next step              |
| Sticky mobile CTA           | Primary action inside thumb reach                      | Not applicable                                    |
| robots.txt, titles, meta    | Store listing title and description                    | Store listing or download page                    |
| Social share images         | Store screenshots and deep link previews               | Store screenshots or download page image          |
| Real reviews                | Store ratings. Never filter the prompt by sentiment    | Store ratings or approved customer quotes         |
| Alt text                    | Screen reader labels on every control and image        | Accessible names from the platform toolkit        |
| Privacy page                | In-app link plus store privacy disclosures             | Link in the About or Settings view                |
| Analytics                   | App events for first run and the primary action        | App events for first run and the primary action   |
| Placeholder content         | No sample data or lorem ipsum in screens or store text | No sample data or default app names               |
| Dead interactions           | Every control responds, including offline              | Every menu item and shortcut responds             |
| Responsive check            | Small phones, large phones, tablets, and rotation      | Window resize and display scaling                 |
| Rollback                    | Staged rollout and a tested hotfix path                | Tested update rollback                            |
