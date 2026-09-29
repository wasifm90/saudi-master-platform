import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HOME } from '../../data/catalog';
@Component({
  selector: 'sm-hero',
  imports: [RouterLink],
  template: ` <section class="hero" aria-label="Construction in motion">
      <picture
        ><source media="(max-width: 767px)" srcset="/assets/video/hero/poster-mobile.webp" />
        <img
          class="hero-poster"
          src="/assets/video/hero/poster-desktop.webp"
          alt="Construction site and formwork"
          width="1280"
          height="720"
          fetchpriority="high"
      /></picture>
      @if (playVideo()) {
        <video
          #video
          class="hero-video"
          [class.ready]="ready()"
          [poster]="
            mobile()
              ? '/assets/video/hero/poster-mobile.webp'
              : '/assets/video/hero/poster-desktop.webp'
          "
          [muted]="true"
          autoplay
          playsinline
          loop
          preload="metadata"
          (loadeddata)="onReady()"
          aria-hidden="true"
        >
          <source
            [src]="mobile() ? '/assets/video/hero/mobile.webm' : '/assets/video/hero/desktop.webm'"
            type="video/webm"
          />
          <source
            [src]="mobile() ? '/assets/video/hero/mobile.mp4' : '/assets/video/hero/desktop.mp4'"
            type="video/mp4"
          />
        </video>
      }
      <div class="hero-shade"></div>
      <div class="hero-caption">
        <span>Civil engineering & formwork in motion</span><span>Saudi Master × ULMA</span>
      </div>
      @if (playVideo()) {
        <button
          type="button"
          class="video-control"
          (click)="toggleVideo()"
          [attr.aria-label]="paused() ? 'Play background video' : 'Pause background video'"
        >
          {{ paused() ? 'Play' : 'Pause' }}
          <span aria-hidden="true">{{ paused() ? '▷' : 'Ⅱ' }}</span>
        </button>
      }
    </section>
    <section class="hero-statement shell">
      <p class="eyebrow">{{ copy.kicker }}</p>
      <h1>{{ copy.title }}</h1>
      <p class="lead">{{ copy.description }}</p>
      <div class="actions">
        <a routerLink="/products" class="button">Explore systems →</a
        ><a routerLink="/contact" class="button secondary">Talk to an engineer ↗</a>
      </div>
    </section>`,
  styles: `
    .hero {
      position: relative;
      width: 100%;
      height: 92svh;
      max-height: 1100px;
      min-height: 480px;
      background: #524b40;
      overflow: hidden;
    }
    .hero-poster,
    .hero-video,
    .hero-shade {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .hero-video {
      opacity: 0;
      transition: opacity 0.65s ease;
    }
    .hero-video.ready {
      opacity: 1;
    }
    .hero-shade {
      background: linear-gradient(transparent 65%, #18181b99);
    }
    .hero-caption {
      position: absolute;
      bottom: 32px;
      left: 32px;
      right: 110px;
      color: white;
      display: flex;
      justify-content: space-between;
      gap: 20px;
      font: 600 10px var(--display);
      text-transform: uppercase;
      letter-spacing: 0.13em;
    }
    .video-control {
      position: absolute;
      bottom: 22px;
      right: 24px;
      background: #18181bd9;
      border: 1px solid #fff6;
      color: #fff;
      border-radius: 5px;
      min-height: 44px;
      padding: 8px 14px;
    }
    .hero-statement {
      padding-top: 70px;
      padding-bottom: 70px;
    }
    .hero-statement h1 {
      font-size: clamp(36px, 5.5vw, 76px);
      max-width: 1150px;
      line-height: 1.04;
      letter-spacing: -0.045em;
      margin: 20px 0;
      text-transform: uppercase;
    }
    .lead {
      max-width: 780px;
    }
    .hero-statement .actions {
      margin-top: 30px;
    }
    @media (max-width: 600px) {
      .hero {
        height: 76svh;
        min-height: 400px;
      }
      .hero-caption {
        left: 20px;
        bottom: 28px;
        flex-direction: column;
        gap: 6px;
      }
      .hero-statement {
        padding-top: 48px;
        padding-bottom: 48px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .hero-video {
        transition: none;
      }
    }
  `,
})
export class HeroComponent {
  readonly copy = HOME;
  readonly playVideo = signal(false);
  readonly mobile = signal(false);
  readonly ready = signal(false);
  readonly paused = signal(false);
  private readonly inView = signal(true);
  private readonly video = viewChild<ElementRef<HTMLVideoElement>>('video');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroy = inject(DestroyRef);
  constructor() {
    afterNextRender(() => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => {
        this.playVideo.set(!reduced.matches);
        this.ready.set(false);
      };
      this.mobile.set(matchMedia('(max-width: 767px)').matches);
      update();
      reduced.addEventListener('change', update);
      const observer = new IntersectionObserver(
        (entries) => {
          this.inView.set(entries[0]?.isIntersecting ?? false);
          const video = this.video()?.nativeElement;
          if (!video) return;
          if (entries[0]?.isIntersecting && !this.paused())
            video.play().catch(() => this.ready.set(false));
          else video.pause();
        },
        { threshold: 0.05 },
      );
      observer.observe(this.host.nativeElement);
      this.destroy.onDestroy(() => {
        observer.disconnect();
        reduced.removeEventListener('change', update);
      });
    });
  }
  onReady(): void {
    const video = this.video()?.nativeElement;
    if (!video) return;
    video.muted = true;
    this.ready.set(true);
    if (!this.paused() && this.inView()) video.play().catch(() => this.paused.set(true));
  }
  toggleVideo(): void {
    const video = this.video()?.nativeElement;
    if (!video) return;
    this.paused.update((p) => !p);
    if (this.paused()) video.pause();
    else video.play().catch(() => this.paused.set(true));
  }
}
