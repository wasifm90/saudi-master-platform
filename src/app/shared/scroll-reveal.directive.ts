import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

@Directive({ selector: '[smScrollReveal]' })
export class ScrollRevealDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroy = inject(DestroyRef);
  constructor() {
    afterNextRender(() => {
      if (
        !('IntersectionObserver' in window) ||
        matchMedia('(prefers-reduced-motion: reduce)').matches
      )
        return;
      this.element.classList.add('reveal-pending');
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting) return;
          this.element.classList.add('reveal-active');
          observer.disconnect();
        },
        { threshold: 0, rootMargin: '20% 0px 20% 0px' },
      );
      observer.observe(this.element);
      this.destroy.onDestroy(() => observer.disconnect());
    });
  }
}
