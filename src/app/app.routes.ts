import { Routes } from '@angular/router';
const content = () =>
  import('./features/content/content-page.component').then((m) => m.ContentPageComponent);
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products-page.component').then((m) => m.ProductsPageComponent),
  },
  {
    path: 'products/:slug',
    loadComponent: () =>
      import('./features/products/product-page.component').then((m) => m.ProductPageComponent),
  },
  ...['projects', 'services', 'industries', 'insights'].flatMap((kind) => [
    { path: kind, loadComponent: content, data: { kind } },
    { path: kind + '/:slug', loadComponent: content, data: { kind } },
  ]),
  ...['about', 'safety-quality', 'careers', 'privacy', 'terms'].map((kind) => ({
    path: kind,
    loadComponent: content,
    data: { kind },
  })),
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component').then((m) => m.ContactComponent),
  },
  { path: '**', loadComponent: content, data: { kind: 'not-found' } },
];
