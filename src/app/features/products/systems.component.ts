import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ProductRepository } from '../../core/services/product.repository';
import { ContentRepository } from '../../core/services/content.repository';
import { filterProducts } from '../../core/services/interaction-state';
import { ProductFilter } from '../../core/models/content';
import { RouterLink } from '@angular/router';
import { ImageComponent } from '../../shared/image.component';
@Component({
  selector: 'sm-systems',
  imports: [RouterLink, ImageComponent],
  templateUrl: './systems.component.html',
  styleUrl: './systems.component.scss',
})
export class SystemsComponent {
  private readonly content = inject(ContentRepository);
  get copy() {
    return this.content.home;
  }
  get labels() {
    return this.content.labels;
  }
  readonly repository = inject(ProductRepository);
  readonly activeClassification = signal<ProductFilter>('ALL');
  readonly filteredProducts = computed(() =>
    filterProducts(this.repository.products(), this.activeClassification()),
  );
  readonly activeProductIndex = signal(0);
  private readonly section = viewChild<ElementRef<HTMLElement>>('section');
  private readonly rail = viewChild<ElementRef<HTMLElement>>('rail');
  readonly filters: readonly { code: ProductFilter }[] = [
    { code: 'ALL' },
    { code: 'LOCAL' },
    { code: 'EUROPEAN' },
  ];
  filterLabel(code: ProductFilter): string {
    return code === 'LOCAL'
      ? this.labels.productsFilterLocal
      : code === 'EUROPEAN'
        ? this.labels.productsFilterEuropean
        : this.labels.productsFilterAll;
  }
  selectFilter(code: ProductFilter): void {
    this.activeClassification.set(code);
    this.activeProductIndex.set(0);
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        this.rail()?.nativeElement.scrollTo?.({ left: 0, behavior: 'instant' });
        this.section()?.nativeElement.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
      });
    }
  }
  onRailScroll(): void {
    const rail = this.rail()?.nativeElement;
    const card = rail?.querySelector<HTMLElement>('.system-chapter');
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    this.activeProductIndex.set(
      Math.min(
        this.filteredProducts().length - 1,
        Math.round(rail.scrollLeft / (card.clientWidth + gap)),
      ),
    );
  }
  countFor(code: ProductFilter): number {
    return filterProducts(this.repository.products(), code).length;
  }
}
