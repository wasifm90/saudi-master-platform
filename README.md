# Saudi Master × ULMA — Angular website

A real Angular 22.2 standalone application with strict TypeScript, signals, SCSS, Router, Reactive Forms and static prerendering. The former JavaScript site is archived outside the public build.

## Develop

Use Node **22.22.3+ (22.x)**, **24.15+ (24.x)** or 26+, as required by Angular 22.2. The project includes a local Node 22 runtime for machines with an older system Node; npm scripts automatically resolve it from `node_modules/.bin`.

```sh
npm install
npm start
# http://localhost:4306
npm test
npm run build
npm run preview
# http://localhost:4306 — stop the dev server first
npm run verify:production
```

`npm run build` generates 37 prerendered pages plus a CSR fallback in **dist/website/browser**. `npm run preview` is a local static verification server, not a production dependency. `node server.js` is a compatibility launcher for that same Angular output.

## Structure

- `src/app/core/models`: strongly typed product and editorial content contracts.
- `src/app/core/services`: repository boundaries, interaction state and metadata.
- `src/app/data`: editable catalogue JSON, static page copy, taxonomy, navigation.
- `src/app/shared`: responsive image component, product narrative and scroll observer directive.
- `src/app/layout`: header, accessible mobile dialog and footer.
- `src/app/features/home`: separate hero, geometry, assembly, services, manufacturing and projects.
- `src/app/features/products`: scroll showcase, product index and product detail routes.
- `src/app/features/content`: reusable editorial index/detail/static pages.
- `src/app/features/contact`: typed Reactive Form and explicit email-draft flow.
- `public/assets`: local responsive images, video and poster. Fonts are bundled by Angular.
- `archive/legacy`: reference-only old implementation, never included in build/deployment.
- `backend`, `database`: existing backend/schema references, not a running CMS.

## Routes and metadata

Routes are defined in `src/app/app.routes.ts`. `/`, `/about`, `/products`, `/products/:slug`, `/projects`, `/projects/:slug`, `/services`, `/services/:slug`, `/industries`, `/industries/:slug`, `/safety-quality`, `/careers`, `/insights`, `/insights/:slug`, `/contact`, `/privacy`, `/terms` and an accessible wildcard 404 are supported.

Static route parameters come from `app.routes.server.ts`. `scripts/generate-seo.mjs` creates robots/sitemap from the content and production `siteUrl`. Each page sets title, description, canonical, OpenGraph and Twitter metadata. Unknown products/articles display a noindex 404 state. With no approved articles, article detail routes use client rendering until content is added.

## Editing content

Edit `src/app/data/*.json`; do not modify component templates for catalogue content. Preserve unique stable slugs, `LOCAL`/`EUROPEAN` classifications, active flags and display order. Product `geometryCategories` accepts `wall`, `column`, `circular`, `slab`, `high-rise`, `bridge`, and supports multiple assignments. Technical capacities must come from approved product documentation.

`pages.ts` contains editorial/utility copy. `catalog.ts` contains navigation/home labels. Careers/articles/testimonials remain empty until approved data is provided. The source catalogue includes existing project/company claims; check these through the normal editorial process before public release. Do not re-run the one-time legacy content migration over subsequent editorial changes.

## Assets

Use stable local paths under `public/assets/images/<category>` and `public/assets/video/hero`. Responsive images require `name.webp`, `name-480.webp`, `name-960.webp`, `name-1600.webp`. `ImageComponent` requests the appropriate variant and reserves image dimensions. Do not insert huge source JPEGs into public output.

`npm run optimize:assets` reproducibly regenerates migrated image/video derivatives from archived originals using Sharp and FFmpeg. The hero poster is extracted from frame one. The video is muted, looped, plays inline, pauses offscreen and is absent for reduced-motion users. Replace all video formats/poster together when approving a new clip.

## Future API integration

Components inject `ProductRepository`. Implement a repository using HttpClient, map the API DTO once to `Product`, expose the same products/loading/error signals and change the `app.config.ts` provider. Preserve `geometryCategories` as a backend relation or explicit metadata; do not infer it from UI button text. Other content is exposed through `ContentRepository` and can use the same approach. `provideHttpClient(withFetch())` is configured. Do not restore `window.DB_SNAPSHOT`, HTML string rendering or localStorage admin overrides.

Environments are in `src/environments`: production site URL, API URL, analytics configuration and feature flags. API products/lead submission are disabled in this static phase. The enquiry form prepares an email for review and **does not claim delivery**. Add an actual lead endpoint and service before enabling server submission.

## Namecheap / Apache deployment

1. Set the real production `siteUrl` in `src/environments/environment.ts` (currently the domain already used by the source project). Confirm contact details and public copy.
2. Run `npm install`, `npm test`, `npm run build`, `npm run verify:production`.
3. Back up the current hosting document root.
4. Upload **contents of `dist/website/browser/`**, including hidden **`.htaccess`**, into the domain document root. Do not upload the repository, archive, database, Node server or `node_modules`.
5. Enable HTTPS using the hosting control panel. No Node application needs to be configured.
6. Verify direct product URLs and hard refresh, `/robots.txt`, `/sitemap.xml`, `/assets/video/hero/mobile.mp4` and a missing asset URL. Missing assets must return 404 rather than HTML.
7. Test the mobile menu, all filters, product links, assembly controls and an enquiry draft.

The Apache rules serve real prerendered route directories, preserve assets and use `index.csr.html` for unknown SPA paths. Unknown routes display Angular's noindex 404; static Apache rewrites may return a 200 HTTP status. Configure an ErrorDocument/edge rule if strict HTTP 404 semantics are needed. For a subfolder install, configure the Angular base href and asset/site URLs together; the supplied configuration targets a domain root.

On Nginx, use `try_files $uri $uri/index.html /index.csr.html`, with a separate asset location returning 404 for missing files. Only fingerprinted JS/CSS/fonts should receive immutable year-long caching; refresh media caches when replacing stable filenames.

See [migration notes](docs/MIGRATION_NOTES.md) and [verification report](docs/VERIFICATION.md) for findings, measured results and remaining limitations.
