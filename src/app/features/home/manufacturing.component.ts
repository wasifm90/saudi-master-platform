import { Component, inject } from '@angular/core';
import { ContentRepository } from '../../core/services/content.repository';
import { ImageComponent } from '../../shared/image.component';
@Component({
  selector: 'sm-manufacturing',
  imports: [ImageComponent],
  template: `<section class="section manufacturing">
    <div class="shell">
      <p class="eyebrow">{{ labels.manufacturingEyebrow }}</p>
      <h2>{{ copy.manufacturing }}</h2>
      <div class="processes">
        @for (process of processes; track process.id; let index = $index) {
          <article>
            <sm-image
              [src]="process.image"
              [alt]="process.name"
              sizes="(min-width: 900px) 30vw, (min-width: 600px) 50vw, 100vw"
            />
            <p class="eyebrow">Step 0{{ index + 1 }}</p>
            <h3>{{ process.name }}</h3>
            <p>{{ process.description }}</p>
          </article>
        }
      </div>
    </div>
  </section>`,
  styles: `
    .manufacturing {
      border-top: 1px solid var(--line);
    }
    .processes {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 30px;
      margin-top: 32px;
    }
    sm-image {
      aspect-ratio: 16/10;
      border-radius: 8px;
    }
    h3 {
      font: 700 18px var(--display);
      text-transform: uppercase;
    }
    article > p:last-child {
      font-size: 12px;
      line-height: 1.7;
      color: var(--muted);
    }
    article .eyebrow {
      margin-top: 20px;
    }
    @media (max-width: 900px) {
      .processes {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 580px) {
      .processes {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ManufacturingComponent {
  private readonly content = inject(ContentRepository);
  get copy() {
    return this.content.home;
  }
  get labels() {
    return this.content.labels;
  }
  get processes() {
    return this.content.processes;
  }
}
