import { Component, computed, inject, signal } from '@angular/core';
import { ProductRepository } from '../../core/services/product.repository';
import { filterProducts } from '../../core/services/interaction-state';
import { ProductFilter } from '../../core/models/content';
import { ProductCardComponent } from '../../shared/product-card.component';
import { HOME } from '../../data/catalog';
@Component({
  selector: 'sm-systems',
  imports: [ProductCardComponent],
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
  readonly productRows = computed(() => {
    const products = this.filteredProducts();
    return Array.from({ length: Math.ceil(products.length / 3) }, (_, index) =>
      products.slice(index * 3, index * 3 + 3),
    );
  });
  readonly filters: readonly { code: ProductFilter; label: string }[] = [
    { code: 'ALL', label: 'All products' },
    { code: 'LOCAL', label: 'Local manufactured' },
    { code: 'EUROPEAN', label: 'European systems' },
  ];
  selectFilter(code: ProductFilter): void {
    this.activeClassification.set(code);
  }
  countFor(code: ProductFilter): number {
    return filterProducts(this.repository.products(), code).length;
  }
}
