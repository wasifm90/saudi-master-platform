import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentRepository } from '../../core/services/content.repository';
import { AccordionState } from '../../core/services/interaction-state';
import { ImageComponent } from '../../shared/image.component';
@Component({
  selector: 'sm-services',
  imports: [RouterLink, ImageComponent],
  template: ` <section class="section" aria-labelledby="services-title">
    <div class="shell">
      <p class="eyebrow">{{ labels.servicesEyebrow }}</p>
      <h2 id="services-title">{{ copy.services }}</h2>
      <div class="service-list">
        @for (service of services; track service.id; let index = $index) {
          <article>
            <h3>
              <button
                type="button"
                (click)="state.toggle(service.id)"
                [attr.aria-expanded]="state.activeId() === service.id"
                [attr.aria-controls]="'service-panel-' + service.id"
                [id]="'service-button-' + service.id"
              >
                <span class="service-number">0{{ index + 1 }}</span
                >{{ service.name
                }}<span class="service-sign" aria-hidden="true">{{
                  state.activeId() === service.id ? '−' : '+'
                }}</span>
              </button>
            </h3>
            <div
              [id]="'service-panel-' + service.id"
              [hidden]="state.activeId() !== service.id"
              role="region"
              [attr.aria-labelledby]="'service-button-' + service.id"
            >
              <div class="service-body">
                <sm-image
                  [src]="service.image"
                  [alt]="service.name"
                  sizes="(min-width: 800px) 40vw, 100vw"
                />
                <div>
                  <p>{{ service.description }}</p>
                  <a class="button" [routerLink]="['/services', service.slug]"
                    >{{ labels.servicesExplore }} →</a
                  >
                </div>
              </div>
            </div>
          </article>
        }
      </div>
    </div>
  </section>`,
  styles: `
    .service-list {
      margin-top: 36px;
      border-top: 1px solid var(--line);
    }
    article {
      border-bottom: 1px solid var(--line);
    }
    h3 {
      margin: 0;
    }
    h3 button {
      display: flex;
      align-items: center;
      gap: 24px;
      width: 100%;
      border: 0;
      background: transparent;
      text-align: left;
      padding: 26px 0;
      font: 600 clamp(18px, 2.5vw, 28px) var(--display);
      text-transform: uppercase;
    }
    .service-number {
      font: 500 12px monospace;
      color: var(--earth);
    }
    .service-sign {
      margin-left: auto;
      font-size: 28px;
    }
    .service-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      padding: 0 0 32px;
      align-items: center;
    }
    .service-body sm-image {
      border-radius: 10px;
      aspect-ratio: 16/9;
    }
    .service-body p {
      font-size: 17px;
      line-height: 1.8;
      color: var(--muted);
    }
    @media (max-width: 700px) {
      .service-body {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      h3 button {
        gap: 12px;
      }
    }
  `,
})
export class ServicesComponent {
  private readonly content = inject(ContentRepository);
  get copy() {
    return this.content.home;
  }
  get labels() {
    return this.content.labels;
  }
  get services() {
    return this.content.services;
  }
  readonly state = new AccordionState();
}
