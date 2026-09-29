import { computed, signal } from '@angular/core';
import { AssemblyStep, GeometryId, Product, ProductFilter } from '../models/content';

export function filterProducts(
  products: readonly Product[],
  classification: ProductFilter = 'ALL',
  geometry?: GeometryId,
): readonly Product[] {
  return products
    .filter(
      (p) =>
        p.active &&
        (classification === 'ALL' || p.classification === classification) &&
        (!geometry || p.geometryCategories.includes(geometry)),
    )
    .toSorted((a, b) => a.displayOrder - b.displayOrder);
}
export function resolveSlug<T extends { slug: string }>(
  items: readonly T[],
  slug: string,
): T | undefined {
  return items.find((item) => item.slug === slug);
}
export class AssemblyState {
  readonly index = signal(0);
  readonly active = computed(() => this.steps[this.index()]);
  readonly first = computed(() => this.index() === 0);
  readonly last = computed(() => this.index() >= this.steps.length - 1);
  constructor(readonly steps: readonly AssemblyStep[]) {}
  select(index: number): void {
    this.index.set(Math.max(0, Math.min(index, this.steps.length - 1)));
  }
  next(): void {
    this.select(this.index() + 1);
  }
  previous(): void {
    this.select(this.index() - 1);
  }
}
export class AccordionState {
  readonly activeId = signal<string | null>(null);
  toggle(id: string): void {
    this.activeId.update((current) => (current === id ? null : id));
  }
}
