import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { ProductRepository } from '../../core/services/product.repository';
import { PRODUCTS } from '../../data/catalog';
import { GeometryComponent } from './geometry.component';
import { AssemblyComponent } from './assembly.component';
import { SystemsComponent } from '../products/systems.component';
beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );
});
afterEach(() => vi.unstubAllGlobals());
const repository = {
  products: signal(PRODUCTS),
  loading: signal(false),
  error: signal<string | null>(null),
};
async function configure(): Promise<void> {
  await TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: ProductRepository, useValue: repository }],
  }).compileComponents();
  repository.products.set(PRODUCTS);
}
describe('Angular rendered interactions', () => {
  it('rebuilds the product rail when filters change', async () => {
    await configure();
    const fixture = TestBed.createComponent(SystemsComponent);
    fixture.detectChanges();
    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.filters button');
    buttons[2]!.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.system-chapter')).toHaveLength(6);
    expect(fixture.nativeElement.querySelector('.product-sequence[role="region"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.system-chapter h3').textContent).toContain(
      'ULMA ORMA',
    );
    expect(
      fixture.nativeElement
        .querySelectorAll('.system-chapter')[1]
        .querySelector('.chapter-link')
        .getAttribute('href'),
    ).toBe('/products/ulma-brio-ringlock');
    expect(fixture.nativeElement.querySelector('.result-count').textContent).toContain(
      '1 / 6 systems',
    );
    buttons[1]!.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.system-chapter')).toHaveLength(6);
    expect(
      fixture.nativeElement.querySelector('.system-chapter .chapter-link').getAttribute('href'),
    ).toBe('/products/cuplock-scaffolding');
    expect(fixture.nativeElement.querySelectorAll('.product-grid')).toHaveLength(0);
    fixture.destroy();
  });
  it('renders five ordered overlapping geometry panels with matching system routes', async () => {
    await configure();
    const fixture = TestBed.createComponent(GeometryComponent);
    fixture.detectChanges();
    const slides: NodeListOf<HTMLElement> =
      fixture.nativeElement.querySelectorAll('.geometry-panel');
    expect(slides).toHaveLength(5);
    expect(slides[0]?.dataset['category']).toBe('column');
    expect(slides[4]?.dataset['category']).toBe('bridge');
    expect(slides[0]?.querySelector('h3')?.textContent).toContain('Column & Pier');
    expect(slides[0]?.querySelectorAll('.related-systems a').length).toBeGreaterThan(0);
    expect(slides[0]?.querySelector('.panel-cta')?.getAttribute('href')).toBe(
      '/products/circular-column-systems',
    );
    expect(fixture.nativeElement.querySelector('.geometry-track').getAttribute('tabindex')).toBe(
      '0',
    );
    expect(
      fixture.nativeElement.querySelector('.geometry-track').hasAttribute('data-mobile-track'),
    ).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('[data-stack-panel]')).toHaveLength(5);
    fixture.destroy();
  });
  it('renders every assembly stage in the overlay stack', async () => {
    await configure();
    const fixture = TestBed.createComponent(AssemblyComponent);
    fixture.detectChanges();
    const steps: NodeListOf<HTMLElement> =
      fixture.nativeElement.querySelectorAll('.assembly-panel');
    expect(steps).toHaveLength(7);
    expect(steps[0]!.dataset['step']).toBe('1');
    expect(steps[6]!.dataset['step']).toBe('7');
    expect(steps[6]!.querySelector('h3')?.textContent).toContain('Guardrails');
    expect(
      new Set(Array.from(steps, (step) => step.querySelector('img')?.getAttribute('src'))).size,
    ).toBe(7);
    expect(fixture.nativeElement.querySelector('.assembly-track').getAttribute('tabindex')).toBe(
      '0',
    );
    expect(
      fixture.nativeElement.querySelector('.assembly-track').hasAttribute('data-mobile-track'),
    ).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('[data-stack-panel]')).toHaveLength(7);
    fixture.destroy();
  });
});

describe('Hero motion preference', () => {
  it('omits video for reduced motion and binds muted when playback is enabled', async () => {
    const { HeroComponent } = await import('./hero.component');
    let preferenceChanged: (() => void) | undefined;
    const removeEventListener = vi.fn();
    const reduced = {
      matches: true,
      addEventListener: (_event: string, listener: () => void) => {
        preferenceChanged = listener;
      },
      removeEventListener,
    };
    vi.stubGlobal('matchMedia', (query: string) =>
      query.includes('prefers-reduced-motion') ? reduced : { matches: false },
    );
    await configure();
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('video')).toBeNull();
    expect(fixture.nativeElement.querySelector('.hero-poster')).not.toBeNull();
    reduced.matches = false;
    preferenceChanged?.();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('video').muted).toBe(true);
    fixture.destroy();
    expect(removeEventListener).toHaveBeenCalled();
  });
});
