import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

export type StackMode = 'pile' | 'overlay';

export function stackMetrics(
  stageHeight: number,
  stickyHeight: number,
  count: number,
): {
  step: number;
  travel: number;
  height: number;
} {
  const step = Math.max(1, stageHeight * 0.88);
  const travel = step * Math.max(0, count - 1);
  return { step, travel, height: stickyHeight + travel };
}

export function stackPosition(
  sectionTop: number,
  stickyTop: number,
  step: number,
  count: number,
): number {
  return Math.max(0, Math.min(Math.max(0, count - 1), (stickyTop - sectionTop) / step));
}

@Component({
  selector: 'sm-scroll-stack',
  template: '<div class="stack-sticky"><ng-content /></div>',
  styles: `
    :host {
      display: block;
      position: relative;
    }
    .stack-sticky {
      position: sticky;
      top: var(--stack-top, 88px);
      height: calc(100svh - var(--stack-top, 88px));
      overflow: hidden;
    }
    @media (max-width: 850px) {
      :host(.overlay-stack) {
        height: auto !important;
      }
      :host(.overlay-stack) .stack-sticky {
        position: static;
        height: auto !important;
        overflow: visible;
      }
    }
  `,
  host: { '[class.overlay-stack]': "mode() === 'overlay'" },
})
export class ScrollStackComponent {
  readonly count = input.required<number>();
  readonly mode = input.required<StackMode>();
  readonly activeIndex = signal(0);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroy = inject(DestroyRef);
  private sticky?: HTMLElement;
  private stage?: HTMLElement;
  private mobileTrack?: HTMLElement;
  private observer?: ResizeObserver;
  private frame = 0;
  private measureFrame = 0;
  private step = 1;
  private top = 0;
  private mobileOverlay = false;

  constructor() {
    effect(() => {
      this.count();
      if (this.sticky) this.scheduleMeasure();
    });
    afterNextRender(() => {
      this.sticky =
        this.host.nativeElement.querySelector<HTMLElement>('.stack-sticky') ?? undefined;
      this.stage =
        this.host.nativeElement.querySelector<HTMLElement>('[data-stack-stage]') ?? undefined;
      this.mobileTrack =
        this.host.nativeElement.querySelector<HTMLElement>('[data-mobile-track]') ?? undefined;
      if (!this.sticky || !this.stage) return;
      this.observer = new ResizeObserver(() => this.scheduleMeasure());
      this.observer.observe(this.sticky);
      this.observer.observe(this.stage);
      window.addEventListener('scroll', this.scheduleUpdate, { passive: true });
      window.addEventListener('resize', this.scheduleMeasure, { passive: true });
      this.mobileTrack?.addEventListener('scroll', this.scheduleUpdate, { passive: true });
      this.measure();
      this.update();
      this.destroy.onDestroy(() => {
        window.removeEventListener('scroll', this.scheduleUpdate);
        window.removeEventListener('resize', this.scheduleMeasure);
        this.mobileTrack?.removeEventListener('scroll', this.scheduleUpdate);
        this.observer?.disconnect();
        if (this.frame) cancelAnimationFrame(this.frame);
        if (this.measureFrame) cancelAnimationFrame(this.measureFrame);
      });
    });
  }

  private readonly scheduleUpdate = () => {
    if (!this.frame) {
      this.frame = requestAnimationFrame(() => {
        this.frame = 0;
        this.update();
      });
    }
  };

  private readonly scheduleMeasure = () => {
    if (this.measureFrame) return;
    this.measureFrame = requestAnimationFrame(() => {
      this.measureFrame = 0;
      if (!this.sticky) return;
      this.measure();
      this.scheduleUpdate();
    });
  };

  private panels(): HTMLElement[] {
    return Array.from(this.stage?.querySelectorAll<HTMLElement>('[data-stack-panel]') ?? []);
  }

