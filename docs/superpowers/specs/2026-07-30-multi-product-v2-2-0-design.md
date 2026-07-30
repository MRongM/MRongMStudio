# MRongM Studio Multi-Product Website Design

> **2026-07-30 amendment:** The later manual-language-switching design adds one local ES module for English / Simplified Chinese selection. Its language-specific runtime decisions supersede this document's no-script verification constraint; product facts and the static product-card architecture remain unchanged.

## Goal

Update the MRongM Studio website from a single-product preview into an English-first product portfolio that presents both released products accurately:

- Hobgoblin, with the v2.2.0 release as the newest studio update.
- AudioLoop, available on Google Play.

The page must preserve the existing Warm Clay identity, remain a dependency-free static site, and make a third product easy to add without redesigning the information architecture.

## Verified Product Facts

### Hobgoblin

- Latest release in scope: `v2.2.0`, published 2026-07-29.
- Product model: multi-project × multi-worktree/branch × multi-terminal workspace for AI CLI development.
- Supported surfaces: macOS, Windows, Web/server mode, and Android.
- v2.2.0 highlights: native Android client, shared tmux workflows, Telegram terminal notifications, and stronger multi-repository workspace and Git flows.
- Canonical links:
  - Release: `https://github.com/MRongM/hobgoblin/releases/tag/v2.2.0`
  - Source: `https://github.com/MRongM/hobgoblin`

### AudioLoop

- Publicly available on Google Play.
- Platform presented on this website: Android.
- Product purpose: record and organize audio, convert PCM/WAV formats, export files, and play recordings.
- Canonical link: `https://play.google.com/store/apps/details?id=com.mrongm.audioloop`
- The website does not display price, rating, download count, or a version number because those values can change independently of this static page.

## Scope

### Included

- Replace the AudioLoop-only product spotlight with a reusable two-product portfolio section.
- Present Hobgoblin first because v2.2.0 is the newest studio release, while giving both products equal card structure and visual weight.
- Replace the hero's AudioLoop-specific action with a product-level action.
- Add real outbound links for Hobgoblin and AudioLoop.
- Reuse official product artwork copied from the respective source repositories.
- Update metadata, documentation, and tests to describe a multi-product studio.
- Preserve responsive behavior, keyboard accessibility, reduced-motion support, and privacy-safe static hosting.

### Excluded

- A CMS, JavaScript product registry, framework, build system, analytics, cookies, or network-loaded fonts.
- Live GitHub or Google Play data fetching.
- Direct binary download buttons for unsigned Hobgoblin artifacts.
- App Store claims for AudioLoop.
- Product metrics, testimonials, prices, ratings, or fabricated availability details.
- A full redesign of the Principles, Studio, or footer sections.

## Information Architecture

The page remains one semantic document with anchored navigation:

1. **Navigation** — brand plus Products, Principles, and Studio anchors.
2. **Hero** — studio promise and a neutral `Explore products` action.
3. **Products** — a portfolio heading followed by two peer product cards.
4. **Principles** — the existing Lightweight, Clear, and Respectful commitments.
5. **Studio** — the existing independent-studio statement, adjusted for multiple products where needed.
6. **Footer** — studio identity, copyright, and return-to-top action.

## Product Card Contract

Every product card uses the same semantic structure so another product can be added by repeating one article:

1. Product icon and stable product code.
2. Availability/release label.
3. Product name and concise value proposition.
4. Short, factual description.
5. Platform chips.
6. Two or fewer primary destinations.
7. A product-specific visual panel using local assets.

### Hobgoblin card

- Status: `Latest release · v2.2.0`.
- Headline: `AI workspaces that keep Git context intact.`
- Summary: a workspace that keeps projects, worktrees, branches, terminals, and AI CLI sessions in one understandable Git context.
- Platforms: `macOS`, `Windows`, `Web`, `Android`.
- Links: `View v2.2.0 release`, `Source code`.
- Visual: official Hobgoblin icon plus an editorial terminal/worktree motif derived from the product's existing interface language. The card does not imply that a decorative composition is a literal screenshot.

### AudioLoop card

- Status: `Available on Google Play`.
- Headline: `Capture, convert, and keep audio organized.`
- Summary: a focused Android tool for recording, PCM/WAV conversion, project organization, export, and playback.
- Platform: `Android`.
- Link: `Get it on Google Play`.
- Visual: official app icon and one real product screenshot from the verified Google Play release assets.

## Visual Direction

The existing Warm Clay system remains the studio identity. The multi-product update changes composition, not brand:

- Product cards form a two-column editorial grid on wide screens and one column below 48rem.
- Both cards share spacing, border, typography, metadata, and action patterns.
- Hobgoblin uses a cool slate/blue inset surface sampled from its UI, while AudioLoop uses a warmer amber/red inset surface sampled from its release graphics. These accents stay inside product visuals; the surrounding site remains Warm Clay.
- Official app icons appear at a consistent size and are never recolored.
- Product visuals use an aspect ratio that avoids layout shift and degrades cleanly if an image fails.
- The existing Signal Path hero artwork remains the only animated illustration.
- No carousel, autoplay, hover-only content, or scroll-driven animation is added.

## Components and Responsibilities

