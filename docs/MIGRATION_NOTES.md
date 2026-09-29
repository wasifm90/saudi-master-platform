# Angular migration — 29 September 2026

## Audit and source of truth

The old root `package.json` started `server.js`, a custom Node HTTP server serving `public_html/index.html`. `frontend/package.json` described Angular but contained no Angular dependency, workspace, component, compiler, or build; its start command referenced a missing `ui_server.js`. The public site was a hand-built SPA: `seed_data.js` populated `window.DB_SNAPSHOT`; `app.js` fetched `/api/public/products`, optionally overlaid localStorage admin edits, generated HTML strings and updated DOM/global state. The Node API read the same snapshot, not SQLite. PHP/Python and partial Laravel examples also existed but were not the running Node API.

The database has `applications` and `product_applications`; these relationships were missing from the public snapshot. `ProductResource.php` includes applications in the partial Laravel contract. There is no complete runnable Laravel application in this repository.

KEEP: supplied images/video, existing product/assembly/project/manufacturing copy, warm white/charcoal/gold design language, two-column product storytelling and section order.
MIGRATE: published product records and SQLite application relationships into typed static content; media into `public/assets`.
REBUILD: router, layout, all UI state, hero lifecycle, scroll observation, classification/geometry filtering, assembly, accordion and enquiry flow.
ARCHIVE: former frontend, localStorage admin, viewer, custom API/mock server, outdated frontend package, compiled Tailwind CSS and manual scroll logic. Git history plus `archive/legacy` retain these for reference; none is deployed.

## Findings behind the regressions

* Engineered systems was not removed: its generated chapters and IntersectionObserver were still in `app.js`. The last legacy refactor changed markup without rebuilding the compiled CSS. Browser inspection found the intended column widths missing (the left narrative was ~940px in a 1280px viewport), undermining the sticky presentation.
* ALL/LOCAL/EUROPEAN are canonical `class_code` values in the actual snapshot/API: `LOCAL`, `EUROPEAN`. In a clean local browser the buttons **did** filter six local/six European products; total click failure was not reproduced. However, the old filter function reverted an empty result to all products and ignored category filters with no matches. Initialization also depended on global state and script timing. The Angular implementation has no fallback-to-all behavior.
* Geometry buttons changed editorial geometry slides, not product collections. There was no product-to-geometry lookup in the UI. Source labels were `Column` and the `Column & Pier` type tag, confirming the business label; no literal `UMN & PIER` was found in source.
* Geometry and assembly click state competed with a global scroll listener that immediately derived indices from scroll position. This could replace the selected slide on the next scroll. Their controls were not truly disconnected in the clean local browser; the conflict and missing boundaries were the defects observed.
* Fixed `300vh` and `350vh` wrappers reserved large runways. The compiled stylesheet lacked the `top-20` utility: the browser computed `top:auto` for both supposedly sticky children, so content scrolled away and left the runway empty. Geometry was 2160px tall at a 720px viewport. No GSAP was installed.
* The old RFQ submission manufactured a success ticket after a timeout. It did not send an enquiry. The static Angular site prepares an explicit email draft; it never claims to send or deliver a message.

## Angular replacement

Angular 22.2.0 (npm latest stable at implementation), strict TypeScript 6.0, standalone components, zoneless signals, computed collections, Angular Router, Reactive Forms, HttpClient provisioning, SCSS, server prerendering and hydration/event replay.

`ProductRepository` is the injectable product boundary; `StaticProductRepository` is the current provider. `ContentRepository` supplies projects, services, assemblies and company data. A future API provider must normalize the backend DTO to `Product`, populate the repository's signals, surface loading/errors and replace the provider binding. Components do not call the legacy API or depend on transport shapes. No backend schema was changed.

The home systems catalogue renders one large product chapter per vertical scroll interval. Angular signals derive the filtered sequence and active chapter; each chapter has its own image, classification, specifications and product-detail route. An IntersectionObserver reveals each chapter as it enters, with reduced-motion and no-observer fallbacks. Changing a filter recreates the sequence and returns to its start. The shared product card remains in use on other catalogue and detail surfaces.

`GeometryComponent` presents the five requested categories as full-width panels. On desktop, `ScrollRailComponent` measures track overflow and sets the pinned section height to sticky viewport height plus that overflow. Passive vertical scroll moves the track by the measured distance; category buttons seek the same scroll position. On mobile, the rail becomes native horizontal snap-scroll. Product `geometryCategories` still determine related system links. Existing SQLite `applications` are preserved separately; Wall & Shear remains in the data but is outside this requested five-panel story.

The assembly protocol uses the same measured desktop rail and native mobile swipe, with all seven stages in data order and alternating image/text composition. Its imagery illustrates the matching assembly action rather than unrelated site scenes. No Previous/Next controls remain. `AssemblyState` remains tested as a bounded helper but is no longer used by the rendered component. The service accordion uses one active ID and linked `aria-expanded`/regions. Mobile navigation uses a native modal dialog for focus confinement and Escape behavior.

## Hero and assets

Video has a stable 92svh desktop container and a 76svh mobile container. Its background poster is the actual first frame of the supplied clip. The video fades over this same poster on readiness. `[muted]="true"` is a property binding: testing caught that the static muted attribute alone did not set the live property after Angular creation. Reduced-motion mode omits video and keeps the poster. Offscreen playback pauses through an observer, and the user has a pause/play control.

Locally generated desktop/mobile MP4 and WebM remove audio and use 24fps with compressed output. Images have WebP 480/960/1600 variants through NgOptimizedImage and an image loader. The fonts are self-hosted. No temporary external media, font CDN or animation library is required.

## Content limitations

Existing claims, project names and contact details come from the supplied repository; they have not been independently authenticated. No new client names, certifications, awards or statistics were fabricated. Careers and insights have honest empty states because no approved records existed. Generic industry pages derive from the supplied project industries. Privacy and terms describe the implemented site behavior and require the owner's normal publication review. The current public route copy is English; source Arabic copy is retained in the archive and product names retain `nameAr`. Full Arabic localization is not implemented in this migration.

The enquiry form is a validated email-draft workflow. A live lead API/admin CMS is intentionally not enabled. Future delivery integration should replace this with a real endpoint, not the archived mock ticket response.

## Deployment boundary

Only `dist/website/browser` is public. `archive`, `backend`, `database`, build tools and source code must not be uploaded to the document root. All existing catalogue routes are prerendered; no Node runtime is required on Namecheap. Apache serves existing files/directories first, refuses missing asset paths and uses the Angular CSR shell for otherwise unknown routes. A purely static Apache fallback returns HTTP 200 for that shell; Angular renders a noindex 404 view. The local preview server returns HTTP 404 for unknown routes. If strict production HTTP 404 responses are required for unknown slugs, configure a host-level error document or edge rule.
