import { Component, inject } from '@angular/core';
import { ContentRepository } from '../../core/services/content.repository';
import { ImageComponent } from '../../shared/image.component';
import { HOME } from '../../data/catalog';

@Component({
  selector: 'sm-assembly',
  imports: [ImageComponent],
  template: ` <section class="section assembly" id="assembly" aria-labelledby="assembly-title">
    <div class="shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Systems in motion</p>
          <h2 id="assembly-title">{{ copy.assembly }}</h2>
        </div>
        <span class="assembly-cue"
          ><span class="desktop-cue">Scroll through the build ↓</span
          ><span class="mobile-cue">Swipe through the build →</span></span
        >
      </div>
      <div
        class="assembly-track"
        role="region"
        tabindex="0"
        aria-label="Structural assembly steps; swipe horizontally on mobile"
      >
        @for (step of steps; track step.id; let index = $index) {
          <article class="assembly-content" [attr.data-step]="step.id">
            <div class="assembly-image">
              <sm-image
                [src]="step.image"
                [alt]="step.title"
                sizes="(min-width: 851px) 48vw, 85vw"
              /><span>Step {{ step.id }} · Erection phase</span>
            </div>
            <div class="assembly-detail">
              <div class="assembly-progress" aria-hidden="true">
                <span>{{ (index + 1).toString().padStart(2, '0') }}</span
                ><span class="assembly-progress__line"></span
                ><span>{{ steps.length.toString().padStart(2, '0') }}</span>
              </div>
              <p class="eyebrow">ULMA BRIO / Cuplock</p>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
              @if (step.video) {
                <video
                  [src]="step.video"
                  controls
                  preload="none"
                  [attr.aria-label]="step.title"
                ></video>
              }
              <dl class="spec-grid">
                @for (spec of step.technicalFeatures; track spec.label) {
                  <div>
                    <dt>{{ spec.label }}</dt>
                    <dd>{{ spec.value }}</dd>
                  </div>
                }
              </dl>
            </div>
          </article>
        }
      </div>
    </div>
  </section>`,
  styles: `
    .assembly {
      background: linear-gradient(145deg, #f6f8fa, #fff5e9 72%);
    }
    .section-heading {
      align-items: end;
    }
    .assembly-cue {
      color: #a8471f;
      font: 700 10px var(--display);
      text-transform: uppercase;
      letter-spacing: 0.13em;
      white-space: nowrap;
    }
    .mobile-cue {
      display: none;
    }
    .assembly-track {
      display: grid;
      gap: 36px;
      outline-offset: 5px;
    }
    .assembly-content {
      min-height: min(78svh, 760px);
      scroll-margin-top: 110px;
      background: #fff;
      border: 1px solid #dfd7ce;
      border-radius: 27px;
      padding: clamp(16px, 3vw, 30px);
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: clamp(20px, 4vw, 54px);
      align-items: center;
      box-shadow: 0 18px 42px #3d4c5e12;
    }
    .assembly-image {
      position: relative;
      overflow: hidden;
      border-radius: 19px;
    }
    .assembly-image sm-image {
      aspect-ratio: 4/3;
    }
    .assembly-image > span {
      position: absolute;
      bottom: 16px;
      left: 16px;
      background: #172838e8;
      color: white;
      padding: 9px 12px;
      border-radius: 999px;
      font: 700 10px var(--display);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }
    .assembly-progress {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 22px;
      color: #9c4e27;
      font: 700 13px var(--display);
    }
    .assembly-progress__line {
      display: block;
      width: 90px;
      height: 2px;
      background: linear-gradient(90deg, #bd642b, #e7d7c4);
    }
    h3 {
      font: 700 clamp(25px, 3vw, 40px) / 1.08 var(--display);
      text-transform: uppercase;
      margin: 14px 0;
    }
    .assembly-detail > p:not(.eyebrow) {
      font-size: 15px;
      line-height: 1.8;
      color: var(--muted);
    }
    video {
      display: block;
      max-width: 100%;
      margin: 18px 0;
      border-radius: 12px;
    }
    @supports (animation-timeline: view()) {
      .assembly-content {
        animation: assembly-enter linear both;
        animation-timeline: view();
        animation-range: entry 0% entry 32%;
      }
    }
    @keyframes assembly-enter {
      from {
        opacity: 0.5;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (max-width: 850px) {
      .section-heading {
        display: block;
      }
      .assembly-cue {
        display: block;
        margin: 15px 0 22px;
      }
      .desktop-cue {
        display: none;
      }
      .mobile-cue {
        display: inline;
      }
      .assembly-track {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        overscroll-behavior-inline: contain;
        gap: 14px;
        padding: 0 25px 20px 0;
        scrollbar-color: #ae612c #eadfce;
      }
      .assembly-content {
        flex: 0 0 min(82vw, 590px);
        display: block;
        min-height: 0;
        scroll-snap-align: start;
      }
      .assembly-image sm-image {
        aspect-ratio: 4/3;
      }
      .assembly-detail {
        padding: 18px 3px 6px;
      }
      .assembly-detail > p:not(.eyebrow) {
        font-size: 13px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .assembly-content {
        animation: none;
      }
    }
  `,
})
export class AssemblyComponent {
  readonly copy = HOME;
  readonly steps = inject(ContentRepository).assembly;
}
