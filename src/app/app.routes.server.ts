import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { PRODUCTS, PROJECTS, SERVICES, INDUSTRIES } from './data/catalog';
export const serverRoutes: ServerRoute[] = [
  { path: 'admin', renderMode: RenderMode.Client },
  {
    path: 'products/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return PRODUCTS.filter((p) => p.active).map((p) => ({ slug: p.slug }));
    },
  },
  ...[
    { path: 'projects/:slug', items: PROJECTS },
    { path: 'services/:slug', items: SERVICES },
    { path: 'industries/:slug', items: INDUSTRIES },
  ].map(
    ({ path, items }): ServerRoute => ({
      path,
      renderMode: RenderMode.Prerender,
      fallback: PrerenderFallback.Client,
      async getPrerenderParams() {
        return items.map((item) => ({ slug: item.slug }));
      },
    }),
  ),
  { path: 'insights/:slug', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Prerender },
];
