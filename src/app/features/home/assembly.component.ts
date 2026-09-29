import { Component, inject } from '@angular/core';
import { ContentRepository } from '../../core/services/content.repository';
import { AssemblyState } from '../../core/services/interaction-state';
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
        <span class="counter" role="status"
          >{{ state.index() + 1 }} / {{ state.steps.length }}</span
        >
      </div>
      @if (state.active(); as step) {
        <div class="assembly-content" [attr.data-step]="step.id">
          <div class="assembly-image">
            <sm-image [src]="step.image" [alt]="step.title" /><span
              >Step {{ step.id }} · Erection phase</span
            >
          </div>
          <div>
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
        </div>
      }
      <div class="section-controls">
        <button type="button" (click)="state.previous()" [disabled]="state.first()">
          ← Previous
        </button>
        <div class="step-dots" aria-label="Assembly steps">
          @for (step of state.steps; track step.id; let index = $index) {
            <button
              type="button"
              [class.active]="state.index() === index"
              (click)="state.select(index)"
              [attr.aria-label]="'Go to step ' + step.id + ': ' + step.title"
              [attr.aria-current]="state.index() === index ? 'step' : null"
            >
              <span></span>
            </button>
          }
        </div>
        <button type="button" (click)="state.next()" [disabled]="state.last()">Next phase →</button>
      </div>
    </div>
  </section>`,
  styles: `
    .assembly {
      background: var(--paper);
    }
    .counter {
      font: 600 14px monospace;
    }
    .assembly-content {
      background: white;
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 28px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 40px;
      align-items: center;
    }
    .assembly-image {
      position: relative;
      overflow: hidden;
      border-radius: 12px;
    }
    .assembly-image sm-image {
      aspect-ratio: 4/3;
    }
    .assembly-image > span {
      position: absolute;
      bottom: 16px;
      left: 16px;
      background: var(--ink);
      color: white;
      padding: 9px 12px;
      border-radius: 4px;
      font: 600 11px var(--display);
    }
    h3 {
      font: 700 clamp(25px, 3vw, 40px) / 1.08 var(--display);
      text-transform: uppercase;
      margin: 14px 0;
    }
    p {
      font-size: 15px;
      line-height: 1.8;
      color: var(--muted);
    }
    .step-dots {
      display: flex;
    }
    .step-dots button {
      min-width: 44px;
      padding: 0;
      border: 0;
      background: transparent;
    }
    .step-dots span {
      display: block;
      width: 9px;
      height: 9px;
      background: var(--line);
      border-radius: 8px;
      margin: auto;
    }
    .step-dots .active span {
      width: 24px;
      background: #9b7720;
    }
    @media (max-width: 850px) {
      .assembly-content {
        grid-template-columns: 1fr;
        padding: 16px;
        gap: 24px;
      }
    }
    @media (max-width: 600px) {
      .step-dots {
        order: 3;
        width: 100%;
        justify-content: center;
      }
      .step-dots button {
        min-width: 44px;
      }
      .assembly-content p {
        font-size: 13px;
      }
    }
  `,
})
export class AssemblyComponent {
  readonly copy = HOME;
  readonly state = new AssemblyState(inject(ContentRepository).assembly);
}
