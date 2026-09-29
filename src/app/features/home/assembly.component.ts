import { Component, inject, viewChild } from '@angular/core';
import { ContentRepository } from '../../core/services/content.repository';
import { ImageComponent } from '../../shared/image.component';
import { ScrollStackComponent } from '../../shared/scroll-stack.component';
import { HOME } from '../../data/catalog';

@Component({
  selector: 'sm-assembly',
  imports: [ImageComponent, ScrollStackComponent],
  template: ` <section class="assembly" id="assembly" aria-labelledby="assembly-title">
    <sm-scroll-stack mode="overlay" [count]="steps.length">
      <div class="assembly-stage">
        <div class="assembly-head shell">
          <p class="eyebrow">Systems in motion</p>
          <h2 id="assembly-title">{{ copy.assembly }}</h2>
          <p>Follow the build from base alignment to protected access.</p>
          <div class="assembly-progress" aria-label="Assembly progress">
            <span>{{ ((rail()?.activeIndex() ?? 0) + 1).toString().padStart(2, '0') }}</span
            ><span class="progress-line"
              ><span
                [style.width.%]="(((rail()?.activeIndex() ?? 0) + 1) / steps.length) * 100"
              ></span></span
            ><span>{{ steps.length.toString().padStart(2, '0') }}</span>
          </div>
          <span class="assembly-cue"
            ><span>Scroll down to unveil each stage ↓</span
            ><span>Swipe through the build →</span></span
          >
        </div>
        <div class="assembly-viewport" data-stack-stage>
          <div
            class="assembly-track"
            data-mobile-track
            role="region"
            tabindex="0"
            aria-label="Structural assembly stages; vertical scroll advances panels on desktop, swipe on mobile"
          >
            @for (step of steps; track step.id; let index = $index) {
              <article
                class="assembly-panel"
                data-stack-panel
                [style.z-index]="index + 1"
                [class.reverse]="index % 2 === 1"
                [attr.data-step]="step.id"
              >
                <div class="assembly-image">
                  <sm-image
                    [src]="step.image"
                    [alt]="step.title"
                    sizes="(min-width: 851px) 55vw, 85vw"
                  /><span>Step {{ step.id }} / {{ steps.length }}</span>
                </div>
                <div class="assembly-detail">
                  <p class="eyebrow">
                    ULMA BRIO / Cuplock · Stage {{ (index + 1).toString().padStart(2, '0') }}
                  </p>
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
      </div>
    </sm-scroll-stack>
  </section>`,
  styles: `
    .assembly {
      background: linear-gradient(145deg, #f6f8fa, #fff5e9 72%);
      border-block: 1px solid var(--line);
    }
    .assembly-stage {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .assembly-head {
      flex: none;
      padding-top: clamp(18px, 2.5vh, 30px);
    }
    .assembly-head h2 {
      margin: 6px 0;
      font: 700 clamp(32px, 3vw, 50px) / 1.05 var(--display);
      text-transform: uppercase;
    }
    .assembly-head > p:not(.eyebrow) {
      margin: 8px 0;
      color: var(--muted);
      font-size: 14px;
    }
    .assembly-progress {
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 500px;
      margin: 18px 0 8px;
      color: #9c4e27;
      font: 700 12px var(--display);
    }
    .progress-line {
      flex: 1;
      height: 3px;
      overflow: hidden;
      border-radius: 99px;
      background: #e6d7c7;
    }
    .progress-line span {
      display: block;
      height: 100%;
      background: #ae5a27;
      transition: width 0.25s ease;
    }
    .assembly-cue {
      display: block;
      margin-bottom: 10px;
      color: #a8471f;
      font: 700 10px var(--display);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .assembly-cue span:nth-child(2) {
      display: none;
    }
    .assembly-viewport {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    .assembly-track {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .assembly-panel {
      position: absolute;
      inset: 0 auto 0 3%;
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
      gap: clamp(22px, 3vw, 48px);
      align-items: stretch;
      width: 94%;
      height: 100%;
      padding: 12px clamp(24px, 4vw, 68px) 24px;
      overflow: hidden;
      border: 1px solid #d8d9d9;
      border-radius: 27px;
      background: #fffaf4;
      box-shadow: 0 18px 42px #26354324;
      transform-origin: center center;
    }
    .assembly-panel.reverse {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    }
    .assembly-panel.reverse .assembly-image {
      order: 2;
    }
    .assembly-image {
      position: relative;
      min-height: 0;
      overflow: hidden;
      border-radius: 25px;
      box-shadow: 0 18px 40px #26354326;
    }
    .assembly-image sm-image {
      height: 100%;
      aspect-ratio: auto;
    }
    .assembly-image > span {
      position: absolute;
      top: 20px;
      left: 20px;
      padding: 10px 14px;
      border-radius: 999px;
      background: #172838e8;
      color: #fff;
      font: 700 11px var(--display);
      text-transform: uppercase;
    }
    .assembly-detail {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
      padding: 14px 0;
    }
    .assembly-detail h3 {
      margin: 12px 0 18px;
      font: 700 clamp(38px, 4.3vw, 68px) / 1.04 var(--display);
      text-transform: uppercase;
      letter-spacing: -0.03em;
    }
    .assembly-detail > p:not(.eyebrow) {
      max-width: 550px;
      color: #52606c;
      font-size: clamp(14px, 1.2vw, 17px);
      line-height: 1.7;
    }
    .assembly-detail video {
      max-width: 100%;
      max-height: 150px;
      margin-top: 12px;
      border-radius: 10px;
    }
    .spec-grid {
      margin-top: 26px;
    }
    @media (max-height: 700px) and (min-width: 851px) {
      .assembly-head {
        padding-top: 10px;
      }
      .assembly-progress {
        margin-top: 8px;
      }
      .assembly-panel {
        padding-block: 6px 12px;
      }
      .assembly-detail h3 {
        font-size: clamp(31px, 3.3vw, 50px);
        margin-block: 8px;
      }
      .spec-grid {
        margin-top: 10px;
      }
    }
    @media (max-width: 850px) {
      .assembly-stage {
        height: auto;
        padding: 28px 0 38px;
      }
      .assembly-head {
        width: min(100% - 36px, 1216px);
        padding-top: 0;
      }
      .assembly-head h2 {
        font-size: clamp(29px, 7vw, 42px);
      }
      .assembly-cue span:first-child {
        display: none;
      }
      .assembly-cue span:nth-child(2) {
        display: inline;
      }
      .assembly-viewport {
        overflow: visible;
      }
      .assembly-track {
        display: flex;
        width: 100%;
        height: auto;
        gap: 14px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        overscroll-behavior-inline: contain;
        padding: 0 7vw 16px 3vw;
        scrollbar-color: #ae612c #eadfce;
      }
      .assembly-panel,
      .assembly-panel.reverse {
        position: relative;
        inset: auto;
        flex: 0 0 min(84vw, 590px);
        display: block;
        width: auto;
        height: auto;
        padding: 12px;
        border: 1px solid #dfcbb7;
        border-radius: 25px;
        background: white;
        scroll-snap-align: start;
      }
      .assembly-panel.reverse .assembly-image {
        order: unset;
      }
      .assembly-image sm-image {
        aspect-ratio: 4/3;
        height: auto;
      }
      .assembly-detail {
        padding: 22px 8px 8px;
      }
      .assembly-detail h3 {
        font-size: clamp(29px, 6vw, 42px);
      }
      .assembly-detail > p:not(.eyebrow) {
        font-size: 13px;
      }
      .spec-grid {
        margin-top: 18px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .progress-line span {
        transition: none;
      }
    }
  `,
})
export class AssemblyComponent {
  readonly copy = HOME;
  readonly steps = inject(ContentRepository).assembly;
  readonly rail = viewChild(ScrollStackComponent);
}
