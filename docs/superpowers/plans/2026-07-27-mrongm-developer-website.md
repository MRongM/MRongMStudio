# MRongM Developer Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an English-first, responsive official website for MRongM and organize the existing Google Play brand materials under `resource/`.

**Architecture:** Use a single semantic HTML document and one CSS file, with inline decorative SVG for the Signal Path identity. The site has no framework, JavaScript, remote font, API, or runtime data dependency; native anchors provide all interaction.

**Tech Stack:** HTML5, CSS3, inline SVG, Node.js built-in test runner, Python static HTTP server

## Global Constraints

- Move all six existing material files from the repository root to `resource/`.
- Use English for navigation and page copy; preserve Chinese only inside the moved source material.
- Present AudioLoop as “Coming to Google Play”; do not invent a URL, screenshot, date, metric, or testimonial.
- Preserve the brand palette: `#2A1B17`, `#3A2822`, `#F59E66`, `#FFF3E8`, `#5EEAD4`, and `#E8D2C0`.
- Make the layout responsive, keyboard accessible, and compatible with `prefers-reduced-motion`.
- Do not add packages, a JavaScript framework, analytics, cookies, forms, or third-party network requests.
- Do not run `git commit`, create a branch, or push changes without explicit user authorization.

## File Structure

| Path | Responsibility |
| --- | --- |
| `index.html` | Semantic page content, metadata, navigation, and decorative Signal Path SVG |
| `styles.css` | Design tokens, typography, responsive layout, focus states, and motion |
| `tests/site.test.mjs` | Dependency-free structural, content, asset, and CSS contract tests |
| `README.md` | Website purpose, local preview, validation commands, and project map |
| `resource/README.md` | Existing Google Play material documentation after the move |
| `resource/*.{png,svg,txt}` | Existing brand and promotional source material |

---

### Task 1: Define the site contract and organize resources

**Files:**
- Create: `tests/site.test.mjs`
- Create: `resource/`
- Move: `README.md` to `resource/README.md`
- Move: `mrongm-developer-icon.png` to `resource/mrongm-developer-icon.png`
- Move: `mrongm-developer-icon.svg` to `resource/mrongm-developer-icon.svg`
- Move: `mrongm-header.png` to `resource/mrongm-header.png`
- Move: `mrongm-header.svg` to `resource/mrongm-header.svg`
- Move: `promotional-text-zh-CN.txt` to `resource/promotional-text-zh-CN.txt`
- Create: `README.md`

**Interfaces:**
- Consumes: the six untracked source material files currently at repository root.
- Produces: stable `resource/` asset paths used by HTML metadata and automated tests.

- [ ] **Step 1: Write the failing site contract**

Create `tests/site.test.mjs` using only Node built-ins:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';

const requiredResources = [
  'README.md',
  'mrongm-developer-icon.png',
  'mrongm-developer-icon.svg',
  'mrongm-header.png',
  'mrongm-header.svg',
  'promotional-text-zh-CN.txt',
];

const canAccess = async (path) => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

test('all source materials live under resource', async () => {
  for (const file of requiredResources) {
    assert.equal(await canAccess(`resource/${file}`), true, `${file} is missing from resource/`);
    if (file !== 'README.md') {
      assert.equal(await canAccess(file), false, `${file} must not remain at repository root`);
    }
  }
});

