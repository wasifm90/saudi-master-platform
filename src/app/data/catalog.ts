import products from './products.json';
import geometries from './geometries.json';
import assembly from './assembly.json';
import projects from './projects.json';
import services from './services.json';
import processes from './processes.json';
import company from './company.json';
import {
  Product,
  GeometryCategory,
  AssemblyStep,
  Project,
  Service,
  Process,
  SiteSettings,
  Industry,
  Article,
  Job,
  Testimonial,
  NavigationItem,
} from '../core/models/content';

// The JSON files are the editable content boundary. Validate taxonomy at this boundary.
export const PRODUCTS: readonly Product[] = products.map((p) => {
  if (p.classification !== 'LOCAL' && p.classification !== 'EUROPEAN')
    throw new Error(`Unknown classification: ${p.classification}`);
  return {
    ...p,
    classification: p.classification,
    geometryCategories: p.geometryCategories.map((id) => {
      if (!['wall', 'column', 'circular', 'slab', 'high-rise', 'bridge'].includes(id))
        throw new Error(`Unknown geometry: ${id}`);
      return id as GeometryCategory['id'];
    }),
  };
});
export const GEOMETRIES: readonly GeometryCategory[] = geometries.map((g) => ({
  ...g,
  id: g.id as GeometryCategory['id'],
}));
export const ASSEMBLY: readonly AssemblyStep[] = assembly;
export const PROJECTS: readonly Project[] = projects;
export const SERVICES: readonly Service[] = services;
export const PROCESSES: readonly Process[] = processes;
export const COMPANY: SiteSettings = company;
// Empty collections are intentional: no invented vacancies, articles, or endorsements.
export const ARTICLES: readonly Article[] = [];
export const JOBS: readonly Job[] = [];
export const TESTIMONIALS: readonly Testimonial[] = [];
export const INDUSTRIES: readonly Industry[] = PROJECTS.map((p, i) => ({
  id: p.id,
  slug: p.industry
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, ''),
  name: p.industry,
  description: p.description,
  image: p.image,
  body: p.body,
  displayOrder: i,
}));
export const NAVIGATION: readonly NavigationItem[] = [
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Projects', path: '/projects' },
  { label: 'Products', path: '/products' },
  { label: 'Industries', path: '/industries' },
  { label: 'Safety & Quality', path: '/safety-quality' },
  { label: 'Careers', path: '/careers' },
  { label: 'Contact', path: '/contact' },
];
export const HOME = {
  kicker: 'Sovereign alliance · Saudi Master × ULMA',
  title: 'Local manufacturing. European engineering. One construction partner.',
  description:
    'Bespoke steel shutters, modular formwork systems, heavy shoring, and access scaffolding engineered for the Kingdom’s demanding construction projects.',
  products: 'Engineered systems',
  productsDescription:
    'Saudi fabrication and European ULMA engineering in a clear, filterable systems catalogue.',
  geometry: 'Formwork for every geometry',
  geometryDescription:
    'Select a structural geometry to explore the corresponding formwork, access and shoring systems.',
  assembly: 'Structural assembly protocol',
  services: 'From design to site',
  manufacturing: 'Manufactured here. Ready for the Kingdom.',
  projects: 'Proven project deployments',
} as const;
