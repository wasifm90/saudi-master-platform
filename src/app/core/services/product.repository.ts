import { Injectable, signal } from '@angular/core';
import { Product } from '../models/content';
import { PRODUCTS } from '../../data/catalog';

/** Swap this provider for an HTTP-backed repository; components keep the same contract. */
export abstract class ProductRepository {
  abstract readonly products: ReturnType<typeof signal<readonly Product[]>>;
  abstract readonly loading: ReturnType<typeof signal<boolean>>;
  abstract readonly error: ReturnType<typeof signal<string | null>>;
}
@Injectable({ providedIn: 'root' })
export class StaticProductRepository extends ProductRepository {
  readonly products = signal<readonly Product[]>(PRODUCTS);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
