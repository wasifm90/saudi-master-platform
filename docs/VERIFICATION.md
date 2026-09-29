# Production verification — 29 September 2026

## Brighter shared-card update

- The home catalogue, `/products`, geometry feature, and related systems use one product-card component. Product detail pages use the same rounded, pale-gradient visual language.
- Ten tests across two files passed. The production build prerendered all **37 routes** without warnings; the initial bundle is **356.62 kB raw / 99.09 kB estimated transfer**. Production output verification passed for routes, metadata, 153 assets, and deployment rules. The local HTTP check passed for all 37 pages, expected 404s, video byte ranges, and gzip HTML.
- In the local production browser preview, the catalogue, geometry feature, and product detail page rendered with the brighter palette at a 628px viewport. The geometry category control selected Wall & Shear and updated the product card. The detail page rendered its related card with a valid route, no broken card images, and no horizontal overflow at that width.
- Product card hover and focus motion, image zoom, sheen, arrow movement, and progressive scroll entrance are disabled by reduced-motion preferences. Lighthouse was not rerun for this styling update.

The original migration baseline was verified at **http://localhost:4305**, Angular **22.2.0** (`sm-root[ng-version]` inspected in the browser). The product catalogue was redesigned into tiles later on 29 September; the Lighthouse reports and screenshots below belong to the earlier baseline and are retained for reference.

## Product tile update

- Production build passed with **37 prerendered routes** and 355.72 kB initial raw bundle (98.89 kB estimated transfer).
- **10 tests across 2 files passed**, including the updated rendered card/filter/link test.
- Production output check passed for all routes, canonical metadata, 153 asset references, and deployment rules.
- In the production preview at port 4306, the responsive tile grid rendered 12 products with no broken loaded card images or horizontal overflow at a 615px viewport. Keyboard activation of European systems updated the visible count and cards to 6, starting with ULMA ORMA. Product detail and enquiry links remained correct in the rendered page.
- The first sandboxed build aborted without diagnostics; the same build passed outside the sandbox. Lighthouse was not rerun after this visual update.

## Original migration baseline

## Build and automated checks

| Check | Result |
| --- | --- |
| Dependency install under compatible Node 22.23.3 | Pass; 0 npm audit vulnerabilities |
| `npm test` | **10 tests, 2 files, all passing** |
| `npm run build` | Pass; **37 prerendered routes**, no build warnings |
| Initial bundle | **358.47 kB raw; 99.63 kB estimated transfer** |
| `npm run verify:production` | Pass; 37 static pages, metadata/canonicals, 153 referenced assets, robots, sitemap, Apache rules |
| `npm run verify:http` against port 4305 | Pass; 37 HTTP 200 routes, real missing-asset/unknown-route 404s, video 206 byte-range responses, gzip HTML |
| `git diff --check` | Pass |
| Production source scan | No `any`, inline `onclick`, `DB_SNAPSHOT`, or `document.querySelector` application logic |

At the baseline, tests covered repeated ALL/LOCAL/EUROPEAN filtering and inactive records, empty results, all geometry categories, multiple product assignments, assembly bounds/sequencing, accordion state, slug resolution, rendered Angular product/CTA consistency, geometry data replacement, observer cleanup, and reduced-motion/muted-video initialization. The current suite replaces the chapter/observer assertion with card/filter/link coverage.

## Chrome Lighthouse — final production build

Lighthouse 13.5.0, Chrome for Testing 154.0.8037.57, localhost production preview. Mobile uses Lighthouse's default simulated mobile throttling; desktop uses its desktop preset. These are lab measurements, not field/Core Web Vitals guarantees on a hosting provider.

| Metric | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | **94** | **100** |
| Accessibility | **100** | **100** |
| Best practices | **100** | **100** |
| SEO | **100** | **100** |
| First contentful paint | 1.8 s | 0.5 s |
| Largest contentful paint | 2.9 s | 0.7 s |
| Total blocking time | 40 ms | 0 ms |
| Cumulative layout shift | **0** | **0** |

Saved complete reports: [mobile HTML](lighthouse-mobile.report.html), [mobile JSON](lighthouse-mobile.report.json), [desktop HTML](lighthouse-desktop.report.html), [desktop JSON](lighthouse-desktop.report.json).

