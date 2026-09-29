import { afterNextRender, Injectable, signal } from '@angular/core';
import {
  ARTICLES,
  ASSEMBLY,
  COMPANY,
  GEOMETRIES,
  HOME,
  INDUSTRIES,
  JOBS,
  NAVIGATION,
  PROCESSES,
  PRODUCTS,
  PROJECTS,
  SERVICES,
} from '../../data/catalog';
import { COLLECTION_COPY, PageContent, PAGES } from '../../data/pages';
import {
  Article,
  AssemblyStep,
  GeometryCategory,
  Industry,
  Job,
  NavigationItem,
  Process,
  Product,
  Project,
  Service,
  SiteSettings,
} from '../models/content';

export interface SiteLabels {
  heroCaption: string;
  heroPartner: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  assemblyDescription: string;
  homeClosingKicker: string;
  homeClosingTitle: string;
  homeClosingCta: string;
  footerEnquiries: string;
  footerTagline: string;
  headerCta: string;
  headerTagline: string;
  productRailHint: string;
  productsEyebrow: string;
  productsCatalogue: string;
  productsFilterAll: string;
  productsFilterLocal: string;
  productsFilterEuropean: string;
  productsView: string;
  productsEmpty: string;
  productsPageEyebrow: string;
  productsPageTitle: string;
  geometryEyebrow: string;
  geometryRelated: string;
  geometryExplore: string;
  assemblyEyebrow: string;
  servicesEyebrow: string;
  manufacturingEyebrow: string;
  projectsEyebrow: string;
  contactEyebrow: string;
  contactTitle: string;
  contactIntro: string;
  contactTeam: string;
  contactPrivacy: string;
  productBack: string;
  productInformation: string;
  productApplications: string;
  productAssembly: string;
  productBenefits: string;
  productComponents: string;
  productTechnical: string;
  productEnquire: string;
  productGallery: string;
  productRelated: string;
  productMissingTitle: string;
  productMissingDescription: string;
  [key: string]: string;
}

export interface SiteContent {
  visibility: {
    hero: boolean;
    systems: boolean;
    geometry: boolean;
    assembly: boolean;
    services: boolean;
    manufacturing: boolean;
    projects: boolean;
    closing: boolean;
  };
  products: Product[];
  geometries: GeometryCategory[];
  assembly: AssemblyStep[];
  projects: Project[];
  services: Service[];
  processes: Process[];
  industries: Industry[];
  articles: Article[];
  jobs: Job[];
  company: SiteSettings;
  home: Record<keyof typeof HOME, string>;
  pages: Record<string, PageContent>;
  collectionCopy: Record<string, { title: string; description: string; empty: string }>;
  navigation: NavigationItem[];
  media: {
    heroPosterDesktop: string;
    heroPosterMobile: string;
    heroVideoDesktopWebm: string;
    heroVideoDesktopMp4: string;
    heroVideoMobileWebm: string;
    heroVideoMobileMp4: string;
  };
  labels: SiteLabels;
}

