import { Component, input } from '@angular/core';
import { IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'sm-image',
  imports: [NgOptimizedImage],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) =>
        config.width ? config.src.replace(/\.webp$/, `-${config.width}.webp`) : config.src,
    },
  ],
  template: `<img
    [ngSrc]="webp()"
    [alt]="alt()"
    fill
    [priority]="priority()"
    [sizes]="sizes()"
    ngSrcset="480w, 960w, 1600w"
  />`,
  styles: `
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      aspect-ratio: 4/3;
      background: #e8dfd1;
    }
    img {
      object-fit: cover;
    }
  `,
})
export class ImageComponent {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly priority = input(false);
  readonly sizes = input('(min-width: 1024px) 55vw, 100vw');
  webp(): string {
    return this.src().replace(/\.jpg$/, '.webp');
  }
}
