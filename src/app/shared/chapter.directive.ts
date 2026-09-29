import {
  afterRenderEffect,
  Directive,
  ElementRef,
  inject,
  input,
  NgZone,
  output,
} from '@angular/core';

/** Observe after Angular renders; renew even when @for retains a chapter node. */
@Directive({ selector: '[smChapter]' })
export class ChapterDirective {
  readonly smChapter = input.required<number>();
  readonly chapterSequence = input.required<readonly unknown[]>();
  readonly entered = output<number>();
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  constructor() {
    afterRenderEffect((onCleanup) => {
      const index = this.smChapter();
      this.chapterSequence();
      this.zone.runOutsideAngular(() => {
        let observer: IntersectionObserver | undefined;
        const observe = (): void => {
          observer?.disconnect();
          // Percentage root margins are based on WIDTH, not viewport height.
          const top = Math.round(innerHeight * 0.4);
          const bottom = Math.max(0, innerHeight - top - 1);
          observer = new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting))
                this.zone.run(() => this.entered.emit(index));
            },
            { rootMargin: `-${top}px 0px -${bottom}px 0px`, threshold: 0 },
          );
          observer.observe(this.element.nativeElement);
        };
        observe();
        window.addEventListener('resize', observe, { passive: true });
        onCleanup(() => {
          observer?.disconnect();
          window.removeEventListener('resize', observe);
        });
      });
    });
  }
}