export const DEFAULT_CONTENT: SiteContent = {
  visibility: {
    hero: true,
    systems: true,
    geometry: true,
    assembly: true,
    services: true,
    manufacturing: true,
    projects: true,
    closing: true,
  },
  products: [...PRODUCTS],
  geometries: [...GEOMETRIES],
  assembly: [...ASSEMBLY],
  projects: [...PROJECTS],
  services: [...SERVICES],
  processes: [...PROCESSES],
  industries: [...INDUSTRIES],
  articles: [...ARTICLES],
  jobs: [...JOBS],
  company: COMPANY,
  home: HOME,
  pages: PAGES,
  collectionCopy: COLLECTION_COPY,
  navigation: [...NAVIGATION],
  media: {
    heroPosterDesktop: '/assets/video/hero/poster-desktop.webp',
    heroPosterMobile: '/assets/video/hero/poster-mobile.webp',
    heroVideoDesktopWebm: '/assets/video/hero/desktop.webm',
    heroVideoDesktopMp4: '/assets/video/hero/desktop.mp4',
    heroVideoMobileWebm: '/assets/video/hero/mobile.webm',
    heroVideoMobileMp4: '/assets/video/hero/mobile.mp4',
  },
  labels: {
    heroCaption: 'Civil engineering & formwork in motion',
    heroPartner: 'Saudi Master × ULMA',
    heroPrimaryCta: 'Explore systems',
    heroSecondaryCta: 'Talk to an engineer',
    assemblyDescription: 'Follow the build from base alignment to protected access.',
    homeClosingKicker: 'Engineering consultation',
    homeClosingTitle: "Bring us the structure. We'll engineer the system.",
    homeClosingCta: 'Start a project',
    footerEnquiries: 'Engineering enquiries',
    footerTagline: 'Local manufacturing. European engineering.',
    headerCta: 'Start a project',
    headerTagline: 'Formwork & Scaffolding Alliance',
    productRailHint: 'Scroll sideways to explore systems',
    productsEyebrow: 'Our products / Engineered systems',
    productsCatalogue: 'Systems catalogue',
    productsFilterAll: 'All products',
    productsFilterLocal: 'Local manufactured',
    productsFilterEuropean: 'European systems',
    productsView: 'View product',
    productsEmpty: 'No active products match this selection.',
    productsPageEyebrow: 'Product collection',
    productsPageTitle: 'Formwork. Scaffolding. Engineering.',
    geometryEyebrow: 'Architectural versatility',
    geometryRelated: 'Related systems',
    geometryExplore: 'Explore systems',
    assemblyEyebrow: 'Systems in motion',
    servicesEyebrow: 'Full lifecycle protocol',
    manufacturingEyebrow: 'In-Kingdom infrastructure',
    projectsEyebrow: 'Kingdom projects',
    contactEyebrow: 'Engineering consultation',
    contactTitle: "Bring us the structure. We'll engineer the system.",
    contactIntro: 'Tell us about your project, system requirements and location.',
    contactTeam: 'Talk to our team',
    contactPrivacy:
      'Your enquiry stays in your browser until you send it using your email application. No automatic submission takes place.',
    productBack: 'All systems',
    productInformation: 'System information',
    productApplications: 'Applications & geometry',
    productAssembly: 'Assembly & operation',
    productBenefits: 'Benefits',
    productComponents: 'System components',
    productTechnical: 'Technical specification',
    productEnquire: 'Enquire about this system',
    productGallery: 'Product gallery',
    productRelated: 'Related systems',
    productMissingTitle: 'Product not found',
    productMissingDescription: 'This product is unavailable or the link has changed.',
  },
};

@Injectable({ providedIn: 'root' })
export class SiteContentStore {
  readonly content = signal<SiteContent>(DEFAULT_CONTENT);
  readonly revision = signal(0);
  readonly serverAvailable = signal(false);

  constructor() {
    afterNextRender(() => void this.load());
  }

  async load(): Promise<boolean> {
    try {
      const response = await fetch('/api/content.php', {
        cache: 'no-store',
        credentials: 'same-origin',
      });
      if (!response.ok) return false;
      const result = (await response.json()) as { content?: SiteContent; revision?: number };
      this.serverAvailable.set(true);
      if (result.content) {
        this.content.set({
          ...DEFAULT_CONTENT,
          ...result.content,
          labels: { ...DEFAULT_CONTENT.labels, ...result.content.labels },
          media: { ...DEFAULT_CONTENT.media, ...result.content.media },
          visibility: { ...DEFAULT_CONTENT.visibility, ...result.content.visibility },
        });
        this.revision.set(result.revision ?? 0);
      }
      return true;
    } catch {
      // The bundled catalogue remains usable when the publishing API is unavailable.
      return false;
    }
  }
}
