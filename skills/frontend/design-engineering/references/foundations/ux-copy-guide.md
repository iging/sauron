# UX Copy Guide

How to write the words in an interface: headlines, buttons, form text, errors, and empty states. Broader content strategy lives in `skills/frontend/ui-ux-principles/SKILL.md`.

> **Platforms.** The rules here hold for web, mobile, and desktop. The code samples show the web expression in CSS. For iOS, Android, desktop apps, and business systems, translate units, sizes, and conventions with `platform-adaptation.md`.

## 1. Principles

1. **Use the reader's words.** Lift vocabulary from the client's own material and their customers' reviews.
2. **Say the specific thing.** "Brickwork for new homes, laid straight and level" beats "quality solutions".
3. **Lead with the benefit or the verb.** The first three words carry the line.
4. **One idea per sentence.** If a sentence needs a comma to survive, try two sentences.
5. **Never invent proof.** Reviews, numbers, years, awards, and client names come from the client or stay as a marked placeholder.

## 2. Headlines

| Element          | Length         | Job                                       |
| ---------------- | -------------- | ----------------------------------------- |
| Page headline    | 3 to 8 words   | What this is, or the promise              |
| Supporting line  | Under 25 words | A fact the headline does not contain      |
| Section heading  | 3 to 9 words   | A claim or a clear label for what follows |
| Card title       | 1 to 4 words   | The name of the thing                     |
| Card description | 8 to 20 words  | What it is and why it matters             |

- A heading that could sit above any section on any site ("Our Services", "Why Choose Us") is a label. Use it as a small label and write a real heading beneath it, or replace it with a claim.
- Do not stack three benefit fragments ("Fast. Simple. Secure.") unless each is then proven.
- Pick one capitalisation style for headings and buttons and keep it. Record the choice in the project `DESIGN.md`.

## 3. Buttons and Links

| Weak       | Better              | Why                             |
| ---------- | ------------------- | ------------------------------- |
| Submit     | Send quote request  | Names the outcome               |
| Click here | See recent work     | Makes sense out of context      |
| Learn more | How pricing works   | Says what the reader will learn |
| OK         | Delete project      | Confirms the actual action      |
| Continue   | Continue to payment | Says where it leads             |

- Start with a verb. Two to four words.
- The same action has the same label everywhere on the site.
- Link text describes the destination. Screen-reader users hear links as a list.
- In-progress labels end with the ellipsis character: "Sending…".

## 4. Forms

- **Labels** are nouns: "Phone number", not "Enter your phone number".
- **Help text** answers the question a field raises: format, why it is asked, whether it is shared.
- **Optional** is marked in the label: "Suburb (optional)".
- **Placeholders** show an example format only when the format is not obvious.
- Ask only for what the next step needs. Each extra field loses people.

## 5. Errors

Every error message has three parts: what happened, why if it helps, and what to do next.

| Weak                 | Better                                                              |
| -------------------- | ------------------------------------------------------------------- |
| Invalid input        | Enter a phone number we can reach you on, for example 0412 345 678. |
| Error 500            | We could not send your request. Try again, or call 0410 522 678.    |
| Required             | Enter your name so we know who to call back.                        |
| Something went wrong | Your photo is larger than 10 MB. Choose a smaller file.             |

- No blame ("You entered an invalid..."). Describe the fix.
- No codes or stack details in front of users.
- Always offer a second route when the first fails.

## 6. Empty, Loading, Success

| State   | Formula                                          | Example                                                       |
| ------- | ------------------------------------------------ | ------------------------------------------------------------- |
| Empty   | What belongs here, plus the action that fills it | No photos in this category yet. Ask us about a job like this. |
| Loading | What is happening, ending with the ellipsis      | Loading recent work…                                          |
| Success | What happened, plus what happens next            | Request sent. We will call you within one business day.       |

Promise a response time only when the client has confirmed it.

## 7. Tone

| Dial      | Low               | High                       | Set by                |
| --------- | ----------------- | -------------------------- | --------------------- |
| Formality | "Give us a call"  | "Contact our office"       | Audience and sector   |
| Energy    | Calm statements   | Short punchy lines         | Brand and motion dial |
| Detail    | One line per idea | Specs, measurements, steps | Density dial          |

Keep the tone steady across the page. Errors and legal text drop the energy and stay plain.

## 8. Mechanics

- Active voice, second person: "Tell us what you are planning."
- Numerals for numbers: "3 steps", "24 hours".
- Typographic quotes and the single ellipsis character.
- A non-breaking space between a number and its unit, and inside phone numbers.
- No long dashes. Use a comma, a period, or two sentences.
- No emoji in interface copy.
- Spell and format for the locale: Australian English for an Adelaide business, with local phone and address formats.
- Avoid the worn words: elevate, seamless, unleash, empower, cutting-edge, next-generation, solutions, world-class.

## 9. Checklist

- Headline within length and specific to this business.
- Every button names its outcome; one label per action site-wide.
- Every field has a noun label; optional fields marked.
- Every error says what to do next.
- Empty, loading, and success states written.
- No invented proof; placeholders marked.
- Locale spelling and formats applied.
