import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroComponent } from './hero.component';
import { SystemsComponent } from '../products/systems.component';
import { GeometryComponent } from './geometry.component';
import { AssemblyComponent } from './assembly.component';
import { ServicesComponent } from './services.component';
import { ManufacturingComponent } from './manufacturing.component';
import { ProjectsComponent } from './projects.component';
import { SeoService } from '../../core/services/seo.service';
import { ContentRepository } from '../../core/services/content.repository';
@Component({
  selector: 'sm-home',
  imports: [
    RouterLink,
    HeroComponent,
    SystemsComponent,
    GeometryComponent,
    AssemblyComponent,
    ServicesComponent,
    ManufacturingComponent,
    ProjectsComponent,
  ],
  template: `@if (visibility.hero) {
      <sm-hero />
    }
    @if (visibility.systems) {
      <sm-systems />
    }
    @if (visibility.geometry) {
      <sm-geometry />
    }
    @if (visibility.assembly) {
      <sm-assembly />
    }
    @if (visibility.services) {
      <sm-services />
    }
    @if (visibility.manufacturing) {
      <sm-manufacturing />
    }
    @if (visibility.projects) {
      <sm-projects />
    }
    @if (visibility.closing) {
      <section class="section shell closing-cta">
        <p class="eyebrow">{{ labels.homeClosingKicker }}</p>
        <h2>{{ labels.homeClosingTitle }}</h2>
        <a routerLink="/contact" class="button">{{ labels.homeClosingCta }} →</a>
      </section>
    }`,
})
export class HomeComponent {
  private readonly content = inject(ContentRepository);
  get labels() {
    return this.content.labels;
  }
  get visibility() {
    return this.content.visibility;
  }
  constructor() {
    inject(SeoService).set('Formwork & scaffolding', this.content.home.description, '/');
  }
}
