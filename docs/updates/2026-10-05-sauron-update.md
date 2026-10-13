# Sauron Update: October 5, 2026

> Para sa video. Taglish. Lahat ng numero dito ay sinukat sa mismong repo, hindi hula. Naka-working tree pa lahat, wala pang commit o release.

---

## TL;DR (pang-intro ng video)

Tatlong bagong bagay sa Sauron ngayong session:

1. **`design-patterns` skill.** Isang skill na gumagana sa lahat ng major programming languages.
2. **`sauron find-skill`.** Hahanapin ng agent ang tamang skill sa loob ng wala pang isang segundo, imbes na basahin ang buong catalog.
3. **Skill discipline layer.** 14 na development skills ang nilagyan ng "Prime rule" at "Bypass Excuses", plus session hook para kusang mag-check ng skill ang agent.

Status: `npm test` 64 pass, 0 fail. `npx tsc --noEmit` pasado.

---

## 1. Design Patterns skill

**Problema:** Kapag tinanong mo ang AI ng "anong design pattern dito?", madalas magbibigay agad ng Strategy, Factory, o Singleton kahit hindi kailangan. Over-engineering ang resulta.

**Ginawa:** `skills/architecture/design-patterns/`

Paano ito mag-isip, sunod-sunod:

1. Ano ang code smell, at saang linya?
2. Ano ang totoong dahilan? May naka-schedule bang pagbabago, o hula lang?
3. Subukan muna ang pinakamura: iwan na lang, extract function, o built-in na feature ng language.
4. Pattern lang kapag hindi kaya ng mas simple.
5. Isulat ang trade-off at kung kailan babalikan.

**Mga punto na puwedeng i-highlight sa video:**

- Valid na sagot ang **"no pattern"**.
- Language feature muna bago pattern. Halimbawa, sa TypeScript, lookup map ng functions ang kapalit ng Strategy classes kapag walang state ang handlers.
- May table para sa 10 languages: TypeScript/JavaScript, Python, Java, C#, Go, Rust, Kotlin, Swift, PHP, C++.
- May listahan ng patterns na kailangan ng extra justification: Singleton, Abstract Factory, Visitor, Service Locator, CQRS.
- May "removal signals": kailan dapat **tanggalin** ang pattern. Halimbawa, interface na iisa lang ang implementation.

**Research:** 20 URLs ang tinarget, 16 ang na-verify, 4 ang hindi nag-load. Sources: Martin Fowler, Sandi Metz, Robert Nystrom, Brandon Rhodes, Effective Go, Kotlin docs, Refactoring.Guru, Microsoft Azure Architecture Center.

**Honest na limitasyon:** Python, Go, at Kotlin lang ang may na-fetch na source para sa language rows. Ang iba ay naka-label na `[general]`, ibig sabihin kilalang feature ng language pero hindi ko na-verify sa official docs sa session na ito.

---

## 2. `sauron find-skill`

**Problema:** 375 skills na ang Sauron. Kapag binasa ng agent ang catalog para pumili ng isa, ubos agad ang context bago pa magsimula ang trabaho.

**Ginawa:** bagong CLI command.

```bash
node bin/sauron.mjs find-skill "write a failing test first"
node bin/sauron.mjs find-skill "which design pattern fits this switch" --limit 3
node bin/sauron.mjs find-skill "debug this" --json
```

**Paano gumagana:**

- Binabasa ang frontmatter ng bawat `SKILL.md`: name, description, at Trigger Matrix rows na YES.
- Weighted BM25 scoring. Name = 3, trigger phrases = 2, description = 1.
- Walang AI call, walang network, walang sinusulat na file. Deterministic.
- Nagbibigay ng paste-ready line: "Read [path], then: [task]".

**Sukat (isang query, characters hindi tokens):**

| Babasahin ng agent                | Characters |
| :-------------------------------- | ---------: |
| `find-skill` report, top 5        |      2,134 |
| Lahat ng skill name + description |    112,896 |
| Lahat ng `SKILL.md` nang buo      |  4,152,304 |

