import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
@Component({
  selector: 'sm-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `<a class="skip-link" href="#main">Skip to content</a><sm-header />
    <main id="main" tabindex="-1"><router-outlet /></main>
    <sm-footer />`,
})
export class AppComponent {}
