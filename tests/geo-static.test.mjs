// Static checks for the Salamat Mebel site (CP-GEO-MEASURE-01).
// Dependency-free: run with `node --test tests/` (Node 18+).
// They assert the public contract of the static pages, not implementation details.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const CANONICAL_ORIGIN = "https://salamat-mebel.kz";
const IMAGE = `${CANONICAL_ORIGIN}/assets/hero-upscaled.jpg`;

// page file -> canonical URL it must declare
const PAGES = {
  "index.html": `${CANONICAL_ORIGIN}/`,
  "knowledge/index.html": `${CANONICAL_ORIGIN}/knowledge/`,
  "knowledge/glubina-shkafa-dlya-odezhdy/index.html": `${CANONICAL_ORIGIN}/knowledge/glubina-shkafa-dlya-odezhdy/`,
  "knowledge/mdf-ili-ldsp-dlya-kuhni/index.html": `${CANONICAL_ORIGIN}/knowledge/mdf-ili-ldsp-dlya-kuhni/`,
  "knowledge/kak-podgotovitsya-k-zameru-kuhni/index.html": `${CANONICAL_ORIGIN}/knowledge/kak-podgotovitsya-k-zameru-kuhni/`,
};

const ANSWER_PAGES = [
  "knowledge/glubina-shkafa-dlya-odezhdy/index.html",
  "knowledge/mdf-ili-ldsp-dlya-kuhni/index.html",
  "knowledge/kak-podgotovitsya-k-zameru-kuhni/index.html",
];

const meta = (html, attr, name) => {
  const re = new RegExp(`<meta[^>]+${attr}="${name}"[^>]+content="([^"]*)"`, "i");
  const m = html.match(re);
  return m ? m[1] : null;
};

const jsonLd = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) =>
    JSON.parse(m[1])
  );

for (const [file, canonical] of Object.entries(PAGES)) {
  test(`${file}: basic indexable page contract`, () => {
    const html = read(file);
    assert.match(html, /<html[^>]+lang="ru"/);
    assert.ok(meta(html, "name", "viewport"), "viewport meta is missing");
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, "exactly one h1 expected");

    const title = html.match(/<title>([^<]+)<\/title>/);
    assert.ok(title && title[1].trim().length > 15, "title missing or too short");
    const description = meta(html, "name", "description");
    assert.ok(description && description.length > 60, "description missing or too short");

    const link = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
    assert.ok(link, "canonical link missing");
    assert.equal(link[1], canonical);
  });

  test(`${file}: every JSON-LD block parses`, () => {
    const blocks = jsonLd(read(file));
    assert.ok(blocks.length >= 1, "expected at least one JSON-LD block");
    for (const b of blocks) assert.equal(b["@context"], "https://schema.org");
  });

  test(`${file}: share/preview image points to the canonical domain`, () => {
    const html = read(file);
    assert.equal(meta(html, "property", "og:image"), IMAGE);
    assert.equal(meta(html, "property", "og:image:alt") !== null, true, "og:image:alt missing");
  });

  test(`${file}: no second-origin asset URLs`, () => {
    assert.equal(read(file).includes("murkin1980.github.io"), false);
  });
}

for (const file of ANSWER_PAGES) {
  test(`${file}: Article structured data carries the properties Google uses`, () => {
    const article = jsonLd(read(file)).find((b) => b["@type"] === "Article");
    assert.ok(article, "Article block missing");
    for (const key of ["headline", "author", "datePublished", "dateModified", "image"]) {
      assert.ok(article[key], `Article.${key} missing`);
    }
    assert.deepEqual(article.image, [IMAGE]);
    assert.equal(article.mainEntityOfPage, PAGES[file]);
  });
}

test("the referenced share image really exists in the repository", () => {
  assert.equal(existsSync(join(root, "assets/hero-upscaled.jpg")), true);
});

test("homepage links to the knowledge hub and to every answer page", () => {
  const html = read("index.html");
  assert.ok(html.includes('href="/knowledge/"'), "homepage does not link /knowledge/");
  for (const file of ANSWER_PAGES) {
    const url = PAGES[file].replace(CANONICAL_ORIGIN, "");
    const re = new RegExp(`<a[^>]+href="${url}"[^>]*>\\s*<strong>[^<]{10,}</strong>`, "i");
    assert.ok(re.test(html), `homepage has no descriptive anchor to ${url}`);
  }
});

test("homepage images all have alt attributes", () => {
  const html = read("index.html");
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  assert.ok(imgs.length > 0);
  for (const img of imgs) assert.match(img, /\balt="/, `img without alt: ${img}`);
});

test("sitemap.xml lists exactly the deployed pages, each mapped to a real file", () => {
  const xml = read("sitemap.xml");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(locs.length, Object.keys(PAGES).length);

  const expected = Object.values(PAGES);
  assert.deepEqual([...locs].sort(), [...expected].sort());

  for (const loc of locs) {
    assert.ok(loc.startsWith(`${CANONICAL_ORIGIN}/`), `non-canonical host in sitemap: ${loc}`);
    const rel = loc.slice(CANONICAL_ORIGIN.length + 1);
    const file = rel === "" ? "index.html" : join(rel, "index.html");
    assert.equal(existsSync(join(root, file)), true, `sitemap URL has no page: ${loc}`);
  }
  assert.equal((xml.match(/<lastmod>/g) || []).length, locs.length);
});

test("repository robots.txt states crawl permission and the sitemap location", () => {
  const robots = read("robots.txt");
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, new RegExp(`^Sitemap: ${CANONICAL_ORIGIN}/sitemap\\.xml$`, "m"));
  assert.doesNotMatch(robots, /^Disallow: \/$/m);
});