- Ang report ay **1.89%** ng name + description total.
- Scan + rank ng 375 skills: **76 ms**. Buong CLI call: mga 0.15 segundo.

**Paano i-reproduce:** `node scripts/skills/measure-finder.mjs`

**Honest na limitasyon:**

- Characters ang sinukat, hindi tokens, at isang query lang.
- Hindi kasama sa bilang ang mismong skill file na babasahin pagkatapos.
- Mahina sa sobrang ikling query gaya ng "is it done", kasi stop words halos lahat.
- Keyword search ito. Kapag walang kaparehong salita ang description ng skill, hindi lalabas.

**Magandang kuwento para sa video:** Noong una, pang-**17** ang `test-driven-development` sa query na "write a failing test first". Hindi bug ng finder. Ang description ng skill ay walang salitang tina-type ng totoong user. Pagkatapos i-rewrite ang descriptions, naging **#1**. Lesson: isulat ang description ayon sa kung **kailan** gagamitin, hindi kung ano ang ginagawa.

**Mga file:** `adapters/skill-finder.ts`, `tests/unit/skill-finder.test.mjs` (20 tests), `skills/workflow/find-skill/SKILL.md`, `.claude/commands/find-skill.md`.

---

## 3. Skill discipline layer

**Problema:** May 14 na development skills na ang Sauron (TDD, debugging, planning, code review, at iba pa). Kumpleto bilang dokumento, pero walang nagpapagana sa kanila. Gagana lang kapag tinype mo ang slash command.

**Ginawa:**

| Bagay                         | Ano ito                                                                                                                                                       |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Session hook**              | `scripts/hooks/session-bootstrap.mjs`. 114 words na paalala sa simula ng session at pagkatapos ng context compaction: "bago kumilos, i-check kung may skill". |
| **Skill-first protocol**      | Bagong sulat na skill. Order of authority: user instruction, tapos process skills, tapos domain skills.                                                       |
| **Prime rule**                | Isang absolute na pangungusap sa bawat skill. Halimbawa sa TDD: "No production code without a test that was seen to fail first."                              |
| **Bypass Excuses**            | Table ng mga palusot ng agent, bakit mali, at ano ang dapat gawin.                                                                                            |
| **3 tracks sa brainstorming** | Probe, Patch, Blueprint. Hindi na kailangan ng full design doc para sa maliit na pagbabago.                                                                   |
| **Fix cap**                   | 3 failed fixes, hinto na. Balik sa root cause investigation.                                                                                                  |
| **Subagent briefs**           | `builder-brief.md`, `task-review-brief.md`, `recheck-brief.md`.                                                                                               |
| **Template v1.1.0**           | Optional na `Prime rule` at Section 6.1 para sa lahat ng susunod na skill.                                                                                    |

**Halimbawa ng Bypass Excuse (TDD):**

> "It is 6 pm, the fix works, and test debt tomorrow is better than staying late tonight."
>
> Bakit mali: ang test bukas ay isusulat laban sa code na pumapasa na, kaya walang makakakita na nag-fail ito.

### Pressure tests: ang totoong resulta

Nagpatakbo ako ng 16 na subagent runs. Bawat isa ay binigyan ng sitwasyon na may pressure (deadline, pagod, senior na nag-utos) at tatlong pagpipilian.

- **13 sa 14** baseline agents ang pumili ng tamang sagot **kahit walang skill**.
- Ibig sabihin: **hindi napatunayan ng tests na ito na binabago ng skills ang behavior.** Masyadong madali ang multiple choice.
- Ang nakuha ko lang doon ay ang eksaktong wording ng mga palusot, na ginamit sa Bypass Excuses.

**Ang isang "mali":** sa `writing-plans`, sinabi ng user sa scenario na "plan is overhead, go", kaya nag-code agad ang agent. Tama pala ang agent, mali ang scenario ko. Mas mataas ang utos ng user kaysa sa skill. Inayos ko ang skill: valid ang malinaw na waiver ng user, pero hindi waiver ang "mukhang nagmamadali lang". Sa rerun na may skill, tama ang agent sa parehong kaso. Isang model at isang run lang iyon.

