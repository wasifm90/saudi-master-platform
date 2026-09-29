import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private canonical: HTMLLinkElement | undefined;
  set(
    title: string,
    description: string,
    path: string,
    image = '/assets/video/hero/poster.jpg',
    noindex = false,
  ): void {
    const fullTitle = `${title} | Saudi Master × ULMA`;
    const url = new URL(path, environment.siteUrl).href;
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: noindex ? 'noindex,follow' : 'index,follow' });
    for (const [property, content] of Object.entries({
      'og:title': fullTitle,
      'og:description': description,
      'og:url': url,
      'og:type': 'website',
      'og:image': new URL(image, environment.siteUrl).href,
    }))
      this.meta.updateTag({ property, content });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    if (!this.canonical) {
      // Head metadata is the sole intentional imperative DOM boundary.
      this.canonical = Array.from(this.document.head.getElementsByTagName('link')).find(
        (link) => link.rel === 'canonical',
      );
      if (!this.canonical) {
        this.canonical = this.document.createElement('link');
        this.canonical.rel = 'canonical';
        this.document.head.appendChild(this.canonical);
      }
    }
    this.canonical.href = url;
  }
}
