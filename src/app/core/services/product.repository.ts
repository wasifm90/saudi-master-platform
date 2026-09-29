import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Product } from '../models/content';
import { SiteContentStore } from './site-content.store';

/** Swap this provider for an HTTP-backed repository; components keep the same contract. */
export abstract class ProductRepository {
  abstract readonly products: Signal<readonly Product[]>;
  abstract readonly loading: ReturnType<typeof signal<boolean>>;
  abstract readonly error: ReturnType<typeof signal<string | null>>;
}
@Injectable({ providedIn: 'root' })
export class StaticProductRepository extends ProductRepository {
  private readonly store = inject(SiteContentStore);
  readonly products = computed<readonly Product[]>(() => this.store.content().products);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