**Honest na limitasyon:**

- Hindi ko pa nakikita ang session hook sa bagong session. Naka-configure, hindi pa na-observe.
- Kailangan ng open-ended na scenarios (totoong trabaho, hindi multiple choice) para masabing gumagana talaga.
- Claude Code lang ang may hook. Wala pa sa ibang runtimes.

---

## 4. Iba pang ginawa

- Tapos na ang rename ng `openclaude` runtime adapter papuntang `openclaw`.
- Inayos ang hook config sa `.claude/settings.json` (maling event name dati).
- Nilinis ang repo: tinanggal ang `projects/` folder at mga pansamantalang file.
- Ang `design-patterns` skill ay naka-mirror din sa isa ko pang project.

---

## 5. Mga lesson na puwedeng pag-usapan sa video

1. **Sukatin bago mag-claim.** Gumawa ako ng measurement script imbes na magsabi ng "97% savings". Ang lumabas: 1.89% ng babasahin, characters, isang query.
2. **Ang test na pumapasa nang walang feature ay walang pinapatunayan.** 13 sa 14 ang pumasa kahit walang skill. Inamin ko sa docs imbes na itago.
3. **Description ang nagpapagana sa skill.** Pang-17 naging #1 dahil lang sa mas maayos na description.
4. **Mas simple, mas maganda.** Tinanggal ko ang index cache ng finder kasi 0.15 segundo lang naman ang full scan.
5. **User muna bago skill.** Hindi dapat labanan ng skill ang malinaw na utos ng user.
6. **Sariling sulat.** Ang mga ideya ay galing sa mga practice na umiikot sa community. Ang bawat file ay sinulat mula blangko sa Sauron template, sa sariling salita at istruktura.

---

## 6. Susunod

- [ ] I-commit at i-release (wala pang commit ngayon).
- [ ] I-verify ang session hook sa bagong session.
- [ ] Gumawa ng open-ended pressure scenarios.
- [ ] Ayusin ang lumang skill counts sa `README.md`, `CLAUDE.md`, at `AGENTS.md`.
- [ ] Hooks para sa ibang runtimes.

---

## 7. Mabilisang numero (pang-overlay sa video)

| Sukat                                             |          Halaga |
| :------------------------------------------------ | --------------: |
| Skills na na-index ng finder                      |             375 |
| Bagong tests                                      |              20 |
| Kabuuang tests                                    | 64 pass, 0 fail |
| Scan + rank time                                  |           76 ms |
| Finder report kumpara sa name + description total |           1.89% |
| Skills na may Prime rule at Bypass Excuses        |              14 |
| Languages sa design patterns table                |              10 |
| Research sources na na-verify                     |        16 sa 20 |
| Pressure runs                                     |              16 |
| Baseline agents na pumasa kahit walang skill      |        13 sa 14 |

---

## 8. Dagdag, October 6: `lean-code` skill

Pang-apat na bagong bagay. Kapares ito ng `caveman`: ang caveman ay nagtitipid sa **salita**, ang lean-code ay nagtitipid sa **code**.

**Problema:** Ang AI agent ay mahilig magsulat ng bagong code kahit mayroon na sa codebase, sa standard library, o sa naka-install na package. Mahilig din gumawa ng "configurable" na bagay para sa pangangailangang wala pa.

**Ginawa:** `skills/workflow/lean-code/`, command `/lean-code`

**Ang 7-rung reuse ladder.** Bago magsulat, aakyatin ng agent ito para sa **bawat requirement**, at hihinto sa unang "oo":

1. Kailangan ba talaga ngayon?
2. Nasa codebase na ba?
3. Nasa standard library?
4. Feature na ba ng platform o runtime?
5. Nasa naka-install na dependency?
6. Kaya ba ng isang expression?
7. Kung wala, pinakamaliit na implementation.

**Hindi ito tinitipid kahit kailan (Never Cut):** validation, security, data safety, error handling, accessibility, at tests.

**Apat na mode:**

