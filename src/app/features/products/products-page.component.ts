import { Component, inject } from '@angular/core';
import { SystemsComponent } from './systems.component';
import { SeoService } from '../../core/services/seo.service';
import { ContentRepository } from '../../core/services/content.repository';
@Component({
  selector: 'sm-products-page',
  imports: [SystemsComponent],
  template: `<div class="shell page-intro">
      <p class="eyebrow">{{ labels.productsPageEyebrow }}</p>
      <h1>{{ labels.productsPageTitle }}</h1>
    </div>
    <sm-systems />`,
})
export class ProductsPageComponent {
  private readonly content = inject(ContentRepository);
  get labels() {
    return this.content.labels;
  }
  constructor() {
    inject(SeoService).set(
      'Products',
      'Explore Saudi-manufactured and European ULMA formwork, scaffolding and shoring systems.',
      '/products',
    );
  }
}