The first mobile run was 69: the local preview lacked production compression and downloaded a large poster. Adding gzip parity with Apache and selecting a small mobile WebP poster (without also fetching its desktop counterpart) raised the measured score to 94. No content or interaction was disabled to achieve it.

## Manual browser and DOM results

Performed in the Codex in-app browser against the built site (not just the development server):

- Repeated ALL → LOCAL → EUROPEAN → ALL → EUROPEAN → LOCAL: **12 / 6 / 6** products, matching labels, initial product, progress and links. No stale collection.
- Natural desktop scrolling: the sticky narrative changed to **ULMA BRIO Ringlock Scaffolding**, with **2 / 6** and `/products/ulma-brio-ringlock`; title/image/technical details remain consistent. Subsequent chapters update, and normal document scrolling exits into geometry.
- Re-rendered filtered collections refresh observation even when Angular retains the chapter DOM. Viewport-height pixel margins avoid percentage-margin width dependence.
- Geometry category results at index one:
  - Column & Pier → Circular Column Systems, **3** products.
  - Circular & Curved → Manhole Formwork Systems, **4** products.
  - Slab & Shoring → Cuplock Scaffolding System, **2** products.
  - High-Rise Climbing → ULMA ORMA Modular Formwork, **2** products.
  - Bridge & Viaduct → Circular Column Systems, **4** products.
- Geometry Next changes the actual product, image, technical values and CTA (e.g. Slab & Shoring: Cuplock → ULMA Heavy Shoring). Category changes reset the index.
- Geometry/assembly section boundary measured **0px gap between section rectangles**. Content-sized padding remains; there are no artificial 300vh/350vh runways.
- Assembly Next traversed all seven named steps; Next disables at step 7. Previous restores step 6; Previous disables at step 1. Image, technical information, heading and counter derive from the same step.
- Service accordion opened the selected region and closed the previous region; correct `aria-expanded` state.
- Product CTA navigated to the matching Angular detail route. Direct hard refresh retained the product. Browser Back returned to home, Forward restored detail.
- All eight main navigation destinations rendered their expected page headings. All requested route families also passed the static/HTTP tests.
- Canonical link remained a **single element** after route navigation, with the current product URL.
- Unknown route rendered the 404 view with `noindex,follow`; the local preview returned HTTP 404. The deliberately requested 404 is not an application failure.
- Contact form rejected incomplete/invalid input, prepared a reviewed email draft, and cleared the stale draft when fields changed. **No email was sent.**
- Hero video inspected with `muted:true`, `paused:false`, `readyState:4`; mobile used `mobile.webm`. No broken loaded image elements observed.
- No runtime/hydration warnings or application console errors during the successful interaction/route checks. No failed application API calls: this release uses the static repository.

## Responsive checks

At **1440, 1280, 1024, 768, 430, 390 and 360 pixels**, measured document width matched viewport width (no horizontal page overflow). Desktop used sticky two-column storytelling; narrower screens used sequential product chapters and a one-column geometry presentation. The modal mobile menu opened, closed and navigated successfully at 360/390px. Mobile product filters, geometry navigation and assembly controls passed.

Screenshots: [desktop systems](screenshots/angular-desktop-systems.png), [mobile geometry-to-assembly flow](screenshots/angular-mobile-geometry.png). The design retains the supplied imagery, fonts, palette, technical trays and product storytelling; the requested new header, larger hero and service accordion are intentional changes, not a pixel-identical reproduction of the legacy screen.

## Remaining limits

- **Safari was not verified.** The computer-use permission check rejected access to Safari; no Safari pass is claimed.
- The public route UI is currently English. Existing Arabic source copy is archived and Arabic product names remain in the model; full Arabic UI parity is not implemented.
- Enquiry delivery/admin/API publishing are not enabled. The contact page explicitly prepares an email draft; future integration must use a real lead endpoint.
- No approved article/job data existed, so these routes use honest empty states. Existing company/project claims came from the supplied source, not independent verification.
- Namecheap upload/HTTPS/host-specific caching has not been performed. Apache rewrite behavior is supplied and inspected; an actual Apache/Namecheap account was not available for testing. Static fallback HTTP-404 caveats are documented in README.
