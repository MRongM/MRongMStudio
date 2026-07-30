# MRongM Studio Manual Language Switching Design

## Goal

Add an explicit English / Simplified Chinese language control to the complete MRongM Studio homepage without changing its one-page GitHub Pages architecture or weakening its English no-script fallback.

## Decisions

- Supported language identifiers are exactly `en` and `zh-CN`.
- A fresh browser starts in English. The site does not infer a language from `navigator.language`.
- The visitor changes language through an `EN / 中文` segmented control in the sticky header.
- A successful choice is stored under `mrongm.studio.language` in `localStorage` and restored on later visits.
- Invalid stored values, unavailable storage, or script failure fall back to English.
- The current anchor, scroll position, and product links do not change when language changes.
- Brand names, product names, versions, platform trademarks, and product codes remain canonical.
- Visible prose, navigation, action labels, document title, description metadata, image alternative text, and ARIA labels change together.

## Considered Approaches

### 1. One semantic page plus a local language module — selected

English remains in the HTML as meaningful source content and no-script fallback. Elements receive stable `data-i18n*` keys. A small local ES module owns the Simplified Chinese dictionary, language normalization, persistence, DOM updates, and active-control state.

This keeps one set of product facts and one URL while allowing deterministic tests for translation coverage and storage fallbacks.

### 2. Separate root and `/zh/` pages — rejected

This is strongest for language-specific indexing without JavaScript, but it duplicates every product fact, accessibility label, and release update. The current two-product static site does not justify that maintenance cost.

### 3. CSS-only duplicated copy — rejected

This avoids JavaScript but duplicates the full document, cannot persist the visitor's choice cleanly, and creates a larger accessibility surface with hidden parallel content.

## Architecture

### HTML is the English fallback

`index.html` keeps complete English content. Translatable text or attributes receive one of these hooks:

- `data-i18n="key"` for text content.
- `data-i18n-content="key"` for metadata `content`.
- `data-i18n-aria-label="key"` for accessible labels.
- `data-i18n-alt="key"` for image alternative text.

The language control starts with `hidden`. The module attaches its listeners, applies a stored language if valid, and only then reveals the control. If JavaScript is unavailable, the visitor gets a complete English page rather than inert buttons.

### Language module owns runtime state

`scripts/i18n.mjs` has one responsibility: manage the active page language. It exports its constants and pure normalization/storage helpers so Node's built-in test runner can verify real behavior without a browser DOM.

At initialization it:

1. Captures the original English value for every annotated node or attribute.
2. Reads and normalizes the stored language, falling back to `en` on missing, invalid, or throwing storage.
3. Applies either the captured English values or the `zh-CN` dictionary values.
4. Updates `html[lang]`, each button's `aria-pressed` state, and the active visual class.
5. Handles later button clicks and safely persists the choice.

No network request, cookie, framework, package, analytics event, or URL rewrite is introduced.

## Header and Visual Behavior

The existing Warm Clay design remains unchanged except for a compact utility control:

- The brand stays at the left.
- Navigation and language control share a right-side `.site-header__tools` container.
- The control uses the existing clay, porcelain, mint, and rule tokens.
- The active language is expressed through both `aria-pressed="true"` and a filled visual state.
- Every button has a visible keyboard focus ring.
- At narrow widths the header wraps deliberately; product content never loses horizontal space to the utility control.
- The control adds no animation beyond existing short color transitions, so reduced-motion behavior remains valid.

## Translation Scope

Simplified Chinese covers:

- page title, description, and Open Graph title/description in the live DOM;
- skip link, brand label, primary navigation, and language-selector label;
- hero promise, action, studio status, and Signal Path verbs;
- Products heading, both product descriptions and actions, visual labels, platform-list labels, screenshot alt text, and caption;
- Principles, Studio, footer tagline, and return-to-top action.

Static Open Graph markup remains English on the initial HTTP response because social crawlers do not perform a manual in-page selection. After a visitor switches language, the live metadata follows the active language.

## Error and Degradation Handling

- Missing dictionary keys fail closed to the captured English value.
- A missing or invalid stored value resolves to `en`.
- `localStorage.getItem` and `setItem` are each guarded; privacy modes that throw do not break the page.
- If the module fails to load, semantic English content and all destinations remain available, and the hidden language control cannot mislead the visitor.
- If CSS fails, the native `hidden` state still prevents an inert language control from appearing before initialization.

## Accessibility

- The selector is a group of real `button` elements, not anchor links.
- Buttons use `lang="en"` and `lang="zh-CN"` for self-identifying labels.
- `aria-pressed` exposes the current choice without relying on color.
- The document's `lang` attribute changes with the copy so assistive technology uses the correct pronunciation rules.
- Translated ARIA labels and image alt text stay in the same language as visible content.
- Existing skip-link, heading order, focus styles, and reduced-motion contract remain intact.

## Verification

Automated tests verify:

- the module exists and is loaded locally with `type="module"`;
- the two language buttons and hidden no-script fallback are present;
- every HTML translation key exists in the `zh-CN` dictionary and the dictionary has no orphaned keys;
- only `en` and `zh-CN` normalize as supported values;
- storage read/write failures return the English-safe result without throwing;
- the old product, link, resource, responsive, and accessibility contracts remain green.

Manual verification covers switching in both directions, persistence after refresh, keyboard operation, compact header wrapping, and the English page with JavaScript disabled. No automated Chrome session is required; the existing local HTTP server is used for user verification.

## Grill Resolution

| Question | Resolution |
| --- | --- |
| Does “manual” allow browser-language detection? | No. Only a stored explicit choice can override the English default. |
| Is language a product-card property? | No. It is one page-level state applied atomically to all annotated content. |
| Should the selected language appear in the URL? | No. This release has one document and does not promise language-specific share URLs. |
| Is `localStorage` acceptable without a consent banner? | Yes. It stores one functional preference and is not used for tracking or analytics. |
| What happens when storage is blocked? | The page remains usable; English is applied and clicks still update the current session. |
| What happens when JavaScript is disabled? | The full English document remains visible and the inert selector stays hidden. |
| Should product names and versions be translated? | No. Canonical names, versions, product codes, and platform trademarks remain unchanged. |
| Does this require a glossary or ADR? | No. The two-value page state is explicit, reversible, and local to the website. |

## Engineering Principles

- **KISS:** one static document and one focused local module.
- **YAGNI:** no locale routing, browser detection, translation service, framework, or build pipeline.
- **DRY:** English has one canonical HTML source; only Simplified Chinese values live in the dictionary.
- **SOLID:** HTML owns semantic fallback content, CSS owns presentation, and the language module owns page-language state.
