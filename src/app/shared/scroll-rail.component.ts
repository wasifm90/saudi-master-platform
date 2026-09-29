import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

export interface RailMetrics {
  overflow: number;
  travel: number;
  height: number;
}

export function measureRail(
  trackWidth: number,
  viewportWidth: number,
  viewportHeight: number,
  top: number,
): RailMetrics {
  const overflow = Math.max(0, trackWidth - viewportWidth);
  const stickyHeight = Math.max(1, viewportHeight - top);
  return { overflow, travel: overflow, height: stickyHeight + overflow };
}

export function railProgress(sectionTop: number, stickyTop: number, travel: number): number {
  return travel ? Math.max(0, Math.min(1, (stickyTop - sectionTop) / travel)) : 0;
}

@Component({
  selector: 'sm-scroll-rail',
  template: '<div class="rail-sticky"><ng-content /></div>',
  styles: `
    :host {
      display: block;
      position: relative;
    }
    .rail-sticky {
      position: sticky;
      top: var(--rail-top, 88px);
      height: calc(100svh - var(--rail-top, 88px));
      overflow: hidden;
    }
    @media (max-width: 850px) {
      :host {
        height: auto !important;
      }
      .rail-sticky {
        position: static;
        height: auto !important;
        overflow: visible;
      }
    }
  `,
})
export class ScrollRailComponent {
  readonly count = input.required<number>();
  readonly activeIndex = signal(0);
  readonly overflow = signal(0);
  readonly travel = signal(0);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroy = inject(DestroyRef);
  private sticky?: HTMLElement;
  private track?: HTMLElement;
  private resizeObserver?: ResizeObserver;
  private frame = 0;
  private top = 0;
  private mobile = false;

  constructor() {
    afterNextRender(() => {
      this.sticky = this.host.nativeElement.querySelector<HTMLElement>('.rail-sticky') ?? undefined;
      this.track =
        this.host.nativeElement.querySelector<HTMLElement>('[data-scroll-track]') ?? undefined;
      if (!this.sticky || !this.track) return;
      const schedule = () => {
        if (!this.frame)
          this.frame = requestAnimationFrame(() => {
            this.frame = 0;
            this.update();
          });
      };
      const resize = () => {
        this.measure();
        schedule();
      };
      this.resizeObserver = new ResizeObserver(resize);
      this.resizeObserver.observe(this.sticky);
      this.resizeObserver.observe(this.track);
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', resize, { passive: true });
      this.track.addEventListener('scroll', schedule, { passive: true });
      this.measure();
      this.update();
      this.destroy.onDestroy(() => {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', resize);
        this.track?.removeEventListener('scroll', schedule);
        this.resizeObserver?.disconnect();
        if (this.frame) cancelAnimationFrame(this.frame);
      });
    });
  }

  private measure(): void {
    if (!this.sticky || !this.track) return;
    this.mobile = window.matchMedia('(max-width: 850px)').matches;
    if (this.mobile) {
      this.host.nativeElement.style.height = '';
      this.track.style.transform = '';
      this.overflow.set(0);
      this.travel.set(0);
      return;
    }
    this.top =
      document.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect().height ?? 0;
    this.host.nativeElement.style.setProperty('--rail-top', `${this.top}px`);
    const metrics = measureRail(
      this.track.scrollWidth,
      this.sticky.clientWidth,
      window.innerHeight,
      this.top,
    );
    this.host.nativeElement.style.height = `${metrics.height}px`;
    this.overflow.set(metrics.overflow);
    this.travel.set(metrics.travel);
  }

  private update(): void {
    if (!this.track) return;
    if (this.mobile) {
      const firstPanel = this.track.firstElementChild as HTMLElement | null;
      const step = firstPanel?.getBoundingClientRect().width ?? 1;
      this.activeIndex.set(
        Math.max(0, Math.min(this.count() - 1, Math.round(this.track.scrollLeft / step))),
      );
      return;
    }
    const progress = railProgress(
      this.host.nativeElement.getBoundingClientRect().top,
      this.top,
      this.travel(),
    );
    this.track.style.willChange = progress > 0 && progress < 1 ? 'transform' : 'auto';
    this.track.style.transform = `translate3d(${-progress * this.overflow()}px, 0, 0)`;
    this.activeIndex.set(
      Math.max(0, Math.min(this.count() - 1, Math.round(progress * (this.count() - 1)))),
    );
  }

  jump(index: number): void {
    if (!this.track) return;
    const target = Math.max(0, Math.min(this.count() - 1, index));
    if (this.mobile) {
      const panel = this.track.children[target] as HTMLElement | undefined;
      panel?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      return;
    }
    const absoluteTop = window.scrollY + this.host.nativeElement.getBoundingClientRect().top;
    window.scrollTo({
      top: absoluteTop - this.top + (target / Math.max(1, this.count() - 1)) * this.travel(),
      behavior: 'smooth',
    });
  }
}
