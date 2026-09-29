import { inject, Injectable } from '@angular/core';
import { SiteContentStore } from './site-content.store';
@Injectable({ providedIn: 'root' })
export class ContentRepository {
  private readonly store = inject(SiteContentStore);
  get company() {
    return this.store.content().company;
  }
  get geometries() {
    return this.store.content().geometries;
  }
  get assembly() {
    return this.store.content().assembly;
  }
  get projects() {
    return this.store.content().projects;
  }
  get services() {
    return this.store.content().services;
  }
  get processes() {
    return this.store.content().processes;
  }
  get industries() {
    return this.store.content().industries;
  }
  get articles() {
    return this.store.content().articles;
  }
  get jobs() {
    return this.store.content().jobs;
  }
  get pages() {
    return this.store.content().pages;
  }
  get collectionCopy() {
    return this.store.content().collectionCopy;
  }
  get navigation() {
    return this.store.content().navigation;
  }
  get home() {
    return this.store.content().home;
  }
  get media() {
    return this.store.content().media;
  }
  get labels() {
    return this.store.content().labels;
  }
  get visibility() {
    return this.store.content().visibility;
  }
}
