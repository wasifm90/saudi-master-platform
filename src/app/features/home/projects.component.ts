import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentRepository } from '../../core/services/content.repository';
import { ImageComponent } from '../../shared/image.component';
import { HOME } from '../../data/catalog';
@Component({
  selector: 'sm-projects',
  imports: [RouterLink, ImageComponent],
  template: ` <section class="section projects">
    <div class="shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Kingdom projects</p>
          <h2>{{ copy.projects }}</h2>
        </div>
        <a routerLink="/projects" class="text-link">All projects ↗</a>
      </div>
      <div class="project-list">
        @for (project of projects; track project.id) {
          <article>
            <a [routerLink]="['/projects', project.slug]" class="project-visual"
              ><sm-image
                [src]="project.image"
                [alt]="project.name"
                sizes="(min-width: 900px) 50vw, 100vw"
              /><span>{{ project.industry }}</span></a
            >
            <p class="eyebrow">{{ project.location }}</p>
            <h3>
              <a [routerLink]="['/projects', project.slug]">{{ project.name }} ↗</a>
            </h3>
            <p>{{ project.description }}</p>
          </article>
        }
      </div>
    </div>
  </section>`,
  styles: `
    .projects {
      background: var(--sand);
    }
    .project-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px 32px;
    }
    .project-visual {
      position: relative;
      display: block;
      border-radius: 10px;
      overflow: hidden;
    }
    .project-visual sm-image {
      aspect-ratio: 16/10;
    }
    .project-visual span {
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: var(--ink);
      color: #fff;
      padding: 8px 12px;
      font: 600 10px var(--display);
      text-transform: uppercase;
    }
    article h3 {
      font: 600 25px/1.15 var(--display);
      text-transform: uppercase;
      margin: 12px 0;
    }
    article h3 a {
      text-decoration: none;
    }
    article > .eyebrow {
      font-size: 9px;
      margin-top: 22px;
    }
    article > p:last-child {
      font-size: 13px;
      line-height: 1.7;
      color: var(--muted);
    }
    @media (max-width: 700px) {
      .project-list {
        grid-template-columns: 1fr;
        gap: 28px;
      }
    }
  `,
})
export class ProjectsComponent {
  readonly copy = HOME;
  readonly projects = inject(ContentRepository).projects;
}
