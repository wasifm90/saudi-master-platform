import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductRepository } from '../../core/services/product.repository';
import { filterProducts } from '../../core/services/interaction-state';
import { ProductFilter } from '../../core/models/content';
import { ChapterDirective } from '../../shared/chapter.directive';
import { ImageComponent } from '../../shared/image.component';
import { ProductNarrativeComponent } from '../../shared/product-narrative.component';
import { HOME } from '../../data/catalog';
@Component({
  selector: 'sm-systems',
  imports: [RouterLink, ChapterDirective, ImageComponent, ProductNarrativeComponent],
  templateUrl: './systems.component.html',
  styleUrl: './systems.component.scss',
})
export class SystemsComponent {
  readonly copy = HOME;
  readonly repository = inject(ProductRepository);
  readonly activeClassification = signal<ProductFilter>('ALL');
  readonly filteredProducts = computed(() =>
    filterProducts(this.repository.products(), this.activeClassification()),
  );
  readonly activeProductIndex = signal(0);
  readonly activeProduct = computed(
    () => this.filteredProducts()[this.activeProductIndex()] ?? this.filteredProducts()[0],
  );
  readonly filters: readonly { code: ProductFilter; label: string }[] = [
    { code: 'ALL', label: 'All products' },
    { code: 'LOCAL', label: 'Local manufactured' },
    { code: 'EUROPEAN', label: 'European systems' },
  ];
  constructor() {
    effect(() => {
      this.filteredProducts();
      this.activeProductIndex.set(0);
    });
  }
  selectFilter(code: ProductFilter): void {
    this.activeProductIndex.set(0);
    this.activeClassification.set(code);
  }
  activate(index: number): void {
    if (index >= 0 && index < this.filteredProducts().length) this.activeProductIndex.set(index);
  }
}
