import { describe, expect, it } from 'vitest';
import { filterProducts, AssemblyState, AccordionState, resolveSlug } from './interaction-state';
import { ASSEMBLY, GEOMETRIES, PRODUCTS, PROJECTS, SERVICES } from '../../data/catalog';
describe('Product catalogue state', () => {
  it('filters ALL / LOCAL / EUROPEAN without stale or inactive entries', () => {
    const products = [...PRODUCTS, { ...PRODUCTS[0]!, id: 99, active: false }];
    expect(filterProducts(products)).toHaveLength(12);
    for (const classification of [
      'LOCAL',
      'EUROPEAN',
      'ALL',
      'EUROPEAN',
      'LOCAL',
      'ALL',
    ] as const) {
      const result = filterProducts(products, classification);
      expect(result).toHaveLength(classification === 'ALL' ? 12 : 6);
      expect(
        result.every(
          (p) => p.active && (classification === 'ALL' || p.classification === classification),
        ),
      ).toBe(true);
    }
  });
  it('returns an empty set instead of reverting to all products', () =>
    expect(
      filterProducts(PRODUCTS, 'EUROPEAN', 'column').every((p) => p.classification === 'EUROPEAN'),
    ).toBe(true));
  it('resolves each geometry from product metadata and supports multiple geometries', () => {
    for (const category of GEOMETRIES) {
      const matches = filterProducts(PRODUCTS, 'ALL', category.id);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.every((p) => p.geometryCategories.includes(category.id))).toBe(true);
    }
    expect(filterProducts(PRODUCTS, 'ALL', 'column').map((p) => p.slug)).toContain(
      'circular-column-systems',
    );
    expect(filterProducts(PRODUCTS, 'ALL', 'high-rise').map((p) => p.slug)).toContain(
      'specialized-formwork',
    );
    expect(filterProducts(PRODUCTS, 'ALL', 'slab').map((p) => p.slug)).toEqual([
      'cuplock-scaffolding',
      'ulma-heavy-shoring',
    ]);
    expect(filterProducts([], 'LOCAL', 'column')).toEqual([]);
  });
});
describe('Assembly navigation', () => {
  it('moves title, image, notes together, bounds indices and restores the previous step', () => {
    const state = new AssemblyState(ASSEMBLY);
    state.previous();
    expect(state.index()).toBe(0);
    expect(state.first()).toBe(true);
    for (let i = 1; i < ASSEMBLY.length; i++) {
      state.next();
      expect(state.active()).toEqual(ASSEMBLY[i]);
    }
    state.next();
    expect(state.index()).toBe(6);
    expect(state.last()).toBe(true);
    state.previous();
    expect(state.active()).toEqual(ASSEMBLY[5]);
    state.select(0);
    expect(state.active()).toEqual(ASSEMBLY[0]);
  });
});
describe('Service accordion', () => {
  it('opens, replaces and collapses one active service', () => {
    const state = new AccordionState();
    state.toggle('1');
    expect(state.activeId()).toBe('1');
    state.toggle('2');
    expect(state.activeId()).toBe('2');
    state.toggle('2');
    expect(state.activeId()).toBeNull();
  });
});
describe('Route slugs', () => {
  it('resolves all product, project and service slugs and rejects unknown slugs', () => {
    for (const item of [...PRODUCTS, ...PROJECTS, ...SERVICES])
      expect(resolveSlug([item], item.slug)).toBe(item);
    expect(resolveSlug(PRODUCTS, 'missing-product')).toBeUndefined();
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(PRODUCTS.length);
  });
});
