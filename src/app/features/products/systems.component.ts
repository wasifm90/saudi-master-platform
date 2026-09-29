import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ProductRepository } from '../../core/services/product.repository';
import { filterProducts } from '../../core/services/interaction-state';
import { ProductFilter } from '../../core/models/content';
import { RouterLink } from '@angular/router';
import { ImageComponent } from '../../shared/image.component';
import { ScrollStackComponent } from '../../shared/scroll-stack.component';
import { HOME } from '../../data/catalog';
@Component({
  selector: 'sm-systems',
  imports: [RouterLink, ImageComponent, ScrollStackComponent],
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
  readonly stack = viewChild(ScrollStackComponent);
  readonly activeProductIndex = computed(() => this.stack()?.activeIndex() ?? 0);
  private readonly section = viewChild<ElementRef<HTMLElement>>('section');
  readonly filters: readonly { code: ProductFilter; label: string }[] = [
    { code: 'ALL', label: 'All products' },
    { code: 'LOCAL', label: 'Local manufactured' },
    { code: 'EUROPEAN', label: 'European systems' },
  ];
  selectFilter(code: ProductFilter): void {
    this.activeClassification.set(code);
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        this.section()?.nativeElement.scrollIntoView?.({ behavior: 'auto', block: 'start' });
      });
    }
  }
  countFor(code: ProductFilter): number {
    return filterProducts(this.repository.products(), code).length;
  }
}
