export interface PageContent {
  title: string;
  kicker: string;
  description: string;
  image?: string;
  body: readonly string[];
  noindex?: boolean;
}
export const PAGES: Record<string, PageContent> = {
  about: {
    title: 'Local manufacturing. European engineering.',
    kicker: 'Saudi Master × ULMA',
    description: 'One construction partner for formwork, scaffolding and heavy shoring.',
    image: '/assets/images/about/about-hero.webp',
    body: [
      'Saudi Master brings together local steel fabrication and European ULMA systems for construction projects across Saudi Arabia.',
      'Our capabilities span engineering, material supply, on-site technical supervision, sales and rental. Explore our systems and project applications to discuss the requirements of your structure.',
    ],
  },
  'safety-quality': {
    title: 'Safety & quality',
    kicker: 'Engineering responsibility',
    description:
      'System specifications, assembly information and project-specific technical review.',
    image: '/assets/images/safety/safety-inspection.webp',
    body: [
      'Review the published product specifications and assembly sequence with your project engineer before selecting a system.',
      'Contact our technical team for the documentation applicable to your project, including load requirements, system compatibility and site supervision.',
    ],
  },
  careers: {
    title: 'Build your next chapter.',
    kicker: 'Careers',
    description: 'Engineering, manufacturing and project delivery.',
    image: '/assets/images/careers/engineering-team.webp',
    body: [
      'No open positions are currently published on this website. Contact the team for current opportunities.',
    ],
  },
  privacy: {
    title: 'Privacy',
    kicker: 'Website information',
    description: 'How this static website handles your information.',
    body: [
      'This website does not use analytics or advertising cookies. Product browsing and filters run in your browser.',
      'The enquiry form prepares an email in your chosen mail application. It does not upload your enquiry to this website. Your message is sent only when you send it through your email application.',
      'For questions about information sent to the company, contact the email address shown on the contact page. Hosting providers may keep standard access logs.',
    ],
  },
  terms: {
    title: 'Website terms',
    kicker: 'Product information',
    description: 'Information for using the product catalogue.',
    body: [
      'Product information is provided for initial project discussions. Confirm dimensions, capacities, availability and suitability with the technical team before procurement or use.',
      'This website does not accept orders or conclude supply agreements. Commercial and engineering terms must be confirmed directly with the company.',
    ],
  },
  'not-found': {
    title: 'This page is not here.',
    kicker: '404 · Page not found',
    description: 'The link may have changed. Explore our products or return to the homepage.',
    body: [],
    noindex: true,
  },
};
export const COLLECTION_COPY: Record<
  string,
  { title: string; description: string; empty: string }
> = {
  projects: {
    title: 'Proven project deployments',
    description: 'Formwork, access and shoring applications across Saudi Arabia.',
    empty: 'No projects are currently published.',
  },
  services: {
    title: 'From design to site',
    description: 'Engineering, supply and supervision throughout the construction lifecycle.',
    empty: 'No services are currently published.',
  },
  industries: {
    title: 'Engineering across industries',
    description: 'Explore applications from the existing project portfolio.',
    empty: 'No industries are currently published.',
  },
  insights: {
    title: 'Engineering insights',
    description: 'Technical updates and company articles.',
    empty:
      'No articles are currently published. Explore our product technical information or contact the engineering team.',
  },
};