- **Site header:** owns studio identity and anchor navigation.
- **Hero:** owns the studio promise and routes visitors to the portfolio.
- **Products heading:** establishes that the studio now has multiple released products.
- **Product grid:** owns layout only; it contains peer product articles.
- **Product article:** owns one product's facts, links, icon, platforms, and visual.
- **Principles, Studio, Footer:** retain their existing responsibilities.

The implementation stays in `index.html` and `styles.css`; these names describe semantic components rather than runtime modules.

## Asset Strategy

Create `resource/products/` with product-owned subdirectories:

- `resource/products/hobgoblin/icon.svg`
- `resource/products/audioloop/icon.png`
- `resource/products/audioloop/projects.png`

The Hobgoblin icon comes from the exact v2.2.0 source asset. AudioLoop assets come from the tagged v2.0.6 Google Play release package. Local copies make GitHub Pages deterministic and avoid third-party image requests. The website README records each source path and product version used for the copy.

## Technical Architecture and Data Flow

The site remains plain HTML and CSS with no runtime data flow:

1. GitHub Pages serves `index.html`, `styles.css`, and local files under `resource/`.
2. Native anchor links navigate within the page.
3. Native HTTPS links navigate to GitHub or Google Play.
4. Product facts are editorial content in semantic HTML; no API can fail or become rate-limited.

This is intentionally not abstracted into JavaScript data or templates. With two products, repeated semantic HTML is simpler, more accessible, and easier to audit.

## Link, Error, and Degradation Handling

- External destinations use HTTPS and descriptive link text.
- External links do not force a new browser tab, preserving user control.
- If a product image fails, the article still exposes the product name, description, platform, and destination links.
- Explicit image dimensions and CSS aspect ratios limit layout shift.
- If CSS fails, semantic source order remains Hero → Products → Principles → Studio.
- No direct unsigned-binary download link is exposed; Hobgoblin routes to the release page where warnings and assets are maintained together.

## Accessibility

- Keep the skip link and visible `:focus-visible` treatment.
- Product articles use headings in document order and real anchor elements for destinations.
- Product icons have empty alt text when the adjacent heading names the product.
- The real AudioLoop screenshot receives concise alt text describing the visible screen, not marketing copy.
- Platform chips are textual metadata, not controls.
- Accent colors must meet WCAG AA contrast for their text size.
- Reduced-motion behavior continues to show the hero's final state immediately.

## Verification

Automated contracts will verify:

- `Products`, `Hobgoblin`, `v2.2.0`, `AudioLoop`, and `Available on Google Play` are present.
- The stale `Coming to Google Play` copy is absent.
- Canonical GitHub and Google Play destinations are exact.
- Product assets exist under their canonical local paths.
- No script, analytics, remote image, or remote stylesheet is introduced.
- Existing brand tokens, focus styles, responsive rules, and reduced-motion contracts remain.

Manual verification will cover:

- HTTP 200 responses for the document, stylesheet, and every product asset.
- Desktop, compact, and mobile layout with no horizontal overflow.
- Keyboard navigation and visible focus on all links.
- Product visual balance and readable content with images disabled.
- GitHub Pages configuration remains `main` at repository root with the existing custom domain.

## Plan Grill Resolution

The implementation plan was challenged against the current site, the Hobgoblin v2.2.0 release, the AudioLoop Google Play listing, and the existing static-hosting constraints.

| Question | Resolution |
| --- | --- |
| Does “multiple products” require a runtime product model? | No. Two semantic articles are the simplest auditable representation; a third product can repeat the same contract. |
| What qualifies as a released product? | A product with a verified public destination. Hobgoblin has a public GitHub release and AudioLoop has a public Google Play listing. |
| Should both products show versions? | No. v2.2.0 is the requested Hobgoblin release story. AudioLoop omits its version because store rollout state changes separately. |
| Should Hobgoblin offer direct downloads? | No. Its artifacts are unsigned, so the maintained release page must keep downloads and warnings together. |
| Should product metrics or price be shown? | No. They are mutable, regional, and unnecessary to explain the products. |
| Should the existing AudioLoop-only card be generalized with JavaScript? | No. Repeated static HTML is clearer and avoids a runtime dependency. |
| How are products prioritized? | Hobgoblin appears first because v2.2.0 is the newest release; both articles keep the same structural and visual hierarchy. |
| How is asset provenance kept trustworthy? | Copy owned, versioned assets from the two source repositories and record their exact source paths in the website README. |
| Does Pages configuration need to change? | No. The current main-root source, custom domain, CNAME, and HTTPS configuration already support the update. |
| Is a new domain glossary or ADR justified? | No. The update introduces neither hard-to-reverse architecture nor ambiguous business terminology beyond the explicit product-card contract in this design. |

## Deployment

The repository uses legacy GitHub Pages publishing from `main` at `/`. After tests and visual checks pass, publishing requires a separately confirmed commit and push to `origin/main`. No Pages settings or DNS records need to change.

## Engineering Principles

- **KISS:** preserve the existing dependency-free one-page architecture.
- **YAGNI:** do not add a product data layer, CMS, live release API, or download service for two products.
- **DRY:** share one product-card visual contract and shared CSS tokens while keeping factual product copy local to each article.
- **SOLID:** page sections retain one responsibility, and each product article owns exactly one product's public presentation.
