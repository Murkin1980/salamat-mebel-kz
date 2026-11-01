# CP-GEO-MEASURE-01 — Evidence: technical audit, measurement baseline, proposal

**Checkpoint:** CP-GEO-MEASURE-01 (spec draft: PR #3, branch `planning/geo-measurement-20261101`)
**MPE decision:** EXTEND_EXISTING
**Evidence date:** 2026-11-01 (UTC)
**Branch / commit audited:** `arena/eb109b17-salamat-mebel-kz` from `main` @ `6e7d2784babbb4948a46befa1121cf5030c81c91`
**Mode:** pass 1 read-only audit; **pass 2 (same day, owner follow-up) implemented P1 + P3 only**. No merge, no deployment, no DNS/Cloudflare/Ads/form change, no new service, no paid tool.
**Next re-measurement:** 2026-11-15 (T+14)

> **Pass 2 summary (owner follow-up, 2026-11-01).** P1 and P3 from §10 are implemented in this branch (see §15), covered by 28 dependency-free tests (§18). The Cloudflare/robots posture was re-examined read-only (§16) and it **changes the earlier recommendation in §10 P2**: search and citation crawlers are *not* blocked — only training crawlers are. What is really affected, and by which control, is separated in §17. Search Console and lead attribution remain **BLOCKED** (§8, §9).

---

## 1. RESULT

**PARTIAL**

| Part | Status | One-line reason |
|---|---|---|
| Read-only technical accessibility audit (repo + live site) | **PASS** | 5 public URLs verified reachable, canonical/sitemap/structured data checked, defects listed (§5–§6) |
| Reuse / no-duplication check (PR #2, main, open changes) | **PASS** | EXP-GEO-01 already merged; nothing re-implemented (§3) |
| Baseline of 20 search queries | **BLOCKED (prepared, not collected)** | Search engines and AI surfaces block this environment (captcha / consent wall / HTTP 500). Table and procedure ready in §7 — no invented rankings |
| Real Google Search Console metrics | **BLOCKED** | No property access, no credentials in repo, no OAuth in this environment (§8) |
| Lead / inquiry attribution | **BLOCKED (UNKNOWN)** | No analytics; intake payload carries no page/referrer; leads leave to an external API (§9) |
| ≤3 minimal improvement proposals | **PASS** | Three proposals, none implemented (§10) |
| 14-day re-measurement plan | **PASS** | Pre-registered procedure and decision rules (§11) |
| **Pass 2:** P1 + P3 implemented with tests | **PASS (branch only, not deployed)** | 3 commits, 28/28 tests, negative control verified (§15, §18) |
| **Pass 2:** Cloudflare / Bot Preference Sync read-only review | **PASS** | Settings not changed; per-bot matrix and indexing-vs-training split in §16–§17 |

**Next concrete action (single):** owner provides read-only Search Console access (or the CSV exports listed in §8.2) and answers the two owner decisions in §12. Everything else in this checkpoint is already done.

---

## 2. Stop / conflict statement

- No deep-change executed. One item in §10 (P2) touches **infrastructure posture (Cloudflare robots.txt / AI-crawler policy) and a legal-content decision** — it is **stopped for owner approval**, not executed.
- No credential was requested, stored, or used.
- No merge, no deploy, no publishing automation.

---

## 3. Existing work verified before editing (no duplication)

| Item | Evidence | Consequence for this checkpoint |
|---|---|---|
| PR #2 `EXP-GEO-01` — knowledge hub + 3 answer pages | `gh pr view 2`: **MERGED** 2026-09-03; files `knowledge/{index,geo.css,glubina-…,mdf-ili-ldsp-…,kak-podgotovitsya-…}`, `sitemap.xml`, `SIMPLICITY_REVIEW.md` | Content, metadata and structured data already exist → audit them, do not rebuild them |
| `main` state | `git log`: `6e7d278 governance: make scope control the mandatory first read` | Baseline branch is clean, no open local changes |
| Live deployment | `gh api …/pages`: `status=built`, `source=main:/`, `cname=salamat-mebel.kz`; last deployment `2026-09-22` at `6e7d2784…`, status `success` | The merged knowledge pages **are** publicly deployed; audit of the live site is valid |
| PR #3 (spec) | `gh pr diff 3`: adds only `docs/checkpoints/CP-GEO-MEASURE-01.md`, DRAFT, not on `main` | Spec is the authority for this task; this evidence file is separate and presupposes it |
| PR #1 `Add Cloudflare Workers configuration` | `gh pr view 1`: **OPEN**, `.gitignore` + `wrangler.jsonc` | Unrelated to measurement; **not touched** |

---

## 4. Environment limits of this audit (why some evidence is BLOCKED)

Probes executed on 2026-11-01 from the sandbox:

| Probe | Result | Interpretation |
|---|---|---|
| `curl -I https://salamat-mebel.kz/` | TLS `SSL_ERROR_SYSCALL` (egress not allowed) | HTTP status/redirect chains **cannot** be read from the shell; used the page-fetch tool instead |
| `fetch_page` on the 5 site URLs | 200 + full content | Site-level reachability **confirmed** (E1–E5) |
| `fetch_page` `google.com/search?q=site:…` | Cookie/consent interstitial, no SERP | Google SERP sampling **unavailable** |
| `fetch_page` `yandex.kz/search?text=site:…` | SmartCaptcha “Are you not a robot?” | Yandex SERP sampling **unavailable** |
| `fetch_page` `duckduckgo.com/html/?q=…` | HTTP 500 | unavailable |
| `fetch_page` `bing.com/search?q=…` (ru) | “Не удалось найти ни одного результата” for a normal query | Engine response degraded by the proxy → **not usable as evidence** |

Consequence: **no live ranking, citation or AI-surface observation is reported in this document.** Any ranking claim here would be fabricated.

---

## 5. Technical accessibility audit (read-only) — evidence table

Legend: ✅ pass · ⚠️ defect (fixable, low risk) · ❓ unknown / needs owner · ⛔ blocked outside repo.

| # | Check | Result | Evidence |
|---|---|---|---|
| T1 | Homepage reachable publicly | ✅ | E1 — `https://salamat-mebel.kz/` returns full page (title `Salamat Mebel - мебель на заказ в Алматы`) |
| T2 | Knowledge hub and 3 answer pages reachable | ✅ | E2–E5 — all four return 200 with expected `h1` |
| T3 | `robots.txt` reachable | ✅ | E6 |
| T4 | `sitemap.xml` reachable and well-formed, lists all 5 URLs | ✅ | E7; repo `sitemap.xml` (5 `<loc>`, `lastmod 2026-09-03`) |
| T5 | **Served `robots.txt` equals the repository `robots.txt`** | ⛔ **NO** | E6 vs `robots.txt:1-3`. The served file is **Cloudflare-managed content** (`# BEGIN Cloudflare Managed content`) that (a) contains **no `Sitemap:` directive**, (b) `Disallow: /` for 30+ agents including `GPTBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `GoogleOther`, `Amazonbot`, `meta-externalagent`, `KimiBot`. Repo declares `Allow: /` + `Sitemap:`. |
| T6 | AI crawler access consistent with the checkpoint goal | ⛔ **CONTRADICTED** | Same as T5. `Content-Signal: search=yes,ai-train=no,use=reference` — AI *answer* agents are blocked wholesale, not only training. Owner decision, see §10 P2 |
| T7 | Canonical URLs present and self-referencing | ✅ | `index.html:9`; `knowledge/*/index.html` head `link rel=canonical` |
| T8 | Canonical host equals the host actually served | ❓ | Canonicals are `https://salamat-mebel.kz/…` (apex). The fetch tool returned `https://www.salamat-mebel.kz/…` for the apex request and `https://salamat-mebel.kz/…` for a `www` request — the tool does not expose redirect chains, so **the apex/www redirect direction is unconfirmed**. Verify with `curl -sSI https://salamat-mebel.kz/ \| head -5` and `curl -sSI https://www.salamat-mebel.kz/ \| head -5` |
| T9 | HTTPS enforced at GitHub Pages | ❓ | `gh api …/pages` → `https_enforced: false`. TLS is terminated at Cloudflare, so this may be intentional; confirm the Cloudflare SSL mode before changing anything |
| T10 | `lang` attribute / no language mixing | ⚠️ partial | All pages `lang="ru"`; **no `hreflang`, no Kazakh version** → the 5 Kazakh queries in §7 have no answer page (structural gap, not a bug) |
| T11 | Single `h1` per page, semantic headings | ✅ | 1 `h1` on `index.html`; 1 `h1` per knowledge page |
| T12 | `img` alt coverage | ✅ | 18 images on homepage, 0 without `alt`; decorative hero uses `alt=""` |
| T13 | Mobile viewport / responsive CSS | ✅ | `meta viewport` on all pages; `@media(max-width:640px)` in `knowledge/geo.css` |
| T14 | Structured data — homepage | ⚠️ | Single `FurnitureStore` block (`index.html:24–42`): `address` = `addressLocality: Алматы` only — **no `streetAddress`, no `geo`, no `openingHours`, no `@id`**, `priceRange: "$$"`, `sameAs` = WhatsApp only. Cannot be improved without **owner-verified** postal address |
| T15 | Structured data — answer pages | ⚠️ | `Article` with `headline`, `description`, `author`, `datePublished`, `dateModified`, `mainEntityOfPage`, `publisher` — but **no `image`**, which Google lists among the properties it uses for article features (`grep -c '"image"'` = 0 in all three pages) |
| T16 | Social / AI preview metadata on answer pages | ⚠️ | `og:type/url/title/description` present, **`og:image` absent** (no image on those pages at all) |
| T17 | Homepage image URLs on canonical domain | ⚠️ | `index.html:14` `og:image` and `index.html:30` JSON-LD `image` point to `https://murkin1980.github.io/salamat-mebel-kz/assets/hero-upscaled.jpg`; that origin redirects to the custom domain (E8) → an extra hop and a second host in the crawl/preview path |
| T18 | Third-party critical assets | ❓ | 27 references to `static.tildacdn.pro` (logo, portfolio images, favicon) + Google Fonts + cdnjs; all reachable but any Tilda-side change silently breaks the new site |
| T19 | Internal links homepage → knowledge hub | ⛔ **MISSING** | `grep -c knowledge index.html` = **0**. The three answer pages are reachable only via `sitemap.xml` and the hub; the hub is linked only from its children |
| T20 | Internal links answer pages → hub/home/CTA | ✅ | Each page links `/`, `/knowledge/`, sibling answers, WhatsApp CTA |
| T21 | `robots` meta on indexable pages | ✅ | `index,follow` on knowledge pages; homepage relies on default + repository robots |
| T22 | Indexation state of the knowledge pages | ❓ **unknown** | Requires Search Console (“Pages” / URL Inspection); not in repo, not in this environment |
| T23 | Analytics / verification tags | ❓ | `grep` for `gtag`, `googletagmanager`, `mc.yandex`, `*-verification` over `index.html`, `script.js`, `knowledge/` → **0 hits**. GSC ownership may exist via DNS TXT (possible, unverifiable here) |
| T24 | Lead capture path | ⚠️ see §9 | `script.js:2` POSTs to `https://furniture-orders-mvp.pages.dev/api/orders`, payload `{name, phone, source:"salamat-mebel.kz", city, furnitureType, description}` — **no landing page, no referrer, no UTM** |
| T25 | FAQ content on homepage without `FAQPage` markup | ℹ️ | Deliberate/safe: Google restricts FAQ rich features; structure via headings is enough. Not proposed as a change |

---

## 6. Defect list (defects only, no fixes applied)

| ID | Defect | Severity (for the GEO goal) | Fixable in repo? |
|---|---|---|---|
| D1 | No internal link from the homepage to `/knowledge/`; hub is an orphan from the main crawl entry point | High — discoverability of the whole EXP-GEO-01 content set | Yes, `index.html` |
| D2 | Served `robots.txt` (Cloudflare-managed) blocks all major AI agents and drops `Sitemap:` | High — contradicts the stated purpose of the experiment; also removes the robots-level sitemap hint | **No** — Cloudflare dashboard + owner decision |
| D3 | `og:image` absent on the 4 knowledge pages | Medium — weaker previews/attribution where links are shared or cited | Yes |
| D4 | `Article.image` missing in all three answer pages | Medium — recommended property for article-type understanding | Yes |
| D5 | Homepage `og:image` + JSON-LD `image` on `murkin1980.github.io` | Low | Yes |
| D6 | `FurnitureStore` lacks `streetAddress`/`geo`/`openingHours`/`@id` | Medium for local-intent queries | Only after owner verification |
| D7 | No Kazakh-language content while 5 of the 20 baseline queries are Kazakh | Medium — those queries cannot be answered by this site | Out of scope (new pages) |
| D8 | Lead payload cannot be attributed to a page/channel | High for the “qualified lead” half of the checkpoint | Out of scope (product change), see §9 |

---

## 7. Baseline table — 20 fixed queries (prepared, **NOT COLLECTED**)

Why empty: engines/AI surfaces are blocked from this environment (§4). The table is the measurement instrument; filling it requires a human browser session (owner or an authorized operator) — not automation, not a new tool.

**Protocol (identical at T0 and T+14):**

1. Clean/incognito browser profile, no history, no personalization; language `ru-KZ` (or `kk-KZ` for rows 16–20), location signals from Kazakhstan.
2. Surfaces (mandatory): **S1** Google `google.kz` web results (top 10), **S2** Yandex `yandex.kz` (top 10), **S3** Google **AI Mode / AI Overview** answer, if shown.
   Optional: **S4** ChatGPT web-search, **S5** Perplexity.
3. For each row record: did `salamat-mebel.kz` (or `Salamat Mebel`) appear? position / cited-as-source? was a fact used correctly? was the brand named correctly? paste the URL of the result.
4. Store screenshot or SERP URL per row in the same folder structure if screenshots are used; **no numbers without a source link**.
5. Empty is a valid result: record `not found`. Do not estimate.

| # | Query (as typed) | Lang | Intent | Intended target URL | T0 2026-11-01 | T+14 2026-11-15 |
|---|---|---|---|---|---|---|
| 1 | кухня на заказ Алматы | ru | commercial | `/` | not collected | |
| 2 | кухни на заказ Алматы цена | ru | commercial + price | `/` | not collected | |
| 3 | заказать кухню по индивидуальным размерам Алматы | ru | commercial | `/` | not collected | |
| 4 | сколько стоит кухня 3 метра Алматы | ru | price question | `/` (no price facts on site → gap) | not collected | |
| 5 | кухня из ЛДСП или МДФ что лучше | ru | answer | `/knowledge/mdf-ili-ldsp-dlya-kuhni/` | not collected | |
| 6 | кухня Egger Алматы | ru | brand + local | **no page** (brand absent from site) | not collected | |
| 7 | фасады Egger для кухни Алматы | ru | brand + local | **no page** | not collected | |
| 8 | фурнитура Blum Алматы кухня | ru | brand + local | **no page** | not collected | |
| 9 | шкаф-купе на заказ Алматы | ru | commercial | `/` | not collected | |
| 10 | встроенный шкаф в нишу на заказ Алматы | ru | commercial | `/` | not collected | |
| 11 | какая глубина шкафа для одежды | ru | answer | `/knowledge/glubina-shkafa-dlya-odezhdy/` | not collected | |
| 12 | гардеробная на заказ Алматы | ru | commercial | `/` | not collected | |
| 13 | корпусная мебель на заказ Алматы | ru | commercial | `/` | not collected | |
| 14 | как подготовиться к замеру кухни | ru | answer | `/knowledge/kak-podgotovitsya-k-zameru-kuhni/` | not collected | |
| 15 | мебель на заказ Алматы | ru | commercial | `/` | not collected | |
| 16 | Алматыда ас үй жиһазын тапсырыспен жасау | kk | commercial | **no page** (`lang=ru` only) | not collected | |
| 17 | ас үй жиһазы бағасы Алматы | kk | price | **no page** | not collected | |
| 18 | киім шкафының тереңдігі қандай болуы керек | kk | answer | **no page** (RU answer exists) | not collected | |
| 19 | гардероб бөлмесін жасау Алматы | kk | commercial | **no page** | not collected | |
| 20 | Salamat Mebel Алматы | ru | brand | `/` | not collected | |

**Structural reading of the sample (not a result, a coverage fact):** 5 of 20 queries map to a dedicated answer page; 6 of 20 (Egger ×2, Blum ×1, Kazakh ×3 within 16–19 partially) have no matching content at all; 9 of 20 must be answered by the single homepage.

---

## 8. Google Search Console — **BLOCKED**

### 8.1 What was checked
- Repository: no verification tag, no analytics snippet, no service-account file, no token (T23). Nothing to authenticate with, and credentials must not be stored in the repository.
- No OAuth/browser session available here → the Search Console API cannot be called.

### 8.2 What is needed to unblock (owner action, one of)
1. Add the agent's e-mail as **Restricted** user on the `salamat-mebel.kz` property (or a domain property), **or**
2. Export and hand over these CSVs for **2026-09-03 → 2026-11-01**:
   - Performance → **Search results**, `Search type: Web`: Queries, Pages, Countries, Devices.
   - Performance → **Generative AI** (Search), Pages tab + Dates tab — impressions only.
   - **Indexing → Pages** (indexed / not indexed reasons) and **Sitemaps** status.
3. Confirm `Settings → Search generative AI` = **Include** (property-level only; default is Include; Exclude removes the site from AI Overviews/AI Mode/Discover generative features within 1–2 days and does **not** affect normal ranking). Source: Google's official help page for the report links directly to the control — <https://support.google.com/webmasters/answer/16984139> and <https://support.google.com/webmasters/answer/16908024>.

### 8.3 Documented limits of that data (verified against Google's own documentation, not blogs)
- The Generative AI performance report contains **impressions only**, for AI Overviews + AI Mode **combined**, by Pages / Countries / Dates / Devices. No queries, no clicks, no CTR, no position. <https://support.google.com/webmasters/answer/16984139>
- Same impressions are already inside the normal **Web** search-type Performance report (Google: “the generative AI performance report **includes data from the Web search type**”). So AI and classic cannot be cleanly separated by subtraction.
- Search Labs experiments are excluded; Discover has a separate report.
- Availability note on the official page: rolled out to all websites worldwide as of 2026-08-31; **a property without enough AI impressions may legitimately show nothing** — “report absent” must be recorded as *no data*, never as *zero visibility*.

**Therefore:** even with full access, the checkpoint can prove **exposure**, not **AI-driven clicks or leads**. Lead proof needs §9.

---

## 9. Lead / inquiry attribution — **BLOCKED (UNKNOWN)**

| Fact | Evidence |
|---|---|
| No web analytics on the site | T23 (0 hits for gtag / Metrika / verification tags) |
| Leads are posted to an external service | `script.js:2` `INTAKE_API_URL = "https://furniture-orders-mvp.pages.dev/api/orders"`; `script.js:118` |
| Payload has no page/referrer/UTM | `script.js:108-115`: `name, phone, source:"salamat-mebel.kz", city, furnitureType, description` |
| WhatsApp leads are invisible to any system | CTAs are plain `wa.me` links (`index.html`, knowledge pages) |

Consequences:
- `source` is a **site-wide constant** → even with access to that intake service, a lead **cannot** be attributed to the homepage vs. a knowledge page vs. brand search.
- Adding a page/referrer field would be a **product/contract change** (and the checkpoint forbids tracking-script additions in this phase) → **recorded, not done**.
- Consent-compatible attribution source: **none available today** → checkpoint status for leads: **UNKNOWN**. No lead numbers will be reported in this document or at T+14 unless the owner supplies channel data manually.

---

## 10. Minimal improvement proposals (max 3 — **none implemented in this checkpoint**)

Ranked by ratio of GEO effect to risk. All three stay inside EXP-GEO-01 (no new pages, no new service, no new dependency).

### P1 — Link the knowledge hub from the homepage (closes D1)
- **Change:** in `index.html`, add one internal block/link set: `→ /knowledge/` plus the three answer pages with descriptive anchors (e.g. in the FAQ or “Подход” section, or the footer).
- **Why:** the hub currently has **zero** inbound links from the site's main entry point (`grep -c knowledge index.html` = 0). Crawl path and user path are both missing; that is the cheapest real discoverability gain available.
- **Risk / effort:** very low / ~15 min, one file. **Rollback:** revert the block.
- **How it is verified:** hub present in the homepage DOM with descriptive anchors; no layout regression on mobile; then watch Search Console “Pages” for the knowledge URLs.

> **Pass-2 correction:** the recommendation below was written before the per-crawler analysis in §16. Search and citation crawlers turn out to be **allowed**; read §16 before acting on this item.

### P2 — Make the served robots/edge policy match the measurement goal (closes D2) — **OWNER DECISION, NOT EXECUTED**
- **Two separate decisions for the owner:**
 1. *Training vs retrieval:* keep `ai-train=no` if that is the intended legal stance, but decide explicitly whether **answer/retrieval agents** (`GPTBot`, `ClaudeBot`, `anthropic-ai`, `GoogleOther`, …) should stay `Disallow: /`. Blocking them removes the site from the sources those products can cite, which is exactly what this experiment measures.
 2. *Sitemap discovery:* the served file has no `Sitemap:` line; either restore it (Cloudflare managed-robots setting or a redirect/worker rule) **or** submit `https://salamat-mebel.kz/sitemap.xml` in Search Console and rely on that.
- **Why:** without this, a “no AI citations” result at T+14 cannot be interpreted — it may be produced by our own edge config.
- **Risk:** infrastructure + policy; **not reversible by code revert**; needs Cloudflare access. **Effort:** minutes in the dashboard, but it is a business/legal decision → stop here until the owner answers.
- Note: `Google-Extended` does **not** control AI Overviews/AI Mode; the Search-generative-AI setting in Search Console does. Two different levers — do not conflate them (source: <https://support.google.com/webmasters/answer/16984139>).

### P3 — Give the answer pages the same identity assets as the homepage (closes D3, D4, D5; D6 only after verification)
- **Change:** in the 3 answer pages, add `og:image` + `Article.image` reusing **already existing** assets (no new media); in `index.html:14` and `index.html:30`, replace the `murkin1980.github.io` URL with `https://salamat-mebel.kz/assets/hero-upscaled.jpg`. Optionally add a verified NAP block (brand + phone + city + postal address) to the answer pages **only after the owner confirms the address**.
- **Why:** image is a property Google names for article-type understanding; missing `og:image` weakens link previews and attribution when an assistant or a user shares the URL.
- **Risk / effort:** very low / ~20 min, 4 files, metadata only. **Rollback:** revert. **Do not invent** an address, hours, price range or rating.

**Explicitly not proposed now (recorded, postponed):** Kazakh version of the pages (D7 — new content, needs translation quality control); price facts on `/` (D8-adjacent — requires verified figures); analytics or CRM (governance §19/§21, and the checkpoint forbids tracking additions); `llms.txt` (still postponed by `SIMPLICITY_REVIEW.md`).

---

## 11. T+14 re-measurement plan (2026-11-15)

**Prerequisites (owner):** §8.2 access or exports; answer to §10 P2. If neither exists on 2026-11-15, the re-check repeats as **BLOCKED** and this checkpoint's business half is not closed.

| Step | Action | Output artifact |
|---|---|---|
| R1 | Re-run the §5 checks T1–T6, T19 against the live site (same URLs) | Updated table in this file |
| R2 | Export Search Console **Web** performance for `2026-10-18 → 2026-11-15`; compare with baseline window `2026-09-03 → 2026-11-01` | `gsc-web-*.csv` (owner-provided, not committed if it contains sensitive data) |
| R3 | Open Performance → **Generative AI** (Search); record Pages + Dates or “no data / report absent” | note in this file |
| R4 | Indexing → Pages + Sitemaps: state of the 5 URLs | note |
| R5 | Manual 20-query sample (§7 protocol), same profile/locale, both mandatory surfaces + AI answer if shown | filled `T+14` column |
| R6 | Lead count: only if an attributable source exists (§9). Otherwise write `UNKNOWN` | note |
| R7 | Apply the decision rules below and write the verdict | §12 update |

**Pre-registered decision rules** (absolute minimums and stop conditions, **not forecasts**; there is no baseline, so none of these is a prediction):

- **A. Technical gate (must hold):** 5/5 URLs return 200, canonical self-references, sitemap fetchable, Googlebot not blocked. *If A fails → fix A before reading any visibility number.*
- **B. Search exposure:** knowledge URLs receive **≥1** impression in GSC Web over T+14 → continue content work; **0 impressions** → do **not** add pages; work on discoverability (P1, submission, internal links) and re-check.
- **C. AI exposure:** a knowledge URL appears as a **cited source** in ≥1 sampled AI answer → record as **anecdotal**; ≥3 appearances across ≥2 different prompts → evidence of a repeatable pattern worth continuing.
- **D. Business result:** ≥1 inquiry attributable to a knowledge page → business proof. **No attributable source → `UNKNOWN`, no conclusion, no expansion.**
- **Stop rule:** if B = 0 and C = 0 and no owner decision on P2 exists, **stop page expansion** and escalate the robots/edge question as the primary suspect.

**Options compared (per spec CP-02):**

| Option | Verdict |
|---|---|
| Do nothing | Acceptable fallback, but leaves D1/D2 unmeasured and unowned |
| Manual spreadsheet + Google sheet filled by hand | **Chosen** for §7 and 20-query sampling — zero new tooling |
| Existing Search Console exports (CSV) | **Chosen** as the only first-party exposure data; no API/BigQuery path exists for the Generative AI report |
| New dashboard / monitoring service / agent | **Rejected** — no measurable need yet, adds cost and infrastructure (governance §19, `SIMPLICITY_REVIEW.md` evidence gate) |

---

## 12. Open questions for the owner (blocking, small)

1. **Search Console access** — Restricted user, or the CSVs in §8.2? (blocks §8, §11 R2–R4).
2. **robots/edge intent** — is blocking `GPTBot`/`ClaudeBot`/`GoogleOther` deliberate? Should answer/retrieval agents be allowed while training stays disallowed? (§10 P2 → deep-change gate).
3. **Verified NAP** — exact postal address, working hours, and whether the `$$` price range is still accurate (needed before D6/P3-optional).
4. **Approve / reject P1 and P3** as the implementation of this checkpoint's proposal step (code change happens only after approval, in a separate change).

---

## 13. Evidence index (reproducible)

| ID | Source | What it proves |
|---|---|---|
| E1 | `https://salamat-mebel.kz/` (fetched 2026-11-01) | homepage live; title/description/h1 as in repo; knowledge hub not linked |
| E2 | `https://salamat-mebel.kz/knowledge/` | hub live, 3 entries, visible author + “Проверено: 3 сентября 2026” |
| E3 | `https://salamat-mebel.kz/knowledge/glubina-shkafa-dlya-odezhdy/` | answer page live |
| E4 | `https://salamat-mebel.kz/knowledge/mdf-ili-ldsp-dlya-kuhni/` | answer page live |
| E5 | `https://salamat-mebel.kz/knowledge/kak-podgotovitsya-k-zameru-kuhni/` | answer page live |
| E6 | `https://salamat-mebel.kz/robots.txt` and `https://www.salamat-mebel.kz/robots.txt` | identical Cloudflare-managed content; no `Sitemap:`; 30+ AI agents disallowed |
| E7 | `https://salamat-mebel.kz/sitemap.xml` | 5 URLs, `lastmod 2026-09-03`, matches repo |
| E8 | `https://murkin1980.github.io/salamat-mebel-kz/` | redirects to the custom-domain site (so the `og:image` host works but via a second origin) |
| E9 | `gh api repos/Murkin1980/salamat-mebel-kz/pages` | `status=built`, `source=main:/`, `cname=salamat-mebel.kz`, `https_enforced=false` |
| E10 | `gh api …/deployments/6582311954/statuses` | last Pages deploy `2026-09-22`, state `success`, sha `6e7d2784…` |
| E11 | `gh pr view 2` / `gh pr diff 3` / `gh pr view 1` | merged EXP-GEO-01, spec-only PR #3, unrelated PR #1 |
| E12 | Repo greps: `grep -c knowledge index.html` → `0`; `grep -c '"image"' knowledge/*/index.html` → `0`; `grep -n murkin1980.github.io index.html` → `14,30`; `grep -r "gtag\|metrika\|verification"` → none | D1, D3, D4, D5, T23 |
| E13 | `script.js:2,108-115,118` | external intake API, payload without page/referrer |
| E14 | Google docs: <https://support.google.com/webmasters/answer/16984139>, <https://support.google.com/webmasters/answer/16908024>, <https://developers.google.com/search/docs/appearance/ai-features>, <https://support.google.com/webmasters/answer/16983858> | report scope (impressions only, AI Overviews + AI Mode combined, Web subset), Include/Exclude control is property-level and not a ranking signal, Discover report is separate |
| E15 | Engine probes (§4) | why §7 and §8 are not filled |

---

## 14. Definition-of-done check for this checkpoint

- [x] Governance read (AGENTS.md → SCOPE-CHANGE-CONTROL → simplicity-first) before work
- [x] Existing EXP-GEO-01 reused, nothing duplicated, no branch overwritten
- [x] Read-only audit with defects only (§5–§6)
- [x] 20-query baseline prepared; live collection honestly marked unavailable instead of invented
- [x] Search Console status explicitly **BLOCKED** with the exact unblocking steps
- [x] ≤3 proposals, none implemented, each with rollback
- [x] 14-day re-measurement plan with pre-registered rules
- [x] No merge, no deploy, no new service, no paid tool, no credential handling
- [ ] Owner answers §12 → next checkpoint evidence update (2026-11-15)

---

## 15. Pass 2 — implemented fixes (P1 + P3), branch only

Nothing is merged or deployed. All three commits live on the session branch; the owner can revert or cherry-pick them independently.

| Commit | Files | What it does | Closes |
|---|---|---|---|
| `9eb7e59` feat(geo): link the knowledge hub | `index.html`, `styles.css` | One `<section id="knowledge">` after FAQ with descriptive anchors to `/knowledge/` + the three answer pages; ~45 lines of CSS reusing existing tokens (`.section`, `.reveal`, `--ink`, `--muted`, `--bronze-light`) | **D1** |
| `6f2fb77` fix(geo): image metadata | `index.html`, 4 knowledge pages | `og:image`/JSON-LD `image` moved off `murkin1980.github.io`; `og:image:width/height` corrected to the measured asset size (**2943×1353**, was a wrong 1200×630); `og:image` + `og:image:alt` added to the hub and all three answer pages; `Article.image` added to the three `Article` blocks | **D3, D4, D5** |
| `docs` + `tests` | `tests/geo-static.test.mjs`, this file, `README.md` | Contract tests (§18) and evidence | — |

**Deliberately unchanged**

- `robots.txt` in the repository — the served file is Cloudflare-managed (§16); editing the repo copy would change nothing and would hide the conflict.
- DNS, Cloudflare settings, Google Ads, `script.js` / lead forms, `sitemap.xml`, canonical hosts, navigation, page content and copy.
- No new images: the existing self-hosted `assets/hero-upscaled.jpg` is reused. Limitation: one generic photo serves all four pages — a page-specific photo would be better but requires new media, which this checkpoint does not authorize.
- No address/hours/price/rating added: those still need owner verification (**D6**).

**Deviation from the original plan (honest):** the owner asked for a *separate* PR. This session is pinned to one branch and one open PR (#4), so a second PR cannot be opened from it. The fixes are therefore isolated into their own commits, in their own files, so they can be split into a separate PR or reverted independently without touching the evidence commit.

---

## 16. Cloudflare robots.txt / Bot Preference Sync — read-only review (no settings changed)

### 16.1 What the server actually returns (E6, re-checked 2026-11-01)

`https://salamat-mebel.kz/robots.txt` **and** `https://www.salamat-mebel.kz/robots.txt` return the same body, which consists **only** of Cloudflare's managed block:

- preamble "As a condition of accessing this website…" + the Content Signals definitions,
- `# BEGIN Cloudflare Managed content` … `# END Cloudflare Managed Content`,
- `User-agent: *` / `Content-Signal: search=yes,ai-train=no,use=reference` / `Allow: /`,
- 30+ bot-specific groups, every one `Disallow: /`.

The repository file (`robots.txt:1-3`: `User-agent: *`, `Allow: /`, `Sitemap: …`) **does not appear in the response at all** — in particular the `Sitemap:` directive is not served. Cloudflare's documentation describes the managed block as *prepended* to the origin file, so the absence of the origin content is itself a finding to verify in the dashboard (origin file reachability / zone-level robots handling). Note the served list is much longer than Cloudflare's documented default set (e.g. `Baiduspider`, `PetalBot`, `SemrushBot-SWA`, `WARDBot`, `KimiBot`, `CitibotSiteCrawler`, `Google-CloudVertexBot`, legacy `anthropic-ai` / `Claude-Web`), which points to a broader configured policy than the plain Training=Disallow preset.

### 16.2 How the mechanism works (Cloudflare docs)

- **Bot Preference Sync** (replacement for the older managed-robots.txt) writes your **Search / Agent / Training** policies into `robots.txt`. Cloudflare prepends the managed block only when at least one policy is Block / Block on pages with ads / (Training) Disallow — which is exactly the state observed here.
- With **Training = Disallow** and sync enabled, Cloudflare states it "adds managed directives **and enables edge blocking for AI training crawlers**. Mixed-use crawlers are excluded from this edge block."
- Under **RFC 9309 §2.2.1** a crawler obeys the group that names it and only falls back to `*` when no named group exists. Groups do not cascade — so a bot named in the managed block never reads the wildcard group underneath.
- robots.txt itself is **a preference, not enforcement**; enforcement is a separate product (AI Crawl Control / WAF). Cloudflare also warns that Search Console may report *"Syntax not understood"* for `Content-Signal` and newer directives, with no observed crawl impact.

Source: <https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/> (page updated 2026-10-22).

### 16.3 Per-crawler verdict for the four agents requested by the owner

| Agent | Named in served robots.txt? | Effective rule | Practical meaning |
|---|---|---|---|
| **Googlebot** | No | `Allow: /` via `User-agent: *` | **Allowed.** Google Search indexing unaffected. Also a mixed-use crawler, so Cloudflare excludes it from the training edge block. AI Overviews/AI Mode draw on this same index → eligibility unchanged by robots (the property-level Search-Console setting is the lever, §17) |
| **GPTBot** (OpenAI training) | Yes → `Disallow: /` | blocked | **Blocked by design.** Training opt-out. Has **no** effect on ChatGPT search answers — those use `OAI-SearchBot` |
| **OAI-SearchBot** (ChatGPT search) | No | `Allow: /` via `*` | **Allowed.** ChatGPT search may index and cite the site |
| **ClaudeBot** (Anthropic training) | Yes → `Disallow: /` | blocked | **Blocked by design.** Training opt-out. Citation in Claude is driven by `Claude-SearchBot` / `Claude-User`, which are **not** named here → allowed |
| (context) `Google-Extended` | Yes → `Disallow: /` | blocked | Gemini **training and grounding in Gemini Apps / Vertex** are declined. Google states it does **not** affect Search inclusion, ranking, AI Overviews or AI Mode |
| (context) `CCBot`, `GoogleOther`, `Bytespider`, `meta-externalagent`, `cohere-ai`, `MistralAI-Training`, `Diffbot`, `omgili`, `KimiBot` … | Yes → `Disallow: /` | blocked | Training / third-party corpora and other engines |
| (context) `PerplexityBot`, `Bingbot`, `Applebot` | No | allowed via `*` | Not blocked |

**Bottom line:** the current posture is "**citations yes, training no**", which is a defensible and *good* posture for this checkpoint. The two real defects for measurement are not "AI is blocked" but: (a) the served file has **no `Sitemap:` directive** and the repository file is not visible at all, and (b) **`Google-Extended` is blocked**, which costs Gemini-app grounding visibility while buying nothing for Search.

### 16.4 What cannot be verified from outside (and must not be guessed)

- Whether the **edge block** for training crawlers is actually active (that is a WAF decision, invisible to a normal fetch; Cloudflare's own docs say both "preference" and "edge blocking" for this preset).
- Whether `Search` / `Agent` policies are set to Block as well, whether **AI Crawl Control** adds per-crawler rules, and whether **Bot Fight Mode** or custom WAF rules interfere.
- Correct read-only verification by the owner (dashboard, no changes): **Security → Settings → filter "Bot traffic" → Configure AI bot policies** (read the three dropdowns) → **AI Crawl Control** crawler list → then re-read `/robots.txt` and compare it with the repository file.

---

## 17. What limits search indexing vs what limits AI training

| Control | Where it lives | Google/Bing indexing | AI Overviews / AI Mode | ChatGPT search citation | Claude citation | AI **training** |
|---|---|---|---|---|---|---|
| `robots.txt` `User-agent: *` / `Allow` | repo file | governs crawling (if served) | indirect (same index) | indirect (same index) | indirect | no |
| `Disallow` for a *specific* named crawler | served robots | only if Googlebot/Bingbot named | same | only if `OAI-SearchBot` / `ChatGPT-User` named | only if `Claude-SearchBot` / `Claude-User` named | yes for that operator's training bot |
| `Googlebot` blocked | robots | **removed from Search** | removed too (no index) | no | no | no |
| `Google-Extended` | robots | **no effect** | **no effect** | no | no | Gemini training + Gemini-app/Vertex grounding |
| Search Console → **Settings → Search generative AI** | GSC (property-wide, default *Include*) | no effect | **Include / Exclude** (1–2 days lag) | no | no | **no effect** (Google says use `Google-Extended` for training) |
| `nosnippet` / `max-snippet` / `data-nosnippet` | page meta/attr | costs the classic snippet | limits use as direct AI input | — | — | — |
| `noindex` | page meta | **removes the page from Search** | removed | — | — | no |
| `GPTBot` blocked | robots | no | no | **no** — different agent | no | OpenAI training |
| `OAI-SearchBot` blocked | robots | no | no | **removes the site from ChatGPT search answers** | no | no |
| `ClaudeBot` blocked | robots | no | no | no | **no** — different agent | Anthropic training |
| `Claude-SearchBot` blocked | robots | no | no | no | **reduces Claude search visibility** | no |
| `CCBot`, `GoogleOther`, `Bytespider`, `meta-externalagent`, `cohere-ai` … | robots | no | no | no | no | third-party training corpora / other engines |
| Cloudflare **edge block** (AI Crawl Control / WAF) | Cloudflare | only if misconfigured for mixed-use crawlers | same | if it blocks `OAI-SearchBot` | if it blocks `Claude-SearchBot` | yes for the blocked set |
| Legacy tokens `anthropic-ai`, `Claude-Web` | served robots | — | — | — | — | **nothing** — deprecated, no current crawler matches them |

**Reading for this site:** indexing is limited by nothing that we can see (Googlebot allowed, `index,follow`, canonical present, sitemap well-formed) — except that **the sitemap is not advertised in the served robots.txt** and the GSC state is unknown. AI *training* is limited by the Cloudflare policy, deliberately. AI *citations* are **not** limited by robots for ChatGPT/Claude/Perplexity, but **Gemini app grounding is declined** via `Google-Extended`.

Sources: Google — <https://support.google.com/webmasters/answer/16908024>, <https://support.google.com/webmasters/answer/16984139>, <https://developers.google.com/search/docs/appearance/ai-features>, Googlebot/Google-Extended documentation (as summarised in §E14); Cloudflare — §16.2; OpenAI crawler documentation (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User` at openai.com/gptbot · /searchbot · /chatgpt-user) and Anthropic crawler documentation (`ClaudeBot`, `Claude-SearchBot`, `Claude-User`). Operator pages could not be fetched directly from this sandbox (egress restricted to package registries), so their statements are taken from the widely repeated documentation summaries; treat the two operator rows as *documented behaviour*, not as independently re-verified text.

---

## 18. Tests (new, dependency-free)

**Command:** `node --test` (Node ≥ 18; no `package.json`, no dependency, no CI service added).

| Aspect | Detail |
|---|---|
| File | `tests/geo-static.test.mjs` — 28 assertions-tests over 5 pages |
| Covers | single `h1`, `lang`, viewport, title/description length, exact canonical per page, valid JSON-LD on every page, `og:image`/`og:image:alt` on the canonical domain, no `murkin1980.github.io` reference, `Article` properties (headline, author, dates, `image`, `mainEntityOfPage`), the referenced image file really exists, homepage descriptive anchors to `/knowledge/` + 3 answer pages, `alt` on every homepage image, sitemap↔file mapping + `lastmod` count, repository `robots.txt` intent |
| Result | **28/28 pass** (`# pass 28`, `# fail 0`) |
| Negative control | Reverting only two of the fixes (`og:image` host + one homepage anchor) produced exactly 3 failures — the suite fails on real regressions, it is not tautological |
| Not covered (deliberately) | Visual layout, live HTTP status, crawler behaviour, Cloudflare state, Search Console data — none of these are observable in a static test and pretending otherwise would be false evidence |

---

## 19. Updated next action

1. Owner review of PR #4 (evidence + two fix commits + tests); merge/deploy is the owner's call — **not performed here**.
2. **P2 restated after §16:** ask Cloudflare (read-only first) whether the zone is on Bot Preference Sync with Training = Disallow, and decide two things: (a) get the `Sitemap:` line served again (or submit the sitemap in GSC instead), (b) decide whether `Google-Extended` should stay blocked — it is the only lever here that costs Gemini-app visibility and nothing in Google Search.
3. Unchanged from §12: Search Console access (§8.2) remains the single biggest blocker; T+14 re-check on **2026-11-15** cannot produce exposure numbers without it.
