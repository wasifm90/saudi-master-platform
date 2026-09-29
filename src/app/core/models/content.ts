export type Classification = 'LOCAL' | 'EUROPEAN';
export type ProductFilter = Classification | 'ALL';
export type GeometryId = 'wall' | 'column' | 'circular' | 'slab' | 'high-rise' | 'bridge';
export interface TechnicalFeature {
  label: string;
  value: string;
}
export interface Product {
  id: number;
  slug: string;
  sku: string;
  name: string;
  nameAr: string;
  classification: Classification;
  manufacturer: string;
  tagline: string;
  shortDescription: string;
  description: string;
  systemInformation: string;
  applications: string[];
  applicationDescription: string;
  geometryCategories: GeometryId[];
  benefits: string[];
  components: string[];
  technicalFeatures: TechnicalFeature[];
  featuredImage: string;
  gallery: string[];
  video: string | null;
  displayOrder: number;
  active: boolean;
}
export interface GeometryCategory {
  id: GeometryId;
  name: string;
  description: string;
  image: string;
}
export interface AssemblyStep {
  id: number;
  title: string;
  description: string;
  image: string;
  video?: string;
  technicalFeatures: TechnicalFeature[];
}
export interface EditorialItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  body: string[];
  displayOrder: number;
}
export interface Project extends EditorialItem {
  location: string;
  industry: string;
  metrics: TechnicalFeature[];
}
export interface Service extends EditorialItem {}
export interface Industry extends EditorialItem {}
export interface Article extends EditorialItem {
  publishedAt: string;
}
export interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
}
export interface Testimonial {
  id: string;
  quote: string;
  attribution: string;
}
export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
}
export interface NavigationItem {
  label: string;
  path: string;
}
export interface Process {
  id: number;
  name: string;
  description: string;
  image: string;
}
