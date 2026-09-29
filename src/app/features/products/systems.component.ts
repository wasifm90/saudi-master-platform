import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ProductRepository } from '../../core/services/product.repository';
import { filterProducts } from '../../core/services/interaction-state';
import { ProductFilter } from '../../core/models/content';
import { RouterLink } from '@angular/router';
import { ImageComponent } from '../../shared/image.component';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';
import { HOME } from '../../data/catalog';
@Component({
  selector: 'sm-systems',
  imports: [RouterLink, ImageComponent, ScrollRevealDirective],
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
  private readonly section = viewChild<ElementRef<HTMLElement>>('section');
  private readonly destroy = inject(DestroyRef);
  readonly filters: readonly { code: ProductFilter; label: string }[] = [
    { code: 'ALL', label: 'All products' },
    { code: 'LOCAL', label: 'Local manufactured' },
    { code: 'EUROPEAN', label: 'European systems' },
  ];
  selectFilter(code: ProductFilter): void {
    this.activeClassification.set(code);
    this.activeProductIndex.set(0);
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() =>
        this.section()?.nativeElement.scrollIntoView?.({ behavior: 'smooth', block: 'start' }),
      );
    }
  }
  countFor(code: ProductFilter): number {
    return filterProducts(this.repository.products(), code).length;
  }
  constructor() {
    afterNextRender(() => {
      let frame = 0;
      const update = () => {
        frame = 0;
        const chapters =
          this.section()?.nativeElement.querySelectorAll<HTMLElement>('.system-chapter');
        if (!chapters?.length) return;
        const center = window.innerHeight * 0.52;
        let closest = 0;
        let distance = Infinity;
        chapters.forEach((chapter, index) => {
          const rect = chapter.getBoundingClientRect();
          const delta = Math.abs((rect.top + rect.bottom) / 2 - center);
          if (delta < distance) {
            distance = delta;
            closest = index;
          }
        });
        this.activeProductIndex.set(closest);
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      update();
      this.destroy.onDestroy(() => {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        if (frame) cancelAnimationFrame(frame);
      });
    });
  }
}