  private measure(): void {
    if (!this.sticky || !this.stage) return;
    this.mobileOverlay =
      this.mode() === 'overlay' && window.matchMedia('(max-width: 850px)').matches;
    if (this.mobileOverlay) {
      this.host.nativeElement.style.height = '';
      this.clearPanels();
      return;
    }
    this.top =
      document.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect().height ?? 0;
    this.host.nativeElement.style.setProperty('--stack-top', `${this.top}px`);
    const metrics = stackMetrics(this.stage.clientHeight, this.sticky.clientHeight, this.count());
    this.step = metrics.step;
    this.host.nativeElement.style.height = `${metrics.height}px`;
  }

  private clearPanels(): void {
    for (const panel of this.panels()) {
      panel.style.transform = '';
      panel.style.opacity = '';
      panel.style.zIndex = '';
      panel.style.pointerEvents = '';
      panel.inert = false;
    }
  }

  private update(): void {
    if (!this.stage) return;
    if (this.mobileOverlay) {
      if (!this.mobileTrack) return;
      const first = this.mobileTrack?.querySelector<HTMLElement>('[data-stack-panel]');
      const width = first?.getBoundingClientRect().width ?? 1;
      const gap = parseFloat(getComputedStyle(this.mobileTrack).columnGap) || 0;
      this.activeIndex.set(
        Math.max(
          0,
          Math.min(
            this.count() - 1,
            Math.round((this.mobileTrack?.scrollLeft ?? 0) / (width + gap)),
          ),
        ),
      );
      return;
    }
    const position = stackPosition(
      this.host.nativeElement.getBoundingClientRect().top,
      this.top,
      this.step,
      this.count(),
    );
    const base = Math.floor(position);
    const fraction = position - base;
    const panels = this.panels();
    const stageHeight = this.stage.clientHeight;
    const stageWidth = this.stage.clientWidth;
    const active = Math.round(position);
    this.activeIndex.set(active);
    for (let index = 0; index < panels.length; index++) {
      const panel = panels[index]!;
      if (this.mode() === 'pile') {
        const relative = index - base;
        const peek = Math.min(32, Math.max(15, stageHeight * 0.035));
        if (relative < 0 || relative > 4) {
          panel.style.transform = 'translate3d(0, -110%, 0)';
          panel.style.opacity = '0';
        } else if (relative === 0) {
          panel.style.transform = `translate3d(0, ${-fraction * 108}%, 0) scale(${1 - fraction * 0.015})`;
          panel.style.opacity = `${1 - fraction * 0.12}`;
        } else {
          panel.style.transform = `translate3d(0, ${peek * (relative - fraction)}px, 0) scale(${1 - relative * 0.025 + fraction * 0.025})`;
          panel.style.opacity = relative === 4 ? `${fraction}` : '1';
        }
        panel.style.zIndex = `${panels.length - index}`;
      } else {
        const sign = index % 2 ? 1 : -1;
        const settled = index === 0 ? 0 : sign * stageWidth * 0.06;
        const waiting = sign * stageWidth * 0.92;
        let x = settled;
        let scale = 1;
        let opacity = 1;
        if (index === base + 1) {
          x = waiting + (settled - waiting) * fraction;
          scale = 0.975 + 0.025 * fraction;
        } else if (index > base + 1) {
          x = waiting;
          scale = 0.975;
          opacity = 0;
        }
        panel.style.transform = `translate3d(${x}px, 0, 0) scale(${scale})`;
        panel.style.opacity = `${opacity}`;
        panel.style.zIndex = `${index + 1}`;
      }
      panel.style.pointerEvents = index === active ? 'auto' : 'none';
      panel.inert = index !== active;
    }
  }

  jump(index: number): void {
    const target = Math.max(0, Math.min(this.count() - 1, index));
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    if (this.mobileOverlay) {
      this.panels()[target]?.scrollIntoView({
        behavior,
        block: 'nearest',
        inline: 'start',
      });
      return;
    }
    const absoluteTop = window.scrollY + this.host.nativeElement.getBoundingClientRect().top;
    window.scrollTo({ top: absoluteTop - this.top + target * this.step, behavior });
  }
}
