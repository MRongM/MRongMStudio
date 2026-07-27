# MRongM Developer Website Design

## Goal

Create an English-first official website for MRongM, an independent software studio. The page must establish the studio identity, introduce AudioLoop honestly without fabricated screenshots or links, and explain the principles behind the work.

The page has one primary job: help a visitor understand what MRongM makes and why its products deserve attention.

## Scope

### Included

- Move the six existing Google Play brand files into `resource/`.
- Build a responsive, single-page static website.
- Reuse the approved Warm Clay brand identity and developer mark.
- Introduce AudioLoop as the current product.
- Show Google Play availability as “Coming to Google Play”; do not create a fake destination.
- Include concise studio principles and an independent-studio statement.
- Respect keyboard navigation, color contrast, and reduced-motion preferences.
- Provide metadata, favicon, and a social preview image from the existing assets.

### Excluded

- Contact forms, analytics, cookies, newsletter signup, or a CMS.
- Fabricated testimonials, product metrics, screenshots, release dates, or store URLs.
- A language switcher or a separate Chinese page.
- A JavaScript framework or build-time dependency.

## Information Architecture

The site is one semantic document with anchored navigation:

1. **Navigation** — MRongM mark and links to Work, Principles, and Studio.
2. **Hero** — “Useful software, tuned with care.” It states the studio promise before naming a product.
3. **Current work** — AudioLoop, described as a focused listening utility, with an honest pre-release status.
4. **Principles** — Lightweight, Clear, Respectful. These make “thoughtfully built” concrete.
5. **Studio** — A short explanation of independent ownership without turning the page into a résumé.
6. **Footer** — Copyright, positioning line, and a return-to-top affordance.

## Visual Direction

### Concept: Signal Path

The continuous path already present in the MRongM store header becomes the website’s visual spine. It represents a product moving through building, tuning, and completion. This is the page’s sole expressive device; decoration around it remains restrained.

### Color tokens

| Token | Value | Use |
| --- | --- | --- |
| Ember | `#2A1B17` | Main canvas |
| Kiln | `#3A2822` | Raised surfaces |
| Fired Clay | `#F59E66` | Action and active path |
| Porcelain | `#FFF3E8` | Primary contrast and light section |
| Signal Mint | `#5EEAD4` | Live/status points only |
| Clay Dust | `#E8D2C0` | Secondary text |

Mint always communicates state. It is not used as general decoration.

### Typography

- Display: `Helvetica Neue`, bold, tightly tracked. It matches the existing SVG artwork and gives headlines a precise software-studio tone.
- Body: `Avenir Next`, falling back to platform UI sans fonts, with open line height.
- Utility: platform monospace for status, metadata, and section labels.
- No remote font request is made; the site remains fast and privacy-respecting.

### Layout

- Maximum content width: 1280 px.
- Desktop uses a 12-column frame with asymmetric 6/6 and 5/7 compositions.
- Reading measures stay below roughly 62 characters.
- Mobile collapses to a single column; signal artwork becomes atmospheric and does not obscure copy.
- Section boundaries use space and low-contrast rules rather than repeated cards.

### Motion

The hero signal path draws once during initial load, followed by the hero copy. No parallax, looping ambient motion, cursor effects, or scattered scroll animations are included. Under `prefers-reduced-motion: reduce`, the final state is shown immediately.

## Components and Responsibilities

- **Site header** owns brand navigation and mobile wrapping behavior.
- **Hero** owns the studio promise, initial status, and signal artwork.
- **Product spotlight** owns AudioLoop’s description and pre-release state.
- **Principles list** owns the three studio commitments.
- **Studio statement** owns the independent-developer context.
- **Footer** owns legal text and the return-to-top link.

Each unit is a semantic section with local CSS classes and no shared runtime state.

## Technical Architecture

Use plain HTML and CSS:

- `index.html` contains semantic content, inline SVG artwork, metadata, and accessible labels.
- `styles.css` contains the token system, responsive layout, motion, focus states, and reduced-motion rules.
- Existing brand files live unchanged in `resource/`, except the moved resource README may be updated to reflect its new paths.
- A new root `README.md` documents local preview and project structure.

No JavaScript is required. Navigation uses native anchors, the year is written explicitly, and availability is text rather than a disabled interactive control.

## Interaction and Accessibility

- All navigation and calls to action are native links with visible focus states.
- “Coming to Google Play” is a non-interactive status label, not a misleading disabled button.
- The AudioLoop link scrolls to the product section.
- SVG artwork is decorative where adjacent copy carries the meaning; decorative SVGs are hidden from assistive technology.
- The main landmark has a stable `id`; a skip link is available before navigation.
- Contrast is checked for all text roles, and page zoom does not break the layout.

## Error and Empty-State Handling

This static site has no form, network API, or client-side data dependency. The two relevant degradation paths are:

- If CSS does not load, the semantic HTML remains readable and correctly ordered.
- If image assets fail, the textual MRongM brand remains visible; content does not depend on promotional images.

## Verification

- Confirm all former root material files exist in `resource/` and no stale root copies remain.
- Validate local links and referenced assets.
- Parse the HTML to catch malformed structure.
- Serve the site locally and verify an HTTP 200 response.
- Inspect desktop and mobile renders visually.
- Verify keyboard focus, skip link, anchor navigation, and reduced-motion behavior.
- Confirm no external network requests, fabricated links, or JavaScript dependencies were introduced.

## Engineering Principles

- **KISS:** a static page needs no application framework or runtime state.
- **YAGNI:** no CMS, contact form, analytics, language system, or release infrastructure is added.
- **DRY:** colors, spacing, type, and transitions are defined as shared CSS tokens.
- **SOLID:** semantic page sections have distinct responsibilities and communicate only through document anchors.