| Mode | Gamit |
| :--- | :--- |
| build (default) | Ladder bago magsulat, tapos Lean Report |
| `review` | Hahanapin ang over-engineering sa diff. Walang binabago. |
| `audit <dir>` | Isang folder kada run, hanggang 15 candidates. Walang binubura. |
| `debt` | Listahan ng mga ipinagpaliban at sinadyang shortcut |

Intensity: `lite`, `full`, `ultra`, `off`.

### Pressure test: ito ang may totoong pagkakaiba

Hindi na multiple choice. Binigyan ko ang agent ng totoong coding task na may 5 requirements, sa Node.js 22 project na may `date-fns` at may existing na `uniqueBy` function.

| Requirement | Walang skill | May skill |
| :--- | :--- | :--- |
| Unique ID | Sariling gawa gamit `Date.now()` + `Math.random()` | `crypto.randomUUID()` |
| Deep copy | `JSON.parse(JSON.stringify())` | `structuredClone()` |
| Tanggalin ang duplicates | Bagong `Map` code, hindi ginamit ang existing `uniqueBy` | Ginamit ang `uniqueBy` |
| "3 days ago" | `date-fns` (tama) | `date-fns` |
| "Configurable in case later" | Gumawa ng setter, mutable global, at pangalawang generator na walang tumatawag | Hindi ginawa, nilista bilang deferred |
| **Nasa pinakamababang rung** | **1 sa 5** | **5 sa 5** |
| **Lines of code** | **32** (binilang ko) | **9** (bilang ng agent mismo) |

**Bonus na natuklasan:** ang baseline code ay hindi lang mas mahaba, may mali pa. Ang JSON deep copy ay ginagawang string ang mga `Date`. At ang dedupe code nito ay nagtatago ng **huling** duplicate, pero sinabi ng agent na **una** ang tinatago.

**Honest na limitasyon (basahin bago i-quote sa video):**

- Isang model (Claude Haiku 4.5), isang run kada kondisyon. Hindi ito benchmark.
- Halos magkapareho ang task sa baseline at sa rerun (orders vs invoices). Ang skill mismo ay naglalaman na ng mga sagot (`crypto.randomUUID`, `structuredClone`), kaya parang "itinuro ang exam". Kailangan ng ibang task sa ibang language para masabing gumagana sa pangkalahatan.
- Ang "9 lines" ay sariling bilang ng agent. Hindi ko nakita ang mismong code ng rerun.
- Gumawa pa rin ang rerun agent ng apat na wrapper function sa paligid ng tig-iisang tawag, kahit sinasabi ng skill na iwasan iyon. Kaya hindi pa perpekto.
- Hindi pa nasusubukan sa totoong coding session.
- Walang `gain` o metrics command. Walang panukat pa, kaya hindi ko nilagyan.

**Mga file:** `skills/workflow/lean-code/SKILL.md`, `skills/workflow/lean-code/references/reuse-ladder.md`, `.claude/commands/lean-code.md`

**Status pagkatapos idagdag:** `npm test` 64 pass, 0 fail. Sa `sauron find-skill`, #1 ang `lean-code` para sa "keep it simple do not over-engineer" at "review this diff for unnecessary code".

### Dagdag na lesson para sa video

7. **Open-ended na test ang nagpapakita ng totoo.** Sa 14 na multiple-choice scenarios, 13 ang pumasa kahit walang skill. Sa isang totoong coding task, 1 sa 5 lang. Parehong model.
8. **Mas kaunting code, mas kaunting bug.** Ang dalawang mali sa baseline ay nasa code na hindi na dapat isinulat.

### Updated na mabilisang numero

| Sukat | Halaga |
| :--- | ---: |
| Bagong skills ngayong update | 4 (`design-patterns`, `find-skill`, `skill-first-protocol` rewrite, `lean-code`) |
| Rungs sa reuse ladder | 7 |
| Baseline, nasa tamang rung | 1 sa 5 |
| May skill, nasa tamang rung | 5 sa 5 |
| Kabuuang subagent runs sa buong update | 19 |
