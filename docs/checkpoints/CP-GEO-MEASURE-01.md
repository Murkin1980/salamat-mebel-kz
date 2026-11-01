# CP-GEO-MEASURE-01 — Salamat Mebel: AI/search visibility and lead evidence

**Date:** 2026-11-01
**MPE decision:** EXTEND_EXISTING
**Priority:** P1 business validation
**Status:** PLANNING ONLY
**Existing work:** EXP-GEO-01 (PR #2) and SIMPLICITY_REVIEW.md. Do not duplicate its content hub, static answer pages or SEO metadata.
**Deep-change:** NO within read-only/manual scope; stop for owner approval on new paid systems, credential access, automated publishing or architecture changes.

## Purpose
Find out whether existing expert furniture-answer pages reach prospective kitchen/wardrobe buyers in Almaty through ordinary search or AI-assisted answers, and whether those exposures generate qualified inquiries.

## CP-00 preflight
Read AGENTS.md, docs/governance/SCOPE-CHANGE-CONTROL.md, skills/simplicity-first/SKILL.md, SIMPLICITY_REVIEW.md; inspect PR #2 and main before proposing edits. Respect its merge/deploy state. Never overwrite an active branch.

## CP-01 read-only measurement baseline
- Validate existing pages: public reachability, canonical URLs, robots/sitemap, relevant local-business facts, factual pricing/date claims, mobile accessibility; list defects only.
- Obtain permissioned Search Console reports if available (page/query clicks, impressions, CTR, time window). Verify official documentation before asserting that AI Mode/AI Overviews offer separate reports.
- Define a fixed 20-query sample in Russian and Kazakh for kitchens, Egger, Blum, custom wardrobes and furniture in Almaty. Record platform, test date, locale, source links/mentions, and reproducible evidence. No invented rankings.
- Record inquiry counts from existing contact channels **only if an attributable, consent-compatible source exists**; otherwise report attribution UNKNOWN. No tracking-script additions in this phase.

## CP-02 minimal proposal, not automatic implementation
- Recommend up to three corrections to existing EXP-GEO-01 pages where verified facts are absent, stale or unclear; prefer edits to existing pages over new ones.
- Set a 14-day comparison and decision threshold based on observed search exposure and attributable leads; distinguish anecdotal AI citations from qualified leads.
- Compare doing nothing, manual evidence spreadsheet, and use of existing Search Console exports. Reject a new service/dashboard/agent without measurable need.
- Preserve factual local address, services and prices only after verification; no fabricated testimonials, guarantees, ratings or certifications.

## Arena delivery and acceptance
Arena can perform repository audit, evidence template, public-query sampling where permitted and draft a reviewable PR. Google Search Console authentication and business lead attribution may require owner access; clearly mark BLOCKED rather than invent results.
Output: source-linked baseline, sample of 20 queries or explicit blocker, <=3 low-risk edit proposals, 14-day recheck methodology, concise PASS/PARTIAL/BLOCKED evidence.
No merge, no deployment, no new service, no new paid tools, no credential storage in GitHub.
