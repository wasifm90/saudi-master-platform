import { Component, computed, effect, inject, signal } from '@angular/core';
import { ContentRepository } from '../../core/services/content.repository';
import { ProductRepository } from '../../core/services/product.repository';
import { filterProducts } from '../../core/services/interaction-state';
import { GeometryId } from '../../core/models/content';
import { ProductCardComponent } from '../../shared/product-card.component';
import { HOME } from '../../data/catalog';
@Component({
  selector: 'sm-geometry',
  imports: [ProductCardComponent],
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
          <div class="geometry-context">
            <p class="eyebrow">
              Selected geometry / {{ activeProductIndex() + 1 }} of {{ geometryProducts().length }}
            </p>
            <h3>{{ categoryName() }}</h3>
            <p>{{ categoryDescription() }}</p>
            <div class="geometry-callout">
              <span>Application insight</span>
              <p>{{ product.applicationDescription }}</p>
            </div>
          </div>
          <sm-product-card [product]="product" [featured]="true" />
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
      background: linear-gradient(135deg, #fff1df, #eef2f8 62%, #fff4da);
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
    .geometry-filters button:hover {
      border-color: var(--earth);
    }
    .geometry-filters button.active {
      background: var(--earth);
      color: #fff;
    }
    .geometry-content {
      display: grid;
      grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
      gap: clamp(24px, 5vw, 72px);
      align-items: center;
      padding: clamp(20px, 3vw, 38px);
      border: 1px solid var(--line);
      border-radius: 28px;
      background: #ffffffb3;
      box-shadow: 0 18px 42px #3d4c5e14;
      animation: reveal 0.3s ease;
    }
    .geometry-context h3 {
      font: 700 clamp(27px, 3.4vw, 42px) / 1.08 var(--display);
      text-transform: uppercase;
      margin: 12px 0;
    }
    .geometry-context > p:not(.eyebrow) {
      max-width: 440px;
      color: var(--muted);
      font-size: 15px;
    }
    .geometry-callout {
      margin-top: 32px;
      padding: 20px 22px;
      border-left: 4px solid #d47b2d;
      border-radius: 0 16px 16px 0;
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
    }
    @media (max-width: 850px) {
      .geometry-content {
        grid-template-columns: 1fr;
        padding: 18px;
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
  readonly categoryDescription = computed(
    () => this.categories.find((g) => g.id === this.activeGeometry())?.description ?? '',
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
