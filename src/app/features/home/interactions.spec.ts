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
  it('filters product tiles while keeping each card linked to its product', async () => {
    await configure();
    const fixture = TestBed.createComponent(SystemsComponent);
    fixture.detectChanges();
    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.filters button');
    buttons[2]!.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.product-tile')).toHaveLength(6);
    expect(fixture.nativeElement.querySelector('.product-tile h3').textContent).toContain(
      'ULMA ORMA',
    );
    expect(
      fixture.nativeElement
        .querySelectorAll('.product-tile')[1]
        .querySelector('h3 a')
        .getAttribute('href'),
    ).toBe('/products/ulma-brio-ringlock');
    expect(fixture.nativeElement.querySelector('.result-count').textContent).toContain('6 systems');
    buttons[1]!.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.product-tile')).toHaveLength(6);
    expect(fixture.nativeElement.querySelector('.product-tile h3 a').getAttribute('href')).toBe(
      '/products/cuplock-scaffolding',
    );
    expect(
      fixture.nativeElement.querySelector('.product-tile .tile-enquire').getAttribute('href'),
    ).toBe('/contact?product=cuplock-scaffolding');
    fixture.destroy();
  });
  it('replaces geometry content and safely resets when repository data changes', async () => {
    await configure();
    const fixture = TestBed.createComponent(GeometryComponent);
    fixture.detectChanges();
    fixture.componentInstance.selectGeometry('slab');
    fixture.detectChanges();
    fixture.componentInstance.next();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.geometry-copy h3').textContent).toContain(
      'Heavy Shoring',
    );
    repository.products.set(PRODUCTS.filter((p) => p.slug === 'cuplock-scaffolding'));
    fixture.detectChanges();
    expect(fixture.componentInstance.activeProductIndex()).toBe(0);
    expect(fixture.nativeElement.querySelector('.geometry-copy .button').getAttribute('href')).toBe(
      '/products/cuplock-scaffolding',
    );
  });
  it('renders a bounded assembly sequence through button clicks', async () => {
    await configure();
    const fixture = TestBed.createComponent(AssemblyComponent);
    fixture.detectChanges();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
      '.section-controls > button',
    );
    expect(buttons[0]!.disabled).toBe(true);
    for (let i = 0; i < 6; i++) {
      buttons[1]!.click();
      fixture.detectChanges();
    }
    expect(buttons[1]!.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('h3').textContent).toContain('Guardrails');
    buttons[0]!.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h3').textContent).toContain('Trapdoors');
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
