import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ContentRepository } from '../../core/services/content.repository';
import { ProductRepository } from '../../core/services/product.repository';
import { filterProducts } from '../../core/services/interaction-state';
import { GeometryId } from '../../core/models/content';
import { ProductCardComponent } from '../../shared/product-card.component';
import { ImageComponent } from '../../shared/image.component';
import { HOME } from '../../data/catalog';

@Component({
  selector: 'sm-geometry',
  imports: [ProductCardComponent, ImageComponent],
  template: ` <section class="geometry section" id="geometry" aria-labelledby="geometry-title">
    <div class="shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Architectural versatility</p>
          <h2 id="geometry-title">{{ copy.geometry }}</h2>
          <p>{{ copy.geometryDescription }}</p>
        </div>
      </div>
      <div class="geometry-filters" role="group" aria-label="Structural geometry">
        @for (category of categories; track category.id) {
          <button
            type="button"
            (click)="selectGeometry(category.id)"
            [class.active]="activeGeometry() === category.id"
            [attr.aria-pressed]="activeGeometry() === category.id"
          >
            {{ category.name }}
          </button>
        }
      </div>
      @if (activeCategory(); as category) {
        <div class="geometry-layout">
          <div class="geometry-lead">
            <div class="geometry-lead__image">
              <sm-image
                [src]="category.image"
                [alt]="category.name + ' construction geometry'"
                sizes="(min-width: 851px) 35vw, 100vw"
              /><span>Geometry / {{ category.name }}</span>
            </div>
            <div class="geometry-lead__text">
              <p class="eyebrow">Selected geometry · {{ geometryProducts().length }} systems</p>
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
              <span class="scroll-cue"
                ><span class="desktop-cue">Scroll to explore systems ↓</span
                ><span class="mobile-cue">Swipe to explore systems →</span></span
              >
            </div>
          </div>
          @if (geometryProducts().length) {
            <div
              #track
              class="geometry-track"
              role="region"
              tabindex="0"
              [attr.aria-label]="category.name + ' products; swipe horizontally on mobile'"
            >
              @for (product of geometryProducts(); track product.slug; let index = $index) {
                <article class="geometry-slide" [attr.data-product-slug]="product.slug">
                  <div class="geometry-slide__meta">
                    <span>Application / {{ (index + 1).toString().padStart(2, '0') }}</span
                    ><span>{{ index + 1 }} / {{ geometryProducts().length }}</span>
                  </div>
                  <sm-product-card
                    [product]="product"
                    [featured]="true"
                    [index]="index"
                    [total]="geometryProducts().length"
                  />
                  <div class="geometry-callout">
                    <span>Application insight</span>
                    <p>{{ product.applicationDescription }}</p>
                  </div>
                </article>
              }
            </div>
          } @else {
            <p role="status">No active products are assigned to this geometry.</p>
          }
        </div>
      }
    </div>
  </section>`,
  styles: `
    .geometry {
      background: linear-gradient(135deg, #fff1df, #eef2f8 62%, #fff4da);
      border-block: 1px solid var(--line);
    }
    .geometry-filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin: 28px 0 34px;
    }
    .geometry-filters button {
      background: var(--white);
      border: 1px solid var(--line);
      border-radius: 30px;
      min-height: 44px;
      padding: 10px 18px;
      font: 700 11px var(--display);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      transition:
        transform 0.2s,
        border-color 0.2s,
        background 0.2s;
    }
    .geometry-filters button:hover {
      border-color: var(--earth);
      transform: translateY(-2px);
    }
    .geometry-filters button.active {
      background: var(--earth);
      color: #fff;
    }
    .geometry-layout {
      display: grid;
      grid-template-columns: minmax(0, 0.78fr) minmax(0, 1fr);
      align-items: start;
      gap: clamp(24px, 5vw, 68px);
    }
    .geometry-lead {
      position: sticky;
      top: 112px;
      overflow: hidden;
      border: 1px solid #dfcbb7;
      border-radius: 28px;
      background: #fffaf5;
      box-shadow: 0 20px 44px #3d4c5e15;
    }
    .geometry-lead__image {
      position: relative;
    }
    .geometry-lead__image sm-image {
      aspect-ratio: 1.7;
    }
    .geometry-lead__image > span {
      position: absolute;
      left: 18px;
      bottom: 18px;
      border-radius: 999px;
      padding: 9px 13px;
      background: #172838e8;
      color: #fff;
      font: 700 10px var(--display);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .geometry-lead__text {
      padding: clamp(20px, 3vw, 34px);
    }
    .geometry-lead h3 {
      margin: 10px 0;
      font: 700 clamp(28px, 3vw, 42px) / 1.08 var(--display);
      text-transform: uppercase;
    }
    .geometry-lead__text > p:not(.eyebrow) {
      color: var(--muted);
      line-height: 1.7;
      font-size: 14px;
    }
    .scroll-cue {
      display: block;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--line);
      color: #a8471f;
      font: 700 10px var(--display);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .mobile-cue {
      display: none;
    }
    .geometry-track {
      display: grid;
      gap: 28px;
      min-width: 0;
      outline-offset: 5px;
    }
    .geometry-slide {
      min-width: 0;
      scroll-margin-top: 110px;
      border: 1px solid #e1d1c1;
      border-radius: 27px;
      padding: 14px;
      background: #ffffffd9;
      box-shadow: 0 18px 42px #3d4c5e11;
    }
    .geometry-slide__meta {
      display: flex;
      justify-content: space-between;
      margin: 2px 5px 13px;
      color: #785e4e;
      font: 700 10px var(--display);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .geometry-slide sm-product-card {
      display: block;
    }
    .geometry-callout {
      margin-top: 14px;
      padding: 17px 19px;
      border-left: 4px solid #d47b2d;
      border-radius: 0 14px 14px 0;
      background: #fff1e3;
    }
    .geometry-callout span {
      color: var(--earth);
      font: 700 10px var(--display);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .geometry-callout p {
      margin: 8px 0 0;
      color: #5a5554;
      font-size: 13px;
      line-height: 1.6;
    }
    @supports (animation-timeline: view()) {
      .geometry-slide {
        animation: geometry-enter linear both;
        animation-timeline: view();
        animation-range: entry 0% entry 30%;
      }
    }
    @keyframes geometry-enter {
      from {
        opacity: 0.55;
        transform: translateY(22px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (max-width: 850px) {
      .geometry-filters {
        gap: 6px;
      }
      .geometry-filters button {
        font-size: 10px;
        padding: 10px 12px;
      }
      .geometry-layout {
        display: block;
      }
      .geometry-lead {
        position: static;
        margin-bottom: 20px;
      }
      .geometry-lead__image sm-image {
        aspect-ratio: 2;
      }
      .desktop-cue {
        display: none;
      }
      .mobile-cue {
        display: inline;
      }
      .geometry-track {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        overscroll-behavior-inline: contain;
        gap: 14px;
        padding: 0 26px 22px 0;
        scrollbar-color: #ae612c #eadfce;
      }
      .geometry-slide {
        flex: 0 0 min(82vw, 540px);
        scroll-snap-align: start;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .geometry-slide {
        animation: none;
      }
      .geometry-filters button {
        transition: none;
      }
    }
  `,
})
export class GeometryComponent {
  readonly copy = HOME;
  readonly categories = inject(ContentRepository).geometries;
  private readonly repository = inject(ProductRepository);
  private readonly track = viewChild<ElementRef<HTMLDivElement>>('track');
  readonly activeGeometry = signal<GeometryId>('column');
  readonly activeCategory = computed(() =>
    this.categories.find((g) => g.id === this.activeGeometry()),
  );
  readonly geometryProducts = computed(() =>
    filterProducts(this.repository.products(), 'ALL', this.activeGeometry()),
  );
  selectGeometry(id: GeometryId): void {
    const track = this.track()?.nativeElement;
    if (track) track.scrollLeft = 0;
    this.activeGeometry.set(id);
  }
}
