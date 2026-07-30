# MRongM Studio Manual Language Switching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible, persistent manual English / Simplified Chinese switch to the complete MRongM Studio homepage.

**Architecture:** Keep English as semantic HTML and the no-script fallback. Annotate translatable values with stable `data-i18n*` keys, then use one local ES module to apply a complete `zh-CN` dictionary, update the document language, and safely persist an explicit selection.

**Tech Stack:** HTML5, CSS3, browser ES modules, `localStorage`, Node.js built-in test runner, Python static HTTP server

## Global Constraints

- Support exactly `en` and `zh-CN`; default to `en` without consulting browser language.
- Keep canonical brand names, product names, versions, platform trademarks, and product codes unchanged.
- Translate visible prose, action text, document metadata, image alt text, and ARIA labels as one page-level state.
- Store only the explicit functional preference under `mrongm.studio.language`.
- Keep a complete English page when JavaScript or storage is unavailable; hide the inert selector until initialization.
- Add no framework, package, route, remote request, cookie, analytics event, or build step.
- Preserve all multi-product, local-resource, external-link, keyboard-focus, responsive, and reduced-motion contracts.
- Do not start automated Chrome; manual visual verification uses the existing local server.
- Do not commit or push until the user explicitly approves those operations.

## File Structure

| Path | Responsibility |
| --- | --- |
| `tests/site.test.mjs` | Static selector/translation coverage plus pure language and storage behavior |
| `scripts/i18n.mjs` | `zh-CN` dictionary, normalization, safe persistence, DOM binding, and control state |
| `index.html` | Canonical English fallback, translation hooks, and accessible language buttons |
| `styles.css` | Header tools layout, hidden-state guarantee, selector states, focus, and mobile wrapping |
| `README.md` | Bilingual behavior, runtime boundary, and verification instructions |

---

### Task 1: Lock the language contract with failing tests

**Files:**
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: existing homepage and product contracts.
- Produces: exact HTML hooks and module exports required by Tasks 2–4.

- [ ] **Step 1: Add the static manual-selector contract**

Add a test that reads `index.html` and requires:

```js
assert.match(html, /<script\s+type=["']module["']\s+src=["']scripts\/i18n\.mjs["']><\/script>/);
assert.match(html, /class=["']language-switcher["'][^>]*data-language-switcher[^>]*hidden/);
assert.match(html, /data-language=["']en["']/);
assert.match(html, /data-language=["']zh-CN["']/);
assert.match(html, /aria-pressed=["']true["']/);
```

Replace the obsolete “no script” assertion with the exact local-module assertion. Retain the ban on remote `src` and `srcset` values.

- [ ] **Step 2: Add translation coverage and storage behavior tests**

Use dynamic import so the first run fails because the module does not exist:

```js
const languageModulePath = '../scripts/i18n.mjs';

test('language module covers the page and fails safely', async () => {
  const html = await readFile('index.html', 'utf8');
  const {
    DEFAULT_LANGUAGE,
    STORAGE_KEY,
    SUPPORTED_LANGUAGES,
    readStoredLanguage,
    resolveLanguage,
    writeStoredLanguage,
    zhCN,
  } = await import(languageModulePath);

  const htmlKeys = [
    ...html.matchAll(/data-i18n(?:-(?:content|aria-label|alt))?=["']([^"']+)["']/g),
  ].map((match) => match[1]);

  assert.equal(DEFAULT_LANGUAGE, 'en');
  assert.equal(STORAGE_KEY, 'mrongm.studio.language');
  assert.deepEqual(SUPPORTED_LANGUAGES, ['en', 'zh-CN']);
  assert.deepEqual([...new Set(htmlKeys)].sort(), Object.keys(zhCN).sort());
  assert.equal(resolveLanguage('en'), 'en');
  assert.equal(resolveLanguage('zh-CN'), 'zh-CN');
  assert.equal(resolveLanguage('zh'), 'en');
  assert.equal(resolveLanguage(undefined), 'en');

  const memoryStorage = {
    value: null,
    getItem() { return this.value; },
    setItem(_key, value) { this.value = value; },
  };
  const throwingStorage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
  };

  assert.equal(readStoredLanguage(memoryStorage), 'en');
  memoryStorage.value = 'zh-CN';
  assert.equal(readStoredLanguage(memoryStorage), 'zh-CN');
  assert.equal(readStoredLanguage(throwingStorage), 'en');
  assert.equal(writeStoredLanguage(memoryStorage, 'en'), 'en');
  assert.equal(memoryStorage.value, 'en');
  assert.equal(writeStoredLanguage(throwingStorage, 'zh-CN'), 'zh-CN');
});
```

- [ ] **Step 3: Verify RED**

Run:

```bash
node --test --test-name-pattern="manual language|language module" "tests/site.test.mjs"
```

Expected: FAIL because the selector, translation hooks, and `scripts/i18n.mjs` are absent.

### Task 2: Implement the pure language and persistence boundary

**Files:**
- Create: `scripts/i18n.mjs`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Produces: `DEFAULT_LANGUAGE`, `SUPPORTED_LANGUAGES`, `STORAGE_KEY`, `zhCN`, `resolveLanguage`, `readStoredLanguage`, `writeStoredLanguage`, and `initLanguageSwitcher`.
- Consumes: the HTML data attributes added in Task 3.

- [ ] **Step 1: Define exact state and safe storage helpers**

