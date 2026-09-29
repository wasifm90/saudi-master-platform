import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentRepository } from '../../core/services/content.repository';
import { SeoService } from '../../core/services/seo.service';
import { EditorialItem } from '../../core/models/content';
import { resolveSlug } from '../../core/services/interaction-state';
import { ImageComponent } from '../../shared/image.component';
@Component({
  selector: 'sm-content-page',
  imports: [RouterLink, ImageComponent],
  template: ` <section class="section shell content-page">
    @if (detail(); as item) {
      <a [routerLink]="['/', kind()]" class="text-link">← All {{ kind() }}</a>
      <div class="page-intro">
        <p class="eyebrow">{{ kind() }}</p>
        <h1>{{ item.name }}</h1>
        <p class="lead">{{ item.description }}</p>
      </div>
      <sm-image
        class="editorial-hero"
        [src]="item.image"
        [alt]="item.name"
        [priority]="true"
        sizes="100vw"
      />
      <div class="prose">
        @for (paragraph of item.body; track $index) {
          <p>{{ paragraph }}</p>
        }
        <a routerLink="/contact" class="button">Discuss your project →</a>
      </div>
    } @else if (isCollection()) {
      <div class="page-intro">
        <p class="eyebrow">Saudi Master × ULMA</p>
        <h1>{{ collectionCopy().title }}</h1>
        <p class="lead">{{ collectionCopy().description }}</p>
      </div>
      <div class="editorial-list">
        @for (item of items(); track item.slug) {
          <article>
            <a [routerLink]="['/', kind(), item.slug]"
              ><sm-image
                [src]="item.image"
                [alt]="item.name"
                sizes="(min-width:800px) 50vw, 100vw"
              />
              <h2>{{ item.name }} ↗</h2></a
            >
            <p>{{ item.description }}</p>
          </article>
        } @empty {
          <p>{{ collectionCopy().empty }}</p>
        }
      </div>
    } @else {
      <div class="page-intro">
        <p class="eyebrow">{{ page().kicker }}</p>
        <h1>{{ page().title }}</h1>
        <p class="lead">{{ page().description }}</p>
      </div>
      @if (page().image; as image) {
        <sm-image
          class="editorial-hero"
          [src]="image"
          [alt]="page().title"
          [priority]="true"
          sizes="100vw"
        />
      }
      <div class="prose">
        @for (paragraph of page().body; track $index) {
          <p>{{ paragraph }}</p>
        }
        <div class="actions">
          <a routerLink="/" class="button secondary">Home</a
          ><a routerLink="/contact" class="button">Contact the team →</a>
        </div>
      </div>
    }
  </section>`,
  styles: `
    .editorial-hero {
      aspect-ratio: 16/8;
      border-radius: 12px;
    }
    .prose {
      max-width: 800px;
      padding: 40px 0;
      font-size: 18px;
      line-height: 1.9;
      color: var(--muted);
    }
    .prose .actions {
      margin-top: 32px;
    }
    .editorial-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .editorial-list article {
      overflow: hidden;
      padding: 18px;
      border: 1px solid var(--line);
      border-radius: 22px;
      background: #fff;
      box-shadow: 0 12px 30px #394a5b12;
      transition:
        transform 0.3s,
        box-shadow 0.3s;
    }
    .editorial-list article:hover,
    .editorial-list article:focus-within {
      transform: translateY(-5px);
      box-shadow: 0 20px 42px #394a5b24;
    }
    .editorial-list a {
      text-decoration: none;
    }
    .editorial-list sm-image {
      aspect-ratio: 16/10;
      border-radius: 16px;
    }
    .editorial-list h2 {
      font-size: 26px;
      margin-top: 22px;
    }
    .editorial-list p {
      font-size: 14px;
      line-height: 1.8;
      color: var(--muted);
    }
    @media (prefers-reduced-motion: reduce) {
      .editorial-list article {
        transition: none;
      }
      .editorial-list article:hover,
      .editorial-list article:focus-within {
        transform: none;
      }
    }
    @media (max-width: 700px) {
      .editorial-list {
        grid-template-columns: 1fr;
      }
      .editorial-hero {
        aspect-ratio: 4/3;
      }
    }
  `,
})
export class ContentPageComponent {
  private readonly repository = inject(ContentRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly data = toSignal(this.route.data);
  private readonly params = toSignal(this.route.paramMap);
  readonly kind = computed(() => String(this.data()?.['kind'] ?? 'not-found'));
  readonly items = computed<readonly EditorialItem[]>(() => {
    switch (this.kind()) {
      case 'projects':
        return this.repository.projects;
      case 'services':
        return this.repository.services;
      case 'industries':
        return this.repository.industries;
      case 'insights':
        return this.repository.articles;
      default:
        return [];
    }
  });
  readonly detail = computed(() => resolveSlug(this.items(), this.params()?.get('slug') ?? ''));
  readonly isCollection = computed(
    () => !!this.repository.collectionCopy[this.kind()] && !this.params()?.has('slug'),
  );
  readonly collectionCopy = computed(
    () =>
      this.repository.collectionCopy[this.kind()] ?? this.repository.collectionCopy['insights']!,
  );
  readonly page = computed(() =>
    this.params()?.has('slug')
      ? this.repository.pages['not-found']!
      : (this.repository.pages[this.kind()] ?? this.repository.pages['not-found']!),
  );
  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const detail = this.detail();
      const collection = this.isCollection();
      const page = this.page();
      seo.set(
        detail?.name ?? (collection ? this.collectionCopy().title : page.title),
        detail?.description ?? (collection ? this.collectionCopy().description : page.description),
        '/' + this.kind() + (this.params()?.get('slug') ? '/' + this.params()?.get('slug') : ''),
        detail?.image ?? page.image,
        !detail && !collection && !!page.noindex,
      );
    });
  }
}
