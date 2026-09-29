import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../core/models/content';
import { ImageComponent } from './image.component';

@Component({
  selector: 'sm-product-card',
  imports: [RouterLink, ImageComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly index = input<number | null>(null);
  readonly total = input<number | null>(null);
  readonly featured = input(false);
}
