import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { ContentRepository } from './core/services/content.repository';
@Component({
  selector: 'sm-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `<a class="skip-link" href="#main">{{ labels.skipContent }}</a
    ><sm-header />
    <main id="main" tabindex="-1"><router-outlet /></main>
    <sm-footer />`,
})
export class AppComponent {
  private readonly content = inject(ContentRepository);
  get labels() {
    return this.content.labels;
  }
}
