# MRongM Studio Multi-Product v2.2.0 Implementation Plan

> **2026-07-30 amendment:** This completed portfolio plan is extended by `2026-07-30-manual-language-switching.md`. That plan supersedes the no-JavaScript constraint and no-script test with one local ES module; the portfolio content and product-link constraints below remain authoritative.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Turn the MRongM Studio homepage into a responsive portfolio for Hobgoblin v2.2.0 and the released AudioLoop Android app.

**Architecture:** Keep the existing dependency-free single-page HTML/CSS architecture. Add a semantic product grid with repeated article contracts, local product-owned assets, and exact outbound links; no runtime product registry or API is introduced.

**Tech Stack:** HTML5, CSS3, local SVG/PNG assets, Node.js built-in test runner, Python static HTTP server

## Global Constraints

- Keep the site English-first and preserve the Warm Clay brand tokens.
- Keep the page free of JavaScript, frameworks, packages, analytics, cookies, forms, remote fonts, and remote images.
- Present Hobgoblin v2.2.0 and AudioLoop as released products with verified public links only.
- Do not expose direct Hobgoblin binary links; route to the v2.2.0 release page.
- Do not show mutable AudioLoop price, rating, download count, or version.
- Keep keyboard navigation, visible focus, semantic heading order, and reduced-motion support.
- Keep GitHub Pages configured for main at repository root with the existing CNAME.
- Do not commit or push until the user explicitly approves those operations.

## File Structure

| Path | Responsibility |
| --- | --- |
| tests/site.test.mjs | Static content, link, asset, privacy, responsive, and accessibility contracts |
| index.html | Page metadata, navigation, hero, semantic product articles, principles, studio, and footer |
| styles.css | Existing brand tokens plus product-grid, product-card, product-visual, and responsive presentation |
| resource/products/hobgoblin/icon.svg | Official Hobgoblin icon copied from the v2.2.0 source tree |
| resource/products/audioloop/icon.png | Official AudioLoop Google Play icon copied from the v2.0.6 release package |
| resource/products/audioloop/projects.png | Real AudioLoop Projects screen copied from the v2.0.6 phone screenshots |
| README.md | Current product scope, asset provenance, preview, and validation commands |

---

### Task 1: Lock the multi-product contract and add verified local assets

**Files:**
- Modify: tests/site.test.mjs
- Create: resource/products/hobgoblin/icon.svg
- Create: resource/products/audioloop/icon.png
- Create: resource/products/audioloop/projects.png

**Interfaces:**
- Consumes: verified Hobgoblin v2.2.0 and AudioLoop v2.0.6 source assets.
- Produces: stable local resource paths and failing HTML/CSS contracts used by Tasks 2 and 3.

- [ ] **Step 1: Replace the single-product homepage contract with an exact portfolio contract**

Add these constants and tests to tests/site.test.mjs:

~~~js
const requiredProductResources = [
  'resource/products/hobgoblin/icon.svg',
  'resource/products/audioloop/icon.png',
  'resource/products/audioloop/projects.png',
];

const allowedExternalLinks = new Set([
  'https://github.com/MRongM/hobgoblin',
  'https://github.com/MRongM/hobgoblin/releases/tag/v2.2.0',
  'https://play.google.com/store/apps/details?id=com.mrongm.audioloop',
]);

test('verified product assets are stored locally', async () => {
  for (const resource of requiredProductResources) {
    assert.equal(await canAccess(resource), true, resource + ' is missing');
  }
});

