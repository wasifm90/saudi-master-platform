import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../core/models/content';
@Component({
  selector: 'sm-product-narrative',
  imports: [RouterLink],
  template: ` <div class="product-meta">
      <span class="classification">{{
        product().classification === 'LOCAL' ? 'Local manufactured' : 'European systems'
      }}</span
      ><span>{{ product().sku }}</span>
    </div>
    <p class="eyebrow manufacturer">{{ product().manufacturer }}</p>
    <h3>{{ product().name }}</h3>
    <p class="tagline">{{ product().tagline }}</p>
    <p>{{ product().shortDescription }}</p>
    <div class="technical-tray">
      <h4>Systems architecture & application</h4>
      <p>{{ product().description }}</p>
    </div>
    <div class="technical-tray">
      <h4>Geometry & dimensional specifications</h4>
      <dl class="spec-grid">
        @for (spec of product().technicalFeatures.slice(0, 4); track spec.label) {
          <div>
            <dt>{{ spec.label }}</dt>
            <dd>{{ spec.value }}</dd>
          </div>
        }
      </dl>
    </div>
    <div class="technical-tray">
      <h4>Assembly in motion & site protocol</h4>
      <p>{{ product().systemInformation }}</p>
    </div>
    <div class="actions">
      <a class="button" [routerLink]="['/products', product().slug]">View product →</a
      ><a class="enquiry-link" routerLink="/contact" [queryParams]="{ product: product().slug }"
        >Enquire ↗</a
      >
    </div>`,
  styles: `
    :host {
      display: block;
    }
    .product-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      font: 600 10px var(--display);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .classification {
      background: var(--sand);
      padding: 6px 9px;
      border-radius: 4px;
      color: #70501c;
    }
    .manufacturer {
      font-size: 10px;
      margin-top: 15px;
    }
    h3 {
      font: 700 clamp(24px, 2.3vw, 34px) / 1.05 var(--display);
      text-transform: uppercase;
      margin: 8px 0;
      letter-spacing: -0.025em;
    }
    .tagline {
      color: var(--earth);
      font: 600 10px/1.5 var(--display);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    p {
      font-size: 12px;
      line-height: 1.6;
      color: var(--muted);
    }
    .technical-tray {
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 12px;
      margin: 10px 0;
      background: var(--white);
    }
    h4 {
      font: 700 10px var(--display);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 8px;
    }
    .technical-tray p {
      margin: 0;
      font-size: 11px;
    }
    .spec-grid {
      margin: 0;
    }
    .spec-grid dt {
      font-size: 8px;
    }
    .spec-grid dd {
      font-size: 11px;
    }
    .actions {
      margin-top: 16px;
      gap: 12px;
    }
    .button {
      font-size: 10px;
    }
    .enquiry-link {
      font: 600 11px var(--display);
      padding: 12px 0;
    }
  `,
})
export class ProductNarrativeComponent {
  readonly product = input.required<Product>();
}
