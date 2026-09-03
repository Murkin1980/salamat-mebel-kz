# Simplicity Review — GEO MVP 01

## Decision
EXTEND_EXISTING

## Business result
Make Salamat Mebel pages easier for search engines and AI assistants to discover, read, attribute, and cite for concrete furniture questions in Almaty.

## Measurable proof
Track a fixed set of furniture questions weekly and record whether salamat-mebel.kz appears as a source, whether its facts are used correctly, whether Salamat Mebel is attributed correctly, and whether visits/leads appear.

## Non-goals
- No new repository.
- No CMS, database, worker, queue, vector store, or AI-search service.
- No automated article generation.
- No llms.txt in the first experiment.
- No redesign of the existing homepage.

## Approaches considered
1. Manual static pages in the existing repository — chosen for the first proof.
2. Add a lightweight static-site generator/content pipeline — postponed until content volume proves the need.
3. Add a CMS and automated GEO publishing pipeline — rejected for MVP because it adds infrastructure before evidence.

## Simplification passes
1. Limit the first batch to one knowledge hub and three focused answer pages.
2. Reuse the existing repository, domain, deployment, images, brand and contact channel.
3. Use plain static HTML and existing CSS; add only a small shared knowledge stylesheet.
4. Keep rollback trivial: remove the added pages and sitemap entries.

## Final workflow
Question → focused static answer → canonical/meta/JSON-LD → internal links → sitemap → deploy through existing site pipeline → weekly manual AI/search checks.

## Kept
- Static HTML.
- Existing domain and repository.
- Article structured data.
- Canonical URLs, title, description and Open Graph metadata.
- Visible checked/updated date.
- Internal links.
- sitemap.xml.

## Postponed
- llms.txt.
- Automated content generation.
- CMS/content API.
- Search index JSON.
- GEO monitoring automation.

## Risks
- AI assistants may not cite the site even when pages are technically correct.
- Furniture advice can become too generic; pages must stay concrete and useful.
- Claims about price or timing can become stale and should show a check/update date.

## Manual fallback
Continue publishing/editing static pages directly in the repository and checking AI/search visibility manually.

## Evidence required before adding complexity
At least one of: repeated AI citations, measurable organic traffic to answer pages, qualified leads attributed to these pages, or enough successful content volume that manual maintenance becomes the bottleneck.

## Score
Clear outcome 2/2; few services 2/2; few dependencies 2/2; one deployment 2/2; easy local start 2/2; rollback 2/2; manual fallback 2/2; no speculative scope 2/2; understandable by one developer 2/2; end-to-end testability 2/2. Total: 20/20.