```js
export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = Object.freeze(['en', 'zh-CN']);
export const STORAGE_KEY = 'mrongm.studio.language';

export const resolveLanguage = (value) => (
  SUPPORTED_LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE
);

export const readStoredLanguage = (storage) => {
  try {
    return resolveLanguage(storage?.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

export const writeStoredLanguage = (storage, value) => {
  const language = resolveLanguage(value);
  try {
    storage?.setItem(STORAGE_KEY, language);
  } catch {
    // The current session still switches when persistent storage is blocked.
  }
  return language;
};
```

- [ ] **Step 2: Add the complete `zh-CN` dictionary**

The dictionary must contain exactly the keys used by `index.html`. It covers metadata, skip/navigation labels, language-group label, hero and Signal Path verbs, Products and both cards, Principles, Studio, and footer. Canonical names and product codes do not receive translation keys.

- [ ] **Step 3: Add DOM binding and initialization**

Create bindings for text, `content`, `aria-label`, and `alt`; capture their English values once. Applying a language restores captured values for `en` or uses `zhCN[key]` for `zh-CN`, then updates `documentElement.lang` and every language button's `aria-pressed` value. Button clicks apply and persist the requested language. Reveal `[data-language-switcher]` only after listeners and initial state are ready.

The browser entry point must guard both DOM presence and storage access:

```js
if (typeof document !== 'undefined') {
  let storage = null;
  try {
    storage = window.localStorage;
  } catch {
    storage = null;
  }
  initLanguageSwitcher(document, storage);
}
```

### Task 3: Annotate the English document and add the control

**Files:**
- Modify: `index.html`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: all dictionary keys and `initLanguageSwitcher` selectors from Task 2.
- Produces: semantic English fallback values and exactly one binding for every `zhCN` key.

- [ ] **Step 1: Load the local module and annotate metadata**

Add `data-i18n-content` to description and Open Graph metadata, `data-i18n` to `<title>`, and load:

```html
<script type="module" src="scripts/i18n.mjs"></script>
```

- [ ] **Step 2: Add the hidden header selector**

Wrap navigation and the selector in `.site-header__tools`. Use:

```html
<div class="language-switcher" data-language-switcher role="group"
     aria-label="Language selection" data-i18n-aria-label="a11y.languageSelection" hidden>
  <button type="button" data-language="en" lang="en"
          aria-label="Switch to English" aria-pressed="true">EN</button>
  <button type="button" data-language="zh-CN" lang="zh-CN"
          aria-label="切换到简体中文" aria-pressed="false">中文</button>
</div>
```

- [ ] **Step 3: Annotate all page copy and accessible attributes**

Use `data-i18n` for visible prose; use the typed attribute hooks for metadata, navigation/product-list/platform labels, the AudioLoop screenshot alt text, and other accessible names. Split the Hero and Studio two-line headings into explicit lead/accent spans so applying `textContent` never removes their line break or styling.

- [ ] **Step 4: Run the manual-language tests**

Run the Task 1 command. Expected: the DOM contract and complete-key equality PASS.

### Task 4: Style the selector without weakening mobile layout

**Files:**
- Modify: `styles.css`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `.site-header__tools`, `.language-switcher`, `[data-language]`, and `aria-pressed`.
- Produces: visible desktop utility state and an intentional two-row mobile header.

- [ ] **Step 1: Extend the stylesheet contract before CSS**

Require `.site-header__tools`, `.language-switcher`, `.language-switcher[hidden]`, an `[aria-pressed="true"]` state, and the mobile header grid.

- [ ] **Step 2: Verify the stylesheet test fails for missing selectors**

Run:

```bash
node --test --test-name-pattern="stylesheet" "tests/site.test.mjs"
```

Expected: FAIL on `.language-switcher`.

- [ ] **Step 3: Add minimal shared styles**

Add `.site-header__tools` as a flex row. Render the selector as a compact pill using existing tokens, explicitly keep `[hidden]` at `display: none`, style the active state with `[aria-pressed="true"]`, and extend `:focus-visible` to buttons.

Below `48rem`, make `.site-header__inner` a two-column grid, use `.site-header__tools { display: contents; }`, place the language selector beside the brand, and move navigation to a full-width second row. Update anchored-section scroll margins to the resulting sticky-header height.

- [ ] **Step 4: Verify GREEN**

Run the complete test file. Expected: all portfolio and language contracts PASS.

### Task 5: Document and verify the finished static site

**Files:**
- Modify: `README.md`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: the final runtime and manual verification workflow.
- Produces: maintainer-facing documentation and fresh completion evidence.

- [ ] **Step 1: Update README**

Describe the website as English / Simplified Chinese, list `scripts/i18n.mjs`, state that only the language preference is stored, and retain the product-source and validation documentation.

- [ ] **Step 2: Run fresh automated checks**

```bash
node --test "tests/site.test.mjs"
git diff --check
```

Expected: zero failed tests and no whitespace errors.

- [ ] **Step 3: Verify static HTTP resources without a browser**

Against the local server, require HTTP 200 for `/`, `/styles.css`, `/scripts/i18n.mjs`, and all three product assets. Confirm the module uses a JavaScript-compatible content type.

- [ ] **Step 4: Sync the exact verified files to the real website repository**

Sync only `README.md`, `index.html`, `styles.css`, `tests/site.test.mjs`, `scripts/i18n.mjs`, and the two new language design/plan documents. Do not delete target files, commit, or push.

- [ ] **Step 5: Re-run checks in the real repository**

Repeat the complete tests, `git diff --check`, staging parity check, and HTTP checks. Leave the real-repository preview service running on `http://127.0.0.1:8765/` for manual validation.
