import { Component, inject } from '@angular/core';
import { SystemsComponent } from './systems.component';
import { SeoService } from '../../core/services/seo.service';
@Component({
  selector: 'sm-products-page',
  imports: [SystemsComponent],
  template: `<div class="shell page-intro">
      <p class="eyebrow">Product collection</p>
      <h1>Formwork. Scaffolding.<br />Engineering.</h1>
    </div>
    <sm-systems />`,
})
export class ProductsPageComponent {
  constructor() {
    inject(SeoService).set(
      'Products',
      'Explore Saudi-manufactured and European ULMA formwork, scaffolding and shoring systems.',
      '/products',
    );
  }
}