test('homepage presents the released product portfolio', async () => {
  const html = await readFile('index.html', 'utf8');

  for (const id of ['main-content', 'products', 'principles', 'studio']) {
    assert.match(html, new RegExp('id=["\']' + id + '["\']'));
  }

  assert.match(html, /Hobgoblin/);
  assert.match(html, /v2\.2\.0/);
  assert.match(html, /AudioLoop/);
  assert.match(html, /Available on Google Play/i);
  assert.doesNotMatch(html, /Coming to Google Play/i);

  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((href) => /^https?:\/\//.test(href));

  assert.deepEqual(new Set(hrefs), allowedExternalLinks);
  assert.doesNotMatch(html, /(?:src|srcset)=["']https?:\/\//i);
  assert.doesNotMatch(html, /<script\b/i);
});
~~~

Retain the existing source-material and stylesheet tests. Remove the obsolete assertions that require Coming to Google Play or reject every external href.

- [ ] **Step 2: Run the new product contract and confirm the expected failure**

Run:

~~~bash
node --test --test-name-pattern="verified product assets|released product portfolio" "tests/site.test.mjs"
~~~

Expected: FAIL because the three product assets and new portfolio HTML do not exist.

- [ ] **Step 3: Copy the exact verified assets**

Copy:

~~~text
Hobgoblin v2.2.0:
  assets/hobgoblin-icon.svg
  -> resource/products/hobgoblin/icon.svg

AudioLoop v2.0.6:
  release/google-play/2.0.6/graphics/app-icon.png
  -> resource/products/audioloop/icon.png

  release/google-play/2.0.6/graphics/phone/01-projects.png
  -> resource/products/audioloop/projects.png
~~~

Do not resize, recompress, recolor, or strip metadata from these copies.

- [ ] **Step 4: Run the resource-only contract**

Run:

~~~bash
node --test --test-name-pattern="verified product assets" "tests/site.test.mjs"
~~~

Expected: PASS for the asset test.

### Task 2: Replace the single AudioLoop spotlight with semantic product articles

**Files:**
- Modify: index.html
- Test: tests/site.test.mjs

**Interfaces:**
- Consumes: the exact resource paths and external links fixed in Task 1.
- Produces: #products, .products-grid, .product-panel, .product-visual, and product action hooks consumed by Task 3.

- [ ] **Step 1: Update document metadata and navigation**

Use these public strings:

~~~html
<meta name="description" content="MRongM Studio builds focused independent software, including Hobgoblin and AudioLoop.">
<meta property="og:description" content="Independent apps and developer tools, thoughtfully built.">
<title>MRongM Studio — Independent apps and developer tools</title>
~~~

Change the primary navigation and hero action to:

~~~html
<a href="#products">Products</a>
<a href="#principles">Principles</a>
<a href="#studio">Studio</a>

<a class="button button--primary" href="#products">
  <span>Explore products</span>
  <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18">
    <path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>
  </svg>
</a>
~~~

- [ ] **Step 2: Replace the old product-section with the portfolio structure**

The Products section must follow this semantic outline:

~~~html
<section class="products-section" id="products" aria-labelledby="products-title">
  <div class="section-inner">
    <div class="products-heading">
      <div>
        <p class="eyebrow">Released products</p>
        <h2 id="products-title">Built for focused work.</h2>
      </div>
      <p>Two different tools, shaped by the same preference for clear workflows, local control, and software that stays out of the way.</p>
    </div>

    <div class="products-grid" aria-label="Released products"></div>
  </div>
</section>
~~~

Steps 3 and 4 append exactly two article elements to the empty products-grid. Each article contains one h3, one concise description, one ul.product-platforms, and one .product-actions container.

- [ ] **Step 3: Add exact Hobgoblin content and destinations**

Use:

~~~html
<p class="product-status"><span aria-hidden="true"></span>Latest release · v2.2.0</p>
<h3>Hobgoblin</h3>
<p class="product-tagline">AI workspaces that keep Git context intact.</p>
<p class="product-description">Keep projects, worktrees, branches, terminals, and AI CLI sessions together in one understandable workspace—from desktop and web to Android.</p>
<ul class="product-platforms" aria-label="Hobgoblin platforms">
  <li>macOS</li>
  <li>Windows</li>
  <li>Web</li>
  <li>Android</li>
</ul>
<div class="product-actions">
  <a class="product-link product-link--primary" href="https://github.com/MRongM/hobgoblin/releases/tag/v2.2.0">View v2.2.0 release</a>
  <a class="product-link" href="https://github.com/MRongM/hobgoblin">Source code</a>
</div>
~~~

Use resource/products/hobgoblin/icon.svg as a local decorative icon next to the name. Add a visual summary with four short labels: Android, Shared tmux, Telegram, and Workspaces. Do not make the summary look like a literal application screenshot.

- [ ] **Step 4: Add exact AudioLoop content and destination**

Use:

~~~html
<p class="product-status"><span aria-hidden="true"></span>Available on Google Play</p>
<h3>AudioLoop</h3>
<p class="product-tagline">Capture, convert, and keep audio organized.</p>
<p class="product-description">Record high-fidelity audio, organize projects, convert PCM and WAV files, export results, and play recordings in one focused Android workflow.</p>
<ul class="product-platforms" aria-label="AudioLoop platforms">
  <li>Android</li>
</ul>
<div class="product-actions">
  <a class="product-link product-link--primary" href="https://play.google.com/store/apps/details?id=com.mrongm.audioloop">Get it on Google Play</a>
</div>
~~~

Use resource/products/audioloop/icon.png as a decorative icon and resource/products/audioloop/projects.png with alt="AudioLoop Projects screen on Android".

- [ ] **Step 5: Run the portfolio contract**

Run:

~~~bash
node --test --test-name-pattern="released product portfolio" "tests/site.test.mjs"
~~~

Expected: PASS.

### Task 3: Implement the shared product visual system

**Files:**
- Modify: styles.css
- Test: tests/site.test.mjs

**Interfaces:**
- Consumes: the semantic hooks defined in Task 2.
- Produces: a balanced two-column desktop portfolio and one-column mobile flow without adding runtime behavior.

- [ ] **Step 1: Extend the stylesheet contract before changing CSS**

Add:

~~~js
for (const selector of [
  '.products-grid',
  '.product-panel',
  '.product-platforms',
  '.product-actions',
  '.product-visual',
]) {
  assert.match(css, new RegExp(selector.replace('.', '\\.')));
}

assert.match(css, /grid-template-columns:\s*repeat\(2,/);
assert.match(css, /\.products-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
~~~

- [ ] **Step 2: Run the stylesheet contract and confirm it fails**

Run:

~~~bash
node --test --test-name-pattern="stylesheet" "tests/site.test.mjs"
~~~

Expected: FAIL because the new product selectors are absent.

- [ ] **Step 3: Remove obsolete single-product rules and add the exact shared portfolio rules**

Delete rules used only by .product-section, .product-copy, .product-facts, .product-card, .app-symbol, .release-status, and .audio-mark.

Add:

~~~css
.products-section {
  scroll-margin-top: 4.75rem;
  border-bottom: 1px solid var(--color-rule);
  background: #30201b;
}

.products-section .section-inner {
  padding-block: var(--section-space);
}

.products-heading {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: end;
  gap: 2rem;
}

.products-heading > div {
  grid-column: 1 / span 7;
}

.products-heading > p {
  grid-column: 8 / -1;
  max-width: 31rem;
  color: var(--color-muted);
  font-size: 1.03rem;
  line-height: 1.75;
}

.products-heading h2 {
  max-width: 10ch;
  margin-top: 1.3rem;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: clamp(3.2rem, 6vw, 5.7rem);
  font-weight: 700;
  letter-spacing: -0.065em;
  line-height: 0.94;
}

.products-grid {
  margin-top: clamp(3rem, 7vw, 5.5rem);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.25rem, 3vw, 2rem);
}

.product-panel {
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #704a3b;
  border-radius: var(--radius-large);
  background: var(--color-kiln);
}

.product-panel__body {
  padding: clamp(1.5rem, 3.5vw, 2.5rem);
}

.product-identity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.product-icon {
  width: 4rem;
  height: 4rem;
  flex: 0 0 auto;
  border-radius: 1rem;
  object-fit: cover;
}

.product-code,
.product-status {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.product-code {
  color: #94766a;
}

.product-status {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 2rem;
  color: var(--color-clay);
}

.product-status span {
  width: 0.48rem;
  height: 0.48rem;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--color-mint);
  box-shadow: 0 0 0 0.28rem rgba(94, 234, 212, 0.08);
}

.product-panel h3 {
  margin-top: 0.9rem;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: clamp(2.7rem, 5vw, 4.4rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 0.92;
}

.product-tagline {
  max-width: 20ch;
  margin-top: 1rem;
  color: var(--color-dust);
  font-family: "Iowan Old Style", Baskerville, Georgia, serif;
  font-size: clamp(1.3rem, 2.4vw, 1.8rem);
  line-height: 1.3;
}

.product-description {
  max-width: 34rem;
  margin-top: 1.25rem;
  color: var(--color-muted);
  line-height: 1.7;
}

.product-platforms {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1.75rem 0 0;
  padding: 0;
  list-style: none;
}

.product-platforms li {
  padding: 0.42rem 0.72rem;
  border: 1px solid rgba(232, 210, 192, 0.18);
  border-radius: 999px;
  color: var(--color-dust);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.product-link {
  min-height: 2.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.72rem 1rem;
  border: 1px solid #704a3b;
  border-radius: 999px;
  color: var(--color-dust);
  font-size: 0.75rem;
  font-weight: 800;
  transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
}

.product-link--primary {
  border-color: var(--color-clay);
  background: var(--color-clay);
  color: var(--color-ember);
}

.product-visual {
  position: relative;
  min-height: 20rem;
  overflow: hidden;
  border-top: 1px solid #704a3b;
}
~~~

Under the existing hover-capable media query, use:

~~~css
.product-link:hover {
  transform: translateY(-0.12rem);
  border-color: var(--color-clay);
  color: var(--color-porcelain);
}

.product-link--primary:hover {
  background: var(--color-porcelain);
  color: var(--color-ember);
}
~~~

The existing global a:focus-visible rule supplies keyboard focus for both actions.

- [ ] **Step 4: Add product-specific visual accents without changing the studio palette**

- Hobgoblin: use a dark slate inset, blue-gray rules, and four concise release labels.
- AudioLoop: use the real portrait screenshot inside a warm red/amber inset with contain sizing and an icon badge.
- Keep product-specific colors inside .product-visual and icon treatments.
- Add explicit width and height to images and object-fit rules to avoid layout shift.

- [ ] **Step 5: Add responsive behavior**

At max-width 48rem:

~~~css
.products-grid {
  grid-template-columns: 1fr;
}
~~~

Also collapse .products-heading, keep links at least 44px tall, and set product visuals to a bounded mobile height. At max-width 22rem, stack product actions and allow full-width primary links.

- [ ] **Step 6: Run all automated tests**

Run:

~~~bash
node --test "tests/site.test.mjs"
~~~

Expected: all tests pass.

### Task 4: Document provenance and verify the static Pages build

**Files:**
- Modify: README.md
- Verify: CNAME, index.html, styles.css, resource/products/**

**Interfaces:**
- Consumes: the complete site from Tasks 1–3.
- Produces: reproducible validation instructions and evidence that the repository-root Pages deployment remains valid.

- [ ] **Step 1: Update README product and asset documentation**

Replace the obsolete AudioLoop pre-release note with:

~~~markdown
## Products

- Hobgoblin v2.2.0 — macOS, Windows, Web/server mode, and Android.
- AudioLoop — available on Google Play for Android.

## Product asset provenance

- resource/products/hobgoblin/icon.svg: Hobgoblin v2.2.0 assets/hobgoblin-icon.svg.
- resource/products/audioloop/icon.png: AudioLoop v2.0.6 Google Play app icon.
- resource/products/audioloop/projects.png: AudioLoop v2.0.6 verified phone screenshot.
~~~

Retain the existing preview and node --test commands.

- [ ] **Step 2: Run the complete automated suite**

Run:

~~~bash
node --test "tests/site.test.mjs"
~~~

Expected: all tests pass with zero failures.

- [ ] **Step 3: Validate the local static server**

Start a static server on an available loopback port and request:

~~~text
/
/styles.css
/resource/products/hobgoblin/icon.svg
/resource/products/audioloop/icon.png
/resource/products/audioloop/projects.png
~~~

Expected: HTTP 200 for every path, text/html for /, text/css for styles.css, and image media types for the product assets.

- [ ] **Step 4: Perform visual and interaction checks**

Inspect at approximately 1440×1000, 820×1180, and 390×844. Confirm:

- the hero remains dominant but no longer names one product in its action;
- both product cards have equal hierarchy;
- Hobgoblin release details and AudioLoop's real screenshot remain readable;
- mobile cards form one column with no horizontal overflow;
- all links are reachable by keyboard with visible focus;
- reduced-motion mode presents the final Signal Path state;
- images-disabled rendering still communicates both products.

- [ ] **Step 5: Confirm the deployment boundary**

Read-only checks must confirm:

~~~text
CNAME = mrongm.328064.xyz
GitHub Pages source = main /
HTTPS enforcement = enabled
~~~

Do not edit Pages settings, DNS, CNAME, or repository remotes.

- [ ] **Step 6: Prepare the final write-back and deployment confirmation**

Present:

- exact files to add or modify;
- automated and visual verification results;
- a diff summary;
- the requested confirmation block for writing the verified files back to the real repository;
- after write-back, a separate confirmation block for git commit and git push.

No commit or push occurs inside this plan without explicit approval.
