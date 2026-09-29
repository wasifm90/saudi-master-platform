import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentRepository } from '../core/services/content.repository';
@Component({
  selector: 'sm-footer',
  imports: [RouterLink],
  template: ` <footer>
    <div class="shell footer-grid">
      <div>
        <a routerLink="/" class="footer-brand">Saudi Master <span>× ULMA</span></a>
        <p>{{ company.description }}</p>
      </div>
      <div>
        <h2>Engineering enquiries</h2>
        <a [href]="'tel:' + company.phone">{{ company.phone }}</a
        ><a [href]="'mailto:' + company.email">{{ company.email }}</a>
        <p>{{ company.address }}</p>
      </div>
      <nav aria-label="Footer">
        <a routerLink="/insights">Insights</a><a routerLink="/privacy">Privacy</a
        ><a routerLink="/terms">Terms</a><a routerLink="/contact">Start a project ↗</a>
      </nav>
    </div>
    <div class="shell footer-bottom">
      © {{ year }} {{ company.name }}. <span>Local manufacturing. European engineering.</span>
    </div>
  </footer>`,
  styles: `
    footer {
      background: var(--ink);
      color: #faf8f5;
      padding: 64px 0 28px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 0.7fr;
      gap: 64px;
    }
    .footer-brand {
      font: 700 24px var(--display);
      text-decoration: none;
      text-transform: uppercase;
    }
    .footer-brand span {
      color: var(--gold);
    }
    p {
      color: #d5cec3;
      max-width: 420px;
      font-size: 14px;
      line-height: 1.7;
    }
    h2 {
      font: 600 12px var(--display);
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    nav,
    a {
      color: inherit;
    }
    .footer-grid > div > a:not(.footer-brand),
    nav a {
      display: flex;
      align-items: center;
      min-height: 44px;
      margin: 0;
      padding: 8px 0;
      font-size: 14px;
    }
    .footer-bottom {
      border-top: 1px solid #4c4944;
      margin-top: 36px;
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #d5cec3;
    }
    @media (max-width: 760px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      .footer-bottom {
        gap: 24px;
        flex-wrap: wrap;
      }
    }
  `,
})
export class FooterComponent {
  readonly company = inject(ContentRepository).company;
  readonly year = new Date().getFullYear();
}