test('homepage has the required semantic sections and honest product state', async () => {
  const html = await readFile('index.html', 'utf8');
  for (const id of ['main-content', 'work', 'principles', 'studio']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /AudioLoop/);
  assert.match(html, /Coming to Google Play/i);
  assert.match(html, /class="skip-link"/);
  assert.doesNotMatch(html, /<script\b/i);
  assert.doesNotMatch(html, /(?:src|href)=["']https?:\/\//i);
});

test('stylesheet preserves brand tokens and accessibility contracts', async () => {
  const css = await readFile('styles.css', 'utf8');
  for (const color of ['#2a1b17', '#3a2822', '#f59e66', '#fff3e8', '#5eead4', '#e8d2c0']) {
    assert.match(css.toLowerCase(), new RegExp(color));
  }
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\s*\(max-width:/);
});
```

- [ ] **Step 2: Run the test to verify the initial contract fails**

Run: `node --test "tests/site.test.mjs"`

Expected: FAIL because `resource/`, `index.html`, and `styles.css` do not exist.

- [ ] **Step 3: Move the source materials without changing binary contents**

Create `resource/`, then move the six exact paths listed above. Do not re-encode either PNG or alter either SVG.

- [ ] **Step 4: Create the root project README**

Document these commands exactly:

```bash
python3 -m http.server 8000
node --test "tests/site.test.mjs"
```

Explain that `resource/` contains the original Google Play materials and that the website itself is dependency-free.

- [ ] **Step 5: Run the resource contract**

Run: `node --test --test-name-pattern="source materials" "tests/site.test.mjs"`

Expected: 1 test passes; the HTML and CSS tests are skipped by the name pattern.

### Task 2: Build the semantic homepage

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `resource/mrongm-developer-icon.svg`, `resource/mrongm-developer-icon.png`, and `resource/mrongm-header.png`.
- Produces: anchors `#main-content`, `#work`, `#principles`, and `#studio`, plus CSS hooks consumed by `styles.css`.

- [ ] **Step 1: Run the homepage contract to confirm it fails**

Run: `node --test --test-name-pattern="homepage" "tests/site.test.mjs"`

Expected: FAIL with `ENOENT: no such file or directory, open 'index.html'`.

- [ ] **Step 2: Create the document metadata and semantic landmarks**

Use the following document skeleton and preserve these exact public strings:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#2A1B17">
  <meta name="description" content="MRongM builds lightweight, clear, and respectful independent apps.">
  <meta property="og:title" content="MRongM — Independent software studio">
  <meta property="og:description" content="Useful software, tuned with care.">
  <meta property="og:image" content="resource/mrongm-header.png">
  <link rel="icon" href="resource/mrongm-developer-icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
  <title>MRongM — Independent software studio</title>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header"></header>
  <main id="main-content">
    <section class="hero" aria-labelledby="hero-title"></section>
    <section class="product-section" id="work" aria-labelledby="work-title"></section>
    <section class="principles-section" id="principles" aria-labelledby="principles-title"></section>
    <section class="studio-section" id="studio" aria-labelledby="studio-title"></section>
  </main>
  <footer class="site-footer"></footer>
</body>
</html>
```

- [ ] **Step 3: Add complete navigation and copy**

Add native anchors for Work, Principles, Studio, and Back to top. Use:

- Hero headline: “Useful software, tuned with care.”
- Hero body: “MRongM builds focused apps that stay lightweight, feel clear, and respect the people using them.”
- Hero action: “Explore AudioLoop”.
- Product headline: “Keep the part worth hearing.”
- Product status: “Coming to Google Play”.
- Principles: “Lightweight — Small by choice.”, “Clear — Obvious in use.”, and “Respectful — Your attention is yours.”
- Studio headline: “Independent on purpose.”

Mark decorative SVG with `aria-hidden="true"` and `focusable="false"`. Render the MRongM name as text next to the icon so the brand remains readable if the asset fails.

- [ ] **Step 4: Run the homepage contract**

Run: `node --test --test-name-pattern="homepage" "tests/site.test.mjs"`

Expected: PASS.

### Task 3: Implement the Signal Path visual system and verify the finished site

**Files:**
- Create: `styles.css`
- Modify: `README.md`

**Interfaces:**
- Consumes: the class hooks and SVG path classes defined in `index.html`.
- Produces: the complete responsive and accessible presentation with no runtime API.

- [ ] **Step 1: Run the stylesheet contract to confirm it fails**

Run: `node --test --test-name-pattern="stylesheet" "tests/site.test.mjs"`

Expected: FAIL with `ENOENT: no such file or directory, open 'styles.css'`.

- [ ] **Step 2: Define the shared tokens and base behavior**

Start `styles.css` with these exact tokens:

```css
:root {
  --color-ember: #2a1b17;
  --color-kiln: #3a2822;
  --color-clay: #f59e66;
  --color-porcelain: #fff3e8;
  --color-mint: #5eead4;
  --color-dust: #e8d2c0;
  --color-muted: #b89f92;
  --content-width: 80rem;
  --gutter: clamp(1.25rem, 4vw, 4rem);
  --section-space: clamp(5rem, 10vw, 9rem);
  --radius-large: 2rem;
  --transition-fast: 180ms ease;
}
```

Apply `box-sizing: border-box`, smooth native anchor scrolling, a dark body canvas, privacy-safe system font stacks, selection colors, and a visible skip-link/focus treatment.

- [ ] **Step 3: Implement the responsive section layouts**

Create the 12-column desktop frame, 6/6 hero, 5/7 product composition, three-column principles list, two-column studio statement, and mobile collapse at `max-width: 48rem`. Keep body copy below 62 characters per line and ensure navigation wraps without a JavaScript menu.

- [ ] **Step 4: Implement the single orchestrated motion sequence**

Use `stroke-dasharray` and `stroke-dashoffset` on the active signal path, plus one short hero-copy reveal. Add:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .signal-path--active { stroke-dashoffset: 0; }
}
```

- [ ] **Step 5: Run all automated contracts**

Run: `node --test "tests/site.test.mjs"`

Expected: 3 tests pass, 0 fail.

- [ ] **Step 6: Verify the static server response**

Run the local server from the repository root:

```bash
python3 -m http.server 8000
```

Request `/` and confirm HTTP 200, `text/html`, and no 404 for `styles.css`, the icon, or the social preview image.

- [ ] **Step 7: Complete visual and interaction review**

Inspect at a desktop viewport around 1440 × 1000 and a mobile viewport around 390 × 844. Confirm:

- the hero headline remains the dominant element;
- Signal Path does not obscure copy;
- AudioLoop status is visibly non-interactive;
- keyboard focus is visible on every link;
- skip navigation reveals on focus;
- no horizontal overflow occurs;
- reduced-motion mode presents final content immediately.

- [ ] **Step 8: Update validation notes**

Record the automated test command and static preview command in `README.md`. Do not add deployment claims or a production URL.
