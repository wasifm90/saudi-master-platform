import { Component, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentRepository } from '../../core/services/content.repository';
import { ProductRepository } from '../../core/services/product.repository';
import { filterProducts } from '../../core/services/interaction-state';
import { GeometryId } from '../../core/models/content';
import { ImageComponent } from '../../shared/image.component';
import { ScrollStackComponent } from '../../shared/scroll-stack.component';

@Component({
  selector: 'sm-geometry',
  imports: [RouterLink, ImageComponent, ScrollStackComponent],
  template: ` <section class="geometry" id="geometry" aria-labelledby="geometry-title">
    <sm-scroll-stack mode="overlay" [count]="categories.length">
      <div class="geometry-stage">
        <div class="geometry-head shell">
          <p class="eyebrow">{{ labels.geometryEyebrow }}</p>
          <h2 id="geometry-title">{{ copy.geometry }}</h2>
          <p>{{ copy.geometryDescription }}</p>
          <div class="geometry-nav" role="group" aria-label="Structural geometry">
            @for (category of categories; track category.id; let index = $index) {
              <button
                type="button"
                (click)="rail()?.jump(index)"
                [class.active]="rail()?.activeIndex() === index"
                [attr.aria-pressed]="rail()?.activeIndex() === index"
              >
                {{ category.name }}
              </button>
            }
          </div>
          <div class="rail-hint">
            <span>Scroll down to unveil systems ↓</span><span>Swipe to explore →</span>
          </div>
        </div>
        <div class="geometry-viewport" data-stack-stage>
          <div
            class="geometry-track"
            data-mobile-track
            role="region"
            tabindex="0"
            aria-label="Formwork geometries; vertical scroll advances panels on desktop, swipe on mobile"
          >
            @for (category of categories; track category.id; let index = $index) {
              <article
                class="geometry-panel"
                data-stack-panel
                [style.z-index]="index + 1"
                [class.reverse]="index % 2 === 1"
                [attr.data-category]="category.id"
              >
                <div class="geometry-image">
                  <sm-image
                    [src]="category.image"
                    [alt]="category.name + ' formwork application'"
                    sizes="(min-width: 851px) 55vw, 85vw"
                  /><span
                    >{{ (index + 1).toString().padStart(2, '0') }} /
                    {{ categories.length.toString().padStart(2, '0') }}</span
                  >
                </div>
                <div class="geometry-copy">
                  <p class="eyebrow">
                    Formwork geometry / {{ (index + 1).toString().padStart(2, '0') }}
                  </p>
                  <h3>{{ category.name }}</h3>
                  <p>{{ category.description }}</p>
                  <div class="related-systems">
                    <span>{{ labels.geometryRelated }}</span>
                    @for (product of relatedProducts(category.id).slice(0, 3); track product.slug) {
                      <a [routerLink]="['/products', product.slug]">{{ product.name }} ↗</a>
                    }
                  </div>
                  @if (relatedProducts(category.id)[0]; as firstProduct) {
                    <a class="panel-cta" [routerLink]="['/products', firstProduct.slug]"
                      >{{ labels.geometryExplore }} <span aria-hidden="true">→</span></a
                    >
                  }
                </div>
              </article>
            }
          </div>
        </div>
      </div>
    </sm-scroll-stack>
  </section>`,
  styles: `
    .geometry {
      background: linear-gradient(135deg, #fff1df, #eef2f8 62%, #fff4da);
      border-block: 1px solid var(--line);
    }
    .geometry-stage {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .geometry-head {
      flex: none;
      padding-top: clamp(18px, 2.5vh, 30px);
    }
    .geometry-head h2 {
      margin: 6px 0;
      font: 700 clamp(32px, 3vw, 50px) / 1.05 var(--display);
      text-transform: uppercase;
    }
    .geometry-head > p:not(.eyebrow) {
      margin: 8px 0 16px;
      color: var(--muted);
      font-size: 14px;
    }
    .geometry-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .geometry-nav button {
      min-height: 42px;
      padding: 9px 15px;
      border: 1px solid #ded2c3;
      border-radius: 999px;
      background: #fff;
      color: #394958;
      font: 700 10px var(--display);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      transition:
        background 0.2s,
        transform 0.2s;
    }
    .geometry-nav button:hover {
      transform: translateY(-2px);
    }
    .geometry-nav button.active {
      background: var(--earth);
      color: #fff;
    }
    .rail-hint {
      display: flex;
      justify-content: flex-end;
      padding: 10px 0;
      color: #a8471f;
      font: 700 10px var(--display);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .rail-hint span:nth-child(2) {
      display: none;
    }
    .geometry-viewport {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    .geometry-track {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .geometry-panel {
      position: absolute;
      inset: 0 auto 0 3%;
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
      align-items: stretch;
      gap: clamp(22px, 3vw, 48px);
      width: 94%;
      height: 100%;
      padding: 12px clamp(24px, 4vw, 68px) 24px;
      overflow: hidden;
      border: 1px solid #dfd2c2;
      border-radius: 27px;
      background: #fffaf4;
      box-shadow: 0 18px 42px #26354324;
      transform-origin: center center;
    }
    .geometry-panel.reverse {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    }
    .geometry-panel.reverse .geometry-image {
      order: 2;
    }
    .geometry-image {
      position: relative;
      min-height: 0;
      overflow: hidden;
      border-radius: 25px;
      box-shadow: 0 18px 40px #26354326;
    }
    .geometry-image sm-image {
      height: 100%;
      aspect-ratio: auto;
    }
    .geometry-image > span {
      position: absolute;
      top: 20px;
      left: 20px;
      padding: 10px 14px;
      border-radius: 999px;
      background: #fffdf2ee;
      color: #5c483a;
      font: 700 11px var(--display);
    }
    .geometry-copy {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
      padding: 14px 0;
    }
    .geometry-copy h3 {
      margin: 12px 0 18px;
      font: 700 clamp(38px, 4.5vw, 72px) / 1.02 var(--display);
      text-transform: uppercase;
      letter-spacing: -0.03em;
    }
    .geometry-copy > p:not(.eyebrow) {
      max-width: 550px;
      color: #52606c;
      font-size: clamp(14px, 1.2vw, 17px);
      line-height: 1.7;
    }
    .related-systems {
      display: grid;
      gap: 7px;
      margin-top: 24px;
    }
    .related-systems span {
      color: #a8471f;
      font: 700 10px var(--display);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .related-systems a {
      color: var(--ink);
      font: 700 12px var(--display);
      text-decoration: none;
    }
    .related-systems a:hover {
      color: var(--earth);
    }
    .panel-cta {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 18px;
      min-height: 45px;
      margin-top: 24px;
      padding: 12px 18px;
      border-radius: 999px;
      background: var(--earth);
      color: #fff;
      font: 700 11px var(--display);
      text-transform: uppercase;
      text-decoration: none;
    }
    @media (max-height: 700px) and (min-width: 851px) {
      .geometry-head {
        padding-top: 10px;
      }
      .geometry-head > p:not(.eyebrow) {
        margin-bottom: 8px;
      }
      .geometry-panel {
        padding-block: 6px 12px;
      }
      .geometry-copy h3 {
        font-size: clamp(32px, 3.4vw, 50px);
        margin-block: 6px;
      }
      .related-systems {
        margin-top: 10px;
      }
      .panel-cta {
        margin-top: 12px;
      }
    }
    @media (max-width: 850px) {
      .geometry-stage {
        height: auto;
        padding: 28px 0 38px;
      }
      .geometry-head {
        width: min(100% - 36px, 1216px);
        padding-top: 0;
      }
      .geometry-head h2 {
        font-size: clamp(29px, 7vw, 42px);
      }
      .geometry-nav {
        gap: 6px;
      }
      .geometry-nav button {
        padding-inline: 11px;
        font-size: 9px;
      }
      .rail-hint span:first-child {
        display: none;
      }
      .rail-hint span:nth-child(2) {
        display: inline;
      }
      .geometry-viewport {
        overflow: visible;
      }
      .geometry-track {
        display: flex;
        width: 100%;
        height: auto;
        gap: 14px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        overscroll-behavior-inline: contain;
        padding: 0 7vw 16px 3vw;
        scrollbar-color: #ae612c #eadfce;
      }
      .geometry-panel,
      .geometry-panel.reverse {
        position: relative;
        inset: auto;
        flex: 0 0 min(84vw, 590px);
        display: block;
        width: auto;
        height: auto;
        padding: 12px;
        border: 1px solid #dfcbb7;
        border-radius: 25px;
        background: #fffaf5;
        scroll-snap-align: start;
      }
      .geometry-panel.reverse .geometry-image {
        order: unset;
      }
      .geometry-image sm-image {
        aspect-ratio: 4/3;
        height: auto;
      }
      .geometry-copy {
        padding: 22px 8px 8px;
      }
      .geometry-copy h3 {
        font-size: clamp(29px, 6vw, 42px);
      }
      .geometry-copy > p:not(.eyebrow) {
        font-size: 13px;
      }
      .related-systems {
        margin-top: 18px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .geometry-nav button {
        transition: none;
      }
    }
  `,
})
export class GeometryComponent {
  private readonly content = inject(ContentRepository);
  get copy() {
    return this.content.home;
  }
  get labels() {
    return this.content.labels;
  }
  get categories() {
    return this.content.geometries.filter((category) => category.id !== 'wall');
  }
  private readonly repository = inject(ProductRepository);
  readonly rail = viewChild(ScrollStackComponent);
  relatedProducts(id: GeometryId) {
    return filterProducts(this.repository.products(), 'ALL', id);
  }
}
