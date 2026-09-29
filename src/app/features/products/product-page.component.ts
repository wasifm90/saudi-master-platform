import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductRepository } from '../../core/services/product.repository';
import { resolveSlug } from '../../core/services/interaction-state';
import { ImageComponent } from '../../shared/image.component';
import { ProductCardComponent } from '../../shared/product-card.component';
import { SeoService } from '../../core/services/seo.service';
@Component({
  selector: 'sm-product-page',
  imports: [RouterLink, ImageComponent, ProductCardComponent],
  template: ` @if (product(); as p) {
      <article class="section shell product-page">
        <a routerLink="/products" class="text-link">← All systems</a>
        <div class="product-heading">
          <p class="eyebrow">
            {{ p.classification === 'LOCAL' ? 'Local manufactured' : 'European systems' }} ·
            {{ p.manufacturer }} · {{ p.sku }}
          </p>
          <h1>{{ p.name }}</h1>
          <p class="lead">{{ p.shortDescription }}</p>
        </div>
        <sm-image
          class="product-hero"
          [src]="p.featuredImage"
          [alt]="p.name"
          [priority]="true"
          sizes="100vw"
        />
        <div class="detail-columns">
          <div>
            <p class="eyebrow">System information</p>
            <h2>{{ p.tagline }}</h2>
            <p>{{ p.description }}</p>
            <h3>Applications & geometry</h3>
            <p>{{ p.applicationDescription }}</p>
            <ul class="tags">
              @for (application of p.applications; track application) {
                <li>{{ application.replaceAll('-', ' ') }}</li>
              }
            </ul>
            <h3>Assembly & operation</h3>
            <p>{{ p.systemInformation }}</p>
            <h3>Benefits</h3>
            <ul>
              @for (benefit of p.benefits; track benefit) {
                <li>{{ benefit }}</li>
              }
            </ul>
            <h3>System components</h3>
            <ul>
              @for (component of p.components; track component) {
                <li>{{ component }}</li>
              }
            </ul>
          </div>
          <aside>
            <h2>Technical specification</h2>
            <dl class="spec-list">
              @for (spec of p.technicalFeatures; track spec.label) {
                <div>
                  <dt>{{ spec.label }}</dt>
                  <dd>{{ spec.value }}</dd>
                </div>
              }
            </dl>
            <a class="button" routerLink="/contact" [queryParams]="{ product: p.slug }"
              >Enquire about this system →</a
            >
          </aside>
        </div>
        @if (p.video) {
          <video
            controls
            preload="none"
            [poster]="p.featuredImage"
            [src]="p.video"
            [attr.aria-label]="p.name + ' demonstration'"
          ></video>
        }
        @if (galleryImages().length) {
          <section class="detail-section">
            <h2>Product gallery</h2>
            <div class="gallery">
              @for (image of galleryImages(); track image) {
                <sm-image [src]="image" [alt]="p.name + ' product view'" />
              }
            </div>
          </section>
        }
        <section class="detail-section">
          <h2>Related systems</h2>
          <div class="related">
            @for (item of related(); track item.id) {
              <sm-product-card [product]="item" />
            }
          </div>
        </section>
      </article>
    } @else {
      <section class="section shell">
        <p class="eyebrow">404</p>
        <h1>Product not found</h1>
        <p>This product is unavailable or the link has changed.</p>
        <a routerLink="/products" class="button">Explore active products →</a>
      </section>
    }`,
  styles: `
    .product-heading {
      max-width: 1000px;
      margin: 40px 0;
      padding: clamp(24px, 4vw, 48px);
      border: 1px solid var(--line);
      border-radius: 28px;
      background: linear-gradient(115deg, #fff0df, #edf2f8 60%, #fff1d1);
    }
    .product-heading .eyebrow {
      display: inline-block;
      padding: 8px 12px;
      border-radius: 999px;
      background: #ffffffc9;
    }
    .product-heading h1 {
      max-width: 850px;
    }
    .product-hero {
      aspect-ratio: 16/8;
      border-radius: 24px;
      box-shadow: 0 18px 44px #394a5b1a;
    }
    .detail-columns {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 70px;
      margin: 64px 0;
    }
    .detail-columns h2 {
      font-size: 30px;
    }
    .detail-columns h3 {
      font: 600 19px var(--display);
      margin-top: 32px;
    }
    .detail-columns p,
    .detail-columns li {
      font-size: 15px;
      line-height: 1.9;
      color: var(--muted);
    }
    .detail-columns aside {
      align-self: start;
      background: linear-gradient(140deg, #fff, #fff8ef);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 28px;
      box-shadow: 0 14px 34px #394a5b14;
    }
    .spec-list div {
      border-bottom: 1px solid var(--line);
      padding: 14px 0;
    }
    .spec-list dt {
      font-size: 11px;
      text-transform: uppercase;
      color: var(--muted);
    }
    .spec-list dd {
      margin: 6px 0;
      font-weight: 600;
    }
    .detail-section {
      margin-top: 64px;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      max-width: 850px;
    }
    .related {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }
    .tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      list-style: none;
      padding: 0;
    }
    .tags li {
      padding: 5px 12px;
      background: var(--sand);
      border: 1px solid var(--line);
      border-radius: 999px;
      font-size: 11px !important;
      text-transform: capitalize;
    }
    @media (max-width: 1000px) {
      .related {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 800px) {
      .detail-columns {
        grid-template-columns: 1fr;
        gap: 32px;
        margin: 36px 0;
      }
      .related {
        grid-template-columns: 1fr;
      }
      .product-hero {
        aspect-ratio: 4/3;
      }
    }
  `,
})
export class ProductPageComponent {
  private readonly repository = inject(ProductRepository);
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);
  readonly product = computed(() =>
    resolveSlug(
      this.repository.products().filter((p) => p.active),
      this.params()?.get('slug') ?? '',
    ),
  );
  readonly galleryImages = computed(() => {
    const product = this.product();
    return product
      ? [...new Set(product.gallery.filter((image) => image !== product.featuredImage))]
      : [];
  });
  readonly related = computed(() => {
    const active = this.product();
    return this.repository
      .products()
      .filter(
        (p) =>
          p.active &&
          p.id !== active?.id &&
          p.geometryCategories.some((g) => active?.geometryCategories.includes(g)),
      )
      .slice(0, 3);
  });
  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const p = this.product();
      seo.set(
        p?.name ?? 'Product not found',
        p?.shortDescription ?? 'The requested product is unavailable.',
        '/products/' + (this.params()?.get('slug') ?? ''),
        p?.featuredImage,
        !p,
      );
    });
  }
}
