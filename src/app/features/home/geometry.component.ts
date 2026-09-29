import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentRepository } from '../../core/services/content.repository';
import { ProductRepository } from '../../core/services/product.repository';
import { filterProducts } from '../../core/services/interaction-state';
import { GeometryId } from '../../core/models/content';
import { ImageComponent } from '../../shared/image.component';
import { HOME } from '../../data/catalog';
@Component({
  selector: 'sm-geometry',
  imports: [RouterLink, ImageComponent],
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
      @if (activeProduct(); as product) {
        <div class="geometry-content" [attr.data-product-slug]="product.slug">
          <a class="geometry-image" [routerLink]="['/products', product.slug]"
            ><sm-image [src]="product.featuredImage" [alt]="product.name" /><span>{{
              categoryName()
            }}</span></a
          >
          <div class="geometry-copy">
            <p class="eyebrow">
              {{ product.classification === 'LOCAL' ? 'Local manufactured' : 'European systems' }} ·
              {{ product.manufacturer }}
            </p>
            <h3>{{ product.name }}</h3>
            <p>{{ product.shortDescription }}</p>
            <p class="application">{{ product.applicationDescription }}</p>
            <dl class="spec-grid">
              @for (spec of product.technicalFeatures.slice(0, 4); track spec.label) {
                <div>
                  <dt>{{ spec.label }}</dt>
                  <dd>{{ spec.value }}</dd>
                </div>
              }
            </dl>
            <a class="button" [routerLink]="['/products', product.slug]">View product →</a>
          </div>
        </div>
      } @else {
        <p role="status">No active products are assigned to this geometry.</p>
      }
      <div class="section-controls">
        <button
          type="button"
          (click)="previous()"
          [disabled]="activeProductIndex() === 0"
          aria-label="Previous geometry product"
        >
          ← Previous product</button
        ><span role="status"
          >{{ geometryProducts().length ? activeProductIndex() + 1 : 0 }} /
          {{ geometryProducts().length }} matching products</span
        ><button
          type="button"
          (click)="next()"
          [disabled]="activeProductIndex() >= geometryProducts().length - 1"
          aria-label="Next geometry product"
        >
          Next product →
        </button>
      </div>
    </div>
  </section>`,
  styles: `
    .geometry {
      background: var(--sand);
      border-block: 1px solid var(--line);
    }
    .geometry-filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin: 28px 0;
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
    }
    .geometry-filters button.active {
      background: var(--ink);
      color: #fff;
    }
    .geometry-content {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 36px;
      align-items: center;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: var(--white);
      animation: reveal 0.3s ease;
    }
    .geometry-image {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
    }
    .geometry-image sm-image {
      aspect-ratio: 4/3;
    }
    .geometry-image > span {
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: var(--ink);
      color: #fff;
      border-radius: 4px;
      padding: 8px 12px;
      font: 600 11px var(--display);
    }
    h3 {
      font: 700 clamp(24px, 3vw, 38px) / 1.1 var(--display);
      text-transform: uppercase;
      margin: 12px 0;
    }
    .geometry-copy p {
      font-size: 13px;
      line-height: 1.7;
    }
    .geometry-copy .eyebrow {
      font-size: 10px;
    }
    .application {
      color: var(--muted);
    }
    .geometry-copy .button {
      margin-top: 18px;
    }
    @media (max-width: 850px) {
      .geometry-content {
        grid-template-columns: 1fr;
        padding: 16px;
        gap: 24px;
      }
      .geometry-filters {
        gap: 6px;
      }
      .geometry-filters button {
        font-size: 10px;
        padding: 10px 12px;
      }
    }
  `,
})
export class GeometryComponent {
  readonly copy = HOME;
  readonly categories = inject(ContentRepository).geometries;
  private readonly repository = inject(ProductRepository);
  readonly activeGeometry = signal<GeometryId>('column');
  readonly geometryProducts = computed(() =>
    filterProducts(this.repository.products(), 'ALL', this.activeGeometry()),
  );
  readonly activeProductIndex = signal(0);
  readonly activeProduct = computed(
    () => this.geometryProducts()[this.activeProductIndex()] ?? this.geometryProducts()[0],
  );
  readonly categoryName = computed(
    () => this.categories.find((g) => g.id === this.activeGeometry())?.name ?? '',
  );
  constructor() {
    effect(() => {
      this.geometryProducts();
      this.activeProductIndex.set(0);
    });
  }
  selectGeometry(id: GeometryId): void {
    this.activeProductIndex.set(0);
    this.activeGeometry.set(id);
  }
  previous(): void {
    this.activeProductIndex.update((i) => Math.max(0, i - 1));
  }
  next(): void {
    this.activeProductIndex.update((i) => Math.min(this.geometryProducts().length - 1, i + 1));
  }
}
