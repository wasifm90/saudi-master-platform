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
import { HOME } from '../../data/catalog';
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
  template: `<sm-hero /><sm-systems /><sm-geometry /><sm-assembly /><sm-services /><sm-manufacturing /><sm-projects />
    <section class="section shell closing-cta">
      <p class="eyebrow">Engineering consultation</p>
      <h2>Bring us the structure.<br />We'll engineer the system.</h2>
      <a routerLink="/contact" class="button">Start a project →</a>
    </section>`,
})
export class HomeComponent {
  constructor() {
    inject(SeoService).set('Formwork & scaffolding', HOME.description, '/');
  }
}
